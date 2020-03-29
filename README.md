# Raspberry Pi Light Switch

This is a simple Node.js server that uses a websocket (websocket.io) to interact with a raspberry pi. Most of the code is taken from [here](https://www.w3schools.com/nodejs/nodejs_raspberrypi.asp). Right now, I am using the onoff module with the websocket to allow me to use the raspberry pi as a light switch. I have two LED lights connected to a breadboard that is plugged into the raspberry pi. 

I used [this](https://weworkweplay.com/play/raspberry-pi-nodejs/) tutorial to set up the pi to run when booting up.

How to use:
`git clone https://github.com/DCU4/light-switch.git light-switch`\
`cd light-switch`\
`npm install`\
`node app.js`\

