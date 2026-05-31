/* ── Card accent colours (one per lesson) ────────────────── */
const CARD_COLORS = [
  '#6e6cf7', // L1  purple
  '#4fc3f7', // L2  cyan
  '#3dd68c', // L3  green
  '#f59e0b', // L4  amber
  '#f472b6', // L5  pink
  '#38bdf8', // L6  sky
  '#a78bfa', // L7  violet
  '#34d399', // L8  emerald
  '#fb923c', // L9  orange
  '#e879f9', // extension fuchsia
];

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
      <div class="code-label">python</div>
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
      <p class="experiment-note">not saved — use your notebook to keep a permanent record</p>
      <table class="ui celled compact small table">
        <thead><tr>${heads}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function bulletList(items) {
  const lis = items.map(i => `<li>${i}</li>`).join('');
  return `<ul class="ui list" style="margin:0.5rem 0 0.4rem 0.8rem">${lis}</ul>`;
}

function hintMsg(text) {
  return `<div class="msg msg-hint"><i class="lightbulb icon"></i><div>${text}</div></div>`;
}

function challengeMsg(text) {
  return `<div class="msg msg-challenge"><i class="bolt icon"></i><div><strong>Challenge —</strong> ${text}</div></div>`;
}

function infoMsg(text) {
  return `<div class="msg msg-info"><i class="info circle icon"></i><div>${text}</div></div>`;
}

function warningMsg(text) {
  return `<div class="msg msg-warning"><i class="exclamation triangle icon"></i><div>${text}</div></div>`;
}

function noCodingMsg(text) {
  return `<div class="msg msg-nocode"><i class="pencil alternate icon"></i><div>${text}</div></div>`;
}

function hardwareBadges(hw) {
  return hw.map(h => `<span class="hw-badge"><i class="microchip icon"></i>${h}</span>`).join('');
}

function timeBadge(mins) {
  return `<span class="time-badge"><i class="clock icon"></i>${mins} min</span>`;
}

function renderTask(task, index) {
  let html = `<div class="task-step">`;
  html += `<div class="task-step-header">
    <span class="task-badge">Task ${index + 1}</span>
    <span class="task-title">${task.title}</span>
  </div>`;
  if (task.description) html += `<p>${task.description}</p>`;
  if (task.code)        html += codeBlock(task.code);
  if (task.bullets)     html += bulletList(task.bullets);
  if (task.table)       html += editableTable(task.table);
  if (task.note)        html += infoMsg(task.note);
  if (task.hint)        html += hintMsg(task.hint);
  html += `</div>`;
  return html;
}

function keyQuestionsBlock(questions) {
  if (!questions || questions.length === 0) return '';
  const items = questions.map(q => `
    <div class="title"><i class="dropdown icon"></i>${q}</div>
    <div class="content"><p>Discuss with your class or write your answer in your notebook.</p></div>
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
         <i class="left arrow icon"></i>Lesson ${lesson.number - 1}
       </a>`
    : `<a class="ui left labeled icon button" href="#home">
         <i class="left arrow icon"></i>Course Home
       </a>`;

  const isLast = lesson.number === LESSONS.length;
  const next = isLast
    ? `<a class="ui right labeled icon violet button" href="#extension">
         Extension<i class="right arrow icon"></i>
       </a>`
    : `<a class="ui right labeled icon violet button" href="#lesson-${lesson.number + 1}">
         Lesson ${lesson.number + 1}<i class="right arrow icon"></i>
       </a>`;

  return `<div class="lesson-nav-footer">${prev}${next}</div>`;
}

/* ── Home page ───────────────────────────────────────────── */

function renderHome() {
  const cards = LESSONS.map((l, i) => `
    <a class="lesson-card" href="#${l.id}" style="--card-accent:${CARD_COLORS[i]}">
      <div class="card-bg-num">${String(l.number).padStart(2,'0')}</div>
      <div class="card-label">Lesson ${l.number} &middot; ${l.time} min</div>
      <h3>${l.title}</h3>
      <div class="card-topic">${l.topic}</div>
    </a>`).join('');

  const extCard = `
    <a class="lesson-card" href="#extension" style="--card-accent:${CARD_COLORS[9]}">
      <div class="card-bg-num">EX</div>
      <div class="card-label">Extension &middot; 45 min</div>
      <h3>Data Logging</h3>
      <div class="card-topic">Data persistence, CSV, file systems</div>
    </a>`;

  const hwRows = HARDWARE.map(r =>
    `<tr>
      <td><strong>${r.component}</strong></td>
      <td><span class="pin-badge">${r.pin}</span></td>
      <td>${r.notes}</td>
    </tr>`).join('');

  const currRows = CURRICULUM.map(r =>
    `<tr><td>${r.lesson}</td><td>${r.concepts}</td></tr>`).join('');

  return `
    <div class="hero">
      <div class="hero-eyebrow">DFRobot Maqueen v4.1 &nbsp;&middot;&nbsp; micro:bit MicroPython &nbsp;&middot;&nbsp; Stage 4</div>
      <h1>Maqueen<br><span>Robotics</span></h1>
      <p class="hero-desc">Nine lessons building toward one goal: a robot that drives along a wall, finds the gap, and navigates through it — on its own.</p>
      <div class="hero-actions">
        <a class="ui large violet button" href="#lesson-1"><i class="play icon"></i>Start Lesson 1</a>
        <a class="ui large basic inverted button" href="#hardware">Hardware Ref</a>
        <a class="ui large basic inverted button" href="#base-code">Base Code</a>
      </div>
      <div class="hero-stats">
        <div class="hero-stat">
          <span class="stat-val">9</span>
          <span class="stat-label">Lessons</span>
        </div>
        <div class="hero-stat">
          <span class="stat-val">4</span>
          <span class="stat-label">Challenges</span>
        </div>
        <div class="hero-stat">
          <span class="stat-val">45</span>
          <span class="stat-label">Min avg</span>
        </div>
        <div class="hero-stat">
          <span class="stat-val">1</span>
          <span class="stat-label">Final challenge</span>
        </div>
      </div>
    </div>

    <div class="lesson-grid">${cards}${extCard}</div>

    <div class="section-block">
      <h2>Curriculum Links</h2>
      <table class="ui compact small table curriculum-table">
        <thead><tr><th>Lesson</th><th>Computing Concepts</th></tr></thead>
        <tbody>${currRows}</tbody>
      </table>
    </div>

    <div class="section-block">
      <h2>Hardware Quick Reference</h2>
      <table class="ui celled compact small table">
        <thead><tr><th>Component</th><th>Pin</th><th>Notes</th></tr></thead>
        <tbody>${hwRows}</tbody>
      </table>
      ${warningMsg('Always include <code>i2c.init(freq=100000, sda=pin20, scl=pin19)</code> in every program — even when not using motors. The ultrasonic sensor needs it.')}
    </div>`;
}

/* ── Hardware reference ──────────────────────────────────── */

function renderHardware() {
  const rows = HARDWARE.map(r =>
    `<tr>
      <td><strong>${r.component}</strong></td>
      <td><span class="pin-badge">${r.pin}</span></td>
      <td>${r.notes}</td>
    </tr>`).join('');

  return `
    <div class="lesson-header" style="display:block;padding:1.5rem 0 1.8rem">
      <div class="lesson-eyebrow">Reference</div>
      <h1 style="font-size:2rem;font-weight:900;color:var(--white);margin:0.2rem 0 0.5rem;letter-spacing:-0.02em">Hardware Reference</h1>
      <p style="color:var(--text-dim);font-size:0.9rem">DFRobot Maqueen v4.1 &middot; micro:bit V1 &amp; V2</p>
    </div>

    <div class="section-block">
      <h2>Pin Map</h2>
      <table class="ui celled table">
        <thead><tr><th>Component</th><th>Pin</th><th>Notes</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      ${warningMsg('Always include <code>i2c.init(freq=100000, sda=pin20, scl=pin19)</code> in every program — even when not using motors.')}
      ${infoMsg('Servo S1 and S2 share pins P1/P2 with the ultrasonic sensor. Do not use both at the same time.')}
    </div>

    <div class="section-block">
      <h2>Motor Direction Values</h2>
      <table class="ui celled compact small table">
        <thead><tr><th>direction argument</th><th>Motor behaviour</th></tr></thead>
        <tbody>
          <tr><td><span class="pin-badge">0</span></td><td>Forward</td></tr>
          <tr><td><span class="pin-badge">1</span></td><td>Backward</td></tr>
        </tbody>
      </table>
    </div>

    <div class="section-block">
      <h2>Sensor Return Values</h2>
      <table class="ui celled compact small table">
        <thead><tr><th>Sensor</th><th>Value</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td>Ultrasonic</td><td><span class="pin-badge">0</span></td><td>Obstacle touching or very close</td></tr>
          <tr><td>Ultrasonic</td><td><span class="pin-badge">210+</span></td><td>No obstacle in range</td></tr>
          <tr><td>IR Line</td><td><span class="pin-badge">0</span></td><td>Black (line detected)</td></tr>
          <tr><td>IR Line</td><td><span class="pin-badge">1</span></td><td>White (no line)</td></tr>
        </tbody>
      </table>
    </div>`;
}

/* ── Base code ───────────────────────────────────────────── */

function renderBaseCode() {
  return `
    <div class="lesson-header" style="display:block;padding:1.5rem 0 1.8rem">
      <div class="lesson-eyebrow">Reference</div>
      <h1 style="font-size:2rem;font-weight:900;color:var(--white);margin:0.2rem 0 0.5rem;letter-spacing:-0.02em">Base Code</h1>
      <p style="color:var(--text-dim);font-size:0.9rem">Copy this into every lesson. Add your code only below the <code>YOUR CODE BELOW</code> line.</p>
    </div>

    <div class="section-block">
      ${codeBlock(BASE_CODE)}
    </div>

    <div class="section-block">
      <h2>Function Reference</h2>
      <table class="ui celled compact small table">
        <thead><tr><th>Function</th><th>What it does</th></tr></thead>
        <tbody>
          <tr><td><code>forward(speed=200)</code></td><td>Both motors forward, speed 0–255</td></tr>
          <tr><td><code>backward(speed=200)</code></td><td>Both motors backward</td></tr>
          <tr><td><code>turn_left(speed=180)</code></td><td>Left backward, right forward</td></tr>
          <tr><td><code>turn_right(speed=180)</code></td><td>Left forward, right backward</td></tr>
          <tr><td><code>stop()</code></td><td>Both motors off</td></tr>
          <tr><td><code>distance_cm()</code></td><td>Ultrasonic distance in cm (0 = obstacle)</td></tr>
          <tr><td><code>line_left()</code></td><td>0 = black, 1 = white (left IR sensor)</td></tr>
          <tr><td><code>line_right()</code></td><td>0 = black, 1 = white (right IR sensor)</td></tr>
          <tr><td><code>log(label, value)</code></td><td>Print a labelled value to serial monitor</td></tr>
          <tr><td><code>motor(m, direction, speed)</code></td><td>One motor directly — m=0 left, m=1 right</td></tr>
        </tbody>
      </table>
    </div>`;
}

/* ── Individual lesson ───────────────────────────────────── */

function renderLesson(lesson) {
  const colorIdx = lesson.number - 1;
  const accent = CARD_COLORS[colorIdx] || '#6e6cf7';
  let html = '';

  // Header
  const numStr = String(lesson.number).padStart(2, '0');
  html += `
    <div class="lesson-header" style="border-bottom:1px solid var(--border);padding:1.5rem 0 1.8rem;margin-bottom:1.4rem;display:flex;align-items:flex-start;gap:1.4rem">
      <div class="lesson-num-display" style="color:${accent}">${numStr}</div>
      <div class="lesson-header-text">
        <div class="lesson-eyebrow" style="color:${accent}">Lesson ${lesson.number} &middot; ${lesson.topic}</div>
        <h1 style="font-size:2rem;font-weight:900;color:var(--white);margin:0.25rem 0 0.6rem;letter-spacing:-0.02em;line-height:1.1">${lesson.title}</h1>
        <div class="meta-row">
          ${timeBadge(lesson.time)}
          ${hardwareBadges(lesson.hardware)}
        </div>
      </div>
    </div>`;

  // No-coding notice
  if (lesson.noCodingNote) {
    html += noCodingMsg(lesson.noCodingNote);
  }

  // Objectives
  html += `
    <div class="section-block">
      <h2>Learning Objectives</h2>
      <ul class="ui list" style="margin-left:0.8rem">
        ${lesson.objectives.map(o =>
          `<li><i class="check circle icon" style="color:var(--green)"></i>${o}</li>`
        ).join('')}
      </ul>
    </div>`;

  // Starter
  html += `
    <div class="section-block">
      <h2>Starter</h2>
      ${infoMsg(`<i class="comments icon"></i> ${lesson.starter}`)}
    </div>`;

  // Assessment (lesson 9)
  if (lesson.isAssessment && lesson.assessment) {
    const a = lesson.assessment;
    const criteriaRows = a.criteria.map(c =>
      `<tr><td>${c.label}</td><td style="text-align:center;font-variant-numeric:tabular-nums">${c.marks}</td></tr>`
    ).join('');
    const bonusItems = a.bonus.map(b =>
      `<li class="bonus-item"><i class="star icon"></i>${b}</li>`
    ).join('');
    html += `
      <div class="section-block">
        <h2>Assessment Criteria</h2>
        <table class="ui celled table">
          <thead><tr><th>Criteria</th><th style="text-align:center;width:80px">Marks</th></tr></thead>
          <tbody>
            ${criteriaRows}
            <tr class="assessment-total">
              <td>Total</td><td style="text-align:center">10</td>
            </tr>
          </tbody>
        </table>
        <h2 style="margin-top:1.2rem">Bonus Marks</h2>
        <ul class="ui list" style="margin-left:0.8rem">${bonusItems}</ul>
      </div>`;
  }

  // Tasks
  if (lesson.tasks && lesson.tasks.length > 0) {
    html += `<div class="section-block"><h2>Tasks</h2><div class="tasks-list">`;
    lesson.tasks.forEach((task, i) => { html += renderTask(task, i); });
    html += `</div></div>`;
  }

  // Challenge
  if (lesson.challenge) {
    html += challengeMsg(lesson.challenge);
  }

  // Key questions
  html += keyQuestionsBlock(lesson.keyQuestions);

  // Nav footer
  html += lessonNavFooter(lesson);

  return html;
}

/* ── Extension lesson ────────────────────────────────────── */

function renderExtension() {
  const ext = EXTENSION;
  let html = '';

  html += `
    <div class="lesson-header" style="display:flex;align-items:flex-start;gap:1.4rem;border-bottom:1px solid var(--border);padding:1.5rem 0 1.8rem;margin-bottom:1.4rem">
      <div class="lesson-num-display" style="color:${CARD_COLORS[9]};font-size:3rem">EX</div>
      <div>
        <div class="lesson-eyebrow" style="color:${CARD_COLORS[9]}">Extension &middot; ${ext.topic}</div>
        <h1 style="font-size:2rem;font-weight:900;color:var(--white);margin:0.25rem 0 0.6rem;letter-spacing:-0.02em">Data Logging</h1>
        <div class="meta-row">
          ${timeBadge(ext.time)}
          ${hardwareBadges(ext.hardware)}
        </div>
      </div>
    </div>`;

  html += `
    <div class="section-block">
      <h2>Learning Objectives</h2>
      <ul class="ui list" style="margin-left:0.8rem">
        ${ext.objectives.map(o =>
          `<li><i class="check circle icon" style="color:var(--green)"></i>${o}</li>`
        ).join('')}
      </ul>
    </div>`;

  // V1 vs V2
  const compRows = ext.comparisonTable.rows.map(r =>
    `<tr>${r.map((c, i) => `<td${i === 0 ? ' style="font-weight:700"' : ''}>${c}</td>`).join('')}</tr>`
  ).join('');

  html += `
    <div class="section-block">
      <h2>V1 vs V2</h2>
      <table class="ui celled compact small table">
        <thead><tr>${ext.comparisonTable.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${compRows}</tbody>
      </table>
    </div>`;

  html += `
    <div class="section-block">
      <h2>V1 — Button Dump Method</h2>
      <p>Data is held in RAM during the run. Press <strong>Button A</strong> to dump to serial. Data is lost when the board loses power.</p>
      ${codeBlock(ext.v1Code)}
    </div>`;

  html += `
    <div class="section-block">
      <h2>V2 — File Storage Method</h2>
      <p>Data is written to <code>log.csv</code> on the micro:bit's flash storage. Survives power off. Open in Excel or Google Sheets.</p>
      <p>Button A dumps to serial &nbsp;&middot;&nbsp; Button B clears the log file.</p>
      ${codeBlock(ext.v2Code)}
    </div>`;

  const extQItems = ext.extensionQuestions.map(q => `
    <div class="title"><i class="dropdown icon"></i>${q}</div>
    <div class="content"><p>Discuss with your class or write your answer in your notebook.</p></div>
  `).join('');

  html += `
    <div class="section-block key-questions">
      <h2>Extension Questions</h2>
      <div class="ui accordion">${extQItems}</div>
    </div>`;

  html += `
    <div class="lesson-nav-footer">
      <a class="ui left labeled icon button" href="#lesson-9">
        <i class="left arrow icon"></i>Lesson 9
      </a>
      <a class="ui right labeled icon violet button" href="#challenges">
        Movement Challenges<i class="right arrow icon"></i>
      </a>
    </div>`;

  return html;
}

/* ── Movement challenges ─────────────────────────────────── */

function renderChallenges() {
  let html = `
    <div class="lesson-header" style="display:block;padding:1.5rem 0 1.8rem;border-bottom:1px solid var(--border);margin-bottom:1.4rem">
      <div class="lesson-eyebrow">Lesson 4 and beyond</div>
      <h1 style="font-size:2rem;font-weight:900;color:var(--white);margin:0.25rem 0 0.5rem;letter-spacing:-0.02em">Movement Challenges</h1>
      <p style="color:var(--text-dim);font-size:0.9rem">Four incomplete code snippets. Fill in the <span class="placeholder">???</span> values, work out where each goes in the base code, and test it.</p>
    </div>`;

  const chColors = ['#6e6cf7','#f59e0b','#3dd68c','#f472b6'];

  CHALLENGES.forEach((ch, i) => {
    html += `
      <div class="section-block" style="border-top:3px solid ${chColors[i]}">
        <h2 class="with-bar" style="border-left-color:${chColors[i]}">Challenge ${ch.number} — ${ch.title}</h2>
        <p>${ch.description}</p>
        ${codeBlock(ch.code)}
        ${hintMsg(ch.hint)}
      </div>`;
  });

  html += `
    <div class="lesson-nav-footer">
      <a class="ui left labeled icon button" href="#extension">
        <i class="left arrow icon"></i>Extension
      </a>
      <a class="ui right labeled icon violet button" href="#home">
        Course Home<i class="home icon"></i>
      </a>
    </div>`;

  return html;
}

/* ── Post-render ─────────────────────────────────────────── */

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

  contentArea.innerHTML = html || renderHome();

  Prism.highlightAll();
  highlightPlaceholders();
  setupCopyButtons();
  setupAccordions();

  document.getElementById('main-content').scrollTop = 0;
  window.scrollTo(0, 0);
}

/* ── Mobile sidebar ──────────────────────────────────────── */

function initMobileSidebar() {
  buildNavItems('mobile-sidebar');

  $('#sidebar-toggle').on('click', () => {
    $('.ui.sidebar').sidebar('toggle');
  });

  $('#mobile-sidebar').on('click', 'a.item', () => {
    $('.ui.sidebar').sidebar('hide');
  });

  $('.ui.sidebar').sidebar({ dimPage: true, closable: true });
}

/* ── Init ────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  buildNavItems('nav-menu');
  initMobileSidebar();
  route();
  window.addEventListener('hashchange', route);
});
