param(
    [string]$Version = "0.3.0-beta"
)

$ErrorActionPreference = "Stop"

$projectRoot = [System.IO.Path]::GetFullPath($PSScriptRoot)
$workspaceRoot = [System.IO.Path]::GetFullPath((Join-Path $projectRoot ".."))
$releaseRoot = [System.IO.Path]::GetFullPath((Join-Path $projectRoot "release"))
$publishDirectory = Join-Path $releaseRoot "Tracewright-Workbench-Windows-v$Version"
$zipPath = Join-Path $releaseRoot "tracewright-workbench-windows-v$Version.zip"
$checksumPath = $zipPath + ".sha256.txt"
$localDotnet = Join-Path $projectRoot ".dotnet10\dotnet.exe"

if (Test-Path -LiteralPath $localDotnet) {
    $dotnetCommand = $localDotnet
} else {
    $dotnetCommand = "dotnet"
}

if (-not $releaseRoot.StartsWith($projectRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Release directory must remain inside the workbench project."
}

New-Item -ItemType Directory -Path $releaseRoot -Force | Out-Null
if (Test-Path -LiteralPath $publishDirectory) {
    Remove-Item -LiteralPath $publishDirectory -Recurse -Force
}
foreach ($generatedFile in @($zipPath, $checksumPath)) {
    if (Test-Path -LiteralPath $generatedFile) {
        Remove-Item -LiteralPath $generatedFile -Force
    }
}
New-Item -ItemType Directory -Path $publishDirectory -Force | Out-Null

& $dotnetCommand publish (Join-Path $projectRoot "Tracewright.Workbench.csproj") `
    -c Release `
    -r win-x64 `
    --self-contained true `
    -p:PublishProfile=win-x64 `
    -o $publishDirectory

if ($LASTEXITCODE -ne 0) {
    throw "dotnet publish failed with exit code $LASTEXITCODE. No release ZIP was created."
}

$workbenchExecutable = Join-Path $publishDirectory "Tracewright Workbench.exe"
if (-not (Test-Path -LiteralPath $workbenchExecutable)) {
    throw "The Windows executable was not created. No release ZIP was created."
}

$webConfig = Join-Path $publishDirectory "web.config"
if (Test-Path -LiteralPath $webConfig) {
    Remove-Item -LiteralPath $webConfig -Force
}

Copy-Item -LiteralPath (Join-Path $projectRoot "WINDOWS_README.txt") -Destination (Join-Path $publishDirectory "README_FIRST.txt")

$licenseCandidates = @(
    (Join-Path $workspaceRoot "public-release\LICENSE"),
    (Join-Path $workspaceRoot "LICENSE"),
    (Join-Path $projectRoot "LICENSE.txt")
)
$licenseSource = $licenseCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $licenseSource) {
    throw "Tracewright LICENSE file was not found. No release package was created."
}
Copy-Item -LiteralPath $licenseSource -Destination (Join-Path $publishDirectory "LICENSE.txt")

$dotnetRoot = if (Test-Path -LiteralPath $localDotnet) {
    Split-Path -Parent $localDotnet
} else {
    Split-Path -Parent (Get-Command $dotnetCommand -ErrorAction Stop).Source
}
foreach ($noticeName in @("LICENSE.txt", "ThirdPartyNotices.txt")) {
    $noticeSource = Join-Path $dotnetRoot $noticeName
    if (Test-Path -LiteralPath $noticeSource) {
        $destinationName = if ($noticeName -eq "LICENSE.txt") { "DOTNET-LICENSE.txt" } else { "DOTNET-THIRD-PARTY-NOTICES.txt" }
        Copy-Item -LiteralPath $noticeSource -Destination (Join-Path $publishDirectory $destinationName)
    }
}

Compress-Archive -Path (Join-Path $publishDirectory "*") -DestinationPath $zipPath -CompressionLevel Optimal
$zipHash = (Get-FileHash -LiteralPath $zipPath -Algorithm SHA256).Hash.ToLowerInvariant()
Set-Content -LiteralPath $checksumPath -Value "$zipHash *$(Split-Path $zipPath -Leaf)" -Encoding Ascii

Write-Host "Windows package created:"
Write-Host $zipPath
Write-Host "SHA256: $zipHash"
