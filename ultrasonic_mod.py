from microbit import *
from machine import time_pulse_us

# ultrasonic_mod.py — sensor-only API

def init_ultrasonic():
    # no-op for now; kept for API symmetry
    pass


def distance_cm():
    # safe trigger/echo read for SR04-style ultrasonic sensor
    try:
        pin2.read_digital()            # force pulldown
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
    except Exception:
        return 0
