from microbit import *
from machine import time_pulse_us
import neopixel

i2c.init(freq=100000, sda=pin20, scl=pin19)
sleep(500)

np = neopixel.NeoPixel(pin15, 4)

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
    pin1.write_digital(0)
    sleep(1)
    pin1.write_digital(1)
    sleep(1)
    pin1.write_digital(0)
    t = time_pulse_us(pin1, 1, 50000)
    return t / 58 if t > 0 else 999

def line_left():
    return pin13.read_digital()    # 0=black, 1=white

def line_right():
    return pin14.read_digital()    # 0=black, 1=white

def leds(r, g, b):
    np.fill((r, g, b)); np.show()

def leds_off():
    np.fill((0, 0, 0)); np.show()

# ── OBSTACLE AVOIDANCE ───────────────────────────────
while True:
    d = distance_cm()
    display.scroll(str(int(d)))    # shows distance on LED matrix

    if d < 20:                     # obstacle closer than 20cm
        stop()
        leds(255, 0, 0)            # red = danger
        sleep(300)
        turn_right()               # turn away
        sleep(500)
    else:
        forward()
        leds(0, 255, 0)            # green = all clear
    
    sleep(100)
