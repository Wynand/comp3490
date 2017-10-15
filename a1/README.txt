CS3490 Assignment 1: Claw Machine (Barebones Edition)

/**********************************************************************
* What is your name and student number?
***********************************************************************/

 Wynand Badenhorst
 7754210

/**********************************************************************
* What browser and OS did you use to develop / test?
***********************************************************************/

 Windows 10, insider preview w/ Chrome
 Ubuntu 16.04LTS w/ Chrome
 MacOSX w/ Chromed

 /**********************************************************************
 * Which components of the assignment do you feel you have completed.
 **********************************************************************/
Keep one of the 3 options below, and delete the other two. The intention of this
is that nobody receives a grade that's way out of line with expectations
due to technical difficulties.
 
i. Box with supports and a top: (Fully Completed)
ii. Console, joystick, guards and prize bin: (Fully Completed)
iii. Arrow keys cause joystick to bend: (Fully Completed)
iv: Claw mechanism, created in a hierarchical manner: (Fully Completed)
v: Keyboard allows claw to move (in xz plane): (Fully Completed)
vi: Spacebar drops claw (in y plane): (Fully Completed)
vii. Pressing "v" changes viewpoint: (Fully Completed)

/**********************************************************************
 * List any additional comments that you feel may be relevant.
 **********************************************************************/

 Other controls are :
 Q = down
 E = up
 W = forward
 S = backward
 A = left
 D = right

The guards are glass.
A hierarchy of the claw assembly was achieved with the THREE.js 'Groups' and also functions to create components.
The view is lock when in 'egocentric' mode, however you can still navigate with the mouse in 'generic' mode.

To dynamically update the components, the functions to update them were added to an array of functions called every iteration.