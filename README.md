# Maqueen Robotics — Unit 5 Mechatronics

**Stage 4 (Year 7 & 8) · DFRobot Maqueen v4.1 · micro:bit V1 & V2 · MicroPython**

---

## Overview

This unit teaches autonomous robot navigation through nine lessons, building toward a single assessed challenge: program a robot to drive along a wall, detect a gap, and navigate through it without touching anything.

Students write real MicroPython on physical hardware from lesson one. There are no simulations, no block editors, and no scaffolding beyond the base code template. The course assumes students can read Python and have basic "code sense" — variable assignment, calling functions, reading error messages.

---

## Deployment

The course is a static single-page application. No build step, no server required.

**GitHub Pages:**

1. Push this repository to GitHub
2. Go to Settings → Pages → Source: Deploy from branch → `main` / root
3. The site is live at `https://<username>.github.io/<repo-name>`

**Local:**
Open `index.html` directly in a browser. All routing is hash-based (`#lesson-1`, `#hardware`, etc.) so no local server is needed.

**Dependencies (all CDN):**

- Semantic UI 2.5
- Prism.js 1.29 (Python theme)
- jQuery 3.6

No student data is collected, stored, or transmitted.

---

## Repository Structure

```
index.html              — page shell and CDN links
assets/
  css/course.css        — dark theme, layout, component styles
  js/lessons.js         — all lesson content as structured data
  js/app.js             — hash router, page renderers, post-render hooks
unit5_mechatronics_lessons.md   — source lesson content
MovementChallenges.md           — challenge snippet source
```

---

## Build Order & Verify

These lessons run as single MicroPython files on the micro:bit editor (python.microbit.org) or other MicroPython IDEs. Students should paste the full code for each lesson into the editor and flash one file at a time — there are no multi-file imports required for classroom use.

Quick verification checklist (teacher-facing):

- Power & wiring: batteries installed in Maqueen, USB cable connected for flashing/serial. Confirm ultrasonic TRIG→P1 and ECHO→P2; IR sensors on P13/P14.
- Serial Monitor: open the editor's Serial/REPL view when checking sensor outputs.

Recommended flash order and expected outputs:

1. `ultrasonic.py` (Lesson 2 — Sensing)
  - Flash and open Serial. Expect repeated lines like `distance: <n>` where `<n>` is centimetres.
  - Checks: Touching the sensor → small number or 0; 10 cm / 30 cm / 50 cm produce increasing values; no obstacle often returns 0 or a large value depending on sensor.

2. `irLineDetection.py` (Lesson 2 — Line sensors)
  - Flash and observe the 5×5 display and Serial. Expect lines `L: <0|1> | R: <0|1>`.
  - Checks: Place white paper under both sensors → `1 1` and display `W`. Black under both → `0 0` and display `B`. Mixed → `-`.

3. `sensorDistanceGoStop.py` (Lesson 3 / cumulative behaviour)
  - Flash with batteries connected (motors require battery power). Observe motors and display.
  - Expected behaviour: robot drives forward when clear, shows an arrow; when obstacle within the threshold it shows `NO` and stops. If the file contains a 50 cm threshold, test at ~50 cm.

Troubleshooting hints:

- If `distance` reads `0` constantly: check Echo wiring and that pin2 pull configuration is present in the script (some examples set pin2 pull explicitly).
- If motors do not move: confirm battery pack is connected and motor wiring on Maqueen is intact; try `forward()`/`stop()` short tests.
- If readings are noisy, power cycle the micro:bit and re-open Serial.

Classroom notes:

- Keep each solution as one file — students should step through the logic in the editor and flash the single-file solution for each lesson.
- Do not require students to manage multiple Python modules on the device; instructor materials may include helper files in the repo for reference only.


## Hardware Required

| Item                   | Notes                                                 |
| ---------------------- | ----------------------------------------------------- |
| DFRobot Maqueen v4.1   | Chassis with motor controller, IR sensors, ultrasonic |
| BBC micro:bit V1 or V2 | V2 required for Extension (file storage)              |
| USB cable              | For flashing and serial monitor                       |
| 3× AA batteries       | Maqueen power                                         |
| Cardboard or books     | Wall construction for lessons 5–9                    |

---

## Lesson Arc

| Lesson                    | Focus                      | SOLO Level        |
| ------------------------- | -------------------------- | ----------------- |
| 1 — Hello Robot          | Motors, sequencing, timing | Unistructural     |
| 2 — Sensing the World    | Ultrasonic and IR sensors  | Unistructural     |
| 3 — Make a Decision      | If/else, thresholds        | Multistructural   |
| 4 — React and Recover    | Sequential logic, state    | Multistructural   |
| 5 — The Wall Problem     | Decomposition, flowcharts  | Transitional      |
| 6 — Measuring the Gap    | Data collection, patterns  | Relational        |
| 7 — Turning Into the Gap | Integration, calibration   | Relational        |
| 8 — Making It Reliable   | Edge cases, tolerance      | Relational        |
| 9 — Navigation Challenge | Full autonomous system     | Extended Abstract |
| Extension — Data Logging | CSV, file I/O, persistence | Extended Abstract |

---

## Why SOLO?

### The Framework

SOLO Taxonomy (Structure of the Observed Learning Outcome) was developed by Biggs and Collis (1982) as a model for describing qualitative growth in student understanding. Unlike Bloom's Taxonomy, which categorises cognitive processes, SOLO describes the *structure* of what a student produces — making it directly observable from student work and code output. Hook and Mills (2011) popularised its classroom application, particularly in New Zealand and Australian secondary schools, arguing that it gives teachers a diagnostic language that maps directly to task design.

The five SOLO levels move from **prestructural** (no relevant understanding) through **unistructural** and **multistructural** (one concept, then several, in isolation) to **relational** (concepts integrated into a coherent whole) and finally **extended abstract** (generalisation beyond the original context). The critical transition in this unit is from multistructural to relational — the point where students stop thinking about motors and sensors as separate systems and start thinking about a robot that *navigates*.

### Why It Suits Physical Computing

Physical computing is an unusually good fit for SOLO-designed curricula because the hardware makes learning outcomes immediately visible. When a student is at a unistructural level with motors, the robot drives forward and stops; when they reach relational understanding of sensors and movement together, the robot avoids obstacles. The feedback loop is not a grade — it is a physical object either succeeding or failing in real space. This aligns with Papert's (1980) argument in *Mindstorms* that learning is most durable when students build artefacts they can reflect on, a principle he called **constructionism**. Resnick and Rosenbaum (2013) extend this to tinkering: the value is not just in the finished product but in the iterative process of breaking and fixing.

The SOLO progression also maps naturally to Wing's (2006) four pillars of **computational thinking**: decomposition, pattern recognition, abstraction, and algorithm design. Lesson 5 (The Wall Problem) is explicitly a decomposition lesson — students draw flowcharts rather than writing code. Lesson 6 (Measuring the Gap) is pattern recognition applied to sensor data. Lessons 7 and 8 require abstraction (treating confirmed gap detection as a single event) and algorithm design (sequencing detection, turning, and forward movement reliably). The assessed challenge in Lesson 9 asks students to transfer all four to an unseen problem configuration — the defining characteristic of extended abstract performance.

### Scaffolding Across the ZPD

Each lesson is designed to sit just beyond what students demonstrated in the previous one — an application of Vygotsky's (1978) Zone of Proximal Development. The base code template is not merely convenient: it holds motor control and sensor reading at the instructed level so that students can work at the current lesson's cognitive frontier without revisiting already-mastered material. Biggs and Tang (2011) describe this as **constructive alignment** — ensuring that the teaching activity, the assessment, and the intended learning outcome all target the same SOLO level. In this unit, each lesson's tasks are written at the target level, and the key questions are written at the level above, encouraging students to reach upward.

### Formative Assessment Through the Serial Monitor

Hattie and Timperley (2007) identify feedback as the single highest-impact intervention in learning, particularly feedback that addresses *where the learner is going*, *how they are getting there*, and *what to do next*. The serial monitor in Lessons 2 and 6 functions as a low-stakes, real-time feedback mechanism that makes invisible sensor data visible. Students observe the difference between their mental model ("the sensor should read 0 at the gap") and the actual output, then adjust. This is metacognitive in exactly the sense that Hattie (2009) argues produces the greatest learning gains — students are not just fixing code, they are updating their model of how the hardware behaves.

The experiment recording tables in each lesson serve a similar function. Requiring students to record threshold values, turn timing, and success rates creates a data trail that anchors discussion and makes the engineering tradeoffs explicit — a practice consistent with the kind of "making thinking visible" that Ritchhart, Church and Morrison (2011) associate with deep conceptual learning.

### The Assessment Challenge

Lesson 9 uses a **novel problem transfer** design: the gap is placed in an unfamiliar position, and students have one preparation period followed by three attempts. This is structurally identical to what Biggs and Tang (2011) describe as an extended abstract assessment task — students must apply integrated understanding to a context they have not specifically practised. The marking rubric rewards *component skills* (detecting the wall, finding the gap) as well as *system integration* (navigating through without touching), reflecting the SOLO principle that both relational and extended abstract performance deserve recognition.

### References

Biggs, J. & Collis, K. (1982). *Evaluating the quality of learning: The SOLO taxonomy.* Academic Press.

Biggs, J. & Tang, C. (2011). *Teaching for quality learning at university* (4th ed.). Open University Press.

Hattie, J. (2009). *Visible learning: A synthesis of over 800 meta-analyses relating to achievement.* Routledge.

Hattie, J. & Timperley, H. (2007). The power of feedback. *Review of Educational Research, 77*(1), 81–112.

Hook, P. & Mills, J. (2011). *SOLO taxonomy: A guide for schools.* Essential Resources.

Papert, S. (1980). *Mindstorms: Children, computers, and powerful ideas.* Basic Books.

Resnick, M. & Rosenbaum, E. (2013). Designing for tinkerability. In M. Honey & D. Kanter (Eds.), *Design, make, play: Growing the next generation of STEM innovators.* Routledge.

Ritchhart, R., Church, M. & Morrison, K. (2011). *Making thinking visible.* Jossey-Bass.

Vygotsky, L. S. (1978). *Mind in society: The development of higher psychological processes.* Harvard University Press.

Wing, J. M. (2006). Computational thinking. *Communications of the ACM, 49*(3), 33–35.

---

*DFRobot Maqueen v4.1 · micro:bit MicroPython · python.microbit.org/v/3*
