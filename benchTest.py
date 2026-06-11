from microbit import *
import music
import machine
import neopixel

# --- REGISTRY & I2C DEFINITIONS ---
LITE_I2C_ADDR = 0x10
LITE_LEFT_REG = 0x00
LITE_RIGHT_REG = 0x02

PLUS_I2C_ADDR = 0x10
PLUS_LEFT_REG = 0x01
PLUS_RIGHT_REG = 0x02

i2c.init(freq=100000, sda=pin20, scl=pin19)

# !!! SET TO TRUE IF USING MAQUEEN PLUS V2, FALSE FOR LITE V4.1 !!!
IS_PLUS_V2 = False  

def set_motor(left_speed, right_speed):
    dir_l = 0 if left_speed >= 0 else 1
    dir_r = 0 if right_speed >= 0 else 1
    speed_l = min(abs(left_speed), 255)
    speed_r = min(abs(right_speed), 255)
    
    try:
        if IS_PLUS_V2:
            d_l = 1 if left_speed >= 0 else 2
            d_r = 1 if right_speed >= 0 else 2
            i2c.write(PLUS_I2C_ADDR, bytes([PLUS_LEFT_REG, d_l, speed_l]))
            i2c.write(PLUS_I2C_ADDR, bytes([PLUS_RIGHT_REG, d_r, speed_r]))
        else:
            i2c.write(LITE_I2C_ADDR, bytes([LITE_LEFT_REG, dir_l, speed_l]))
            i2c.write(LITE_I2C_ADDR, bytes([LITE_RIGHT_REG, dir_r, speed_r]))
    except:
        pass

def stop_motors():
    if IS_PLUS_V2:
        try:
            i2c.write(PLUS_I2C_ADDR, bytes([PLUS_LEFT_REG, 0, 0]))
            i2c.write(PLUS_I2C_ADDR, bytes([PLUS_RIGHT_REG, 0, 0]))
        except:
            pass
    else:
        set_motor(0, 0)

def set_headlights(left_on, right_on):
    pin8.write_digital(1 if left_on else 0)
    pin12.write_digital(1 if right_on else 0)

def get_distance():
    pin1.write_digital(1)
    sleep(0.01)
    pin1.write_digital(0)
    duration = machine.time_pulse_us(pin2, 1, 30000)
    if duration < 0:
        return 999
    return duration / 58.2

def get_line_sensors():
    return pin13.read_digital(), pin14.read_digital()

# Setup RGB lights object globally
rgb_lights = neopixel.NeoPixel(pin15, 4)

def clear_rgb():
    for i in range(4):
        rgb_lights[i] = (0, 0, 0)
    rgb_lights.show()

# --- STEP 1: MOTOR TEST ---
display.show("1")
music.play(music.DADADADUM, wait=True)

set_motor(150, 150)
sleep(1000)
set_motor(-150, -150)
sleep(1000)
set_motor(-150, 150)
sleep(1000)
set_motor(150, -150)
sleep(1000)
stop_motors()
sleep(500)

# --- STEP 2: RGB CHASSIS LIGHTS ---
display.show("2")
colors = [(255, 0, 0), (0, 255, 0), (0, 0, 255), (255, 255, 0)]

for color in colors:
    for i in range(4):
        rgb_lights[i] = color
        rgb_lights.show()
        sleep(100)
    sleep(200)
clear_rgb()

# --- STEP 3: HEADLIGHTS ---
display.show("3")
for _ in range(5):
    set_headlights(True, True)
    sleep(300)
    set_headlights(False, False)
    sleep(300)

# --- STEP 4: ULTRASONIC TEST (STATIONARY RADAR DETECT MODE) ---
display.show("4")
stop_motors()  # 1. Stop the motors completely

# 2. Start Detect phase tracking time for a 10-second window
step4_start_time = running_time()
last_ping_time = running_time()
flash_toggle = False

while running_time() - step4_start_time < 10000:  # Allow for 10 seconds of this
    dist = get_distance()
    
    if dist <= 15:
        # Object Detected: Flash RGB lights Red to indicate detection
        flash_toggle = not flash_toggle
        if flash_toggle:
            for i in range(4):
                rgb_lights[i] = (255, 0, 0) # Bright Red
        else:
            for i in range(4):
                rgb_lights[i] = (0, 0, 0)
        rgb_lights.show()
        
        # Fast, anxious alert pings when something is close
        if running_time() - last_ping_time > 150:
            music.pitch(2000, 30, wait=False)
            last_ping_time = running_time()
            
    else:
        # No object within 15cm: Clear lights, play standard slow sonar ping
        clear_rgb()
        if running_time() - last_ping_time > 500:
            music.pitch(3000, 20, wait=False)
            last_ping_time = running_time()
            
    sleep(50)

# 3. Then end Step 4 cleanly
clear_rgb()
music.play(music.BA_DING, wait=True)

# --- STEP 5: LINE DETECTION ---
display.show("5")
sleep(1000) 
set_motor(80, 80) 

while True:
    left_detect, right_detect = get_line_sensors()
    if left_detect == 1 or right_detect == 1:
        stop_motors()
        display.show(Image.HAPPY)
        music.play(music.ENTERTAINER, wait=True)
        break
    sleep(10)
