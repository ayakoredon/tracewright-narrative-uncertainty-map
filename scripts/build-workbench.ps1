param([string]$Dotnet = 'dotnet', [switch]$Installer)
$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$project = Join-Path $root 'workbench'
$version = ([xml](Get-Content -LiteralPath (Join-Path $project 'Tracewright.Workbench.csproj') -Raw)).Project.PropertyGroup.Version
if ($version -ne '0.5.0-beta') { throw 'Review this release script before changing the release version.' }
node (Join-Path $PSScriptRoot 'sync-workbench-assets.cjs')
if ($LASTEXITCODE -ne 0) { throw 'Asset synchronization failed.' }
$out = Join-Path $project "release/Tracewright-Workbench-Windows-v$version"
if (Test-Path -LiteralPath $out) { throw 'A package already exists here. Use a clean build checkout; never mix old output with a release.' }
New-Item -ItemType Directory -Path $out -Force | Out-Null
& $Dotnet publish (Join-Path $project 'Tracewright.Workbench.csproj') -c Release -r win-x64 --self-contained true -p:PublishProfile=win-x64 -p:ContinuousIntegrationBuild=true "-p:PathMap=$root=/_/Tracewright" -o $out
if ($LASTEXITCODE -ne 0) { throw 'Publish failed.' }
$webConfig = Join-Path $out 'web.config'
if (Test-Path -LiteralPath $webConfig) { Remove-Item -LiteralPath $webConfig }
Copy-Item -LiteralPath (Join-Path $root 'LICENSE') -Destination (Join-Path $out 'LICENSE.txt')
Copy-Item -LiteralPath (Join-Path $root 'COMMERCIAL_USE.md') -Destination (Join-Path $out 'COMMERCIAL_USE.md')
Copy-Item -LiteralPath (Join-Path $project 'WINDOWS_README.txt') -Destination (Join-Path $out 'README_FIRST.txt')
$runtimeRoot = Split-Path -Parent (Get-Command $Dotnet).Source
foreach ($name in @('LICENSE.txt','ThirdPartyNotices.txt')) {
  $notice=Join-Path $runtimeRoot $name
  if (Test-Path -LiteralPath $notice) { Copy-Item -LiteralPath $notice -Destination (Join-Path $out "DOTNET-$name") }
}
$files = Get-ChildItem -LiteralPath $out -File -Recurse
foreach ($file in $files) {
  $relative=[IO.Path]::GetRelativePath($out,$file.FullName).Replace('\','/')
  if ($relative -match '(^|/)(projects|runs|tests|\.git|\.codex|\.agents|bin|obj)/' -or $file.Extension -in @('.pdb','.doc','.docx','.rtf','.pdf','.xlsx','.odt') -or $file.Name -in @('auth.json','project.json','review.json','approval.json','candidate.json')) { throw "Unexpected package content: $relative" }
  if ($relative -notmatch '^(wwwroot/|schemas/|Tracewright Workbench\.(exe|dll|deps\.json|runtimeconfig\.json|staticwebassets\.endpoints\.json)$|README_FIRST\.txt$|LICENSE\.txt$|COMMERCIAL_USE\.md$|DOTNET-)') { throw "Non-allowlisted package file: $relative" }
}
$zip=Join-Path $project "release/tracewright-workbench-windows-v$version.zip"
Compress-Archive -LiteralPath $out -DestinationPath $zip -CompressionLevel Optimal
$hash=(Get-FileHash -LiteralPath $zip -Algorithm SHA256).Hash.ToLowerInvariant()
Set-Content -LiteralPath "$zip.sha256.txt" -Value "$hash  $([IO.Path]::GetFileName($zip))" -Encoding ascii
if ($Installer) {
  $candidates=@("$env:LOCALAPPDATA/Programs/Inno Setup 6/ISCC.exe",'C:/Program Files (x86)/Inno Setup 6/ISCC.exe','C:/Program Files/Inno Setup 6/ISCC.exe')
  $compiler=$candidates | Where-Object {Test-Path -LiteralPath $_} | Select-Object -First 1
  if (!$compiler) { throw 'Inno Setup 6 is required for the optional installer.' }
  & $compiler (Join-Path $project 'installer.iss')
  if ($LASTEXITCODE -ne 0) { throw 'Installer build failed.' }
  $setup=Join-Path $project "release/Tracewright-Workbench-Setup-v$version.exe"
  $hash=(Get-FileHash -LiteralPath $setup -Algorithm SHA256).Hash.ToLowerInvariant()
  Set-Content -LiteralPath "$setup.sha256.txt" -Value "$hash  $([IO.Path]::GetFileName($setup))" -Encoding ascii
}
Write-Output "Verified package: $zip"
