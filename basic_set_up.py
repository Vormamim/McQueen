import microbit
import lib_robot_maqueen as mqn
import time #can be removed if not used

mq = mqn.MaqueenPlus()

def move(speed, dir):
    """
    speed(pwm) : 0 -> 255
    dir(string) : "F" or "B" or "L" or "R"
    """

mq.move(70, "F")
time.sleep(1) #wait for 1s
mq.move(70, "R")