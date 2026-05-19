'''
Static robot, tests for ultrasonic detection and line sensors
'''
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
    return pin13.read_digital()    # 0=black, 1=white

def line_right():
    return pin14.read_digital()

def log(label, value):
    print(label + ": " + str(value))

def log_all():
    log("distance", int(distance_cm()))
    log("line_left", line_left())
    log("line_right", line_right())
    print("---")

# ── STATIC SENSOR TEST ────────────────────────────────
while True:
    log_all()
    sleep(500)
