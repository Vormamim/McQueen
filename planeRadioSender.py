from microbit import *
import radio

#this is the sender. It needs to use a battery pack and be on the plane. It sends the accelerometer data over radio to the receiver micro:bit which is plugged into the PC.

radio.config(group=1)
radio.on()

display.show(Image.HAPPY)
sleep(500)
display.clear()

count = 0

while True:
    t = running_time()
    ax = accelerometer.get_x()
    ay = accelerometer.get_y()
    az = accelerometer.get_z()

    msg = "{},{},{},{},{}".format(count, t, ax, ay, az)
    radio.send(msg)

    display.show(Image.ARROW_E)
    sleep(50)
    display.clear()

    count += 1
    sleep(200)