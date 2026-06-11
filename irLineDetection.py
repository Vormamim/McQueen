from microbit import *

# Explicitly disable internal micro:bit pull-up/pull-down resistors
# This forces the micro:bit to only read the exact voltage from the Maqueen hardware
pin13.set_pull(pin13.NO_PULL)
pin14.set_pull(pin14.NO_PULL)

while True:
    line_l = pin13.read_digital()
    line_r = pin14.read_digital()
    
    # 1. Print values to your editor's Serial Monitor (REPL)
    print("L:", line_l, " | R:", line_r)
    
    # 2. Fast visual display check
    if line_l == 0 and line_r == 0:
        display.show("B")  # Both sensors see Black
    elif line_l == 1 and line_r == 1:
        display.show("W")  # Both sensors see White
    else:
        display.show("-")  # Mixed states (one black, one white)
        
    sleep(150)
