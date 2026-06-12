from microbit import *

# motors.py — simple motor control API for Maqueen

def init_motors():
    try:
        i2c.init(freq=100000, sda=pin20, scl=pin19)
        sleep(200)
    except:
        pass


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

# convenience init on import
init_motors()
