# Test HOME_FLASH_SALE (last-minute deals) - DB + API
# Run: powershell -File scripts/test-home-flash-deals.ps1

$ErrorActionPreference = 'Continue'
$apiBase = if ($env:VITE_API_URL) { $env:VITE_API_URL.TrimEnd('/') } else { 'http://127.0.0.1:8088/api/v1' }
$dbHost = if ($env:DB_HOST) { $env:DB_HOST } else { '127.0.0.1' }
$dbPort = if ($env:DB_PORT) { $env:DB_PORT } else { '3307' }
$dbUser = if ($env:DB_USERNAME) { $env:DB_USERNAME } else { 'wed_app_user' }
$dbPass = if ($env:DB_PASSWORD) { $env:DB_PASSWORD } else { '123456' }
$dbName = 'wedservice'

Write-Host ''
Write-Host '=== 1) MySQL: tours with HOME_FLASH_SALE ===' -ForegroundColor Cyan
$sql = @'
SELECT t.id, t.code, t.is_featured, t.status
FROM tours t
JOIN tour_tags tt ON tt.tour_id = t.id
JOIN tags tg ON tg.id = tt.tag_id AND tg.code = 'HOME_FLASH_SALE'
WHERE t.deleted_at IS NULL
ORDER BY t.id;
'@
& mysql -h $dbHost -P $dbPort -u $dbUser "-p$dbPass" $dbName -e $sql
if ($LASTEXITCODE -ne 0) {
  Write-Host "MySQL failed - check DB on port $dbPort" -ForegroundColor Red
}

Write-Host ''
Write-Host '=== 2) API: HOME_FLASH_SALE ===' -ForegroundColor Cyan
$query = 'tagCodes=HOME_FLASH_SALE&featuredOnly=true&size=12&sortBy=totalBookings&sortDir=desc'
$url = "$apiBase/tours?$query"
Write-Host "URL: $url"
try {
  $r = Invoke-RestMethod -Uri $url -Headers @{ 'Accept-Language' = 'vi' }
  $count = $r.data.content.Count
  $color = if ($count -ge 6) { 'Green' } else { 'Yellow' }
  Write-Host "success=$($r.success) totalElements=$($r.data.totalElements) contentCount=$count" -ForegroundColor $color
  foreach ($t in $r.data.content) {
    $media = @($t.media | Where-Object { $_.isActive -ne $false -and $_.mediaType -ne 'video' })
    $img = if ($media.Count -gt 0) { $media[0].mediaUrl } else { '(none)' }
    $short = if ($img.Length -gt 55) { $img.Substring(0, 55) + '...' } else { $img }
    Write-Host "  id=$($t.id) code=$($t.code) featured=$($t.isFeatured) media=$($media.Count) img=$short"
  }
  if ($count -ge 6) {
    Write-Host ''
    Write-Host 'OK: 6+ tours - data ready for UI.' -ForegroundColor Green
  } else {
    Write-Host ''
    Write-Host 'WARN: API returned fewer than 6. Restart backend (5min cache) or re-run V7 seed.' -ForegroundColor Yellow
  }
}
catch {
  Write-Host ('API error: ' + $_.Exception.Message) -ForegroundColor Red
  Write-Host 'Is backend running on port 8088? (NOT 8080 - that may be Adminer)' -ForegroundColor Yellow
}

Write-Host ''
Write-Host '=== 3) Compare HOME_BEACH_VN ===' -ForegroundColor Cyan
$beachQuery = 'tagCodes=HOME_BEACH_VN&featuredOnly=true&size=12'
$urlBeach = "$apiBase/tours?$beachQuery"
try {
  $b = Invoke-RestMethod -Uri $urlBeach -Headers @{ 'Accept-Language' = 'vi' }
  Write-Host "HOME_BEACH_VN count=$($b.data.content.Count)"
}
catch {
  Write-Host ('BEACH API error: ' + $_.Exception.Message)
}

Write-Host ''
