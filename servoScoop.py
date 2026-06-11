from microbit import *
# Servo requires GOOD battery to work well.

# Initialise Maqueen Plus V2 communication
i2c.init(freq=100000, sda=pin20, scl=pin19)

while True:
    # 1. Send S2 servo down to 0 degrees
    i2c.write(0x10, bytes([0x15, 0]))
    sleep(2000)
    
    # 2. Send S2 servo up to 90 degrees
    i2c.write(0x10, bytes([0x15, 90]))
    sleep(2000)
