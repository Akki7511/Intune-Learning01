// ============================================================
// INTUNE SCRIPT GENERATOR — PAGE RENDERS
// Extends the existing PAGES object from content.js.
// Each page follows the same render() pattern as the original app.
// ============================================================

const SCRIPT_PAGES = {

  // ────────────────────────────────────────────
  // SCRIPT GENERATOR DASHBOARD
  // ────────────────────────────────────────────
  'sg-dashboard': {
    title: 'Script Generator Dashboard',
    render: () => {
      const libCount = ScriptLibrary.count();
      const learned  = completedModules ? completedModules.size : 0;
      return `
<div class="content-header">
  <h1>🛠️ PowerShell & Intune Script Generator</h1>
  <p class="meta-row">
    <span class="meta-chip">AI-Assisted (Mock Mode)</span>
    <span class="meta-chip">Local — no API keys needed</span>
    <span class="meta-chip">No auto-deployment</span>
  </p>
</div>
<div class="content-body">

  <div class="callout callout-info" style="margin-bottom:20px">
    <span>🔧</span>
    <span><b>Mock Mode active.</b> Scripts are generated from professional templates — not a live AI model.
    All output is labelled <b>DRAFT</b> and must be reviewed by a qualified engineer before production use.
    No code executes automatically. No tenant connection is made.</span>
  </div>

  <div class="dash-grid" style="margin-bottom:24px">
    <div class="stat-card">
      <div class="stat-label">Scripts Saved</div>
      <div class="stat-val" id="sg-stat-saved">${libCount}</div>
      <div class="stat-sub">in your library</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Modules Completed</div>
      <div class="stat-val">${learned}</div>
      <div class="stat-sub">learning progress</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Templates Available</div>
      <div class="stat-val">9</div>
      <div class="stat-sub">workflow patterns</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Execution Risk</div>
      <div class="stat-val" style="font-size:18px;color:var(--success)">Zero</div>
      <div class="stat-sub">no auto-run ever</div>
    </div>
  </div>

  <h2 style="margin-bottom:14px">🚀 Quick Start</h2>
  <div class="module-grid">
    <div class="module-card" onclick="navTo('ai-studio')">
      <div class="mc-level" style="color:var(--accent2)">⚡ MOST USED</div>
      <h3>AI Script Studio</h3>
      <p>Describe your requirement in plain English and get a complete, annotated PowerShell script with deployment guide.</p>
      <div class="mc-footer"><span>9 workflow types</span><span style="color:var(--accent2)">→</span></div>
    </div>
    <div class="module-card" onclick="navTo('dr-builder')">
      <div class="mc-level" style="color:var(--warning)">🔍 PAIRED SCRIPTS</div>
      <h3>Detection & Remediation</h3>
      <p>Generate a matched detection + remediation script pair for Intune Proactive Remediations.</p>
      <div class="mc-footer"><span>Correct exit codes</span><span style="color:var(--accent2)">→</span></div>
    </div>
    <div class="module-card" onclick="navTo('intune-builder')">
      <div class="mc-level" style="color:#c07aff">🏗️ WORKFLOW SELECTOR</div>
      <h3>Intune Script Builder</h3>
      <p>Choose a deployment workflow (Win32 detection, platform script, compliance) and get the right template.</p>
      <div class="mc-footer"><span>6 Intune workflows</span><span style="color:var(--accent2)">→</span></div>
    </div>
    <div class="module-card" onclick="navTo('troubleshooter')">
      <div class="mc-level" style="color:var(--danger)">🔧 ERRORS</div>
      <h3>Error Troubleshooter</h3>
      <p>Paste an error code, message, or log excerpt and get a plain-English diagnosis with fix steps.</p>
      <div class="mc-footer"><span>9 error patterns</span><span style="color:var(--accent2)">→</span></div>
    </div>
    <div class="module-card" onclick="navTo('validator')">
      <div class="mc-level" style="color:var(--success)">✅ VALIDATE</div>
      <h3>Script Validator</h3>
      <p>Paste any PowerShell script to check for placeholders, destructive commands, and structural issues.</p>
      <div class="mc-footer"><span>Static analysis</span><span style="color:var(--accent2)">→</span></div>
    </div>
    <div class="module-card" onclick="navTo('script-library')">
      <div class="mc-level" style="color:var(--muted)">📚 LIBRARY</div>
      <h3>Script Library</h3>
      <p>Browse, search, edit, and export your saved scripts. ${libCount} script${libCount !== 1 ? 's' : ''} saved.</p>
      <div class="mc-footer"><span>Save · Export · Version</span><span style="color:var(--accent2)">→</span></div>
    </div>
  </div>

  <div class="section" style="margin-top:24px">
    <h2>⚠ Safety Guarantees</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;margin-top:12px">
      ${[
        ['🚫', 'No auto-execution', 'Scripts are never run automatically. You must copy and run them manually.'],
        ['🚫', 'No auto-deployment', 'Nothing is deployed to Intune automatically. You push scripts manually through the portal.'],
        ['🚫', 'No tenant connection', 'This tool does not connect to Azure AD, Graph API, or any tenant.'],
        ['🚫', 'No secret storage', 'No passwords, tokens, or API keys are collected or stored.'],
        ['✅', 'All output labelled', 'Every generated script is clearly labelled DRAFT and MOCK.'],
        ['✅', 'Local storage only', 'Saved scripts are stored in your browser localStorage only.'],
      ].map(([icon, title, desc]) => `
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:12px">
        <div style="font-size:18px;margin-bottom:6px">${icon}</div>
        <div style="font-weight:700;font-size:13px;margin-bottom:4px">${title}</div>
        <div style="font-size:12px;color:var(--muted);line-height:1.5">${desc}</div>
      </div>`).join('')}
    </div>
  </div>

</div>`;
    }
  },

  // ────────────────────────────────────────────
  // AI SCRIPT STUDIO
  // ────────────────────────────────────────────
  'ai-studio': {
    title: 'AI Script Studio',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="navTo('sg-dashboard')">🛠️ Script Generator</span> › AI Script Studio</div>
  <h1>⚡ AI Script Studio</h1>
  <p style="font-size:13px;color:var(--muted);margin-top:6px">Describe your requirement in plain English. The generator picks the best template and produces a complete, annotated PowerShell script.</p>
  <div class="callout callout-warn" style="margin-top:12px">
    <span>🔧</span>
    <span><b>Mock Mode</b> — Template-based generation. Output is labelled DRAFT. Review all &lt;PLACEHOLDER&gt; values before deploying.</span>
  </div>
</div>

<div class="content-body">
  <div class="section">
    <h2>📝 Your Requirement</h2>

    <div class="se-form-group">
      <label class="se-label">Plain-English requirement <span class="se-required">*</span></label>
      <textarea id="se-req" class="se-textarea" rows="3" placeholder="e.g. Ensure the WinRM service is running and set to Automatic startup on all managed devices…"></textarea>
      <div class="se-hint">Be specific about what you want to check, configure, or fix. Do not include tenant-specific details or passwords.</div>
    </div>

    <div class="se-form-row">
      <div class="se-form-group">
        <label class="se-label">Script domain</label>
        <select id="se-domain" class="se-select">
          <option value="intune">Intune / Endpoint Manager</option>
          <option value="windows">Windows administration</option>
          <option value="m365">Microsoft 365</option>
          <option value="network">Networking</option>
          <option value="registry">Registry</option>
          <option value="services">Windows services</option>
          <option value="files">Files and folders</option>
          <option value="eventlogs">Event logs</option>
          <option value="custom">Custom / other</option>
        </select>
      </div>
      <div class="se-form-group">
        <label class="se-label">Task type</label>
        <select id="se-task" class="se-select">
          <option value="detection">Detection (check a condition)</option>
          <option value="remediation">Remediation (fix an issue)</option>
          <option value="configuration">Configuration (apply settings)</option>
          <option value="inventory">Inventory (collect device data)</option>
          <option value="troubleshooting">Troubleshooting (diagnose)</option>
          <option value="reporting">Reporting (export data)</option>
          <option value="cleanup">Cleanup (remove/tidy)</option>
          <option value="automation">Automation (scheduled/bulk)</option>
        </select>
      </div>
    </div>

    <div class="se-form-row">
      <div class="se-form-group">
        <label class="se-label">Target OS</label>
        <select id="se-os" class="se-select">
          <option value="Windows 10 and later">Windows 10 / 11</option>
          <option value="Windows Server 2019/2022">Windows Server 2019/2022</option>
          <option value="Windows 10 and later / Server">Windows 10+ and Server</option>
        </select>
      </div>
      <div class="se-form-group">
        <label class="se-label">PowerShell version</label>
        <select id="se-psver" class="se-select">
          <option value="5.1">5.1 (built-in, Intune default)</option>
          <option value="7.x">7.x (requires installation)</option>
        </select>
      </div>
    </div>

    <div class="se-form-row">
      <div class="se-form-group">
        <label class="se-label">Execution context</label>
        <select id="se-context" class="se-select">
          <option value="SYSTEM">SYSTEM (full local admin)</option>
          <option value="User">Logged-on user context</option>
        </select>
      </div>
      <div class="se-form-group">
        <label class="se-label">Process context</label>
        <select id="se-bitness" class="se-select">
          <option value="64">64-bit (recommended)</option>
          <option value="32">32-bit (legacy / WOW64)</option>
        </select>
      </div>
    </div>

    <div class="se-form-row">
      <div class="se-form-group">
        <label class="se-label">Read-only (no device changes)?</label>
        <select id="se-readonly" class="se-select">
          <option value="no">No — script may change device state</option>
          <option value="yes">Yes — diagnostic / read-only only</option>
        </select>
      </div>
      <div class="se-form-group">
        <label class="se-label">Explanation level</label>
        <select id="se-explain" class="se-select">
          <option value="beginner">Beginner — plain-English explanations</option>
          <option value="advanced">Advanced — technical detail</option>
        </select>
      </div>
    </div>

    <div class="se-form-group">
      <label class="se-label">Desired output / success criteria <span style="font-size:11px;color:var(--muted)">(optional)</span></label>
      <textarea id="se-output" class="se-textarea" rows="2" placeholder="e.g. Exit 0 if service is running, exit 1 if it fails to start. Log to the IME log path."></textarea>
    </div>

    <div class="btn-row">
      <button id="se-gen-btn" class="btn btn-primary" onclick="seGenerateScript()">⚡ Generate Script</button>
      <button class="btn btn-outline" onclick="seReset()">↺ Reset</button>
    </div>
  </div>

  <!-- Results area (hidden until first generation) -->
  <div id="se-result" style="display:none;margin-top:16px"></div>

  <div id="se-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:500;align-items:center;justify-content:center;padding:16px;overflow-y:auto">
  </div>
</div>`,
  },

  // ────────────────────────────────────────────
  // INTUNE SCRIPT BUILDER (Workflow Selector)
  // ────────────────────────────────────────────
  'intune-builder': {
    title: 'Intune Script Builder',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="navTo('sg-dashboard')">🛠️ Script Generator</span> › Intune Script Builder</div>
  <h1>🏗️ Intune Script Builder</h1>
  <p style="font-size:13px;color:var(--muted);margin-top:6px">Choose the right workflow for your task. Each Intune deployment method has different requirements, exit codes, and portal paths.</p>
</div>

<div class="content-body">

  <div class="section" style="margin-bottom:16px">
    <h2>Which workflow do you need?</h2>
    <p style="font-size:13px;color:var(--muted);margin-bottom:16px">Select a workflow to see its requirements and generate a starter script.</p>

    <div class="module-grid">
      ${[
        { id: 'ib-remediations', icon: '🔍', title: 'Proactive Remediations', badge: 'Endpoint Analytics', desc: 'Paired detection + remediation scripts. Runs on a schedule. Automatically fixes detected issues. Requires Intune Plan 1+ or M365 E3/E5.', exitCodes: 'Detection: exit 0 = compliant, exit 1 = non-compliant. Remediation: exit 0 = success, exit 1 = failure.' },
        { id: 'ib-win32', icon: '📦', title: 'Win32 App Detection', badge: 'App Deployment', desc: 'Script-based detection rule for Win32 app (.intunewin). Determines if an app is already installed before running the install command.', exitCodes: 'exit 0 = app detected (do not install), exit 1 = not detected (run install).' },
        { id: 'ib-platform', icon: '📜', title: 'Platform Script', badge: 'Devices > Scripts', desc: 'Runs once per device. Good for one-time configuration tasks. Supports SYSTEM or user context. No compliance/exit-code semantics.', exitCodes: 'No compliance exit-code convention. Script runs once; re-run by updating the script in the portal.' },
        { id: 'ib-compliance', icon: '✅', title: 'Compliance Custom Script', badge: 'Compliance Policy', desc: 'Custom compliance script (requires Intune Plan 2 / M365 E5). Returns JSON with compliance values to compare against a custom compliance rule.', exitCodes: 'Exit 0 with JSON to stdout. Key-value pairs are evaluated against compliance settings.' },
        { id: 'ib-diagnostics', icon: '🩺', title: 'Device Diagnostic / Inventory', badge: 'Diagnostics', desc: 'Collect data from devices for reporting. Can run via Platform Scripts, Remediations (detection-only), or packaged as Win32.', exitCodes: 'Exit 0 = collection succeeded. Output captured via IME logs or written to a file.' },
        { id: 'ib-appinstall', icon: '⚙️', title: 'App Install / Uninstall Helper', badge: 'Win32 packaging', desc: 'Install or uninstall command script to wrap a complex installer. Used alongside IntuneWinAppUtil.exe packaging.', exitCodes: 'Map installer exit codes in the Win32 app Return codes table. 0 = success, 1707 = msiexec success.' },
      ].map(w => `
      <div class="module-card" onclick="ibSelect('${w.id}')">
        <div class="mc-level" style="color:var(--accent2)">${w.badge}</div>
        <h3>${w.icon} ${w.title}</h3>
        <p>${w.desc}</p>
        <div style="margin-top:10px;padding:8px;background:var(--surface);border-radius:6px;font-size:11px;color:var(--muted)">
          <b>Exit codes:</b> ${w.exitCodes}
        </div>
        <div class="mc-footer"><span style="color:var(--success)">Select →</span></div>
      </div>`).join('')}
    </div>
  </div>

  <div id="ib-detail" style="display:none"></div>
</div>`,
  },

  // ────────────────────────────────────────────
  // DETECTION & REMEDIATION BUILDER
  // ────────────────────────────────────────────
  'dr-builder': {
    title: 'Detection & Remediation Builder',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="navTo('sg-dashboard')">🛠️ Script Generator</span> › Detection &amp; Remediation Builder</div>
  <h1>🔍 Detection &amp; Remediation Builder</h1>
  <p style="font-size:13px;color:var(--muted);margin-top:6px">Generate a paired Detection script and Remediation script for Intune Proactive Remediations. Both scripts are produced together with matched logic.</p>
</div>

<div class="content-body">
  <div class="callout callout-info" style="margin-bottom:16px">
    <span>ℹ️</span>
    <span>
      <b>How Intune Remediations work:</b> Intune runs the Detection script first on each device at your scheduled frequency.
      If detection exits 1 (non-compliant), Intune automatically runs the Remediation script.
      If remediation exits 0, the device is marked <b>Remediated</b>. If exit 1, it is marked <b>Failed</b>.
    </span>
  </div>

  <div class="section">
    <h2>🎯 Define Your Requirement</h2>

    <div class="se-form-group">
      <label class="se-label">What condition do you want to detect and fix? <span class="se-required">*</span></label>
      <textarea id="dr-req" class="se-textarea" rows="3" placeholder="e.g. Ensure the WinRM service is running and set to Automatic startup…"></textarea>
    </div>

    <div class="se-form-row">
      <div class="se-form-group">
        <label class="se-label">Target OS</label>
        <select id="dr-os" class="se-select">
          <option value="Windows 10 and later">Windows 10 / 11</option>
          <option value="Windows Server 2019/2022">Windows Server 2019/2022</option>
        </select>
      </div>
      <div class="se-form-group">
        <label class="se-label">PowerShell version</label>
        <select id="dr-psver" class="se-select">
          <option value="5.1">5.1 (built-in — use this for Remediations)</option>
          <option value="7.x">7.x</option>
        </select>
      </div>
    </div>

    <div class="callout callout-tip" style="margin:14px 0">
      <span>💡</span>
      <span>Intune Remediations always run as <b>SYSTEM</b> in a <b>64-bit PowerShell</b> process (configurable per policy). Your scripts should not rely on the logged-on user context.</span>
    </div>

    <div class="btn-row">
      <button class="btn btn-primary" onclick="seDRGenerate()">⚡ Generate Both Scripts</button>
    </div>
  </div>

  <div id="dr-result" style="display:none;margin-top:16px"></div>

  <div class="section" style="margin-top:16px">
    <h2>📋 Remediation Portal Checklist</h2>
    <div class="steps">
      ${[
        ['Create a Remediation policy', 'Devices › Remediations (Endpoint Analytics) › Create policy.'],
        ['Upload the Detection script', 'In the <b>Detection script</b> tab, upload your detection .ps1 file.'],
        ['Upload the Remediation script', 'In the <b>Remediation script</b> tab, upload your remediation .ps1 file.'],
        ['Set Run script in 64-bit PowerShell', '<b>Yes</b> — always recommended unless you have a specific 32-bit requirement.'],
        ['Set Run using logged on credentials', '<b>No</b> for SYSTEM context (most common). <b>Yes</b> only if you need user context.'],
        ['Set scope tags and assignments', 'Assign to a pilot group first. Check Device status before expanding.'],
        ['Set the schedule', 'Choose how often to run detection. Common: once per day.'],
        ['Monitor results', 'Devices › Remediations › [policy name] › Device status. Look for: With issues, Failed, Remediated.'],
      ].map(([t, d]) => `<div class="step"><div class="step-content"><div class="step-title">${t}</div><div class="step-desc">${d}</div></div></div>`).join('')}
    </div>
  </div>
</div>`,
  },

  // ────────────────────────────────────────────
  // SCRIPT VALIDATOR
  // ────────────────────────────────────────────
  'validator': {
    title: 'Script Validator',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="navTo('sg-dashboard')">🛠️ Script Generator</span> › Script Validator</div>
  <h1>✅ Script Validator</h1>
  <p style="font-size:13px;color:var(--muted);margin-top:6px">Paste any PowerShell script to run static checks for common issues before deployment.</p>
</div>

<div class="content-body">
  <div class="callout callout-warn" style="margin-bottom:16px">
    <span>⚠️</span>
    <span>
      <b>Static analysis only.</b> No PowerShell runtime is available in the browser.
      Checks cannot parse AST or run PSScriptAnalyzer. A passing result here does <b>not</b> guarantee the script is safe or correct.
      Always test in a non-production environment first.
    </span>
  </div>

  <div class="section">
    <h2>📋 Validation Checks</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;margin-bottom:16px">
      ${[
        ['✅', 'Placeholder check', 'Detects unfilled &lt;PLACEHOLDER&gt; / &lt;REPLACE&gt; markers'],
        ['✅', 'Destructive commands', 'Flags Remove-Item, Format, IEX, and similar'],
        ['✅', 'Error handling', 'Checks for try/catch blocks'],
        ['✅', 'Exit codes', 'Validates exit 0/1 for Intune workflows'],
        ['✅', 'Script structure', '#Requires and .SYNOPSIS checks'],
        ['⏸', 'AST / Runtime', 'Not available — requires local PowerShell'],
        ['⏸', 'PSScriptAnalyzer', 'Not available — run locally with Invoke-ScriptAnalyzer'],
      ].map(([icon, name, desc]) => `
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:10px">
        <div style="font-size:16px;margin-bottom:4px">${icon}</div>
        <div style="font-weight:700;font-size:12px;margin-bottom:3px">${name}</div>
        <div style="font-size:11px;color:var(--muted);line-height:1.4">${desc}</div>
      </div>`).join('')}
    </div>

    <div class="se-form-group">
      <label class="se-label">Paste your PowerShell script</label>
      <textarea id="se-val-input" class="se-textarea se-code-input" rows="12" placeholder="# Paste your PowerShell script here…&#10;#Requires -Version 5.1&#10;&#10;try {&#10;    …&#10;} catch {&#10;    exit 1&#10;}"></textarea>
    </div>

    <div class="se-form-group">
      <label class="se-label">Workflow type <span style="font-size:11px;color:var(--muted)">(optional — improves exit-code check)</span></label>
      <select id="se-val-workflow" class="se-select" style="max-width:300px">
        <option value="">Unknown / general</option>
        <option value="intuneDetection">Intune Remediation — Detection</option>
        <option value="intuneRemediation">Intune Remediation — Remediation</option>
        <option value="win32Detection">Win32 App Detection</option>
        <option value="intuneScript">Intune Platform Script</option>
        <option value="general">General Windows script</option>
      </select>
    </div>

    <div class="btn-row">
      <button class="btn btn-primary" onclick="seValidateInput()">✅ Run Validation Checks</button>
      <button class="btn btn-outline" onclick="document.getElementById('se-val-input').value='';document.getElementById('se-val-result').style.display='none'">↺ Clear</button>
    </div>
  </div>

  <div id="se-val-result" style="display:none;margin-top:16px">
  </div>

  <div class="section" style="margin-top:16px">
    <h2>🔍 Run PSScriptAnalyzer Locally</h2>
    <p>For full static analysis including best-practice rules, install and run PSScriptAnalyzer in your local environment:</p>
    <div class="code-block"># Install once (as Administrator):
<span class="kw">Install-Module</span> -Name PSScriptAnalyzer -Force -AllowClobber

# Analyse your script:
<span class="kw">Invoke-ScriptAnalyzer</span> -Path .\YourScript.ps1

# With severity filter:
<span class="kw">Invoke-ScriptAnalyzer</span> -Path .\YourScript.ps1 -Severity Error,Warning</div>
  </div>
</div>`,
  },

  // ────────────────────────────────────────────
  // ERROR TROUBLESHOOTER
  // ────────────────────────────────────────────
  'troubleshooter': {
    title: 'Error Troubleshooter',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="navTo('sg-dashboard')">🛠️ Script Generator</span> › Error Troubleshooter</div>
  <h1>🔧 Error Troubleshooter</h1>
  <p style="font-size:13px;color:var(--muted);margin-top:6px">Paste an error code, Intune status, or relevant log excerpt to get a plain-English diagnosis and fix steps.</p>
</div>

<div class="content-body">
  <div class="callout callout-warn" style="margin-bottom:16px">
    <span>🔒</span>
    <span><b>Redact before pasting.</b> Remove personal data, device hostnames, email addresses, IP addresses, tokens, and passwords before pasting any log output.</span>
  </div>

  <div class="section">
    <h2>🔍 Paste Error or Log Excerpt</h2>
    <div class="se-form-group">
      <textarea id="ts-input" class="se-textarea se-code-input" rows="8" placeholder="e.g.&#10;0x87D300D9&#10;&#10;or paste a log line:&#10;[Error] App installation failed. Error code: 0x87D300D9&#10;&#10;or an Intune status:&#10;Script timed out&#10;Non-compliant (no policy)"></textarea>
    </div>
    <div class="btn-row">
      <button class="btn btn-primary" onclick="seTroubleshoot()">🔍 Diagnose</button>
      <button class="btn btn-outline" onclick="document.getElementById('ts-input').value='';document.getElementById('ts-result').style.display='none'">↺ Clear</button>
    </div>
  </div>

  <div id="ts-result" style="display:none;margin-top:16px"></div>

  <div class="section" style="margin-top:16px">
    <h2>📂 Quick Reference: Common Error Codes</h2>
    <div class="table-scroll"><table>
      <tr><th>Code</th><th>Meaning</th><th>Category</th></tr>
      ${TROUBLE_DB.map(e => `<tr>
        <td><span class="err-code">${seEscape(e.code)}</span></td>
        <td style="font-size:12px">${seEscape(e.title)}</td>
        <td><span class="se-tag">${e.cat}</span></td>
      </tr>`).join('')}
    </table></div>
    <p style="font-size:12px;color:var(--muted);margin-top:10px">
      For the complete Intune error code reference, see the
      <a href="https://learn.microsoft.com/en-us/mem/intune/apps/troubleshoot-app-install" target="_blank" rel="noopener" style="color:var(--accent2)">Microsoft Intune troubleshooting documentation</a>.
    </p>
  </div>

  <div class="section" style="margin-top:16px">
    <h2>🗂️ Where to Find Intune Logs</h2>
    <div class="table-scroll"><table>
      <tr><th>Log Location</th><th>What It Contains</th></tr>
      <tr><td><code>%ProgramData%\Microsoft\IntuneManagementExtension\Logs\</code></td><td>IME agent, scripts, Win32 apps, remediations</td></tr>
      <tr><td>Event Viewer › Apps and Services › Microsoft-Windows-DeviceManagement-Enterprise-Diagnostics-Provider</td><td>MDM enrollment, policy application, compliance</td></tr>
      <tr><td>Intune portal › Devices › [device] › Device diagnostic</td><td>On-demand diagnostic collection</td></tr>
      <tr><td>Intune portal › [Resource] › Device status</td><td>Per-device status for each app/script/policy</td></tr>
      <tr><td><code>C:\Windows\Temp\IntuneScriptLogs\</code></td><td>Alternative script output location (some versions)</td></tr>
    </table></div>
  </div>
</div>`,
  },

  // ────────────────────────────────────────────
  // SCRIPT LIBRARY
  // ────────────────────────────────────────────
  'script-library': {
    title: 'Script Library',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="navTo('sg-dashboard')">🛠️ Script Generator</span> › Script Library</div>
  <h1>📚 Script Library</h1>
  <p style="font-size:13px;color:var(--muted);margin-top:6px">Your saved scripts. All scripts are stored locally in your browser. They are not synced to any cloud service.</p>
</div>

<div class="content-body">
  <div class="callout callout-warn" style="margin-bottom:16px">
    <span>💾</span>
    <span><b>Browser storage only.</b> Scripts are saved in localStorage and may be lost if you clear browser data. Export important scripts as .ps1 files for safe keeping.</span>
  </div>

  <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:14px">
    <div style="position:relative;flex:1;min-width:200px">
      <input type="text" id="se-lib-search" class="errors-search" placeholder="🔍  Search scripts…" oninput="seLibFilter(this.value)" style="padding-left:14px">
    </div>
    <button class="btn btn-primary" onclick="navTo('ai-studio')">⚡ New Script</button>
  </div>

  <div class="errors-cats" id="se-lib-cats">
    <button class="err-cat-btn se-lib-cat-btn active" data-cat="all" onclick="seLibCat('all')">All</button>
    <button class="err-cat-btn se-lib-cat-btn" data-cat="intune" onclick="seLibCat('intune')">Intune</button>
    <button class="err-cat-btn se-lib-cat-btn" data-cat="windows" onclick="seLibCat('windows')">Windows</button>
    <button class="err-cat-btn se-lib-cat-btn" data-cat="registry" onclick="seLibCat('registry')">Registry</button>
    <button class="err-cat-btn se-lib-cat-btn" data-cat="services" onclick="seLibCat('services')">Services</button>
  </div>

  <div id="se-lib-list"></div>

  <div id="se-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:500;align-items:center;justify-content:center;padding:16px;overflow-y:auto"></div>
</div>

<script>
  // Render on load
  setTimeout(() => { SE_libraryFilter = ''; SE_libraryCat = 'all'; seRenderLibraryList(); }, 50);
</script>`,
  },

  // ────────────────────────────────────────────
  // PS LEARNING CENTER
  // ────────────────────────────────────────────
  'ps-learning': {
    title: 'PowerShell Learning Center',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="navTo('sg-dashboard')">🛠️ Script Generator</span> › Learning Center</div>
  <h1>📖 PowerShell & Intune Learning Center</h1>
  <p style="font-size:13px;color:var(--muted);margin-top:6px">Beginner-to-advanced lessons for writing PowerShell scripts used in Microsoft Intune environments.</p>
</div>

<div class="content-body">
  <div class="module-grid" style="margin-bottom:24px">
    ${[
      { key: 'ps-vars', icon: '📝', level: 'Beginner', title: 'Variables & Data Types', desc: 'Strings, integers, booleans, arrays, and hashtables. The building blocks of every script.' },
      { key: 'ps-flow', icon: '🔀', level: 'Beginner', title: 'Conditions & Loops', desc: 'if/else, foreach, while, switch — controlling the flow of your script.' },
      { key: 'ps-errors', icon: '🛡️', level: 'Intermediate', title: 'Error Handling', desc: 'try/catch/finally, $ErrorActionPreference, terminating vs non-terminating errors.' },
      { key: 'ps-registry', icon: '🔑', level: 'Intermediate', title: 'Registry Operations', desc: 'Reading and writing registry values safely. Backup before changing.' },
      { key: 'ps-context', icon: '👤', level: 'Intermediate', title: 'Intune Execution Context', desc: 'SYSTEM vs user context, 32-bit vs 64-bit, and how they affect your scripts.' },
      { key: 'ps-exitcodes', icon: '🚦', level: 'Intermediate', title: 'Exit Codes & Intune', desc: 'The exit-code conventions for Remediations, Win32 detection, and Platform Scripts.' },
      { key: 'ps-logging', icon: '📋', level: 'Advanced', title: 'Logging & Diagnostics', desc: 'Write structured logs to the IME log path. Use Start-Transcript. Read event logs.' },
      { key: 'ps-remediation', icon: '🔧', level: 'Advanced', title: 'Writing Remediations', desc: 'Idempotent scripts, detection/remediation pairing, verification patterns.' },
      { key: 'ps-winappdet', icon: '📦', level: 'Advanced', title: 'Win32 App Detection', desc: 'Registry-based and file-based detection, version comparison, multi-architecture.' },
    ].map(m => `
    <div class="module-card" onclick="navTo('${m.key}')">
      <div class="mc-level" style="color:${m.level === 'Beginner' ? 'var(--success)' : m.level === 'Intermediate' ? 'var(--warning)' : '#c07aff'}">${m.level}</div>
      <h3>${m.icon} ${m.title}</h3>
      <p>${m.desc}</p>
      <div class="mc-footer"><span id="mc-status-${m.key}" style="color:var(--muted)">Not started</span><span style="color:var(--accent2)">→</span></div>
    </div>`).join('')}
  </div>
</div>`,
  },

  // ────────────────────────────────────────────
  // PS VARIABLES LESSON
  // ────────────────────────────────────────────
  'ps-vars': {
    title: 'Variables & Data Types',
    level: 'Beginner',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="navTo('ps-learning')">📖 PS Learning</span> › Variables &amp; Data Types</div>
  <h1>📝 Variables &amp; Data Types</h1>
  <p class="meta-row"><span class="meta-chip">Beginner</span><span class="meta-chip">~10 min</span></p>
</div>
<div class="content-body">
  <div class="section">
    <h2>Variables</h2>
    <p>In PowerShell, every variable starts with a <b>$</b> sign. Variable names are not case-sensitive.</p>
    <div class="code-block"><span class="key">$name</span>    = <span class="str">'Contoso Laptop'</span>
<span class="key">$count</span>   = 42
<span class="key">$enabled</span> = <span class="kw">$true</span>
<span class="key">$nothing</span> = <span class="kw">$null</span>
</div>
    <h3>Common data types</h3>
    <div class="table-scroll"><table>
      <tr><th>Type</th><th>Example</th><th>Use in Intune scripts</th></tr>
      <tr><td>[string]</td><td>$name = 'WinRM'</td><td>Service names, registry paths, messages</td></tr>
      <tr><td>[int]</td><td>$count = 5</td><td>Counts, exit codes, numeric comparisons</td></tr>
      <tr><td>[bool]</td><td>$found = $true</td><td>Compliance flags, feature switches</td></tr>
      <tr><td>[array]</td><td>$paths = @('C:\\A', 'C:\\B')</td><td>Lists of paths, services, app names</td></tr>
      <tr><td>[hashtable]</td><td>$data = @{Name='X'; Value=1}</td><td>Structured data, registry entries</td></tr>
    </table></div>
    <h3>Automatic type coercion</h3>
    <p>PowerShell tries to convert types automatically. Force a type by casting: <code>[int]$str = '42'</code> gives you the number 42.</p>
    <div class="code-block"><span class="key">$build</span> = (Get-CimInstance Win32_OperatingSystem).BuildNumber
<span class="comment"># BuildNumber is a string like '19045'</span>
<span class="kw">if</span> ([int]<span class="key">$build</span> -ge 19045) {
    Write-Output <span class="str">'Windows 11 or Windows 10 22H2+'</span>
}
</div>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="markComplete('ps-vars');navTo('ps-flow')">Next: Conditions &amp; Loops →</button>
    <button class="btn btn-outline" onclick="markComplete('ps-vars')">✓ Mark Complete</button>
  </div>
</div>`,
  },

  // ────────────────────────────────────────────
  // PS FLOW CONTROL LESSON
  // ────────────────────────────────────────────
  'ps-flow': {
    title: 'Conditions & Loops',
    level: 'Beginner',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="navTo('ps-learning')">📖 PS Learning</span> › Conditions &amp; Loops</div>
  <h1>🔀 Conditions &amp; Loops</h1>
  <p class="meta-row"><span class="meta-chip">Beginner</span><span class="meta-chip">~12 min</span></p>
</div>
<div class="content-body">
  <div class="section">
    <h2>if / elseif / else</h2>
    <div class="code-block"><span class="kw">if</span> (<span class="key">$svc</span>.Status -eq <span class="str">'Running'</span>) {
    Write-Output <span class="str">'Service is running'</span>
} <span class="kw">elseif</span> (<span class="key">$svc</span>.Status -eq <span class="str">'Stopped'</span>) {
    Write-Output <span class="str">'Service is stopped'</span>
} <span class="kw">else</span> {
    Write-Output <span class="str">"Unexpected status: $($svc.Status)"</span>
}
</div>
    <h3>Common comparison operators</h3>
    <div class="table-scroll"><table>
      <tr><th>Operator</th><th>Meaning</th><th>Example</th></tr>
      <tr><td>-eq</td><td>Equal</td><td>$x -eq 'Running'</td></tr>
      <tr><td>-ne</td><td>Not equal</td><td>$x -ne 'Stopped'</td></tr>
      <tr><td>-gt / -lt</td><td>Greater / less than</td><td>$count -gt 0</td></tr>
      <tr><td>-ge / -le</td><td>Greater/less or equal</td><td>$build -ge 19041</td></tr>
      <tr><td>-like</td><td>Wildcard match</td><td>$name -like '*Chrome*'</td></tr>
      <tr><td>-match</td><td>Regex match</td><td>$ver -match '^\d+\.\d+'</td></tr>
      <tr><td>-and / -or</td><td>Logical operators</td><td>$a -eq 1 -and $b -eq 2</td></tr>
    </table></div>
    <h2>foreach loop</h2>
    <p>Iterate over a list — very common in inventory and app-detection scripts.</p>
    <div class="code-block"><span class="key">$services</span> = @(<span class="str">'WinRM'</span>, <span class="str">'Spooler'</span>, <span class="str">'W32Time'</span>)
<span class="kw">foreach</span> (<span class="key">$svcName</span> <span class="kw">in</span> <span class="key">$services</span>) {
    <span class="key">$s</span> = Get-Service -Name <span class="key">$svcName</span> -ErrorAction SilentlyContinue
    <span class="kw">if</span> (<span class="key">$s</span>) {
        Write-Output <span class="str">"$($s.DisplayName): $($s.Status)"</span>
    }
}
</div>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="markComplete('ps-flow');navTo('ps-errors')">Next: Error Handling →</button>
    <button class="btn btn-outline" onclick="markComplete('ps-flow')">✓ Mark Complete</button>
  </div>
</div>`,
  },

  // ────────────────────────────────────────────
  // PS ERROR HANDLING LESSON
  // ────────────────────────────────────────────
  'ps-errors': {
    title: 'Error Handling',
    level: 'Intermediate',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="navTo('ps-learning')">📖 PS Learning</span> › Error Handling</div>
  <h1>🛡️ Error Handling in PowerShell</h1>
  <p class="meta-row"><span class="meta-chip">Intermediate</span><span class="meta-chip">~15 min</span></p>
</div>
<div class="content-body">
  <div class="section">
    <h2>Terminating vs non-terminating errors</h2>
    <p>PowerShell has two kinds of errors. Most cmdlet errors are <b>non-terminating</b> — they write to the error stream but script execution continues. You must tell PowerShell to treat them as terminating to catch them.</p>
    <div class="code-block"><span class="comment"># Default: non-terminating error — script keeps running</span>
Get-Service -Name <span class="str">'DoesNotExist'</span>
Write-Output <span class="str">'This still runs'</span>

<span class="comment"># With -ErrorAction Stop: converts to terminating — catchable</span>
<span class="kw">try</span> {
    Get-Service -Name <span class="str">'DoesNotExist'</span> -ErrorAction Stop
} <span class="kw">catch</span> {
    Write-Output <span class="str">"Caught: $_"</span>
}
</div>
    <h2>$ErrorActionPreference</h2>
    <p>Setting this at the top of your script makes ALL cmdlet errors terminating by default — good practice for Intune scripts.</p>
    <div class="code-block"><span class="key">$ErrorActionPreference</span> = <span class="str">'Stop'</span>

<span class="kw">try</span> {
    <span class="key">$svc</span> = Get-Service -Name <span class="str">'&lt;SERVICE_NAME&gt;'</span>
    Start-Service -Name <span class="key">$svc</span>.Name
    Write-Output <span class="str">'Started successfully'</span>
    <span class="kw">exit</span> 0
} <span class="kw">catch</span> {
    Write-Error <span class="str">"Failed: $_"</span>
    <span class="kw">exit</span> 1
}
</div>
    <h2>Accessing the error in catch</h2>
    <div class="code-block"><span class="kw">catch</span> {
    <span class="key">$msg</span>  = <span class="key">$_</span>.Exception.Message
    <span class="key">$type</span> = <span class="key">$_</span>.Exception.GetType().Name
    Write-Output <span class="str">"Error type: $type"</span>
    Write-Output <span class="str">"Message: $msg"</span>
}
</div>
    <div class="callout callout-tip">
      <span>💡</span>
      <span>In Intune Remediation scripts, always end with <b>exit 0</b> for success and <b>exit 1</b> for failure inside the catch block. Missing exit codes can cause Intune to misreport the status.</span>
    </div>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="markComplete('ps-errors');navTo('ps-exitcodes')">Next: Exit Codes &amp; Intune →</button>
    <button class="btn btn-outline" onclick="markComplete('ps-errors')">✓ Mark Complete</button>
  </div>
</div>`,
  },

  // ────────────────────────────────────────────
  // INTUNE EXIT CODES LESSON
  // ────────────────────────────────────────────
  'ps-exitcodes': {
    title: 'Exit Codes & Intune Workflows',
    level: 'Intermediate',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="navTo('ps-learning')">📖 PS Learning</span> › Exit Codes &amp; Intune</div>
  <h1>🚦 Exit Codes &amp; Intune Workflows</h1>
  <p class="meta-row"><span class="meta-chip">Intermediate</span><span class="meta-chip">~10 min</span></p>
</div>
<div class="content-body">
  <div class="section">
    <h2>Why exit codes matter in Intune</h2>
    <p>Intune reads the process exit code (<code>$LASTEXITCODE</code> / <code>exit N</code>) to determine success, compliance, and whether to trigger a remediation. The meaning of each exit code differs by workflow.</p>
    <div class="callout callout-warn">
      <span>⚠️</span>
      <span>One of the most common mistakes is using the wrong exit-code convention for the workflow. A Remediation script that exits 1 is "failed" — not "non-compliant". Only detection scripts use 1 for non-compliant.</span>
    </div>
    <div class="table-scroll"><table>
      <tr><th>Workflow</th><th>Exit 0 means</th><th>Exit 1 means</th><th>Notes</th></tr>
      <tr><td>Remediation — Detection</td><td>✅ Compliant</td><td>❌ Non-compliant (run remediation)</td><td>Most critical to get right</td></tr>
      <tr><td>Remediation — Remediation</td><td>✅ Remediated</td><td>❌ Failed</td><td>Intune may retry on failure</td></tr>
      <tr><td>Win32 App — Detection</td><td>✅ App detected (don't install)</td><td>❌ Not detected (run install)</td><td>Write output to stdout too</td></tr>
      <tr><td>Platform Script</td><td>✅ Script ran</td><td>Script errored</td><td>No compliance semantics</td></tr>
      <tr><td>Win32 App — Install cmd</td><td>✅ Installed</td><td>❌ Failed</td><td>Map 1641/3010 as Soft reboot</td></tr>
    </table></div>
    <h2>Example: correct detection exit codes</h2>
    <div class="code-block"><span class="kw">try</span> {
    <span class="key">$svc</span> = Get-Service -Name <span class="str">'WinRM'</span> -ErrorAction Stop
    <span class="kw">if</span> (<span class="key">$svc</span>.Status -eq <span class="str">'Running'</span>) {
        Write-Output <span class="str">'COMPLIANT: WinRM is running'</span>
        <span class="kw">exit</span> 0   <span class="comment"># ← exit 0 = compliant = do NOT run remediation</span>
    } <span class="kw">else</span> {
        Write-Output <span class="str">"NON-COMPLIANT: WinRM is $($svc.Status)"</span>
        <span class="kw">exit</span> 1   <span class="comment"># ← exit 1 = non-compliant = RUN the remediation</span>
    }
} <span class="kw">catch</span> {
    Write-Output <span class="str">"ERROR: $_"</span>
    <span class="kw">exit</span> 1   <span class="comment"># ← unknown state — treat as non-compliant</span>
}
</div>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="markComplete('ps-exitcodes');navTo('ps-remediation')">Next: Writing Remediations →</button>
    <button class="btn btn-outline" onclick="markComplete('ps-exitcodes')">✓ Mark Complete</button>
  </div>
</div>`,
  },

  // ────────────────────────────────────────────
  // WRITING REMEDIATIONS LESSON
  // ────────────────────────────────────────────
  'ps-remediation': {
    title: 'Writing Intune Remediations',
    level: 'Advanced',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="navTo('ps-learning')">📖 PS Learning</span> › Writing Remediations</div>
  <h1>🔧 Writing Intune Remediations</h1>
  <p class="meta-row"><span class="meta-chip">Advanced</span><span class="meta-chip">~20 min</span></p>
</div>
<div class="content-body">
  <div class="section">
    <h2>Idempotent remediation design</h2>
    <p>An <b>idempotent</b> script produces the same result whether it runs once or ten times. This is critical for remediations because Intune may re-run them on schedule. Always check the current state before making a change.</p>
    <div class="code-block"><span class="comment"># ❌ Non-idempotent — appends data on every run</span>
Add-Content -Path <span class="str">'C:\\Config\\settings.txt'</span> -Value <span class="str">'setting=1'</span>

<span class="comment"># ✅ Idempotent — only changes if not already set</span>
<span class="key">$content</span> = Get-Content -Path <span class="str">'C:\\Config\\settings.txt'</span> -ErrorAction SilentlyContinue
<span class="kw">if</span> (<span class="key">$content</span> -notcontains <span class="str">'setting=1'</span>) {
    Add-Content -Path <span class="str">'C:\\Config\\settings.txt'</span> -Value <span class="str">'setting=1'</span>
}
</div>
    <h2>The detection / remediation pattern</h2>
    <div class="code-block"><span class="comment"># ── DETECTION SCRIPT ─────────────────────────────</span>
<span class="key">$value</span> = (Get-ItemProperty -Path <span class="str">'HKLM:\\...'</span> -EA SilentlyContinue).MySetting
<span class="kw">if</span> (<span class="key">$value</span> -eq 1) { Write-Output <span class="str">'COMPLIANT'</span>; <span class="kw">exit</span> 0 }
<span class="kw">else</span> { Write-Output <span class="str">'NON-COMPLIANT'</span>; <span class="kw">exit</span> 1 }

<span class="comment"># ── REMEDIATION SCRIPT ───────────────────────────</span>
<span class="kw">try</span> {
    Set-ItemProperty -Path <span class="str">'HKLM:\\...'</span> -Name <span class="str">'MySetting'</span> -Value 1 -Type DWord -Force
    <span class="comment"># ── RE-RUN DETECTION CHECK (verify) ──────────</span>
    <span class="key">$check</span> = (Get-ItemProperty -Path <span class="str">'HKLM:\\...'</span> -EA SilentlyContinue).MySetting
    <span class="kw">if</span> (<span class="key">$check</span> -eq 1) { Write-Output <span class="str">'Fixed'</span>; <span class="kw">exit</span> 0 }
    <span class="kw">else</span> { Write-Output <span class="str">'Verification failed'</span>; <span class="kw">exit</span> 1 }
} <span class="kw">catch</span> { Write-Error <span class="str">"$_"</span>; <span class="kw">exit</span> 1 }
</div>
    <div class="callout callout-tip">
      <span>💡</span>
      <span>Always re-run your detection check logic at the end of your remediation script to verify the fix worked. Return exit 0 only when verification confirms the device is now compliant.</span>
    </div>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="markComplete('ps-remediation');navTo('dr-builder')">Try the D&amp;R Builder →</button>
    <button class="btn btn-outline" onclick="markComplete('ps-remediation')">✓ Mark Complete</button>
  </div>
</div>`,
  },

  // ────────────────────────────────────────────
  // WIN32 APP DETECTION LESSON
  // ────────────────────────────────────────────
  'ps-winappdet': {
    title: 'Win32 App Detection Scripts',
    level: 'Advanced',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="navTo('ps-learning')">📖 PS Learning</span> › Win32 App Detection</div>
  <h1>📦 Win32 App Detection Scripts</h1>
  <p class="meta-row"><span class="meta-chip">Advanced</span><span class="meta-chip">~15 min</span></p>
</div>
<div class="content-body">
  <div class="section">
    <h2>Registry detection (most reliable)</h2>
    <div class="code-block"><span class="key">$appName</span>    = <span class="str">'Mozilla Firefox'</span>
<span class="key">$minVersion</span> = <span class="str">'120.0'</span>
<span class="key">$paths</span> = @(
    <span class="str">'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall'</span>,
    <span class="str">'HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall'</span>
)
<span class="kw">foreach</span> (<span class="key">$path</span> <span class="kw">in</span> <span class="key">$paths</span>) {
    Get-ChildItem -Path <span class="key">$path</span> -EA SilentlyContinue |
    <span class="kw">foreach</span> {
        <span class="key">$disp</span> = <span class="key">$_</span>.GetValue(<span class="str">'DisplayName'</span>)
        <span class="key">$ver</span>  = <span class="key">$_</span>.GetValue(<span class="str">'DisplayVersion'</span>)
        <span class="kw">if</span> (<span class="key">$disp</span> -like <span class="str">"*$appName*"</span> -and [version]<span class="key">$ver</span> -ge [version]<span class="key">$minVersion</span>) {
            Write-Output <span class="str">"DETECTED: $disp $ver"</span>
            <span class="kw">exit</span> 0
        }
    }
}
Write-Output <span class="str">'NOT DETECTED'</span>; <span class="kw">exit</span> 1
</div>
    <h2>File existence detection</h2>
    <div class="code-block"><span class="key">$path</span> = <span class="str">'C:\\Program Files\\MyApp\\MyApp.exe'</span>
<span class="kw">if</span> (Test-Path <span class="key">$path</span>) {
    Write-Output <span class="str">"DETECTED: $path exists"</span>; <span class="kw">exit</span> 0
} <span class="kw">else</span> {
    Write-Output <span class="str">'NOT DETECTED'</span>; <span class="kw">exit</span> 1
}
</div>
    <div class="callout callout-warn">
      <span>⚠️</span>
      <span>Win32 detection scripts run in the <b>32-bit</b> PowerShell process by default. If you're checking 64-bit registry paths, you must tick <b>"Run in 64-bit PowerShell on 64-bit clients"</b> in the Win32 app configuration.</span>
    </div>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="markComplete('ps-winappdet');navTo('ai-studio')">Try AI Studio →</button>
    <button class="btn btn-outline" onclick="markComplete('ps-winappdet')">✓ Mark Complete</button>
  </div>
</div>`,
  },

  // ────────────────────────────────────────────
  // REGISTRY LESSON
  // ────────────────────────────────────────────
  'ps-registry': {
    title: 'Registry Operations',
    level: 'Intermediate',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="navTo('ps-learning')">📖 PS Learning</span> › Registry Operations</div>
  <h1>🔑 Registry Operations in PowerShell</h1>
  <p class="meta-row"><span class="meta-chip">Intermediate</span><span class="meta-chip">~12 min</span></p>
</div>
<div class="content-body">
  <div class="section">
    <h2>Reading registry values</h2>
    <div class="code-block"><span class="comment"># Read a single value (returns $null if not found)</span>
<span class="key">$val</span> = (Get-ItemProperty -Path <span class="str">'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate'</span> -EA SilentlyContinue).DisableWindowsUpdateAccess
Write-Output <span class="str">"DisableWindowsUpdateAccess: $val"</span>

<span class="comment"># Check if a key exists</span>
<span class="kw">if</span> (Test-Path <span class="str">'HKLM:\\SOFTWARE\\MyApp'</span>) {
    Write-Output <span class="str">'Key exists'</span>
}
</div>
    <h2>Writing registry values</h2>
    <div class="callout callout-warn">
      <span>⚠️</span><span>Writing to the registry modifies device state. Always check the current value first (idempotent) and back up the key if the change is significant.</span>
    </div>
    <div class="code-block"><span class="key">$regPath</span>  = <span class="str">'HKLM:\\SOFTWARE\\MyCompany\\Settings'</span>
<span class="key">$regName</span>  = <span class="str">'FeatureEnabled'</span>
<span class="key">$regValue</span> = 1

<span class="comment"># Create key if missing, then set value</span>
<span class="kw">if</span> (-not (Test-Path <span class="key">$regPath</span>)) {
    New-Item -Path <span class="key">$regPath</span> -Force | Out-Null
}
Set-ItemProperty -Path <span class="key">$regPath</span> -Name <span class="key">$regName</span> -Value <span class="key">$regValue</span> -Type DWord -Force
Write-Output <span class="str">"Set $regName = $regValue"</span>
</div>
    <h2>Registry value types</h2>
    <div class="table-scroll"><table>
      <tr><th>-Type</th><th>Registry type</th><th>Example value</th></tr>
      <tr><td>DWord</td><td>REG_DWORD</td><td>1 (integer 0–4294967295)</td></tr>
      <tr><td>String</td><td>REG_SZ</td><td>'Hello'</td></tr>
      <tr><td>ExpandString</td><td>REG_EXPAND_SZ</td><td>'%SystemRoot%\\System32'</td></tr>
      <tr><td>MultiString</td><td>REG_MULTI_SZ</td><td>@('val1','val2')</td></tr>
      <tr><td>QWord</td><td>REG_QWORD</td><td>Large 64-bit number</td></tr>
      <tr><td>Binary</td><td>REG_BINARY</td><td>([byte[]]@(0x01,0x02))</td></tr>
    </table></div>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="markComplete('ps-registry');navTo('ps-context')">Next: Execution Context →</button>
    <button class="btn btn-outline" onclick="markComplete('ps-registry')">✓ Mark Complete</button>
  </div>
</div>`,
  },

  // ────────────────────────────────────────────
  // EXECUTION CONTEXT LESSON
  // ────────────────────────────────────────────
  'ps-context': {
    title: 'Intune Execution Context',
    level: 'Intermediate',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="navTo('ps-learning')">📖 PS Learning</span> › Execution Context</div>
  <h1>👤 Intune Execution Context</h1>
  <p class="meta-row"><span class="meta-chip">Intermediate</span><span class="meta-chip">~12 min</span></p>
</div>
<div class="content-body">
  <div class="section">
    <h2>SYSTEM vs User context</h2>
    <div class="table-scroll"><table>
      <tr><th>Context</th><th>Runs as</th><th>Registry hive</th><th>Best for</th></tr>
      <tr><td>SYSTEM</td><td>NT AUTHORITY\\SYSTEM</td><td>HKLM (machine-wide)</td><td>Service config, system settings, most Remediations</td></tr>
      <tr><td>User</td><td>Logged-on user</td><td>HKCU (per-user)</td><td>User profile settings, per-user app config</td></tr>
    </table></div>
    <div class="callout callout-warn" style="margin:14px 0">
      <span>⚠️</span>
      <span>Intune Remediations always run as <b>SYSTEM</b> (unless "Run using logged on credentials" is enabled). Win32 apps typically run as SYSTEM. Platform Scripts can run as either SYSTEM or user.</span>
    </div>
    <h2>32-bit vs 64-bit process</h2>
    <p>Intune scripts default to 32-bit (x86) PowerShell on 64-bit Windows. This has two important consequences:</p>
    <ul>
      <li><b>Registry:</b> 32-bit processes access <code>HKLM:\\SOFTWARE\\WOW6432Node\\</code> when reading <code>HKLM:\\SOFTWARE\\</code>. To access 64-bit registry paths, enable "Run script in 64-bit PowerShell" in the Intune policy.</li>
      <li><b>File system:</b> 32-bit processes access <code>%SystemRoot%\\SysWOW64\\</code> when using <code>%SystemRoot%\\System32\\</code> paths. Use <code>$env:SystemRoot\\SysNative\\</code> to access real System32 from a 32-bit process.</li>
    </ul>
    <div class="code-block"><span class="comment"># Check if running in 64-bit process</span>
<span class="kw">if</span> ([IntPtr]::Size -eq 8) {
    Write-Output <span class="str">'Running in 64-bit PowerShell'</span>
} <span class="kw">else</span> {
    Write-Output <span class="str">'Running in 32-bit PowerShell'</span>
}

<span class="comment"># Check identity</span>
Write-Output <span class="str">"Running as: $([Security.Principal.WindowsIdentity]::GetCurrent().Name)"</span>
</div>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="markComplete('ps-context');navTo('ps-logging')">Next: Logging &amp; Diagnostics →</button>
    <button class="btn btn-outline" onclick="markComplete('ps-context')">✓ Mark Complete</button>
  </div>
</div>`,
  },

  // ────────────────────────────────────────────
  // LOGGING LESSON
  // ────────────────────────────────────────────
  'ps-logging': {
    title: 'Logging & Diagnostics',
    level: 'Advanced',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="navTo('ps-learning')">📖 PS Learning</span> › Logging</div>
  <h1>📋 Logging &amp; Diagnostics in Intune Scripts</h1>
  <p class="meta-row"><span class="meta-chip">Advanced</span><span class="meta-chip">~15 min</span></p>
</div>
<div class="content-body">
  <div class="section">
    <h2>Standard IME log path</h2>
    <p>The Intune Management Extension logs are at <code>%ProgramData%\\Microsoft\\IntuneManagementExtension\\Logs\\</code>. Write your own script logs here so they're in a consistent location.</p>
    <div class="code-block"><span class="key">$LogPath</span> = <span class="str">"$env:ProgramData\\Microsoft\\IntuneManagementExtension\\Logs\\MyScript.log"</span>

<span class="kw">function</span> Write-Log {
    <span class="kw">param</span>([string]<span class="key">$Message</span>, [string]<span class="key">$Level</span> = <span class="str">'INFO'</span>)
    <span class="key">$ts</span> = Get-Date -Format <span class="str">'yyyy-MM-dd HH:mm:ss'</span>
    <span class="str">"$ts [$Level] $Message"</span> | Out-File -FilePath <span class="key">$LogPath</span> -Append -Encoding utf8 -EA SilentlyContinue
    Write-Output <span class="str">"$ts [$Level] $Message"</span>
}

Write-Log <span class="str">'Script started'</span>
Write-Log <span class="str">'Something went wrong'</span> -Level <span class="str">'ERROR'</span>
</div>
    <h2>Write-Output vs Write-Error vs Write-Host</h2>
    <div class="table-scroll"><table>
      <tr><th>Cmdlet</th><th>Stream</th><th>Captured by Intune?</th></tr>
      <tr><td>Write-Output</td><td>Success (stdout)</td><td>Yes — appears in Device Status</td></tr>
      <tr><td>Write-Host</td><td>Information stream</td><td>No — only local console</td></tr>
      <tr><td>Write-Error</td><td>Error stream</td><td>Partial — captured in IME logs</td></tr>
    </table></div>
    <div class="callout callout-tip" style="margin-top:12px">
      <span>💡</span>
      <span>For Intune Remediations: use <b>Write-Output</b> for status messages you want visible in the Intune portal Device Status view. The last line of Write-Output before exit is the message Intune captures.</span>
    </div>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="markComplete('ps-logging');navTo('ps-learning')">← Back to Learning Center</button>
    <button class="btn btn-outline" onclick="markComplete('ps-logging')">✓ Mark Complete</button>
  </div>
</div>`,
  },

  // ────────────────────────────────────────────
  // SETTINGS & SAFETY
  // ────────────────────────────────────────────
  'safety-settings': {
    title: 'Settings & Safety',
    render: () => `
<div class="content-header">
  <div class="breadcrumb"><span onclick="navTo('sg-dashboard')">🛠️ Script Generator</span> › Settings &amp; Safety</div>
  <h1>⚙️ Settings &amp; Safety</h1>
</div>

<div class="content-body">

  <div class="section" style="margin-bottom:16px">
    <h2>🔒 Safety Guarantees</h2>
    <p>This tool is designed with safety as the primary constraint. The following protections are built-in and cannot be disabled:</p>
    <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px">
      ${[
        ['🚫', 'No script auto-execution', 'Generated scripts are never executed automatically. You must manually copy and run them in your own environment.'],
        ['🚫', 'No Intune auto-deployment', 'Nothing is deployed to Microsoft Intune automatically. You upload scripts through the portal yourself.'],
        ['🚫', 'No tenant connection', 'This tool does not connect to Azure AD, Microsoft Graph API, or any Microsoft 365 tenant.'],
        ['🚫', 'No credential collection', 'No passwords, access tokens, client secrets, or API keys are entered, stored, or transmitted.'],
        ['🚫', 'No external API calls', 'This is a fully offline tool. No requests are made to any external AI or script-generation service.'],
        ['✅', 'DRAFT labelling', 'All generated scripts are clearly labelled DRAFT and MOCK. The status must be manually changed to Reviewed or Tested.'],
        ['✅', 'Risk analysis included', 'Every generated script includes a risk assessment and destructive-command detection.'],
        ['✅', 'Browser-local storage only', 'Saved scripts are stored only in your browser localStorage. Nothing is sent to any server.'],
      ].map(([icon, title, desc]) => `
      <div style="display:flex;gap:12px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:12px">
        <span style="font-size:18px;flex-shrink:0">${icon}</span>
        <div>
          <div style="font-weight:700;font-size:13px;margin-bottom:3px">${title}</div>
          <div style="font-size:12px;color:var(--muted);line-height:1.5">${desc}</div>
        </div>
      </div>`).join('')}
    </div>
  </div>

  <div class="section" style="margin-bottom:16px">
    <h2>📊 Script Status Definitions</h2>
    <div class="table-scroll"><table>
      <tr><th>Status</th><th>Meaning</th><th>Safe to deploy?</th></tr>
      <tr><td><span class="se-badge se-badge-draft">DRAFT</span></td><td>Generated or newly created. Not reviewed.</td><td>❌ No — review required</td></tr>
      <tr><td><span class="se-badge" style="background:#0a2a3a;color:var(--accent2);border:1px solid var(--accent2)">REVIEWED</span></td><td>Manually reviewed by a qualified engineer. Placeholders filled.</td><td>⚠️ Test first</td></tr>
      <tr><td><span class="se-badge" style="background:#0a2a0a;color:var(--success);border:1px solid var(--success)">TESTED</span></td><td>Tested on a non-production device with documented evidence.</td><td>✅ Pilot deploy only</td></tr>
    </table></div>
    <div class="callout callout-warn" style="margin-top:12px">
      <span>⚠️</span>
      <span>Never label a script <b>TESTED</b> unless you have actual test evidence — specific device, date, observed output, and exit code. MOCK-generated scripts that have not been tested must remain DRAFT.</span>
    </div>
  </div>

  <div class="section" style="margin-bottom:16px">
    <h2>🗃️ Script Library Storage</h2>
    <p>Scripts are stored in <code>localStorage</code> under the key <code>intuneScriptLib_v1</code>. This is browser-local and not encrypted.</p>
    <div class="callout callout-warn">
      <span>⚠️</span>
      <span>Do not store scripts containing passwords, API keys, client secrets, or personally identifiable information in the library. Browser localStorage is not a secure credential store.</span>
    </div>
    <div class="btn-row" style="margin-top:16px">
      <button class="btn btn-outline" onclick="ssClearLibrary()">🗑️ Clear Script Library</button>
      <button class="btn btn-outline" onclick="ssExportLibrary()">⬇ Export Library as JSON</button>
    </div>
    <p style="font-size:12px;color:var(--muted);margin-top:10px">Library contains <b id="ss-lib-count">${ScriptLibrary.count()}</b> script(s).</p>
  </div>

  <div class="section">
    <h2>ℹ️ About This Tool</h2>
    <div class="table-scroll"><table>
      <tr><th>Property</th><th>Value</th></tr>
      <tr><td>Mode</td><td>Mock / Template-based (no live AI)</td></tr>
      <tr><td>Templates</td><td>9 PowerShell workflow patterns</td></tr>
      <tr><td>Error database</td><td>9 common Intune / PowerShell errors</td></tr>
      <tr><td>Learning modules</td><td>9 PowerShell lessons</td></tr>
      <tr><td>Storage</td><td>Browser localStorage (offline, local)</td></tr>
      <tr><td>External requests</td><td>None</td></tr>
      <tr><td>API keys required</td><td>None</td></tr>
    </table></div>
  </div>

</div>`,
  },
};

// ────────────────────────────────────────────
// EXTEND THE MAIN PAGES OBJECT
// (PAGES is defined in content.js, loaded first)
// ────────────────────────────────────────────
Object.assign(PAGES, SCRIPT_PAGES);

// ────────────────────────────────────────────
// ADDITIONAL UI HELPERS
// ────────────────────────────────────────────
function seReset() {
  ['se-req','se-output'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  const r = document.getElementById('se-result');
  if (r) { r.style.display = 'none'; r.innerHTML = ''; }
  SE_currentScript = null;
}

function ibSelect(id) {
  const el = document.getElementById('ib-detail');
  if (!el) return;

  const configs = {
    'ib-remediations': { domain: 'intune', taskType: 'detection', label: 'Proactive Remediation Detection', hint: 'Exit 0 = Compliant. Exit 1 = Non-compliant.' },
    'ib-win32':        { domain: 'intune', taskType: 'detection', label: 'Win32 App Detection', hint: 'Exit 0 = App detected. Exit 1 = Not detected.' },
    'ib-platform':     { domain: 'intune', taskType: 'configuration', label: 'Platform Script (one-time)', hint: 'Runs once per device. No exit-code compliance semantics.' },
    'ib-compliance':   { domain: 'intune', taskType: 'reporting', label: 'Custom Compliance Script', hint: 'Exit 0 + JSON to stdout. Requires Intune Plan 2.' },
    'ib-diagnostics':  { domain: 'intune', taskType: 'inventory', label: 'Device Diagnostic / Inventory', hint: 'Read-only data collection.' },
    'ib-appinstall':   { domain: 'intune', taskType: 'configuration', label: 'App Install Helper', hint: 'Map installer exit codes in Win32 app Return codes.' },
  };
  const cfg = configs[id] || {};

  el.style.display = 'block';
  el.innerHTML = `
<div class="section">
  <h2>${cfg.label}</h2>
  <div class="callout callout-info" style="margin-bottom:14px"><span>ℹ️</span><span>${cfg.hint}</span></div>
  <div class="se-form-group">
    <label class="se-label">Describe your requirement</label>
    <textarea id="ib-req" class="se-textarea" rows="3" placeholder="e.g. Detect if ${cfg.label.toLowerCase()} is installed…"></textarea>
  </div>
  <div class="btn-row">
    <button class="btn btn-primary" onclick="ibGenerate('${id}','${cfg.domain}','${cfg.taskType}')">⚡ Generate Script</button>
  </div>
  <div id="ib-result" style="display:none;margin-top:16px"></div>
</div>`;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function ibGenerate(id, domain, taskType) {
  const req = (document.getElementById('ib-req') || {}).value || '';
  if (!req.trim()) { seShowNotice('Enter a requirement first.', 'warn'); return; }
  const result = ScriptGenerator.generate({ requirement: req, domain, taskType, psVersion: '5.1', context: 'SYSTEM', targetOS: 'Windows 10 and later', explanationLevel: 'beginner' });
  SE_currentScript = result;
  const el = document.getElementById('ib-result');
  if (!el) return;
  el.style.display = 'block';
  el.innerHTML = `
<div class="se-result-header">
  <span class="se-badge se-badge-draft">DRAFT</span>
  <span class="se-badge se-badge-mock" style="margin-left:8px">MOCK</span>
  <h3 style="margin-top:8px">${seEscape(result.title)}</h3>
</div>
<div class="se-code-toolbar">
  <button class="btn btn-outline se-btn-sm" onclick="seCopyCode()">📋 Copy</button>
  <button class="btn btn-outline se-btn-sm" onclick="seDownload()">⬇ .ps1</button>
  <button class="btn btn-primary se-btn-sm" onclick="seSaveToLibrary()">💾 Save</button>
</div>
<div class="code-block" style="max-height:400px;overflow-y:auto">${highlightPS(result.code)}</div>`;
}

function ssClearLibrary() {
  const count = ScriptLibrary.count();
  if (count === 0) { seShowNotice('Library is already empty.', 'ok'); return; }
  if (!confirm(`Delete all ${count} saved script(s)? This cannot be undone.`)) return;
  ScriptLibrary.save([]);
  seShowNotice(`Cleared ${count} script(s) from library.`, 'ok');
  const el = document.getElementById('ss-lib-count');
  if (el) el.textContent = '0';
}

function ssExportLibrary() {
  const data = ScriptLibrary.list();
  if (!data.length) { seShowNotice('Library is empty — nothing to export.', 'warn'); return; }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'intune-script-library-' + new Date().toISOString().slice(0, 10) + '.json';
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
}
