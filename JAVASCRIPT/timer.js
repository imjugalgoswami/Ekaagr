const timerWorker = new Worker("./JAVASCRIPT/workers.js");
const timeBox = document.querySelector("#time");
const hours = document.querySelector("#hours");
const minutes = document.querySelector("#minutes");
const seconds = document.querySelector("#seconds");
const milliseconds = document.querySelector("#milliseconds");
const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");
const resetButton = document.querySelector("#reset");
let startIntervalID;
let msec = 0;
let sec = 0;
let min =0;
let hour =0;

function loadPausedTime(){
    let lastSubAndTime = JSON.parse(localStorage.getItem("lastSubAndTime"));
    if(lastSubAndTime !== null){
        let lastPausedTime = lastSubAndTime.lastPausedTime;
        msec = +(lastPausedTime[9]+lastPausedTime[10]);
        sec = +(lastPausedTime[6]+lastPausedTime[7]);
        min = +(lastPausedTime[3]+lastPausedTime[4]);
        hour = +(lastPausedTime[0]+lastPausedTime[1]);
    }
}

const resetEventFunction = function(){
    timerWorker.postMessage({"option":"stop"});
    startIntervalID = null;
    msec = 0;
    sec = 0;
    min =0;
    hour =0;
    milliseconds.innerText = "00";
    seconds.innerText = "00";
    minutes.innerText = "00";
    hours.innerText = "00";
    if(startButton.innerText === "Resume"){
        startButton.innerText = "Start";
    }

}

function updateDisplay(){
    if(msec < 10){
        milliseconds.innerText = `0${msec}`;
    }else{
        milliseconds.innerText = msec;
    }
    if(sec<10){
        seconds.innerText = `0${sec}`;
    }else{
        seconds.innerText = sec;
    }
    if(min<10){
        minutes.innerText = `0${min}`;
    }else{
        minutes.innerText = min;
    }
    if(hour<10){
        hours.innerText = `0${hour}`;
    }else{
        hours.innerText = hour;
    }
}

const startEventFunction = function() {
    let runningSubject = document.querySelector(".running-subject");
    if(!runningSubject.classList.contains("before-subject-notlisted")){
        if(!startIntervalID || startButton.innerText === "Resume"){
            if(startButton.innerText === "Resume"){
                startButton.innerText = "Start";
            }
            timerWorker.postMessage({
                "option":"start",
                "msec":msec,
                "sec":sec,
                "min":min,
                "hour":hour,
            });
            timerWorker.onmessage = function(e){
                startIntervalID = e.data.startInterval;
                msec=e.data.msec;
                sec=e.data.sec;
                min=e.data.min;
                hour=e.data.hour;
                updateDisplay();
            }

        }
    }

}

const stopEventFunction = function() {
    let runningSubject = document.querySelector(".running-subject");
    if(!runningSubject.classList.contains("before-subject-notlisted")){
        timerWorker.postMessage({"option":"stop"});
        if(startButton.innerText === "Start"){
            startButton.innerText = "Resume";
        }
    }

}


// -------------- running subject ---------------




startButton.addEventListener("click",startEventFunction);
stopButton.addEventListener("click",stopEventFunction);
resetButton.addEventListener("click",resetEventFunction);

window.addEventListener("load",loadPausedTime);
