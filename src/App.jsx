import React, { useEffect, useState } from 'react';
import './css/app.css';

export default function App() {
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [isRunning, setIsRunning] = useState(false);
  const [showModal, setShowModal] = useState(false); // 모달 창 표시 여부

  useEffect(() => {
    let timerId = null;
    if (isRunning) {
      timerId = setInterval(() => {
        if (hours === "00" && minutes === "00" && seconds === "00") {
          onClickStop();
          setShowModal(true);
        } else {
          if (seconds > 0) {
            setSeconds(prevSeconds => String(prevSeconds - 1).padStart(2, "0"));
          } else {
            if (minutes > 0) {
              setMinutes(prevMinutes => String(prevMinutes - 1).padStart(2, "0"));
              setSeconds("59");
            } else {
              if (hours > 0) {
                setHours(prevHours => String(prevHours - 1).padStart(2, "0"));
                setMinutes("59");
                setSeconds("59");
              }
            }
          }
        }
      }, 1000);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [hours, minutes, seconds, isRunning]);

  const onClickStart = () => {
    setIsRunning(true);
  };

  const onClickStop = () => {
    setIsRunning(false);
  };

  const onClickReset = () => {
    setHours("00");
    setMinutes("00");
    setSeconds("00");
    setShowModal(false);
  };

  const inputChange = (e, setState, maxValue) => {
    const { value } = e.target;
    const numericValue = parseInt(value);

    if (Number.isNaN(numericValue)) {
      setState("00");
    } else if (numericValue < 0) {
      setState("00");
    } else {
      const adjustedValue = numericValue % (maxValue + 1);
      setState(String(adjustedValue).padStart(2, "0"));
      const carryOver = Math.floor(numericValue / (maxValue + 1));
      return carryOver;
    }
  };

  const secondsChange = (e) => {
    const carryOver = inputChange(e, setSeconds, 59);
    if (carryOver) {
      const updatedMinutes = parseInt(minutes) + carryOver;
      const updatedHours = parseInt(hours) + Math.floor(updatedMinutes / 60);
      setMinutes(String(updatedMinutes % 60).padStart(2, "0"));
      setHours(String(updatedHours).padStart(2, "0"));
    }
  };

  const minutesChange = (e) => {
    const carryOver = inputChange(e, setMinutes, 59);
    if (carryOver) {
      const updatedHours = parseInt(hours) + carryOver;
      setHours(String(updatedHours).padStart(2, "0"));
    }
  };

  return (
    <div id='wrap'>
      <div className="wrap-container">
        <div className="timer-content">
          <div className="title">
            <h2>타이머</h2>
            <div className="help-img-box">
              <img src="./img/help.png" alt="" />
            </div>
          </div>
          <div className="timer-box">
            <div className='timer'>
              {isRunning ? (
                <div className='time-box'>
                  <label>
                    <input disabled type="number" value={hours} onChange={e => inputChange(e, setHours, 99)} />
                    <span>:</span>
                  </label>
                  <label>
                    <input disabled type="number" value={minutes} onChange={minutesChange} />
                    <span>:</span>
                  </label>
                  <label>
                    <input disabled type="number" value={seconds} onChange={secondsChange} />
                  </label>
                </div>
              ) : (
                <div className='time-box'>
                  <label>
                    <input type="number" value={hours} onChange={e => inputChange(e, setHours, 99)} />
                    <span>:</span>
                  </label>
                  <label>
                    <input type="number" value={minutes} onChange={minutesChange} />
                    <span>:</span>
                  </label>
                  <label>
                    <input type="number" value={seconds} onChange={secondsChange} />
                  </label>
                </div>
              )}
            </div>
            <div className="timer-opption">
              <button className='start' onClick={onClickStart}>start</button>
              <button className='stop' onClick={onClickStop}>stop</button>
              <button className='reset' onClick={onClickReset}>reset</button>
            </div>
          </div>
        </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>타이머가 종료되었습니다!!</p>
            <button onClick={onClickReset}><span>Click</span></button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
