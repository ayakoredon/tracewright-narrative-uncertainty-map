param([string]$Version='0.5.0-beta', [string]$Dotnet='dotnet')
if ($Version -ne '0.5.0-beta') { throw 'Version mismatch.' }
& (Join-Path $PSScriptRoot '../scripts/build-workbench.ps1') -Dotnet $Dotnet -Installer
