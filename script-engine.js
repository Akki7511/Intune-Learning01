// ============================================================
// INTUNE SCRIPT GENERATOR — ENGINE
// Mock (template-based) generation mode.
// All output is labelled Draft and mock-generated.
// No API keys. No auto-execution. No deployment.
// ============================================================
'use strict';

// ──────────────────────────────────────────────
// UTILITY
// ──────────────────────────────────────────────
function seEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function highlightPS(raw) {
  const lines = seEscape(raw).split('\n');
  return lines.map(line => {
    const t = line.trimStart();
    if (t.startsWith('#')) return '<span class="comment">' + line + '</span>';
    // inline comment after code
    let l = line.replace(/(#[^"'\n]*)$/, '<span class="comment">$1</span>');
    // strings
    l = l.replace(/(&quot;[^&]*&quot;)/g, '<span class="str">$1</span>');
    l = l.replace(/('(?:[^'\\]|\\.)*')/g, '<span class="str">$1</span>');
    // variables
    l = l.replace(/(\$[A-Za-z_]\w*(?:\.\w+)*)/g, '<span class="key">$1</span>');
    // keywords
    const kws = 'if|else|elseif|foreach|for|while|do|switch|try|catch|finally|function|param|return|exit|break|continue|throw|begin|process|end';
    l = l.replace(new RegExp('\\b(' + kws + ')\\b', 'g'), '<span class="kw">$1</span>');
    return l;
  }).join('\n');
}

function seId() {
  return 'scr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

function seNow() { return new Date().toISOString(); }

function seDateFmt(iso) {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return iso; }
}

// ──────────────────────────────────────────────
// SCRIPT LIBRARY  (localStorage)
// ──────────────────────────────────────────────
const ScriptLibrary = {
  KEY: 'intuneScriptLib_v1',

  load() {
    try { return JSON.parse(localStorage.getItem(this.KEY) || '[]'); }
    catch { return []; }
  },

  save(list) {
    try { localStorage.setItem(this.KEY, JSON.stringify(list)); return true; }
    catch { return false; }
  },

  list() { return this.load(); },

  get(id) { return this.load().find(s => s.id === id) || null; },

  add(script) {
    const list = this.load();
    const s = Object.assign({
      id: seId(),
      createdAt: seNow(),
      updatedAt: seNow(),
      status: 'Draft',
      versions: [],
      tags: [],
      validationStatus: 'Not Run',
      riskLevel: 'Unknown'
    }, script);
    list.unshift(s);
    this.save(list);
    return s;
  },

  update(id, changes) {
    const list = this.load();
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) return null;
    const prev = list[idx];
    if (!prev.versions) prev.versions = [];
    if (prev.code !== changes.code) {
      prev.versions.push({ code: prev.code, updatedAt: prev.updatedAt, note: changes.versionNote || 'Updated' });
    }
    list[idx] = Object.assign({}, prev, changes, { id, updatedAt: seNow() });
    delete list[idx].versionNote;
    this.save(list);
    return list[idx];
  },

  duplicate(id) {
    const orig = this.get(id);
    if (!orig) return null;
    const copy = Object.assign({}, orig, {
      id: undefined, title: (orig.title || 'Script') + ' (Copy)',
      status: 'Draft', versions: [], createdAt: undefined, updatedAt: undefined
    });
    return this.add(copy);
  },

  remove(id) {
    this.save(this.load().filter(s => s.id !== id));
  },

  count() { return this.load().length; }
};

// ──────────────────────────────────────────────
// SCRIPT GENERATOR  (mock / template-based)
// ──────────────────────────────────────────────
const ScriptGenerator = {

  // keyword matching to refine the generated script
  _keywords(req) {
    const r = (req || '').toLowerCase();
    return {
      isService    : /\bservice\b|\bsvc\b|\brunning\b|\bstopped\b/.test(r),
      isRegistry   : /\bregist|\bhklm|\bhkcu|\breg\b/.test(r),
      isFile       : /\bfile\b|\bpath\b|\bfolder\b|\bdirector/.test(r),
      isEventLog   : /\bevent.?log\b|\beventid\b|\bwinevent/.test(r),
      isApp        : /\bapp\b|\bapplication\b|\binstall|\bsoftware\b|\bversion\b/.test(r),
      isInventory  : /\binventor|\bcollect|\breport|\baudit\b|\bdiagnostic/.test(r),
      isWinUpdate  : /\bwindows update\b|\bwu\b|\bwsus\b|\bwuauclt\b/.test(r),
      isNetwork    : /\bnetwork\b|\bip\b|\bdns\b|\bfirewall\b|\bport\b/.test(r),
      isCompliance : /\bcomplian|\bpolicy\b|\bbitlocker\b/.test(r),
    };
  },

  _selectTemplate(config, kw) {
    const { domain, taskType } = config;
    if (domain === 'intune' && taskType === 'detection')       return 'intuneDetection';
    if (domain === 'intune' && taskType === 'remediation')     return 'intuneRemediation';
    if (taskType === 'detection' && kw.isApp)                  return 'win32Detection';
    if (domain === 'registry' || kw.isRegistry)                return 'registryOps';
    if (domain === 'services' || kw.isService)                 return 'serviceManagement';
    if (domain === 'eventlogs' || kw.isEventLog)               return 'eventLogQuery';
    if (taskType === 'inventory' || taskType === 'reporting' || kw.isInventory) return 'deviceInventory';
    if (kw.isWinUpdate)                                        return 'windowsUpdate';
    if (domain === 'intune')                                   return 'intuneScript';
    return 'general';
  },

  // ── Exit-code reference per workflow ──────────
  _exitDocs: {
    intuneDetection  : 'Exit 0 = Compliant (remediation will NOT run). Exit 1 = Non-compliant (remediation WILL run).',
    intuneRemediation: 'Exit 0 = Remediation succeeded. Exit 1 = Remediation failed (Intune may retry).',
    win32Detection   : 'Exit 0 = App detected (do not install). Exit 1 = Not detected (Intune will run install command).',
    intuneScript     : 'Intune Platform Scripts do not use exit codes for compliance; use Write-Output / Write-Error for logs visible in Intune.',
    deviceInventory  : 'Exit 0 = Collection succeeded. Exit 1 = Failed. Output is captured by the calling workflow.',
    registryOps      : 'Exit 0 = Success. Exit 1 = Failure. Adjust for the calling workflow.',
    serviceManagement: 'Exit 0 = Success. Exit 1 = Failure.',
    eventLogQuery    : 'Exit 0 = Query ran. Exit 1 = Error. Results written to stdout.',
    windowsUpdate    : 'Exit 0 = Status collected or fix applied. Exit 1 = Error.',
    general          : 'Exit 0 = Success. Exit 1 = Failure. Adjust as needed.'
  },

  // ── Deployment instructions per workflow ──────
  _deployDocs: {
    intuneDetection: [
      'Portal path: Devices › Remediations (Endpoint Analytics) › Create › Detection script tab.',
      'Run this script using the logged on credentials: No (SYSTEM context).',
      'Run script in 64-bit PowerShell: Yes (recommended).',
      'Assign to a security group. Set Schedule frequency.',
      'Monitor: Devices › Remediations › [policy name] › Device status.'
    ],
    intuneRemediation: [
      'Portal path: Devices › Remediations (Endpoint Analytics) › Create › Remediation script tab.',
      'Upload paired with the detection script in the same Remediation policy.',
      'Run in 64-bit PowerShell: Yes.',
      'Monitor: Device status tab — shows Remediated, Failed, or With issues.'
    ],
    win32Detection: [
      'Portal path: Apps › Windows › Add › App type: Windows app (Win32).',
      'Package your installer with IntuneWinAppUtil.exe first.',
      'Upload the .intunewin file, then paste this script in the Detection rules tab: Script rules.',
      'Do NOT add Return code rules when using a script — the script exit code is the rule.',
      'Monitor: Apps › [app name] › Device install status.'
    ],
    intuneScript: [
      'Portal path: Devices › Scripts and remediations › Platform scripts › Add › Windows 10 and later.',
      'Upload the .ps1 file.',
      'Set: Run script in 64-bit PowerShell, Run as account (SYSTEM or User per your requirement).',
      'Assign to groups. Note: Platform Scripts run once on each device unless updated.',
      'Monitor: Devices › Scripts and remediations › Platform scripts › [script name] › Device status.'
    ],
    deviceInventory: [
      'Deploy via Intune Platform Scripts (Devices › Scripts) or as a Win32 app.',
      'If collecting data, write results to a file path and collect via Diagnostics or a custom upload mechanism.',
      'Alternatively run as a Remediation detection-only script and view output in the Device status panel.'
    ],
    general: [
      'Choose the appropriate deployment method for your use case.',
      'Test on a single device first before assigning to a large group.',
      'Check Intune Management Extension logs: %ProgramData%\\Microsoft\\IntuneManagementExtension\\Logs\\.'
    ]
  },

  // ── Template: Intune Remediation Detection ────
  _tpl_intuneDetection(config, kw) {
    const req = config.requirement || 'Unnamed requirement';
    const psVer = config.psVersion || '5.1';
    const os = config.targetOS || 'Windows 10 and later';
    const date = new Date().toISOString().slice(0, 10);

    let checkBlock = '';
    let description = '';

    if (kw.isService) {
      description = 'Checks that the specified Windows service is running and set to Automatic start.';
      checkBlock = `# Replace <SERVICE_NAME> with the actual service name (e.g., 'WinRM', 'Spooler')
$serviceName = '<SERVICE_NAME>'

$svc = Get-Service -Name $serviceName -ErrorAction Stop
if ($svc.Status -eq 'Running' -and $svc.StartType -in @('Automatic','AutomaticDelayedStart')) {
    Write-Output "COMPLIANT: $serviceName is $($svc.Status) / $($svc.StartType)"
    exit 0
} else {
    Write-Output "NON-COMPLIANT: $serviceName is $($svc.Status) / $($svc.StartType)"
    exit 1
}`;
    } else if (kw.isRegistry) {
      description = 'Checks that a registry key or value exists and has the expected data.';
      checkBlock = `# Customise these values
$regPath  = 'HKLM:\\<REPLACE_REGISTRY_PATH>'
$regName  = '<REPLACE_VALUE_NAME>'
$expected = '<REPLACE_EXPECTED_VALUE>'

if (Test-Path $regPath) {
    $actual = (Get-ItemProperty -Path $regPath -ErrorAction SilentlyContinue).$regName
    if ($actual -eq $expected) {
        Write-Output "COMPLIANT: $regName = $actual"
        exit 0
    } else {
        Write-Output "NON-COMPLIANT: $regName = $actual (expected $expected)"
        exit 1
    }
} else {
    Write-Output "NON-COMPLIANT: Registry path not found: $regPath"
    exit 1
}`;
    } else if (kw.isFile) {
      description = 'Checks that a required file or directory exists.';
      checkBlock = `$targetPath = '<REPLACE_FILE_OR_FOLDER_PATH>'

if (Test-Path -Path $targetPath) {
    Write-Output "COMPLIANT: Path exists: $targetPath"
    exit 0
} else {
    Write-Output "NON-COMPLIANT: Path not found: $targetPath"
    exit 1
}`;
    } else {
      description = 'Checks the specified condition and reports compliant or non-compliant.';
      checkBlock = `# ── TODO: implement your detection logic ─────────────────────────
# Replace this block with your actual check.
# $result = <your check here — Get-Service / Get-ItemProperty / Test-Path / etc.>

$compliant = $false   # <REPLACE: set $true when device is compliant>

if ($compliant) {
    Write-Output 'COMPLIANT: <REPLACE: describe the passing condition>'
    exit 0
} else {
    Write-Output 'NON-COMPLIANT: <REPLACE: describe what is missing>'
    exit 1
}`;
    }

    return `#Requires -Version ${psVer}
<#
.SYNOPSIS
    Detection: ${req}
.DESCRIPTION
    ${description}
    Intune Proactive Remediation — Detection Script.
    Exit 0 = Compliant (remediation will NOT run).
    Exit 1 = Non-compliant (remediation WILL run).
.NOTES
    Generated  : ${date} — MOCK (Template-based) — review before use
    Target OS  : ${os}
    PS Version : ${psVer}
    Context    : SYSTEM  |  64-bit recommended
    Status     : DRAFT — do not deploy without review and testing
#>

try {
    ${checkBlock.replace(/\n/g, '\n    ')}
} catch {
    Write-Output "ERROR: $_"
    exit 1
}`;
  },

  // ── Template: Intune Remediation Remediation ──
  _tpl_intuneRemediation(config, kw) {
    const req = config.requirement || 'Unnamed requirement';
    const psVer = config.psVersion || '5.1';
    const os = config.targetOS || 'Windows 10 and later';
    const date = new Date().toISOString().slice(0, 10);

    let fixBlock = '';
    let verifyBlock = '';

    if (kw.isService) {
      fixBlock = `$serviceName = '<SERVICE_NAME>'
    $svc = Get-Service -Name $serviceName -ErrorAction Stop
    if ($svc.Status -ne 'Running') {
        Start-Service -Name $serviceName -ErrorAction Stop
        Write-Log "Started $serviceName"
    }
    Set-Service -Name $serviceName -StartupType Automatic -ErrorAction Stop
    Write-Log "Set $serviceName to Automatic start"`;
      verifyBlock = `$svc = Get-Service -Name $serviceName -ErrorAction Stop
    ($svc.Status -eq 'Running')`;
    } else if (kw.isRegistry) {
      fixBlock = `$regPath  = 'HKLM:\\<REPLACE_REGISTRY_PATH>'
    $regName  = '<REPLACE_VALUE_NAME>'
    $regValue = '<REPLACE_DESIRED_VALUE>'
    $regType  = 'DWord'   # DWord / String / ExpandString / MultiString / QWord / Binary

    if (-not (Test-Path $regPath)) {
        New-Item -Path $regPath -Force | Out-Null
        Write-Log "Created registry key: $regPath"
    }
    Set-ItemProperty -Path $regPath -Name $regName -Value $regValue -Type $regType -Force
    Write-Log "Set $regName = $regValue"`;
      verifyBlock = `$actual = (Get-ItemProperty -Path $regPath -ErrorAction SilentlyContinue).$regName
    ($actual -eq $regValue)`;
    } else {
      fixBlock = `# ── TODO: implement your remediation steps ──────────────────────
    # Replace this block. Keep changes targeted and idempotent where possible.
    # Log each significant step with Write-Log.
    Write-Log '<REPLACE: describe what you are fixing>'
    # <REPLACE: your remediation code here>`;
      verifyBlock = `# <REPLACE: re-run your detection check. Return $true if now compliant.>
    $false`;
    }

    return `#Requires -Version ${psVer}
<#
.SYNOPSIS
    Remediation: ${req}
.DESCRIPTION
    Intune Proactive Remediation — Remediation Script.
    Runs automatically when the paired Detection script exits 1.
    Exit 0 = Remediation succeeded.
    Exit 1 = Remediation failed (Intune will log the failure).
.NOTES
    Generated  : ${date} — MOCK (Template-based) — review before use
    Target OS  : ${os}
    PS Version : ${psVer}
    Context    : SYSTEM  |  64-bit recommended
    Status     : DRAFT — do not deploy without review and testing
#>

$LogPath = "$env:ProgramData\\Microsoft\\IntuneManagementExtension\\Logs\\Remediation-<SCRIPT_NAME>.log"

function Write-Log {
    param([string]$Message, [string]$Level = 'INFO')
    $ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    "$ts [$Level] $Message" | Out-File -FilePath $LogPath -Append -Encoding utf8 -ErrorAction SilentlyContinue
    Write-Output "$ts [$Level] $Message"
}

try {
    Write-Log 'Remediation started'

    # ── REMEDIATION ───────────────────────────────────────────
    ${fixBlock.replace(/\n/g, '\n    ')}

    # ── VERIFY ───────────────────────────────────────────────
    $verified = ${verifyBlock}
    if ($verified) {
        Write-Log 'Remediation verified successfully'
        exit 0
    } else {
        Write-Log 'Verification failed after remediation' -Level 'WARN'
        exit 1
    }
} catch {
    Write-Log "Error: $_" -Level 'ERROR'
    exit 1
}`;
  },

  // ── Template: Win32 App Detection ─────────────
  _tpl_win32Detection(config) {
    const req = config.requirement || 'Detect application';
    const date = new Date().toISOString().slice(0, 10);
    return `#Requires -Version 5.1
<#
.SYNOPSIS
    Win32 App Detection: ${req}
.DESCRIPTION
    Intune Win32 App Detection Rule (Script-based).
    Exit 0 = App DETECTED (do not install / install succeeded).
    Exit 1 = App NOT detected (Intune will run the install command).
    Write output to stdout — it appears in Intune app install logs.
.NOTES
    Generated : ${date} — MOCK (Template-based) — review before use
    Status    : DRAFT
#>

# ── OPTION A: Detect by registry uninstall key (most reliable) ──────────
$appName    = '<REPLACE_APP_DISPLAY_NAME>'   # Partial match is fine
$minVersion = '<REPLACE_MIN_VERSION>'        # e.g. '3.5.0' or leave '' to skip version check

$uninstallPaths = @(
    'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall',
    'HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall'
)

foreach ($path in $uninstallPaths) {
    $keys = Get-ChildItem -Path $path -ErrorAction SilentlyContinue
    foreach ($key in $keys) {
        $disp = $key.GetValue('DisplayName')
        $ver  = $key.GetValue('DisplayVersion')
        if ($disp -like "*$appName*") {
            if ($minVersion -eq '' -or [version]$ver -ge [version]$minVersion) {
                Write-Output "DETECTED: $disp $ver"
                exit 0
            } else {
                Write-Output "VERSION TOO OLD: $disp $ver (need >= $minVersion)"
                exit 1
            }
        }
    }
}

# ── OPTION B: Detect by file existence (uncomment if preferred) ─────────
# $filePath = '<REPLACE_FILE_PATH>'
# if (Test-Path $filePath) {
#     Write-Output "DETECTED: $filePath exists"
#     exit 0
# }

Write-Output "NOT DETECTED: $appName not found"
exit 1`;
  },

  // ── Template: Intune Platform Script ──────────
  _tpl_intuneScript(config, kw) {
    const req = config.requirement || 'Configuration task';
    const ctx = config.context || 'SYSTEM';
    const psVer = config.psVersion || '5.1';
    const os = config.targetOS || 'Windows 10 and later';
    const date = new Date().toISOString().slice(0, 10);

    let taskBlock = '';
    if (kw.isRegistry) {
      taskBlock = `# Apply registry setting
$regPath  = 'HKLM:\\<REPLACE_PATH>'
$regName  = '<REPLACE_NAME>'
$regValue = '<REPLACE_VALUE>'
$regType  = 'DWord'
if (-not (Test-Path $regPath)) { New-Item -Path $regPath -Force | Out-Null }
Set-ItemProperty -Path $regPath -Name $regName -Value $regValue -Type $regType -Force
Write-Log "Registry set: $regPath\\$regName = $regValue"`;
    } else if (kw.isService) {
      taskBlock = `$serviceName = '<SERVICE_NAME>'
Set-Service -Name $serviceName -StartupType '<Automatic|Manual|Disabled>' -ErrorAction Stop
Write-Log "Service $serviceName startup type configured"`;
    } else {
      taskBlock = `# ── TODO: implement your configuration task ─────────────────────
# This is a one-time platform script running as ${ctx}.
# Add your steps here. Log each significant action.
Write-Log '<REPLACE: describe your configuration step>'
# <REPLACE: your code here>`;
    }

    return `#Requires -Version ${psVer}
<#
.SYNOPSIS
    Platform Script: ${req}
.DESCRIPTION
    Intune Platform Script (Devices > Scripts and remediations > Platform scripts).
    Runs ONCE per device (re-runs if the script is updated in the portal).
    Run as: ${ctx}
.NOTES
    Generated  : ${date} — MOCK (Template-based) — review before use
    Target OS  : ${os}
    PS Version : ${psVer}
    Context    : ${ctx}
    Status     : DRAFT
#>

$ScriptName = '<REPLACE_SCRIPT_NAME>'
$LogPath    = "$env:ProgramData\\Microsoft\\IntuneManagementExtension\\Logs\\$ScriptName.log"

function Write-Log {
    param([string]$Message, [string]$Level = 'INFO')
    $ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    "$ts [$Level] $Message" | Out-File -FilePath $LogPath -Append -Encoding utf8 -ErrorAction SilentlyContinue
    Write-Host "$ts [$Level] $Message"
}

try {
    Write-Log "Starting $ScriptName"

    ${taskBlock.replace(/\n/g, '\n    ')}

    Write-Log "Script completed successfully"
} catch {
    Write-Log "Script failed: $_" -Level 'ERROR'
    exit 1
}`;
  },

  // ── Template: Device Inventory ─────────────────
  _tpl_deviceInventory(config) {
    const req = config.requirement || 'Device inventory';
    const date = new Date().toISOString().slice(0, 10);
    return `#Requires -Version 5.1
<#
.SYNOPSIS
    Inventory / Diagnostic: ${req}
.DESCRIPTION
    Collects device information for reporting or diagnostics.
    Read-only — does not modify device state.
    Output is written to stdout and optionally to a local file.
.NOTES
    Generated : ${date} — MOCK (Template-based) — review before use
    Status    : DRAFT
#>

$report = [ordered]@{}

# ── SYSTEM INFO ───────────────────────────────────────────
$cs = Get-CimInstance -ClassName Win32_ComputerSystem -ErrorAction SilentlyContinue
$os = Get-CimInstance -ClassName Win32_OperatingSystem -ErrorAction SilentlyContinue

$report.ComputerName     = $env:COMPUTERNAME
$report.Domain           = $cs.Domain
$report.Manufacturer     = $cs.Manufacturer
$report.Model            = $cs.Model
$report.TotalRAM_GB      = [math]::Round($cs.TotalPhysicalMemory / 1GB, 1)
$report.OSCaption        = $os.Caption
$report.OSBuildNumber    = $os.BuildNumber
$report.OSInstallDate    = $os.InstallDate
$report.LastBoot         = $os.LastBootUpTime
$report.CurrentUser      = $env:USERNAME

# ── DISK INFO ────────────────────────────────────────────
$disk = Get-CimInstance -ClassName Win32_LogicalDisk -Filter "DeviceID='C:'" -ErrorAction SilentlyContinue
if ($disk) {
    $report.CFreePct = [math]::Round(($disk.FreeSpace / $disk.Size) * 100, 1)
    $report.CDriveGB = [math]::Round($disk.Size / 1GB, 1)
}

# ── OPTIONAL: add custom checks below ────────────────────
# $report.WinRMRunning = (Get-Service WinRM -EA SilentlyContinue).Status -eq 'Running'
# $report.BitlockerStatus = (Get-BitLockerVolume -MountPoint C: -EA SilentlyContinue).ProtectionStatus

# ── OUTPUT ───────────────────────────────────────────────
$json = $report | ConvertTo-Json -Depth 3
Write-Output $json

# ── OPTIONAL: write to file ───────────────────────────────
# $json | Out-File -FilePath "C:\\Logs\\DeviceInventory-$($env:COMPUTERNAME).json" -Encoding utf8 -Force

exit 0`;
  },

  // ── Template: Registry Operations ─────────────
  _tpl_registryOps(config) {
    const req = config.requirement || 'Registry operation';
    const taskType = config.taskType || 'configuration';
    const date = new Date().toISOString().slice(0, 10);
    const isRead = taskType === 'detection' || taskType === 'inventory' || taskType === 'troubleshooting';
    return `#Requires -Version 5.1
<#
.SYNOPSIS
    Registry ${isRead ? 'Check' : 'Configuration'}: ${req}
.NOTES
    Generated : ${date} — MOCK (Template-based) — review before use
    Status    : DRAFT
    ${!isRead ? '⚠  Modifies registry — test on a non-production device first.' : ''}
#>

$regPath  = '<REPLACE: e.g., HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate>'
$regName  = '<REPLACE: value name>'
${isRead ? `
try {
    if (Test-Path $regPath) {
        $val = (Get-ItemProperty -Path $regPath -ErrorAction Stop).$regName
        Write-Output "Value: $regName = $val"
        exit 0
    } else {
        Write-Output "Path not found: $regPath"
        exit 1
    }
} catch {
    Write-Output "Error reading registry: $_"
    exit 1
}` : `$regValue = '<REPLACE: desired value>'
$regType  = 'DWord'   # DWord | String | ExpandString | MultiString | QWord | Binary

# ── BACKUP current value (recommended before any change) ─────────────
$backupPath = "$env:TEMP\\RegBackup_$(Get-Date -Format 'yyyyMMdd_HHmmss').reg"
try {
    $currentVal = (Get-ItemProperty -Path $regPath -EA SilentlyContinue).$regName
    if ($null -ne $currentVal) {
        Write-Output "Backed up current value: $regName = $currentVal"
    }
} catch {}

# ── APPLY CHANGE ──────────────────────────────────────────────────────
try {
    if (-not (Test-Path $regPath)) {
        New-Item -Path $regPath -Force | Out-Null
        Write-Output "Created key: $regPath"
    }
    Set-ItemProperty -Path $regPath -Name $regName -Value $regValue -Type $regType -Force
    Write-Output "Set: $regName = $regValue"

    # Verify
    $check = (Get-ItemProperty -Path $regPath).$regName
    if ($check -eq $regValue) {
        Write-Output "Verified: $regName = $check"
        exit 0
    } else {
        Write-Output "Verification failed: got $check"
        exit 1
    }
} catch {
    Write-Output "Error: $_"
    exit 1
}`}`;
  },

  // ── Template: Service Management ───────────────
  _tpl_serviceManagement(config) {
    const req = config.requirement || 'Service management';
    const taskType = config.taskType || 'configuration';
    const date = new Date().toISOString().slice(0, 10);
    const isDetect = taskType === 'detection';
    return `#Requires -Version 5.1
<#
.SYNOPSIS
    Service ${isDetect ? 'Detection' : 'Management'}: ${req}
.NOTES
    Generated : ${date} — MOCK (Template-based) — review before use
    Status    : DRAFT
#>

$serviceName    = '<REPLACE: service short name, e.g. WinRM>'
$expectedStatus = 'Running'           # Running | Stopped
$expectedStart  = 'Automatic'         # Automatic | AutomaticDelayedStart | Manual | Disabled

try {
    $svc = Get-Service -Name $serviceName -ErrorAction Stop
    Write-Output "Service: $($svc.DisplayName) | Status: $($svc.Status) | StartType: $($svc.StartType)"

    ${isDetect ? `if ($svc.Status -eq $expectedStatus) {
        Write-Output "COMPLIANT"
        exit 0
    } else {
        Write-Output "NON-COMPLIANT: Status is $($svc.Status), expected $expectedStatus"
        exit 1
    }` : `# ── SET STARTUP TYPE ─────────────────────────────────────────────
    if ($svc.StartType -ne $expectedStart) {
        Set-Service -Name $serviceName -StartupType $expectedStart -ErrorAction Stop
        Write-Output "Set startup type to $expectedStart"
    }

    # ── ENSURE RUNNING ────────────────────────────────────────────────
    if ($svc.Status -ne $expectedStatus) {
        if ($expectedStatus -eq 'Running') {
            Start-Service -Name $serviceName -ErrorAction Stop
            Write-Output "Started $serviceName"
        } elseif ($expectedStatus -eq 'Stopped') {
            Stop-Service -Name $serviceName -Force -ErrorAction Stop
            Write-Output "Stopped $serviceName"
        }
    } else {
        Write-Output "Service is already $expectedStatus — no change needed"
    }

    # Verify
    $svc = Get-Service -Name $serviceName -ErrorAction Stop
    if ($svc.Status -eq $expectedStatus) {
        Write-Output "Verified: $serviceName is $expectedStatus"
        exit 0
    } else {
        Write-Output "Verification failed: $serviceName is $($svc.Status)"
        exit 1
    }`}
} catch {
    Write-Output "Error: $_"
    exit 1
}`;
  },

  // ── Template: Event Log Query ──────────────────
  _tpl_eventLogQuery(config) {
    const req = config.requirement || 'Event log query';
    const date = new Date().toISOString().slice(0, 10);
    return `#Requires -Version 5.1
<#
.SYNOPSIS
    Event Log Query: ${req}
.DESCRIPTION
    Read-only query of Windows Event Logs.
    Results written to stdout. Does not modify device state.
.NOTES
    Generated : ${date} — MOCK (Template-based) — review before use
    Status    : DRAFT
#>

# ── PARAMETERS — customise these ────────────────────────────────────
$logName    = 'System'        # System | Application | Security | <custom log name>
$eventId    = $null           # e.g. 7045 (service installed). $null = no filter.
$source     = $null           # e.g. 'Service Control Manager'. $null = no filter.
$hoursBack  = 24              # How far back to look
$maxResults = 20
# ─────────────────────────────────────────────────────────────────────

$since = (Get-Date).AddHours(-$hoursBack)

try {
    $filter = @{ LogName = $logName; StartTime = $since }
    if ($null -ne $eventId) { $filter.Id = $eventId }
    if ($null -ne $source)  { $filter.ProviderName = $source }

    $events = Get-WinEvent -FilterHashtable $filter -MaxEvents $maxResults -ErrorAction Stop |
        Select-Object TimeCreated, Id, LevelDisplayName, ProviderName, Message

    if ($events.Count -eq 0) {
        Write-Output "No events found matching criteria in the last $hoursBack hours."
        exit 0
    }

    Write-Output "Found $($events.Count) event(s):"
    $events | ForEach-Object {
        Write-Output "[$($_.TimeCreated.ToString('yyyy-MM-dd HH:mm:ss'))] ID:$($_.Id) $($_.LevelDisplayName) — $($_.ProviderName)"
        Write-Output "  $($_.Message.Split(\`n)[0])"  # First line of message only
    }

    exit 0
} catch [System.Exception] {
    if ($_.Exception.Message -like '*No events were found*') {
        Write-Output "No matching events in the last $hoursBack hours."
        exit 0
    }
    Write-Output "Error querying event log: $_"
    exit 1
}`;
  },

  // ── Template: Windows Update ───────────────────
  _tpl_windowsUpdate(config) {
    const req = config.requirement || 'Windows Update status';
    const date = new Date().toISOString().slice(0, 10);
    return `#Requires -Version 5.1
<#
.SYNOPSIS
    Windows Update: ${req}
.DESCRIPTION
    Reports Windows Update status. Read-only diagnostic.
.NOTES
    Generated : ${date} — MOCK (Template-based) — review before use
    Status    : DRAFT
#>

try {
    # ── LAST UPDATE INSTALL ───────────────────────────────────────
    $hotfix = Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 5
    Write-Output "=== Last 5 Installed Updates ==="
    $hotfix | ForEach-Object { Write-Output "  $($_.InstalledOn.ToString('yyyy-MM-dd'))  $($_.HotFixID)  $($_.Description)" }

    # ── WINDOWS UPDATE SERVICE ────────────────────────────────────
    $wuSvc = Get-Service -Name wuauserv -ErrorAction SilentlyContinue
    Write-Output "\`n=== Windows Update Service ==="
    Write-Output "  Status: $($wuSvc.Status) | StartType: $($wuSvc.StartType)"

    # ── OS BUILD ─────────────────────────────────────────────────
    $build = (Get-CimInstance -ClassName Win32_OperatingSystem).BuildNumber
    Write-Output "\`n=== OS Build: $build ==="

    # ── PENDING REBOOT CHECK ──────────────────────────────────────
    $pendingReboot = $false
    if (Test-Path 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\WindowsUpdate\\Auto Update\\RebootRequired') {
        $pendingReboot = $true
    }
    if (Test-Path 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\PendingFileRenameOperations') {
        $pendingReboot = $true
    }
    Write-Output "\`nPending Reboot: $pendingReboot"

    exit 0
} catch {
    Write-Output "Error: $_"
    exit 1
}`;
  },

  // ── Template: General ──────────────────────────
  _tpl_general(config, kw) {
    const req = config.requirement || 'General task';
    const ctx = config.context || 'SYSTEM';
    const psVer = config.psVersion || '5.1';
    const os = config.targetOS || 'Windows 10 and later';
    const date = new Date().toISOString().slice(0, 10);
    const isReadOnly = config.readOnly === 'yes';
    return `#Requires -Version ${psVer}
<#
.SYNOPSIS
    ${req}
.DESCRIPTION
    ${isReadOnly ? 'Read-only diagnostic / collection script.' : 'Configuration / administration script.'}
    ${isReadOnly ? 'Does not modify device state.' : '⚠  Modifies device state — test before wide deployment.'}
.NOTES
    Generated  : ${date} — MOCK (Template-based) — review before use
    Target OS  : ${os}
    PS Version : ${psVer}
    Context    : ${ctx}
    Status     : DRAFT
#>

[CmdletBinding(${isReadOnly ? 'SupportsShouldProcess=$false' : 'SupportsShouldProcess=$true'})]
param(
    # <REPLACE: add parameters your script needs>
    # [string]$ComputerName = $env:COMPUTERNAME,
    # [switch]$WhatIf
)

$ErrorActionPreference = 'Stop'

try {
    # ── VALIDATION ────────────────────────────────────────────────
    # Add any prerequisite checks here (admin rights, OS version, etc.)
    # if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole('Administrator')) {
    #     throw 'Script must run as Administrator'
    # }

    # ── MAIN LOGIC ────────────────────────────────────────────────
    # <REPLACE: implement your ${config.taskType || 'task'} logic here>
    Write-Output 'TODO: implement script body'

    # ── OUTPUT / RESULT ───────────────────────────────────────────
    Write-Output 'Script completed'
    exit 0

} catch {
    Write-Error "Script failed: $_"
    exit 1
}`;
  },

  // ── MAIN ENTRY: generate from form config ─────
  generate(config) {
    const kw = this._keywords(config.requirement);
    const tplKey = this._selectTemplate(config, kw);
    let code = '';

    switch (tplKey) {
      case 'intuneDetection':   code = this._tpl_intuneDetection(config, kw); break;
      case 'intuneRemediation': code = this._tpl_intuneRemediation(config, kw); break;
      case 'win32Detection':    code = this._tpl_win32Detection(config); break;
      case 'intuneScript':      code = this._tpl_intuneScript(config, kw); break;
      case 'deviceInventory':   code = this._tpl_deviceInventory(config); break;
      case 'registryOps':       code = this._tpl_registryOps(config); break;
      case 'serviceManagement': code = this._tpl_serviceManagement(config); break;
      case 'eventLogQuery':     code = this._tpl_eventLogQuery(config); break;
      case 'windowsUpdate':     code = this._tpl_windowsUpdate(config); break;
      default:                  code = this._tpl_general(config, kw); break;
    }

    const deploy = this._deployDocs[tplKey] || this._deployDocs.general;
    const exitDoc = this._exitDocs[tplKey] || this._exitDocs.general;

    // Count placeholders
    const phCount = (code.match(/<[A-Z_][A-Z0-9_\s:.,'-]*>/g) || []).length;

    return {
      id: seId(),
      title: config.requirement || 'Untitled Script',
      domain: config.domain,
      taskType: config.taskType,
      workflowType: tplKey,
      code,
      exitBehavior: exitDoc,
      deploymentInstructions: deploy,
      prerequisites: this._buildPrereqs(config, tplKey),
      risks: this._buildRisks(config, tplKey, code),
      testPlan: this._buildTestPlan(config, tplKey),
      status: 'Draft',
      isMock: true,
      mockLabel: 'MOCK (Template-based)',
      placeholderCount: phCount,
      generatedAt: seNow(),
      targetOS: config.targetOS,
      psVersion: config.psVersion,
      context: config.context,
      explanation: this._buildExplanation(config, tplKey, code)
    };
  },

  _buildPrereqs(config, tplKey) {
    const base = ['PowerShell ' + (config.psVersion || '5.1') + ' or later.'];
    const ctx = config.context || 'SYSTEM';
    if (ctx === 'SYSTEM') base.push('Script runs as SYSTEM — full local admin rights available, no user context.');
    if (tplKey === 'intuneDetection' || tplKey === 'intuneRemediation') {
      base.push('Intune license (Microsoft 365 E3/E5, EMS E3/E5, or Intune Plan 1+2) assigned to target devices.');
      base.push('Endpoint Analytics must be enabled in the tenant (Devices > Remediations).');
    }
    if (tplKey === 'win32Detection') base.push('Win32 App packaged as .intunewin using IntuneWinAppUtil.exe.');
    return base;
  },

  _buildRisks(config, tplKey, code) {
    const risks = [];
    let level = 'Low';
    const taskType = config.taskType || '';
    const readOnly = config.readOnly === 'yes';

    if (readOnly || taskType === 'detection' || taskType === 'inventory' || taskType === 'reporting') {
      risks.push({ type: 'info', msg: 'Read-only or detection-only script — does not modify device state.' });
    } else {
      level = 'Medium';
      risks.push({ type: 'warn', msg: 'This script modifies device state. Test on a pilot group before wide deployment.' });
    }

    if (/Remove-Item|Clear-|Format-Volume|del\s|rmdir\s/i.test(code)) {
      level = 'High';
      risks.push({ type: 'danger', msg: 'Destructive command detected (Remove-Item/Clear/Format). Verify targets carefully.' });
    }
    if (/Stop-Computer|Restart-Computer/i.test(code)) {
      level = 'High';
      risks.push({ type: 'danger', msg: 'Restart/shutdown command detected. Ensure this is intentional and well-communicated.' });
    }
    if (/Disable-LocalUser|Remove-LocalUser|Remove-ADUser/i.test(code)) {
      level = 'High';
      risks.push({ type: 'danger', msg: 'User account modification detected. Verify scope does not affect admin accounts.' });
    }
    if (/Set-MpPreference.*DisableRealtime|Set-MpPreference.*Disable/i.test(code)) {
      level = 'Critical';
      risks.push({ type: 'danger', msg: 'Antivirus/security control modification detected. Requires explicit security-team approval.' });
    }
    if (/\$PLACEHOLDER|<REPLACE|<PLACEHOLDER/i.test(code)) {
      risks.push({ type: 'warn', msg: 'Unfilled placeholders detected. Do not deploy until all placeholders are replaced.' });
    }
    risks.push({ type: 'info', msg: 'Generated code is a starting template. A qualified engineer should review before production use.' });
    risks.push({ type: 'info', msg: 'Runtime validation has not been performed (no PowerShell runtime in browser). Test in a safe environment first.' });
    return { level, items: risks };
  },

  _buildTestPlan(config, tplKey) {
    const lines = [
      '1. Review all <REPLACE> and <PLACEHOLDER> markers and fill them in with actual values.',
      '2. Test in a non-production VM or dedicated test device first.',
      '3. Check script output manually before Intune deployment.',
      '4. Verify the exit code is as expected (check $LASTEXITCODE after manual run).',
    ];
    if (tplKey === 'intuneDetection') {
      lines.push('5. Run the Detection script on a known-compliant device: expect exit 0.');
      lines.push('6. Run on a known-non-compliant device: expect exit 1.');
    }
    if (tplKey === 'intuneRemediation') {
      lines.push('5. Intentionally put a device into non-compliant state.');
      lines.push('6. Run the Remediation script — expect exit 0 and device back to compliant state.');
      lines.push('7. Run the Detection script after remediation — it should now exit 0.');
    }
    if (tplKey === 'win32Detection') {
      lines.push('5. Run on a device with the app installed: expect exit 0 with output "DETECTED:".');
      lines.push('6. Run on a device without the app: expect exit 1 with output "NOT DETECTED:".');
    }
    lines.push('7. Deploy to a pilot group (5–10 devices) and review Intune Device Status before wider rollout.');
    return lines;
  },

  _buildExplanation(config, tplKey, code) {
    const level = config.explanationLevel || 'beginner';
    const isBegin = level === 'beginner';
    const sections = [];

    sections.push({
      title: 'What this script does',
      body: `This is a ${tplKey.replace(/([A-Z])/g, ' $1').trim()} script for "${config.requirement || 'your requirement'}". ` +
        (isBegin
          ? 'It runs automatically on your Windows devices via Microsoft Intune and carries out the task described in its comments.'
          : 'It implements the requested task using the appropriate PowerShell patterns and exit-code semantics for the selected workflow.')
    });

    sections.push({
      title: 'Exit code behaviour',
      body: this._exitDocs[tplKey] || this._exitDocs.general
    });

    if (tplKey === 'intuneDetection' || tplKey === 'intuneRemediation') {
      sections.push({
        title: 'Intune Remediations workflow',
        body: isBegin
          ? 'Intune runs the Detection script first. If it exits 1 (non-compliant), Intune automatically runs the Remediation script to fix the issue. You see the pass/fail status in the Intune portal under Devices › Remediations.'
          : 'The Intune Remediations engine (formerly Proactive Remediations) evaluates the detection script at the configured schedule. An exit 1 triggers the remediation script. Results aggregate in the Device Status view. Scripts run in the Intune Management Extension (IME) process as SYSTEM in a 64-bit PowerShell host.'
      });
    }

    sections.push({
      title: 'Key commands used',
      body: this._explainCommands(code, isBegin)
    });

    sections.push({
      title: 'Important notes',
      body: [
        'All &lt;REPLACE&gt; / &lt;PLACEHOLDER&gt; markers must be filled in before use.',
        'This is a MOCK (template-based) output — not AI-generated. Review the logic carefully.',
        'Runtime validation has not been performed. Test in a non-production environment first.',
        'Always test on a pilot group before wide deployment.',
      ].join('<br>')
    });

    return sections;
  },

  _explainCommands(code, beginner) {
    const found = [];
    if (/Get-Service/.test(code))       found.push(beginner ? '<b>Get-Service</b>: reads the current state of a Windows service.' : '<b>Get-Service</b>: queries the ServiceController objects via WMI/SCM.');
    if (/Set-Service/.test(code))       found.push(beginner ? '<b>Set-Service</b>: changes a service startup type.' : '<b>Set-Service</b>: modifies SCM registration for startup type.');
    if (/Start-Service/.test(code))     found.push(beginner ? '<b>Start-Service</b>: starts a stopped service.' : '<b>Start-Service</b>: sends a start control code to the SCM.');
    if (/Get-ItemProperty/.test(code))  found.push(beginner ? '<b>Get-ItemProperty</b>: reads a value from the Windows registry.' : '<b>Get-ItemProperty</b>: reads registry values via the PSDrive provider.');
    if (/Set-ItemProperty/.test(code))  found.push(beginner ? '<b>Set-ItemProperty</b>: writes a value to the Windows registry.' : '<b>Set-ItemProperty</b>: writes a registry value; use -Type to specify the REG_ data type.');
    if (/Get-WinEvent/.test(code))      found.push(beginner ? '<b>Get-WinEvent</b>: searches Windows Event Logs.' : '<b>Get-WinEvent</b>: queries ETW-based event logs using FilterHashtable for performance.');
    if (/Get-CimInstance/.test(code))   found.push(beginner ? '<b>Get-CimInstance</b>: collects hardware/OS information from Windows.' : '<b>Get-CimInstance</b>: queries WMI/CIM classes over the local DCOM or WSMAN transport.');
    if (/Write-Output/.test(code))      found.push(beginner ? '<b>Write-Output</b>: sends text to the output stream — visible in Intune logs.' : '<b>Write-Output</b>: writes to the success/output stream (stdout). Intune captures this for the Device Status view.');
    if (/exit\s+[01]/.test(code))       found.push(beginner ? '<b>exit 0 / exit 1</b>: tells Intune whether the script succeeded (0) or failed/non-compliant (1).' : '<b>exit</b>: sets the process exit code. Intune IME reads this to determine compliance state or success.');
    if (/try\s*\{/.test(code))          found.push(beginner ? '<b>try/catch</b>: if an error occurs inside try{}, the catch{} block handles it gracefully instead of crashing.' : '<b>try/catch</b>: structured exception handling. Catches terminating errors; set $ErrorActionPreference = "Stop" to ensure non-terminating errors also throw.');
    return found.length ? found.join('<br>') : 'Review the inline comments in the generated script for command explanations.';
  }
};

// ──────────────────────────────────────────────
// SCRIPT VALIDATOR
// ──────────────────────────────────────────────
const ScriptValidator = {

  validate(code, config) {
    if (!code || !code.trim()) {
      return { passed: false, summary: 'No code to validate.', checks: [] };
    }
    const checks = [];

    // 1. Placeholder check
    const placeholders = code.match(/<[A-Z_][A-Z0-9_\s:.,'-]*>/g) || [];
    checks.push({
      id: 'placeholders',
      label: 'Placeholder check',
      status: placeholders.length === 0 ? 'pass' : 'fail',
      detail: placeholders.length === 0
        ? 'No unfilled placeholders detected.'
        : `${placeholders.length} unfilled placeholder(s): ${[...new Set(placeholders)].slice(0, 5).join(', ')}${placeholders.length > 5 ? '…' : ''}. Replace before use.`
    });

    // 2. Destructive commands
    const destructive = [];
    if (/\bRemove-Item\b/.test(code))     destructive.push('Remove-Item');
    if (/\bClear-\w+/.test(code))         destructive.push('Clear-*');
    if (/\bFormat-Volume\b/.test(code))   destructive.push('Format-Volume');
    if (/\bStop-Computer\b/.test(code))   destructive.push('Stop-Computer');
    if (/\bRestart-Computer\b/.test(code)) destructive.push('Restart-Computer');
    if (/\bDisable-LocalUser\b/.test(code)) destructive.push('Disable-LocalUser');
    if (/\bRemove-LocalUser\b/.test(code)) destructive.push('Remove-LocalUser');
    if (/IEX\b|Invoke-Expression/.test(code)) destructive.push('Invoke-Expression (risk of code injection)');
    if (/DownloadFile|DownloadString|Start-BitsTransfer/.test(code)) destructive.push('Network download command — validate source');
    checks.push({
      id: 'destructive',
      label: 'Destructive-command check',
      status: destructive.length === 0 ? 'pass' : 'warn',
      detail: destructive.length === 0
        ? 'No obviously destructive commands found.'
        : `Flagged commands: ${destructive.join(', ')}. Review scope and impact carefully.`
    });

    // 3. Error handling check
    const hasTryCatch = /try\s*\{[\s\S]*catch\s*\{/.test(code);
    const hasExitCodes = /exit\s+[01]/.test(code);
    checks.push({
      id: 'errorHandling',
      label: 'Error handling',
      status: hasTryCatch ? 'pass' : 'warn',
      detail: hasTryCatch
        ? 'try/catch block detected.'
        : 'No try/catch found. Consider wrapping the main logic in try/catch for reliable exit-code behaviour.'
    });

    // 4. Exit-code check (for Intune workflows)
    const wf = (config && config.workflowType) || '';
    if (wf.includes('intune') || wf.includes('win32')) {
      checks.push({
        id: 'exitCodes',
        label: 'Exit-code check (Intune workflow)',
        status: hasExitCodes ? 'pass' : 'warn',
        detail: hasExitCodes
          ? 'exit 0 / exit 1 detected — appropriate for Intune workflows.'
          : 'No explicit exit codes detected. Intune workflows rely on exit codes to determine success/compliance.'
      });
    }

    // 5. Structural check
    const hasRequires = /#Requires/.test(code);
    const hasSynopsis = /\.SYNOPSIS/.test(code);
    checks.push({
      id: 'structure',
      label: 'Script structure',
      status: (hasRequires && hasSynopsis) ? 'pass' : 'info',
      detail: (!hasRequires ? '#Requires statement missing. ' : '') + (!hasSynopsis ? '.SYNOPSIS comment-based help missing.' : 'Structure looks good.')
    });

    // 6. Runtime / AST check (not available in browser)
    checks.push({
      id: 'runtime',
      label: 'PowerShell AST / runtime check',
      status: 'not-run',
      detail: 'Runtime validation is not available in the browser. Use the PowerShell ISE, VS Code with the PowerShell extension, or PSScriptAnalyzer to validate syntax before deployment.'
    });

    // 7. PSScriptAnalyzer
    checks.push({
      id: 'pssa',
      label: 'PSScriptAnalyzer',
      status: 'not-run',
      detail: 'PSScriptAnalyzer is not available in the browser. Run Invoke-ScriptAnalyzer -Path .\\yourscript.ps1 locally before deployment.'
    });

    const failCount  = checks.filter(c => c.status === 'fail').length;
    const warnCount  = checks.filter(c => c.status === 'warn').length;
    const passCount  = checks.filter(c => c.status === 'pass').length;
    const passed     = failCount === 0;

    return {
      passed,
      summary: `${passCount} passed · ${warnCount} warning(s) · ${failCount} failed · Runtime checks: Not Run`,
      checks
    };
  }
};

// ──────────────────────────────────────────────
// EXPORT HELPER
// ──────────────────────────────────────────────
const ExportHelper = {
  downloadPS1(code, filename) {
    if (!code) return;
    const blob = new Blob(['\uFEFF' + code], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = (filename || 'script').replace(/[^\w\s.-]/g, '_') + '.ps1';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
  },

  copyCode(code) {
    if (!code) return false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).catch(() => this._fallbackCopy(code));
      return true;
    }
    return this._fallbackCopy(code);
  },

  _fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy');
    ta.remove(); return ok;
  }
};

// ──────────────────────────────────────────────
// UI HANDLERS — called by onclick in page renders
// ──────────────────────────────────────────────

// Temporary state for the current session (not persisted)
let SE_currentScript = null;
let SE_libraryFilter = '';
let SE_libraryCat    = 'all';

function seGenerateScript() {
  const get = id => (document.getElementById(id) || {}).value || '';
  const config = {
    requirement     : get('se-req'),
    domain          : get('se-domain'),
    taskType        : get('se-task'),
    targetOS        : get('se-os'),
    psVersion       : get('se-psver'),
    context         : get('se-context'),
    bitness         : get('se-bitness'),
    desiredOutput   : get('se-output'),
    explanationLevel: get('se-explain'),
    readOnly        : get('se-readonly')
  };

  if (!config.requirement.trim()) {
    seShowNotice('Please enter a plain-English requirement before generating.', 'warn');
    document.getElementById('se-req').focus();
    return;
  }

  // Show spinner
  const btn = document.getElementById('se-gen-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Generating…'; }

  setTimeout(() => {
    try {
      const result = ScriptGenerator.generate(config);
      SE_currentScript = result;
      seRenderResult(result);
      if (btn) { btn.disabled = false; btn.textContent = '⚡ Generate Script'; }
      // Scroll to result
      const el = document.getElementById('se-result');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      console.error(err);
      seShowNotice('Generation error: ' + err.message, 'error');
      if (btn) { btn.disabled = false; btn.textContent = '⚡ Generate Script'; }
    }
  }, 300);
}

function seRenderResult(result) {
  const el = document.getElementById('se-result');
  if (!el) return;

  const val = ScriptValidator.validate(result.code, result);
  const phClass = result.placeholderCount > 0 ? 'badge-warn' : 'badge-ok';
  const phLabel = result.placeholderCount > 0
    ? `⚠ ${result.placeholderCount} placeholder(s) to fill`
    : '✓ No placeholders';

  el.style.display = 'block';
  el.innerHTML = `
<div class="se-result-header">
  <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
    <span class="se-badge se-badge-draft">● DRAFT</span>
    <span class="se-badge se-badge-mock">🔧 MOCK (Template)</span>
    <span class="se-badge ${phClass}">${phLabel}</span>
    <span style="font-size:11px;color:var(--muted);margin-left:auto">${seDateFmt(result.generatedAt)}</span>
  </div>
  <h2 style="margin-top:10px;font-size:18px">${seEscape(result.title)}</h2>
  <p style="font-size:13px;color:var(--muted);margin-top:4px">Workflow: <b>${result.workflowType}</b> &nbsp;|&nbsp; Domain: ${result.domain} &nbsp;|&nbsp; Task: ${result.taskType}</p>
</div>

<div class="tabs" id="se-tabs">
  <div class="tab active" onclick="seTab('code')">📄 Code</div>
  <div class="tab" onclick="seTab('explain')">📖 Explanation</div>
  <div class="tab" onclick="seTab('validate')">✅ Validation</div>
  <div class="tab" onclick="seTab('risks')">⚠ Risks</div>
  <div class="tab" onclick="seTab('deploy')">🚀 Deployment</div>
</div>

<div id="se-tab-code" class="tab-panel active">
  <div class="se-code-toolbar">
    <button class="btn btn-outline se-btn-sm" onclick="seCopyCode()">📋 Copy</button>
    <button class="btn btn-outline se-btn-sm" onclick="seDownload()">⬇ Download .ps1</button>
    <button class="btn btn-primary se-btn-sm" onclick="seSaveToLibrary()">💾 Save to Library</button>
  </div>
  <div class="code-block" id="se-codebox" style="min-height:300px;max-height:600px;overflow-y:auto;tab-size:4">${highlightPS(result.code)}</div>
</div>

<div id="se-tab-explain" class="tab-panel">
  ${(result.explanation || []).map(s => `
  <div class="section" style="margin-bottom:12px">
    <h2>${s.title}</h2>
    <p>${s.body}</p>
  </div>`).join('')}
</div>

<div id="se-tab-validate" class="tab-panel">
  <p style="font-size:13px;color:var(--muted);margin-bottom:16px">${seEscape(val.summary)}</p>
  ${val.checks.map(c => `
  <div class="se-val-row se-val-${c.status}">
    <span class="se-val-icon">${{ pass: '✅', fail: '❌', warn: '⚠️', info: 'ℹ️', 'not-run': '⏸' }[c.status] || '—'}</span>
    <div>
      <div style="font-weight:700;font-size:13px">${c.label}</div>
      <div style="font-size:12px;color:var(--muted);margin-top:2px">${seEscape(c.detail)}</div>
    </div>
  </div>`).join('')}
  <div class="callout callout-warn" style="margin-top:16px">
    <span>⚠️</span>
    <span>These checks are <b>static only</b>. No PowerShell runtime is available in the browser. Runtime validation, AST parsing, and PSScriptAnalyzer checks have not been performed. Always test the script manually before deploying to devices.</span>
  </div>
</div>

<div id="se-tab-risks" class="tab-panel">
  <div class="se-risk-level se-risk-${result.risks.level.toLowerCase()}" style="margin-bottom:16px">
    Risk Level: <b>${result.risks.level}</b>
  </div>
  ${result.risks.items.map(r => `
  <div class="se-val-row se-val-${r.type === 'danger' ? 'fail' : r.type === 'warn' ? 'warn' : 'pass'}">
    <span class="se-val-icon">${r.type === 'danger' ? '🚫' : r.type === 'warn' ? '⚠️' : 'ℹ️'}</span>
    <div style="font-size:13px">${seEscape(r.msg)}</div>
  </div>`).join('')}
  <div class="callout callout-warn" style="margin-top:16px">
    <span>🚫</span>
    <span>A risk scan does <b>not</b> prove a script is safe. This is a static analysis only. A qualified engineer must review all changes before production deployment.</span>
  </div>
</div>

<div id="se-tab-deploy" class="tab-panel">
  <h3 style="margin-bottom:12px">Exit-code behaviour</h3>
  <div class="callout callout-info" style="margin-bottom:16px"><span>ℹ️</span><span>${seEscape(result.exitBehavior)}</span></div>
  <h3 style="margin-bottom:12px">Deployment steps</h3>
  <ol class="se-deploy-steps">${(result.deploymentInstructions || []).map(s => `<li>${seEscape(s)}</li>`).join('')}</ol>
  <h3 style="margin-top:20px;margin-bottom:12px">Prerequisites</h3>
  <ul class="se-prereq-list">${(result.prerequisites || []).map(p => `<li>${seEscape(p)}</li>`).join('')}</ul>
  <h3 style="margin-top:20px;margin-bottom:12px">Test plan</h3>
  <ol class="se-deploy-steps">${(result.testPlan || []).map(s => `<li>${seEscape(s)}</li>`).join('')}</ol>
</div>
`;
}

function seTab(name) {
  const names = ['code', 'explain', 'validate', 'risks', 'deploy'];
  names.forEach(n => {
    const panel = document.getElementById('se-tab-' + n);
    if (panel) panel.classList.toggle('active', n === name);
  });
  const tabs = document.querySelectorAll('#se-tabs .tab');
  tabs.forEach((t, i) => t.classList.toggle('active', i === names.indexOf(name)));
}

function seCopyCode() {
  if (!SE_currentScript) return;
  const ok = ExportHelper.copyCode(SE_currentScript.code);
  seShowNotice(ok ? '✓ Code copied to clipboard' : 'Copy failed — please copy manually from the code block.', ok ? 'ok' : 'warn');
}

function seDownload() {
  if (!SE_currentScript) return;
  const safe = (SE_currentScript.title || 'script').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
  ExportHelper.downloadPS1(SE_currentScript.code, safe);
}

function seSaveToLibrary() {
  if (!SE_currentScript) return;
  const script = ScriptLibrary.add({
    title      : SE_currentScript.title,
    description: 'Generated: ' + SE_currentScript.taskType + ' (' + SE_currentScript.domain + ')',
    category   : SE_currentScript.domain,
    workflowType: SE_currentScript.workflowType,
    code       : SE_currentScript.code,
    tags       : [SE_currentScript.domain, SE_currentScript.taskType],
    isMock     : true,
    status     : 'Draft',
    risks      : SE_currentScript.risks,
    exitBehavior: SE_currentScript.exitBehavior,
    deploymentInstructions: SE_currentScript.deploymentInstructions,
    prerequisites: SE_currentScript.prerequisites
  });
  seShowNotice(`✓ Saved to Script Library: "${script.title}"`, 'ok');
}

function seShowNotice(msg, type) {
  let el = document.getElementById('se-notice');
  if (!el) {
    el = document.createElement('div');
    el.id = 'se-notice';
    el.style.cssText = 'position:fixed;bottom:24px;right:24px;padding:12px 18px;border-radius:8px;font-size:13px;font-weight:600;z-index:9999;max-width:380px;box-shadow:0 4px 20px rgba(0,0,0,.4);transition:opacity .3s';
    document.body.appendChild(el);
  }
  el.style.background = type === 'ok' ? 'var(--success)' : type === 'warn' ? '#7a5c00' : type === 'error' ? 'var(--danger)' : 'var(--accent)';
  el.style.color = '#fff';
  el.style.opacity = '1';
  el.textContent = msg;
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.style.opacity = '0'; }, 3000);
}

// ── Library UI handlers ────────────────────────
function seLibFilter(val) {
  SE_libraryFilter = val;
  seRenderLibraryList();
}

function seLibCat(cat) {
  SE_libraryCat = cat;
  document.querySelectorAll('.se-lib-cat-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
  seRenderLibraryList();
}

function seRenderLibraryList() {
  const el = document.getElementById('se-lib-list');
  if (!el) return;
  const q   = SE_libraryFilter.toLowerCase();
  const cat = SE_libraryCat;
  let scripts = ScriptLibrary.list().filter(s => {
    const matchCat = cat === 'all' || s.category === cat || s.workflowType === cat;
    const matchQ   = !q || s.title.toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q) || (s.tags || []).join(' ').toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  if (!scripts.length) {
    el.innerHTML = `<div class="se-empty-state">
      <div style="font-size:40px;margin-bottom:10px">📚</div>
      <div style="font-weight:700;margin-bottom:6px">${SE_libraryFilter ? 'No scripts match your search.' : 'Your library is empty.'}</div>
      <div style="font-size:13px;color:var(--muted)">${SE_libraryFilter ? 'Try a different search term.' : 'Generate a script in the AI Script Studio and save it here.'}</div>
    </div>`;
    return;
  }

  el.innerHTML = scripts.map(s => `
<div class="se-lib-card" id="slc-${s.id}">
  <div class="se-lib-card-head">
    <div style="flex:1;min-width:0">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:5px">
        <span class="se-badge se-badge-${s.status === 'Draft' ? 'draft' : 'tested'}">${s.status}</span>
        <span class="se-badge se-badge-mock" style="font-size:10px">${s.workflowType || s.category || '—'}</span>
        ${s.isMock ? '<span class="se-badge se-badge-mock" style="font-size:10px">MOCK</span>' : ''}
      </div>
      <div style="font-weight:700;font-size:14px;margin-bottom:3px">${seEscape(s.title)}</div>
      <div style="font-size:12px;color:var(--muted)">${seEscape(s.description || '')} &nbsp;•&nbsp; ${seDateFmt(s.updatedAt)}</div>
      ${(s.tags||[]).length ? '<div style="margin-top:6px">' + s.tags.map(t => `<span class="se-tag">${seEscape(t)}</span>`).join('') + '</div>' : ''}
    </div>
    <div class="se-lib-card-actions">
      <button class="btn btn-outline se-btn-sm" onclick="seLibView('${s.id}')">View</button>
      <button class="btn btn-outline se-btn-sm" onclick="seLibDuplicate('${s.id}')">Duplicate</button>
      <button class="btn btn-outline se-btn-sm" onclick="seLibExport('${s.id}')">⬇ .ps1</button>
      <button class="btn se-btn-sm se-btn-danger" onclick="seLibDelete('${s.id}')">Delete</button>
    </div>
  </div>
</div>`).join('');
}

function seLibView(id) {
  const s = ScriptLibrary.get(id);
  if (!s) return;
  const modal = document.getElementById('se-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  modal.innerHTML = `
<div class="se-modal-box">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
    <div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:4px">Script Library &rsaquo; View</div>
      <h2 style="font-size:17px">${seEscape(s.title)}</h2>
    </div>
    <button class="btn btn-outline se-btn-sm" onclick="seModalClose()">✕ Close</button>
  </div>
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
    <span class="se-badge se-badge-${s.status === 'Draft' ? 'draft' : 'tested'}">${s.status}</span>
    ${s.isMock ? '<span class="se-badge se-badge-mock">MOCK</span>' : ''}
    <span style="font-size:11px;color:var(--muted)">Updated: ${seDateFmt(s.updatedAt)}</span>
  </div>
  <div class="code-block" style="max-height:450px;overflow-y:auto;margin-bottom:12px;font-size:12px">${highlightPS(s.code || '')}</div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="seLibExport('${s.id}')">⬇ Download .ps1</button>
    <button class="btn btn-outline" onclick="seLibCopyCode('${s.id}')">📋 Copy Code</button>
    <button class="btn btn-outline" onclick="seModalClose()">Close</button>
  </div>
</div>`;
}

function seModalClose() {
  const m = document.getElementById('se-modal');
  if (m) m.style.display = 'none';
}

function seLibCopyCode(id) {
  const s = ScriptLibrary.get(id);
  if (!s) return;
  ExportHelper.copyCode(s.code);
  seShowNotice('✓ Code copied to clipboard', 'ok');
}

function seLibExport(id) {
  const s = ScriptLibrary.get(id);
  if (!s) return;
  const safe = (s.title || 'script').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
  ExportHelper.downloadPS1(s.code, safe);
}

function seLibDuplicate(id) {
  const copy = ScriptLibrary.duplicate(id);
  if (!copy) return;
  seShowNotice(`✓ Duplicated as "${copy.title}"`, 'ok');
  seRenderLibraryList();
}

function seLibDelete(id) {
  const s = ScriptLibrary.get(id);
  if (!s) return;
  if (!confirm(`Delete "${s.title}"?\n\nThis cannot be undone.`)) return;
  ScriptLibrary.remove(id);
  seShowNotice('Deleted: ' + s.title, 'ok');
  seRenderLibraryList();
}

// ── Validator page handlers ────────────────────
function seValidateInput() {
  const code = (document.getElementById('se-val-input') || {}).value || '';
  const wfEl = document.getElementById('se-val-workflow');
  const config = { workflowType: wfEl ? wfEl.value : '' };
  const result = ScriptValidator.validate(code, config);
  const el = document.getElementById('se-val-result');
  if (!el) return;

  el.style.display = 'block';
  el.innerHTML = `
<div style="margin-bottom:14px;font-size:13px;font-weight:600;color:${result.passed ? 'var(--success)' : 'var(--danger)'}">
  ${result.passed ? '✓ No blocking issues found' : '✗ Issues detected — review before deploying'}
</div>
<p style="font-size:12px;color:var(--muted);margin-bottom:14px">${seEscape(result.summary)}</p>
${result.checks.map(c => `
<div class="se-val-row se-val-${c.status}">
  <span class="se-val-icon">${{ pass: '✅', fail: '❌', warn: '⚠️', info: 'ℹ️', 'not-run': '⏸' }[c.status] || '—'}</span>
  <div>
    <div style="font-weight:700;font-size:13px">${c.label}</div>
    <div style="font-size:12px;color:var(--muted);margin-top:2px">${seEscape(c.detail)}</div>
  </div>
</div>`).join('')}
<div class="callout callout-warn" style="margin-top:16px">
  <span>⚠️</span>
  <span>These are static checks only. Runtime/AST/PSScriptAnalyzer checks require a local PowerShell environment. A passing result here does <b>not</b> mean the script is safe to deploy.</span>
</div>`;
}

// ── DR Builder ─────────────────────────────────
function seDRGenerate() {
  const get = id => (document.getElementById(id) || {}).value || '';
  const config = {
    requirement : get('dr-req'),
    domain      : 'intune',
    taskType    : 'detection',
    targetOS    : get('dr-os'),
    psVersion   : get('dr-psver'),
    context     : 'SYSTEM',
    explanationLevel: 'beginner'
  };
  if (!config.requirement.trim()) {
    seShowNotice('Enter a requirement first.', 'warn');
    return;
  }
  const det = ScriptGenerator.generate(config);
  const rem = ScriptGenerator.generate(Object.assign({}, config, { taskType: 'remediation' }));

  const el = document.getElementById('dr-result');
  if (!el) return;
  // Store both scripts for onclick access
  window._drDet = det.code;
  window._drRem = rem.code;

  el.style.display = 'block';
  el.innerHTML = `
<div class="tabs" id="dr-tabs">
  <div class="tab active" onclick="drTab('detection')">🔍 Detection Script</div>
  <div class="tab" onclick="drTab('remediation')">🔧 Remediation Script</div>
  <div class="tab" onclick="drTab('guide')">📋 Deployment Guide</div>
</div>
<div id="dr-tab-detection" class="tab-panel active">
  <div class="se-code-toolbar">
    <button class="btn btn-outline se-btn-sm" onclick="ExportHelper.copyCode(window._drDet);seShowNotice('Copied','ok')">📋 Copy</button>
    <button class="btn btn-outline se-btn-sm" onclick="ExportHelper.downloadPS1(window._drDet,'detection-script')">⬇ .ps1</button>
  </div>
  <div class="code-block" style="max-height:500px;overflow-y:auto">${highlightPS(det.code)}</div>
</div>
<div id="dr-tab-remediation" class="tab-panel">
  <div class="se-code-toolbar">
    <button class="btn btn-outline se-btn-sm" onclick="ExportHelper.copyCode(window._drRem);seShowNotice('Copied','ok')">📋 Copy</button>
    <button class="btn btn-outline se-btn-sm" onclick="ExportHelper.downloadPS1(window._drRem,'remediation-script')">⬇ .ps1</button>
  </div>
  <div class="code-block" style="max-height:500px;overflow-y:auto">${highlightPS(rem.code)}</div>
</div>
<div id="dr-tab-guide" class="tab-panel">
  <div class="section"><h2>🚀 How to deploy this Remediation pair</h2>
    ${(ScriptGenerator._deployDocs.intuneDetection || []).map((s, i) => `<p><b>${i + 1}.</b> ${seEscape(s)}</p>`).join('')}
    <div class="callout callout-warn" style="margin-top:12px"><span>⚠️</span><span>Both scripts are DRAFT (MOCK). Fill in all &lt;PLACEHOLDER&gt; values and test on a non-production device before deploying.</span></div>
  </div>
</div>`;
}

function drTab(name) {
  const names = ['detection', 'remediation', 'guide'];
  names.forEach(n => {
    const p = document.getElementById('dr-tab-' + n);
    if (p) p.classList.toggle('active', n === name);
  });
  const tabs = document.querySelectorAll('#dr-tabs .tab');
  tabs.forEach((t, i) => t.classList.toggle('active', i === names.indexOf(name)));
}

// ── Troubleshooter ─────────────────────────────
const TROUBLE_DB = [
  { code: '0x87D300D9', title: 'IME not installed', cat: 'intune', why: 'The Intune Management Extension (IME) is not installed on the device. This agent is required to run Win32 apps, Platform Scripts, and Remediations.', causes: ['Device enrolled via MDM but IME was never deployed.', 'IME uninstalled manually or by a conflicting tool.', 'Device is co-managed and the Intune workload for apps is set to SCCM.'], steps: ['Check IME: File Explorer › C:\\Program Files (x86)\\Microsoft Intune Management Extension\\', 'Event logs: Applications and Services › Microsoft-Windows-DeviceManagement-Enterprise-Diagnostics-Provider', 'Force IME install: Devices › [device] › Sync in Intune portal', 'Review co-management workloads if co-managed.'], prevent: 'Assign a Win32 app or script to a group that includes the device; IME auto-installs on first assignment.' },
  { code: '0x80073CF9', title: 'App conflict / version clash', cat: 'intune', why: 'An older or conflicting version of the app is already installed. Intune cannot install over it.', causes: ['Legacy MSI version installed via GPO or SCCM.', 'Same app installed from a different source (store, manual install).', 'Architecture mismatch (x86 vs x64).'], steps: ['Check installed apps on device: Settings › Apps.', 'Use detection-only run first to confirm what is installed.', 'Add a pre-install uninstall command in the Win32 app wrapper.', 'Review: Apps › [app] › Device install status for exact error detail.'], prevent: 'Use the "Return codes" and "Supersedence" features in Intune Win32 apps to handle upgrades cleanly.' },
  { code: '0x80004005', title: 'Unspecified error / access denied', cat: 'intune', why: 'A generic error that usually means a permissions problem or a failed operation with no specific code.', causes: ['Script running as User but requires SYSTEM rights.', 'File/registry path that SYSTEM does not have access to.', 'Network resource unavailable.'], steps: ['Check execution context (User vs SYSTEM) in Intune.', 'Reproduce manually as SYSTEM: psexec -i -s powershell.exe', 'Review IME log: %ProgramData%\\Microsoft\\IntuneManagementExtension\\Logs\\'], prevent: 'Test scripts as SYSTEM locally before deploying via Intune.' },
  { code: '0x87D13B64', title: 'Compliance evaluation timeout', cat: 'intune', why: 'The compliance policy evaluation timed out on the device.', causes: ['Device has not checked in for over 30 days.', 'IME or compliance service not responding.', 'Azure AD connectivity issue.'], steps: ['Force sync: Intune portal › Devices › [device] › Sync.', 'Check last check-in date in device properties.', 'Verify device has network connectivity and can reach login.microsoftonline.com'], prevent: 'Set a conditional access policy to block access for devices not checked in for 30+ days.' },
  { code: '1641', title: 'Reboot required (success with reboot)', cat: 'win32', why: 'The app installed successfully but requires a reboot to complete.', causes: ['Installer returned 1641 (standard Windows reboot-needed exit code).'], steps: ['This is expected for many installers.', 'Configure the Intune Win32 app "Return codes" section: add 1641 as Soft reboot.', 'If unintended, look for a silent install switch that suppresses the reboot.'], prevent: 'Always map installer return codes 1641 and 3010 as "Soft reboot" in the Win32 app configuration.' },
  { code: '3010', title: 'Reboot required (success)', cat: 'win32', why: 'Same as 1641 — install succeeded but a reboot is needed.', causes: ['Standard installer return code for "success, reboot later".'], steps: ['Add 3010 as a "Soft reboot" return code in the Win32 app configuration.'], prevent: 'Map 3010 as Soft reboot in all Win32 app wrappers.' },
  { code: 'Script timed out', title: 'Script execution timeout (Remediation)', cat: 'remediation', why: 'Intune Remediations have a default 15-minute execution limit. Long-running scripts are killed.', causes: ['Script has a loop with no timeout.', 'Script waiting for a network resource.', 'Script doing heavy computation.'], steps: ['Add a timeout to any loops or network calls.', 'Break long tasks into smaller, re-runnable remediations.', 'Check for infinite loops or missing -ErrorAction Stop on stuck calls.'], prevent: 'Keep remediation scripts focused and fast. Aim for sub-60-second execution.' },
  { code: 'Non-compliant (no policy)', title: 'Device non-compliant with no policy assigned', cat: 'compliance', why: 'Devices with no compliance policy assigned are Compliant by default, but if the tenant default is changed to Non-compliant they have no path to compliance.', causes: ['Tenant default "Compliance status of devices with no compliance policy" changed to Non-compliant.', 'Device group not targeted by any compliance policy.'], steps: ['Tenant admin › Device compliance settings › check the default.', 'Assign a baseline compliance policy to "All Devices" group.'], prevent: 'Always have a baseline compliance policy assigned to all devices.' },
  { code: 'AADSTS50076', title: 'MFA required / conditional access blocking', cat: 'ca', why: 'Conditional Access is requiring MFA or a compliant device and the user/device does not satisfy the conditions.', causes: ['New CA policy applied before user registered for MFA.', 'Device not yet enrolled or not compliant.'], steps: ['Identify the CA policy blocking access: Azure AD sign-in logs › Failure › Conditional Access tab.', 'Confirm device is enrolled and compliant in Intune.', 'Confirm MFA is registered for the user in aka.ms/mfasetup.'], prevent: 'Use Report-only mode for new CA policies before enabling.' },
];

function seTroubleshoot() {
  const input = (document.getElementById('ts-input') || {}).value || '';
  const el    = document.getElementById('ts-result');
  if (!el) return;
  if (!input.trim()) { seShowNotice('Paste an error code or message first.', 'warn'); return; }

  const q = input.toLowerCase();
  const matches = TROUBLE_DB.filter(e =>
    q.includes(e.code.toLowerCase()) ||
    q.includes(e.title.toLowerCase()) ||
    (q.includes(e.cat))
  );

  if (!matches.length) {
    el.style.display = 'block';
    el.innerHTML = `
<div class="callout callout-warn"><span>🔍</span><span>No exact match found for the pasted content. Try copying just the error code (e.g., <b>0x87D300D9</b>) and searching again, or browse the Error Code reference in the learning modules.</span></div>
<p style="font-size:13px;color:var(--muted);margin-top:12px">General diagnostic steps for unknown Intune errors:</p>
<ol style="font-size:13px;color:var(--muted);padding-left:20px;line-height:2">
  <li>Check IME logs: <code>%ProgramData%\\Microsoft\\IntuneManagementExtension\\Logs</code></li>
  <li>Check Device Management log: Event Viewer › Applications and Services › Microsoft-Windows-DeviceManagement-Enterprise-Diagnostics-Provider</li>
  <li>Force a device sync in the Intune portal: Devices › [device] › Sync.</li>
  <li>Review the specific resource (app, script, policy) status in Intune for device-level error details.</li>
  <li>Search the error code at <a href="https://learn.microsoft.com/en-us/mem/intune/" target="_blank" rel="noopener" style="color:var(--accent2)">Microsoft Intune documentation</a>.</li>
</ol>`;
    return;
  }

  el.style.display = 'block';
  el.innerHTML = matches.map(m => `
<div class="section" style="margin-bottom:14px">
  <h2><span style="font-family:monospace;color:var(--accent2);margin-right:8px">${seEscape(m.code)}</span>${seEscape(m.title)}</h2>
  <p>${seEscape(m.why)}</p>
  <h3>Most likely causes</h3>
  <ul>${m.causes.map(c => `<li>${seEscape(c)}</li>`).join('')}</ul>
  <h3>Resolution steps</h3>
  <ol>${m.steps.map(s => `<li>${seEscape(s)}</li>`).join('')}</ol>
  ${m.prevent ? `<div class="callout callout-tip"><span>💡</span><span><b>Prevention:</b> ${seEscape(m.prevent)}</span></div>` : ''}
</div>`).join('');
}
