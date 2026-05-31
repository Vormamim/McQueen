/* ── Navigation ─────────────────────────────────────────── */

const NAV_ITEMS = [
  { id: 'home',       label: 'Course Home',        icon: 'home' },
  { id: 'hardware',   label: 'Hardware Reference',  icon: 'microchip' },
  { id: 'base-code',  label: 'Base Code',           icon: 'code' },
  { type: 'divider' },
  { type: 'header', label: 'Lessons' },
  { id: 'lesson-1',  label: 'L1 — Hello Robot' },
  { id: 'lesson-2',  label: 'L2 — Sensing the World' },
  { id: 'lesson-3',  label: 'L3 — Make a Decision' },
  { id: 'lesson-4',  label: 'L4 — React and Recover' },
  { id: 'lesson-5',  label: 'L5 — The Wall Problem' },
  { id: 'lesson-6',  label: 'L6 — Measuring the Gap' },
  { id: 'lesson-7',  label: 'L7 — Turning Into the Gap' },
  { id: 'lesson-8',  label: 'L8 — Making It Reliable' },
  { id: 'lesson-9',  label: 'L9 — Navigation Challenge' },
  { id: 'extension', label: 'Extension — Data Logging' },
  { type: 'divider' },
  { id: 'challenges', label: 'Movement Challenges', icon: 'puzzle piece' },
];

/* ── Hardware reference ──────────────────────────────────── */

const HARDWARE = [
  { component: 'Motor controller (I²C)', pin: 'P19 (SCL), P20 (SDA)', notes: 'Always call i2c.init() first' },
  { component: 'Ultrasonic Trig',        pin: 'P1',                    notes: 'SR04 5V version' },
  { component: 'Ultrasonic Echo',        pin: 'P2',                    notes: 'Returns 0 = obstacle, ~210 = clear' },
  { component: 'IR Line sensor Left',    pin: 'P13',                   notes: '0 = black, 1 = white' },
  { component: 'IR Line sensor Right',   pin: 'P14',                   notes: '0 = black, 1 = white' },
  { component: 'Red LED Left',           pin: 'P8',                    notes: 'Digital out' },
  { component: 'Red LED Right',          pin: 'P12',                   notes: 'Digital out' },
  { component: 'Buzzer',                 pin: 'P0',                    notes: 'Disable via physical switch if needed' },
  { component: 'Servo S1',              pin: 'P1',                    notes: 'Shared with Ultrasonic — don\'t use both' },
  { component: 'Servo S2',              pin: 'P2',                    notes: 'Shared with Echo — don\'t use both' },
];

/* ── Base code ───────────────────────────────────────────── */

const BASE_CODE = `from microbit import *
from machine import time_pulse_us

i2c.init(freq=100000, sda=pin20, scl=pin19)
sleep(500)

def motor(m, direction, speed):
    try:
        i2c.write(0x10, bytearray([0x00 if m == 0 else 0x02, direction, speed]))
    except:
        pass

def stop():
    motor(0, 0, 0); motor(1, 0, 0)

def forward(speed=200):
    motor(0, 0, speed); motor(1, 0, speed)

def backward(speed=200):
    motor(0, 1, speed); motor(1, 1, speed)

def turn_left(speed=180):
    motor(0, 1, speed); motor(1, 0, speed)

def turn_right(speed=180):
    motor(0, 0, speed); motor(1, 1, speed)

def distance_cm():
    pin2.read_digital()
    pin1.write_digital(0)
    sleep(5)
    pin1.write_digital(1)
    sleep(10)
    pin1.write_digital(0)
    sleep(5)
    t = time_pulse_us(pin2, 1, 50000)
    if t < 10:
        return 0
    return t / 58

def line_left():
    return pin13.read_digital()    # 0=black, 1=white

def line_right():
    return pin14.read_digital()    # 0=black, 1=white

def log(label, value):
    print(label + ": " + str(value))

# ── YOUR CODE BELOW ───────────────────────────────────
while True:
    pass`;

/* ── Lessons ─────────────────────────────────────────────── */

const LESSONS = [

  /* ── Lesson 1 ── */
  {
    id: 'lesson-1',
    number: 1,
    title: 'Hello Robot',
    topic: 'Sequencing, motors, direction, speed',
    time: '45',
    hardware: ['Maqueen', 'micro:bit', 'batteries'],
    objectives: [
      'Understand how to flash code to the micro:bit',
      'Control motor direction and speed',
      'Understand the relationship between sleep() and distance',
    ],
    starter: 'Place the robot on the floor. Ask: <em>"How would you describe to someone who has never seen a robot how to make it move in a square?"</em> Collect answers — look for sequencing language.',
    tasks: [
      {
        title: 'Task 1 — First Flash',
        description: 'Add this to the base code and flash it. Observe what happens. What does <code>sleep(1000)</code> mean?',
        code: `while True:
    forward()
    sleep(1000)
    stop()
    sleep(500)`,
      },
      {
        title: 'Task 2 — Speed Experiments',
        description: 'Change the speed value in <code>forward(speed=200)</code>. Try 50, 100, 200, 255.',
        bullets: [
          'What is the slowest speed the motors will actually turn?',
          'What happens at 255?',
          'Record your results in the table.',
        ],
        table: {
          headers: ['Speed value', 'Observed behaviour'],
          rows: [['50', ''], ['100', ''], ['200', ''], ['255', '']],
        },
      },
      {
        title: 'Task 3 — Draw a Square',
        description: 'Make the robot drive in a square. You will need:',
        bullets: [
          '<code>forward()</code> — move forward',
          '<code>turn_right()</code> — turn',
          '<code>sleep()</code> — control timing',
          '<code>stop()</code> — stop',
        ],
        hint: 'A square has 4 sides and 4 corners. Each corner is 90 degrees.',
      },
    ],
    challenge: 'Make the robot drive exactly 1 metre and stop. How did you work out the <code>sleep()</code> value?',
    keyQuestions: [
      'What is the difference between <code>speed</code> and <code>sleep()</code>?',
      'Why does the robot not always travel the same distance at the same speed?',
      'What real-world factors affect the robot\'s movement?',
    ],
  },

  /* ── Lesson 2 ── */
  {
    id: 'lesson-2',
    number: 2,
    title: 'Sensing the World',
    topic: 'Input, output, variables, serial monitor',
    time: '45',
    hardware: ['Maqueen', 'micro:bit', 'USB cable', 'batteries (optional)'],
    objectives: [
      'Understand what a sensor is and what it returns',
      'Read sensor values using the serial monitor',
      'Identify patterns in sensor data',
    ],
    starter: 'Hold up the ultrasonic sensor. Ask: <em>"How do you think this works? What animals use the same idea?"</em> (Bats, dolphins — echolocation.)',
    tasks: [
      {
        title: 'Static Test Code',
        description: 'No motors needed for this lesson. Flash this code and open the <strong>Serial</strong> button in the editor to see live values.',
        code: `from microbit import *
from machine import time_pulse_us

i2c.init(freq=100000, sda=pin20, scl=pin19)
sleep(500)

def distance_cm():
    pin2.read_digital()
    pin1.write_digital(0)
    sleep(5)
    pin1.write_digital(1)
    sleep(10)
    pin1.write_digital(0)
    sleep(5)
    t = time_pulse_us(pin2, 1, 50000)
    if t < 10:
        return 0
    return t / 58

def line_left():
    return pin13.read_digital()

def line_right():
    return pin14.read_digital()

def log(label, value):
    print(label + ": " + str(value))

while True:
    log("distance", int(distance_cm()))
    log("line_left", line_left())
    log("line_right", line_right())
    print("---")
    sleep(500)`,
      },
      {
        title: 'Task 1 — Ultrasonic Experiments',
        description: 'With the serial monitor open, wave your hand in front of the sensor.',
        table: {
          headers: ['Hand distance (estimated)', 'Value shown'],
          rows: [
            ['Touching', ''],
            ['10 cm', ''],
            ['30 cm', ''],
            ['50 cm', ''],
            ['No obstacle', ''],
          ],
        },
        bullets: [
          'What is the maximum reliable range?',
          'What does the sensor return when there is no obstacle?',
          'What does 0 mean?',
        ],
      },
      {
        title: 'Task 2 — Line Sensor Experiments',
        description: 'Slide a piece of black paper under the robot. Watch the values change.',
        table: {
          headers: ['Surface', 'line_left', 'line_right'],
          rows: [
            ['White', '', ''],
            ['Black', '', ''],
            ['Half and half', '', ''],
          ],
        },
      },
      {
        title: 'Task 3 — Display Zones',
        description: 'Make the display show a letter based on distance — without moving the robot:',
        bullets: [
          '<code>F</code> when distance is far (over 100 cm)',
          '<code>M</code> when distance is medium (30–100 cm)',
          '<code>N</code> when distance is near (under 30 cm)',
        ],
        hint: 'You need an <code>if</code>, <code>elif</code>, and <code>else</code>.',
      },
    ],
    challenge: 'Add a fourth zone — show <code>X</code> when the sensor returns 0 (obstacle touching).',
    keyQuestions: [
      'Why does the sensor return 0 instead of a very small number when something is very close?',
      'What is the difference between a digital and analogue sensor?',
      'Why might sensor readings vary even when nothing has moved?',
    ],
  },

  /* ── Lesson 3 ── */
  {
    id: 'lesson-3',
    number: 3,
    title: 'Make a Decision',
    topic: 'If/else, thresholds, conditionals',
    time: '45',
    hardware: ['Maqueen', 'micro:bit', 'batteries'],
    objectives: [
      'Use if/else to make the robot respond to sensor data',
      'Understand the concept of a threshold',
      'Combine sensor input with motor output',
    ],
    starter: 'Show students a simple flowchart: <em>"If it is raining → take umbrella, else → leave umbrella."</em> Ask them to draw a flowchart for the robot stopping at an obstacle before writing any code.',
    tasks: [
      {
        title: 'Task 1 — Stop on Detection',
        description: 'Add this to the base code and test it. Does it stop reliably?',
        code: `while True:
    d = distance_cm()

    if d == 0 or d < 30:
        stop()
        display.show(Image.NO)
    else:
        forward()
        display.show(Image.ARROW_N)

    sleep(100)`,
      },
      {
        title: 'Task 2 — Threshold Experiments',
        description: 'Change the <code>30</code> in <code>d &lt; 30</code> to different values. Record what happens.',
        table: {
          headers: ['Threshold (cm)', 'Behaviour'],
          rows: [
            ['10', ''],
            ['30', ''],
            ['60', ''],
            ['100', ''],
          ],
        },
        bullets: [
          'What threshold works best for your robot?',
          'Why might a higher threshold be useful in the real world?',
        ],
      },
      {
        title: 'Task 3 — Three Zone Response',
        description: 'Make the robot respond differently in three zones:',
        bullets: [
          'Far (over 60 cm) — full speed forward',
          'Medium (20–60 cm) — half speed forward',
          'Near (under 20 cm) — stop',
        ],
        hint: '<code>forward(100)</code> sets speed to 100.',
      },
    ],
    challenge: 'Add the display — show a different image for each zone.',
    keyQuestions: [
      'What is a threshold and why does it matter?',
      'What happens if the threshold is too low? Too high?',
      'How does this relate to real self-driving car systems?',
    ],
  },

  /* ── Lesson 4 ── */
  {
    id: 'lesson-4',
    number: 4,
    title: 'React and Recover',
    topic: 'Loops, state, sequential logic',
    time: '45',
    hardware: ['Maqueen', 'micro:bit', 'batteries', 'open floor space'],
    objectives: [
      'Make the robot take a sequence of actions after detecting an obstacle',
      'Understand timing and how it affects turns',
      'Experiment with the 4 challenge snippets',
    ],
    starter: 'Ask: <em>"When a robot detects an obstacle, stopping is not enough — what else might it need to do?"</em> Collect ideas — turn, reverse, find another route.',
    tasks: [
      {
        title: 'Task 1 — Stop and Turn',
        description: 'After stopping, add a turn. Does the turn feel like 90 degrees? Adjust <code>sleep(500)</code> until it is close to 90 degrees.',
        code: `while True:
    d = distance_cm()

    if d == 0 or d < 30:
        stop()
        display.show(Image.NO)
        sleep(300)
        turn_right()
        sleep(500)
    else:
        forward()
        display.show(Image.ARROW_N)

    sleep(100)`,
      },
      {
        title: 'Task 2 — Calibrate Your Turn',
        description: 'Find the <code>sleep()</code> value that gives you the closest to each target angle.',
        table: {
          headers: ['Target angle', 'sleep() value found'],
          rows: [
            ['45 degrees', ''],
            ['90 degrees', ''],
            ['180 degrees', ''],
          ],
        },
        note: 'This will vary between robots depending on battery level and surface.',
      },
    ],
    challenge: 'Pick one of the four Movement Challenges and integrate it into the base code. You must work out where it goes and what the <code>???</code> values should be. <a href="#challenges">View Movement Challenges →</a>',
    keyQuestions: [
      'Why does the turn angle vary between runs?',
      'What real-world factors affect turning consistency?',
      'How could you make turns more reliable without extra sensors?',
    ],
  },

  /* ── Lesson 5 ── */
  {
    id: 'lesson-5',
    number: 5,
    title: 'The Wall Problem',
    topic: 'Problem decomposition, planning, flowcharts',
    time: '45',
    hardware: ['Maqueen', 'micro:bit', 'cardboard wall with 30 cm gap'],
    objectives: [
      'Decompose a complex navigation problem into steps',
      'Plan a solution before writing code',
      'Understand what data the robot needs and when',
    ],
    starter: 'Show students the wall. Ask: <em>"How would you find the gap if you were blindfolded and could only use your hands?"</em> Map their answers to robot sensor equivalents.',
    noCodingNote: 'No coding this lesson — this is a planning and design session.',
    tasks: [
      {
        title: 'Task 1 — Observation',
        description: 'Answer these questions by thinking, not coding:',
        bullets: [
          'What does the robot sense as it approaches a solid wall?',
          'What changes in the sensor data when it reaches the gap?',
          'How does it know the gap is wide enough to drive through?',
          'What does it need to do when it finds the gap?',
        ],
      },
      {
        title: 'Task 2 — Flowchart',
        description: 'Draw a flowchart for the robot navigating the gap. Your flowchart must include:',
        bullets: [
          'Start',
          'Driving toward the wall',
          'Detecting the wall',
          'Detecting the gap',
          'Deciding to turn',
          'Driving through',
          'End',
        ],
      },
      {
        title: 'Task 3 — Data Prediction',
        description: 'Predict what the serial monitor will show at each stage:',
        table: {
          headers: ['Stage', 'Predicted distance value'],
          rows: [
            ['Starting position (50 cm back)', ''],
            ['Approaching wall (10 cm away)', ''],
            ['At the gap', ''],
            ['Through the gap', ''],
          ],
        },
      },
    ],
    challenge: 'Write pseudocode (plain English steps) for the full navigation sequence before next lesson.',
    keyQuestions: [
      'What is the minimum sensor information you need to solve this problem?',
      'What could go wrong with your plan?',
      'How do engineers test robot navigation systems safely?',
    ],
  },

  /* ── Lesson 6 ── */
  {
    id: 'lesson-6',
    number: 6,
    title: 'Measuring the Gap',
    topic: 'Data collection, loops, patterns in data',
    time: '45',
    hardware: ['Maqueen', 'micro:bit', 'USB cable', 'cardboard wall with gap'],
    objectives: [
      'Collect sensor data from a moving robot',
      'Identify patterns that indicate the gap',
      'Detect the gap in code before attempting to navigate it',
    ],
    starter: 'Same wall as Lesson 5. Robot drives slowly along the wall (parallel, not toward it) while logging to serial.',
    tasks: [
      {
        title: 'Task 1 — Drive and Log',
        description: 'Drive the robot slowly along the wall and watch the serial monitor. Record what the distance values look like at each stage.',
        code: `while True:
    d = distance_cm()
    log("distance", int(d))
    forward(80)                    # slow speed
    sleep(100)`,
        bullets: [
          'Solid wall section',
          'Approaching the gap',
          'At the gap',
          'Past the gap',
        ],
      },
      {
        title: 'Task 2 — Spot the Gap',
        description: 'From your data, answer:',
        bullets: [
          'What distance value reliably signals the gap?',
          'At what point does the robot need to start reacting?',
          'How many consecutive readings do you need before you are confident it is a gap?',
        ],
      },
      {
        title: 'Task 3 — Signal the Gap',
        description: 'Without turning yet — make the robot beep or show a symbol the moment it detects the gap. Fill in the <code>???</code> threshold from your data.',
        code: `while True:
    d = distance_cm()
    forward(80)

    if d > ???:                    # gap detected
        stop()
        display.show(Image.SURPRISED)
        break

    sleep(100)`,
      },
    ],
    challenge: 'Make it only trigger after 3 consecutive gap readings — to avoid false positives.',
    keyQuestions: [
      'Why might a single reading not be reliable enough to act on?',
      'What is a false positive and why is it dangerous in robotics?',
      'How do self-driving cars handle noisy sensor data?',
    ],
  },

  /* ── Lesson 7 ── */
  {
    id: 'lesson-7',
    number: 7,
    title: 'Turning Into the Gap',
    topic: 'Timing, angles, trial and error',
    time: '45',
    hardware: ['Maqueen', 'micro:bit', 'batteries', 'wall with gap'],
    objectives: [
      'Use calibrated turn timing from Lesson 4 to navigate the gap',
      'Combine detection and movement into a full sequence',
      'Test and iterate to improve reliability',
    ],
    starter: 'Students use their gap detection threshold from Lesson 6 and their 90° turn calibration from Lesson 4 to write the full navigation sequence.',
    tasks: [
      {
        title: 'Task 1 — Full Navigation Attempt',
        description: 'Fill in the <code>???</code> values from your earlier experiments.',
        code: `while True:
    d = distance_cm()
    forward(80)

    if d > ???:                    # gap detected
        stop()
        sleep(200)
        turn_right()               # face the gap
        sleep(???)                 # your calibrated 90 degree value
        forward()                  # drive through
        sleep(1000)
        stop()
        break

    sleep(100)`,
      },
      {
        title: 'Task 2 — Success Rate',
        description: 'Run the navigation 5 times. Record the result each time.',
        table: {
          headers: ['Run', 'Result', 'Notes'],
          rows: [
            ['1', '', ''],
            ['2', '', ''],
            ['3', '', ''],
            ['4', '', ''],
            ['5', '', ''],
          ],
        },
        bullets: [
          'What is your success rate?',
          'What causes it to fail?',
          'What could you adjust to improve it?',
        ],
      },
    ],
    challenge: 'Make it work 3 times in a row without touching the walls.',
    keyQuestions: [
      'Why is consistency harder to achieve than just getting it right once?',
      'What variables affect the outcome between runs?',
      'How do engineers measure robot reliability?',
    ],
  },

  /* ── Lesson 8 ── */
  {
    id: 'lesson-8',
    number: 8,
    title: 'Making It Reliable',
    topic: 'Edge cases, debugging, tolerance',
    time: '45',
    hardware: ['Maqueen', 'micro:bit', 'batteries', 'wall with adjustable gap'],
    objectives: [
      'Identify and handle edge cases',
      'Add confirmation checks to improve reliability',
      'Test with different gap sizes',
    ],
    starter: 'Discuss: <em>"What is the difference between a robot that works and a robot that is reliable?"</em>',
    tasks: [
      {
        title: 'Task 1 — Confirmation Check',
        description: 'Add a check — only commit to the turn if the gap is detected 3 times in a row. Does this improve reliability?',
        code: `gap_count = 0

while True:
    d = distance_cm()
    forward(80)

    if d > ???:
        gap_count += 1
    else:
        gap_count = 0              # reset if gap lost

    if gap_count >= 3:             # confirmed gap
        stop()
        turn_right()
        sleep(???)
        forward()
        sleep(1000)
        stop()
        break

    sleep(100)`,
      },
      {
        title: 'Task 2 — Variable Gap Size',
        description: 'Test your code with different gap sizes:',
        table: {
          headers: ['Gap size', 'Success?', 'Notes'],
          rows: [
            ['40 cm', '', ''],
            ['30 cm', '', ''],
            ['20 cm', '', ''],
            ['15 cm', '', ''],
          ],
        },
        bullets: [
          'What is the minimum gap your robot can reliably navigate?',
          'What limits it?',
        ],
      },
      {
        title: 'Task 3 — Approach Angle',
        description: 'Start the robot at an angle to the wall instead of parallel. Does it still work? What breaks?',
      },
    ],
    challenge: 'Add a second sensor check after turning — confirm the robot is actually facing the gap before driving through.',
    keyQuestions: [
      'What is an edge case and why do engineers spend so much time on them?',
      'What is the difference between a robot that works and a robot that is reliable?',
      'What would need to change to handle a gap at a different position along the wall?',
    ],
  },

  /* ── Lesson 9 ── */
  {
    id: 'lesson-9',
    number: 9,
    title: 'Autonomous Navigation Challenge',
    topic: 'Full integration, assessment',
    time: '60',
    hardware: ['Maqueen', 'micro:bit', 'batteries', 'wall with gap in unknown position'],
    objectives: [
      'Demonstrate full autonomous navigation',
      'Apply all concepts from the unit',
      'Reflect on the engineering process',
    ],
    starter: 'The gap is placed in a position students have not practised with. They have one preparation period, then three attempts.',
    isAssessment: true,
    assessment: {
      criteria: [
        { label: 'Robot detects the wall', marks: 2 },
        { label: 'Robot finds the gap', marks: 3 },
        { label: 'Robot navigates through without touching', marks: 3 },
        { label: 'Robot continues forward after the gap', marks: 2 },
      ],
      total: 10,
      bonus: [
        'Works with gap in two different positions: +2',
        'Works with gap size reduced to 20 cm: +2',
        'Robot logs its decisions to serial or file: +2',
      ],
    },
    tasks: [
      {
        title: 'Reflection Questions',
        description: 'After the challenge, answer these questions in writing:',
        bullets: [
          'What worked well in your final code?',
          'What was the hardest problem to solve and how did you fix it?',
          'If you had more time, what would you improve?',
          'What did you learn about testing and reliability?',
        ],
      },
    ],
    keyQuestions: [],
  },
];

/* ── Extension lesson ────────────────────────────────────── */

const EXTENSION = {
  id: 'extension',
  title: 'Extension — Data Logging',
  topic: 'Data persistence, CSV, file systems',
  time: '45',
  hardware: ['micro:bit V1 or V2', 'Maqueen', 'USB cable'],
  objectives: [
    'Understand the difference between RAM and file storage',
    'Log sensor data during a run and retrieve it afterwards',
    'Analyse logged data (V2 extension)',
  ],
  v1Code: `from microbit import *
from machine import time_pulse_us

i2c.init(freq=100000, sda=pin20, scl=pin19)
sleep(500)

def distance_cm():
    pin2.read_digital()
    pin1.write_digital(0)
    sleep(5)
    pin1.write_digital(1)
    sleep(10)
    pin1.write_digital(0)
    sleep(5)
    t = time_pulse_us(pin2, 1, 50000)
    if t < 10:
        return 0
    return t / 58

def line_left():
    return pin13.read_digital()
def line_right():
    return pin14.read_digital()

def motor(m, direction, speed):
    try:
        i2c.write(0x10, bytearray([0x00 if m == 0 else 0x02, direction, speed]))
    except:
        pass

def stop():
    motor(0, 0, 0); motor(1, 0, 0)

def forward(speed=200):
    motor(0, 0, speed); motor(1, 0, speed)

def turn_left(speed=180):
    motor(0, 1, speed); motor(1, 0, speed)

def turn_right(speed=180):
    motor(0, 0, speed); motor(1, 1, speed)

log_data = []

def log(label, value):
    log_data.append(label + ": " + str(value))

def dump_log():
    print("=== LOG DUMP ===")
    for entry in log_data:
        print(entry)
    print("=== END ===")

while True:
    d = distance_cm()
    log("distance", int(d))
    log("line_left", line_left())
    log("line_right", line_right())

    if d == 0 or d < 30:
        stop()
        display.show(Image.NO)
        log("state", "STOP")
    else:
        forward()
        display.show(Image.ARROW_N)
        log("state", "FORWARD")

    if button_a.was_pressed():
        stop()
        dump_log()
        break

    sleep(200)`,
  v2Code: `from microbit import *
from machine import time_pulse_us

i2c.init(freq=100000, sda=pin20, scl=pin19)
sleep(500)

def distance_cm():
    pin2.read_digital()
    pin1.write_digital(0)
    sleep(5)
    pin1.write_digital(1)
    sleep(10)
    pin1.write_digital(0)
    sleep(5)
    t = time_pulse_us(pin2, 1, 50000)
    if t < 10:
        return 0
    return t / 58

def line_left():
    return pin13.read_digital()
def line_right():
    return pin14.read_digital()

def motor(m, direction, speed):
    try:
        i2c.write(0x10, bytearray([0x00 if m == 0 else 0x02, direction, speed]))
    except:
        pass

def stop():
    motor(0, 0, 0); motor(1, 0, 0)

def forward(speed=200):
    motor(0, 0, speed); motor(1, 0, speed)

def turn_left(speed=180):
    motor(0, 1, speed); motor(1, 0, speed)

def turn_right(speed=180):
    motor(0, 0, speed); motor(1, 1, speed)

LOG_FILE = "log.csv"

def init_log():
    with open(LOG_FILE, "w") as f:
        f.write("state,distance,line_left,line_right\\n")

def log(state, d):
    with open(LOG_FILE, "a") as f:
        f.write(state + "," + str(int(d)) + "," +
                str(line_left()) + "," + str(line_right()) + "\\n")

def dump_log():
    print("=== LOG DUMP ===")
    with open(LOG_FILE, "r") as f:
        for line in f:
            print(line.strip())
    print("=== END ===")

init_log()
display.show(Image.YES)
sleep(1000)

while True:
    d = distance_cm()

    if d == 0 or d < 30:
        stop()
        display.show(Image.NO)
        log("STOP", d)
    else:
        forward()
        display.show(Image.ARROW_N)
        log("FORWARD", d)

    if button_a.was_pressed():
        stop()
        dump_log()
        break

    if button_b.was_pressed():
        init_log()
        display.show(Image.SURPRISED)
        sleep(500)

    sleep(200)`,
  comparisonTable: {
    headers: ['', 'V1', 'V2'],
    rows: [
      ['Storage', 'RAM only', 'File on device'],
      ['Survives power off', '✗', '✓'],
      ['Format', 'Plain text', 'CSV'],
      ['Open in Excel / Sheets', '✗', '✓'],
      ['Button A', 'Dump to serial', 'Dump to serial'],
      ['Button B', '—', 'Clear log file'],
    ],
  },
  extensionQuestions: [
    'Why does V1 lose its data when unplugged?',
    'What is CSV format and why is it useful?',
    'How would you open <code>log.csv</code> in Excel or Google Sheets?',
    'What else would you want to log — speed? time? turn direction?',
    'How many readings can V2 store before running out of space?',
    'How could you add a timestamp using <code>running_time()</code>?',
  ],
};

/* ── Movement challenges ─────────────────────────────────── */

const CHALLENGES = [
  {
    number: 1,
    title: 'U-Turn on Obstacle',
    description: 'When an obstacle is detected, spin 180° and go the other way.',
    hint: 'How long do you need to spin to turn 180 degrees? (Think about your calibrated 90° value from Lesson 4.)',
    code: `stop()
sleep(300)
turn_right(200)
sleep(???)        # figure out the timing for 180 degrees
forward()`,
  },
  {
    number: 2,
    title: 'Two Strike — Slow then Stop',
    description: 'Slow down on first detection, stop on second. You need to remember what happened last time around the loop.',
    hint: 'You need a variable to track whether you have already slowed down — a "state" variable.',
    code: `half_speed = ???
motor(0, 0, half_speed)
motor(1, 0, half_speed)
sleep(500)
d2 = distance_cm()
if d2 == ??? or d2 < ???:
    stop()`,
  },
  {
    number: 3,
    title: 'Veer Left at 10 cm',
    description: 'Detect the obstacle at 10 cm and veer left slightly, rather than making a full turn.',
    hint: 'How do you make the robot veer without a full turn? Try running one motor slower than the other.',
    code: `if d == 0 or d < ???:
    motor(0, 0, ???)    # left motor slower
    motor(1, 0, ???)    # right motor faster
    sleep(???)          # how long to veer 20 degrees?`,
  },
  {
    number: 4,
    title: 'Wait, Wonder, then Rotate',
    description: 'Stop, show ? for 5 seconds, rotate right just 10°, then continue.',
    hint: 'How do you show a custom character on the display? How many milliseconds is 5 seconds?',
    code: `stop()
display.show("?")
sleep(???)             # 5 seconds in milliseconds?
turn_right(???)        # what speed for a gentle rotation?
sleep(???)             # how long for just 10 degrees?
forward()`,
  },
];

/* ── Curriculum links ────────────────────────────────────── */

const CURRICULUM = [
  { lesson: 'Lesson 1', concepts: 'Sequencing, variables, loops' },
  { lesson: 'Lesson 2', concepts: 'Input/output, data types, debugging' },
  { lesson: 'Lesson 3', concepts: 'Selection (if/else), thresholds' },
  { lesson: 'Lesson 4', concepts: 'Nested conditionals, iteration' },
  { lesson: 'Lesson 5', concepts: 'Decomposition, abstraction, planning' },
  { lesson: 'Lesson 6', concepts: 'Data collection, pattern recognition' },
  { lesson: 'Lesson 7', concepts: 'Integration, testing, iteration' },
  { lesson: 'Lesson 8', concepts: 'Edge cases, reliability, tolerances' },
  { lesson: 'Lesson 9', concepts: 'Assessment, reflection' },
  { lesson: 'Extension', concepts: 'File I/O, data persistence, CSV' },
];
