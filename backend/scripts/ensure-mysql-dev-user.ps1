#Requires -Version 5.1
<#
.SYNOPSIS
  Đảm bảo MySQL có user wed_app_user@'%' + quyền trên wedservice (fix Access denied khi client hiện là 10.0.2.2 / Docker / WSL).

.DESCRIPTION
  Chạy bằng tài khoản MySQL có quyền admin (thường là root).
  Đọc DB_USERNAME / DB_PASSWORD / DB_HOST / DB_PORT từ backend/.env hoặc .env (thư mục hiện tại).

.EXAMPLE
  cd backend
  .\scripts\ensure-mysql-dev-user.ps1
  .\scripts\ensure-mysql-dev-user.ps1 -MysqlRootUser root -MysqlRootPassword "secret"
#>
param(
    [string] $MysqlRootUser = "root",
    [string] $MysqlRootPassword = "",
    [string] $MysqlHost = "",
    [int]    $MysqlPort = 0
)

$ErrorActionPreference = "Stop"

function Read-DotEnvFile {
    param([string] $Path)
    $map = @{}
    if (-not (Test-Path $Path)) { return $map }
    Get-Content -LiteralPath $Path -Encoding UTF8 | ForEach-Object {
        $line = $_.Trim()
        if ($line -eq "" -or $line.StartsWith("#")) { return }
        $i = $line.IndexOf("=")
        if ($i -lt 1) { return }
        $k = $line.Substring(0, $i).Trim()
        $v = $line.Substring($i + 1).Trim()
        if (($v.StartsWith('"') -and $v.EndsWith('"')) -or ($v.StartsWith("'") -and $v.EndsWith("'"))) {
            $v = $v.Substring(1, $v.Length - 2)
        }
        $map[$k] = $v
    }
    return $map
}

$backendRoot = Split-Path -Parent $PSScriptRoot
$envBackend = Join-Path $backendRoot ".env"
$envRepo = Join-Path (Split-Path -Parent $backendRoot) ".env"
$vars = Read-DotEnvFile $envBackend
if ($vars.Count -eq 0) { $vars = Read-DotEnvFile $envRepo }

$dbUser = if ($vars["DB_USERNAME"]) { $vars["DB_USERNAME"] } else { "wed_app_user" }
$dbPass = if ($vars["DB_PASSWORD"]) { $vars["DB_PASSWORD"] } else { "" }
$dbHostCfg = if ($vars["DB_HOST"]) { $vars["DB_HOST"] } else { "127.0.0.1" }
$dbPortCfg = if ($vars["DB_PORT"]) { [int]$vars["DB_PORT"] } else { 3307 }

if ($MysqlHost -eq "") { $MysqlHost = $dbHostCfg }
if ($MysqlPort -eq 0) { $MysqlPort = $dbPortCfg }

if ($dbPass -eq "") {
    Write-Error "DB_PASSWORD trống trong .env. Thêm DB_PASSWORD vào backend/.env rồi chạy lại."
}

if ($MysqlRootPassword -eq "") {
    $secure = Read-Host -AsSecureString "Mật khẩu MySQL cho user '$MysqlRootUser'"
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    $MysqlRootPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}

$mysql = Get-Command mysql -ErrorAction SilentlyContinue
if (-not $mysql) {
    Write-Error "Không tìm thấy lệnh 'mysql' trong PATH. Cài MySQL Shell/Client hoặc thêm bin vào PATH, hoặc chạy SQL thủ công trong Workbench (xem scripts/mysql_dev_user_all_hosts.sql)."
}

$sqlPass = $dbPass -replace "'", "''"
$sql = @"
CREATE DATABASE IF NOT EXISTS wedservice CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$dbUser'@'%' IDENTIFIED BY '$sqlPass';
ALTER USER '$dbUser'@'%' IDENTIFIED BY '$sqlPass';
GRANT ALL PRIVILEGES ON wedservice.* TO '$dbUser'@'%';
FLUSH PRIVILEGES;
"@

$argList = @(
    "-h", $MysqlHost,
    "-P", "$MysqlPort",
    "-u", $MysqlRootUser,
    "--protocol=TCP",
    "--default-character-set=utf8mb4"
)
try {
    $env:MYSQL_PWD = $MysqlRootPassword
    $sql | & mysql @argList
    if ($LASTEXITCODE -ne 0) {
        Write-Error "mysql trả mã lỗi $LASTEXITCODE. Kiểm tra host/port, mật khẩu root, và MySQL đang chạy."
    }
}
finally {
    Remove-Item Env:\MYSQL_PWD -ErrorAction SilentlyContinue
}

Write-Host "OK: Đã tạo/cập nhật '${dbUser}'@'%' và GRANT trên wedservice ($MysqlHost`:$MysqlPort). Chạy lại Spring Boot."
