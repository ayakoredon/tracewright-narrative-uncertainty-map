@echo off
cd /d "%~dp0"
if exist ".dotnet10\dotnet.exe" (
  ".dotnet10\dotnet.exe" run --project Tracewright.Workbench.csproj
) else (
  dotnet run --project Tracewright.Workbench.csproj
)
if errorlevel 1 pause
