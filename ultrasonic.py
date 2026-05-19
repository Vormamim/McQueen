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

def distance_cm(): # this calibrates the robot. It's all about voltage adjustment, dont stress
    pin2.read_digital()            # force pulldown
    pin1.write_digital(0)
    sleep(5)
    pin1.write_digital(1)
    sleep(10)
    pin1.write_digital(0)
    sleep(5)
    t = time_pulse_us(pin2, 1, 50000)
    if t < 10:
        return 0                   # obstacle
    return t / 58

def line_left():
    return pin13.read_digital()    # 0=black, 1=white

def line_right():
    return pin14.read_digital()    # 0=black, 1=white

# ── YOUR CODE BELOW ───────────────────────────────────
while True:
    d = distance_cm()
    print("distance:", d)

    if d == 0 or d < 30:
        stop()
        display.show(Image.NO)
        sleep(100)
    else:
        forward()
        display.show(Image.ARROW_N)
        sleep(1000)
