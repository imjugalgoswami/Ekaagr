const subjectOptions = document.querySelector("#subject-options");
const subjectData = document.querySelector(".subject-data");
const byDate = document.querySelector("#bydate");
const byHour = document.querySelector("#byhour");

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

function sortByDate(evt){

    console.log(subjectOptions.value);
    let subj = subjectOptions.value;
    
    if(subj !== "Subjects"){
        let studySessions = fetchLocalStorage("studySessions");
        console.log("hello");
    }else{
        console.log("empty");
    }

}

sortByDate();



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

function handleTotalHoursOfStudy(evt){
    const totalHoursOfPlaceholder = document.querySelector("#total-hours-placeholder");
    let title = subjectOptions.value;
    let studySessions = fetchLocalStorage("studySessions");
    let countTotalHours="00:00:00:00";
    if(studySessions !== null){
        studySessions.forEach((obj)=>{
            (obj.subjectWithHours).forEach((subObj)=>{
                if(subObj.subjectName === title){
                    console.log(subObj);
                    countTotalHours = AddHours(countTotalHours,subObj.totalHoursOfStudy);
                }
            });
        });
    }
    // console.log(studySessions)

    totalHoursOfPlaceholder.innerText = countTotalHours.slice(0,8);
    // console.log(studySessions);
}


function handleSubjectOptions(evt){
    // console.log(subjectOptions.value);
    let title = subjectOptions.value;
    let studySessions = fetchLocalStorage("studySessions");
    // console.log(studySessions);
    subjectData.innerText="";

    if(studySessions !== null){
        studySessions.forEach((obj)=>{

            (obj.subjectWithHours).forEach((subObj)=>{
                if(subObj.subjectName === title){
                    let date = obj.dateOfStudy;
                    if(typeof date === "string"){
                        date = new Date(date);
                    }
                    date =  fetchDate(date);
                    let hours = subObj.totalHoursOfStudy;
    
                    let card = createCard(title,date,hours);
                    subjectData.appendChild(card);
                }
            });
        });
    }
}


subjectOptions.addEventListener("change",handleSubjectOptions);
subjectOptions.addEventListener("change",handleTotalHoursOfStudy);

function createCard(title,date,Hours){
    let dataCard = document.createElement("div");
    dataCard.classList.add("data-card");

    let subjectName = document.createElement("div");
    subjectName.classList.add("subject-name");
    subjectName.innerText = title;

    let dateOfStudy = document.createElement("div");
    dateOfStudy.classList.add("date-of-study");
    dateOfStudy.innerText = date;

    let totalHours = document.createElement("div");
    totalHours.classList.add("total-hours");
    totalHours.innerText = Hours.slice(0,8);

    dataCard.appendChild(subjectName);
    dataCard.appendChild(dateOfStudy);
    dataCard.appendChild(totalHours);
    return dataCard;
}
function fetchLocalStorage(key){
    let fetchedData = JSON.parse(localStorage.getItem(key));
    return fetchedData;
}

function setSubjectOptions(){

    let subjectList = fetchLocalStorage("subjects");

    if(subjectList !== null && subjectList.length !== 0){
        subjectList.forEach((title)=>{
            let option = document.createElement("option");
            option.value = title;
            option.innerText = title;
            subjectOptions.appendChild(option);
        });
    }else{
        let option = document.createElement("option");
        option.value = "Subjects";
        option.innerText = "Do not Have sessions";
        subjectOptions.appendChild(option);
    }
}

window.addEventListener("load",setSubjectOptions);
window.addEventListener("load",handleSubjectOptions);
window.addEventListener("load",handleTotalHoursOfStudy);