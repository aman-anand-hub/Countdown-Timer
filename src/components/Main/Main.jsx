import React, { useState, useEffect } from 'react';
import styles from "./Main.module.css";
import VibrateSound from "../../assets/vibrating-message-37619.mp3";

function Main() {

  const [selectedDate, setSelectedDate] = useState(localStorage.getItem("selectedDate") || '');
  const [countDown, setCountDown] = useState({});
  const [running, setRunning] = useState(selectedDate==='' ? false : true);

  useEffect(() => {

    let timer;

    if (running) {

      timer = setInterval(() => {

        const timeNow = new Date().getTime();
        const targetTime = new Date(selectedDate).getTime();
        const timeRemaining = targetTime - timeNow;

        if (timeRemaining <= 0) {
          PlaySound();
          clearInterval(timer);
          setRunning(false);
          localStorage.removeItem("selectedDate");
          return;
        }

        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

        if(days >= 100) {
            alert("Cannot set a timer for more than 100 days...");
            clearInterval(timer);
            setRunning(false);
        }

        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        setCountDown({ days, hours, minutes, seconds });

      }, 1000);
    }
    else {
      setCountDown(0);
    }

    return () => clearInterval(timer);

  }, [running, selectedDate]);

  const PlaySound = () => {
    const audio = new Audio(VibrateSound);
    audio.autoplay = true;
    audio.play();
  }

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    localStorage.setItem("selectedDate", e.target.value);
  }

  const handleStart = () => {
    if (selectedDate === '') {
      alert("Select date and time to begin timer...");
      return;
    }
    setRunning(true);
  }

  const handleStop = () => {
    setRunning(false);
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.wrapper}>

        <h1><span>Countdown</span> Timer</h1>

        <input
          type="datetime-local"
          id="datetime"
          name="datetime"
          value={selectedDate}
          onChange={(e) => handleDateChange(e)}
        />

        {running ?
          (
            <button onClick={handleStop}>Stop Timer</button>
          ) :
          (
            <button onClick={handleStart}>Start Timer</button>
          )
        }

        <div className={styles.content}>
          <div className={styles.element}>
            <div className={styles.pos}>
              <span className={styles.count}>{countDown.days}</span>
              <span>Days</span>

            </div>
          </div>
          <div className={styles.element}>
            <div className={styles.pos}>
              <span className={styles.count}>{countDown.hours}</span>
              <span>Hours</span>
            </div>
          </div>
          <div className={styles.element}>
            <div className={styles.pos}>
              <span className={styles.count}>{countDown.minutes}</span>
              <span>Minutes</span>
            </div>
          </div>
          <div className={styles.element}>
            <div className={styles.pos}>
              <span className={styles.count}>{countDown.seconds}</span>
              <span>Seconds</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Main;
