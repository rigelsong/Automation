'use strict';

const robot = require('robotjs');
const screen = robot.getScreenSize();

const KEYPRESS_TIME_DEFAULT = 1000;
const ASSUMED_SCREEN_WIDTH = 1495;
const ASSUMED_SCREEN_HEIGHT = 897;
const ASSUMED_UPPER_LEFT_X = 10;
const ASSUMED_UPPER_LEFT_Y = 30;
const X_OFFSET = screen.width - ASSUMED_SCREEN_WIDTH;
const Y_OFFSET = screen.height - ASSUMED_SCREEN_HEIGHT;

const jsStart = Date.now();
const fs = require('fs');
console.log('script start');

const WINDOW_ACTIVATE_X = 100;
const WINDOW_ACTIVATE_Y = 100;
const USE = 'e';
const MOVE_UP = 'w';
const MOVE_LEFT = 'a';
const MOVE_DOWN = 's';
const MOVE_RIGHT = 'd';
const DROPDOWN = 'x';
const PARKOUR_UP_LEFT = 't';
const SWIM_LEFT = 'g';
const SWIM_RIGHT = 'h';
const THROW = 'q';
const JUMP = 'space';
const SLEEP = 'z';
const CLICK = 'c';
const HOTKEY1 = '1';
const HOTKEY2 = '2';
const HOTKEY3 = '3';
const HOTKEY4 = '4';
const HOTKEY5 = '5';
const HOTKEY6 = '6';
const ESCAPE = '+';
const SHIFT_CLICK = 'C';

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', inputStdin => {
    inputString += inputStdin;
});

process.stdin.on('end', _ => {
    inputString = inputString.replace(/\s*$/, '')
        .split(/\r?\n/)
        .map(str => str.replace(/\s*$/, ''));

    main();
});

function readLine() {
    return inputString[currentLine++];
}


async function main() {
	
	await click(WINDOW_ACTIVATE_X + X_OFFSET, WINDOW_ACTIVATE_Y + Y_OFFSET);

	let cmd = null;
	let cmdList = [];

	while (cmd = readLine()) {
		cmd = cmd.trim();
		if (cmd.length !== 0)
			cmdList.push(cmd);
	}

	let runScripts = true;
	while (runScripts) {
		runScripts = false;
		for (let el of cmdList) {
			let args = el.split(' ');
			console.log('Command in: ', args);
			if (args[0] == 'R') runScripts = true;
			if (! args[0].startsWith('-'))
				await invokeCmd(args[0], args[1], args[2], args[3]);
		}
	}

	async function invokeCmd (cmd, ...args) {

		switch (cmd) {
			case USE:
				await pressKey(USE, KEYPRESS_TIME_DEFAULT);
				break;
			case MOVE_UP:
				await pressKey(MOVE_UP, args[0]);
				break;
			case MOVE_RIGHT:
				await pressKey(MOVE_RIGHT, args[0]);
				break;
			case MOVE_DOWN:
				await pressKey(MOVE_DOWN, args[0]);
				break;
			case MOVE_LEFT:
				await pressKey(MOVE_LEFT, args[0]);
				break;
			case DROPDOWN:
				await pressMultipleKeys(MOVE_DOWN, 500 ,JUMP);
				break;
			case PARKOUR_UP_LEFT:
				await parkourUpLeft();
				break;
			case SWIM_LEFT:
				await swimLeft(JUMP, MOVE_LEFT);
				break;
			case SWIM_RIGHT:
				await swimRight(JUMP, MOVE_RIGHT);
				break;
			case THROW:
				await pressKey(THROW);
				break;
			case JUMP:
				await pressKey(JUMP);
				break;		
			case HOTKEY1:
				await pressKey(HOTKEY1);
				break;
			case HOTKEY2:
				await pressKey(HOTKEY2);
				break;
			case HOTKEY3:
				await pressKey(HOTKEY3);
				break;
			case HOTKEY4:
				await pressKey(HOTKEY4);
				break;
			case HOTKEY5:
				await pressKey(HOTKEY5);
				break;
			case HOTKEY6:
				await pressKey(HOTKEY6);
				break;
			case SLEEP:
				await sleep(args[0]);
				break;
			case CLICK:
				await click(args[0], args[1], args[2]);
				break;
			case SHIFT_CLICK:
				await shiftClick(args[0], args[1], args[2]);
				break;
			case ESCAPE:
				await escape();
				break;
			default:
				break;
		}
	}


	function escape() {
		return new Promise((resolve, reject) => {

			robot.keyTap('escape');
			resolve(true);
		})
	}



	function pressKey(key, duration) {
		return new Promise((resolve, reject) => {
			if (parseInt(duration) == NaN) duration = KEYPRESS_TIME_DEFAULT;

			robot.setKeyboardDelay(1);
			robot.keyToggle(key,'down');

			setTimeout(()=>{
				robot.keyToggle(key,'up');
				robot.setKeyboardDelay(KEYPRESS_TIME_DEFAULT);
				resolve(true);
			}, parseInt(duration));

		})
	}

	function pressMultipleKeys(key, duration, ...keys) {
		return new Promise((resolve, reject) => {

			if (parseInt(duration) === NaN) duration = KEYPRESS_TIME_DEFAULT;

			robot.setKeyboardDelay(1);

			robot.keyToggle(key,'down');
			for (let el of keys) {
				robot.keyToggle(el,'down');
			}

			setTimeout(()=>{
				robot.keyToggle(key,'up');
				for (let el of keys) {
					robot.keyToggle(el,'up');
				}
				robot.setKeyboardDelay(KEYPRESS_TIME_DEFAULT);
				resolve(true);
			}, parseInt(duration));
		})
	}


	function doubleJump() {
		robot.setKeyboardDelay(KEYPRESS_TIME_DEFAULT / 2);
		robot.keyToggle(JUMP,'down');
		robot.setKeyboardDelay(KEYPRESS_TIME_DEFAULT / 10);
		robot.keyToggle(JUMP,'up');
		
		robot.setKeyboardDelay(KEYPRESS_TIME_DEFAULT / 2);
		robot.keyToggle(JUMP,'down');
		robot.setKeyboardDelay(KEYPRESS_TIME_DEFAULT / 10);
		robot.keyToggle(JUMP,'up');
	}

	function parkourUpLeft() {
		//assumes whirl actionable by right mb
		return new Promise((resolve,reject)=>{
			robot.setKeyboardDelay(KEYPRESS_TIME_DEFAULT / 2);
			robot.keyToggle(JUMP,'down');
			robot.setKeyboardDelay(KEYPRESS_TIME_DEFAULT / 10);
			robot.keyToggle(JUMP,'up');

			robot.setKeyboardDelay(KEYPRESS_TIME_DEFAULT / 10);		
			robot.keyToggle(JUMP,'down');
			robot.keyToggle(MOVE_LEFT,'down');

			//wait 1/10 second before whirl
			robot.setMouseDelay(KEYPRESS_TIME_DEFAULT / 10);
			robot.mouseToggle("up", "right");
			robot.setMouseDelay(KEYPRESS_TIME_DEFAULT);
			robot.mouseToggle("down", "right");

			robot.setKeyboardDelay(KEYPRESS_TIME_DEFAULT / 10);		
			robot.keyToggle(MOVE_LEFT,'down');
			robot.keyToggle(JUMP,'down');

			robot.setKeyboardDelay(1);
			robot.keyToggle(JUMP,'up');

			robot.setKeyboardDelay(KEYPRESS_TIME_DEFAULT * 1.5);		
			robot.keyToggle(MOVE_LEFT,'down');
			robot.keyToggle(MOVE_LEFT,'up');
			
			robot.setMouseDelay(1);
			robot.mouseToggle("up", "right");

			robot.setKeyboardDelay(KEYPRESS_TIME_DEFAULT);
			resolve(true);
		});
	}


	function swimLeft(key, ...keys) {
		return new Promise((resolve, reject) => {
			robot.setKeyboardDelay(1);

			robot.keyToggle(key,'down');
			for (let el of keys) {
				robot.keyToggle(el,'down');
			}

			setTimeout(()=>{
				robot.keyToggle(key,'up');
				for (let el of keys) {
					robot.keyToggle(el,'up');
				}
				robot.setKeyboardDelay(KEYPRESS_TIME_DEFAULT);
				resolve(true);
			}, KEYPRESS_TIME_DEFAULT * 2);
		})
	}

	function swimRight(key, ...keys) {
		return new Promise((resolve, reject) => {
			robot.setKeyboardDelay(1);

			robot.keyToggle(key,'down');
			for (let el of keys) {
				robot.keyToggle(el,'down');
			}

			setTimeout(()=>{
				robot.keyToggle(key,'up');
				for (let el of keys) {
					robot.keyToggle(el,'up');
				}
				robot.setKeyboardDelay(KEYPRESS_TIME_DEFAULT);
				resolve(true);
			}, KEYPRESS_TIME_DEFAULT * 5);
		})
	}

	function shiftClick(x,y,delay) {
		return new Promise((resolve,reject)=>{
			if (parseInt(delay) === NaN) delay = 10;
			robot.setKeyboardDelay(delay * 3 + 100);
			robot.keyToggle('shift','down');
			robot.setMouseDelay(parseInt(delay));
			robot.moveMouse(x + X_OFFSET, y + Y_OFFSET);
			robot.mouseToggle("down");
			robot.mouseToggle("up");
			robot.keyToggle('shift','up');
			robot.setKeyboardDelay(KEYPRESS_TIME_DEFAULT);
			resolve(true);
		});
	}

	function click(x,y,delay) {
		return new Promise((resolve,reject)=>{
			if (parseInt(delay) === NaN) delay = 10;
			robot.setMouseDelay(parseInt(delay));
			robot.moveMouse(x + X_OFFSET, y + Y_OFFSET);
			robot.mouseToggle("down");
			robot.mouseToggle("up");
			resolve(true);
		});
	}

	function sleep(time) {
		return new Promise((resolve,reject)=>{
			time = !isNaN(parseInt(time)) ? parseInt(time) : 10;
			setTimeout(()=>{
				resolve(true)
			}, time)
		})
	}

}
