from microbit import *
from machine import time_pulse_us
from utime import sleep_us

i2c.init(freq=100000, sda=pin20, scl=pin19)
sleep(500)

# Explicitly configure the Echo pin's electrical pulling behavior 
# to keep machine.time_pulse_us from locking up.
pin2.set_pull(pin2.NO_PULL)

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
    # 1. Ensure trigger is low and stable
    pin1.write_digital(0)
    sleep_us(2)
    
    # 2. Fire a clean 10-microsecond high trigger pulse
    pin1.write_digital(1)
    sleep_us(10)
    pin1.write_digital(0)
    
    # 3. Read the high-pulse response time (timeout set to 30000us)
    t = time_pulse_us(pin2, 1, 30000)
    
    # If the sensor timed out (returns negative values), default safely to 0
    if t < 0:
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
    d = distance_cm()
    
    # Optional debugging line: un-comment to monitor values in your console
    # log("Distance Reading", d)

    if d <50:
        stop()
        display.show(Image.NO)
    else:
        forward()
        display.show(Image.ARROW_N)

    sleep(100)
