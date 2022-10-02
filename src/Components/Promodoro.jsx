import React, { useState, useEffect } from "react";
import "./Promodoro.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faPlay, faPause, faUndoAlt, faCirclePlus, faCircleMinus, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import UIfx from "uifx";
import mp3File from "../beep.mp3";

const Promodoro = () => {
	const [breakLength, setBreakLength] = useState(5);
	const [sessionLength, setSessionLength] = useState(25);
	const [session, setSession] = useState(25 * 60);
	const [breakValue, setBreakValue] = useState(0);
	const [isPaused, setIsPaused] = useState(true);
	const [timer, setTimer] = useState(null);
	const [isTimerStarted, setIsTimerStarted] = useState(false)

	const secToMin = sec => {
		const min = Math.floor(sec / 60);
		const second = sec % 60;
		return `${min >= 10 ? min : 0 + "" + min}:${second >= 10 ? second : 0 + "" + second
			}`;
	};

	const breakIncrement = () => {
		if (breakLength < 60 && isPaused) {
			setBreakLength(breakLength + 1);
		}
	};

	const sessionIncrement = () => {
		if (sessionLength < 60 && isPaused) {
			setSessionLength(sessionLength + 1);
		}
	};

	const breakDecrement = () => {
		if (breakLength > 1 && isPaused) {
			setBreakLength(breakLength - 1);
		}
	};

	const sessionDecrement = () => {
		if (sessionLength > 1 && isPaused) {
			setSessionLength(sessionLength - 1);
		}
	};

	useEffect(() => {
		if (session > 0) {
			setSession(sessionLength * 60);
		}
	}, [sessionLength]);

	useEffect(() => {
		if (breakValue > 0) {
			setBreakValue(breakLength * 60);
		}
	}, [breakLength]);

	useEffect(() => {
		if (!isPaused && session > 0 && breakValue == 0) {
			setTimer(setInterval(timeFunction, 1000));
		} else if (session == 0 && breakValue == 0) {
			const beep = new UIfx(mp3File, {
				volume: 0.4,
				throttleMs: 100
			});
			beep.play();
			setBreakValue(breakLength * 60);
		}
		return () => clearInterval(timer);
	}, [isPaused, session]);

	const timeFunction = () => {
		if (session > 0) {
			setSession(session - 1);
		} else {
			setBreakValue(breakValue - 1);
		}
	};

	useEffect(() => {
		if (!isPaused && breakValue > 0 && session == 0) {
			setTimer(setInterval(timeFunction, 1000));
		} else if (session == 0 && breakValue == 0) {
			const beep = new UIfx(mp3File, {
				volume: 0.4,
				throttleMs: 100
			});
			beep.play();
			setSession(sessionLength * 60);
		}
		return () => clearInterval(timer);
	}, [isPaused, breakValue]);

	const startTimer = () => {
		if (isPaused) {
			setIsPaused(false);
			setIsTimerStarted(true)
		}
	};

	const pauseTimer = () => {
		if (!isPaused) {
			setIsPaused(true);
			clearInterval(timer);
			setIsTimerStarted(false)
		}
	};

	const resetTimer = () => {
		if (!isPaused) {
			setIsPaused(true);
			setIsTimerStarted(false)
		}
		clearInterval(timer);
		setSessionLength(25);
		setBreakLength(5);
		setSession(25 * 60);
		setBreakValue(0);
	};

	return (
		<div className="main">

			<div className="timerContainer">
				<div className="countContainer">
					<span id="timer-label">
						{breakValue >= 0 && session == 0 ? "Break" : "Session"}
					</span>
					<span
						style={{
							color:
								(session < 60 && breakValue == 0) ||
									(breakValue < 60 && session == 0)
									? "#ff0026"
									: "#00ffff"
						}}
						id="time-left"
					>
						{breakValue >= 0 && session == 0
							? secToMin(breakValue)
							: secToMin(session)}
					</span>
				</div>
				<div className="controlContainer">
					<FontAwesomeIcon
						style={{ margin: 10 + "px", cursor: "pointer", userSelect: "none", opacity: isTimerStarted ? '0' : '1' }}
						icon={faPlay}
						onClick={startTimer}
					/>
					<FontAwesomeIcon
						style={{ margin: 10 + "px", cursor: "pointer", userSelect: "none", opacity: isTimerStarted ? '1' : '0' }}
						icon={faPause}
						onClick={pauseTimer}
					/>
					<FontAwesomeIcon
						style={{ margin: 10 + "px", cursor: "pointer", userSelect: "none" }}
						icon={faUndoAlt}
						onClick={resetTimer}
					/>
				</div>
			</div>

			<div className="controls">
				<div className="break-container">
					<span id="break-label" className="label">
						Break Length
					</span>
					<div className="setterContainer">
						<FontAwesomeIcon
							icon={faMinus}
							onClick={breakDecrement}
							id="break-decrement"
							className="downArrow"
						/>

						<span id="break-length" className="lengthLabel">
							{breakLength}
						</span>

						<FontAwesomeIcon
							icon={faPlus}
							onClick={breakIncrement}
							id="break-increment"
							className="upArrow"
						/>

					</div>
				</div>
				<div className="session-container">
					<span id="session-label" className="label">
						Session Length
					</span>
					<div className="setterContainer">
						<FontAwesomeIcon
							icon={faMinus}
							onClick={sessionDecrement}
							id="session-decrement"
							className="downArrow"
						/>

						<span id="session-length" className="lengthLabel">
							{sessionLength}
						</span>

						<FontAwesomeIcon
							icon={faPlus}
							onClick={sessionIncrement}
							id="session-increment"
							className="upArrow"
						/>
					</div>
				</div>
			</div>



		</div>
	);
};

export default Promodoro;