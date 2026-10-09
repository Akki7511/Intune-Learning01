// ============================================================
// QUIZ DATA
// ============================================================

const QUIZZES = {

  'quiz-beginner': {
    title: 'Beginner Assessment',
    level: 'Beginner',
    questions: [
      {
        q: 'What is the difference between MDM and MAM in Microsoft Intune?',
        options: [
          'MDM manages devices fully; MAM manages only applications',
          'MDM is for mobile phones; MAM is for desktops',
          'MDM requires Azure AD P2; MAM requires P1',
          'MDM and MAM are the same thing with different names',
        ],
        answer: 0,
        explain: 'MDM (Mobile Device Management) gives Intune full control over the entire device, enabling remote wipe, policy enforcement, and encryption. MAM (Mobile Application Management) manages only specific apps and the data within them — without enrolling the device itself. MAM is ideal for BYOD scenarios.'
      },
      {
        q: 'A device with no compliance policy assigned is marked as _____ by default in Intune.',
        options: [
          'Non-compliant',
          'Compliant',
          'Unknown',
          'Pending',
        ],
        answer: 1,
        explain: 'By default, Intune marks devices with no compliance policy as Compliant. This is a security risk. Best practice is to change this in Tenant Administration → Device Compliance Settings to mark them as Non-compliant. This ensures all devices must explicitly have a compliance policy assigned.'
      },
      {
        q: 'Which command collects the hardware hash from a Windows device for Autopilot registration?',
        options: [
          'Get-IntuneDeviceHash',
          'Export-AutopilotDevice',
          'Get-WindowsAutoPilotInfo',
          'New-AutopilotEnrollment',
        ],
        answer: 2,
        explain: 'Get-WindowsAutoPilotInfo is a PowerShell script/module that retrieves the hardware hash (also called hardware ID) from a Windows device. You run it with -OutputFile to save to CSV, then upload that CSV to Intune for Autopilot registration.'
      },
      {
        q: 'Which file format does Intune require for Win32 app deployment?',
        options: [
          '.appx',
          '.msix',
          '.intunewin',
          '.exe wrapped in .zip',
        ],
        answer: 2,
        explain: 'Win32 apps must be packaged as .intunewin files using the Microsoft Win32 Content Prep Tool (IntuneWinAppUtil.exe). This tool wraps your source installer into an encrypted .intunewin package that Intune can distribute, extract, and install on devices.'
      },
      {
        q: 'What does the Enrollment Status Page (ESP) do in Windows Autopilot?',
        options: [
          'Shows the Azure AD sign-in page',
          'Blocks device use until required apps and policies are installed',
          'Displays device compliance status to the end user',
          'Redirects users to the Company Portal',
        ],
        answer: 1,
        explain: 'The Enrollment Status Page (ESP) shows users the progress of device provisioning during Autopilot. Critically, it can block users from accessing the desktop until required apps and configuration profiles have been successfully installed — ensuring the device is fully configured before the user gets to it.'
      },
    ]
  },

  'quiz-intermediate': {
    title: 'Intermediate Assessment',
    level: 'Intermediate',
    questions: [
      {
        q: 'Which Azure AD license is the minimum requirement to use Conditional Access policies?',
        options: [
          'Azure AD Free',
          'Azure AD Premium P1',
          'Azure AD Premium P2',
          'Microsoft 365 Business Basic',
        ],
        answer: 1,
        explain: 'Conditional Access requires at minimum Azure AD Premium P1. This is included in Microsoft 365 E3, EMS E3, Microsoft 365 Business Premium, and Azure AD P1 standalone. Risk-based Conditional Access (using Identity Protection) requires Azure AD Premium P2.'
      },
      {
        q: 'You want to create a Conditional Access policy that blocks access for users outside the UK without disrupting existing users. What should you do FIRST?',
        options: [
          'Enable the policy in On mode immediately',
          'Enable the policy in Report-only mode and review Sign-in logs first',
          'Test the policy with a dummy account in a separate tenant',
          'Apply the policy to a test group and set it to On',
        ],
        answer: 1,
        explain: 'Always deploy Conditional Access policies in Report-only mode first. This logs what would have happened without blocking any access. Review the Sign-in logs (Azure AD → Monitoring → Sign-in logs → Conditional Access tab) to understand the impact. Only then switch to On mode, ideally during a maintenance window.'
      },
      {
        q: 'In Windows Autopilot, which Dynamic Azure AD group rule captures ALL Autopilot-registered devices?',
        options: [
          '(device.deviceOwnership -eq "Company")',
          '(device.devicePhysicalIds -any _ -contains "[ZTDId]")',
          '(device.managementType -eq "MDM")',
          '(device.enrollmentProfileName -startsWith "Autopilot")',
        ],
        answer: 1,
        explain: 'The ZTDId (Zero Touch Deployment ID) is added to a device\'s physical IDs when it is registered in Windows Autopilot. The rule "(device.devicePhysicalIds -any _ -contains "[ZTDId]")" creates a dynamic Azure AD group that automatically includes all devices registered in Autopilot, regardless of which profile they are assigned to.'
      },
      {
        q: 'What is the primary difference between a Configuration Profile and a Compliance Policy in Intune?',
        options: [
          'Configuration Profiles are for Windows only; Compliance Policies support all platforms',
          'Compliance Policies actively push settings to devices; Configuration Profiles only report',
          'Configuration Profiles push settings to devices; Compliance Policies check if settings are met',
          'They are interchangeable and produce the same result',
        ],
        answer: 2,
        explain: 'Configuration Profiles actively configure device settings — they push settings to the device. Compliance Policies evaluate whether a device meets defined rules and report the compliance state. Compliance state is consumed by Conditional Access to allow or block access. A non-compliant device doesn\'t automatically get reconfigured — it gets blocked from resources until the user fixes the issue.'
      },
      {
        q: 'Which report in Intune would you check to identify which specific settings are causing devices to fail compliance?',
        options: [
          'Device Configuration → Assignment Status',
          'Devices → Compliance → Policy compliance',
          'Reports → Endpoint Analytics → Startup Performance',
          'Reports → Windows Updates → Feature Update Report',
        ],
        answer: 1,
        explain: 'Under Devices → Compliance, the per-policy compliance view shows you which devices are compliant/non-compliant for each policy. Drilling into a non-compliant device shows exactly which settings are failing (e.g., "BitLocker: Not compliant" or "OS version: Not compliant"). This is your primary troubleshooting view for compliance issues.'
      },
    ]
  },

  'quiz-advanced': {
    title: 'Advanced Assessment',
    level: 'Advanced',
    questions: [
      {
        q: 'In Intune Co-management, what is a "workload" and how does it work?',
        options: [
          'A workload is a scheduled task that runs during device enrollment',
          'A workload is a category of management (compliance, config, apps) that is controlled by either ConfigMgr or Intune, not both',
          'A workload is the device\'s CPU/memory usage reported to Intune',
          'A workload is a collection of PowerShell scripts deployed to devices',
        ],
        answer: 1,
        explain: 'In Co-management, workloads divide management responsibilities between ConfigMgr and Intune. Each workload (e.g., Compliance Policies, Device Configuration, Resource Access, Endpoint Protection) has a slider with three positions: ConfigMgr only, Pilot Intune (moves a specific collection to Intune), or Intune (all devices). Only one system manages each workload at a time — there\'s no simultaneous management of the same setting.'
      },
      {
        q: 'A Proactive Remediation detection script should exit with code ___ when the device is healthy (no remediation needed).',
        options: [
          'Exit 1',
          'Exit 0',
          'Exit 2',
          'Return $true',
        ],
        answer: 1,
        explain: 'Proactive Remediation detection scripts use exit codes to communicate health status. Exit 0 = device is healthy, no remediation needed. Exit 1 = issue detected, trigger remediation script. Any other exit code is treated as an error. The remediation script only runs when the detection script exits with code 1.'
      },
      {
        q: 'When deploying a Security Baseline to production, what is the recommended first step?',
        options: [
          'Deploy directly to All Devices for maximum security coverage',
          'Enable the baseline only in Audit mode first',
          'Deploy to a pilot group (5-10% of devices) and monitor for 2 weeks',
          'Disable all existing configuration profiles before applying the baseline',
        ],
        answer: 2,
        explain: 'Security Baselines contain hundreds of settings. Deploying directly to All Devices can break workflows — a setting like "require complex password" might lock out shared kiosk devices, or "block removable storage" might break legitimate business processes. Always pilot with a representative 5-10% sample first. Monitor for issues in the Baseline compliance report and check for user complaints before broad rollout.'
      },
      {
        q: 'What does MAM-WE (MAM Without Enrollment) allow IT admins to do on a personal device?',
        options: [
          'Fully wipe and reimage the personal device remotely',
          'Read all files and messages stored on the device',
          'Protect corporate data within managed apps without enrolling the device in MDM',
          'Install MDM profiles silently without user consent',
        ],
        answer: 2,
        explain: 'MAM Without Enrollment (MAM-WE) allows IT to apply App Protection Policies to corporate apps (like Outlook, Teams, OneDrive) on personal devices WITHOUT requiring MDM enrollment. IT can only perform selective wipe (removing corporate app data only) — they cannot see personal data, access other apps, or perform a full device wipe. This protects user privacy while securing corporate data.'
      },
      {
        q: 'In a Settings Catalog profile, what is the correct approach for a setting you want to "enable" that is described as "Turn off [feature]"?',
        options: [
          'Set it to Enabled',
          'Set it to Disabled (because disabling "turn off" means the feature stays on)',
          'Do not configure it and rely on default OS behaviour',
          'Set it to Not configured',
        ],
        answer: 1,
        explain: 'This is a common source of confusion. Policy settings are often phrased as "Turn off X" or "Disable Y". To KEEP the feature ON, you set "Turn off X" to Disabled — because you are disabling the policy that would turn it off. Always read policy descriptions carefully. The Settings Catalog shows the policy name literally from the underlying CSP/GPO, which may be double-negated.'
      },
    ]
  },

  'quiz-expert': {
    title: 'Expert Certification Assessment',
    level: 'Expert',
    questions: [
      {
        q: 'Which Microsoft Graph API permission allows you to trigger remote actions (like device sync or wipe) on managed devices?',
        options: [
          'DeviceManagement.Read.All',
          'DeviceManagement.ReadWrite.All',
          'DeviceManagementManagedDevices.PrivilegedOperations.All',
          'DeviceManagementConfiguration.ReadWrite.All',
        ],
        answer: 2,
        explain: 'DeviceManagementManagedDevices.PrivilegedOperations.All is required for privileged remote actions: device wipe, retire, sync, remote lock, reset passcode, and reboot. DeviceManagement.ReadWrite.All covers CRUD operations on policies and configurations but does NOT cover these privileged device actions. Always follow least privilege — only grant PrivilegedOperations when actually needed.'
      },
      {
        q: 'In a Zero Trust architecture, a device with a high Defender for Endpoint risk score should trigger which Intune behaviour?',
        options: [
          'The device is flagged in reports but access is not restricted',
          'Intune compliance integrates with Defender\'s risk score — a high risk score marks the device non-compliant, which Conditional Access then uses to block access',
          'Defender automatically wipes the device via Intune',
          'The user receives an email notification but can continue working',
        ],
        answer: 1,
        explain: 'The Zero Trust "assume breach" integration works as follows: (1) Defender for Endpoint detects a threat and assigns a risk score (Low/Medium/High/Critical). (2) This risk score is surfaced to Intune compliance. (3) The Intune compliance policy requires Defender risk score ≤ Medium (for example). (4) A device with High risk score fails compliance. (5) Conditional Access policy "require compliant device" then blocks that device from accessing M365. This creates an automatic security response loop without manual intervention.'
      },
      {
        q: 'What is "Tenant Attach" in the context of Microsoft Endpoint Manager, and how does it differ from Co-management?',
        options: [
          'Tenant Attach and Co-management are identical features with different names',
          'Tenant Attach uploads ConfigMgr device inventory to Intune for visibility and remote actions, without moving management workloads; Co-management allows moving management workloads between ConfigMgr and Intune',
          'Tenant Attach requires Intune licenses for all devices; Co-management does not',
          'Tenant Attach is only for Azure-hosted devices; Co-management supports on-prem devices',
        ],
        answer: 1,
        explain: 'Tenant Attach is a lightweight integration: it uploads device inventory from ConfigMgr to the Intune admin center, giving you a unified device view and enabling remote actions (restart, script execution, CMPivot) from the cloud — without changing how devices are managed. Co-management goes further: it enables workload sharing, where specific management responsibilities (compliance policies, device config, endpoint protection) can be gradually shifted from ConfigMgr to Intune. Tenant Attach is often step 1 in a cloud-migration journey, with Co-management as step 2.'
      },
      {
        q: 'When building an Intune GitOps pipeline, what must you remove from a policy JSON before using it to CREATE a new policy via Graph API?',
        options: [
          'The "displayName" field',
          'The "@odata.type" field',
          'The "id" field',
          'The "createdDateTime" and "lastModifiedDateTime" fields',
        ],
        answer: 2,
        explain: 'When exporting a policy from Intune via Graph API, the JSON includes an "id" field (the GUID of that specific policy instance). If you POST this JSON to create a new policy, the id must be removed — Intune generates a new GUID automatically. Leaving the existing id causes a conflict error or unexpected update behaviour. The @odata.type, displayName, and metadata fields should be kept. Also remove createdDateTime and lastModifiedDateTime for cleanliness, though they are typically ignored by the API on POST.'
      },
      {
        q: 'Which Microsoft Tunnel component must be deployed in your on-premises network (or Azure VNet) to support per-app VPN for mobile devices?',
        options: [
          'Intune Connector for Active Directory',
          'Microsoft Tunnel Gateway (Linux Docker container)',
          'Azure Application Proxy',
          'Network Policy Server (NPS)',
        ],
        answer: 1,
        explain: 'Microsoft Tunnel Gateway is a VPN gateway that runs as a Docker container on a Linux server in your on-premises network or an Azure VNet. It acts as the endpoint for per-app VPN connections from iOS and Android devices managed by Intune. The Intune admin console provides the management plane (server configuration, site setup, connection monitoring), while the Linux Docker container handles the actual tunnelling traffic to your on-prem resources.'
      },
    ]
  },

};

// ============================================================
// QUIZ RENDERING ENGINE
// ============================================================

function renderQuiz(quizId) {
  const quiz = QUIZZES[quizId];
  if (!quiz) return '<p>Quiz not found.</p>';

  const levelBadge = {
    Beginner: 'badge-beginner',
    Intermediate: 'badge-intermediate',
    Advanced: 'badge-advanced',
    Expert: 'badge-expert',
  }[quiz.level] || '';

  let qs = quiz.questions.map((q, i) => `
    <div class="quiz-card" id="quiz-q-${quizId}-${i}">
      <div class="quiz-q">Question ${i+1} of ${quiz.questions.length}: ${q.q}</div>
      <div class="quiz-options">
        ${q.options.map((opt, j) => `
          <div class="quiz-opt" id="qopt-${quizId}-${i}-${j}" onclick="selectAnswer('${quizId}',${i},${j})">
            <span class="opt-letter">${'ABCD'[j]}</span>${opt}
          </div>
        `).join('')}
      </div>
      <div class="quiz-explain" id="quiz-explain-${quizId}-${i}">${q.explain}</div>
    </div>
  `).join('');

  return `
<div class="content-header">
  <div class="breadcrumb"><span onclick="showPage('dashboard')">🏠 Home</span> › <span class="level-badge ${levelBadge}">${quiz.level}</span></div>
  <h1>${quiz.title}</h1>
  <div class="meta-row">
    <span class="meta-chip">${quiz.questions.length} Questions</span>
    <span class="meta-chip ${levelBadge}">${quiz.level}</span>
  </div>
</div>
<div id="quiz-section">
  <div class="callout callout-info"><span>📝</span><div>Select the best answer for each question. You'll see an explanation after answering each one.</div></div>
  ${qs}
  <div class="btn-row">
    <button class="btn btn-primary" id="quiz-submit-${quizId}" onclick="submitQuiz('${quizId}')" style="display:none">Submit Quiz</button>
    <div id="quiz-result-${quizId}" style="display:none"></div>
  </div>
</div>`;
}

// Track quiz state
const quizState = {};

function selectAnswer(quizId, qIdx, optIdx) {
  if (!quizState[quizId]) quizState[quizId] = {};
  if (quizState[quizId][qIdx] !== undefined) return; // already answered

  quizState[quizId][qIdx] = optIdx;

  const quiz = QUIZZES[quizId];
  const correct = quiz.questions[qIdx].answer;

  for (let j = 0; j < quiz.questions[qIdx].options.length; j++) {
    const el = document.getElementById(`qopt-${quizId}-${qIdx}-${j}`);
    if (el) {
      if (j === correct) el.classList.add('correct');
      else if (j === optIdx && j !== correct) el.classList.add('wrong');
    }
  }

  const explain = document.getElementById(`quiz-explain-${quizId}-${qIdx}`);
  if (explain) explain.classList.add('show');

  // show submit if all answered
  const allAnswered = Object.keys(quizState[quizId]).length === quiz.questions.length;
  if (allAnswered) {
    document.getElementById(`quiz-submit-${quizId}`).style.display = 'inline-flex';
  }
}

function submitQuiz(quizId) {
  const quiz = QUIZZES[quizId];
  const state = quizState[quizId] || {};
  let correct = 0;
  quiz.questions.forEach((q, i) => { if (state[i] === q.answer) correct++; });
  const pct = Math.round((correct / quiz.questions.length) * 100);
  const passed = pct >= 70;

  const resultEl = document.getElementById(`quiz-result-${quizId}`);
  resultEl.style.display = 'block';
  resultEl.innerHTML = `
    <div class="callout ${passed ? 'callout-tip' : 'callout-warn'}">
      <span>${passed ? '🎉' : '📖'}</span>
      <div>
        <strong>${passed ? 'Passed!' : 'Not yet — keep studying'}</strong><br>
        Score: ${correct}/${quiz.questions.length} (${pct}%)<br>
        ${passed ? 'Great work! Move on to the next level.' : 'Review the explanations above and retry when ready.'}
      </div>
    </div>`;

  document.getElementById(`quiz-submit-${quizId}`).style.display = 'none';

  if (passed) {
    markComplete(quizId);
    // update quiz pass count
    const qPasses = parseInt(localStorage.getItem('intuneQuizPasses') || '0') + 1;
    localStorage.setItem('intuneQuizPasses', qPasses);
    updateDashboardStats();
  }
}
