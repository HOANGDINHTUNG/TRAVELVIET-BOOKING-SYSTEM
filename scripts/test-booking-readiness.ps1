# Smoke test booking readiness — public API + enrichment fields
# Run: powershell -File scripts/test-booking-readiness.ps1

$ErrorActionPreference = 'Continue'
$apiBase = if ($env:VITE_API_URL) { $env:VITE_API_URL.TrimEnd('/') } else { 'http://127.0.0.1:8088/api/v1' }
$tourId = if ($env:TEST_TOUR_ID) { [int]$env:TEST_TOUR_ID } else { 41 }
$dbHost = if ($env:DB_HOST) { $env:DB_HOST } else { '127.0.0.1' }
$dbPort = if ($env:DB_PORT) { $env:DB_PORT } else { '3307' }
$dbUser = if ($env:DB_USERNAME) { $env:DB_USERNAME } else { 'wed_app_user' }
$dbPass = if ($env:DB_PASSWORD) { $env:DB_PASSWORD } else { '123456' }
$dbName = 'wedservice'

function Test-Field($label, $ok) {
  $color = if ($ok) { 'Green' } else { 'Red' }
  Write-Host ("  [{0}] {1}" -f $(if ($ok) { 'OK' } else { 'FAIL' }), $label) -ForegroundColor $color
}

Write-Host ''
Write-Host "=== Booking readiness smoke (tour id=$tourId) ===" -ForegroundColor Cyan

Write-Host ''
Write-Host '--- 1) GET /tours/{id} enrichment ---' -ForegroundColor Yellow
try {
  $detail = Invoke-RestMethod -Uri "$apiBase/tours/$tourId" -Headers @{ 'Accept-Language' = 'vi' }
  $t = $detail.data
  Test-Field 'nextOpenSchedule.departureAt' ($null -ne $t.nextOpenSchedule.departureAt)
  Test-Field 'nextOpenSchedule.remainingSeats' ($null -ne $t.nextOpenSchedule.remainingSeats)
  Test-Field 'primaryDepartureCity' ([bool]$t.primaryDepartureCity)
  Test-Field 'inclusionFlags' ($null -ne $t.inclusionFlags)
  Test-Field 'departureHubs (>=1)' (@($t.departureHubs).Count -ge 1)
  Test-Field 'comboPackages' (@($t.comboPackages).Count -ge 0)
  Test-Field 'esgScore (DB)' ($null -ne $t.esgScore)
  Test-Field 'listPrice (DB)' ($null -ne $t.listPrice)
  Write-Host "  name=$($t.name) basePrice=$($t.basePrice) listPrice=$($t.listPrice)"
}
catch {
  Write-Host "  API error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ''
Write-Host '--- 2) GET /tours/{id}/schedules (pickup) ---' -ForegroundColor Yellow
try {
  $schedules = Invoke-RestMethod -Uri "$apiBase/tours/$tourId/schedules" -Headers @{ 'Accept-Language' = 'vi' }
  $open = @($schedules.data | Where-Object { $_.status -eq 'open' })
  $withPickup = @($open | Where-Object { @($_.pickupPoints).Count -gt 0 })
  Test-Field 'open schedules' ($open.Count -gt 0)
  Test-Field 'schedule with pickupPoints' ($withPickup.Count -gt 0)
  if ($open.Count -gt 0) {
    $s = $open[0]
    Write-Host "  sample schedule id=$($s.id) remaining=$($s.remainingSeats) pickups=$(@($s.pickupPoints).Count)"
  }
}
catch {
  Write-Host "  API error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ''
Write-Host '--- 3) GET /tours list enrichment (flash) ---' -ForegroundColor Yellow
try {
  $list = Invoke-RestMethod -Uri "$apiBase/tours?tagCodes=HOME_FLASH_SALE&size=6" -Headers @{ 'Accept-Language' = 'vi' }
  $first = $list.data.content | Select-Object -First 1
  if ($first) {
    Test-Field 'list nextOpenSchedule' ($null -ne $first.nextOpenSchedule)
    Test-Field 'list inclusionFlags' ($null -ne $first.inclusionFlags)
    Write-Host "  flash tours returned: $($list.data.content.Count)"
  } else {
    Write-Host '  WARN: no flash tours in list' -ForegroundColor Yellow
  }
}
catch {
  Write-Host "  API error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ''
Write-Host '--- 4) MySQL audit (active tours missing open schedule) ---' -ForegroundColor Yellow
$auditSql = @"
SELECT COUNT(*) AS missing_open_schedule
FROM tours t
WHERE t.deleted_at IS NULL AND t.status = 'active'
  AND NOT EXISTS (
    SELECT 1 FROM tour_schedules s
    WHERE s.tour_id = t.id AND s.deleted_at IS NULL AND s.status = 'open'
      AND s.departure_at > NOW() AND (s.capacity_total - s.booked_seats) > 0
  );
"@
& mysql -h $dbHost -P $dbPort -u $dbUser "-p$dbPass" $dbName -e $auditSql 2>$null

Write-Host ''
Write-Host 'Done. Quote/booking (POST) requires JWT — test via UI after login.' -ForegroundColor Cyan
Write-Host ''
