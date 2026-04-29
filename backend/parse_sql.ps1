$sql = Get-Content -Path "d:\TRAVELVIET-BOOKING-SYSTEM\backend\src\main\resources\db\migration\V1__init_schema.sql"
$current_table = ""
foreach ($line in $sql) {
    if ($line -match "CREATE TABLE IF NOT EXISTS\s+([a-zA-Z0-9_]+)") {
        $current_table = $matches[1]
    }
    if ($line -match "updated_at") {
        Write-Output "$current_table HAS updated_at"
    }
}
