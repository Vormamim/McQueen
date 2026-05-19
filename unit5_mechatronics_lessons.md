# 🤖 Maqueen Robotics — MicroPython Lesson Unit
### DFRobot Maqueen v4.1 · micro:bit V1 & V2 · MicroPython

---

## Hardware Reference

| Component | Pin | Notes |
|---|---|---|
| Motor controller (I²C) | P19 (SCL), P20 (SDA) | Always call `i2c.init()` first |
| Ultrasonic Trig | P1 | SR04 5V version |
| Ultrasonic Echo | P2 | Returns 0 = obstacle, ~210 = clear |
| IR Line sensor Left | P13 | 0 = black, 1 = white |
| IR Line sensor Right | P14 | 0 = black, 1 = white |
| Red LED Left | P8 | Digital out |
| Red LED Right | P12 | Digital out |
| Buzzer | P0 | Disable via physical switch if needed |
| Servo S1 | P1 | Shared with Ultrasonic — don't use both |
| Servo S2 | P2 | Shared with Echo — don't use both |

> ⚠️ Always keep `i2c.init(freq=100000, sda=pin20, scl=pin19)` in your code even when not using motors — it is required for the ultrasonic sensor pins to work correctly.

---

## Base Code

Copy this into every lesson as the starting point. Students modify the `YOUR CODE BELOW` section only.

```python
from microbit import *
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
    pass
```

---

## Lesson 1 — Hello Robot
**Topic:** Sequencing, motors, direction, speed
**Time:** 45 minutes
**Hardware:** Maqueen + micro:bit + batteries

### Learning Objectives
- Understand how to flash code to the micro:bit
- Control motor direction and speed
- Understand the relationship between `sleep()` and distance

### Starter
Place the robot on the floor. Ask students: *"How would you describe to someone who has never seen a robot how to make it move in a square?"* Collect answers — look for sequencing language.

### Tasks

**Task 1 — First Flash**
Add this to the base code and flash it:
```python
while True:
    forward()
    sleep(1000)
    stop()
    sleep(500)
```
Observe what happens. What does `sleep(1000)` mean?

**Task 2 — Speed Experiments**
Change the speed value in `forward(speed=200)`. Try 50, 100, 200, 255.
- What is the slowest speed the motors will actually turn?
- What happens at 255?
- Record your results in the table below.

| Speed value | Observed behaviour |
|---|---|
| 50 | |
| 100 | |
| 200 | |
| 255 | |

**Task 3 — Draw a Square**
Make the robot drive in a square. You will need:
- `forward()` — move forward
- `turn_right()` — turn
- `sleep()` — control timing
- `stop()` — stop

> 💡 Hint: a square has 4 sides and 4 corners. Each corner is 90 degrees.

**Challenge:** Make the robot drive exactly 1 metre and stop. How did you work out the `sleep()` value?

### Key Questions
- What is the difference between `speed` and `sleep()`?
- Why does the robot not always travel the same distance at the same speed?
- What real-world factors affect the robot's movement?

---

## Lesson 2 — Sensing the World
**Topic:** Input, output, variables, serial monitor
**Time:** 45 minutes
**Hardware:** Maqueen + micro:bit + USB cable + batteries (optional — static test works fine)

### Learning Objectives
- Understand what a sensor is and what it returns
- Read sensor values using the serial monitor
- Identify patterns in sensor data

### Starter
Hold up the ultrasonic sensor. Ask: *"How do you think this works? What animals use the same idea?"* (Bats, dolphins — echolocation.)

### Static Test Code
No motors needed for this lesson. Use this code:

```python
from microbit import *
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
    sleep(500)
```

Open the **Serial** button in the editor to see live values.

### Tasks

**Task 1 — Ultrasonic Experiments**
With the serial monitor open, wave your hand in front of the sensor.

| Hand distance (estimated) | Value shown |
|---|---|
| Touching | |
| 10cm | |
| 30cm | |
| 50cm | |
| No obstacle | |

- What is the maximum reliable range?
- What does the sensor return when there is no obstacle?
- What does 0 mean?

**Task 2 — Line Sensor Experiments**
Slide a piece of black paper under the robot. Watch the values change.

| Surface | line_left | line_right |
|---|---|---|
| White | | |
| Black | | |
| Half and half | | |

**Task 3 — Display Zones**
Make the display show a letter based on distance — without moving the robot:
- `F` when distance is far (over 100cm)
- `M` when distance is medium (30–100cm)
- `N` when distance is near (under 30cm)

> 💡 Hint: you need an `if`, `elif`, and `else`

**Challenge:** Add a fourth zone — show `X` when the sensor returns 0 (obstacle touching)

### Key Questions
- Why does the sensor return 0 instead of a very small number when something is very close?
- What is the difference between a digital and analogue sensor?
- Why might sensor readings vary even when nothing has moved?

---

## Lesson 3 — Make a Decision
**Topic:** If/else, thresholds, conditionals
**Time:** 45 minutes
**Hardware:** Maqueen + micro:bit + batteries

### Learning Objectives
- Use if/else to make the robot respond to sensor data
- Understand the concept of a threshold
- Combine sensor input with motor output

### Starter
Show students a simple flowchart: *"If it is raining → take umbrella, else → leave umbrella."* Ask them to draw a flowchart for the robot stopping at an obstacle before writing any code.

### Tasks

**Task 1 — Stop on Detection**
Add this to the base code:
```python
while True:
    d = distance_cm()

    if d == 0 or d < 30:
        stop()
        display.show(Image.NO)
    else:
        forward()
        display.show(Image.ARROW_N)

    sleep(100)
```
Test it. Does it stop reliably?

**Task 2 — Threshold Experiments**
Change the `30` in `d < 30` to different values. Record what happens.

| Threshold (cm) | Behaviour |
|---|---|
| 10 | |
| 30 | |
| 60 | |
| 100 | |

- What threshold works best for your robot?
- Why might a higher threshold be useful in the real world?

**Task 3 — Three Zone Response**
Make the robot respond differently in three zones:
- Far (over 60cm) — full speed forward
- Medium (20–60cm) — half speed forward
- Near (under 20cm) — stop

> 💡 Hint: `forward(100)` sets speed to 100

**Challenge:** Add the display — show a different image for each zone

### Key Questions
- What is a threshold and why does it matter?
- What happens if the threshold is too low? Too high?
- How does this relate to real self-driving car systems?

---

## Lesson 4 — React and Recover
**Topic:** Loops, state, sequential logic
**Time:** 45 minutes
**Hardware:** Maqueen + micro:bit + batteries + open floor space

### Learning Objectives
- Make the robot take a sequence of actions after detecting an obstacle
- Understand timing and how it affects turns
- Experiment with the 4 challenge snippets

### Starter
Ask: *"When a robot detects an obstacle, stopping is not enough — what else might it need to do?"* Collect ideas — turn, reverse, find another route.

### Tasks

**Task 1 — Stop and Turn**
After stopping, add a turn:
```python
while True:
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

    sleep(100)
```
Does the turn feel like 90 degrees? Adjust `sleep(500)` until it is close to 90 degrees.

**Task 2 — Calibrate Your Turn**
Find the `sleep()` value that gives you the closest to:

| Target angle | sleep() value found |
|---|---|
| 45 degrees | |
| 90 degrees | |
| 180 degrees | |

> 💡 Note: this will vary between robots depending on battery level and surface

### Challenge Snippets
Pick one of the four challenges below and integrate it into the base code. You must work out where it goes and what the `???` values should be.

**Challenge 1 — U-Turn on obstacle**
```python
stop()
sleep(300)
turn_right(200)
sleep(???)        # figure out the timing for 180 degrees
forward()
```

**Challenge 2 — Two strike slow then stop**
```python
half_speed = ???
motor(0, 0, half_speed)
motor(1, 0, half_speed)
sleep(500)
d2 = distance_cm()
if d2 == ??? or d2 < ???:
    stop()
```

**Challenge 3 — Veer left at 10cm**
```python
if d == 0 or d < ???:
    motor(0, 0, ???)    # left motor slower
    motor(1, 0, ???)    # right motor faster
    sleep(???)          # how long to veer 20 degrees?
```

**Challenge 4 — Wait, wonder, then rotate**
```python
stop()
display.show("?")
sleep(???)             # 5 seconds in milliseconds?
turn_right(???)        # what speed for a gentle rotation?
sleep(???)             # how long for just 10 degrees?
forward()
```

### Key Questions
- Why does the turn angle vary between runs?
- What real-world factors affect turning consistency?
- How could you make turns more reliable without extra sensors?

---

## Lesson 5 — The Wall Problem
**Topic:** Problem decomposition, planning, flowcharts
**Time:** 45 minutes
**Hardware:** Maqueen + micro:bit + cardboard wall with 30cm gap

### Learning Objectives
- Decompose a complex navigation problem into steps
- Plan a solution before writing code
- Understand what data the robot needs and when

### Setup
Build a wall from cardboard or books across the table with a 30cm gap. The robot starts 50cm back, facing the wall.

### Starter
Show students the wall. Ask: *"How would you find the gap if you were blindfolded and could only use your hands?"* Map their answers to robot sensor equivalents.

### No Coding This Lesson — Planning Only

**Task 1 — Observation**
Answer these questions by thinking, not coding:
- What does the robot sense as it approaches a solid wall?
- What changes in the sensor data when it reaches the gap?
- How does it know the gap is wide enough to drive through?
- What does it need to do when it finds the gap?

**Task 2 — Flowchart**
Draw a flowchart for the robot navigating the gap. Your flowchart must include:
- Start
- Driving toward the wall
- Detecting the wall
- Detecting the gap
- Deciding to turn
- Driving through
- End

**Task 3 — Data Prediction**
Predict what the serial monitor will show at each stage:

| Stage | Predicted distance value |
|---|---|
| Starting position (50cm back) | |
| Approaching wall (10cm away) | |
| At the gap | |
| Through the gap | |

**Challenge:** Write pseudocode (plain English steps) for the full navigation sequence before next lesson

### Key Questions
- What is the minimum sensor information you need to solve this problem?
- What could go wrong with your plan?
- How do engineers test robot navigation systems safely?

---

## Lesson 6 — Measuring the Gap
**Topic:** Data collection, loops, patterns in data
**Time:** 45 minutes
**Hardware:** Maqueen + micro:bit + USB cable + cardboard wall with gap

### Learning Objectives
- Collect sensor data from a moving robot
- Identify patterns that indicate the gap
- Detect the gap in code before attempting to navigate it

### Setup
Same wall as Lesson 5. Robot drives slowly along the wall (parallel, not toward it) while logging to serial.

### Tasks

**Task 1 — Drive and Log**
Drive the robot slowly along the wall and watch the serial monitor:
```python
while True:
    d = distance_cm()
    log("distance", int(d))
    forward(80)                    # slow speed
    sleep(100)
```

Record what the distance values look like at:
- Solid wall section
- Approaching the gap
- At the gap
- Past the gap

**Task 2 — Spot the Gap**
From your data, answer:
- What distance value reliably signals the gap?
- At what point does the robot need to start reacting?
- How many consecutive readings do you need before you are confident it is a gap?

**Task 3 — Signal the Gap**
Without turning yet — make the robot beep or show a symbol the moment it detects the gap:
```python
while True:
    d = distance_cm()
    forward(80)

    if d > ???:                    # gap detected
        stop()
        display.show(Image.SURPRISED)
        break

    sleep(100)
```

**Challenge:** Make it only trigger after 3 consecutive gap readings — to avoid false positives

### Key Questions
- Why might a single reading not be reliable enough to act on?
- What is a false positive and why is it dangerous in robotics?
- How do self-driving cars handle noisy sensor data?

---

## Lesson 7 — Turning Into the Gap
**Topic:** Timing, angles, trial and error
**Time:** 45 minutes
**Hardware:** Maqueen + micro:bit + batteries + wall with gap

### Learning Objectives
- Use calibrated turn timing from Lesson 4 to navigate the gap
- Combine detection and movement into a full sequence
- Test and iterate to improve reliability

### Tasks

**Task 1 — Full Navigation Attempt**
Using your gap detection from Lesson 6 and your turn calibration from Lesson 4, write the full sequence:

```python
while True:
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

    sleep(100)
```

Fill in the `???` values from your earlier experiments.

**Task 2 — Success Rate**
Run the navigation 5 times. Record the result each time.

| Run | Result | Notes |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |
| 5 | | |

- What is your success rate?
- What causes it to fail?
- What could you adjust to improve it?

**Challenge:** Make it work 3 times in a row without touching the walls

### Key Questions
- Why is consistency harder to achieve than just getting it right once?
- What variables affect the outcome between runs?
- How do engineers measure robot reliability?

---

## Lesson 8 — Making It Reliable
**Topic:** Edge cases, debugging, tolerance
**Time:** 45 minutes
**Hardware:** Maqueen + micro:bit + batteries + wall with adjustable gap

### Learning Objectives
- Identify and handle edge cases
- Add confirmation checks to improve reliability
- Test with different gap sizes

### Tasks

**Task 1 — Confirmation Check**
Add a check — only commit to the turn if the gap is detected 3 times in a row:
```python
gap_count = 0

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

    sleep(100)
```

Does this improve reliability?

**Task 2 — Variable Gap Size**
Test your code with different gap sizes:

| Gap size | Success? | Notes |
|---|---|---|
| 40cm | | |
| 30cm | | |
| 20cm | | |
| 15cm | | |

- What is the minimum gap your robot can reliably navigate?
- What limits it?

**Task 3 — Approach Angle**
Start the robot at an angle to the wall instead of parallel. Does it still work? What breaks?

**Challenge:** Add a second sensor check after turning — confirm the robot is actually facing the gap before driving through

### Key Questions
- What is an edge case and why do engineers spend so much time on them?
- What is the difference between a robot that works and a robot that is reliable?
- What would need to change to handle a gap at a different position along the wall?

---

## Lesson 9 — Autonomous Navigation Challenge
**Topic:** Full integration, assessment
**Time:** 60 minutes
**Hardware:** Maqueen + micro:bit + batteries + wall with gap in unknown position

### Learning Objectives
- Demonstrate full autonomous navigation
- Apply all concepts from the unit
- Reflect on the engineering process

### Setup
The gap is placed in a position students have not practised with. They have one preparation period, then three attempts.

### Assessment Criteria

| Criteria | Marks |
|---|---|
| Robot detects the wall | 2 |
| Robot finds the gap | 3 |
| Robot navigates through without touching | 3 |
| Robot continues forward after the gap | 2 |
| **Total** | **10** |

### Bonus Marks ⭐
- Works with gap in two different positions: +2
- Works with gap size reduced to 20cm: +2
- Robot logs its decisions to serial or file: +2

### Reflection Questions
After the challenge, students answer:
1. What worked well in your final code?
2. What was the hardest problem to solve and how did you fix it?
3. If you had more time, what would you improve?
4. What did you learn about testing and reliability?

---

## Extension Lesson — Data Logging
**Topic:** Data persistence, CSV, file systems
**Time:** 45 minutes
**Hardware:** micro:bit V1 or V2 + Maqueen + USB cable

### Learning Objectives
- Understand the difference between RAM and file storage
- Log sensor data during a run and retrieve it afterwards
- Analyse logged data (V2 extension)

### V1 — Button Dump Method
Data is held in memory during the run. Press **Button A** to dump to serial at the end.

```python
from microbit import *
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

    sleep(200)
```

### V2 — File Storage Method ⭐
Data is saved to a CSV file on the micro:bit. Survives power off. Can be read back anytime.

```python
from microbit import *
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
        f.write("state,distance,line_left,line_right\n")

def log(state, d):
    with open(LOG_FILE, "a") as f:
        f.write(state + "," + str(int(d)) + "," +
                str(line_left()) + "," + str(line_right()) + "\n")

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

    sleep(200)
```

### Comparison Table

| | V1 | V2 |
|---|---|---|
| Storage | RAM only | File on device |
| Survives power off | ❌ | ✅ |
| Format | Plain text | CSV |
| Open in Excel/Sheets | ❌ | ✅ |
| Button A | Dump to serial | Dump to serial |
| Button B | — | Clear log file |

### Extension Questions
1. Why does V1 lose its data when unplugged?
2. What is CSV format and why is it useful?
3. How would you open `log.csv` in Excel or Google Sheets?
4. What else would you want to log — speed? time? turn direction?
5. How many readings can V2 store before running out of space?
6. How could you add a timestamp using `running_time()`?

---

## Curriculum Links

| Lesson | Computing concepts |
|---|---|
| 1 | Sequencing, variables, loops |
| 2 | Input/output, data types, debugging |
| 3 | Selection (if/else), thresholds |
| 4 | Nested conditionals, iteration |
| 5 | Decomposition, abstraction, planning |
| 6 | Data collection, pattern recognition |
| 7 | Integration, testing, iteration |
| 8 | Edge cases, reliability, tolerances |
| 9 | Assessment, reflection |
| Extension | File I/O, data persistence, CSV |

---

*DFRobot Maqueen v4.1 · micro:bit MicroPython · python.microbit.org/v/3*
