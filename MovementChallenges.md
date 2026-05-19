## Challenge 1 — U-Turn on obstacle

```When obstacle detected, spin 180 and go the other way
# HINT: how long do you need to spin to turn 180 degrees?
stop()
sleep(300)
turn_right(200)
sleep(???)        # figure out the timing for 180 degrees
forward()
```

## Challenge 2 — Two strike slow then stop

Slow down on first detection, stop on second
HINT: you need to remember what happened last time around the loop
```
half_speed = ???
motor(0, 0, half_speed)
motor(1, 0, half_speed)
sleep(500)
d2 = distance_cm()
if d2 == ??? or d2 < ???:
    stop()
```

## Challenge 3 — Veer left at 10cm

Detect obstacle at 10cm and veer left slightly
HINT: how do you make the robot veer without a full turn?

```
if d == 0 or d < ???:
    motor(0, 0, ???)    # left motor slower
    motor(1, 0, ???)    # right motor faster
    sleep(???)          # how long to veer 20 degrees?
```

## Challenge 4 — Wait, wonder, then rotate

Stop, show ? for 5 seconds, rotate right 10% then continue
HINT: how do you show a custom character on the display?
```
stop()
display.show("?")
sleep(???)             # 5 seconds in milliseconds?
turn_right(???)        # what speed for a gentle 10% rotation?
sleep(???)             # how long for just 10 degrees?
forward()
```
