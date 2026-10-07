/* ==============================================================
   GRADEX - Modern Student Grade Calculator Engine
   JECRC Foundation • Internship Demonstration
   ============================================================== */

// State
let subjects = [
  { id: 1, name: "Python Programming", max: 100, pass: 40, marks: 96 },
  { id: 2, name: "Mathematics", max: 100, pass: 40, marks: 92 },
  { id: 3, name: "English", max: 100, pass: 40, marks: 88 },
  { id: 4, name: "Physics", max: 100, pass: 40, marks: 91 },
  { id: 5, name: "Computer Science", max: 100, pass: 40, marks: 95 }
];

let records = JSON.parse(localStorage.getItem("gradex_records") || "[]");

// Python Code string for display in Tab 4
const PYTHON_CODE_SAMPLE = `#!/usr/bin/env python3
"""
==============================================================
  GRADEX | Student Grade Calculator using Python
  Internship Project - JECRC Foundation
==============================================================
  Pipeline: Input (Marks) -> Calculation -> Grade -> Result
"""

SUBJECTS = ["Python Programming", "Mathematics", "English", "Physics", "Computer Science"]
MAX_MARKS = 100
PASS_MARKS = 40

def calculate(marks):
    total = sum(marks.values())
    maximum = MAX_MARKS * len(marks)
    percentage = (total / maximum) * 100
    gpa = round(percentage / 9.5, 2)
    return total, maximum, percentage, gpa

def determine_grade(percentage):
    if percentage >= 90:
        return "A+", "Outstanding (Distinction)"
    elif percentage >= 80:
        return "A", "Excellent (First Class)"
    elif percentage >= 70:
        return "B", "Very Good"
    elif percentage >= 60:
        return "C", "Good"
    elif percentage >= 50:
        return "D", "Satisfactory"
    elif percentage >= 40:
        return "E", "Needs Improvement"
    else:
        return "F", "Fail"

def check_pass(marks):
    failed = [sub for sub, score in marks.items() if score < PASS_MARKS]
    return len(failed) == 0, failed

# Execution Pipeline
if __name__ == "__main__":
    marks = {"Python Programming": 96.0, "Mathematics": 92.0, ...}
    total, maximum, pct, gpa = calculate(marks)
    grade, remark = determine_grade(pct)
    passed, backlogs = check_pass(marks)
    if not passed:
        grade, remark = "F", "Fail (Backlog in subjects)"
    print(f"Result: {pct:.2f}% | Grade: {grade} | Status: {'PASS' if passed else 'FAIL'}")
`;

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initTheme();
  initFullscreen();
  renderSubjects();
  recalculate();
  renderLeaderboard();
  initPresets();
  initStudentInfoListeners();

  const codeEl = document.getElementById("python-code-display");
  if (codeEl) {
    codeEl.textContent = PYTHON_CODE_SAMPLE;
  }
});

// Toast notification helper
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 2600);
}

// Tabs System
function initTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.style.display = "none");

      btn.classList.add("active");
      const targetId = btn.getAttribute("data-tab");
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.style.display = "block";

      if (targetId === "tab-leaderboard") {
        renderLeaderboard();
      }
    });
  });
}

// Theme Toggle
function initTheme() {
  const btn = document.getElementById("theme-toggle");
  const current = localStorage.getItem("gradex_theme") || "light";
  if (current === "dark") {
    document.body.setAttribute("data-theme", "dark");
  }

  btn.addEventListener("click", () => {
    const isDark = document.body.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.body.removeAttribute("data-theme");
      localStorage.setItem("gradex_theme", "light");
    } else {
      document.body.setAttribute("data-theme", "dark");
      localStorage.setItem("gradex_theme", "dark");
    }
  });
}

// Fullscreen for Presentations
function initFullscreen() {
  const btn = document.getElementById("fullscreen-btn");
  btn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });
}

// Render Subjects in Form
function renderSubjects() {
  const container = document.getElementById("subjects-container");
  container.innerHTML = "";

  subjects.forEach(sub => {
    const item = document.createElement("div");
    const isFail = sub.marks < sub.pass;
    const isDist = sub.marks >= 75;
    item.className = `subject-item ${isFail ? 'fail' : ''} ${isDist ? 'distinction' : ''}`;

    let statusText = "Pass";
    let statusClass = "pass";
    if (isFail) {
      statusText = `Fail (<${sub.pass})`;
      statusClass = "fail";
    } else if (isDist) {
      statusText = "Distinction";
      statusClass = "pass";
    }

    item.innerHTML = `
      <div class="subject-name-col">
        <span class="sub-title">${sub.name}</span>
        <span class="sub-status ${statusClass}">${statusText}</span>
      </div>
      <div class="subject-slider-col">
        <input type="range" min="0" max="${sub.max}" step="1" value="${sub.marks}" class="slider-input" data-id="${sub.id}">
      </div>
      <div class="subject-val-col">
        <input type="number" min="0" max="${sub.max}" step="0.5" value="${sub.marks}" class="input-number" data-id="${sub.id}">
      </div>
      <div>
        ${subjects.length > 1 ? `<button class="btn-del-sub" data-id="${sub.id}" title="Remove Subject">✕</button>` : ''}
      </div>
    `;

    container.appendChild(item);
  });

  // Attach dynamic event listeners
  container.querySelectorAll(".slider-input").forEach(slider => {
    slider.addEventListener("input", (e) => {
      const id = parseInt(e.target.dataset.id);
      const val = parseFloat(e.target.value) || 0;
      updateSubjectMarks(id, val);
    });
  });

  container.querySelectorAll(".input-number").forEach(input => {
    input.addEventListener("input", (e) => {
      const id = parseInt(e.target.dataset.id);
      let val = parseFloat(e.target.value);
      if (isNaN(val)) val = 0;
      if (val > 100) val = 100;
      if (val < 0) val = 0;
      updateSubjectMarks(id, val);
    });
  });

  container.querySelectorAll(".btn-del-sub").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.currentTarget.dataset.id);
      subjects = subjects.filter(s => s.id !== id);
      renderSubjects();
      recalculate();
    });
  });
}

function updateSubjectMarks(id, value) {
  const target = subjects.find(s => s.id === id);
  if (target) {
    target.marks = value;
    // Update sibling inputs without full redraw for fluid 60fps sliders
    const slider = document.querySelector(`.slider-input[data-id="${id}"]`);
    const numInput = document.querySelector(`.input-number[data-id="${id}"]`);
    if (slider && slider.value != value) slider.value = value;
    if (numInput && numInput.value != value) numInput.value = value;

    // Update individual row styling
    const item = slider ? slider.closest(".subject-item") : null;
    if (item) {
      item.classList.toggle("fail", value < target.pass);
      item.classList.toggle("distinction", value >= 75);
      const statusSpan = item.querySelector(".sub-status");
      if (statusSpan) {
        if (value < target.pass) {
          statusSpan.textContent = `Fail (<${target.pass})`;
          statusSpan.className = "sub-status fail";
        } else if (value >= 75) {
          statusSpan.textContent = "Distinction";
          statusSpan.className = "sub-status pass";
        } else {
          statusSpan.textContent = "Pass";
          statusSpan.className = "sub-status pass";
        }
      }
    }

    recalculate();
  }
}

// Add Custom Subject
document.getElementById("btn-add-subject").addEventListener("click", () => {
  const input = document.getElementById("new-subject-name");
  const name = input.value.trim();
  if (!name) {
    showToast("Please enter a subject name.");
    return;
  }
  const nextId = subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1;
  subjects.push({ id: nextId, name: name, max: 100, pass: 40, marks: 80 });
  input.value = "";
  renderSubjects();
  recalculate();
  showToast(`Added subject: ${name}`);
});

// Calculate and evaluate
function recalculate() {
  const totalMarks = subjects.reduce((acc, s) => acc + s.marks, 0);
  const maxTotal = subjects.reduce((acc, s) => acc + s.max, 0);
  const percentage = maxTotal > 0 ? (totalMarks / maxTotal) * 100 : 0;
  const gpa = maxTotal > 0 ? Math.min(10, percentage / 9.5) : 0;

  // Check Failures in any subject
  const failedSubs = subjects.filter(s => s.marks < s.pass);
  const isAllPassed = failedSubs.length === 0;

  // Grade Determination
  let grade = "F";
  let remark = "Fail";
  let gradeColor = "var(--danger)";

  if (percentage >= 90) {
    grade = "A+"; remark = "Outstanding (Distinction)"; gradeColor = "var(--success)";
  } else if (percentage >= 80) {
    grade = "A"; remark = "Excellent (First Class)"; gradeColor = "var(--success)";
  } else if (percentage >= 70) {
    grade = "B"; remark = "Very Good"; gradeColor = "var(--info)";
  } else if (percentage >= 60) {
    grade = "C"; remark = "Good"; gradeColor = "var(--info)";
  } else if (percentage >= 50) {
    grade = "D"; remark = "Satisfactory"; gradeColor = "var(--warning)";
  } else if (percentage >= 40) {
    grade = "E"; remark = "Needs Improvement"; gradeColor = "var(--warning)";
  } else {
    grade = "F"; remark = "Fail"; gradeColor = "var(--danger)";
  }

  // Override Grade if any subject failed (Backlog condition)
  if (!isAllPassed) {
    grade = "F";
    remark = `Fail (Backlog in ${failedSubs.length} subject${failedSubs.length > 1 ? 's' : ''})`;
    gradeColor = "var(--danger)";
  }

  // Update Step 2 Metrics
  document.getElementById("stat-total").textContent = `${totalMarks.toFixed(1)} / ${maxTotal}`;
  document.getElementById("stat-percentage").textContent = `${percentage.toFixed(2)}%`;
  document.getElementById("stat-gpa").textContent = `${gpa.toFixed(2)} / 10.0`;

  // Highlight Grade Matrix Row
  document.querySelectorAll(".grade-row").forEach(row => {
    row.classList.remove("active", "fail");
    if (row.getAttribute("data-grade") === grade) {
      row.classList.add("active");
      if (grade === "F") row.classList.add("fail");
    }
  });

  // Update Pass/Fail Alert Box
  const callout = document.getElementById("rule-callout-box");
  const calloutIcon = document.getElementById("rule-icon");
  const calloutMsg = document.getElementById("rule-msg");

  if (isAllPassed) {
    callout.className = "rule-callout success";
    calloutIcon.textContent = "✔";
    calloutMsg.innerHTML = `<strong>Subject Pass Criteria Satisfied:</strong> All subjects meet the minimum threshold of 40 marks. Grade evaluated as <strong>${grade}</strong>.`;
  } else {
    callout.className = "rule-callout fail";
    calloutIcon.textContent = "⚠️";
    const subNames = failedSubs.map(s => `${s.name} (${s.marks}/${s.pass})`).join(", ");
    calloutMsg.innerHTML = `<strong>Subject Backlog Detected:</strong> Marks under 40 in: <em>${subNames}</em>. Final result is marked as <strong>FAIL (Grade F)</strong> regardless of overall percentage.`;
  }

  // Update Report Card (Step 4)
  updateReportCard(totalMarks, maxTotal, percentage, grade, remark, isAllPassed, failedSubs);

  // Update Stepper Pipeline Status
  updateStepper(totalMarks > 0);
}

function updateReportCard(total, max, pct, grade, remark, isAllPassed, failedSubs) {
  const name = document.getElementById("student-name").value.trim() || "Student";
  const roll = document.getElementById("student-roll").value.trim() || "N/A";
  const branch = document.getElementById("student-branch").value.trim() || "Engineering";

  document.getElementById("rep-name").textContent = name;
  document.getElementById("rep-roll").textContent = roll;
  document.getElementById("rep-branch").textContent = branch;
  document.getElementById("rep-date").textContent = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  // Table rows
  const tbody = document.getElementById("rep-marks-tbody");
  tbody.innerHTML = "";
  subjects.forEach((sub, i) => {
    const isPass = sub.marks >= sub.pass;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${sub.name}</td>
      <td>${sub.max}</td>
      <td><strong>${sub.marks}</strong></td>
      <td style="color:${isPass ? 'var(--success)' : 'var(--danger)'}; font-weight:700;">
        ${isPass ? 'PASS' : 'FAIL'}
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Summary box
  document.getElementById("rep-total").textContent = `${total.toFixed(1)} / ${max}`;
  document.getElementById("rep-pct").textContent = `${pct.toFixed(2)}%`;
  
  const gradeEl = document.getElementById("rep-grade");
  gradeEl.textContent = grade;
  gradeEl.style.color = grade === "F" ? "var(--danger)" : "var(--success)";

  document.getElementById("rep-remark").textContent = remark;

  const statusEl = document.getElementById("rep-status");
  statusEl.textContent = isAllPassed ? "PASS ✔" : "FAIL ✖";
  statusEl.style.color = isAllPassed ? "var(--success)" : "var(--danger)";

  const backlogBox = document.getElementById("rep-backlog-warning");
  if (!isAllPassed) {
    backlogBox.style.display = "block";
    document.getElementById("rep-backlog-list").textContent = failedSubs.map(s => s.name).join(", ");
  } else {
    backlogBox.style.display = "none";
  }
}

function updateStepper(hasData) {
  const s1 = document.getElementById("step-1-indicator");
  const s2 = document.getElementById("step-2-indicator");
  const s3 = document.getElementById("step-3-indicator");
  const s4 = document.getElementById("step-4-indicator");

  if (hasData) {
    s1.className = "pipeline-step completed";
    s2.className = "pipeline-step completed";
    s3.className = "pipeline-step completed";
    s4.className = "pipeline-step active";
  } else {
    s1.className = "pipeline-step active";
    s2.className = "pipeline-step";
    s3.className = "pipeline-step";
    s4.className = "pipeline-step";
  }
}

function initStudentInfoListeners() {
  ["student-name", "student-roll", "student-branch"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", recalculate);
  });
}

// Preset Buttons for Smooth Presentation Demos
function initPresets() {
  document.getElementById("preset-topper").addEventListener("click", () => {
    document.getElementById("student-name").value = "Aarav Sharma";
    document.getElementById("student-roll").value = "21JECRC042";
    subjects = [
      { id: 1, name: "Python Programming", max: 100, pass: 40, marks: 96 },
      { id: 2, name: "Mathematics", max: 100, pass: 40, marks: 92 },
      { id: 3, name: "English", max: 100, pass: 40, marks: 88 },
      { id: 4, name: "Physics", max: 100, pass: 40, marks: 91 },
      { id: 5, name: "Computer Science", max: 100, pass: 40, marks: 95 }
    ];
    renderSubjects();
    recalculate();
    showToast("Loaded Preset: ⭐ Distinction Topper (92.4%)");
  });

  document.getElementById("preset-average").addEventListener("click", () => {
    document.getElementById("student-name").value = "Priya Verma";
    document.getElementById("student-roll").value = "21JECRC118";
    subjects = [
      { id: 1, name: "Python Programming", max: 100, pass: 40, marks: 74 },
      { id: 2, name: "Mathematics", max: 100, pass: 40, marks: 68 },
      { id: 3, name: "English", max: 100, pass: 40, marks: 72 },
      { id: 4, name: "Physics", max: 100, pass: 40, marks: 65 },
      { id: 5, name: "Computer Science", max: 100, pass: 40, marks: 75 }
    ];
    renderSubjects();
    recalculate();
    showToast("Loaded Preset: 📘 First Class (70.8%)");
  });

  document.getElementById("preset-fail").addEventListener("click", () => {
    document.getElementById("student-name").value = "Rohan Gupta";
    document.getElementById("student-roll").value = "21JECRC089";
    subjects = [
      { id: 1, name: "Python Programming", max: 100, pass: 40, marks: 88 },
      { id: 2, name: "Mathematics", max: 100, pass: 40, marks: 32 }, // BACKLOG!
      { id: 3, name: "English", max: 100, pass: 40, marks: 78 },
      { id: 4, name: "Physics", max: 100, pass: 40, marks: 70 },
      { id: 5, name: "Computer Science", max: 100, pass: 40, marks: 82 }
    ];
    renderSubjects();
    recalculate();
    showToast("Loaded Preset: ⚠️ Edge-Case Fail (32 in Math)");
  });

  document.getElementById("preset-reset").addEventListener("click", () => {
    document.getElementById("student-name").value = "";
    document.getElementById("student-roll").value = "";
    subjects.forEach(s => s.marks = 0);
    renderSubjects();
    recalculate();
    showToast("Cleared inputs.");
  });
}

// Print / PDF
document.getElementById("btn-print-report").addEventListener("click", () => {
  window.print();
});

// CSV Export for Current Student
document.getElementById("btn-export-csv").addEventListener("click", () => {
  const name = document.getElementById("student-name").value.trim() || "Student";
  const roll = document.getElementById("student-roll").value.trim() || "N/A";
  const total = subjects.reduce((a, s) => a + s.marks, 0);
  const max = subjects.reduce((a, s) => a + s.max, 0);
  const pct = (total / max) * 100;
  const passed = subjects.every(s => s.marks >= s.pass);
  const grade = document.getElementById("rep-grade").textContent;

  const headers = ["Student Name", "Roll Number", ...subjects.map(s => s.name), "Total", "Max", "Percentage", "Grade", "Status"];
  const values = [name, roll, ...subjects.map(s => s.marks), total, max, pct.toFixed(2), grade, passed ? "PASS" : "FAIL"];

  const csvContent = "data:text/csv;charset=utf-8," + [
    headers.map(escapeCsv).join(","),
    values.map(escapeCsv).join(",")
  ].join("\n");

  downloadFile(csvContent, `report_${roll || 'student'}.csv`);
  showToast("Downloaded Student CSV Report!");
});

// Leaderboard and Records Management
document.getElementById("btn-save-record").addEventListener("click", () => {
  const name = document.getElementById("student-name").value.trim() || "Student";
  const roll = document.getElementById("student-roll").value.trim() || "N/A";
  const total = subjects.reduce((a, s) => a + s.marks, 0);
  const max = subjects.reduce((a, s) => a + s.max, 0);
  const pct = (total / max) * 100;
  const passed = subjects.every(s => s.marks >= s.pass);
  const grade = document.getElementById("rep-grade").textContent;

  // Check if roll already exists, update or push
  const existingIdx = records.findIndex(r => r.roll === roll);
  const record = {
    name, roll, total, max,
    percentage: pct,
    grade,
    status: passed ? "PASS" : "FAIL",
    date: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    records[existingIdx] = record;
    showToast(`Updated record for ${name} (${roll})`);
  } else {
    records.push(record);
    showToast(`Saved ${name} to session leaderboard!`);
  }

  localStorage.setItem("gradex_records", JSON.stringify(records));
  renderLeaderboard();
});

function renderLeaderboard() {
  const tbody = document.getElementById("leaderboard-tbody");
  const countBadge = document.getElementById("record-count-badge");
  countBadge.textContent = records.length;

  document.getElementById("lead-total-count").textContent = records.length;

  if (records.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:24px; color:var(--text-muted);">
          No student records saved yet. Evaluate a student in the Calculator tab and click "Save to Leaderboard"!
        </td>
      </tr>
    `;
    document.getElementById("lead-class-avg").textContent = "0.0%";
    document.getElementById("lead-pass-rate").textContent = "0.0%";
    return;
  }

  // Sort descending by percentage
  const sorted = [...records].sort((a, b) => b.percentage - a.percentage);

  // Compute KPIs
  const avg = sorted.reduce((acc, r) => acc + r.percentage, 0) / sorted.length;
  const passCount = sorted.filter(r => r.status === "PASS").length;
  const passRate = (passCount / sorted.length) * 100;

  document.getElementById("lead-class-avg").textContent = `${avg.toFixed(1)}%`;
  document.getElementById("lead-pass-rate").textContent = `${passRate.toFixed(1)}%`;

  tbody.innerHTML = "";
  const medals = ["🥇", "🥈", "🥉"];

  sorted.forEach((r, idx) => {
    const tr = document.createElement("tr");
    const medal = medals[idx] || (idx + 1);
    tr.innerHTML = `
      <td style="font-weight:800; font-size:1.1rem;">${medal}</td>
      <td><strong>${r.name}</strong></td>
      <td><code>${r.roll}</code></td>
      <td>${r.total} / ${r.max}</td>
      <td><strong>${r.percentage.toFixed(2)}%</strong></td>
      <td><span class="grade-badge ${r.grade === 'A+' ? 'a-plus' : r.grade.toLowerCase()}">${r.grade}</span></td>
      <td style="font-weight:700; color:${r.status === 'PASS' ? 'var(--success)' : 'var(--danger)'};">${r.status}</td>
      <td>
        <button class="btn-del-record" data-roll="${r.roll}" style="background:none; border:none; color:var(--danger); cursor:pointer; font-size:0.8rem;">✕ Remove</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll(".btn-del-record").forEach(b => {
    b.addEventListener("click", (e) => {
      const roll = e.currentTarget.dataset.roll;
      records = records.filter(r => r.roll !== roll);
      localStorage.setItem("gradex_records", JSON.stringify(records));
      renderLeaderboard();
      showToast("Removed record.");
    });
  });
}

// Load Demo Class
document.getElementById("btn-load-sample-class").addEventListener("click", () => {
  records = [
    { name: "Aarav Sharma", roll: "21JECRC042", total: 462, max: 500, percentage: 92.4, grade: "A+", status: "PASS" },
    { name: "Diya Patel", roll: "21JECRC019", total: 425, max: 500, percentage: 85.0, grade: "A", status: "PASS" },
    { name: "Priya Verma", roll: "21JECRC118", total: 354, max: 500, percentage: 70.8, grade: "B", status: "PASS" },
    { name: "Kabir Singh", roll: "21JECRC055", total: 295, max: 500, percentage: 59.0, grade: "D", status: "PASS" },
    { name: "Rohan Gupta", roll: "21JECRC089", total: 341, max: 500, percentage: 68.2, grade: "F", status: "FAIL" }
  ];
  localStorage.setItem("gradex_records", JSON.stringify(records));
  renderLeaderboard();
  showToast("Loaded 5 demonstration students into leaderboard!");
});

// Clear Leaderboard
document.getElementById("btn-clear-leaderboard").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all session records?")) {
    records = [];
    localStorage.removeItem("gradex_records");
    renderLeaderboard();
    showToast("Cleared all session records.");
  }
});

// Export Class CSV
document.getElementById("btn-export-all-csv").addEventListener("click", () => {
  if (records.length === 0) {
    showToast("No records to export.");
    return;
  }
  const headers = ["Rank", "Student Name", "Roll Number", "Total Marks", "Max Marks", "Percentage", "Grade", "Status"];
  const sorted = [...records].sort((a, b) => b.percentage - a.percentage);
  const rows = sorted.map((r, i) => [
    i + 1, r.name, r.roll, r.total, r.max, r.percentage.toFixed(2), r.grade, r.status
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [
    headers.map(escapeCsv).join(","),
    ...rows.map(row => row.map(escapeCsv).join(","))
  ].join("\n");

  downloadFile(csvContent, `jecrc_class_grade_sheet.csv`);
  showToast("Downloaded consolidated class CSV!");
});

// CSV Helper
function escapeCsv(val) {
  const str = String(val === undefined || val === null ? "" : val);
  if (str.includes(",") || str.includes("\"") || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadFile(uri, filename) {
  const encodedUri = encodeURI(uri);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
