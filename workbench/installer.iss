#define MyAppName "Tracewright Workbench"
#define MyAppVersion "0.5.0-beta"
#define MyAppPublisher "Ayako Redon"
#define MyAppURL "https://github.com/ayakoredon/tracewright-narrative-uncertainty-map"
#define MyAppExeName "Tracewright Workbench.exe"
#define MyReleaseFolder "Tracewright-Workbench-Windows-v0.5.0-beta"

[Setup]
AppId={{7523A571-7D2C-4339-9B1A-B00FC08A90E2}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}/issues
AppUpdatesURL={#MyAppURL}/releases
DefaultDirName={localappdata}\Programs\Tracewright Workbench
DefaultGroupName=Tracewright Workbench
DisableProgramGroupPage=yes
PrivilegesRequired=lowest
OutputDir=release
OutputBaseFilename=Tracewright-Workbench-Setup-v0.5.0-beta
SetupIconFile=assets\tracewright-workbench.ico
UninstallDisplayIcon={app}\{#MyAppExeName}
LicenseFile=release\{#MyReleaseFolder}\LICENSE.txt
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
MinVersion=10.0.17763
CloseApplications=yes
RestartApplications=no
UsedUserAreasWarning=no

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "japanese"; MessagesFile: "compiler:Languages\Japanese.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: checkedonce

[Files]
Source: "release\{#MyReleaseFolder}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{autoprograms}\Tracewright Workbench"; Filename: "{app}\{#MyAppExeName}"; WorkingDir: "{app}"
Name: "{autodesktop}\Tracewright Workbench"; Filename: "{app}\{#MyAppExeName}"; WorkingDir: "{app}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,Tracewright Workbench}"; WorkingDir: "{app}"; Flags: nowait postinstall skipifsilent
