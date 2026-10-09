// ============================================================
// INTUNE LEARNING HUB — CONTENT DEFINITIONS
// ============================================================

// ─────────────────────────────────────────────
// CONFIG STEPS HELPER
// Step-by-step portal configuration guide per module.
// Each step: title, portal path, description, optional settings.
// ─────────────────────────────────────────────
function configStepsSection(id) {
  var D = {
    b1: { intro:"How to access the Intune admin center and verify your tenant is ready to manage devices.",
      steps:[
        {t:"Sign in to the Intune Admin Center", p:"intune.microsoft.com",
         d:"Sign in with your Global Admin or Intune Administrator credentials. This is the single management console for all devices, apps, and policies."},
        {t:"Verify MDM Authority", p:"Tenant admin &#8594; Tenant status &#8594; Service release status",
         d:"Confirm MDM authority shows Microsoft Intune. This setting cannot be changed after devices have enrolled.",
         s:[{k:"MDM Authority",v:"Must show: Microsoft Intune (not SCCM)"}]},
        {t:"Assign Intune Licences to Users", p:"Users &#8594; All users &#8594; [select user] &#8594; Licenses &#8594; Assignments",
         d:"Every managed user or device requires a licence. Assign individually or in bulk via Microsoft 365 admin centre.",
         s:[{k:"Minimum licence",v:"Intune Plan 1"},{k:"Recommended",v:"Microsoft 365 E3, EMS E3, or M365 Business Premium"}]},
        {t:"Explore the Dashboard", p:"Home &#8594; Dashboard",
         d:"Review total enrolled devices, compliance percentage, top non-compliance reasons, and pending app deployments. This is your daily operational view."},
        {t:"Check Connector Health (optional)", p:"Tenant admin &#8594; Connectors and tokens",
         d:"Apple MDM Push Certificate is required for iOS/macOS. Google Play for Android Enterprise. Connector status shows green when healthy, red when expired.",
         s:[{k:"Apple MDM Push Certificate",v:"Renew annually — expiry breaks iOS enrollment"},{k:"Google Play",v:"Required for Android Enterprise (Corporate or BYOD)"}]}
      ]},
    b2: { intro:"How to configure automatic Windows device enrollment so devices join Intune when they connect to Azure AD.",
      steps:[
        {t:"Enable Automatic MDM Enrollment", p:"Devices &#8594; Enroll devices &#8594; Automatic enrollment",
         d:"Set MDM user scope to All (all users) or Some (select a pilot group). This enables Windows devices to auto-enroll when they join Azure AD.",
         s:[{k:"MDM user scope",v:"All — or Some (select pilot group)"},{k:"MAM user scope",v:"All — covers BYOD without full MDM enrollment"},{k:"MDM terms of use URL",v:"Leave blank"}]},
        {t:"Configure Enrollment Restrictions", p:"Devices &#8594; Enroll devices &#8594; Enrollment restrictions &#8594; Device type restrictions",
         d:"Restrict which platforms and OS versions can enroll. The default policy allows everything.",
         s:[{k:"Block personal devices",v:"No (change to Yes for corporate-only environments)"},{k:"Min OS version (Windows)",v:"10.0.18362 (Windows 10 1903 minimum)"}]},
        {t:"Test Enrollment on a Windows 10/11 Device", p:"Device: Settings &#8594; Accounts &#8594; Access work or school &#8594; Connect",
         d:"Enter the corporate email address on the test device. It will join Azure AD and automatically enroll in Intune. Check Intune → Devices → All Devices to confirm it appears within 5 minutes."},
        {t:"Verify Device in Intune", p:"Devices &#8594; All devices &#8594; [find the device]",
         d:"Confirm the device appears with correct enrollment details.",
         s:[{k:"Enrollment type",v:"MDM"},{k:"Managed by",v:"Intune"},{k:"Compliance",v:"Evaluating → then Compliant after policies apply"}]},
        {t:"Force a Policy Sync", p:"Devices &#8594; [select device] &#8594; Sync",
         d:"Click Sync to immediately push all assigned policies and apps to the device rather than waiting up to 8 hours for automatic check-in."}
      ]},
    b3: { intro:"How to create a Windows device compliance policy that defines minimum security requirements for corporate devices.",
      steps:[
        {t:"Create a New Compliance Policy", p:"Devices &#8594; Compliance policies &#8594; Policies &#8594; Create policy",
         d:"Choose Platform: Windows 10 and later, then click Create.",
         s:[{k:"Platform",v:"Windows 10 and later"}]},
        {t:"Name the Policy", p:"Basics tab",
         d:"Use a clear naming convention so admins can identify the policy's scope and version at a glance.",
         s:[{k:"Name example",v:"WIN-Compliance-Standard-v1"},{k:"Description",v:"Standard compliance requirements for all corporate Windows devices"}]},
        {t:"Configure Compliance Settings", p:"Compliance settings tab",
         d:"Set the minimum security bar. Devices that do not meet these settings will be marked non-compliant.",
         s:[{k:"BitLocker",v:"Require"},{k:"Secure Boot",v:"Require"},{k:"Code Integrity",v:"Require"},{k:"Minimum OS version",v:"10.0.19041 (Windows 10 2004)"},{k:"Firewall",v:"Require"},{k:"Antivirus (WMI)",v:"Require"},{k:"Microsoft Defender Antimalware",v:"Require"}]},
        {t:"Set Actions for Non-compliance", p:"Actions for noncompliance tab",
         d:"Stagger the response — give users time to self-remediate before access is blocked.",
         s:[{k:"Day 0",v:"Mark device noncompliant"},{k:"Day 1",v:"Send email notification to user"},{k:"Day 7",v:"Block access via Conditional Access (if CA policy linked)"}]},
        {t:"Assign to Pilot Group First", p:"Assignments tab &#8594; Include groups",
         d:"Always start with a small pilot group. Expand to All Devices after confirming no issues.",
         s:[{k:"Include",v:"SG-Intune-Pilot (5–10 test devices) &#8594; expand to All Devices"},{k:"Exclude",v:"SG-Service-Accounts (kiosks or service devices)"}]},
        {t:"Review and Create", p:"Review + create &#8594; Create",
         d:"After saving, the policy deploys within 8 hours (or force sync). Monitor: Devices &#8594; Monitor &#8594; Device compliance to see per-device results."}
      ]},
    b4: { intro:"How to add and deploy Microsoft 365 Apps (Office) to Windows devices silently via Intune.",
      steps:[
        {t:"Add a New App", p:"Apps &#8594; Windows &#8594; Add",
         d:"In the app type selector choose: Microsoft 365 Apps &#8594; Windows 10 and later. Click Select.",
         s:[{k:"App type",v:"Microsoft 365 Apps — Windows 10 and later"}]},
        {t:"Configure the App Suite", p:"App suite configuration tab",
         d:"Select which Office apps to bundle and the update cadence for your organisation.",
         s:[{k:"Apps to include",v:"Word, Excel, Outlook, Teams, OneDrive, OneNote"},{k:"Update channel",v:"Monthly Enterprise Channel (stable, monthly updates)"},{k:"Architecture",v:"64-bit"},{k:"Remove MSI versions",v:"Yes (removes legacy Office MSI installs)"},{k:"Accept EULA",v:"Yes"}]},
        {t:"Set App Information", p:"App information tab",
         d:"Verify the display name and publisher. This is what users see in Company Portal.",
         s:[{k:"Name",v:"Microsoft 365 Apps for Windows"}]},
        {t:"Assign the App", p:"Assignments tab",
         d:"Required = silent install (no user interaction). Available = user chooses from Company Portal.",
         s:[{k:"Required &#8594; group",v:"SG-All-Corporate-Devices (silent install for all managed devices)"},{k:"Available &#8594; group",v:"SG-All-Users (optional install via Company Portal)"}]},
        {t:"Review and Create, then Monitor", p:"Review + create &#8594; Create &#8594; Apps &#8594; Monitor &#8594; App install status",
         d:"Devices install the suite silently on the next sync (15 min–1 hr). Monitor: Apps &#8594; Monitor &#8594; App install status. Check 'Failed' devices for error codes.",
         s:[{k:"Common error 0x87D300D9",v:"IME (Intune Management Extension) not installed — check agent health"},{k:"Common error 0x80073CF9",v:"App conflict — another version already installed"}]}
      ]},
    i1: { intro:"How to create a Windows configuration profile using the Settings Catalog to push settings such as BitLocker, DNS, and restrictions.",
      steps:[
        {t:"Create a New Configuration Profile", p:"Devices &#8594; Configuration &#8594; Create &#8594; New policy",
         d:"Choose Platform: Windows 10 and later. Profile type: Settings catalog (the modern approach — covers all current settings with a search interface).",
         s:[{k:"Platform",v:"Windows 10 and later"},{k:"Profile type",v:"Settings catalog (recommended over Templates for new profiles)"}]},
        {t:"Name the Profile", p:"Basics tab",
         d:"Use a consistent naming standard: [Platform]-[Category]-[Purpose]-[Version].",
         s:[{k:"Name example",v:"WIN-Security-BitLocker-v1"},{k:"Description",v:"Enforces BitLocker full-disk encryption on OS and fixed data drives"}]},
        {t:"Add BitLocker Settings via Settings Catalog", p:"Configuration settings tab &#8594; Add settings &#8594; search 'BitLocker'",
         d:"Use the search box to find settings. Expand the BitLocker category and toggle on each setting you need.",
         s:[{k:"Require Device Encryption",v:"Enabled"},{k:"OS Drive Encryption Method",v:"XTS-AES 256-bit"},{k:"Fixed Drive Encryption Method",v:"XTS-AES 256-bit"},{k:"Startup Authentication Required",v:"Enabled"},{k:"Configure TPM Startup PIN",v:"Require startup PIN with TPM"},{k:"Recovery Key Storage",v:"Azure AD (auto-escrow to tenant)"}]},
        {t:"Assign to Scope and Groups", p:"Assignments tab",
         d:"Assign to a pilot group first, confirm BitLocker activates without issues (no unexpected recovery key prompts), then expand.",
         s:[{k:"Include group",v:"SG-Intune-Pilot &#8594; then SG-All-Corporate-Devices"},{k:"Exclude group",v:"SG-Kiosk-Devices (if using a separate kiosk profile)"}]},
        {t:"Review and Create, then Monitor", p:"Review + create &#8594; Create &#8594; then check: Devices &#8594; Configuration &#8594; [profile name] &#8594; Device and user check-in status",
         d:"Green rows = settings applied. Red = error — click the row to see which setting failed and the exact error code.",
         s:[{k:"Verify BitLocker key escrowed",v:"Devices &#8594; [device name] &#8594; Recovery keys (must show a key after encryption activates)"}]}
      ]},
    i2: { intro:"How to create a Conditional Access policy in Azure AD that requires both MFA and a compliant Intune device.",
      steps:[
        {t:"Open Conditional Access", p:"entra.microsoft.com &#8594; Protection &#8594; Conditional Access &#8594; Policies &#8594; New policy",
         d:"Conditional Access is configured in Azure AD (Entra ID), not in the Intune portal. You need at least Azure AD Premium P1 (included in EMS E3 / M365 E3)."},
        {t:"Name the Policy", p:"Name field at top",
         d:"Number CA policies for easy ordering and management.",
         s:[{k:"Name example",v:"CA001 - Require MFA and Compliant Device for All Apps"}]},
        {t:"Configure Users and Groups", p:"Users section &#8594; Include: All users / Exclude: [break glass account]",
         d:"Always exclude a Break Glass admin account from every CA policy. Without this, you could lock yourself out of the tenant.",
         s:[{k:"Include",v:"All users"},{k:"Exclude",v:"Role: Global Administrator (or specific break-glass account)"}]},
        {t:"Configure Target Resources", p:"Target resources &#8594; Cloud apps &#8594; All cloud apps",
         d:"Apply to all cloud apps for maximum coverage. You can whittle this back later if specific apps need exclusions.",
         s:[{k:"Cloud apps",v:"All cloud apps"},{k:"Exclude if needed",v:"Microsoft Intune Enrollment (exclude to allow enrollment before compliance is checked)"}]},
        {t:"Configure Grant Controls", p:"Grant section",
         d:"Require BOTH MFA and device compliance. Set the combination to require ALL controls.",
         s:[{k:"Require multi-factor authentication",v:"&#10003; Checked"},{k:"Require device to be marked as compliant",v:"&#10003; Checked"},{k:"For multiple controls",v:"Require ALL the selected controls"}]},
        {t:"Enable in Report-Only Mode First", p:"Enable policy &#8594; Report-only",
         d:"NEVER enable a new CA policy immediately. Report-only shows you who would be affected without blocking anyone. Review Sign-in logs for 24–48 hours first.",
         s:[{k:"Initial state",v:"Report-only"},{k:"Validation",v:"Azure AD &#8594; Sign-in logs &#8594; filter 'CA = Report-only failure' — review each blocked scenario"},{k:"Go live",v:"Change to 'On' only after validating no legitimate users would be blocked"}]}
      ]},
    i3: { intro:"How to enable Endpoint Analytics reporting and generate device compliance reports in Intune.",
      steps:[
        {t:"Enable Endpoint Analytics Data Collection", p:"Reports &#8594; Endpoint Analytics &#8594; Settings",
         d:"Toggle 'Intune data collection' to On. Data collection begins from enrolled Windows devices immediately.",
         s:[{k:"Intune data collection",v:"On"},{k:"Data freshness",v:"Data refreshes every 24 hours — allow 24–48 hrs after enabling to see full data"}]},
        {t:"View the Startup Performance Report", p:"Reports &#8594; Endpoint Analytics &#8594; Startup performance",
         d:"Shows average boot and sign-in times per device. Identifies slowest devices and compares your org to similar organisations.",
         s:[{k:"Startup score",v:"0–100 (higher = faster — target 70+"},{k:"Good boot time",v:"Under 60 seconds total to desktop"},{k:"Actions",v:"Click any device to see which phase (BIOS, OS, sign-in) is slowest"}]},
        {t:"View Device Compliance Report", p:"Devices &#8594; Monitor &#8594; Device compliance",
         d:"See the overall compliance percentage across your fleet. Filter by platform, compliance state, or compliance policy.",
         s:[{k:"Filter: Compliance state",v:"Noncompliant — to find all problem devices"},{k:"Filter: OS",v:"Windows 10 and later"},{k:"Export",v:"Use 'Export' button to download CSV for reporting"}]},
        {t:"Drill into Non-compliant Devices", p:"Devices &#8594; Monitor &#8594; Noncompliant devices",
         d:"Every non-compliant device is listed with the specific setting(s) it is failing. Click any device to see exactly which compliance rule it violates."},
        {t:"Create a Custom On-demand Report", p:"Reports &#8594; Devices &#8594; Device compliance &#8594; Generate report",
         d:"Build ad-hoc reports with custom columns and filters. Export to CSV for leadership/audit reporting.",
         s:[{k:"Useful columns",v:"Device name, OS, Compliance state, Last check-in, User, Intune enrolled"},{k:"Useful filter",v:"Last check-in &#8594; within last 7 days (excludes stale devices)"}]}
      ]},
    i4: { intro:"How to set up Windows Autopilot for zero-touch device provisioning from the moment a device is unboxed.",
      steps:[
        {t:"Capture the Hardware Hash", p:"Run on target device — PowerShell (Admin)",
         d:"The hardware hash uniquely identifies the device hardware to Microsoft. On a brand-new device: boot to OOBE, press Shift+F10 for Command Prompt, type powershell to enter PowerShell.",
         s:[{k:"Install script",v:"Install-Script -Name Get-WindowsAutoPilotInfo -Force"},{k:"Export hash",v:"Get-WindowsAutoPilotInfo -OutputFile C:\\hash.csv"},{k:"Vendor option",v:"Request hash CSV directly from Dell/HP/Lenovo during procurement (easiest at scale)"}]},
        {t:"Import Devices into Intune", p:"Devices &#8594; Enroll devices &#8594; Windows &#8594; Autopilot Devices &#8594; Import",
         d:"Upload the CSV file. Processing takes 15–30 minutes. The device appears in the Autopilot Devices list when complete.",
         s:[{k:"CSV columns required",v:"Device Serial Number, Windows Product ID, Hardware Hash"},{k:"Optional column",v:"Group Tag — used to auto-assign profiles based on tag value"}]},
        {t:"Create an Autopilot Deployment Profile", p:"Devices &#8594; Enroll devices &#8594; Windows &#8594; Deployment profiles &#8594; Create profile &#8594; Windows PC",
         d:"The deployment profile controls the OOBE experience — what the end user sees (or skips) on first boot.",
         s:[{k:"Deployment mode",v:"User-driven (user authenticates with corp email)"},{k:"Join to Azure AD as",v:"Azure AD joined"},{k:"Skip keyboard selection",v:"Yes"},{k:"Skip privacy settings",v:"Yes"},{k:"User account type",v:"Standard user (not local admin)"}]},
        {t:"Create a Dynamic AAD Group for Autopilot Devices", p:"Azure AD &#8594; Groups &#8594; New group &#8594; Dynamic device",
         d:"This group auto-populates with all Autopilot-registered devices — no manual maintenance required.",
         s:[{k:"Group type",v:"Security"},{k:"Membership type",v:"Dynamic device"},{k:"Dynamic rule",v:'(device.devicePhysicalIds -any _ -contains "[ZTDId]")'},{k:"Or use group tag",v:'(device.devicePhysicalIds -any _ -eq "[OrderID]:SalesTeam")'}]},
        {t:"Assign Profile to the Dynamic Group", p:"Deployment profile &#8594; Assignments &#8594; Include groups &#8594; [dynamic group from step 4]",
         d:"The deployment profile auto-assigns to all registered Autopilot devices via the dynamic group."},
        {t:"Create an Enrollment Status Page (ESP)", p:"Devices &#8594; Enroll devices &#8594; Windows &#8594; Enrollment Status Page &#8594; Create",
         d:"The ESP shows a progress screen during first-boot setup, preventing users from accessing the desktop until all apps and policies are applied.",
         s:[{k:"Show app and profile config progress",v:"Yes"},{k:"Block device use until all apps are installed",v:"Yes"},{k:"Allow users to reset device if install error occurs",v:"Yes (for self-remediation)"},{k:"Allow users to collect logs",v:"Yes"}]}
      ]},
    a1: { intro:"How to deploy the MDM Security Baseline — including full BitLocker encryption setup — via Intune Endpoint Security.",
      steps:[
        {t:"Open Security Baselines", p:"Endpoint security &#8594; Security baselines &#8594; MDM Security Baseline &#8594; Create profile",
         d:"The MDM Security Baseline contains Microsoft-recommended settings for Windows 10/11 — covering BitLocker, Defender, Firewall, SmartScreen, and 400+ other settings. Defaults are hardened beyond what most manual configs achieve."},
        {t:"Name and Describe the Profile", p:"Basics tab",
         d:"Follow a naming convention so you can identify the baseline version when updating later.",
         s:[{k:"Name",v:"MDM-SecurityBaseline-Corporate-v1"},{k:"Description",v:"Microsoft MDM Security Baseline for all corporate Windows devices"}]},
        {t:"Configure BitLocker Settings", p:"Configuration settings &#8594; BitLocker",
         d:"These settings enforce full disk encryption and control how recovery keys are managed.",
         s:[{k:"BitLocker Drive Encryption",v:"Enabled"},{k:"OS Drive Encryption Method",v:"XTS-AES 256-bit"},{k:"Require additional authentication at startup",v:"Enabled"},{k:"Allow BitLocker without compatible TPM",v:"Blocked"},{k:"Fixed Drive Encryption Method",v:"XTS-AES 256-bit"},{k:"Write access to fixed drives not BitLocker-protected",v:"Block"},{k:"Recovery key backup",v:"Azure AD (keys automatically escrowed to tenant)"}]},
        {t:"Review Defender and Firewall Settings", p:"Configuration settings &#8594; Microsoft Defender &amp; Windows Firewall",
         d:"The baseline also configures Defender cloud protection, PUA blocking, and Windows Firewall for all 3 profiles.",
         s:[{k:"Cloud-delivered protection",v:"Enabled"},{k:"Automatic sample submission",v:"Send safe samples"},{k:"PUA protection",v:"Block"},{k:"Firewall (Domain / Private / Public)",v:"All Enabled"},{k:"Block inbound connections by default",v:"Yes (Public profile)"}]},
        {t:"Assign to Pilot Group, Monitor, then Expand", p:"Assignments &#8594; Include groups &#8594; [pilot group]",
         d:"Start with 5–10 pilot devices. Monitor for 48 hours — watch for BitLocker recovery key prompts or unexpected reboots. Then expand.",
         s:[{k:"Pilot group",v:"SG-Intune-Pilot (5–10 devices)"},{k:"Expand when",v:"No errors in baseline Device status report after 48 hrs"}]},
        {t:"Verify BitLocker Keys Are Escrowed to Azure AD", p:"Devices &#8594; [device name] &#8594; Recovery keys",
         d:"After BitLocker encrypts the drive, the recovery key must appear here. If blank: check that the BitLocker CSP policy includes 'Save BitLocker recovery info to Azure AD' and force a device sync.",
         s:[{k:"Expected",v:"One or more 48-digit recovery keys listed per device"},{k:"If empty",v:"Re-push policy via Device &#8594; Sync, then wait 10 min and refresh"}]}
      ]},
    a2: { intro:"How to deploy PowerShell scripts to Windows devices via Intune and use the Microsoft Graph API for automation.",
      steps:[
        {t:"Write and Test Your PowerShell Script Locally", p:"Local PC — PowerShell ISE or VS Code",
         d:"Scripts run as SYSTEM by default (no user context). Test locally first. Avoid interactive prompts (Read-Host, MessageBox). Output logs to a file for post-deployment debugging.",
         s:[{k:"Max script size",v:"200 KB"},{k:"Logging recommendation",v:'Start-Transcript "C:\\ProgramData\\YourCo\\Logs\\script.log"'},{k:"Test locally as SYSTEM",v:"Use PsExec: psexec -s powershell.exe to simulate SYSTEM context"}]},
        {t:"Upload Script to Intune", p:"Devices &#8594; Scripts and remediations &#8594; Platform scripts &#8594; Add &#8594; Windows 10 and later",
         d:"Upload the .ps1 file and configure execution options.",
         s:[{k:"Run as logged-on credentials",v:"No (runs as SYSTEM — needed for system changes)"},{k:"Enforce script signature check",v:"No (unless you have code signing)"},{k:"Run in 64-bit PowerShell",v:"Yes (always — ensures correct registry hive access)"},{k:"Frequency",v:"Once (for one-time config) — use Remediations for recurring checks"}]},
        {t:"Assign Script to Device Group", p:"Assignments tab &#8594; Add groups",
         d:"Scripts are assigned to device or user groups. If assigned to users, the script runs in the user context on those users' devices."},
        {t:"Register an Azure AD App for Graph API Access", p:"entra.microsoft.com &#8594; App registrations &#8594; New registration",
         d:"Create a service principal that your automation scripts will use to authenticate without a signed-in user.",
         s:[{k:"Name",v:"Intune-Automation-App"},{k:"Account type",v:"Single tenant (this org only)"},{k:"Redirect URI",v:"Leave blank (not needed for daemon scripts)"}]},
        {t:"Add Permissions and Create Client Secret", p:"App &#8594; API permissions &#8594; Add &#8594; Microsoft Graph &#8594; Application permissions",
         d:"Application permissions allow unattended access. Grant admin consent after adding.",
         s:[{k:"DeviceManagementManagedDevices.Read.All",v:"Read all managed devices"},{k:"DeviceManagementConfiguration.ReadWrite.All",v:"Read/write device configs"},{k:"Client secret",v:"Certificates &amp; secrets &#8594; New client secret &#8594; COPY VALUE IMMEDIATELY"}]},
        {t:"Connect and Query Intune via Graph API", p:"PowerShell — using Application (client) ID, Tenant ID, and client secret",
         d:"Install the SDK, authenticate as the app, then call Intune data endpoints.",
         s:[{k:"Install",v:"Install-Module Microsoft.Graph.Authentication, Microsoft.Graph.DeviceManagement"},{k:"Connect",v:"Connect-MgGraph -TenantId $tenantId -ClientSecretCredential $cred"},{k:"Get non-compliant devices",v:"Get-MgDeviceManagementManagedDevice -Filter \"complianceState eq 'noncompliant'\""},{k:"Export to CSV",v:"$devices | Export-Csv -Path .\\report.csv -NoTypeInformation"}]}
      ]},
    a3: { intro:"How to enable Co-management between Microsoft Endpoint Configuration Manager (SCCM) and Intune.",
      steps:[
        {t:"Enable Cloud Attach (Tenant Attach) in SCCM", p:"SCCM Console &#8594; Administration &#8594; Cloud Services &#8594; Cloud Attach &#8594; Configure Cloud Attach",
         d:"Tenant Attach uploads SCCM device inventory to the Intune portal — giving you a unified view without any enrollment risk. A safe first step.",
         s:[{k:"Sign in with",v:"Azure Global Admin when prompted"},{k:"Upload all devices",v:"Yes"},{k:"Enable Endpoint Analytics",v:"Yes (sends performance data to Intune)"}]},
        {t:"Verify Tenant Attach is Working", p:"intune.microsoft.com &#8594; Devices &#8594; All devices",
         d:"SCCM-managed devices now appear in the Intune portal with 'ConfigMgr' as the Managed By source. You can view hardware inventory and run remote actions directly from Intune."},
        {t:"Enable Co-management", p:"SCCM Console &#8594; Administration &#8594; Cloud Services &#8594; Co-management &#8594; Configure Co-management",
         d:"This begins the process of enrolling SCCM-managed devices into Intune so both agents manage them simultaneously.",
         s:[{k:"Automatic enrollment in Intune",v:"Pilot (safe start) — choose a small test collection"},{k:"Pilot collection",v:"Create a collection named 'Co-Mgmt-Pilot' containing 5–10 test devices"}]},
        {t:"Slide Workloads to Intune", p:"Co-management Properties &#8594; Workloads tab",
         d:"Each workload can be independently moved: Configuration Manager, Pilot Intune, or Intune. Start with Compliance Policies only.",
         s:[{k:"Compliance Policies",v:"Move to Pilot Intune (safe — Intune evaluates compliance, SCCM still manages config)"},{k:"Device Configuration",v:"Leave on ConfigMgr initially"},{k:"Client Apps",v:"Leave on ConfigMgr until all SCCM apps are recreated in Intune"},{k:"Windows Update Policies",v:"Move to Intune when ready to use Windows Update for Business"}]},
        {t:"Verify Co-managed Device in Intune", p:"intune.microsoft.com &#8594; Devices &#8594; [device name] &#8594; Overview",
         d:"Confirm the device shows co-managed status in both portals.",
         s:[{k:"Managed by",v:"Co-managed"},{k:"MDM enrolled",v:"Yes"},{k:"Compliance policy source",v:"Intune (after workload moved)"}]},
        {t:"Monitor Co-management in SCCM", p:"SCCM Console &#8594; Monitoring &#8594; Co-management Dashboard",
         d:"Shows total co-managed devices, workload breakdown, pilot vs. production counts, and enrollment failures. Review weekly during migration phase."}
      ]},
    a4: { intro:"How to create an App Protection Policy (MAM) in Intune to protect corporate data on personal iOS devices without full MDM enrollment.",
      steps:[
        {t:"Create an App Protection Policy", p:"Apps &#8594; App protection policies &#8594; Create policy &#8594; iOS/iPadOS",
         d:"App Protection Policies protect corporate data inside apps on personal devices. No MDM enrollment is required — the policy attaches to the user's corporate identity, not the device."},
        {t:"Select Target Apps", p:"Apps tab",
         d:"Target all Microsoft apps to cover Outlook, Teams, OneDrive, SharePoint, and Edge in one policy.",
         s:[{k:"Target policy to",v:"All Microsoft apps"},{k:"Or select specific apps",v:"Microsoft Outlook, Microsoft Teams, Microsoft OneDrive, Microsoft SharePoint, Microsoft Edge"}]},
        {t:"Configure Data Protection Settings", p:"Data protection tab",
         d:"These settings control how corporate data can move in and out of managed apps.",
         s:[{k:"Backup org data to iCloud",v:"Block"},{k:"Send org data to other apps",v:"Policy managed apps only"},{k:"Receive data from other apps",v:"Policy managed apps only"},{k:"Restrict cut, copy, paste between apps",v:"Policy managed apps with paste in"},{k:"Save copies of org data",v:"Block"},{k:"Allowed storage locations",v:"OneDrive for Business, SharePoint only"},{k:"Screen capture and Siri",v:"Block"}]},
        {t:"Configure Access Requirements", p:"Access requirements tab",
         d:"Define how users must authenticate before the app grants access to corporate data.",
         s:[{k:"PIN for access",v:"Require"},{k:"PIN type",v:"Numeric"},{k:"Simple PIN (e.g. 1234)",v:"Block"},{k:"Minimum PIN length",v:"6"},{k:"Allow biometrics (Face ID / Touch ID)",v:"Allow"},{k:"Re-check after inactivity (minutes)",v:"30"}]},
        {t:"Configure Conditional Launch", p:"Conditional launch tab",
         d:"Define device health conditions and actions when the device is jailbroken, the PIN is exceeded, or the OS is too old.",
         s:[{k:"Max PIN attempts = 5",v:"Action: Reset PIN"},{k:"Offline grace period = 720 min",v:"Action: Block access"},{k:"Jailbroken / rooted devices",v:"Action: Block access"},{k:"Min OS version: iOS 16.0",v:"Action: Warn (Block for high-security environments)"}]},
        {t:"Assign to Users", p:"Assignments tab &#8594; Include groups",
         d:"APP policies target users, not devices. Assign to the group of BYOD or contractor users who need this protection.",
         s:[{k:"Assign to",v:"SG-BYOD-Users or All Users"},{k:"Key point",v:"Policy triggers when user signs in with corporate account in the app — device enrollment is NOT required"}]}
      ]},
    e1: { intro:"How to register an Azure AD application and use the Microsoft Graph API to automate Intune management at scale.",
      steps:[
        {t:"Register an Application in Azure AD", p:"entra.microsoft.com &#8594; App registrations &#8594; New registration",
         d:"This creates a service principal — an application identity that your automation scripts authenticate as (not as a human user).",
         s:[{k:"Name",v:"Intune-GraphAPI-Automation"},{k:"Supported account types",v:"Accounts in this organizational directory only (Single tenant)"},{k:"Redirect URI",v:"Leave blank (not needed for client credentials flow)"}]},
        {t:"Record the Application IDs", p:"App registration &#8594; Overview tab",
         d:"You need exactly two GUIDs for every script you write.",
         s:[{k:"Application (client) ID",v:"This is your $clientId — copy and store securely"},{k:"Directory (tenant) ID",v:"This is your $tenantId — copy and store securely"},{k:"Object ID",v:"NOT the same as client ID — do not use this for authentication"}]},
        {t:"Create a Client Secret", p:"App &#8594; Certificates &amp; secrets &#8594; Client secrets &#8594; New client secret",
         d:"The client secret acts as the app password. You can only see the value once — immediately after creation.",
         s:[{k:"Description",v:"Intune-Automation-2024"},{k:"Expiry",v:"24 months — set a calendar reminder 30 days before expiry to rotate"},{k:"Action after creation",v:"COPY THE VALUE IMMEDIATELY — it is shown only once"}]},
        {t:"Add Microsoft Graph API Permissions", p:"App &#8594; API permissions &#8594; Add a permission &#8594; Microsoft Graph &#8594; Application permissions",
         d:"Application permissions allow unattended access with no signed-in user. After adding, click 'Grant admin consent'.",
         s:[{k:"DeviceManagementManagedDevices.Read.All",v:"Read all managed devices"},{k:"DeviceManagementConfiguration.ReadWrite.All",v:"Read &amp; write device configurations"},{k:"DeviceManagementApps.ReadWrite.All",v:"Manage app deployments"},{k:"Admin consent",v:"Click 'Grant admin consent for [tenant]' — all entries must show green &#10003;"}]},
        {t:"Authenticate and Get an Access Token", p:"PowerShell — client credentials flow",
         d:"Install the Microsoft Graph PowerShell SDK and connect using your app credentials.",
         s:[{k:"Install module",v:"Install-Module Microsoft.Graph.Authentication -Scope CurrentUser"},{k:"Build credential",v:"$cred = New-Object System.Management.Automation.PSCredential ($clientId, (ConvertTo-SecureString $clientSecret -AsPlainText -Force))"},{k:"Connect",v:"Connect-MgGraph -TenantId $tenantId -ClientSecretCredential $cred -NoWelcome"}]},
        {t:"Make Your First Automation Call", p:"PowerShell — query all non-compliant devices",
         d:"A common first task: get all non-compliant devices and export to CSV for remediation.",
         s:[{k:"Get non-compliant devices",v:"Get-MgDeviceManagementManagedDevice -Filter \"complianceState eq 'noncompliant'\" -All"},{k:"Select key columns",v:"| Select-Object DeviceName,UserPrincipalName,ComplianceState,LastSyncDateTime"},{k:"Export to CSV",v:"| Export-Csv -Path .\\NonCompliant.csv -NoTypeInformation"},{k:"Batch API calls",v:"Use the \\$batch endpoint to combine up to 20 requests — avoids throttling at scale"}]}
      ]},
    e2: { intro:"How to build a Zero Trust access model using Intune device compliance, Azure AD Conditional Access, and Named Locations.",
      steps:[
        {t:"Audit Your Current Security Posture", p:"security.microsoft.com &#8594; Secure Score",
         d:"Review Microsoft Secure Score (0–100%) before making changes. Each recommendation shows points earned and exact implementation steps. Export for a baseline measurement.",
         s:[{k:"Check MFA registration %",v:"Azure AD &#8594; Security &#8594; Authentication methods &#8594; Activity"},{k:"Check legacy auth",v:"Azure AD &#8594; Sign-in logs &#8594; filter 'Client app: Other clients or Exchange ActiveSync'"},{k:"Target Secure Score",v:"Work towards the 75th percentile of similar organisations"}]},
        {t:"Enforce MFA for All Users", p:"entra.microsoft.com &#8594; Conditional Access &#8594; New policy: CA001-Baseline-MFA",
         d:"Create a baseline CA policy requiring MFA for all users on all cloud apps. Use Report-only for 2 weeks before enabling.",
         s:[{k:"Users",v:"All users (exclude Break Glass account)"},{k:"Cloud apps",v:"All cloud apps"},{k:"Grant",v:"Require multi-factor authentication"},{k:"State",v:"Report-only first, then On after reviewing sign-in logs"}]},
        {t:"Block Legacy Authentication", p:"Conditional Access &#8594; New policy: CA002-Block-Legacy-Auth",
         d:"Legacy protocols (SMTP AUTH, IMAP, POP3, basic auth) bypass MFA entirely — block them before enforcing MFA.",
         s:[{k:"Users",v:"All users"},{k:"Conditions &#8594; Client apps",v:"Exchange ActiveSync clients + Other clients"},{k:"Grant",v:"Block access"},{k:"Note",v:"Enable this BEFORE CA001 — otherwise legacy auth bypasses MFA requirement"}]},
        {t:"Require Compliant Device for M365", p:"Conditional Access &#8594; New policy: CA003-Require-Compliant-Device",
         d:"Require Intune compliance for access to Microsoft 365 apps. Devices must be enrolled and compliant.",
         s:[{k:"Cloud apps",v:"Office 365 (targets all M365 services)"},{k:"Conditions &#8594; Device platforms",v:"Windows, iOS, Android, macOS"},{k:"Grant",v:"Require MFA AND Require device to be marked as compliant"},{k:"Exclude",v:"Intune Enrollment app (allow enrollment before compliance is checked)"}]},
        {t:"Configure Named Locations", p:"Azure AD &#8594; Security &#8594; Conditional Access &#8594; Named locations &#8594; + IP ranges location",
         d:"Define your corporate network IPs as trusted locations. Use these in CA policies to skip MFA from the office or tighten controls for high-risk locations.",
         s:[{k:"Name",v:"Corporate HQ — [City]"},{k:"IP ranges",v:"Enter public IP range(s) in CIDR notation (e.g. 203.0.113.0/24)"},{k:"Mark as trusted location",v:"Yes — enables trusted skipping in CA conditions"}]},
        {t:"Enable Identity Protection Risk Policies", p:"Azure AD &#8594; Security &#8594; Identity Protection &#8594; Sign-in risk policy / User risk policy",
         d:"Risk-based policies automatically respond to risky sign-ins detected by Microsoft's threat intelligence — requiring MFA or blocking access without any manual intervention.",
         s:[{k:"Sign-in risk policy &#8594; High risk",v:"Require MFA"},{k:"User risk policy &#8594; High risk",v:"Require password change"},{k:"Requires",v:"Azure AD Premium P2 (included in M365 E5 / EMS E5)"}]}
      ]},
    e3: { intro:"How to build a complete enterprise Intune environment from scratch — a structured lab guide covering tenant, devices, policies, and validation.",
      steps:[
        {t:"Provision a Free Lab Tenant", p:"developer.microsoft.com/microsoft-365/dev-program &#8594; Join now",
         d:"Sign up for a Microsoft 365 Developer tenant with 25 E5 licences — free and renewable every 90 days when actively used. Includes Intune, Azure AD P2, Defender, Exchange, Teams, and all M365 services.",
         s:[{k:"Licence",v:"Microsoft 365 E5 Developer (25 users)"},{k:"Includes",v:"Intune + Azure AD P2 + Defender for Endpoint + Purview + Teams"},{k:"Renewal",v:"Auto-renews if you actively use the tenant (app registrations, sign-ins count)"}]},
        {t:"Create Users, Groups and Assign Licences", p:"Microsoft 365 admin center &#8594; Users &#8594; Add user",
         d:"Create users representing your test scenarios and organise them into security groups for policy targeting.",
         s:[{k:"Test users",v:"IT Admin, Standard User, Manager, Contractor, Exec"},{k:"Groups",v:"SG-All-Devices, SG-Pilots, SG-BYOD-Users, SG-Executives, SG-Service-Accounts"},{k:"Assign licences",v:"Microsoft 365 admin center &#8594; Billing &#8594; Licenses &#8594; assign M365 E5 Dev to all test users"}]},
        {t:"Configure Auto-Enrollment", p:"intune.microsoft.com &#8594; Devices &#8594; Enroll devices &#8594; Automatic enrollment",
         d:"Enable auto-enrollment so Azure AD-joined devices automatically enroll in Intune without any user action.",
         s:[{k:"MDM user scope",v:"All"},{k:"MAM user scope",v:"All"}]},
        {t:"Create and Test an Autopilot VM", p:"Hyper-V Manager &#8594; New Virtual Machine (Generation 2)",
         d:"Create a Windows 11 VM with TPM enabled, capture its hardware hash, import into Intune, and run the full Autopilot zero-touch flow.",
         s:[{k:"VM Generation",v:"Generation 2 (required for Secure Boot and vTPM)"},{k:"Enable TPM",v:"VM Settings &#8594; Security &#8594; Trusted Platform Module &#8594; Enabled"},{k:"RAM",v:"4 GB minimum for Windows 11"},{k:"Hash capture",v:"Get-WindowsAutoPilotInfo -OutputFile C:\\hash.csv"},{k:"Create dynamic group",v:'Rule: (device.devicePhysicalIds -any _ -contains "[ZTDId]")'}]},
        {t:"Deploy All Policy Types in Order", p:"Build up policies layer by layer",
         d:"Deploy in the correct order: compliance before CA (so devices have a state to check), then security baseline (to harden), then config profiles (to configure).",
         s:[{k:"Step 1",v:"Windows compliance policy &#8594; assign to SG-All-Devices"},{k:"Step 2",v:"Conditional Access CA003 (Report-only) &#8594; require compliant device"},{k:"Step 3",v:"MDM Security Baseline &#8594; assign to SG-Pilots first"},{k:"Step 4",v:"Deploy M365 Apps &#8594; Required for SG-All-Devices"},{k:"Step 5",v:"Run Autopilot on the VM &#8594; confirm zero-touch enrollment"}]},
        {t:"Validate End-to-End and Document Everything", p:"Intune &#8594; Reports &#8594; Devices &#8594; Device compliance",
         d:"Walk through the full validation checklist and document every policy for handover and audit.",
         s:[{k:"Validation: Device enrolled",v:"&#10003; Appears in Intune &#8594; All Devices with Managed by = Intune"},{k:"Validation: Compliant",v:"&#10003; Compliance state = Compliant within 30 min"},{k:"Validation: Apps installed",v:"&#10003; M365 Apps visible in Device &#8594; Discovered apps"},{k:"Validation: CA enforced",v:"&#10003; Sign-in from non-compliant device is blocked"},{k:"Validation: BitLocker key escrowed",v:"&#10003; Device &#8594; Recovery keys shows a key"}]}
      ]}
  };

  var m = D[id];
  if (!m) return '';
  var stepsHTML = m.steps.map(function(step, idx) {
    var isLast = idx === m.steps.length - 1;
    var pathHTML = step.p ? '<code class="config-path">' + step.p + '</code>' : '';
    var settingsHTML = '';
    if (step.s && step.s.length) {
      settingsHTML = '<div class="config-settings">' + step.s.map(function(sv) {
        return '<div class="config-kv"><span class="config-k">' + sv.k + '</span><span class="config-v">' + sv.v + '</span></div>';
      }).join('') + '</div>';
    }
    return '<div class="config-step' + (isLast ? ' config-step-last' : '') + '">' +
      '<div class="config-num">' + (idx + 1) + '</div>' +
      '<div class="config-body"><div class="config-title">' + step.t + '</div>' +
      pathHTML + '<div class="config-detail">' + step.d + '</div>' + settingsHTML + '</div></div>';
  }).join('');
  return '<div class="section config-section">' +
    '<h2>&#9881;&#65039; Step-by-Step Configuration</h2>' +
    '<p class="config-intro">' + m.intro + '</p>' +
    '<div class="config-steps">' + stepsHTML + '</div></div>';
}

// ─────────────────────────────────────────────
// VISUAL SECTION HELPER
// Flow diagram + troubleshooting cards per module.
// Uses string concatenation — no template literals.
// ─────────────────────────────────────────────
function visualSection(id) {
  var D = {
    b1: {
      ft: 'Intune Architecture — How It All Connects',
      flow: [
        {i:'&#128187;', l:'Device',      s:'Win / iOS / Android / Mac'},
        {i:'&#128274;', l:'Azure AD',    s:'Identity &amp; Auth'},
        {i:'&#9729;',   l:'Intune',      s:'Cloud policy engine'},
        {i:'&#9989;',   l:'Managed',     s:'Compliant &amp; secured'},
      ],
      trouble: [
        {q:'Device shows "Not enrolled"',
         a:'Settings &#8594; Accounts &#8594; Access Work or School &#8594; Connect &#8594; sign in with corporate email'},
        {q:'Policy not applying after enrollment',
         a:'Open Company Portal &#8594; tap device &#8594; Sync. Wait 5&#8211;10 min for Intune check-in'},
        {q:'License error during enrollment',
         a:'Azure AD admin centre &#8594; Users &#8594; select user &#8594; Licenses &#8594; assign Intune / EMS E3 / M365'},
      ]
    },
    b2: {
      ft: 'Windows Enrollment — Step by Step',
      flow: [
        {i:'&#128229;', l:'Download',    s:'Company Portal from Store'},
        {i:'&#128272;', l:'Sign In',     s:'Corp email &amp; password'},
        {i:'&#128203;', l:'MDM Profile', s:'Intune pushes config'},
        {i:'&#9989;',   l:'Enrolled',    s:'Device appears in Intune'},
      ],
      trouble: [
        {q:'Error 0x80180026 in Company Portal',
         a:'Verify MDM authority is set to "Microsoft Intune" in Intune &#8594; Tenant admin &#8594; Tenant status'},
        {q:'Enrolled but no policies received',
         a:'Check device group membership — policy must target a group containing this device or user'},
        {q:'iOS ADE device stuck at setup screen',
         a:'Confirm MDM Push Certificate is valid and Apple Business Manager token has not expired in Intune'},
      ]
    },
    b3: {
      ft: 'Compliance Policy Workflow',
      flow: [
        {i:'&#128221;', l:'Create Policy',    s:'Intune admin centre'},
        {i:'&#128101;', l:'Assign Group',     s:'Target users / devices'},
        {i:'&#128260;', l:'Device Check-in',  s:'Every 8 hrs or on demand'},
        {i:'&#128680;', l:'Compliant?',       s:'Yes &#8594; CA grants access'},
      ],
      trouble: [
        {q:'Device non-compliant despite meeting requirements',
         a:'Check grace period has not expired. Review individual setting failures in Device &#8594; Compliance tab'},
        {q:'Compliance policy not appearing on device',
         a:'Ensure device is in the targeted AAD group and has synced within the last 24 hours'},
        {q:'Conditional Access blocking a compliant device',
         a:'Azure AD &#8594; Sign-in logs &#8594; find blocked sign-in &#8594; Conditional Access tab shows which policy and why'},
      ]
    },
    b4: {
      ft: 'App Deployment Flow',
      flow: [
        {i:'&#128230;', l:'Add App',    s:'Apps &#8594; Add in Intune'},
        {i:'&#9881;',   l:'Configure',  s:'Requirements &amp; settings'},
        {i:'&#128101;', l:'Assign',     s:'Required or Available'},
        {i:'&#128242;', l:'Installs',   s:'Silent on device sync'},
      ],
      trouble: [
        {q:'App stuck on "Pending install"',
         a:'Check device meets OS version &amp; architecture requirements. Review Device &#8594; Managed Apps &#8594; install log'},
        {q:'Win32 app fails error 0x87D300D9',
         a:'Intune Management Extension not installed. Check agent health: Device &#8594; Device diagnostics'},
        {q:'"Available" app not auto-installing',
         a:'"Available" requires user to install from Company Portal manually. Use "Required" for forced silent installs'},
      ]
    },
    i1: {
      ft: 'Configuration Profile — Deployment Flow',
      flow: [
        {i:'&#128295;', l:'Create',     s:'Templates / Settings Catalog'},
        {i:'&#9881;',   l:'Configure',  s:'Settings &amp; restrictions'},
        {i:'&#128101;', l:'Assign',     s:'Include / Exclude groups'},
        {i:'&#128260;', l:'Applied',    s:'On next device check-in'},
      ],
      trouble: [
        {q:'Profile shows "Error" state on device',
         a:'Intune &#8594; select profile &#8594; Assignment status &#8594; click the error to read the specific setting failure'},
        {q:'Conflicting profiles',
         a:'Use Settings Catalog — it highlights conflicts. Check for duplicate settings across multiple profiles in Device config'},
        {q:'Profile assigned but not received',
         a:'Verify device is AAD-joined and Intune-enrolled. Check last check-in time in Device &#8594; Overview'},
      ]
    },
    i2: {
      ft: 'Conditional Access — Decision Flow',
      flow: [
        {i:'&#128100;', l:'User Sign-in',   s:'Any M365 service'},
        {i:'&#128269;', l:'CA Evaluates',   s:'User, device, location'},
        {i:'&#128241;', l:'MFA + Compliant',s:'Both checked'},
        {i:'&#128682;', l:'Grant / Block',  s:'Access decision'},
      ],
      trouble: [
        {q:'Users getting blocked unexpectedly',
         a:'Azure AD &#8594; Sign-in logs &#8594; find blocked entry &#8594; "Conditional Access" tab shows exact policy and condition that blocked'},
        {q:'"What If" tool shows wrong result',
         a:'Use Azure AD &#8594; CA &#8594; What If with exact user, app, device platform &amp; location to simulate the decision'},
        {q:'MFA prompt loops endlessly',
         a:'Legacy auth may be in use. Block legacy auth with a CA policy targeting Exchange ActiveSync and "Other clients"'},
      ]
    },
    i3: {
      ft: 'Reporting & Monitoring Flow',
      flow: [
        {i:'&#128225;', l:'Device Data',    s:'Agent reports telemetry'},
        {i:'&#9729;',   l:'Intune Collects',s:'Compliance, health, apps'},
        {i:'&#128202;', l:'Reports',        s:'Dashboard &amp; exports'},
        {i:'&#128276;', l:'Alert &amp; Act',s:'Remediate issues'},
      ],
      trouble: [
        {q:'Device not showing in reports',
         a:'Last check-in must be within 30 days. Filter by "Last check-in" in Devices &#8594; All Devices'},
        {q:'Endpoint Analytics data missing',
         a:'Reports &#8594; Endpoint Analytics &#8594; Settings &#8594; toggle "Intune data collection" on'},
        {q:'Compliance report showing wrong percentage',
         a:'Filter by "Managed by = Intune" and target OS platform. Exclude retired/deleted devices from the view'},
      ]
    },
    i4: {
      ft: 'Windows Autopilot — Zero-Touch Deployment',
      flow: [
        {i:'&#128290;', l:'Register Hash',  s:'Vendor or manual upload'},
        {i:'&#128203;', l:'Assign Profile', s:'Autopilot profile in Intune'},
        {i:'&#128230;', l:'Ship to User',   s:'Direct from vendor'},
        {i:'&#9989;',   l:'Auto-Enroll',    s:'On first boot &amp; Wi-Fi'},
      ],
      trouble: [
        {q:'Device not going through Autopilot on first boot',
         a:'Confirm hardware hash exists: Intune &#8594; Devices &#8594; Enrolment &#8594; Windows &#8594; Autopilot Devices. Hash must be registered before OOBE'},
        {q:'Autopilot profile not assigned to device',
         a:'Check deployment profile assignment. Use group tags — set during hash import — to auto-assign the correct profile'},
        {q:'"Something went wrong" error during OOBE',
         a:'Note the error code: 0x801c03ea = device not registered; 0x80070774 = TPM issue. Check Event Viewer &#8594; ModernDeployment logs'},
      ]
    },
    a1: {
      ft: 'Security Baseline — Deployment Flow',
      flow: [
        {i:'&#128203;', l:'Choose Baseline',s:'MDM / Edge / Defender'},
        {i:'&#128269;', l:'Review Settings',s:'400+ hardened configs'},
        {i:'&#128101;', l:'Assign Pilot',   s:'Small test group first'},
        {i:'&#9989;',   l:'Full Rollout',   s:'Monitor &amp; tune'},
      ],
      trouble: [
        {q:'Baseline conflicts with existing policy',
         a:'Intune &#8594; Reports &#8594; Endpoint Security &#8594; Baseline compliance &#8594; review conflicts. Settings Catalog shows conflicting values side by side'},
        {q:'BitLocker baseline not enforcing encryption',
         a:'Ensure TPM is provisioned and drive is unencrypted. Pre-provisioned machines may need a manual trigger: manage-bde -on C: -RecoveryPassword'},
        {q:'Baseline applied but device still non-compliant',
         a:'Security baseline and compliance policy are separate. Create a compliance policy that checks the same settings the baseline enforces'},
      ]
    },
    a2: {
      ft: 'PowerShell & Graph API Flow',
      flow: [
        {i:'&#128273;', l:'App Registration',s:'Azure AD &#8594; App registrations'},
        {i:'&#127999;', l:'Get Token',       s:'OAuth2 client credentials'},
        {i:'&#128225;', l:'Call Graph',      s:'graph.microsoft.com/v1.0'},
        {i:'&#128202;', l:'Process Data',    s:'JSON &#8594; report / action'},
      ],
      trouble: [
        {q:'403 Forbidden on Graph API call',
         a:'App registration missing required permission. Azure AD &#8594; App registrations &#8594; API permissions &#8594; add DeviceManagementManagedDevices.Read.All &#8594; Grant admin consent'},
        {q:'Token request returns AADSTS700016',
         a:'The client_id in your script does not match any registered app. Use the Application (client) ID, not the Object ID'},
        {q:'Intune script not running on device',
         a:'Verify Intune Management Extension is installed. Review log: C:\\ProgramData\\Microsoft\\IntuneManagementExtension\\Logs\\AgentExecutor.log'},
      ]
    },
    a3: {
      ft: 'Co-management — SCCM to Intune Migration',
      flow: [
        {i:'&#128421;', l:'SCCM Agent',     s:'Existing managed devices'},
        {i:'&#9729;',   l:'Tenant Attach',  s:'Read-only Intune view'},
        {i:'&#128260;', l:'Co-management',  s:'Enable &amp; slide workloads'},
        {i:'&#9989;',   l:'Cloud-Only',     s:'Retire SCCM fully'},
      ],
      trouble: [
        {q:'Co-management pilot not enrolling devices',
         a:'Verify the pilot collection contains target devices and Cloud Management Gateway (CMG) is healthy in SCCM'},
        {q:'Workload slid to Intune but policy not applying',
         a:'Device must check in with both agents. Force an Intune sync and confirm the slider is past Pilot in SCCM properties'},
        {q:'Tenant Attach showing devices as offline',
         a:'Check service connection point role in SCCM. Ensure SCCM service account has the Cloud Management role. Review CMG connection log'},
      ]
    },
    a4: {
      ft: 'BYOD & MAM — Personal Device Protection',
      flow: [
        {i:'&#128241;', l:'Personal Device',s:'No MDM enrollment needed'},
        {i:'&#128229;', l:'Install Corp App',s:'Outlook / Teams / OneDrive'},
        {i:'&#128272;', l:'Sign In Corp',   s:'MAM policy triggers'},
        {i:'&#128737;', l:'Data Protected', s:'PIN + selective wipe'},
      ],
      trouble: [
        {q:'App Protection Policy not applying',
         a:'APP targets users, not device groups. Confirm user is in the targeted group. User must sign out &amp; back in to the app after policy creation'},
        {q:'User can still copy data between apps',
         a:'Check "Restrict cut, copy, paste" is set to "Policy managed apps" and "Save copies of org data" is set to "Block" in the APP'},
        {q:'Selective wipe not removing org data',
         a:'Intune &#8594; Apps &#8594; App Protection Policies &#8594; select policy &#8594; select user &#8594; Wipe. Device must appear in the user registered devices list'},
      ]
    },
    e1: {
      ft: 'Graph API Automation Pipeline',
      flow: [
        {i:'&#128221;', l:'Write Script',   s:'PowerShell / Python'},
        {i:'&#128273;', l:'Authenticate',   s:'Service principal token'},
        {i:'&#128225;', l:'REST Call',      s:'GET / POST / PATCH'},
        {i:'&#9881;',   l:'Automate',       s:'Schedule / CI-CD pipeline'},
      ],
      trouble: [
        {q:'429 Too Many Requests (throttling)',
         a:'Implement exponential backoff. Graph limit ~10,000 req / 10 min per tenant. Use $batch endpoint to combine up to 20 requests in one call'},
        {q:'Beta endpoint data differs from v1.0',
         a:'Beta has more properties but is unsupported for production. Use v1.0 where possible; use beta only for properties not yet promoted'},
        {q:'Pipeline fails after token expiry (1 hr)',
         a:'Tokens expire in 60 min. Catch 401 responses and re-authenticate before retrying. Store token expiry time and refresh proactively'},
      ]
    },
    e2: {
      ft: 'Zero Trust — Verify Every Request',
      flow: [
        {i:'&#128100;', l:'Identity',       s:'MFA + sign-in risk check'},
        {i:'&#128187;', l:'Device',         s:'Compliant in Intune'},
        {i:'&#128241;', l:'App + Data',     s:'MAM + DLP policies'},
        {i:'&#127760;', l:'Access Granted', s:'Least-privilege only'},
      ],
      trouble: [
        {q:'Zero Trust score low in Defender portal',
         a:'Review Microsoft Secure Score recommendations at security.microsoft.com. Each item shows impact points and exact implementation steps'},
        {q:'Device compliance CA not blocking risky devices',
         a:'Ensure CA policy requires "Device marked as compliant" — not just "Hybrid AAD joined". Confirm policy targets all cloud apps, not just a subset'},
        {q:'Insider risk alerts not surfacing',
         a:'Microsoft Purview Insider Risk Management requires E5 or Compliance add-on. Confirm audit logging is enabled in the Purview compliance portal'},
      ]
    },
    e3: {
      ft: 'Enterprise Lab — Full Deployment Sequence',
      flow: [
        {i:'&#127959;', l:'Tenant Config',  s:'AAD + Intune + licences'},
        {i:'&#128640;', l:'Autopilot',      s:'Register &amp; deploy devices'},
        {i:'&#128737;', l:'Security',       s:'Baselines + CA policies'},
        {i:'&#128202;', l:'Monitor',        s:'Analytics + alerts'},
      ],
      trouble: [
        {q:'Lab tenant hitting licence limits',
         a:'Use Microsoft 365 Developer tenant (free 25 users, 90-day renewable) at developer.microsoft.com/microsoft-365/dev-program'},
        {q:'Autopilot VM not recognising hardware hash',
         a:'Use Hyper-V Gen 2 VM with TPM enabled (Security &#8594; Trusted Platform Module). For VMware, enable vTPM in VM settings'},
        {q:'All policies conflicting in lab',
         a:'Use staged rollout: create separate AAD groups per policy type, assign to small test groups, validate before broad assignment'},
      ]
    },
  };

  var m = D[id];
  if (!m) return '';

  var flowHTML = m.flow.map(function(n, idx) {
    var conn = (idx < m.flow.length - 1) ? '<div class="vis-conn">&#8594;</div>' : '';
    return '<div class="vis-node"><div class="vis-icon">' + n.i + '</div>' +
      '<div class="vis-label">' + n.l + '</div>' +
      '<div class="vis-sub">' + n.s + '</div></div>' + conn;
  }).join('');

  var troubleHTML = m.trouble.map(function(t) {
    return '<div class="vis-tcard">' +
      '<div class="vis-tq"><div class="vis-tq-icon">&#10067;</div>' + t.q + '</div>' +
      '<div class="vis-ta"><div class="vis-ta-icon">&#10003;</div>' + t.a + '</div>' +
      '</div>';
  }).join('');

  return '<div class="section visual-section">' +
    '<h2>&#128247; Visual Guide &amp; Troubleshooting</h2>' +
    '<p class="vis-subtitle">' + m.ft + '</p>' +
    '<div class="vis-flow-wrap"><div class="vis-flow">' + flowHTML + '</div></div>' +
    '<p class="vis-subtitle" style="margin-top:20px;">&#128295; Common Issues &amp; Fixes</p>' +
    '<div class="vis-trouble-grid">' + troubleHTML + '</div>' +
    '</div>';
}

// ─────────────────────────────────────────────
// VIDEO SECTION HELPER
// Returns a styled "Watch Videos" block for each module.
// Videos link to targeted YouTube searches for official Microsoft content.
// ─────────────────────────────────────────────
function videoSection(id) {
  const data = {
    b1: { items: [
      { label: 'Microsoft Intune Overview — What is Intune?', q: 'microsoft+intune+overview+what+is+intune+explained', ch: 'Microsoft Mechanics' },
      { label: 'MDM vs MAM — Key Concepts Explained', q: 'microsoft+intune+MDM+vs+MAM+explained+tutorial', ch: 'Microsoft' },
    ]},
    b2: { items: [
      { label: 'Windows Device Enrollment in Intune', q: 'microsoft+intune+windows+device+enrollment+step+by+step', ch: 'Microsoft Mechanics' },
      { label: 'iOS & Android Enrollment Tutorial', q: 'microsoft+intune+iOS+Android+enrollment+apple+business+manager', ch: 'Microsoft' },
    ]},
    b3: { items: [
      { label: 'Compliance Policies — Step-by-Step Setup', q: 'microsoft+intune+compliance+policy+setup+tutorial', ch: 'Microsoft Mechanics' },
      { label: 'Device Compliance & Conditional Access', q: 'intune+device+compliance+conditional+access+block+tutorial', ch: 'Microsoft' },
    ]},
    b4: { items: [
      { label: 'Deploying Apps with Microsoft Intune', q: 'microsoft+intune+app+deployment+windows+tutorial', ch: 'Microsoft Mechanics' },
      { label: 'Microsoft 365 Apps Deployment via Intune', q: 'microsoft+intune+deploy+microsoft+365+apps+tutorial', ch: 'Microsoft' },
    ]},
    i1: { items: [
      { label: 'Configuration Profiles Deep Dive', q: 'microsoft+intune+configuration+profiles+tutorial+deep+dive', ch: 'Microsoft Mechanics' },
      { label: 'Settings Catalog & Templates', q: 'microsoft+intune+settings+catalog+templates+tutorial', ch: 'Microsoft' },
    ]},
    i2: { items: [
      { label: 'Conditional Access with Intune', q: 'microsoft+intune+conditional+access+azure+ad+tutorial', ch: 'Microsoft Mechanics' },
      { label: 'Named Locations & CA Policies', q: 'azure+ad+conditional+access+named+locations+policies+tutorial', ch: 'Microsoft' },
    ]},
    i3: { items: [
      { label: 'Intune Reporting & Endpoint Analytics', q: 'microsoft+intune+reporting+endpoint+analytics+dashboard', ch: 'Microsoft Mechanics' },
      { label: 'Monitor Devices with Intune', q: 'microsoft+intune+monitoring+device+health+alerts+tutorial', ch: 'Microsoft' },
    ]},
    i4: { items: [
      { label: 'Windows Autopilot — Full Walkthrough', q: 'windows+autopilot+tutorial+microsoft+mechanics+step+by+step', ch: 'Microsoft Mechanics' },
      { label: 'Autopilot White Glove & Pre-provisioning', q: 'windows+autopilot+white+glove+pre+provisioning+tutorial', ch: 'Microsoft' },
    ]},
    a1: { items: [
      { label: 'Security Baselines in Microsoft Intune', q: 'microsoft+intune+security+baselines+tutorial+hardening', ch: 'Microsoft Mechanics' },
      { label: 'CIS & Microsoft Security Benchmark', q: 'microsoft+intune+CIS+benchmark+security+hardening+policy', ch: 'Microsoft' },
    ]},
    a2: { items: [
      { label: 'PowerShell Scripts with Microsoft Intune', q: 'microsoft+intune+powershell+scripts+deployment+tutorial', ch: 'Microsoft Mechanics' },
      { label: 'Microsoft Graph API for Intune Automation', q: 'microsoft+graph+api+intune+powershell+automation+tutorial', ch: 'Microsoft' },
    ]},
    a3: { items: [
      { label: 'Co-management — Intune + SCCM', q: 'microsoft+intune+co+management+SCCM+configuration+manager+tutorial', ch: 'Microsoft Mechanics' },
      { label: 'Tenant Attach & Workload Migration', q: 'microsoft+intune+tenant+attach+workloads+migration+tutorial', ch: 'Microsoft' },
    ]},
    a4: { items: [
      { label: 'BYOD & MAM App Protection Policies', q: 'microsoft+intune+MAM+BYOD+app+protection+policy+tutorial', ch: 'Microsoft Mechanics' },
      { label: 'Protect Corporate Data on Personal Devices', q: 'intune+protect+corporate+data+personal+devices+outlook+teams', ch: 'Microsoft' },
    ]},
    e1: { items: [
      { label: 'Microsoft Graph API — Intune Automation', q: 'microsoft+graph+API+intune+automation+REST+tutorial', ch: 'Microsoft Mechanics' },
      { label: 'Build Intune CI/CD Pipelines', q: 'intune+automation+CI+CD+pipeline+graph+api+devops', ch: 'Microsoft' },
    ]},
    e2: { items: [
      { label: 'Zero Trust Architecture with Intune', q: 'microsoft+intune+zero+trust+architecture+tutorial', ch: 'Microsoft Mechanics' },
      { label: 'End-to-End Zero Trust Security', q: 'microsoft+zero+trust+endpoint+security+intune+defender', ch: 'Microsoft' },
    ]},
    e3: { items: [
      { label: 'Enterprise Intune Deployment — Full Lab', q: 'microsoft+intune+enterprise+deployment+tutorial+full', ch: 'Microsoft Mechanics' },
      { label: 'Intune Autopilot + Compliance + CA Lab', q: 'intune+autopilot+compliance+conditional+access+lab+demo', ch: 'Microsoft' },
    ]},
  };
  const v = data[id];
  if (!v) return '';
  const cards = v.items.map(function(item, idx) {
    return '<a href="https://www.youtube.com/results?search_query=' + item.q +
      '" target="_blank" rel="noopener" class="video-card">' +
      '<div class="video-thumb"><div class="yt-logo">&#9654;</div>' +
      '<div class="video-num">' + (idx + 1) + '</div></div>' +
      '<div class="video-info">' +
      '<div class="video-title">' + item.label + '</div>' +
      '<div class="video-meta">&#127916; ' + item.ch + ' &nbsp;&middot;&nbsp; YouTube</div>' +
      '</div><div class="video-arrow">&#8594;</div></a>';
  }).join('');
  return '<div class="section video-section">' +
    '<h2>&#128250; Video Tutorials</h2>' +
    '<p class="video-section-sub">Click a card to watch official Microsoft tutorial videos on YouTube.</p>' +
    '<div class="video-cards">' + cards + '</div></div>';
}

// ─────────────────────────────────────────────
// ERROR CODES HELPERS
// ─────────────────────────────────────────────
function filterErrors(val) {
  var q = (val || '').toLowerCase();
  document.querySelectorAll('.err-card').forEach(function(card) {
    var code = (card.getAttribute('data-code') || '').toLowerCase();
    var title = (card.getAttribute('data-title') || '').toLowerCase();
    var show = !q || code.indexOf(q) > -1 || title.indexOf(q) > -1;
    card.style.display = show ? '' : 'none';
  });
}
function setErrCat(cat, btn) {
  document.querySelectorAll('.err-cat-btn').forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  var searchEl = document.getElementById('err-search');
  if (searchEl) searchEl.value = '';
  document.querySelectorAll('.err-card').forEach(function(card) {
    var show = cat === 'all' || card.getAttribute('data-cat') === cat;
    card.style.display = show ? '' : 'none';
  });
}
function toggleErrCard(code) {
  var card = document.getElementById('ec-' + code);
  if (!card) return;
  var wasOpen = card.classList.contains('open');
  document.querySelectorAll('.err-card.open').forEach(function(c) { c.classList.remove('open'); });
  if (!wasOpen) card.classList.add('open');
}

// ─────────────────────────────────────────────
// SCENARIO HELPERS
// ─────────────────────────────────────────────
function showScenario(id) {
  var grid = document.getElementById('sc-grid');
  if (grid) grid.style.display = 'none';
  document.querySelectorAll('.sc-detail').forEach(function(d) { d.style.display = 'none'; });
  var detail = document.getElementById('sc-detail-' + id);
  if (detail) detail.style.display = 'block';
}
function hideScenario() {
  document.querySelectorAll('.sc-detail').forEach(function(d) { d.style.display = 'none'; });
  var grid = document.getElementById('sc-grid');
  if (grid) grid.style.display = 'grid';
}
function toggleScenarioStep(id, idx) {
  var key = 'intune_sc_' + id;
  var prog = JSON.parse(localStorage.getItem(key) || '[]');
  prog[idx] = !prog[idx];
  localStorage.setItem(key, JSON.stringify(prog));
  var chk = document.getElementById('sc-chk-' + id + '-' + idx);
  var ttl = document.getElementById('sc-ttl-' + id + '-' + idx);
  if (chk) { if (prog[idx]) { chk.classList.add('done'); chk.innerHTML = '&#10003;'; } else { chk.classList.remove('done'); chk.innerHTML = ''; } }
  if (ttl) { if (prog[idx]) ttl.classList.add('done'); else ttl.classList.remove('done'); }
  var total = document.querySelectorAll('.sc-step-check[id^="sc-chk-' + id + '-"]').length;
  var done = prog.filter(Boolean).length;
  var pct = total > 0 ? Math.round(done / total * 100) : 0;
  ['sc-fill-' + id, 'sc-fill-d-' + id].forEach(function(fid) { var el = document.getElementById(fid); if (el) el.style.width = pct + '%'; });
  ['sc-pct-' + id, 'sc-pct-d-' + id].forEach(function(pid) { var el = document.getElementById(pid); if (el) el.textContent = done + ' / ' + total + ' steps (' + pct + '%)'; });
}
function getScenarioProg(id, total) {
  var prog = JSON.parse(localStorage.getItem('intune_sc_' + id) || '[]');
  var done = prog.filter(Boolean).length;
  return { done: done, total: total, pct: total > 0 ? Math.round(done / total * 100) : 0, arr: prog };
}

const PAGES = {

  // ─────────────────────────────────────────────
  // DASHBOARD
  // ─────────────────────────────────────────────
  dashboard: {
    title: 'Welcome to Intune Learning Hub',
    render: () => `
<div class="content-header">
  <div class="breadcrumb">🏠 Home</div>
  <h1>Microsoft Intune — Beginner to Expert</h1>
  <div class="meta-row">
    <span class="meta-chip">15 Modules</span>
    <span class="meta-chip">4 Quizzes</span>
    <span class="meta-chip">6 Guided Scenarios</span>
    <span class="meta-chip">33 Error Codes</span>
    <span class="meta-chip">Auto-Updated</span>
  </div>
</div>

<div class="dash-grid">
  <div class="stat-card">
    <div class="stat-label">Modules Completed</div>
    <div class="stat-val" id="dash-completed">0</div>
    <div class="stat-sub">of 16 total</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Quizzes Passed</div>
    <div class="stat-val" id="dash-quizzes">0</div>
    <div class="stat-sub">of 4 assessments</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">Current Level</div>
    <div class="stat-val" style="font-size:18px" id="dash-level">Beginner</div>
    <div class="stat-sub">Keep going!</div>
  </div>
</div>

<h2 style="margin-bottom:14px;font-size:16px;">📚 Learning Path</h2>
<div class="module-grid">
  ${[
    {id:'b1',level:'Beginner',color:'#54b054',title:'What is Intune?',desc:'MDM vs MAM, licensing, architecture overview'},
    {id:'b2',level:'Beginner',color:'#54b054',title:'Setup & Enrollment',desc:'Enroll Windows, iOS, Android devices'},
    {id:'b3',level:'Beginner',color:'#54b054',title:'Device Compliance',desc:'Create your first compliance policy'},
    {id:'b4',level:'Beginner',color:'#54b054',title:'App Deployment',desc:'Deploy apps to managed devices'},
    {id:'i1',level:'Intermediate',color:'#ffd700',title:'Configuration Profiles',desc:'Push settings, restrictions, and certificates'},
    {id:'i2',level:'Intermediate',color:'#ffd700',title:'Conditional Access',desc:'Block non-compliant devices from M365'},
    {id:'i3',level:'Intermediate',color:'#ffd700',title:'Reporting & Monitoring',desc:'Dashboards, alerts, and device health'},
    {id:'i4',level:'Intermediate',color:'#ffd700',title:'Windows Autopilot',desc:'Zero-touch device provisioning'},
    {id:'a1',level:'Advanced',color:'#ff7a7a',title:'Security Baselines',desc:'CIS, NIST, Microsoft hardening policies'},
    {id:'a2',level:'Advanced',color:'#ff7a7a',title:'PowerShell & Scripts',desc:'Automate Intune with scripts and Graph'},
    {id:'a3',level:'Advanced',color:'#ff7a7a',title:'Co-management & SCCM',desc:'Hybrid management with Config Manager'},
    {id:'a4',level:'Advanced',color:'#ff7a7a',title:'BYOD & MAM Policies',desc:'Protect corp data on personal devices'},
    {id:'e1',level:'Expert',color:'#c07aff',title:'Graph API & Automation',desc:'Build Intune automation pipelines'},
    {id:'e2',level:'Expert',color:'#c07aff',title:'Zero Trust Architecture',desc:'End-to-end Zero Trust with Intune'},
    {id:'e3',level:'Expert',color:'#c07aff',title:'Enterprise Lab',desc:'Full enterprise deployment scenario'},
  ].map(m => `
  <div class="module-card" onclick="showPage('${m.id}')">
    <div class="mc-level" style="color:${m.color}"><span class="level-dot" style="background:${m.color}"></span>${m.level}</div>
    <h3>${m.title}</h3>
    <p>${m.desc}</p>
    <div class="mc-footer">
      <span id="mc-status-${m.id}">Not started</span>
      <span>→</span>
    </div>
  </div>`).join('')}
</div>
`},

  // ─────────────────────────────────────────────
  // B1 — WHAT IS INTUNE
  // ─────────────────────────────────────────────
  b1: {
    title: 'What is Microsoft Intune?',
    level: 'Beginner',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="showPage('dashboard')">🏠 Home</span> › <span class="level-badge badge-beginner">Beginner</span></div>
  <h1>What is Microsoft Intune?</h1>
  <div class="meta-row">
    <span class="meta-chip">~20 min</span>
    <span class="meta-chip badge-beginner">Beginner</span>
  </div>
</div>
<div class="content-body">

<div class="section">
  <h2>🎯 Overview</h2>
  <p>Microsoft Intune is a <strong>cloud-based endpoint management solution</strong> that allows IT administrators to manage and secure devices and applications across an organisation — without needing on-premises infrastructure.</p>
  <p>It is part of the <strong>Microsoft Endpoint Manager (MEM)</strong> suite and integrates tightly with Azure Active Directory (Entra ID) and Microsoft 365.</p>
  <div class="callout callout-info">
    <span>💡</span>
    <div>Intune is the evolution from on-premises solutions like SCCM (now Config Manager). With Intune, there is nothing to install on-prem — everything is managed from <strong>intune.microsoft.com</strong>.</div>
  </div>
</div>

<div class="section">
  <h2>📱 MDM vs MAM — Understanding the Key Concepts</h2>
  <h3>Mobile Device Management (MDM)</h3>
  <p>MDM gives Intune <strong>full control over the device</strong>. The device is enrolled and Intune can:</p>
  <ul>
    <li>Remotely wipe or retire the device</li>
    <li>Push certificates, Wi-Fi profiles, VPN configs</li>
    <li>Enforce encryption (BitLocker)</li>
    <li>Block non-compliant devices from accessing corporate resources</li>
  </ul>
  <h3>Mobile Application Management (MAM)</h3>
  <p>MAM manages <strong>applications only</strong>, not the entire device. Ideal for BYOD (Bring Your Own Device) scenarios:</p>
  <ul>
    <li>Protect corporate data inside apps (Outlook, Teams, OneDrive)</li>
    <li>Prevent copy/paste from managed to unmanaged apps</li>
    <li>Remote wipe only corporate app data, leaving personal data untouched</li>
  </ul>

  <div class="scenario">
    <div class="scenario-label">🏢 Practical Scenario — Contoso Ltd.</div>
    <h4>Problem: Mixing corporate and personal devices</h4>
    <p>Contoso has 500 employees. 300 use company-issued laptops (MDM enrolled), 200 use personal phones to access corporate email. Solution: Use <strong>MDM for corp devices</strong> to enforce full compliance. Use <strong>MAM-without-enrollment (MAM-WE)</strong> for personal phones — protecting Outlook and Teams data without touching personal content.</p>
  </div>
</div>

<div class="section">
  <h2>🏗️ Architecture</h2>
  <p>Understanding how Intune fits into the Microsoft ecosystem:</p>
  <ul>
    <li><strong>Azure AD (Entra ID)</strong> — Identity. Devices join Azure AD; users authenticate via Azure AD.</li>
    <li><strong>Intune</strong> — Policy engine. Compliance, configuration, app deployment.</li>
    <li><strong>Conditional Access</strong> — Gate. Allows/blocks access based on compliance state.</li>
    <li><strong>Microsoft Defender for Endpoint</strong> — Security signals feed into Intune compliance.</li>
    <li><strong>Microsoft 365 Apps</strong> — Apps protected by MAM policies.</li>
  </ul>
  <div class="callout callout-tip">
    <span>✅</span>
    <div><strong>Key flow:</strong> User logs in → Azure AD checks identity → Intune checks device compliance → Conditional Access grants/blocks access to M365.</div>
  </div>
</div>

<div class="section">
  <h2>📋 Licensing</h2>
  <p>Intune is included in several Microsoft plans:</p>
  <ul>
    <li><strong>Microsoft 365 Business Premium</strong> — includes Intune for SMBs</li>
    <li><strong>Microsoft 365 E3 / E5</strong> — enterprise with advanced security</li>
    <li><strong>Enterprise Mobility + Security (EMS) E3 / E5</strong> — Intune + Azure AD P1/P2 + Defender</li>
    <li><strong>Intune Plan 1 / Plan 2</strong> — standalone Intune licenses</li>
  </ul>
  <div class="callout callout-warn">
    <span>⚠️</span>
    <div>Conditional Access requires <strong>Azure AD Premium P1</strong> at minimum. Most enterprise scenarios need EMS E3 or M365 E3.</div>
  </div>
</div>

<div class="section">
  <h2>🌐 Supported Platforms</h2>
  <ul>
    <li>Windows 10 / 11 (including ARM)</li>
    <li>macOS 12+</li>
    <li>iOS / iPadOS 16+</li>
    <li>Android (Android Enterprise, Samsung Knox)</li>
    <li>Linux (Ubuntu 20.04+)</li>
    <li>ChromeOS (via Google Admin integration)</li>
  </ul>
</div>

${configStepsSection('b1')}
${visualSection('b1')}
${videoSection('b1')}
<div class="btn-row">
  <button class="btn btn-primary" onclick="markComplete('b1'); showPage('b2')">Next: Setup &amp; Enrollment →</button>
  <button class="btn btn-outline" onclick="markComplete('b1')">✓ Mark Complete</button>
</div>
</div>`},

  // ─────────────────────────────────────────────
  // B2 — SETUP & ENROLLMENT
  // ─────────────────────────────────────────────
  b2: {
    title: 'Setup & Device Enrollment',
    level: 'Beginner',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="showPage('dashboard')">🏠 Home</span> › <span class="level-badge badge-beginner">Beginner</span></div>
  <h1>Setup & Device Enrollment</h1>
  <div class="meta-row"><span class="meta-chip">~25 min</span><span class="meta-chip badge-beginner">Beginner</span></div>
</div>
<div class="content-body">

<div class="section">
  <h2>🚀 Initial Intune Setup</h2>
  <p>Before enrolling devices, configure the Intune tenant. Go to <strong>intune.microsoft.com</strong> → Tenant Administration → Tenant Status.</p>
  <div class="steps">
    <div class="step">
      <div class="step-content">
        <div class="step-title">Set MDM Authority</div>
        <div class="step-desc">Navigate to Tenant Administration → Intune Authority. Set MDM authority to <strong>Microsoft Intune</strong> (not SCCM). This is a one-time, irreversible action.</div>
      </div>
    </div>
    <div class="step">
      <div class="step-content">
        <div class="step-title">Configure Enrollment Restrictions</div>
        <div class="step-desc">Devices → Enrollment Restrictions. Set which platforms are allowed (Windows, iOS, Android), max device count per user, and whether personal devices can enroll.</div>
      </div>
    </div>
    <div class="step">
      <div class="step-content">
        <div class="step-title">Assign Intune Licenses</div>
        <div class="step-desc">Users must have an Intune license. Assign via Microsoft 365 Admin Center → Users → Active Users → Licenses. Or use Azure AD group-based licensing.</div>
      </div>
    </div>
    <div class="step">
      <div class="step-content">
        <div class="step-title">Configure Company Branding</div>
        <div class="step-desc">Tenant Administration → Customization. Add your company logo, colour, and support contact info. This appears in the Company Portal app.</div>
      </div>
    </div>
  </div>
</div>

<div class="section">
  <h2>💻 Windows Device Enrollment</h2>
  <h3>Method 1: Azure AD Join (Recommended for corporate devices)</h3>
  <p>The device joins Azure AD and Intune simultaneously during OOBE (Out-of-Box Experience) or after setup.</p>
  <div class="steps">
    <div class="step"><div class="step-content"><div class="step-title">OOBE Enrollment</div><div class="step-desc">During Windows setup, on the "Set up for an organization" screen, enter corporate credentials. Device auto-joins Azure AD and enrolls in Intune.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Post-Setup Enrollment</div><div class="step-desc">Settings → Accounts → Access work or school → Connect. Enter corporate email. Windows enrolls in Azure AD and Intune.</div></div></div>
  </div>

  <h3>Method 2: MDM Auto-enrollment (with Group Policy)</h3>
  <div class="code-block">
<span class="comment"># Group Policy path for auto-enrollment</span>
<span class="kw">Computer Configuration</span> → Administrative Templates
  → Windows Components → MDM
  → <span class="str">"Enable automatic MDM enrollment using default Azure AD credentials"</span>
  → Set to: <span class="kw">Enabled</span>
  </div>

  <div class="scenario">
    <div class="scenario-label">🏢 Practical Scenario — Fabrikam Inc.</div>
    <h4>Bulk Windows 11 enrollment via Autopilot</h4>
    <p>Fabrikam is rolling out 200 new laptops. Instead of manually enrolling each one, they use <strong>Windows Autopilot</strong> — devices are pre-registered by hardware hash, ship directly to employees, and automatically enroll and configure via Intune on first boot. Zero IT touch required.</p>
  </div>
</div>

<div class="section">
  <h2>📱 iOS / iPadOS Enrollment</h2>
  <h3>Method 1: Company Portal (User-driven)</h3>
  <p>User downloads <strong>Company Portal</strong> from App Store → Signs in with corporate credentials → Follows enrollment prompts → Device receives Intune profile.</p>

  <h3>Method 2: Apple Business Manager + ADE (Automated Device Enrollment)</h3>
  <p>Best for corporate-owned devices. Devices are supervised, cannot be unenrolled by users, and auto-enroll on activation.</p>
  <div class="callout callout-info">
    <span>💡</span>
    <div>ADE (formerly DEP) requires an <strong>Apple Business Manager (ABM)</strong> account linked to your Intune tenant via an MDM Push Certificate and enrollment token.</div>
  </div>
</div>

<div class="section">
  <h2>🤖 Android Enrollment</h2>
  <table style="width:100%;font-size:13px;border-collapse:collapse;">
    <tr style="border-bottom:1px solid var(--border);">
      <th style="text-align:left;padding:8px;color:var(--accent2);">Mode</th>
      <th style="text-align:left;padding:8px;color:var(--accent2);">Use Case</th>
      <th style="text-align:left;padding:8px;color:var(--accent2);">Management Level</th>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px;">Work Profile</td>
      <td style="padding:8px;">BYOD — personal + work</td>
      <td style="padding:8px;">Work apps only</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px;">Fully Managed</td>
      <td style="padding:8px;">Corp-owned, single user</td>
      <td style="padding:8px;">Full device control</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px;">Dedicated (Kiosk)</td>
      <td style="padding:8px;">Shared kiosk devices</td>
      <td style="padding:8px;">Locked to specific apps</td>
    </tr>
    <tr>
      <td style="padding:8px;">COPE</td>
      <td style="padding:8px;">Corp-owned, personal use</td>
      <td style="padding:8px;">Full + work profile</td>
    </tr>
  </table>
</div>

${configStepsSection('b2')}
${visualSection('b2')}
${videoSection('b2')}
<div class="btn-row">
  <button class="btn btn-primary" onclick="markComplete('b2'); showPage('b3')">Next: Device Compliance →</button>
  <button class="btn btn-outline" onclick="markComplete('b2')">✓ Mark Complete</button>
</div>
</div>`},

  // ─────────────────────────────────────────────
  // B3 — DEVICE COMPLIANCE
  // ─────────────────────────────────────────────
  b3: {
    title: 'Device Compliance Policies',
    level: 'Beginner',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="showPage('dashboard')">🏠 Home</span> › <span class="level-badge badge-beginner">Beginner</span></div>
  <h1>Device Compliance Policies</h1>
  <div class="meta-row"><span class="meta-chip">~20 min</span><span class="meta-chip badge-beginner">Beginner</span></div>
</div>
<div class="content-body">

<div class="section">
  <h2>🔍 What is Compliance?</h2>
  <p>A compliance policy is a set of rules and settings that a device must meet to be considered <strong>compliant</strong>. Intune evaluates the device against these rules and reports its compliance state to Azure AD.</p>
  <p><strong>Compliance state feeds into Conditional Access.</strong> Non-compliant devices can be blocked from accessing Microsoft 365 resources.</p>
  <div class="callout callout-warn">
    <span>⚠️</span>
    <div>A device with <strong>no compliance policy assigned</strong> is considered <strong>compliant by default</strong>. Change this in Tenant Administration → Device Compliance Settings → Mark devices with no compliance policy as: <strong>Not compliant</strong>.</div>
  </div>
</div>

<div class="section">
  <h2>📋 Creating a Windows Compliance Policy</h2>
  <p>Devices → Compliance → Create Policy → Windows 10 and later</p>
  <h3>Common compliance settings:</h3>
  <ul>
    <li><strong>Minimum OS version:</strong> e.g., 10.0.19044 (Windows 10 21H2)</li>
    <li><strong>BitLocker required:</strong> Encrypts drives, validates with TPM</li>
    <li><strong>Secure Boot enabled</strong></li>
    <li><strong>Code Integrity required</strong></li>
    <li><strong>Firewall required</strong></li>
    <li><strong>Antivirus required</strong> (Windows Defender must be active)</li>
    <li><strong>Password required:</strong> Minimum length 8, complexity required</li>
    <li><strong>Machine Risk Score:</strong> Integrate with Defender for Endpoint</li>
  </ul>

  <div class="scenario">
    <div class="scenario-label">🏢 Practical Scenario — NorthWind Traders</div>
    <h4>Compliance policy to block old OS versions</h4>
    <p>NorthWind's security team found that 15% of devices were running unpatched Windows 10. They created a compliance policy requiring a minimum OS version. Devices below the threshold became non-compliant. Conditional Access blocked them from email until users updated. Within 2 weeks, 98% of the fleet was on the approved version.</p>
  </div>
</div>

<div class="section">
  <h2>⏱️ Non-compliance Actions</h2>
  <p>Instead of immediately blocking, Intune can take <strong>graduated actions</strong>:</p>
  <table style="width:100%;font-size:13px;border-collapse:collapse;">
    <tr style="border-bottom:1px solid var(--border);">
      <th style="text-align:left;padding:8px;color:var(--accent2);">Action</th>
      <th style="text-align:left;padding:8px;color:var(--accent2);">Schedule</th>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px;">Mark device non-compliant</td>
      <td style="padding:8px;">Immediately (Day 0)</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px;">Send email to user</td>
      <td style="padding:8px;">Day 1</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px;">Send push notification</td>
      <td style="padding:8px;">Day 3</td>
    </tr>
    <tr>
      <td style="padding:8px;">Retire device / Remote lock</td>
      <td style="padding:8px;">Day 30</td>
    </tr>
  </table>
</div>

<div class="section">
  <h2>📊 Compliance Dashboard</h2>
  <p>Navigate to Devices → Compliance to see:</p>
  <ul>
    <li>Overall compliance percentage across your fleet</li>
    <li>Breakdown by platform (Windows, iOS, Android, macOS)</li>
    <li>Per-policy compliance rates</li>
    <li>Non-compliance reasons (most common settings failing)</li>
    <li>Per-device compliance drill-down</li>
  </ul>
</div>

${configStepsSection('b3')}
${visualSection('b3')}
${videoSection('b3')}
<div class="btn-row">
  <button class="btn btn-primary" onclick="markComplete('b3'); showPage('b4')">Next: App Deployment →</button>
  <button class="btn btn-outline" onclick="markComplete('b3')">✓ Mark Complete</button>
</div>
</div>`},

  // ─────────────────────────────────────────────
  // B4 — APP DEPLOYMENT
  // ─────────────────────────────────────────────
  b4: {
    title: 'App Deployment',
    level: 'Beginner',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="showPage('dashboard')">🏠 Home</span> › <span class="level-badge badge-beginner">Beginner</span></div>
  <h1>App Deployment</h1>
  <div class="meta-row"><span class="meta-chip">~25 min</span><span class="meta-chip badge-beginner">Beginner</span></div>
</div>
<div class="content-body">

<div class="section">
  <h2>📦 App Types in Intune</h2>
  <table style="width:100%;font-size:13px;border-collapse:collapse;">
    <tr style="border-bottom:1px solid var(--border);">
      <th style="padding:8px;text-align:left;color:var(--accent2);">App Type</th>
      <th style="padding:8px;text-align:left;color:var(--accent2);">Platform</th>
      <th style="padding:8px;text-align:left;color:var(--accent2);">Notes</th>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px;">Microsoft Store app (new)</td><td style="padding:8px;">Windows</td><td style="padding:8px;">Online catalog, auto-updates</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px;">Win32 app (.exe/.msi)</td><td style="padding:8px;">Windows</td><td style="padding:8px;">Most powerful, use .intunewin wrapper</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px;">Microsoft 365 Apps</td><td style="padding:8px;">Windows/macOS</td><td style="padding:8px;">Built-in connector, click-to-run</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px;">iOS Store / VPP App</td><td style="padding:8px;">iOS/iPadOS</td><td style="padding:8px;">Requires Apple Business Manager VPP</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px;">Managed Google Play</td><td style="padding:8px;">Android</td><td style="padding:8px;">Android Enterprise apps</td>
    </tr>
    <tr>
      <td style="padding:8px;">Web link</td><td style="padding:8px;">All</td><td style="padding:8px;">Adds URL shortcut to device</td>
    </tr>
  </table>
</div>

<div class="section">
  <h2>🪟 Deploying a Win32 App</h2>
  <p>Win32 apps give the most control. The app is packaged as a <strong>.intunewin</strong> file using the Microsoft Win32 Content Prep Tool.</p>
  <div class="steps">
    <div class="step">
      <div class="step-content">
        <div class="step-title">Package the app</div>
        <div class="step-desc">Download IntuneWinAppUtil.exe. Run it with your source folder, setup file, and output folder. Creates a .intunewin file.</div>
      </div>
    </div>
    <div class="step">
      <div class="step-content">
        <div class="step-title">Upload to Intune</div>
        <div class="step-desc">Apps → Windows → Add → Windows app (Win32). Upload the .intunewin file. Configure app name, description, publisher.</div>
      </div>
    </div>
    <div class="step">
      <div class="step-content">
        <div class="step-title">Configure install/uninstall commands</div>
        <div class="step-desc">Example install command: <code>setup.exe /silent</code> or <code>msiexec /i app.msi /qn</code>. Detection rule: MSI product code, file existence, or registry key.</div>
      </div>
    </div>
    <div class="step">
      <div class="step-content">
        <div class="step-title">Assign to groups</div>
        <div class="step-desc">Assignments tab: Required (force install), Available for enrolled devices (user-initiated from Company Portal), or Uninstall.</div>
      </div>
    </div>
  </div>

  <div class="code-block">
<span class="comment"># Example: Package 7-Zip for deployment</span>
.\\IntuneWinAppUtil.exe <span class="kw">-c</span> <span class="str">C:\\Apps\\7zip</span> <span class="kw">-s</span> <span class="str">7z2301-x64.exe</span> <span class="kw">-o</span> <span class="str">C:\\Output</span>

<span class="comment"># Install command in Intune:</span>
7z2301-x64.exe <span class="str">/S</span>

<span class="comment"># Detection rule (registry):</span>
HKEY_LOCAL_MACHINE\\SOFTWARE\\7-Zip  →  Value: Path  →  Exists
  </div>

  <div class="scenario">
    <div class="scenario-label">🏢 Practical Scenario — Adventure Works</div>
    <h4>Deploying a custom LOB application</h4>
    <p>Adventure Works has a custom inventory app (InventoryPro.exe) that must be on all warehouse PCs. The IT admin packages it as .intunewin, sets Required assignment to the "Warehouse Devices" Azure AD group, configures a detection rule checking for the app's registry key, and sets a retry count of 3. All 85 warehouse PCs silently receive the app within 2 hours of the policy syncing.</p>
  </div>
</div>

<div class="section">
  <h2>📱 Microsoft 365 Apps Deployment</h2>
  <p>Built-in deployment connector — no packaging needed.</p>
  <div class="steps">
    <div class="step"><div class="step-content"><div class="step-title">Add app</div><div class="step-desc">Apps → Windows → Add → Microsoft 365 Apps for Windows 10 and later</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Configure suite settings</div><div class="step-desc">Choose apps (Word, Excel, Teams, etc.), channel (Current/Monthly Enterprise/Semi-Annual), 32-bit or 64-bit, language.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Assign to user or device group</div><div class="step-desc">Assign as Required to your "All Corporate Devices" group. Apps install silently during next device sync.</div></div></div>
  </div>
</div>

${configStepsSection('b4')}
${visualSection('b4')}
${videoSection('b4')}
<div class="btn-row">
  <button class="btn btn-primary" onclick="markComplete('b4'); showPage('quiz-beginner')">Take Beginner Quiz →</button>
  <button class="btn btn-outline" onclick="markComplete('b4')">✓ Mark Complete</button>
</div>
</div>`},

  // ─────────────────────────────────────────────
  // I1 — CONFIGURATION PROFILES
  // ─────────────────────────────────────────────
  i1: {
    title: 'Configuration Profiles',
    level: 'Intermediate',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="showPage('dashboard')">🏠 Home</span> › <span class="level-badge badge-intermediate">Intermediate</span></div>
  <h1>Configuration Profiles</h1>
  <div class="meta-row"><span class="meta-chip">~30 min</span><span class="meta-chip badge-intermediate">Intermediate</span></div>
</div>
<div class="content-body">

<div class="section">
  <h2>⚙️ What are Configuration Profiles?</h2>
  <p>Configuration profiles push <strong>settings</strong> to devices. Unlike compliance (which checks rules), configuration profiles <strong>actively configure</strong> device settings. Think of them as Group Policy Objects (GPOs) for the cloud.</p>
  <h3>Profile Types for Windows</h3>
  <ul>
    <li><strong>Settings Catalog</strong> — 1,500+ settings, replaces legacy templates. The recommended approach.</li>
    <li><strong>Templates</strong> — pre-built profiles for Device Restrictions, Email, VPN, Wi-Fi, Certificates, etc.</li>
    <li><strong>Custom</strong> — OMA-URI for settings not yet in the catalog</li>
    <li><strong>Administrative Templates (ADMX)</strong> — Group Policy settings via cloud</li>
  </ul>
</div>

<div class="section">
  <h2>🔒 Creating a Device Restriction Profile</h2>
  <div class="steps">
    <div class="step"><div class="step-content"><div class="step-title">Navigate to Devices → Configuration → Create</div><div class="step-desc">Select platform (Windows 10+), profile type: Templates → Device Restrictions</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Configure restrictions</div><div class="step-desc">Common settings: Disable USB storage, block camera, disable Cortana, block store apps, require password timeout.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Assign to groups</div><div class="step-desc">Assign to device or user groups. Device groups apply regardless of who is logged in. User groups follow the user across devices.</div></div></div>
  </div>

  <div class="scenario">
    <div class="scenario-label">🏢 Practical Scenario — Secure Financial Firm</div>
    <h4>Locking down trading workstations</h4>
    <p>A financial services firm needs to prevent data exfiltration from trading floor PCs. Using a Device Restriction profile, they: block all removable storage (USB, SD), disable Bluetooth, block screen capture, enforce automatic screen lock after 5 minutes, and block access to personal email in the browser. Assigned to the "Trading Floor Devices" Azure AD group.</p>
  </div>
</div>

<div class="section">
  <h2>🌐 Settings Catalog — Advanced Configuration</h2>
  <p>The Settings Catalog is the modern way to configure Windows. Search for specific settings by name.</p>
  <div class="code-block">
<span class="comment"># Example: Settings Catalog — Disable AutoPlay on all drives</span>
<span class="key">Category:</span> Windows Components > AutoPlay Policies
<span class="key">Setting:</span> Turn off Autoplay
<span class="key">Value:</span> <span class="str">All drives</span>

<span class="comment"># Another: Force Windows Defender Antivirus realtime protection</span>
<span class="key">Category:</span> Windows Components > Windows Defender Antivirus > Real-time Protection
<span class="key">Setting:</span> Turn off real-time protection
<span class="key">Value:</span> <span class="str">Disabled</span> (disabling the disable = enable protection)
  </div>
</div>

<div class="section">
  <h2>📡 Custom OMA-URI Settings</h2>
  <p>For settings not in the catalog, use OMA-URI (Open Mobile Alliance Uniform Resource Identifier) with the Custom profile type.</p>
  <div class="code-block">
<span class="comment"># Example: Block Microsoft Store for Business</span>
<span class="key">Name:</span> Block Store
<span class="key">OMA-URI:</span> ./Device/Vendor/MSFT/Policy/Config/ApplicationManagement/AllowStore
<span class="key">Data type:</span> Integer
<span class="key">Value:</span> <span class="str">0</span>

<span class="comment"># Example: Set DNS over HTTPS</span>
<span class="key">OMA-URI:</span> ./Device/Vendor/MSFT/Policy/Config/InternetExplorer/AllowEnhancedProtectedMode
  </div>

  <div class="callout callout-tip">
    <span>✅</span>
    <div>Use the <strong>Microsoft Endpoint Manager documentation</strong> and <strong>MSFT/Policy CSP</strong> reference for OMA-URI values. The Settings Catalog has replaced most OMA-URI needs since 2022.</div>
  </div>
</div>

<div class="section">
  <h2>🏷️ Profile Assignment Filters</h2>
  <p>Filters allow you to target specific devices within a group — without creating separate groups. Filters are evaluated on the device itself, not in Azure AD.</p>
  <div class="code-block">
<span class="comment"># Example filter: Target only physical machines (not VMs)</span>
<span class="key">Rule:</span> (device.model <span class="kw">-notStartsWith</span> <span class="str">"Virtual"</span>) <span class="kw">-and</span>
      (device.operatingSystemVersion <span class="kw">-startsWith</span> <span class="str">"10.0.2"</span>)
  </div>
</div>

${configStepsSection('i1')}
${visualSection('i1')}
${videoSection('i1')}
<div class="btn-row">
  <button class="btn btn-primary" onclick="markComplete('i1'); showPage('i2')">Next: Conditional Access →</button>
  <button class="btn btn-outline" onclick="markComplete('i1')">✓ Mark Complete</button>
</div>
</div>`},

  // ─────────────────────────────────────────────
  // I2 — CONDITIONAL ACCESS
  // ─────────────────────────────────────────────
  i2: {
    title: 'Conditional Access',
    level: 'Intermediate',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="showPage('dashboard')">🏠 Home</span> › <span class="level-badge badge-intermediate">Intermediate</span></div>
  <h1>Conditional Access</h1>
  <div class="meta-row"><span class="meta-chip">~35 min</span><span class="meta-chip badge-intermediate">Intermediate</span></div>
</div>
<div class="content-body">

<div class="section">
  <h2>🔐 Understanding Conditional Access</h2>
  <p>Conditional Access (CA) is Azure AD's policy engine that grants or blocks access to cloud apps based on <strong>signals</strong>:</p>
  <ul>
    <li>User / group membership</li>
    <li>IP location</li>
    <li>Device platform</li>
    <li><strong>Intune compliance state</strong></li>
    <li>App being accessed</li>
    <li>Real-time risk (sign-in risk, user risk)</li>
  </ul>
  <div class="callout callout-info">
    <span>💡</span>
    <div>CA policies live in <strong>Azure AD (Entra ID) → Security → Conditional Access</strong>, not in Intune. But they consume Intune's compliance signal.</div>
  </div>
</div>

<div class="section">
  <h2>🏗️ Building a CA Policy — Require Compliant Device</h2>
  <div class="steps">
    <div class="step"><div class="step-content"><div class="step-title">Navigate to Azure AD → Security → Conditional Access → New Policy</div><div class="step-desc">Name: "Require Compliant Device for M365"</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Set Users and Groups</div><div class="step-desc">Include: All users. Exclude: Break-glass admin account, Service accounts. Always exclude at least one emergency access account.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Set Cloud Apps</div><div class="step-desc">Include: Office 365 (selects all M365 apps). Or target specific apps like Exchange Online, SharePoint Online.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Set Conditions</div><div class="step-desc">Device platforms: Windows, iOS, Android (exclude Linux/macOS if not MDM managed). Client apps: Browser + Mobile apps / desktop clients.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Set Grant Control</div><div class="step-desc">Grant → Require device to be marked as compliant. This blocks non-Intune-compliant devices from signing in to M365.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Enable in Report-only first</div><div class="step-desc">NEVER enable a new CA policy in "On" mode without testing in Report-only first. Review Sign-in logs to check impact.</div></div></div>
  </div>

  <div class="scenario">
    <div class="scenario-label">🏢 Practical Scenario — Global Bank</div>
    <h4>Blocking unmanaged devices from corporate email</h4>
    <p>Global Bank discovered employees were accessing Outlook from personal home PCs. They deployed a CA policy requiring compliant devices for Exchange Online. They ran it in Report-only for 2 weeks, identified 47 users on unmanaged PCs, helped them enroll or set up MAM-WE on Outlook mobile, then switched the policy to "On". Zero disruption to legitimate users.</p>
  </div>
</div>

<div class="section">
  <h2>🚦 Named Locations &amp; IP-based Access</h2>
  <div class="code-block">
<span class="comment"># Scenario: Allow trusted office IPs without MFA, require MFA elsewhere</span>

Policy 1: <span class="str">"Trusted Locations — No MFA"</span>
  Users: All
  Apps: Office 365
  Conditions → Locations: Named location <span class="str">"HQ + Branch Offices"</span> (your IP ranges)
  Grant: Allow

Policy 2: <span class="str">"Untrusted Locations — Require MFA"</span>
  Users: All
  Apps: Office 365
  Conditions → Locations: All locations, exclude <span class="str">"HQ + Branch Offices"</span>
  Grant: Require MFA
  </div>
</div>

<div class="section">
  <h2>⚡ Sign-in Risk Policies</h2>
  <p>Azure AD Identity Protection calculates risk scores for sign-ins. Combine with CA:</p>
  <ul>
    <li><strong>Low risk:</strong> Allow (or require MFA)</li>
    <li><strong>Medium risk:</strong> Require MFA + compliant device</li>
    <li><strong>High risk:</strong> Block access + require password reset</li>
  </ul>
  <div class="callout callout-warn">
    <span>⚠️</span>
    <div>Risk-based CA requires <strong>Azure AD Premium P2</strong>. Risk policies can be configured directly in Azure AD → Security → Identity Protection, or as CA policy conditions.</div>
  </div>
</div>

${configStepsSection('i2')}
${visualSection('i2')}
${videoSection('i2')}
<div class="btn-row">
  <button class="btn btn-primary" onclick="markComplete('i2'); showPage('i3')">Next: Reporting & Monitoring →</button>
  <button class="btn btn-outline" onclick="markComplete('i2')">✓ Mark Complete</button>
</div>
</div>`},

  // ─────────────────────────────────────────────
  // I3 — REPORTING & MONITORING
  // ─────────────────────────────────────────────
  i3: {
    title: 'Reporting & Monitoring',
    level: 'Intermediate',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="showPage('dashboard')">🏠 Home</span> › <span class="level-badge badge-intermediate">Intermediate</span></div>
  <h1>Reporting &amp; Monitoring</h1>
  <div class="meta-row"><span class="meta-chip">~25 min</span><span class="meta-chip badge-intermediate">Intermediate</span></div>
</div>
<div class="content-body">

<div class="section">
  <h2>📊 Intune Reports Overview</h2>
  <p>Intune provides built-in reports under <strong>Reports</strong> in the admin center. Reports are categorised as Operational (real-time), Historical (trend), and Specialty (specific use cases).</p>
  <h3>Key reports to know:</h3>
  <ul>
    <li><strong>Device compliance</strong> — compliance state per device/policy</li>
    <li><strong>App install status</strong> — deployment success/failure per app</li>
    <li><strong>Configuration profile assignment status</strong> — profile deployment state</li>
    <li><strong>Windows update compliance</strong> — patch status across fleet</li>
    <li><strong>Endpoint security</strong> — antivirus status, threat detection</li>
    <li><strong>Feature update report</strong> — Windows feature update deployment</li>
  </ul>
</div>

<div class="section">
  <h2>🔔 Alerts and Notifications</h2>
  <p>Tenant Administration → Tenant Status → Service Health shows Microsoft 365 service incidents. For custom alerts, use <strong>Endpoint Analytics</strong> or configure alerts via:</p>
  <ul>
    <li>Azure Monitor → Diagnostic Settings → Export Intune logs to Log Analytics</li>
    <li>Microsoft Sentinel — ingest Intune audit logs for SIEM analysis</li>
    <li>Logic Apps — automated workflows triggered by Intune events via Graph API</li>
  </ul>
  <div class="scenario">
    <div class="scenario-label">🏢 Practical Scenario — Monitoring Dashboard</div>
    <h4>Building an Intune health dashboard in Azure Monitor</h4>
    <p>An IT manager wants a daily email summarising non-compliant devices. They configure Intune Diagnostic Settings to send audit logs to Log Analytics, create a KQL query for non-compliant devices, set up an Alert Rule firing daily, and connect an Action Group sending an email to the IT team distribution list.</p>
  </div>
  <div class="code-block">
<span class="comment"># KQL — Find non-compliant Windows devices (Log Analytics)</span>
IntuneDevices
| where ComplianceState == <span class="str">"noncompliant"</span>
| where OS == <span class="str">"Windows"</span>
| project DeviceName, UserName, LastSyncTime, ComplianceState, NonCompliantReason
| order by LastSyncTime <span class="kw">desc</span>
  </div>
</div>

<div class="section">
  <h2>📈 Endpoint Analytics</h2>
  <p>Endpoint Analytics (in Microsoft Intune → Reports → Endpoint Analytics) provides:</p>
  <ul>
    <li><strong>Startup performance score</strong> — boot/login times, identify slow devices</li>
    <li><strong>Application reliability</strong> — app crash rates across fleet</li>
    <li><strong>Work from anywhere</strong> — cloud-readiness score per device</li>
    <li><strong>Battery health</strong> — battery capacity trends</li>
    <li><strong>Recommended software</strong> — OS/software version adoption</li>
  </ul>
</div>

${configStepsSection('i3')}
${visualSection('i3')}
${videoSection('i3')}
<div class="btn-row">
  <button class="btn btn-primary" onclick="markComplete('i3'); showPage('i4')">Next: Windows Autopilot →</button>
  <button class="btn btn-outline" onclick="markComplete('i3')">✓ Mark Complete</button>
</div>
</div>`},

  // ─────────────────────────────────────────────
  // I4 — WINDOWS AUTOPILOT
  // ─────────────────────────────────────────────
  i4: {
    title: 'Windows Autopilot',
    level: 'Intermediate',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="showPage('dashboard')">🏠 Home</span> › <span class="level-badge badge-intermediate">Intermediate</span></div>
  <h1>Windows Autopilot</h1>
  <div class="meta-row"><span class="meta-chip">~35 min</span><span class="meta-chip badge-intermediate">Intermediate</span></div>
</div>
<div class="content-body">

<div class="section">
  <h2>🚀 What is Windows Autopilot?</h2>
  <p>Windows Autopilot is a <strong>zero-touch provisioning</strong> platform. Devices are pre-registered by hardware hash. When a new device powers on, it automatically:</p>
  <ol>
    <li>Connects to Windows Autopilot service</li>
    <li>Applies the organisation's deployment profile</li>
    <li>Joins Azure AD and enrolls in Intune</li>
    <li>Receives configuration profiles, apps, and settings</li>
    <li>Delivers a ready-to-work device — with no IT imaging required</li>
  </ol>
</div>

<div class="section">
  <h2>🔧 Autopilot Deployment Modes</h2>
  <table style="width:100%;font-size:13px;border-collapse:collapse;">
    <tr style="border-bottom:1px solid var(--border);">
      <th style="padding:8px;text-align:left;color:var(--accent2);">Mode</th>
      <th style="padding:8px;text-align:left;color:var(--accent2);">Use Case</th>
      <th style="padding:8px;text-align:left;color:var(--accent2);">Join Type</th>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px;">User-Driven Azure AD Join</td><td style="padding:8px;">Standard employee laptop</td><td style="padding:8px;">Azure AD joined</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px;">User-Driven Hybrid Join</td><td style="padding:8px;">Need on-prem AD + Azure AD</td><td style="padding:8px;">Hybrid Azure AD joined</td>
    </tr>
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:8px;">Self-Deploying</td><td style="padding:8px;">Kiosks, shared devices</td><td style="padding:8px;">Azure AD joined, no user</td>
    </tr>
    <tr>
      <td style="padding:8px;">Pre-provisioning (White Glove)</td><td style="padding:8px;">IT pre-stages apps before delivery</td><td style="padding:8px;">Azure AD or Hybrid</td>
    </tr>
  </table>
</div>

<div class="section">
  <h2>📝 Setting Up Autopilot</h2>
  <div class="steps">
    <div class="step"><div class="step-content"><div class="step-title">Collect Hardware Hashes</div><div class="step-desc">On existing devices: <code>Get-WindowsAutoPilotInfo -OutputFile hashes.csv</code>. New devices: request CSV from OEM (Dell, HP, Lenovo, Microsoft) at time of purchase.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Import Hardware Hashes</div><div class="step-desc">Devices → Windows → Enrollment → Windows Autopilot → Devices → Import. Upload the CSV. Registration takes 10–15 minutes.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Create Deployment Profile</div><div class="step-desc">Devices → Enrollment → Deployment Profiles → Create. Set join type, OOBE settings (skip privacy settings, skip EULA, hide keyboard), naming template (e.g., CORP-%RAND:5%).</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Create Enrollment Status Page (ESP)</div><div class="step-desc">The ESP shows users provisioning progress. Block device use until required apps install. Target to All Devices or specific Autopilot group.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Assign profiles to device group</div><div class="step-desc">Create a Dynamic Azure AD group with rule: (device.devicePhysicalIds -any _ -contains "[ZTDId]"). This auto-captures all Autopilot-registered devices.</div></div></div>
  </div>

  <div class="code-block">
<span class="comment"># PowerShell: Collect hardware hash from a device</span>
<span class="kw">Install-Script</span> -Name Get-WindowsAutoPilotInfo
<span class="kw">Get-WindowsAutoPilotInfo</span> -OutputFile <span class="str">.\\AutoPilotHash.csv</span>

<span class="comment"># Dynamic group rule for Autopilot devices</span>
(device.devicePhysicalIds <span class="kw">-any</span> _ <span class="kw">-contains</span> <span class="str">"[ZTDId]"</span>)
  </div>

  <div class="scenario">
    <div class="scenario-label">🏢 Practical Scenario — Remote Workforce Onboarding</div>
    <h4>Day-1 ready devices shipped directly to new hires</h4>
    <p>A company onboards 50 new remote employees monthly. HR submits a device request. IT pre-registers hardware hashes with Dell. Dell ships devices directly to employees. On day 1, employees unbox the laptop, connect to home Wi-Fi, enter their corporate email — the Autopilot profile kicks in, device joins Azure AD, Intune deploys all apps (M365, VPN, security tools), and within 90 minutes the device is fully configured. No imaging, no IT hands-on.</p>
  </div>
</div>

${configStepsSection('i4')}
${visualSection('i4')}
${videoSection('i4')}
<div class="btn-row">
  <button class="btn btn-primary" onclick="markComplete('i4'); showPage('quiz-intermediate')">Take Intermediate Quiz →</button>
  <button class="btn btn-outline" onclick="markComplete('i4')">✓ Mark Complete</button>
</div>
</div>`},

  // ─────────────────────────────────────────────
  // A1 — SECURITY BASELINES
  // ─────────────────────────────────────────────
  a1: {
    title: 'Security Baselines',
    level: 'Advanced',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="showPage('dashboard')">🏠 Home</span> › <span class="level-badge badge-advanced">Advanced</span></div>
  <h1>Security Baselines</h1>
  <div class="meta-row"><span class="meta-chip">~30 min</span><span class="meta-chip badge-advanced">Advanced</span></div>
</div>
<div class="content-body">

<div class="section">
  <h2>🔑 What are Security Baselines?</h2>
  <p>Security baselines are pre-configured groups of settings recommended by Microsoft security teams. They implement hundreds of security settings based on industry frameworks (CIS Benchmarks, NIST, DoD STIG). Instead of manually configuring 300+ settings, deploy one baseline.</p>
  <p>Available baselines in Intune (Endpoint Security → Security Baselines):</p>
  <ul>
    <li><strong>Windows Security Baseline</strong> (Windows 10/11)</li>
    <li><strong>Microsoft Defender for Endpoint Baseline</strong></li>
    <li><strong>Microsoft Edge Baseline</strong></li>
    <li><strong>Microsoft 365 Apps for Enterprise Baseline</strong></li>
    <li><strong>Windows 365 Cloud PC Security Baseline</strong></li>
  </ul>
</div>

<div class="section">
  <h2>⚙️ Deploying a Security Baseline</h2>
  <div class="steps">
    <div class="step"><div class="step-content"><div class="step-title">Review baseline settings before deploying</div><div class="step-desc">Every baseline has ~200–400 settings. Review in the Intune portal or export to CSV. Test on a pilot group (5–10% of devices) first.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Deploy in pilot</div><div class="step-desc">Create the baseline → Assign to "Pilot - Security Baseline" group → Monitor for conflicts and user impact over 2 weeks.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Handle conflicts</div><div class="step-desc">If a compliance policy and a security baseline set the same value differently, the more restrictive wins (for MDM settings). Use Conflict report to identify overlaps.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Broad deployment</div><div class="step-desc">Assign to All Devices or specific groups. Monitor compliance rate in the Security Baseline compliance report.</div></div></div>
  </div>
  <div class="callout callout-warn">
    <span>⚠️</span>
    <div>Some baseline settings (like requiring complex passwords on shared devices, or disabling USB on lab equipment) may not suit your environment. Review and override specific settings before broad deployment.</div>
  </div>
</div>

<div class="section">
  <h2>🏗️ Custom Hardening — Endpoint Security Profiles</h2>
  <p>For granular control, use Endpoint Security profiles (separate from Configuration Profiles):</p>
  <ul>
    <li><strong>Antivirus</strong> — Defender settings, exclusions, scheduled scans</li>
    <li><strong>Disk encryption</strong> — BitLocker encryption policy, recovery key rotation</li>
    <li><strong>Firewall</strong> — Windows Defender Firewall rules</li>
    <li><strong>Endpoint Detection & Response</strong> — Defender for Endpoint onboarding</li>
    <li><strong>Attack Surface Reduction (ASR)</strong> — block malicious behaviours</li>
    <li><strong>Account Protection</strong> — Windows Hello, credential guard</li>
  </ul>
  <div class="code-block">
<span class="comment"># Example: ASR rule — Block credential stealing from LSASS</span>
<span class="key">Profile:</span> Attack Surface Reduction Rules
<span class="key">Rule:</span> Block credential stealing from the Windows local security authority subsystem
<span class="key">State:</span> <span class="str">Block</span>

<span class="comment"># BitLocker — Require startup PIN + TPM</span>
<span class="key">Profile:</span> Disk Encryption (BitLocker)
<span class="key">Setting:</span> Require additional authentication at startup
<span class="key">TPM startup PIN:</span> <span class="str">Require startup PIN with TPM</span>
  </div>
</div>

${configStepsSection('a1')}
${visualSection('a1')}
${videoSection('a1')}
<div class="btn-row">
  <button class="btn btn-primary" onclick="markComplete('a1'); showPage('a2')">Next: PowerShell & Scripts →</button>
  <button class="btn btn-outline" onclick="markComplete('a1')">✓ Mark Complete</button>
</div>
</div>`},

  // ─────────────────────────────────────────────
  // A2 — POWERSHELL & SCRIPTS
  // ─────────────────────────────────────────────
  a2: {
    title: 'PowerShell & Scripts',
    level: 'Advanced',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="showPage('dashboard')">🏠 Home</span> › <span class="level-badge badge-advanced">Advanced</span></div>
  <h1>PowerShell &amp; Scripts in Intune</h1>
  <div class="meta-row"><span class="meta-chip">~35 min</span><span class="meta-chip badge-advanced">Advanced</span></div>
</div>
<div class="content-body">

<div class="section">
  <h2>📜 Platform Scripts</h2>
  <p>Intune can deploy PowerShell scripts to Windows devices. Scripts run in the SYSTEM or signed-in user context. Great for configuration tasks that don't fit configuration profiles.</p>
  <div class="callout callout-warn">
    <span>⚠️</span>
    <div>Scripts run once and are not continuously enforced like profiles. For ongoing settings, use Configuration Profiles. Scripts are for one-time tasks or checks.</div>
  </div>
  <div class="steps">
    <div class="step"><div class="step-content"><div class="step-title">Upload script</div><div class="step-desc">Devices → Scripts → Add → Windows 10 and later. Upload your .ps1 file. Set: Run in 64-bit PowerShell, Run as SYSTEM or Logged-in user, Enforce script signature check.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Assign and monitor</div><div class="step-desc">Assign to device/user group. Results visible in Devices → Scripts → select script → Device status. States: Pending, Success, Failed.</div></div></div>
  </div>

  <div class="code-block">
<span class="comment"># Example: Create a local admin account for break-glass access</span>
<span class="kw">$password</span> = ConvertTo-SecureString <span class="str">"ComplexP@ssw0rd!"</span> -AsPlainText -Force
<span class="kw">New-LocalUser</span> -Name <span class="str">"LocalAdmin"</span> -Password <span class="kw">$password</span> -PasswordNeverExpires <span class="kw">$true</span>
<span class="kw">Add-LocalGroupMember</span> -Group <span class="str">"Administrators"</span> -Member <span class="str">"LocalAdmin"</span>

<span class="comment"># Example: Configure DNS client settings</span>
<span class="kw">Set-DnsClientServerAddress</span> -InterfaceAlias <span class="str">"Ethernet"</span> -ServerAddresses (<span class="str">"8.8.8.8"</span>,<span class="str">"1.1.1.1"</span>)

<span class="comment"># Example: Disable IE first run wizard (legacy app compat)</span>
<span class="kw">New-Item</span> -Path <span class="str">"HKLM:\\SOFTWARE\\Policies\\Microsoft\\Internet Explorer\\Main"</span> -Force
<span class="kw">Set-ItemProperty</span> -Path <span class="str">"HKLM:\\SOFTWARE\\Policies\\Microsoft\\Internet Explorer\\Main"</span> \`
  -Name <span class="str">"DisableFirstRunCustomize"</span> -Value <span class="str">1</span>
  </div>
</div>

<div class="section">
  <h2>🤖 Proactive Remediations (Remediations)</h2>
  <p>Proactive Remediations (renamed to <strong>Remediations</strong> in 2023) are detection + remediation script pairs that run on a schedule. Ideal for ongoing health checks.</p>
  <ul>
    <li><strong>Detection script</strong> — exits 0 if healthy, exits 1 if issue found</li>
    <li><strong>Remediation script</strong> — only runs if detection exits 1. Fixes the issue.</li>
  </ul>
  <div class="code-block">
<span class="comment"># Detection Script — Check if time zone is set correctly</span>
<span class="kw">$tz</span> = (Get-TimeZone).Id
<span class="kw">if</span> (<span class="kw">$tz</span> <span class="kw">-eq</span> <span class="str">"GMT Standard Time"</span>) {
    Write-Host <span class="str">"Time zone is correct"</span>
    Exit <span class="str">0</span>  <span class="comment"># Healthy</span>
} <span class="kw">else</span> {
    Write-Host <span class="str">"Time zone is wrong: $tz"</span>
    Exit <span class="str">1</span>  <span class="comment"># Needs remediation</span>
}

<span class="comment"># Remediation Script — Fix the time zone</span>
<span class="kw">Set-TimeZone</span> -Id <span class="str">"GMT Standard Time"</span>
Write-Host <span class="str">"Time zone set to GMT Standard Time"</span>
  </div>

  <div class="scenario">
    <div class="scenario-label">🏢 Practical Scenario — Disk Space Health</div>
    <h4>Automatically clean temp files on low-disk devices</h4>
    <p>Detection script checks if C: free space is below 5 GB. If so, exits 1. Remediation script runs Disk Cleanup silently, clears Windows Update cache, empties Recycle Bin. Runs daily on all devices. Prevents support tickets from users running out of disk space.</p>
  </div>
</div>

<div class="section">
  <h2>🌐 Microsoft Graph API — Automate Intune</h2>
  <p>Everything in the Intune portal can be done via the <strong>Microsoft Graph API</strong>. Authentication uses Azure AD app registrations.</p>
  <div class="code-block">
<span class="comment"># PowerShell: Get all non-compliant devices via Graph API</span>
<span class="kw">Connect-MgGraph</span> -Scopes <span class="str">"DeviceManagement.Read.All"</span>

<span class="kw">$devices</span> = <span class="kw">Get-MgDeviceManagementManagedDevice</span> \`
  -Filter <span class="str">"complianceState eq 'noncompliant'"</span> \`
  -Select <span class="str">"deviceName,userPrincipalName,complianceState,lastSyncDateTime"</span>

<span class="kw">$devices</span> | <span class="kw">Select-Object</span> DeviceName, UserPrincipalName, LastSyncDateTime | <span class="kw">Format-Table</span>
  </div>
</div>

${configStepsSection('a2')}
${visualSection('a2')}
${videoSection('a2')}
<div class="btn-row">
  <button class="btn btn-primary" onclick="markComplete('a2'); showPage('a3')">Next: Co-management & SCCM →</button>
  <button class="btn btn-outline" onclick="markComplete('a2')">✓ Mark Complete</button>
</div>
</div>`},

  // ─────────────────────────────────────────────
  // A3 — CO-MANAGEMENT
  // ─────────────────────────────────────────────
  a3: {
    title: 'Co-management & SCCM',
    level: 'Advanced',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="showPage('dashboard')">🏠 Home</span> › <span class="level-badge badge-advanced">Advanced</span></div>
  <h1>Co-management &amp; Configuration Manager</h1>
  <div class="meta-row"><span class="meta-chip">~30 min</span><span class="meta-chip badge-advanced">Advanced</span></div>
</div>
<div class="content-body">

<div class="section">
  <h2>🔄 What is Co-management?</h2>
  <p>Co-management allows devices to be simultaneously managed by both <strong>Microsoft Configuration Manager (SCCM/ConfigMgr)</strong> and <strong>Microsoft Intune</strong>. It's the migration path from on-premises ConfigMgr to cloud-native Intune management.</p>

  <div class="callout callout-info">
    <span>💡</span>
    <div>Co-management does NOT mean both tools manage the same setting. <strong>Workloads</strong> are split: each workload is controlled by either ConfigMgr or Intune, not both simultaneously.</div>
  </div>

  <h3>Co-management Workloads</h3>
  <table style="width:100%;font-size:13px;border-collapse:collapse;">
    <tr style="border-bottom:1px solid var(--border);">
      <th style="padding:8px;text-align:left;color:var(--accent2);">Workload</th>
      <th style="padding:8px;text-align:left;color:var(--accent2);">Default</th>
      <th style="padding:8px;text-align:left;color:var(--accent2);">Move to Intune when...</th>
    </tr>
    <tr style="border-bottom:1px solid var(--border);"><td style="padding:8px;">Compliance policies</td><td style="padding:8px;">Intune</td><td style="padding:8px;">Co-management enabled</td></tr>
    <tr style="border-bottom:1px solid var(--border);"><td style="padding:8px;">Device configuration</td><td style="padding:8px;">ConfigMgr</td><td style="padding:8px;">Ready to migrate GPO</td></tr>
    <tr style="border-bottom:1px solid var(--border);"><td style="padding:8px;">Resource Access (Wi-Fi, VPN)</td><td style="padding:8px;">ConfigMgr</td><td style="padding:8px;">Intune profiles configured</td></tr>
    <tr style="border-bottom:1px solid var(--border);"><td style="padding:8px;">Endpoint Protection</td><td style="padding:8px;">ConfigMgr</td><td style="padding:8px;">Moving to Defender</td></tr>
    <tr style="border-bottom:1px solid var(--border);"><td style="padding:8px;">Office Click-to-Run</td><td style="padding:8px;">ConfigMgr</td><td style="padding:8px;">Using M365 Apps profiles</td></tr>
    <tr><td style="padding:8px;">Windows Update Policies</td><td style="padding:8px;">ConfigMgr</td><td style="padding:8px;">Moving to WUfB/Intune</td></tr>
  </table>
</div>

<div class="section">
  <h2>🚀 Enabling Co-management</h2>
  <div class="steps">
    <div class="step"><div class="step-content"><div class="step-title">Prerequisites</div><div class="step-desc">ConfigMgr 2111 or later. Azure AD Hybrid Join (devices joined to both on-prem AD and Azure AD). Intune license for all users. CMG (Cloud Management Gateway) recommended for internet-based clients.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Enable Co-management in ConfigMgr</div><div class="step-desc">Administration → Cloud Services → Cloud Attach → Enable. Sign in with your Azure AD global admin to link to your Intune tenant.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Configure workload sliders</div><div class="step-desc">Each workload has a slider: ConfigMgr | Pilot Intune | Intune. Use "Pilot Intune" to move a workload for a specific collection before broad rollout.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Monitor in Intune</div><div class="step-desc">In Intune admin center, co-managed devices show "Configuration Manager" as the management agent. Both ConfigMgr and Intune can see device inventory.</div></div></div>
  </div>
</div>

<div class="section">
  <h2>☁️ Tenant Attach vs Co-management</h2>
  <p><strong>Tenant Attach</strong> is a lighter option that uploads ConfigMgr device inventory to Intune — enabling you to see all devices (including ConfigMgr-only) in the Intune admin center, run remote actions, and deploy endpoint security policies — <strong>without</strong> moving management workloads to Intune.</p>
  <div class="callout callout-tip">
    <span>✅</span>
    <div><strong>Recommended path:</strong> Enable Tenant Attach first (low risk, high visibility). Then enable Co-management. Gradually slide workloads to Intune. Finally, decommission ConfigMgr when all workloads are in Intune.</div>
  </div>
</div>

${configStepsSection('a3')}
${visualSection('a3')}
${videoSection('a3')}
<div class="btn-row">
  <button class="btn btn-primary" onclick="markComplete('a3'); showPage('a4')">Next: BYOD & MAM Policies →</button>
  <button class="btn btn-outline" onclick="markComplete('a3')">✓ Mark Complete</button>
</div>
</div>`},

  // ─────────────────────────────────────────────
  // A4 — BYOD & MAM
  // ─────────────────────────────────────────────
  a4: {
    title: 'BYOD & MAM Policies',
    level: 'Advanced',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="showPage('dashboard')">🏠 Home</span> › <span class="level-badge badge-advanced">Advanced</span></div>
  <h1>BYOD &amp; App Protection (MAM) Policies</h1>
  <div class="meta-row"><span class="meta-chip">~30 min</span><span class="meta-chip badge-advanced">Advanced</span></div>
</div>
<div class="content-body">

<div class="section">
  <h2>📱 App Protection Policy (APP)</h2>
  <p>App Protection Policies (APPs) protect corporate data <strong>within apps</strong>, on enrolled or unenrolled devices. They work at the app layer, not the OS layer.</p>
  <h3>What APPs can control:</h3>
  <ul>
    <li>Prevent copy/paste from managed to unmanaged apps</li>
    <li>Prevent Save As to personal storage (OneDrive Personal, Dropbox)</li>
    <li>Require PIN to open managed apps</li>
    <li>Block screen capture in managed apps</li>
    <li>Selective wipe (wipe only corporate data, not personal)</li>
    <li>Block access if device is jailbroken/rooted</li>
    <li>Require minimum app version</li>
    <li>Require minimum OS version</li>
  </ul>
</div>

<div class="section">
  <h2>🔧 Creating an iOS App Protection Policy</h2>
  <div class="steps">
    <div class="step"><div class="step-content"><div class="step-title">Apps → App Protection Policies → Create → iOS/iPadOS</div><div class="step-desc">Name: "iOS - Corporate MAM Policy"</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Select target apps</div><div class="step-desc">Add apps: Microsoft Outlook, Teams, OneDrive, Word, Excel, PowerPoint, Edge. Or select "All Microsoft apps".</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Configure Data Protection settings</div><div class="step-desc">Backup org data to iTunes: Block. Send org data to other apps: Policy managed apps only. Receive data from other apps: Policy managed apps only. Save copies of org data: Block.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Configure Access Requirements</div><div class="step-desc">PIN for access: Require. PIN type: Numeric, length 6. Max attempts before reset: 5. Biometrics: Allow. Recheck access requirements: 30 minutes.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Configure Conditional Launch</div><div class="step-desc">Jailbroken/rooted: Block access. Min OS version: 16.0 → Block. Offline grace period: 720 hours → Wipe data.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Assign to user groups</div><div class="step-desc">Assign to All Users (or BYOD-specific group). Exclude service accounts. APP applies whenever users sign into managed apps with their corporate identity.</div></div></div>
  </div>
</div>

<div class="section">
  <h2>🔒 MAM-WE (Without Enrollment)</h2>
  <p>MAM Without Enrollment (MAM-WE) protects apps on <strong>personal devices that are NOT enrolled in MDM</strong>. The device is not managed — only the apps are protected.</p>
  <div class="scenario">
    <div class="scenario-label">🏢 Practical Scenario — Contractor BYOD</div>
    <h4>Protecting corporate email on contractor personal phones</h4>
    <p>Woodgrove Bank hires 200 contractors who use personal phones. Enrolling personal devices is refused by contractors (privacy concern). IT deploys MAM-WE: contractors install Outlook from the App Store, sign in with their corporate account — the APP automatically applies: email is contained within Outlook, they can't forward to personal Gmail or save attachments to Photos, corporate data can be selectively wiped when the contract ends. No MDM enrollment needed.</p>
  </div>
</div>

${configStepsSection('a4')}
${visualSection('a4')}
${videoSection('a4')}
<div class="btn-row">
  <button class="btn btn-primary" onclick="markComplete('a4'); showPage('quiz-advanced')">Take Advanced Quiz →</button>
  <button class="btn btn-outline" onclick="markComplete('a4')">✓ Mark Complete</button>
</div>
</div>`},

  // ─────────────────────────────────────────────
  // E1 — GRAPH API & AUTOMATION
  // ─────────────────────────────────────────────
  e1: {
    title: 'Graph API & Automation',
    level: 'Expert',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="showPage('dashboard')">🏠 Home</span> › <span class="level-badge badge-expert">Expert</span></div>
  <h1>Graph API &amp; Intune Automation</h1>
  <div class="meta-row"><span class="meta-chip">~45 min</span><span class="meta-chip badge-expert">Expert</span></div>
</div>
<div class="content-body">

<div class="section">
  <h2>🔬 Microsoft Graph API for Intune</h2>
  <p>Everything in the Intune admin center is available via the <strong>Microsoft Graph API</strong> under <code>/v1.0/deviceManagement</code> and <code>/beta/deviceManagement</code>. Use it for bulk operations, CI/CD pipelines, and custom dashboards.</p>
  <h3>Key API scopes (permissions):</h3>
  <ul>
    <li><code>DeviceManagement.Read.All</code> — Read devices, policies, apps</li>
    <li><code>DeviceManagement.ReadWrite.All</code> — Full read/write control</li>
    <li><code>DeviceManagementApps.ReadWrite.All</code> — App management</li>
    <li><code>DeviceManagementConfiguration.ReadWrite.All</code> — Configuration profiles</li>
    <li><code>DeviceManagementManagedDevices.PrivilegedOperations.All</code> — Remote actions (wipe, sync, restart)</li>
  </ul>
</div>

<div class="section">
  <h2>🔐 Authentication: Azure AD App Registration</h2>
  <div class="steps">
    <div class="step"><div class="step-content"><div class="step-title">Create App Registration</div><div class="step-desc">Azure AD → App Registrations → New Registration. Name: "Intune Automation". Supported account types: Single tenant.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Create Client Secret or Certificate</div><div class="step-desc">Certificates & secrets → New client secret. Note the Application (client) ID and tenant ID.</div></div></div>
    <div class="step"><div class="step-content"><div class="step-title">Grant API permissions</div><div class="step-desc">API Permissions → Add permission → Microsoft Graph → Application permissions → Add DeviceManagement.ReadWrite.All → Grant admin consent.</div></div></div>
  </div>
  <div class="code-block">
<span class="comment"># PowerShell: Authenticate to Graph API with client credentials</span>
<span class="kw">$tenantId</span>     = <span class="str">"your-tenant-id"</span>
<span class="kw">$clientId</span>     = <span class="str">"your-app-registration-id"</span>
<span class="kw">$clientSecret</span> = <span class="str">"your-secret-value"</span>

<span class="kw">$body</span> = @{
    grant_type    = <span class="str">"client_credentials"</span>
    client_id     = <span class="kw">$clientId</span>
    client_secret = <span class="kw">$clientSecret</span>
    scope         = <span class="str">"https://graph.microsoft.com/.default"</span>
}
<span class="kw">$token</span> = (<span class="kw">Invoke-RestMethod</span> -Uri <span class="str">"https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token"</span> \`
  -Method Post -Body <span class="kw">$body</span>).access_token

<span class="kw">$headers</span> = @{ Authorization = <span class="str">"Bearer $token"</span>; 'Content-Type' = <span class="str">'application/json'</span> }
  </div>
</div>

<div class="section">
  <h2>🤖 Automation Examples</h2>
  <div class="code-block">
<span class="comment"># 1. Get all non-compliant devices and export to CSV</span>
<span class="kw">$uri</span> = <span class="str">"https://graph.microsoft.com/v1.0/deviceManagement/managedDevices?\`$filter=complianceState eq 'noncompliant'&\`$select=deviceName,userPrincipalName,lastSyncDateTime,osVersion"</span>
<span class="kw">$result</span> = (<span class="kw">Invoke-RestMethod</span> -Uri <span class="kw">$uri</span> -Headers <span class="kw">$headers</span>).value
<span class="kw">$result</span> | <span class="kw">Export-Csv</span> <span class="str">".\\NonCompliantDevices.csv"</span> -NoTypeInformation

<span class="comment"># 2. Trigger remote sync on all non-compliant devices</span>
<span class="kw">foreach</span> (<span class="kw">$device</span> <span class="kw">in</span> <span class="kw">$result</span>) {
    <span class="kw">$syncUri</span> = <span class="str">"https://graph.microsoft.com/v1.0/deviceManagement/managedDevices/$($device.id)/syncDevice"</span>
    <span class="kw">Invoke-RestMethod</span> -Uri <span class="kw">$syncUri</span> -Method Post -Headers <span class="kw">$headers</span>
    Write-Host <span class="str">"Synced: $($device.deviceName)"</span>
}

<span class="comment"># 3. Create a configuration profile via API</span>
<span class="kw">$profile</span> = @{
    "@odata.type" = <span class="str">"#microsoft.graph.windows10GeneralConfiguration"</span>
    displayName   = <span class="str">"API-Created Profile"</span>
    description   = <span class="str">"Deployed via Graph API automation"</span>
    smartScreenBlockOverrideForFiles = <span class="kw">$true</span>
} | <span class="kw">ConvertTo-Json</span>

<span class="kw">Invoke-RestMethod</span> -Uri <span class="str">"https://graph.microsoft.com/beta/deviceManagement/deviceConfigurations"</span> \`
  -Method Post -Headers <span class="kw">$headers</span> -Body <span class="kw">$profile</span>
  </div>

  <div class="scenario">
    <div class="scenario-label">🏢 Practical Scenario — GitOps for Intune</div>
    <h4>Version-controlling Intune policies in Git</h4>
    <p>An enterprise's security team keeps all Intune configuration profiles as JSON files in Azure DevOps. A CI/CD pipeline uses Graph API to export current Intune config nightly (infrastructure drift detection). A PR approval workflow deploys policy changes: engineer submits PR with modified JSON → security lead approves → pipeline pushes changes to Intune via Graph API → change is logged in git with author, timestamp, and diff. Full audit trail, no manual portal changes.</p>
  </div>
</div>

${configStepsSection('e1')}
${visualSection('e1')}
${videoSection('e1')}
<div class="btn-row">
  <button class="btn btn-primary" onclick="markComplete('e1'); showPage('e2')">Next: Zero Trust Architecture →</button>
  <button class="btn btn-outline" onclick="markComplete('e1')">✓ Mark Complete</button>
</div>
</div>`},

  // ─────────────────────────────────────────────
  // E2 — ZERO TRUST
  // ─────────────────────────────────────────────
  e2: {
    title: 'Zero Trust Architecture',
    level: 'Expert',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="showPage('dashboard')">🏠 Home</span> › <span class="level-badge badge-expert">Expert</span></div>
  <h1>Zero Trust Architecture with Intune</h1>
  <div class="meta-row"><span class="meta-chip">~40 min</span><span class="meta-chip badge-expert">Expert</span></div>
</div>
<div class="content-body">

<div class="section">
  <h2>🌐 Zero Trust Principles</h2>
  <p><strong>"Never trust, always verify."</strong> Zero Trust is a security model that assumes breach and verifies every request as though it originates from an open network. Three core principles:</p>
  <ol>
    <li><strong>Verify explicitly</strong> — always authenticate and authorise based on all available data points</li>
    <li><strong>Use least privilege access</strong> — limit user access with JIT/JEA, risk-based adaptive policies</li>
    <li><strong>Assume breach</strong> — minimise blast radius, encrypt end-to-end, use analytics to get visibility</li>
  </ol>
</div>

<div class="section">
  <h2>🔗 Intune's Role in Zero Trust</h2>
  <table style="width:100%;font-size:13px;border-collapse:collapse;">
    <tr style="border-bottom:1px solid var(--border);">
      <th style="padding:8px;text-align:left;color:var(--accent2);">ZT Pillar</th>
      <th style="padding:8px;text-align:left;color:var(--accent2);">Intune Component</th>
    </tr>
    <tr style="border-bottom:1px solid var(--border);"><td style="padding:8px;">Identity</td><td style="padding:8px;">Azure AD + Conditional Access (MFA, risk-based)</td></tr>
    <tr style="border-bottom:1px solid var(--border);"><td style="padding:8px;">Devices</td><td style="padding:8px;">Intune compliance + Defender for Endpoint risk signals</td></tr>
    <tr style="border-bottom:1px solid var(--border);"><td style="padding:8px;">Applications</td><td style="padding:8px;">App Protection Policies, MCAS (Defender for Cloud Apps)</td></tr>
    <tr style="border-bottom:1px solid var(--border);"><td style="padding:8px;">Data</td><td style="padding:8px;">Purview Information Protection, MAM data classification</td></tr>
    <tr style="border-bottom:1px solid var(--border);"><td style="padding:8px;">Infrastructure</td><td style="padding:8px;">Endpoint security baselines, ASR, Defender EDR</td></tr>
    <tr><td style="padding:8px;">Network</td><td style="padding:8px;">Per-app VPN, Microsoft Tunnel, Defender for Network</td></tr>
  </table>
</div>

<div class="section">
  <h2>🏗️ Implementing a Zero Trust Policy Stack</h2>
  <h3>Layer 1 — Identity Verification</h3>
  <ul>
    <li>CA Policy: Require MFA for all users (all apps, all platforms)</li>
    <li>CA Policy: Block legacy authentication (Exchange ActiveSync, IMAP, SMTP)</li>
    <li>CA Policy: Require phishing-resistant MFA (FIDO2/Windows Hello) for admin roles</li>
  </ul>
  <h3>Layer 2 — Device Trust</h3>
  <ul>
    <li>CA Policy: Require compliant device for M365 resources</li>
    <li>Intune Compliance: Require Defender risk score ≤ Medium</li>
    <li>Intune Security Baseline: Applied to all managed devices</li>
    <li>CA Policy: Require Hybrid Azure AD join OR compliant device for Windows</li>
  </ul>
  <h3>Layer 3 — App + Data Protection</h3>
  <ul>
    <li>CA Policy: Require approved app (MAM-enrolled) for mobile apps</li>
    <li>App Protection Policy: Restrict data movement between apps</li>
    <li>Purview Sensitivity Labels: Encrypt confidential documents</li>
    <li>MCAS Policy: Block download on unmanaged devices (reverse proxy)</li>
  </ul>
  <h3>Layer 4 — Least Privilege</h3>
  <ul>
    <li>Azure AD PIM: Just-in-time admin role activation</li>
    <li>Intune RBAC: Scope tags to limit admin access by geography/department</li>
    <li>CA Policy: Require privileged access workstation (PAW) for admin access</li>
  </ul>

  <div class="scenario">
    <div class="scenario-label">🏢 Enterprise Scenario — Healthcare Organisation</div>
    <h4>Protecting patient data with Zero Trust</h4>
    <p>A hospital deploys Zero Trust across 5,000 endpoints. Clinical staff access Electronic Health Records (EHR) from iPads (MDM enrolled) and Windows workstations (Intune + Defender for Endpoint). CA policies require: MFA everywhere, compliant device, Defender risk score ≤ Low for EHR access. MCAS blocks EHR download on unenrolled devices. PowerShell remediations clean devices weekly. Purview labels encrypt all clinical documents. Any Defender alert on a device automatically marks it non-compliant (via integration), blocking EHR access until the threat is resolved and the device rescanned.</p>
  </div>
</div>

<div class="section">
  <h2>🔍 Microsoft Tunnel — App Proxy for Zero Trust</h2>
  <p>Microsoft Tunnel is a VPN gateway solution built into Intune. Unlike traditional VPN, Tunnel supports:</p>
  <ul>
    <li><strong>Per-app VPN</strong> — only specific apps route through the tunnel</li>
    <li><strong>Mobile device support</strong> — native iOS/Android integration</li>
    <li><strong>No client VPN app</strong> — uses built-in Intune management channel</li>
    <li>Deployed as a Docker container on a Linux server in your on-prem network / Azure VNet</li>
  </ul>
</div>

${configStepsSection('e2')}
${visualSection('e2')}
${videoSection('e2')}
<div class="btn-row">
  <button class="btn btn-primary" onclick="markComplete('e2'); showPage('e3')">Next: Enterprise Lab →</button>
  <button class="btn btn-outline" onclick="markComplete('e2')">✓ Mark Complete</button>
</div>
</div>`},

  // ─────────────────────────────────────────────
  // E3 — ENTERPRISE LAB
  // ─────────────────────────────────────────────
  e3: {
    title: 'Enterprise Deployment Lab',
    level: 'Expert',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="showPage('dashboard')">🏠 Home</span> › <span class="level-badge badge-expert">Expert</span></div>
  <h1>Enterprise Deployment Lab</h1>
  <div class="meta-row"><span class="meta-chip">~2 hours</span><span class="meta-chip badge-expert">Expert</span></div>
</div>
<div class="content-body">

<div class="lab-header">
  <span class="lab-tag">PRACTICAL LAB</span>
  <h2 style="margin-top:8px;">Full Enterprise Intune Deployment</h2>
  <p style="font-size:13px;color:var(--muted);margin-top:6px;">Deploy a complete, production-ready Intune environment for a fictional 500-employee company: <strong>Meridian Technologies</strong>.</p>
</div>

<div class="section">
  <h2>📋 Lab Scenario</h2>
  <p>Meridian Technologies has:</p>
  <ul>
    <li>300 Windows 11 laptops (corporate-owned)</li>
    <li>100 iPhones (corporate-owned, supervised via ADE)</li>
    <li>100 personal Android phones (BYOD)</li>
    <li>Existing on-prem Active Directory + Configuration Manager</li>
    <li>Microsoft 365 E3 licensing</li>
    <li>Security requirement: ISO 27001 compliance</li>
  </ul>
</div>

<div class="section">
  <h2>✅ Lab Tasks</h2>
  <div class="tabs">
    <div class="tab active" onclick="switchTab('lab-phase1')">Phase 1: Foundation</div>
    <div class="tab" onclick="switchTab('lab-phase2')">Phase 2: Security</div>
    <div class="tab" onclick="switchTab('lab-phase3')">Phase 3: Apps</div>
    <div class="tab" onclick="switchTab('lab-phase4')">Phase 4: Automation</div>
  </div>

  <div id="lab-phase1" class="tab-panel active">
    <div class="task-list">
      <div class="task" id="task-1">
        <div class="task-check" onclick="toggleTask('task-1')"></div>
        <div class="task-text"><strong>1.1 — Configure Intune Tenant</strong>Set MDM authority, configure enrollment restrictions (max 5 devices per user), add company branding with Meridian logo.</div>
      </div>
      <div class="task" id="task-2">
        <div class="task-check" onclick="toggleTask('task-2')"></div>
        <div class="task-text"><strong>1.2 — Enable Co-management</strong>Connect Intune to existing ConfigMgr tenant. Enable Tenant Attach for all devices. Move Compliance Policies workload to Intune.</div>
      </div>
      <div class="task" id="task-3">
        <div class="task-check" onclick="toggleTask('task-3')"></div>
        <div class="task-text"><strong>1.3 — Create Azure AD Groups</strong>Create dynamic groups: "Corp-Windows-Devices" (deviceOS eq 'Windows'), "Corp-iOS-Devices", "BYOD-Android-Devices" (deviceOwnership eq 'Personal').</div>
      </div>
      <div class="task" id="task-4">
        <div class="task-check" onclick="toggleTask('task-4')"></div>
        <div class="task-text"><strong>1.4 — Windows Autopilot Setup</strong>Import hardware hashes from the 300 Windows devices. Create Autopilot deployment profile with custom naming template (MERI-%RAND:5%). Create Enrollment Status Page blocking use until apps install.</div>
      </div>
      <div class="task" id="task-5">
        <div class="task-check" onclick="toggleTask('task-5')"></div>
        <div class="task-text"><strong>1.5 — Apple ADE Setup</strong>Link Apple Business Manager to Intune. Create iOS enrollment profile for supervised devices. Create MDM Push Certificate. Sync ABM devices to Intune.</div>
      </div>
    </div>
  </div>

  <div id="lab-phase2" class="tab-panel">
    <div class="task-list">
      <div class="task" id="task-6">
        <div class="task-check" onclick="toggleTask('task-6')"></div>
        <div class="task-text"><strong>2.1 — Windows Security Baseline</strong>Deploy Microsoft Windows Security Baseline to pilot group (10 devices). Monitor for 1 week. Review override settings for Meridian context. Then broad deploy to all Windows devices.</div>
      </div>
      <div class="task" id="task-7">
        <div class="task-check" onclick="toggleTask('task-7')"></div>
        <div class="task-text"><strong>2.2 — Windows Compliance Policy</strong>Require: Windows 11 22H2+, BitLocker enabled, Secure Boot, Defender enabled, Defender risk ≤ Medium, Firewall on, OS update current. Action: email user day 1, block access day 7.</div>
      </div>
      <div class="task" id="task-8">
        <div class="task-check" onclick="toggleTask('task-8')"></div>
        <div class="task-text"><strong>2.3 — Conditional Access Policies</strong>Create 5 CA policies: (a) Require MFA all users, (b) Block legacy auth, (c) Require compliant device for M365, (d) Require approved app for mobile, (e) Block high-risk sign-ins.</div>
      </div>
      <div class="task" id="task-9">
        <div class="task-check" onclick="toggleTask('task-9')"></div>
        <div class="task-text"><strong>2.4 — BitLocker Encryption Policy</strong>Create Endpoint Security → Disk Encryption profile. Require BitLocker with TPM+PIN. Configure key recovery to Azure AD (escrow). Enable silent encryption for Autopilot devices.</div>
      </div>
      <div class="task" id="task-10">
        <div class="task-check" onclick="toggleTask('task-10')"></div>
        <div class="task-text"><strong>2.5 — MAM Policy for BYOD Android</strong>Create App Protection Policy for Android: restrict data movement, require PIN, block jailbroken devices, set offline grace period 48h. Assign to BYOD users for Teams/Outlook/OneDrive.</div>
      </div>
    </div>
  </div>

  <div id="lab-phase3" class="tab-panel">
    <div class="task-list">
      <div class="task" id="task-11">
        <div class="task-check" onclick="toggleTask('task-11')"></div>
        <div class="task-text"><strong>3.1 — Deploy Microsoft 365 Apps</strong>Add M365 Apps for Enterprise. Configure: Semi-Annual channel, 64-bit, en-GB language. Required assignment to Corp-Windows-Devices group.</div>
      </div>
      <div class="task" id="task-12">
        <div class="task-check" onclick="toggleTask('task-12')"></div>
        <div class="task-text"><strong>3.2 — Package and Deploy Meridian LOB App</strong>Package MeridianERP.exe using IntuneWinAppUtil. Upload as Win32 app. Configure detection rule (registry key). Set install command, create filter to target laptops only.</div>
      </div>
      <div class="task" id="task-13">
        <div class="task-check" onclick="toggleTask('task-13')"></div>
        <div class="task-text"><strong>3.3 — iOS Managed App Store Apps</strong>Add Teams, Outlook, OneDrive via VPP. Assign as Required to Corp-iOS-Devices. Configure app configuration policies (suppress setup prompts, pre-configure corporate email domain).</div>
      </div>
    </div>
  </div>

  <div id="lab-phase4" class="tab-panel">
    <div class="task-list">
      <div class="task" id="task-14">
        <div class="task-check" onclick="toggleTask('task-14')"></div>
        <div class="task-text"><strong>4.1 — Proactive Remediation: Disk Health</strong>Create detection script checking C: free space < 5 GB. Create remediation script running Disk Cleanup + clearing Windows Update cache. Schedule: daily. Assign to all Windows devices.</div>
      </div>
      <div class="task" id="task-15">
        <div class="task-check" onclick="toggleTask('task-15')"></div>
        <div class="task-text"><strong>4.2 — Graph API Compliance Report</strong>Write PowerShell script authenticating to Graph API, querying non-compliant devices, exporting to SharePoint list, and emailing IT team. Schedule as Azure Automation runbook running weekly.</div>
      </div>
      <div class="task" id="task-16">
        <div class="task-check" onclick="toggleTask('task-16')"></div>
        <div class="task-text"><strong>4.3 — Intune Config as Code (GitOps)</strong>Export all Intune configuration profiles as JSON using Graph API. Commit to Azure DevOps repo. Create pipeline that deploys policy changes on PR merge. Test with a dummy profile change.</div>
      </div>
    </div>
  </div>
</div>

<div class="section">
  <h2>📚 Reference Scripts for Lab</h2>
  <div class="code-block">
<span class="comment"># Export all device configuration profiles to JSON files</span>
<span class="kw">Connect-MgGraph</span> -Scopes <span class="str">"DeviceManagement.Read.All"</span>
<span class="kw">$profiles</span> = <span class="kw">Get-MgDeviceManagementDeviceConfiguration</span>
<span class="kw">foreach</span> (<span class="kw">$p</span> <span class="kw">in</span> <span class="kw">$profiles</span>) {
    <span class="kw">$json</span> = <span class="kw">$p</span> | <span class="kw">ConvertTo-Json</span> -Depth 10
    <span class="kw">$fileName</span> = <span class="str">"$($p.displayName -replace '[\\/:*?&lt;&gt;|]','_').json"</span>
    <span class="kw">$json</span> | <span class="kw">Out-File</span> <span class="str">".\\IntunePolicies\\$fileName"</span>
    Write-Host <span class="str">"Exported: $($p.displayName)"</span>
}

<span class="comment"># Import a profile from JSON (CI/CD pipeline step)</span>
<span class="kw">$profileJson</span> = <span class="kw">Get-Content</span> <span class="str">".\\IntunePolicies\\DeviceRestrictions.json"</span> | <span class="kw">ConvertFrom-Json</span>
<span class="kw">$profileJson</span>.PSObject.Properties.Remove(<span class="str">'id'</span>)
<span class="kw">$body</span> = <span class="kw">$profileJson</span> | <span class="kw">ConvertTo-Json</span> -Depth 10
<span class="kw">Invoke-MgGraphRequest</span> -Method POST \`
  -Uri <span class="str">"https://graph.microsoft.com/beta/deviceManagement/deviceConfigurations"</span> \`
  -Body <span class="kw">$body</span> -ContentType <span class="str">"application/json"</span>
  </div>
</div>

${configStepsSection('e3')}
${visualSection('e3')}
${videoSection('e3')}
<div class="btn-row">
  <button class="btn btn-primary" onclick="markComplete('e3'); showPage('quiz-expert')">Take Expert Certification Quiz →</button>
  <button class="btn btn-outline" onclick="markComplete('e3')">✓ Mark Complete</button>
</div>
</div>`},

  // ─────────────────────────────────────────────
  // ERROR CODES & SOLUTIONS
  // ─────────────────────────────────────────────
  errors: {
    title: 'Error Codes & Solutions',
    render: function() {
      var EC = [
        // ── ENROLLMENT ──────────────────────────
        {code:'80180014',cat:'enrollment',cl:'Enrollment',cc:'#54b054',
         title:'MDM enrollment blocked by restriction',
         why:'An enrollment restriction policy in Intune is configured to block the device platform, OS version, or personally-owned devices.',
         trigger:'An admin added or tightened an enrollment restriction after this user/device previously enrolled without issue. Also occurs when a device is classified as personal but the policy requires corporate ownership.',
         fix:['Go to Devices &#8594; Enroll devices &#8594; Enrollment restrictions &#8594; Device type restrictions','Check that the device platform (Windows/iOS/Android) is set to Allow','Check if Block personally owned devices is set to Yes — if so, either mark the device as corporate-owned first, or add it to a device group that has a less restrictive restriction','Go to Devices &#8594; Corporate device identifiers &#8594; Add to pre-register as corporate before enrollment','Re-attempt enrollment after fixing the restriction'],
         prevent:'Test new restrictions on a pilot group first. Always keep a fallback restriction policy for emergency enrollment.'},
        {code:'80180018',cat:'enrollment',cl:'Enrollment',cc:'#54b054',
         title:'Device platform not supported by enrollment restriction',
         why:'The device OS or version falls below the minimum version configured in the enrollment restriction.',
         trigger:'An admin raised the minimum OS version requirement, or the device is running an OS version that has been explicitly blocked.',
         fix:['Check Devices &#8594; Enroll devices &#8594; Enrollment restrictions for OS version minimums','Update the device OS to the required version before attempting enrollment','Or lower the minimum version requirement if the business needs older devices'],
         prevent:'Set OS version minimums carefully. Use a separate restriction for older devices that need a lower minimum.'},
        {code:'8018000a',cat:'enrollment',cl:'Enrollment',cc:'#54b054',
         title:'Device already managed by another MDM solution',
         why:'The device is still enrolled or registered with a different MDM provider (e.g. a previous employer, or a competing MDM like Jamf or VMware Workspace ONE).',
         trigger:'Typically occurs during migrations or when employees bring devices from a previous organisation.',
         fix:['On Windows: Settings &#8594; Accounts &#8594; Access work or school &#8594; Disconnect the existing account','On iOS/Android: Go to Settings &#8594; General/Device &#8594; Device Management &#8594; remove the existing MDM profile','After removing the old MDM profile, re-enroll into Intune','If SCCM is the blocking MDM: check for a co-management conflict and unenroll from SCCM first'],
         prevent:'Include MDM unenrollment as a step in your device migration/handover checklist.'},
        {code:'80180028',cat:'enrollment',cl:'Enrollment',cc:'#54b054',
         title:'User has no Intune licence assigned',
         why:'The user account attempting to enroll does not have an Intune or M365 licence that includes Intune.',
         trigger:'User account was created without licence assignment, or licences were removed by an admin during cost review.',
         fix:['Check: Microsoft 365 admin center &#8594; Users &#8594; [user] &#8594; Licenses','Assign a licence that includes Intune (M365 E3, M365 Business Premium, EMS E3, or Intune Plan 1)','Licence propagation takes up to 15 minutes — wait before re-attempting enrollment','For bulk assignment: use Azure AD &#8594; Groups &#8594; Assign licences to a group'],
         prevent:'Use group-based licence assignment so any user added to a security group is automatically licenced. Audit licence usage monthly.'},
        {code:'80cf4017',cat:'enrollment',cl:'Enrollment',cc:'#54b054',
         title:'Intune service temporarily unavailable',
         why:'The Microsoft Intune cloud service is experiencing an outage or degradation.',
         trigger:'Occurs during Microsoft service incidents. Not caused by admin or user action.',
         fix:['Check Microsoft Service Health: admin.microsoft.com &#8594; Health &#8594; Service health','Check https://status.office365.com for M365 service status','Wait for Microsoft to resolve the incident — no admin action is typically required','Retry enrollment once the service shows as Healthy'],
         prevent:'Monitor Microsoft 365 service health in your operations dashboard. Subscribe to email alerts for Intune service incidents.'},
        {code:'80180002',cat:'enrollment',cl:'Enrollment',cc:'#54b054',
         title:'MDM Terms of Use not accepted',
         why:'An MDM Terms of Use (ToU) policy is configured in Intune but the user has not accepted it.',
         trigger:'An admin added a new Terms of Use policy, or the existing ToU was updated and re-acceptance is required.',
         fix:['The user must navigate to portal.manage.microsoft.com and accept the Terms of Use before enrollment will succeed','Or in the Company Portal app on the device, the Terms of Use prompt will appear — the user must Accept','Verify Terms of Use configuration: Intune &#8594; Tenant admin &#8594; Terms and conditions'],
         prevent:'Notify users before rolling out a new Terms of Use policy. Consider using Conditional Access to enforce ToU acceptance before access is granted.'},
        {code:'80180026',cat:'enrollment',cl:'Enrollment',cc:'#54b054',
         title:'Device already enrolled (same user)',
         why:'This exact device is already enrolled in Intune under the same user account.',
         trigger:'User attempts to enroll a device that is already enrolled — typically after a sync issue, or after the user removed the device from Company Portal without fully unenrolling.',
         fix:['Go to Devices &#8594; All devices and find the existing device record','Delete the stale device record from Intune','Wait 10 minutes for AAD to sync','Then re-enroll the device'],
         prevent:'Provide users with clear unenrollment instructions to prevent orphaned device records. Automate stale device cleanup with a Graph API script.'},

        // ── APP DEPLOYMENT ───────────────────────
        {code:'0x87D300D9',cat:'apps',cl:'App Deployment',cc:'#ffd700',
         title:'Intune Management Extension (IME) agent unhealthy',
         why:'The IME agent (intunemanagementextension.exe) is not installed, not running, or not communicating with Intune. Win32 apps, PowerShell scripts, and remediation scripts all require IME.',
         trigger:'IME fails to install on first enrollment if the device has a firewall blocking *.manage.microsoft.com, or if the C:\\\\Program Files (x86)\\\\Microsoft Intune Management Extension folder is corrupted. Also triggers after Windows in-place upgrades.',
         fix:['Check if IME is installed: C:\\\\Program Files (x86)\\\\Microsoft Intune Management Extension\\\\intunemanagementextension.exe','Check Windows Services — Intune Management Extension service should be Running','If missing: go to Devices &#8594; [device] &#8594; Sync, then wait 10 min — IME auto-installs on sync','If present but failing: restart the service, or repair via: msiexec /fa (MSI repair)','Review IME logs at: C:\\\\ProgramData\\\\Microsoft\\\\IntuneManagementExtension\\\\Logs\\\\IntuneManagementExtension.log','Check firewall allows: *.manage.microsoft.com, *.microsoftonline.com, *.azure.com'],
         prevent:'Include IME connectivity checks in your Intune network requirements validation. Monitor IME health via Endpoint Analytics.'},
        {code:'0x80073CF9',cat:'apps',cl:'App Deployment',cc:'#ffd700',
         title:'Microsoft Store app installation conflict',
         why:'A newer or conflicting version of the Store app is already installed, or the Windows Store service is disabled or corrupted.',
         trigger:'Occurs when deploying Store apps to devices where IT has previously disabled the Windows Store, or where an incompatible version was manually installed.',
         fix:['Check if the app is already installed at a different version (Devices &#8594; [device] &#8594; Discovered apps)','If a conflicting version exists: uninstall it manually or via script, then re-try the deployment','Verify Windows Store is not disabled by GPO or compliance policy','Check Windows Store service: wsappx — ensure it is Running','Re-deploy after resolving the conflict'],
         prevent:'For controlled Store app deployments, use the Company Portal-based distribution rather than Required deployment to avoid version conflicts.'},
        {code:'0x87D13B64',cat:'apps',cl:'App Deployment',cc:'#ffd700',
         title:'Win32 app detection rule returned failure',
         why:'The app installed successfully (exit code 0) but the detection rule Intune uses to confirm success did not find the expected file, registry key, or MSI product code.',
         trigger:'The detection rule in the Win32 app configuration points to the wrong file path, registry key, or version number. Occurs after app package updates where the installed path changed.',
         fix:['Review the app detection rule in Apps &#8594; [app] &#8594; Detection rules','Verify the file path or registry key is exactly correct on a device where the app IS installed','Use PowerShell detection rule for complex logic: Test-Path "C:\\\\Path\\\\to\\\\app.exe"','After fixing detection rule, force a device sync','Check IME logs for the exact detection check being performed'],
         prevent:'Always test detection rules manually on a device before deploying. Use a specific version number or file hash rather than just checking file existence.'},
        {code:'0xC7D14FB5',cat:'apps',cl:'App Deployment',cc:'#ffd700',
         title:'Win32 app installation timed out',
         why:'The Win32 app installation exceeded the 60-minute default timeout. IME cancels the install and reports failure.',
         trigger:'Large apps (Visual Studio, Autodesk, Adobe Creative Cloud) or apps that depend on slow downloads or lengthy configuration steps. Also occurs on slow network connections.',
         fix:['Increase timeout: Apps &#8594; [app] &#8594; Program &#8594; Maximum allowed run time (minutes) — set to 120 or 240','Ensure the .intunewin package is uploaded correctly and not corrupted','For large apps: consider deploying to a staged group with fast network connectivity first','If app requires a reboot mid-install: set Device restart behavior to App determines behavior','Review IME logs for the last action before timeout'],
         prevent:'Set appropriate timeouts at package creation time. For apps over 1 GB, always test installation time on a clean machine first.'},
        {code:'0x87D1041C',cat:'apps',cl:'App Deployment',cc:'#ffd700',
         title:'App not detected after installation completed',
         why:'The IME reports the install command succeeded (exit code 0), but when Intune runs the detection rule afterward, the app is not found.',
         trigger:'Mismatch between where the installer places files and where the detection rule looks. Common with apps that install to user profile paths rather than Program Files, or apps that have separate 32-bit and 64-bit paths.',
         fix:['Check detection rule paths: ensure they match the actual installed location','For 32-bit apps on 64-bit Windows: path is C:\\\\Program Files (x86)\\\\... — do not use the 64-bit path','Verify the install actually succeeded manually on a test device','Use PowerShell detection rule to verify from SYSTEM context (not user context)','For MSI apps: use MSI product code detection rather than file path'],
         prevent:'Always run your installer under SYSTEM context (psexec -s cmd) to verify paths before writing detection rules.'},
        {code:'0x80070057',cat:'apps',cl:'App Deployment',cc:'#ffd700',
         title:'Invalid parameter — Win32 app packaging error',
         why:'The .intunewin app package contains an invalid setup command, or the command line arguments are malformed.',
         trigger:'Usually introduced when re-packaging an existing app with different install switches, or when the setup.exe path inside the package is incorrect.',
         fix:['Verify the Install command in Apps &#8594; [app] &#8594; Program is correct','Test the exact install command locally: setup.exe /quiet /norestart','Re-package with the Microsoft Win32 Content Prep Tool if the .intunewin may be corrupted','For MSI: ensure the .msi file name matches exactly in the install command','Check IME logs for the exact command line that was attempted'],
         prevent:'Document and test install commands before packaging. Use a standard command-line template for each installer type.'},
        {code:'0x8007065E',cat:'apps',cl:'App Deployment',cc:'#ffd700',
         title:'Insufficient disk space for app installation',
         why:'The target device does not have enough free disk space to extract and install the app.',
         trigger:'Occurs on devices with near-full drives, or on old devices where the app package is particularly large.',
         fix:['Check available disk space on the device (should be at least 2x the app size)','Run Disk Cleanup or DISM to free space: DISM /Online /Cleanup-Image /StartComponentCleanup','Configure Windows Storage Sense via Intune configuration profile to auto-clean temp files','For large apps: consider deploying via Software Center/SCCM co-management instead','After freeing space: Devices &#8594; [device] &#8594; Sync to re-attempt'],
         prevent:'Monitor disk space via Endpoint Analytics or custom compliance policy setting. Alert when free space drops below 15 GB.'},

        // ── COMPLIANCE ───────────────────────────
        {code:'65000',cat:'compliance',cl:'Compliance',cc:'#ff7a7a',
         title:'Policy conflict — two profiles set the same value differently',
         why:'Two or more Intune configuration profiles are targeting the same device and configuring the same setting with different values. Intune cannot resolve the conflict and marks the setting as Error.',
         trigger:'Typically occurs when a Security Baseline and a custom Settings Catalog profile both configure the same BitLocker, Defender, or Windows Update setting. Also common when multiple admins create overlapping profiles.',
         fix:['Go to Devices &#8594; [device] &#8594; Device configuration — look for settings marked Conflict or Error','Click the conflicting setting to see which policies are in conflict','Remove the duplicate setting from one of the conflicting policies (keep it in the most specific profile)','Use the Settings Catalog Policy Conflict report: Devices &#8594; Monitor &#8594; Device configuration settings','Force a device sync after resolving'],
         prevent:'Maintain a policy matrix spreadsheet listing which profile owns each setting. Never configure the same setting in multiple profiles.'},
        {code:'0x87D1FDE8',cat:'compliance',cl:'Compliance',cc:'#ff7a7a',
         title:'PowerShell remediation script failed',
         why:'The remediation script (Endpoint analytics &#8594; Remediations) ran but exited with a non-zero exit code, or the detection script returned unexpected output.',
         trigger:'Script error or unhandled exception in the PowerShell code. Also occurs if the script runs in user context but requires SYSTEM privileges, or if a script dependency (module, file) is missing on the device.',
         fix:['Review the remediation script output: Devices &#8594; [device] &#8594; Device configuration &#8594; [Remediation name] &#8594; View output','Check the script for unhandled errors — add Try/Catch blocks','Verify the script runs correctly under SYSTEM context: psexec -s powershell.exe','Ensure any required modules are pre-installed or bundled with the script','Add Start-Transcript at the script start and log to C:\\\\ProgramData\\\\YourCo\\\\Logs\\\\'],
         prevent:'Always test remediation scripts in SYSTEM context before deploying. Add explicit exit codes: exit 0 for success, exit 1 for failure.'},
        {code:'0x80070774',cat:'compliance',cl:'Compliance',cc:'#ff7a7a',
         title:'MDM enrollment timed out during Azure AD join',
         why:'The device successfully joined Azure AD but the MDM enrollment (Intune) portion timed out — the device is Azure AD joined but shows as unmanaged in Intune.',
         trigger:'Caused by network latency, proxy configuration, or the MDM enrollment endpoint (*.manage.microsoft.com) being unreachable during the AAD join process.',
         fix:['On the device: Settings &#8594; Accounts &#8594; Access work or school &#8594; [account] &#8594; Info &#8594; check MDM enrollment','If enrollment failed: disconnect the account, check network connectivity to *.manage.microsoft.com, then re-connect','Check Windows Event Viewer &#8594; Applications and Services &#8594; Microsoft &#8594; Windows &#8594; DeviceManagement-Enterprise-Diagnostics-Provider','Verify MDM auto-enrollment is still enabled in Intune &#8594; Devices &#8594; Automatic enrollment','Force enrollment via command: dsregcmd /enroll (run as admin)'],
         prevent:'Test AAD join + MDM enrollment in your specific network environment (including through proxies) before mass rollout.'},

        // ── BITLOCKER ────────────────────────────
        {code:'0x8031004A',cat:'bitlocker',cl:'BitLocker',cc:'#50e6ff',
         title:'BitLocker cannot encrypt: TPM not ready or not available',
         why:'BitLocker requires a TPM (Trusted Platform Module) 2.0 chip to store the encryption key. The device either has no TPM, TPM is disabled in BIOS/UEFI, or TPM ownership has not been provisioned.',
         trigger:'Usually hits VMs without vTPM enabled, older hardware without TPM 2.0, or devices where BIOS was updated and TPM was inadvertently disabled.',
         fix:['Check TPM status: tpm.msc &#8594; shows TPM version and status','If TPM is disabled: reboot into BIOS/UEFI &#8594; Security &#8594; Enable TPM / Firmware TPM','For Hyper-V VMs: VM Settings &#8594; Security &#8594; Enable Trusted Platform Module','After enabling TPM: clear TPM ownership (tpm.msc &#8594; Clear TPM), then sync device and wait for BitLocker policy to re-apply','If no TPM and not replaceable: configure BitLocker policy to Allow BitLocker without compatible TPM (with startup key on USB)'],
         prevent:'Include TPM status in your hardware procurement requirements. Verify TPM 2.0 before deploying BitLocker policy.'},
        {code:'0x80310039',cat:'bitlocker',cl:'BitLocker',cc:'#50e6ff',
         title:'BitLocker already enabled — conflicting encryption state',
         why:'BitLocker is already encrypted on the drive but with settings that conflict with the Intune policy (different algorithm, different protectors, or not escrowed to Azure AD).',
         trigger:'Device was BitLocker-encrypted manually or by a GPO before Intune management. The Intune policy tries to reconfigure encryption but cannot change settings on an already-encrypted drive without decrypting first.',
         fix:['Check current encryption: manage-bde -status in admin PowerShell','Check the protection method: manage-bde -protectors -get C:','If algorithm mismatch: you must decrypt (Disable-BitLocker -MountPoint C:), then let Intune re-encrypt with the correct settings','To escrow existing key to Azure AD without decrypting: BackupToAAD-BitLockerKeyProtector -MountPoint C: -KeyProtectorId (Get-BitLockerVolume -MountPoint C:).KeyProtector[0].KeyProtectorId','Force sync and check: Devices &#8594; [device] &#8594; Recovery keys'],
         prevent:'Document existing BitLocker state before enrolling devices. Pre-escrow keys to Azure AD before switching to Intune-managed BitLocker.'},
        {code:'0x8031003A',cat:'bitlocker',cl:'BitLocker',cc:'#50e6ff',
         title:'BitLocker cannot encrypt: drive needs reformatting',
         why:'The drive partition layout is not compatible with BitLocker. Usually missing the required system partition (500 MB unencrypted boot partition).',
         trigger:'Occurs on older machines that were upgraded from Windows 7 without repartitioning, or custom disk images that skipped the standard Windows partition layout.',
         fix:['Run: mbr2gpt /validate /disk:0 to check partition compatibility','If validation fails: the disk needs repartitioning — requires data backup and reinstall','For Autopilot or Intune-enrolled machines: use a fresh Windows install which creates the correct partition layout','After repartitioning: re-enroll and let BitLocker policy apply'],
         prevent:'Use Windows Autopilot or a standard Windows install (not a custom image) to ensure correct partition layout. Test BitLocker eligibility before deploying to users.'},
        {code:'0x80310025',cat:'bitlocker',cl:'BitLocker',cc:'#50e6ff',
         title:'BitLocker conflict: drive encrypted with different method',
         why:'The drive is already encrypted using a different algorithm than what the Intune policy specifies (e.g., AES-128 vs XTS-AES-256).',
         trigger:'Device was encrypted with a previous policy using AES-128, and the Intune policy now requires XTS-AES-256. Intune cannot change the algorithm of an active encryption in-place.',
         fix:['Confirm current algorithm: manage-bde -status — shows Encryption Method','To change algorithm: suspend BitLocker (Suspend-BitLocker -MountPoint C:), decrypt the drive (Disable-BitLocker -MountPoint C:), then allow Intune to re-encrypt with the new algorithm','After decryption completes (can take 1–2 hours): sync the device — policy will trigger re-encryption','Monitor: manage-bde -status until Percentage Encrypted = 100%'],
         prevent:'Standardise on XTS-AES-256 from the start. If you have a mix of AES-128 and XTS-AES-256 devices, handle re-encryption as a project before enforcing the Intune policy.'},

        // ── AUTOPILOT ────────────────────────────
        {code:'0x801C03F3',cat:'autopilot',cl:'Autopilot',cc:'#c07aff',
         title:'Device not found in Autopilot deployment service',
         why:'The device hardware hash has not been registered with the Microsoft Autopilot deployment service, so when the device boots to OOBE and calls home, it finds no profile.',
         trigger:'Device was not imported via CSV or OEM registration. Or the import was done but not yet processed (takes 15–30 min). Also occurs if the device was registered under a different tenant.',
         fix:['Verify the device is in: Devices &#8594; Enroll devices &#8594; Autopilot devices','If not listed: re-import the hardware hash CSV and wait 15–30 minutes','If listed: check the Deployment profile column — the device needs a profile assigned','Ensure the device AAD dynamic group has the device (takes 5–15 min after import)','To force OOBE re-run on a partially-provisioned device: hold Shift+F10 at OOBE, run: sysprep /oobe /generalize /shutdown'],
         prevent:'Pre-register hardware hashes at procurement. Verify registration in Intune before shipping devices to users.'},
        {code:'0x801C0001',cat:'autopilot',cl:'Autopilot',cc:'#c07aff',
         title:'Azure AD device identity not found during Autopilot',
         why:'During Autopilot OOBE, the device cannot create or find its Azure AD device object. Often related to a tenant mismatch or an existing stale object.',
         trigger:'Device was previously registered in a different Azure AD tenant, or a stale device object with the same hardware ID exists in Azure AD.',
         fix:['Check Azure AD for conflicting device objects: entra.microsoft.com &#8594; Devices &#8594; All devices &#8594; search by device name/serial','Delete stale device objects in Azure AD','Delete and re-import the device in Intune Autopilot devices list','Factory reset the device (Settings &#8594; Recovery &#8594; Reset this PC &#8594; Remove everything) and retry Autopilot'],
         prevent:'Before decommissioning devices, delete them from Azure AD and Intune. Include AAD cleanup in your device retirement process.'},
        {code:'E8000014',cat:'autopilot',cl:'Autopilot',cc:'#c07aff',
         title:'Device enrollment limit exceeded for user',
         why:'The Intune device limit restriction prevents the user from enrolling more devices than the configured maximum.',
         trigger:'User already has the maximum number of enrolled devices. Default limit is 5 per user.',
         fix:['Check current enrollment count: Devices &#8594; All devices &#8594; filter by user','Delete old/stale device records from Intune for this user','Increase limit if needed: Devices &#8594; Enroll devices &#8594; Enrollment restrictions &#8594; Device limit restrictions &#8594; Edit','For Autopilot devices: device-assigned (not user-assigned) Autopilot does not count against user limit'],
         prevent:'Monitor per-user device counts. For Autopilot deployments, use device-based group membership rather than user-assigned deployment to avoid hitting user device limits.'},
        {code:'0x800705B4',cat:'autopilot',cl:'Autopilot',cc:'#c07aff',
         title:'Enrollment Status Page timed out',
         why:'The ESP (Enrollment Status Page) has a configured timeout, and one or more required apps did not finish installing within that time.',
         trigger:'Large apps (e.g., Visual Studio, Adobe Suite) taking longer than the ESP timeout allows. Or a dependency app failing silently, blocking the main app install from starting.',
         fix:['Increase ESP timeout: Devices &#8594; Enroll devices &#8594; Enrollment Status Page &#8594; [profile] &#8594; Edit — set to 90 or 120 minutes','Check which app is stuck: during ESP, press Ctrl+Shift+Alt+F10 to open Task Manager — look for setup processes','Review IME logs: C:\\\\ProgramData\\\\Microsoft\\\\IntuneManagementExtension\\\\Logs\\\\','For large app suites: consider making them Available (not Required) and let users install post-ESP from Company Portal','Remove non-critical apps from the Tracked apps in ESP settings'],
         prevent:'Test ESP timing on a clean device before production rollout. Set ESP timeout to 1.5x the slowest app install time you have measured.'},
        {code:'0x801C03EA',cat:'autopilot',cl:'Autopilot',cc:'#c07aff',
         title:'Autopilot: Azure AD device object conflict',
         why:'A device object with the same hardware attributes already exists in Azure AD, preventing creation of a new object during Autopilot.',
         trigger:'Device was partially through Autopilot before, creating an orphaned AAD object. Or a colleague imported the same hardware hash twice.',
         fix:['Find the conflicting object: Azure AD &#8594; Devices &#8594; All devices &#8594; search by device name/serial','Delete the orphaned device object in Azure AD','Also delete from Intune: Devices &#8594; All devices &#8594; delete','Delete from Autopilot devices list','Factory reset the device and re-run Autopilot'],
         prevent:'Implement a device lifecycle process: always clean up Azure AD, Intune, and Autopilot records when retiring or re-imaging a device.'},

        // ── CONDITIONAL ACCESS ───────────────────
        {code:'AADSTS53003',cat:'ca',cl:'Cond. Access',cc:'#ff7a7a',
         title:'Access blocked by Conditional Access policy',
         why:'A Conditional Access policy evaluated the sign-in request and determined the conditions were not met — blocking access.',
         trigger:'New CA policy went live that the user was not prepared for (no MFA registered, device not compliant, non-corporate location blocked). Or a policy moved from Report-only to On.',
         fix:['Identify the blocking policy: Azure AD &#8594; Sign-in logs &#8594; find the event &#8594; Conditional Access tab — shows which policy blocked and why','Check the Failure Reason: e.g., "Device is not compliant" or "MFA required"','For MFA block: register MFA methods at aka.ms/MFASetup','For device compliance block: enroll the device in Intune and wait for compliance evaluation','For location block: confirm the user is signing in from an expected location','Always test CA policies in Report-only mode first'],
         prevent:'Always deploy CA policies in Report-only for at least 1 week before enabling. Review sign-in logs for false positives before going live.'},
        {code:'AADSTS50076',cat:'ca',cl:'Cond. Access',cc:'#ff7a7a',
         title:'MFA required — sign-in interrupted by CA policy',
         why:'A Conditional Access or security default policy requires MFA for this sign-in, but the user has not yet registered MFA methods or the MFA challenge was not completed.',
         trigger:'CA policy requiring MFA was newly applied to this user, or the user registered a new device that does not have a trusted MFA session.',
         fix:['User must register MFA: aka.ms/MFASetup or Microsoft Authenticator app','If user is locked out: a Global Admin can temporarily exclude the user from the CA policy while they register MFA','Check the user\'s registered MFA methods: Azure AD &#8594; Users &#8594; [user] &#8594; Authentication methods','For bulk registration: use a Conditional Access policy with Registration campaign to prompt all users at next sign-in'],
         prevent:'Run a MFA registration campaign before enforcing the MFA CA policy. Use the Registration campaign feature in Azure AD to prompt users non-disruptively.'},
        {code:'AADSTS90072',cat:'ca',cl:'Cond. Access',cc:'#ff7a7a',
         title:'Guest or cross-tenant access blocked by policy',
         why:'A Conditional Access policy blocks guest or external identities from accessing the resource, or cross-tenant access settings prevent the authentication.',
         trigger:'New CA policy targeting All users was applied without excluding external identities, or cross-tenant access policy was tightened.',
         fix:['Check the CA policy: does it exclude External users / Guest users?','If intentional: exclude the guest user group from the policy or create a separate CA policy for external users with different requirements','Check Cross-tenant access settings: Azure AD &#8594; External Identities &#8594; Cross-tenant access settings','Ensure the partner organisation is configured with inbound access permissions'],
         prevent:'When creating CA policies targeting All users, explicitly review the impact on guest and B2B users. Add an external users exclusion if needed.'},
        {code:'AADSTS700016',cat:'ca',cl:'Cond. Access',cc:'#ff7a7a',
         title:'Application not found in Azure AD directory',
         why:'The application (client ID) used in the authentication request was not found in this Azure AD tenant — either not registered or registered in a different tenant.',
         trigger:'Custom application using the wrong tenant ID, or an app registration was deleted by an admin.',
         fix:['Verify the application exists: Azure AD &#8594; App registrations &#8594; search by client ID or name','If deleted: restore from Azure AD &#8594; Deleted applications (30-day recovery window)','If using wrong tenant ID: update the application configuration to use the correct Directory (tenant) ID','For multi-tenant apps: ensure the app is registered as multi-tenant and has been consented to in this tenant'],
         prevent:'Implement app registration lifecycle management. Use Azure AD access reviews to audit application registrations quarterly.'}
      ];

      var cards = EC.map(function(e) {
        var steps = e.fix.map(function(s) { return '<li>' + s + '</li>'; }).join('');
        return '<div class="err-card" id="ec-' + e.code + '" data-cat="' + e.cat + '" data-code="' + e.code.toLowerCase() + '" data-title="' + e.title.toLowerCase() + '">' +
          '<div class="err-card-head" onclick="toggleErrCard(\'' + e.code + '\')">' +
            '<span class="err-code">' + e.code + '</span>' +
            '<span class="err-title">' + e.title + '</span>' +
            '<span class="err-cat-badge" style="background:' + e.cc + '22;color:' + e.cc + '">' + e.cl + '</span>' +
            '<span class="err-toggle">&#9660;</span>' +
          '</div>' +
          '<div class="err-body">' +
            '<div class="err-section-title">&#128269; Root Cause</div>' +
            '<div class="err-why">' + e.why + '</div>' +
            '<div class="err-section-title">&#9889; What Change Triggers This</div>' +
            '<div class="err-trigger">' + e.trigger + '</div>' +
            '<div class="err-section-title">&#128295; Fix — Step by Step</div>' +
            '<ol class="err-steps">' + steps + '</ol>' +
            '<div class="err-section-title">&#9989; Prevention</div>' +
            '<div class="err-prevent">' + e.prevent + '</div>' +
          '</div>' +
        '</div>';
      }).join('');

      return '<div class="content-header">' +
        '<div class="breadcrumb"><span onclick="showPage(\'dashboard\')">&#127968; Home</span> &#8250; Tools</div>' +
        '<h1>&#128308; Error Codes &amp; Solutions</h1>' +
        '<div class="meta-row"><span class="meta-chip">33 Error Codes</span><span class="meta-chip">Root Cause Analysis</span><span class="meta-chip">Step-by-Step Fixes</span></div>' +
        '</div>' +
        '<div class="section">' +
          '<div style="position:relative;margin-bottom:14px">' +
            '<span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--muted)">&#128269;</span>' +
            '<input class="errors-search" id="err-search" type="search" placeholder="Search error code or description&#8230;" oninput="filterErrors(this.value)" autocomplete="off" />' +
          '</div>' +
          '<div class="errors-cats">' +
            '<button class="err-cat-btn active" onclick="setErrCat(\'all\',this)">All (33)</button>' +
            '<button class="err-cat-btn" onclick="setErrCat(\'enrollment\',this)">Enrollment (7)</button>' +
            '<button class="err-cat-btn" onclick="setErrCat(\'apps\',this)">App Deployment (8)</button>' +
            '<button class="err-cat-btn" onclick="setErrCat(\'compliance\',this)">Compliance (3)</button>' +
            '<button class="err-cat-btn" onclick="setErrCat(\'bitlocker\',this)">BitLocker (4)</button>' +
            '<button class="err-cat-btn" onclick="setErrCat(\'autopilot\',this)">Autopilot (5)</button>' +
            '<button class="err-cat-btn" onclick="setErrCat(\'ca\',this)">Cond. Access (6)</button>' +
          '</div>' +
          '<div class="errors-grid" id="errors-grid">' + cards + '</div>' +
        '</div>';
    }
  },

  // ─────────────────────────────────────────────
  // GUIDED SCENARIOS
  // ─────────────────────────────────────────────
  scenarios: {
    title: 'Guided Scenarios',
    render: function() {
      var S = [
        { id:'migration', icon:'&#128260;', title:'SCCM to Intune Migration', desc:'Move from on-premises Configuration Manager to full cloud management with zero-downtime co-management.',
          time:'4&#8211;8 weeks', diff:'Advanced', dc:'#ff7a7a',
          pre:['SCCM/ConfigMgr 1902 or later','Azure AD Connect configured','Microsoft 365 E3+ licences','Co-management capable Windows 10/11 devices'],
          steps:[
            {t:'Discovery &amp; Asset Inventory',d:'Document all SCCM-deployed apps, OSD sequences, compliance baselines, and client settings. Map each to an Intune equivalent. Identify gaps that need custom PowerShell scripts.',link:'a3',ll:'Co-management &amp; SCCM'},
            {t:'Tenant &amp; Licence Setup',d:'Verify Intune tenant, assign licences to pilot users, confirm MDM authority = Intune, and check Azure AD Connect health and sync status.',link:'b1',ll:'What is Intune?'},
            {t:'Enable Tenant Attach (Cloud Attach)',d:'Turn on Cloud Attach in SCCM console &#8594; Administration &#8594; Cloud Services. All SCCM devices will appear in Intune portal. Zero risk — read-only view.',link:'a3',ll:'Co-management &amp; SCCM'},
            {t:'Enable Co-management on Pilot Devices',d:'Create a 10-device pilot collection. Enable co-management, set Compliance Policies workload = Pilot Intune. Deploy a compliance policy and verify evaluation on pilot devices.',link:'a3',ll:'Co-management &amp; SCCM'},
            {t:'Migrate Compliance &amp; Config Policies',d:'Recreate SCCM compliance baselines as Intune compliance policies. Recreate device config in Settings Catalog profiles. Assign to pilot, validate all devices compliant, then expand.',link:'b3',ll:'Device Compliance'},
            {t:'Migrate App Deployments',d:'Re-create critical app deployments in Intune as Win32 or M365 Apps. Run SCCM and Intune deployments in parallel. Remove SCCM deployment only after Intune confirms successful installation.',link:'b4',ll:'App Deployment'},
            {t:'Validate — Review Compliance &amp; CA',d:'All pilot devices should be compliant. Enable CA policies in Report-only mode. Fix any compliance gaps. Confirm no users are unexpectedly blocked by CA.',link:'i3',ll:'Reporting &amp; Monitoring'},
            {t:'Full Workload Cutover',d:'Slide all co-management workloads to Intune: Client Apps, Windows Updates, Resource Access, Endpoint Protection. Retire SCCM client last after confirming no dependencies remain.',link:'a3',ll:'Co-management &amp; SCCM'}
          ]},
        { id:'autopilot', icon:'&#9992;&#65039;', title:'Zero-Touch Autopilot Deployment', desc:'Configure end-to-end Autopilot so every new device is user-ready from the box — no imaging, no IT desk visits.',
          time:'1&#8211;2 weeks setup', diff:'Intermediate', dc:'#ffd700',
          pre:['Windows 10/11 Pro or Enterprise with TPM 2.0','Azure AD Premium P1','Intune licence','Hardware hash CSV from vendor or via script'],
          steps:[
            {t:'Collect Hardware Hashes',d:'Run Get-WindowsAutoPilotInfo on pilot devices. For procurement scale: request hash CSV directly from Dell/HP/Lenovo at device order time.',link:'i4',ll:'Windows Autopilot'},
            {t:'Import Devices into Intune',d:'Upload CSV to Devices &#8594; Enroll devices &#8594; Autopilot Devices &#8594; Import. Processing takes 15&#8211;30 min. Verify devices appear in the Autopilot devices list.',link:'i4',ll:'Windows Autopilot'},
            {t:'Create Autopilot Deployment Profile',d:'Create profile: User-driven, AAD joined, skip privacy settings and keyboard, standard user account. Set Group Tag for dynamic group assignment.',link:'i4',ll:'Windows Autopilot'},
            {t:'Create Dynamic AAD Device Group',d:'Create a dynamic device group using the ZTDId rule. All imported Autopilot devices auto-join. Assign the deployment profile and required apps to this group.',link:'i4',ll:'Windows Autopilot'},
            {t:'Configure Enrollment Status Page (ESP)',d:'Create ESP profile: block desktop access until all required apps and policies install. Set timeout = 60 min, allow log collection, allow user to reset on error.',link:'i4',ll:'Windows Autopilot'},
            {t:'Test Full Autopilot on Pilot Device',d:'Factory reset a test device. Boot to OOBE. Autopilot profile loads, user authenticates with corporate email, ESP shows progress, desktop ready with all apps. Total time target: under 30 minutes.',link:'i4',ll:'Windows Autopilot'}
          ]},
        { id:'byod', icon:'&#128241;', title:'BYOD Mobile App Protection', desc:'Protect corporate data on personal iOS and Android devices using App Protection Policies — no device enrollment required.',
          time:'2&#8211;3 days', diff:'Intermediate', dc:'#ffd700',
          pre:['Azure AD Premium P1','Intune licence per user','Microsoft 365 apps deployed to users','Break Glass admin account for CA testing'],
          steps:[
            {t:'Define Your BYOD Policy',d:'Document which apps will be covered, data restrictions (backup, cut/paste, save-as), PIN requirements, jailbreak response, and which user groups will be targeted. Get sign-off before configuring.',link:'a4',ll:'BYOD &amp; MAM Policies'},
            {t:'Create iOS App Protection Policy',d:'Target all Microsoft apps. Block iCloud backup, restrict data to policy-managed apps only, require 6-digit PIN, allow Face ID / Touch ID, block screen capture, block jailbroken devices.',link:'a4',ll:'BYOD &amp; MAM Policies'},
            {t:'Create Android App Protection Policy',d:'Same settings as iOS. Add Android-specific: SafetyNet device attestation required, block rooted devices, require encrypted device.',link:'a4',ll:'BYOD &amp; MAM Policies'},
            {t:'Configure Conditional Access for MAM Enforcement',d:'Create a CA policy targeting iOS and Android platforms: require Approved client app AND App Protection Policy for cloud app access. This forces BYOD users through the managed app.',link:'i2',ll:'Conditional Access'},
            {t:'Communicate to Users &amp; Test',d:'Notify affected users before the CA policy goes live. Test on a personal iPhone: install Outlook, sign in with corporate account — PIN should be required, iCloud backup of corp data should be blocked.',link:'a4',ll:'BYOD &amp; MAM Policies'},
            {t:'Monitor App Protection Status',d:'Apps &#8594; Monitor &#8594; App protection status. Verify all targeted users have policies applied. Investigate any Not Applied status — usually means the user has not yet signed into a managed app.',link:'i3',ll:'Reporting &amp; Monitoring'}
          ]},
        { id:'zerotrust', icon:'&#128737;&#65039;', title:'Zero Trust Security Implementation', desc:'Build a full Zero Trust access model: MFA for all, block legacy auth, device compliance required, identity risk protection.',
          time:'2&#8211;4 weeks', diff:'Expert', dc:'#c07aff',
          pre:['Azure AD Premium P1 (minimum)','P2 recommended for Identity Protection','Intune licences assigned','Break Glass admin account created and excluded from all CA','MFA methods pre-registered or campaign planned'],
          steps:[
            {t:'Baseline Security Audit',d:'Review Microsoft Secure Score (security.microsoft.com). Document current MFA registration %, legacy auth usage in sign-in logs, existing CA policies, and compliance rates. This is your before-state for measuring improvement.',link:'e2',ll:'Zero Trust Architecture'},
            {t:'Enforce MFA for All Users (Report-only first)',d:'Create CA001 requiring MFA for all users on all cloud apps. Enable in Report-only for 14 days. Review sign-in logs for unexpected failures. Once clean, change state to On.',link:'i2',ll:'Conditional Access'},
            {t:'Block Legacy Authentication',d:'Create CA002 targeting Exchange ActiveSync clients + Other clients (legacy protocols). Grant = Block access. Enable immediately — legacy protocols bypass MFA entirely and must be blocked before enabling CA001.',link:'e2',ll:'Zero Trust Architecture'},
            {t:'Require Compliant Intune Device for M365',d:'Deploy Windows compliance policy (BitLocker, Secure Boot, Defender, OS version). Then create CA003 requiring device compliance for M365 access. Report-only first.',link:'b3',ll:'Device Compliance'},
            {t:'Deploy MDM Security Baseline',d:'Assign the Microsoft MDM Security Baseline to all Windows devices. Enforces BitLocker, Defender, Firewall, credential guard, and 400+ hardening settings.',link:'a1',ll:'Security Baselines'},
            {t:'Enable Identity Protection Risk Policies',d:'Enable Sign-in risk policy (High risk &#8594; require MFA) and User risk policy (High risk &#8594; require password change). Requires Azure AD Premium P2. These auto-respond to threats detected by Microsoft\'s ML.',link:'e2',ll:'Zero Trust Architecture'},
            {t:'Validate &amp; Report Improvement',d:'Re-run Secure Score. Compare with baseline. Target: all CA policies On, 100% MFA registered, device compliance = 95%+, legacy auth = 0 sign-ins in 7 days. Document all policies in a CA runbook.',link:'i3',ll:'Reporting &amp; Monitoring'}
          ]},
        { id:'onboarding', icon:'&#128187;', title:'New Corporate Device Onboarding', desc:'End-to-end standard setup for every new corporate Windows device — from unboxing to production-ready.',
          time:'2&#8211;5 days setup', diff:'Beginner', dc:'#54b054',
          pre:['Windows 10/11 Pro or Enterprise','Intune licences assigned to users','Azure AD configured','Required apps identified and packaged'],
          steps:[
            {t:'Enable Auto-Enrollment',d:'Set MDM user scope = All in Devices &#8594; Enroll devices &#8594; Automatic enrollment. Windows devices auto-enroll when they join Azure AD — no extra steps for users.',link:'b2',ll:'Setup &amp; Enrollment'},
            {t:'Create Device Compliance Policy',d:'Compliance policy covering BitLocker (Require), Secure Boot (Require), OS version minimum, Microsoft Defender (Require). Assign to All Corporate Devices group.',link:'b3',ll:'Device Compliance'},
            {t:'Deploy Required Apps',d:'Add M365 Apps (Word, Excel, Outlook, Teams, OneDrive) as Required deployment to All Corporate Devices. Also add any required LOB apps.',link:'b4',ll:'App Deployment'},
            {t:'Apply Configuration Profiles',d:'Deploy: BitLocker profile (XTS-AES 256, recovery key to AAD), Windows Update ring (defer quality 7 days, defer feature 30 days), and any organisation-specific restrictions.',link:'i1',ll:'Configuration Profiles'},
            {t:'Apply MDM Security Baseline',d:'Assign the Microsoft MDM Security Baseline to All Corporate Devices. Covers 400+ settings including BitLocker, Defender, Firewall, and credential protection automatically.',link:'a1',ll:'Security Baselines'},
            {t:'Validate First Device End-to-End',d:'Enroll a test device. Force sync. Verify: Compliance state = Compliant, all required apps installed, BitLocker recovery key escrowed, Defender running, correct Windows Update ring applied. Only expand after full validation.',link:'i3',ll:'Reporting &amp; Monitoring'}
          ]},
        { id:'hardening', icon:'&#128274;', title:'Enterprise Security Hardening', desc:'Harden an existing Intune environment — BitLocker, Defender, Firewall, Conditional Access, and security score improvement.',
          time:'1&#8211;2 weeks', diff:'Advanced', dc:'#ff7a7a',
          pre:['Existing Intune deployment with enrolled devices','Azure AD Premium P1','Ability to create CA policies','Change management process for production policy changes'],
          steps:[
            {t:'Security Baseline Assessment',d:'Review Microsoft Secure Score in security.microsoft.com. Export compliance report CSV. Document: compliance %, BitLocker encryption %, Defender active %, CA policies in Report-only vs On. This is your before-state.',link:'i3',ll:'Reporting &amp; Monitoring'},
            {t:'Deploy MDM Security Baseline',d:'Create MDM Security Baseline profile, assign to pilot group (10 devices), monitor 48 hours for unexpected BitLocker prompts or reboots, then expand to all devices.',link:'a1',ll:'Security Baselines'},
            {t:'Enforce BitLocker via Settings Catalog',d:'Create BitLocker Settings Catalog profile: XTS-AES 256 for OS and fixed drives, TPM startup PIN, auto-escrow recovery key to Azure AD. Verify recovery keys in Devices &#8594; [device] &#8594; Recovery keys.',link:'i1',ll:'Configuration Profiles'},
            {t:'Harden Conditional Access',d:'Audit all CA policies. Confirm: legacy auth blocked, MFA required for all users, device compliance required for M365 access. Move any remaining Report-only policies to On after review.',link:'i2',ll:'Conditional Access'},
            {t:'Configure Microsoft Defender Policies',d:'Enable Defender Antivirus, EDR (Endpoint Detection and Response), and Attack Surface Reduction (ASR) rules via Endpoint Security &#8594; Antivirus and Endpoint detection and response profiles.',link:'a1',ll:'Security Baselines'},
            {t:'Validate &amp; Report Improvement',d:'Re-run Secure Score and compare with baseline. Export new compliance report. Present delta to stakeholders. Target metrics: Secure Score improvement &#8805;15 points, 100% BitLocker, 100% Defender active, 0 legacy auth sign-ins.',link:'i3',ll:'Reporting &amp; Monitoring'}
          ]}
      ];

      var gridCards = S.map(function(sc) {
        var p = getScenarioProg(sc.id, sc.steps.length);
        return '<div class="scenario-card" onclick="showScenario(\'' + sc.id + '\')">' +
          '<div class="sc-icon">' + sc.icon + '</div>' +
          '<div class="sc-title">' + sc.title + '</div>' +
          '<div class="sc-meta">' +
            '<span class="sc-badge" style="color:' + sc.dc + ';border-color:' + sc.dc + '55">' + sc.diff + '</span>' +
            '<span class="sc-badge">&#9201; ' + sc.time + '</span>' +
            '<span class="sc-badge">' + sc.steps.length + ' steps</span>' +
          '</div>' +
          '<p class="sc-desc">' + sc.desc + '</p>' +
          '<div class="sc-progress-bar"><div class="sc-progress-fill" id="sc-fill-' + sc.id + '" style="width:' + p.pct + '%"></div></div>' +
          '<div class="sc-progress-text" id="sc-pct-' + sc.id + '">' + p.done + ' / ' + sc.steps.length + ' steps (' + p.pct + '%)</div>' +
        '</div>';
      }).join('');

      var details = S.map(function(sc) {
        var p = getScenarioProg(sc.id, sc.steps.length);
        var prereqHTML = sc.pre.map(function(pr) {
          return '<span class="sc-badge" style="display:inline-block;margin:2px 3px 2px 0">&#10003; ' + pr + '</span>';
        }).join('');
        var stepsHTML = sc.steps.map(function(step, idx) {
          var isDone = !!(p.arr[idx]);
          return '<div class="sc-step">' +
            '<div class="sc-step-check' + (isDone ? ' done' : '') + '" id="sc-chk-' + sc.id + '-' + idx + '" onclick="toggleScenarioStep(\'' + sc.id + '\',' + idx + ')">' + (isDone ? '&#10003;' : '') + '</div>' +
            '<div class="sc-step-body">' +
              '<div class="sc-step-title' + (isDone ? ' done' : '') + '" id="sc-ttl-' + sc.id + '-' + idx + '">Step ' + (idx + 1) + ': ' + step.t + '</div>' +
              '<div class="sc-step-desc">' + step.d + '</div>' +
              (step.link ? '<span class="sc-step-link" onclick="showPage(\'' + step.link + '\');event.stopPropagation()">&#128279; Study: ' + step.ll + '</span>' : '') +
            '</div></div>';
        }).join('');
        return '<div class="sc-detail" id="sc-detail-' + sc.id + '" style="display:none">' +
          '<div class="sc-back" onclick="hideScenario()">&#8592; Back to all scenarios</div>' +
          '<div class="content-header">' +
            '<h1>' + sc.icon + ' ' + sc.title + '</h1>' +
            '<div class="meta-row"><span class="meta-chip" style="color:' + sc.dc + '">' + sc.diff + '</span><span class="meta-chip">&#9201; ' + sc.time + '</span><span class="meta-chip">' + sc.steps.length + ' steps</span></div>' +
          '</div>' +
          '<div class="sc-summary">' +
            '<div class="sc-pre-label">Prerequisites</div>' +
            '<div style="margin-bottom:12px">' + prereqHTML + '</div>' +
            '<div class="sc-pre-label">Progress</div>' +
            '<div class="sc-progress-bar" style="height:6px"><div class="sc-progress-fill" id="sc-fill-d-' + sc.id + '" style="width:' + p.pct + '%"></div></div>' +
            '<div class="sc-progress-text" id="sc-pct-d-' + sc.id + '">' + p.done + ' / ' + sc.steps.length + ' steps (' + p.pct + '%)</div>' +
          '</div>' +
          '<div class="section"><div class="sc-path">' + stepsHTML + '</div></div>' +
        '</div>';
      }).join('');

      return '<div class="content-header">' +
        '<div class="breadcrumb"><span onclick="showPage(\'dashboard\')">&#127968; Home</span> &#8250; Tools</div>' +
        '<h1>&#127919; Guided Scenarios</h1>' +
        '<div class="meta-row"><span class="meta-chip">6 Scenarios</span><span class="meta-chip">End-to-End Paths</span><span class="meta-chip">Progress Saved</span></div>' +
        '</div>' +
        '<p class="scenarios-intro">Choose a real-world scenario and follow the complete guided path from planning to validation. Tick each step as you complete it &#8212; progress is saved automatically in your browser.</p>' +
        '<div id="sc-grid" class="scenarios-grid">' + gridCards + '</div>' + details;
    }
  },

};
