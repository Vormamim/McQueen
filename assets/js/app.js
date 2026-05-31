/* ── Helpers ─────────────────────────────────────────────── */

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function codeBlock(code) {
  return `
    <div class="code-wrapper">
      <button class="copy-btn">Copy</button>
      <pre class="language-python"><code class="language-python">${esc(code)}</code></pre>
    </div>`;
}

function editableTable(table) {
  const heads = table.headers.map(h => `<th>${h}</th>`).join('');
  const rows = table.rows.map(row => {
    const cells = row.map((cell, i) => {
      if (i === 0) return `<td>${cell}</td>`;
      return `<td class="editable" contenteditable="true" data-placeholder="type here…"></td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
  return `
    <div class="experiment-table-wrapper">
      <p class="experiment-note">Use your notebook to record results — this page does not save anything.</p>
      <table class="ui celled compact small table">
        <thead><tr>${heads}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function bulletList(items) {
  const lis = items.map(i => `<li>${i}</li>`).join('');
  return `<ul class="ui list" style="margin:0.5rem 0 0.5rem 1rem">${lis}</ul>`;
}

function hintMsg(text) {
  return `<div class="ui yellow message"><i class="lightbulb icon"></i> ${text}</div>`;
}

function challengeMsg(text) {
  return `<div class="ui orange message challenge-block"><i class="star icon"></i> <strong>Challenge:</strong> ${text}</div>`;
}

function infoMsg(text) {
  return `<div class="ui blue message"><i class="info circle icon"></i> ${text}</div>`;
}

function warningMsg(text) {
  return `<div class="ui red message"><i class="exclamation triangle icon"></i> ${text}</div>`;
}

function hardwareBadges(hw) {
  return hw.map(h => `<div class="ui tiny label"><i class="wrench icon"></i>${h}</div>`).join(' ');
}

function renderTask(task, index) {
  let html = `<div class="task-step">`;
  html += `<div class="task-step-title">
    <span class="task-num">${index + 1}</span>
    ${task.title}
  </div>`;
  if (task.description) html += `<p>${task.description}</p>`;
  if (task.code)        html += codeBlock(task.code);
  if (task.bullets)     html += bulletList(task.bullets);
  if (task.table)       html += editableTable(task.table);
  if (task.note)        html += `<div class="ui message"><i class="info circle icon"></i>${task.note}</div>`;
  if (task.hint)        html += hintMsg(task.hint);
  html += `</div>`;
  return html;
}

function keyQuestionsAccordion(questions) {
  if (!questions || questions.length === 0) return '';
  const items = questions.map(q => `
    <div class="title"><i class="dropdown icon"></i>${q}</div>
    <div class="content"><p><em>Discuss with your class or write your answer in your notebook.</em></p></div>
  `).join('');
  return `
    <div class="section-block key-questions">
      <h2>Key Questions</h2>
      <div class="ui accordion">${items}</div>
    </div>`;
}

function lessonNavFooter(lesson) {
  const prev = lesson.number > 1
    ? `<a class="ui left labeled icon button" href="#lesson-${lesson.number - 1}">
         <i class="left arrow icon"></i> Lesson ${lesson.number - 1}
       </a>`
    : `<div></div>`;

  const isLast = lesson.number === LESSONS.length;
  const next = isLast
    ? `<a class="ui right labeled icon primary button" href="#extension">
         Extension <i class="right arrow icon"></i>
       </a>`
    : `<a class="ui right labeled icon primary button" href="#lesson-${lesson.number + 1}">
         Lesson ${lesson.number + 1} <i class="right arrow icon"></i>
       </a>`;

  return `<div class="lesson-nav-footer">${prev}${next}</div>`;
}

/* ── Page renderers ──────────────────────────────────────── */

function renderHome() {
  const cards = LESSONS.map(l => `
    <a class="lesson-card" href="#${l.id}">
      <div class="card-number">Lesson ${l.number} · ${l.time} min</div>
      <h3>${l.title}</h3>
      <div class="card-topic">${l.topic}</div>
      <div class="card-meta">${l.hardware.slice(0, 2).join(' · ')}</div>
    </a>
  `).join('');

  const extensionCard = `
    <a class="lesson-card" href="#extension">
      <div class="card-number">Extension · 45 min</div>
      <h3>Data Logging</h3>
      <div class="card-topic">Data persistence, CSV, file systems</div>
      <div class="card-meta">micro:bit V1 or V2</div>
    </a>`;

  const hwRows = HARDWARE.map(r =>
    `<tr>
      <td>${r.component}</td>
      <td><span class="pin-badge">${r.pin}</span></td>
      <td>${r.notes}</td>
    </tr>`
  ).join('');

  const currRows = CURRICULUM.map(r =>
    `<tr><td>${r.lesson}</td><td>${r.concepts}</td></tr>`
  ).join('');

  return `
    <div class="course-hero">
      <h1><i class="microchip icon"></i> Maqueen Robotics — Unit 5</h1>
      <div class="subtitle">DFRobot Maqueen v4.1 · micro:bit V1 &amp; V2 · MicroPython · Stage 4 (Year 7 / 8)</div>
      <p>This unit builds toward a single goal: drive a robot along a wall, detect a gap, turn into it, and drive through — with increasing reliability across nine lessons.</p>
      <div style="margin-top:0.8rem">
        <a class="ui primary button" href="#lesson-1"><i class="play icon"></i> Start Lesson 1</a>
        <a class="ui button" href="#hardware"><i class="microchip icon"></i> Hardware Reference</a>
        <a class="ui button" href="#base-code"><i class="code icon"></i> Base Code</a>
      </div>
    </div>

    <div class="lesson-cards">${cards}${extensionCard}</div>

    <div class="section-block">
      <h2>Curriculum Links</h2>
      <table class="ui celled compact small table curriculum-table">
        <thead><tr><th>Lesson</th><th>Computing concepts</th></tr></thead>
        <tbody>${currRows}</tbody>
      </table>
    </div>

    <div class="section-block">
      <h2>Hardware Quick Reference</h2>
      <table class="ui celled compact small table">
        <thead><tr><th>Component</th><th>Pin</th><th>Notes</th></tr></thead>
        <tbody>${hwRows}</tbody>
      </table>
      ${warningMsg('Always keep <code>i2c.init(freq=100000, sda=pin20, scl=pin19)</code> in your code even when not using motors — it is required for the ultrasonic sensor pins to work correctly.')}
    </div>`;
}

function renderHardware() {
  const rows = HARDWARE.map(r =>
    `<tr>
      <td><strong>${r.component}</strong></td>
      <td><span class="pin-badge">${r.pin}</span></td>
      <td>${r.notes}</td>
    </tr>`
  ).join('');

  return `
    <div class="lesson-header">
      <h1><i class="microchip icon"></i> Hardware Reference</h1>
      <p>DFRobot Maqueen v4.1 · micro:bit V1 &amp; V2</p>
    </div>

    <div class="section-block">
      <table class="ui celled table">
        <thead>
          <tr><th>Component</th><th>Pin</th><th>Notes</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      ${warningMsg('Always keep <code>i2c.init(freq=100000, sda=pin20, scl=pin19)</code> in your code even when not using motors — it is required for the ultrasonic sensor pins to work correctly.')}
      ${infoMsg('Servo S1 and S2 share pins P1/P2 with the ultrasonic sensor. Do not use both at the same time.')}
    </div>

    <div class="section-block">
      <h2>Motor Direction Values</h2>
      <table class="ui celled compact small table">
        <thead><tr><th>direction argument</th><th>Motor behaviour</th></tr></thead>
        <tbody>
          <tr><td><code>0</code></td><td>Forward</td></tr>
          <tr><td><code>1</code></td><td>Backward</td></tr>
        </tbody>
      </table>
    </div>

    <div class="section-block">
      <h2>Ultrasonic Sensor Notes</h2>
      <ul class="ui list" style="margin-left:1rem">
        <li>Returns approximately <strong>0</strong> when an obstacle is touching or very close</li>
        <li>Returns approximately <strong>210</strong> or higher when no obstacle is within range</li>
        <li>Maximum reliable range is roughly 200–300 cm depending on surface</li>
        <li>Soft or angled surfaces may give unreliable readings</li>
      </ul>
    </div>

    <div class="section-block">
      <h2>IR Line Sensor Notes</h2>
      <ul class="ui list" style="margin-left:1rem">
        <li><code>0</code> = black (line detected)</li>
        <li><code>1</code> = white (no line)</li>
        <li>Sensors are P13 (left) and P14 (right)</li>
      </ul>
    </div>`;
}

function renderBaseCode() {
  return `
    <div class="lesson-header">
      <h1><i class="code icon"></i> Base Code</h1>
      <p>Copy this into every lesson as the starting point. Add your code only in the <strong>YOUR CODE BELOW</strong> section.</p>
    </div>

    <div class="section-block">
      ${codeBlock(BASE_CODE)}
    </div>

    <div class="section-block">
      <h2>Function Reference</h2>
      <table class="ui celled compact small table">
        <thead><tr><th>Function</th><th>What it does</th></tr></thead>
        <tbody>
          <tr><td><code>forward(speed=200)</code></td><td>Drive both motors forward at the given speed (0–255)</td></tr>
          <tr><td><code>backward(speed=200)</code></td><td>Drive both motors backward</td></tr>
          <tr><td><code>turn_left(speed=180)</code></td><td>Left motor backward, right motor forward</td></tr>
          <tr><td><code>turn_right(speed=180)</code></td><td>Left motor forward, right motor backward</td></tr>
          <tr><td><code>stop()</code></td><td>Set both motors to speed 0</td></tr>
          <tr><td><code>distance_cm()</code></td><td>Returns ultrasonic distance in cm (0 = obstacle)</td></tr>
          <tr><td><code>line_left()</code></td><td>Returns 0 (black) or 1 (white) for left IR sensor</td></tr>
          <tr><td><code>line_right()</code></td><td>Returns 0 (black) or 1 (white) for right IR sensor</td></tr>
          <tr><td><code>log(label, value)</code></td><td>Print a labelled value to the serial monitor</td></tr>
          <tr><td><code>motor(m, direction, speed)</code></td><td>Control one motor directly (m=0 left, m=1 right)</td></tr>
        </tbody>
      </table>
    </div>`;
}

function renderLesson(lesson) {
  let html = '';

  // Header
  html += `
    <div class="lesson-header">
      <h1>Lesson ${lesson.number} — ${lesson.title}</h1>
      <div><em>${lesson.topic}</em></div>
      <div class="meta-row">
        <div class="ui label"><i class="clock icon"></i> ${lesson.time} min</div>
        ${hardwareBadges(lesson.hardware)}
      </div>
    </div>`;

  // No-coding notice
  if (lesson.noCodingNote) {
    html += infoMsg(`<strong>${lesson.noCodingNote}</strong>`);
  }

  // Objectives
  html += `
    <div class="section-block">
      <h2>Learning Objectives</h2>
      <ul class="ui list" style="margin-left:1rem">
        ${lesson.objectives.map(o => `<li><i class="check circle outline icon" style="color:#21ba45"></i>${o}</li>`).join('')}
      </ul>
    </div>`;

  // Starter
  html += `
    <div class="section-block">
      <h2>Starter Discussion</h2>
      <div class="ui blue message"><i class="comments icon"></i> ${lesson.starter}</div>
    </div>`;

  // Assessment (lesson 9)
  if (lesson.isAssessment && lesson.assessment) {
    const a = lesson.assessment;
    const criteriaRows = a.criteria.map(c =>
      `<tr><td>${c.label}</td><td style="text-align:center">${c.marks}</td></tr>`
    ).join('');
    const bonusItems = a.bonus.map(b =>
      `<li class="bonus-item">${b}</li>`
    ).join('');
    html += `
      <div class="section-block">
        <h2>Assessment Criteria</h2>
        <table class="ui celled table">
          <thead><tr><th>Criteria</th><th style="text-align:center">Marks</th></tr></thead>
          <tbody>
            ${criteriaRows}
            <tr class="assessment-total">
              <td>Total</td>
              <td style="text-align:center">${a.total}</td>
            </tr>
          </tbody>
        </table>
        <h3>Bonus Marks</h3>
        <ul class="ui list" style="margin-left:1rem">${bonusItems}</ul>
      </div>`;
  }

  // Tasks
  if (lesson.tasks && lesson.tasks.length > 0) {
    html += `<div class="section-block"><h2>Tasks</h2>`;
    lesson.tasks.forEach((task, i) => {
      html += renderTask(task, i);
    });
    html += `</div>`;
  }

  // Challenge
  if (lesson.challenge) {
    html += challengeMsg(lesson.challenge);
  }

  // Key questions
  html += keyQuestionsAccordion(lesson.keyQuestions);

  // Nav footer
  html += lessonNavFooter(lesson);

  return html;
}

function renderExtension() {
  const ext = EXTENSION;
  let html = '';

  html += `
    <div class="lesson-header">
      <h1><i class="database icon"></i> Extension — Data Logging</h1>
      <div><em>${ext.topic}</em></div>
      <div class="meta-row">
        <div class="ui label"><i class="clock icon"></i> ${ext.time} min</div>
        ${hardwareBadges(ext.hardware)}
      </div>
    </div>`;

  html += `
    <div class="section-block">
      <h2>Learning Objectives</h2>
      <ul class="ui list" style="margin-left:1rem">
        ${ext.objectives.map(o => `<li><i class="check circle outline icon" style="color:#21ba45"></i>${o}</li>`).join('')}
      </ul>
    </div>`;

  // V1 vs V2 comparison
  const compRows = ext.comparisonTable.rows.map(r =>
    `<tr>${r.map((c, i) => `<td${i === 0 ? ' style="font-weight:600"' : ''}>${c}</td>`).join('')}</tr>`
  ).join('');

  html += `
    <div class="section-block">
      <h2>V1 vs V2 — What's the Difference?</h2>
      <table class="ui celled compact small table">
        <thead><tr>${ext.comparisonTable.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${compRows}</tbody>
      </table>
    </div>`;

  html += `
    <div class="section-block">
      <h2>V1 — Button Dump Method</h2>
      <p>Data is held in memory during the run. Press <strong>Button A</strong> to dump to serial at the end. Data is lost when the micro:bit is unplugged.</p>
      ${codeBlock(ext.v1Code)}
    </div>`;

  html += `
    <div class="section-block">
      <h2>V2 — File Storage Method</h2>
      <p>Data is saved to a CSV file on the micro:bit. Survives power off. Can be read back at any time. Button A dumps to serial; Button B clears the log file.</p>
      ${codeBlock(ext.v2Code)}
    </div>`;

  const extQs = ext.extensionQuestions.map(q => `
    <div class="title"><i class="dropdown icon"></i>${q}</div>
    <div class="content"><p><em>Discuss with your class or write your answer in your notebook.</em></p></div>
  `).join('');

  html += `
    <div class="section-block key-questions">
      <h2>Extension Questions</h2>
      <div class="ui accordion">${extQs}</div>
    </div>`;

  html += `
    <div class="lesson-nav-footer">
      <a class="ui left labeled icon button" href="#lesson-9">
        <i class="left arrow icon"></i> Lesson 9
      </a>
      <a class="ui right labeled icon primary button" href="#challenges">
        Movement Challenges <i class="right arrow icon"></i>
      </a>
    </div>`;

  return html;
}

function renderChallenges() {
  let html = `
    <div class="lesson-header">
      <h1><i class="puzzle piece icon"></i> Movement Challenges</h1>
      <p>Four incomplete code snippets for Lesson 4 and beyond. Fill in the <span class="placeholder">???</span> values and integrate each into the base code.</p>
    </div>`;

  CHALLENGES.forEach(ch => {
    html += `
      <div class="section-block">
        <h2>Challenge ${ch.number} — ${ch.title}</h2>
        <p>${ch.description}</p>
        ${codeBlock(ch.code)}
        ${hintMsg(ch.hint)}
      </div>`;
  });

  html += `
    <div class="lesson-nav-footer">
      <a class="ui left labeled icon button" href="#extension">
        <i class="left arrow icon"></i> Extension
      </a>
      <a class="ui right labeled icon primary button" href="#home">
        Course Home <i class="home icon"></i>
      </a>
    </div>`;

  return html;
}

/* ── Post-render hooks ───────────────────────────────────── */

function highlightPlaceholders() {
  document.querySelectorAll('code.language-python').forEach(block => {
    block.innerHTML = block.innerHTML.replace(
      /(\?\?\?)/g,
      '<span class="placeholder">$1</span>'
    );
  });
}

function setupCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.closest('.code-wrapper').querySelector('code').textContent;
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      }).catch(() => {
        btn.textContent = 'Error';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      });
    });
  });
}

function setupAccordions() {
  $('.ui.accordion').accordion({ exclusive: false });
}

/* ── Navigation ──────────────────────────────────────────── */

function buildNavItems(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  NAV_ITEMS.forEach(item => {
    if (item.type === 'divider') {
      const div = document.createElement('div');
      div.className = 'divider';
      container.appendChild(div);
    } else if (item.type === 'header') {
      const h = document.createElement('div');
      h.className = 'header item';
      h.textContent = item.label;
      container.appendChild(h);
    } else {
      const a = document.createElement('a');
      a.className = 'item';
      a.dataset.id = item.id;
      a.href = '#' + item.id;
      if (item.icon) {
        const icon = document.createElement('i');
        icon.className = item.icon + ' icon';
        a.appendChild(icon);
      }
      a.appendChild(document.createTextNode(item.label));
      container.appendChild(a);
    }
  });
}

function setActiveNav(hash) {
  ['nav-menu', 'mobile-sidebar'].forEach(id => {
    const container = document.getElementById(id);
    if (!container) return;
    container.querySelectorAll('.item[data-id]').forEach(el => {
      el.classList.toggle('active', el.dataset.id === hash);
    });
  });
}

/* ── Router ──────────────────────────────────────────────── */

function route() {
  const hash = location.hash.slice(1) || 'home';
  setActiveNav(hash);

  const contentArea = document.getElementById('content-area');
  let html = '';

  if (hash === 'home') {
    html = renderHome();
  } else if (hash === 'hardware') {
    html = renderHardware();
  } else if (hash === 'base-code') {
    html = renderBaseCode();
  } else if (hash === 'extension') {
    html = renderExtension();
  } else if (hash === 'challenges') {
    html = renderChallenges();
  } else {
    const m = hash.match(/^lesson-(\d+)$/);
    if (m) {
      const lesson = LESSONS.find(l => l.number === parseInt(m[1]));
      if (lesson) html = renderLesson(lesson);
    }
  }

  if (!html) html = renderHome();

  contentArea.innerHTML = html;

  // Post-render
  Prism.highlightAll();
  highlightPlaceholders();
  setupCopyButtons();
  setupAccordions();

  // Scroll main content to top
  document.getElementById('main-content').scrollTop = 0;
  window.scrollTo(0, 0);
}

/* ── Mobile sidebar ──────────────────────────────────────── */

function initMobileSidebar() {
  buildNavItems('mobile-sidebar');

  $('#sidebar-toggle').on('click', () => {
    $('.ui.sidebar').sidebar('toggle');
  });

  // Close sidebar when a link is clicked
  $('#mobile-sidebar').on('click', 'a.item', () => {
    $('.ui.sidebar').sidebar('hide');
  });

  $('.ui.sidebar').sidebar({
    dimPage: true,
    closable: true,
  });
}

/* ── Init ────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  buildNavItems('nav-menu');
  initMobileSidebar();
  route();
  window.addEventListener('hashchange', route);
});
