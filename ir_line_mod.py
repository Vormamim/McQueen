from microbit import *

# ir_line_mod.py — IR line sensor helpers

# Explicitly disable internal micro:bit pull-up/pull-down resistors
pin13.set_pull(pin13.NO_PULL)
pin14.set_pull(pin14.NO_PULL)


def read_line():
    """Return (left, right) where each is 0 for black, 1 for white."""
    return (pin13.read_digital(), pin14.read_digital())


def display_state(left, right):
    if left == 0 and right == 0:
        display.show("B")
    elif left == 1 and right == 1:
        display.show("W")
    else:
        display.show("-")

