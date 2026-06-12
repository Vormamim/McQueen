from microbit import *
import radio

#Receiver Microbit plugged into USB on PC

radio.config(group=1)
radio.on()

display.show(Image.YES)
sleep(500)
display.clear()

print("seq,time_ms,ax,ay,az")

while True:
    msg = radio.receive()
    if msg:
        print(msg)
        display.show(Image.ARROW_W)
        sleep(50)
        display.clear()