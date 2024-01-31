


// --------------- Add subjects -----------------

let addSubjects = document.querySelector(".subjects");
let addForm = document.querySelector("#add-form");

function loadSubAndTime(){
    if(localStorage.getItem("lastSubAndTime") !== null){

        // --------- loading subject -----------
        let runningSubject = document.querySelector(".running-subject");
        let lastSubAndTime = JSON.parse(localStorage.getItem("lastSubAndTime"));
        subject = createSubject(lastSubAndTime.title);
        subject.firstElementChild.firstElementChild.style.display = "none";
        runningSubject.innerText="";
        runningSubject.classList.remove("before-subject-notlisted");
        runningSubject.appendChild(subject);

        // ------------ loading time ------------
        let lastPausedTime = lastSubAndTime.lastPausedTime;
        let timer = document.querySelector(".timer");
        let hours = document.querySelector("#hours");
        let minutes = document.querySelector("#minutes");
        let seconds = document.querySelector("#seconds");
        let milliseconds = document.querySelector("#milliseconds");
        hours.innerText = lastPausedTime[0]+lastPausedTime[1];
        minutes.innerText = lastPausedTime[3]+lastPausedTime[4];
        seconds.innerText = lastPausedTime[6]+lastPausedTime[7];
        milliseconds.innerText = lastPausedTime[9]+lastPausedTime[10];

    }
}

function loadSubjects(){

    let subjectsList = JSON.parse(localStorage.getItem("subjects"));
    let lastSubAndTime = JSON.parse(localStorage.getItem("lastSubAndTime"));
    
    if(subjectsList !== null){
        subjectsList.forEach((title) => {
            subject = createSubject(title);
            if(lastSubAndTime !== null){
                if(lastSubAndTime.title !== title){
                    addSubjects.appendChild(subject);
                }

            }else{
                addSubjects.appendChild(subject);
            }
        });
    }

}


function storeSubject(title){
    if(localStorage.getItem("subjects") !== null ){
        let subjectsList = JSON.parse(localStorage.getItem("subjects"));
        subjectsList.push(title);
        localStorage.setItem("subjects",JSON.stringify(subjectsList));
    }else{
        let subjectsList = [];
        subjectsList.push(title);
        localStorage.setItem("subjects",JSON.stringify(subjectsList));
    }
}

function deleteSubjectFromStorage(title){

    let subjects = JSON.parse(localStorage.getItem("subjects"));
    // console.log(subjects);
    if(subjects !== null){
        subjects = subjects.filter(subject => subject !== title );
        // console.log(subjects);
        localStorage.setItem("subjects",JSON.stringify(subjects));
    }
}



function createStudySessionObject(subjectName,dateOfStudy,totalHoursOfStudy){

    // console.log(dateOfStudy instanceof Date);
    studySession = {
        "dateOfStudy":dateOfStudy,
        "subjectWithHours":[{"subjectName":subjectName,"totalHoursOfStudy":totalHoursOfStudy},],
    };

    return studySession;

}

function AddHours(totalHours,currHours){
    let prevMilliseconds = +(totalHours[9] + totalHours[10]);
    let prevSeconds = +(totalHours[6] + totalHours[7]);
    let prevMinutes = +(totalHours[3] + totalHours[4]);
    let prevHour = +(totalHours[0] + totalHours[1]);

    let currMilliseconds = +(currHours[9] + currHours[10]);
    let currSeconds = +(currHours[6] + currHours[7]);
    let currMinutes = +(currHours[3] + currHours[4]);
    let currHour = +(currHours[0] + currHours[1]);

    let totalMilliseconds = prevMilliseconds + currMilliseconds;
    let totalSeconds = prevSeconds + currSeconds;
    let totalMinutes = prevMinutes + currMinutes;
    let totalHour = prevHour + currHour;
    
    if(totalMilliseconds > 99){
        totalMilliseconds = totalSeconds % 100;
        totalSeconds++;
    }

    if(totalSeconds > 59){
        totalSeconds = totalSeconds - 60;
        totalMinutes++;
    }

    if(totalMinutes > 59){
        totalMinutes = totalMinutes - 60;
        totalHour++;
    }

    let totalTime = `${totalHour<10?"0"+totalHour:totalHour}:${totalMinutes<10?"0"+totalMinutes:totalMinutes}:${totalSeconds<10?"0"+totalSeconds:totalSeconds}:${totalMilliseconds<10?"0"+totalMilliseconds:totalMilliseconds}`;
    // console.log(time);
    return totalTime;

}

function fetchDate(dateObj){

    // console.log(dateObj instanceof Date);

    if(typeof dateObj === "string"){
        dateObj = new Date(dateObj);
    }

    let year = dateObj.getFullYear();
    let month = dateObj.getMonth()+1;
    let day = dateObj.getDate();

    let date = `${day}-${month}-${year}`;
    return date;
}


function saveStudyData(studySessionObj){

    // console.log(studySessionObj.dateOfStudy instanceof Date);
    let dateOfStudy = fetchDate(studySessionObj.dateOfStudy);
    let subjectWithHours = studySessionObj.subjectWithHours;


    let subjectName = subjectWithHours[0].subjectName;
    let hours = subjectWithHours[0].totalHoursOfStudy;

    if(localStorage.getItem("studySessions") !== null){
        let studySessions = JSON.parse(localStorage.getItem("studySessions"));
        let flag = false;
        for(obj of studySessions){

            console.log(obj.dateOfStudy instanceof Date);
            console.log(typeof obj.dateOfStudy);

            if(fetchDate(obj.dateOfStudy) === dateOfStudy){
                
                for(subAndHours of obj.subjectWithHours){
                    if(subAndHours.subjectName === subjectName){
                        subAndHours.totalHoursOfStudy = AddHours(subAndHours.totalHoursOfStudy,hours);
                        flag = true;
                        break;
                    }
                }
                if(flag){
                    break;
                }else{
                    obj.subjectWithHours.push({"subjectName":subjectName,"totalHoursOfStudy":hours});
                    flag=true;
                    break;
                }
            }
        }
        if(!flag){
            studySessions.push(studySessionObj);
        }
        localStorage.setItem("studySessions",JSON.stringify(studySessions));

    }else{
        let studySessions = [];
        studySessions.push(studySession);
        localStorage.setItem("studySessions",JSON.stringify(studySessions));
    }

}

function createSubject(title){
    let subject = document.createElement("div");
    let subjectTitle = document.createElement("div");
    let button = document.createElement("button");
    let i = document.createElement("i");
    button.classList.add("delete-btn");
    button.setAttribute("id","trash-btn");
    button.addEventListener("click",handleDeleteSubject);
    i.classList.add("fa-solid","fa-trash-can");
    button.appendChild(i);



    subject.classList.add("subject");
    subject.setAttribute("draggable","true");

    subjectTitle.classList.add("subject-title");
    subjectTitle.innerText = title;
    subjectTitle.appendChild(button);
    subject.appendChild(subjectTitle);

    subject.addEventListener("dragstart",handleDragStart);
    
    return subject;
    

}

let trashBtn = document.querySelector("#trash-btn");


function handleDeleteSubject(evt){

    let title = evt.target.parentNode.parentNode.parentNode.textContent;
    evt.target.parentNode.parentNode.parentNode.parentNode.removeChild(evt.target.parentNode.parentNode.parentNode);
    deleteSubjectFromStorage(title);
    // console.log(title.length);

}


function handleAddBtn(evt){
    evt.preventDefault();
    let title = document.querySelector("#subject-name").value;
    let subject = createSubject(title);    
    addSubjects.appendChild(subject);
    document.querySelector("#subject-name").value = "";
    storeSubject(title);
}

addForm.addEventListener("submit",handleAddBtn);

// ------------ subject Drag code ------------

const subjects = document.querySelectorAll(".subject");
const newSession = document.querySelector(".new-session");




// for(let subject of subjects){
//     subject.addEventListener("dragstart",handleDragStart);
// }

function handleDragStart(evt){
    // evt.preventDefault();
    console.log("drag started");
    let selected = evt.target;
    
    newSession.addEventListener("dragover",handleDragOver);
    newSession.addEventListener("drop",handleDrop);
    document.addEventListener("dragend",handleDragEnd);
    
    function handleDragEnd(evt){
        newSession.removeEventListener("dragover",handleDragOver);
        newSession.removeEventListener("drop",handleDrop);
    }

    function handleDragOver(evt){
        evt.preventDefault();
        console.log("dragover");
    }
    

    function handleDrop(evt){
        console.log("drop");


        if(newSession.firstElementChild.children.length === 0){
            // console.log("hello");
            // let trashBtn = document.querySelector("#trash-btn");
            // trashBtn.style.display = "none";
            // console.log(selected.firstElementChild.firstElementChild);
            selected.firstElementChild.firstElementChild.style.display = "none";
            newSession.firstElementChild.innerText="";
            newSession.firstElementChild.classList.remove("before-subject-notlisted");
            newSession.firstElementChild.appendChild(selected);
            selected = null;

            newSession.removeEventListener("dragover",handleDragOver);
            newSession.removeEventListener("drop",handleDrop);
            // let title = evt.target.firstElementChild.firstElementChild.textContent;
            // storeBeforeLoadData(title);
        }else{
            alert("already a session is going");
            newSession.removeEventListener("dragover",handleDragOver);
            newSession.removeEventListener("drop",handleDrop);
        }

    }

    // setTimeout(()=>{
    //     newSession.removeEventListener("dragover",handleDragOver);
    //     newSession.removeEventListener("drop",handleDrop);
    // },0);
}

function storeBeforeLoadData(title,lastPausedTime){
    let lastSubAndTime = {
        "title":title,
        "lastPausedTime":lastPausedTime
    };
    localStorage.setItem("lastSubAndTime",JSON.stringify(lastSubAndTime));
}

function handleBeforeunload(){
    let runningSubject = document.querySelector(".running-subject");
    let timerContent = document.querySelector(".timer");
    if(!runningSubject.classList.contains("before-subject-notlisted")){
        let title = runningSubject.firstElementChild.firstElementChild.textContent;
        let lastPausedTime = timerContent.firstElementChild.textContent;
        storeBeforeLoadData(title,lastPausedTime);
    }
}

let removeSessionBtn = document.querySelector("#remove-session-btn");

removeSessionBtn.addEventListener("click",handleRemoveSession);

function handleRemoveSession(){
    let runningSubject = document.querySelector(".running-subject");
    let timerContent = document.querySelector(".timer");
    if(!runningSubject.classList.contains("before-subject-notlisted")){
        let title = runningSubject.firstElementChild.firstElementChild.textContent;
        let lastPausedTime = timerContent.firstElementChild.textContent;
        let date = new Date();
        // console.log(date instanceof Date);
        let studySession = createStudySessionObject(title,date,lastPausedTime);
        saveStudyData(studySession);

        runningSubject.innerText = "Drag Your Subject Here";
        runningSubject.classList.add("before-subject-notlisted");
        let hours = document.querySelector("#hours");
        let minutes = document.querySelector("#minutes");
        let seconds = document.querySelector("#seconds");
        let milliseconds = document.querySelector("#milliseconds");
        hours.innerText = "00";
        minutes.innerText = "00";
        seconds.innerText = "00";
        milliseconds.innerText = "00";
        if(localStorage.getItem("lastSubAndTime") !== null){
            localStorage.removeItem("lastSubAndTime");
        }
        window.location.reload();
    }
    
}



window.addEventListener("load",loadSubjects);
window.addEventListener("load",loadSubAndTime);
window.addEventListener("beforeunload",handleBeforeunload);



