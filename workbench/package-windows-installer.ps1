param(
    [string]$Version = "0.3.0-beta"
)

$ErrorActionPreference = "Stop"

$projectRoot = [System.IO.Path]::GetFullPath($PSScriptRoot)
$releaseRoot = Join-Path $projectRoot "release"
$expectedVersion = "0.3.0-beta"
if ($Version -ne $expectedVersion) {
    throw "installer.iss currently targets $expectedVersion. Update its version constants before building $Version."
}

& (Join-Path $projectRoot "generate-app-icon.ps1")

& (Join-Path $projectRoot "package-windows.ps1") -Version $Version

$compilerCandidates = @(
    (Join-Path $env:LOCALAPPDATA "Programs\Inno Setup 6\ISCC.exe"),
    "C:\Program Files (x86)\Inno Setup 6\ISCC.exe",
    "C:\Program Files\Inno Setup 6\ISCC.exe"
)
$compiler = $compilerCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $compiler) {
    throw "Inno Setup 6 was not found. Install it, then rerun this script."
}

& $compiler (Join-Path $projectRoot "installer.iss")
if ($LASTEXITCODE -ne 0) {
    throw "Inno Setup failed with exit code $LASTEXITCODE."
}

$installerPath = Join-Path $releaseRoot "Tracewright-Workbench-Setup-v$Version.exe"
if (-not (Test-Path -LiteralPath $installerPath)) {
    throw "The installer was not created at $installerPath."
}

$checksumPath = $installerPath + ".sha256.txt"
$hash = (Get-FileHash -LiteralPath $installerPath -Algorithm SHA256).Hash.ToLowerInvariant()
Set-Content -LiteralPath $checksumPath -Value "$hash *$(Split-Path $installerPath -Leaf)" -Encoding Ascii

Write-Host "Windows installer created:"
Write-Host $installerPath
Write-Host "SHA256: $hash"
