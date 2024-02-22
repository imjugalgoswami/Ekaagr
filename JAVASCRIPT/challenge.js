const dashboard = document.querySelector(".dashboard-section");
const challengeList = document.querySelectorAll(".challenge");
const challenges = document.querySelector(".challenges");
const addChallengeBtn = document.querySelector("#add-challenge");
const form = document.querySelector(".form");
const challengeCalender = document.querySelector(".challenge-calender");
const remainingDays = document.querySelector(".remaining-days-container");
let remainingDaysCount = 0;
function storeChallengeInLocalStorage(key,challengeData){   
    if(localStorage.getItem(key) !== null){     
        const challengeDataList = JSON.parse(localStorage.getItem(key));
        challengeDataList.push(challengeData);
        localStorage.setItem(key,JSON.stringify(challengeDataList));
    }else{
        const challengeDataList = [];
        challengeDataList.push(challengeData);
        localStorage.setItem(key,JSON.stringify(challengeDataList));
    }
}
function storeCalendarDataToLocalStorage(key,challengeName,calendarData){

    if(localStorage.getItem(key) !== null){
        const ListOfChallengeCalendar = JSON.parse(localStorage.getItem(key));
        ListOfChallengeCalendar.push({
            [challengeName] : calendarData,
        });
        
        localStorage.setItem(key,JSON.stringify(ListOfChallengeCalendar));

    }else{
        const ListOfChallengeCalendar = [];
        ListOfChallengeCalendar.push({
            [challengeName] : calendarData,
        });
        localStorage.setItem(key,JSON.stringify(ListOfChallengeCalendar))
    }
    
}

function fetchCalendarData(key,challengeName){

    if(localStorage.getItem(key) !== null){
        const ListOfChallengeCalendar = JSON.parse(localStorage.getItem(key));

        const calendarData =  ListOfChallengeCalendar.filter((obj)=>{
            return obj.hasOwnProperty(challengeName);
        });
        return calendarData[0][challengeName];
    }
}


function challengeHandler(e){
    remainingDaysCount=0;
    form.classList.add("display-none");
    challengeCalender.classList.remove("display-none");
    challengeCalender.classList.add("display-block");

    challengeCalender.innerText = "";

    const calendarData =  fetchCalendarData("ListOfChallengeCalendar",e.target.innerText);
    calendarData.forEach((calendar)=>{
        createCalendar(calendar["month"],calendar["year"],calendar["startingDay"],calendar["endingDay"],calendar["weekDay"]);
    });
    // createCalendar(calendarData["month"],calendarData["year"],calendarData["startingDay"],calendarData["endingDay"],calendarData["weekDay"]);
    // console.log(calendarData);
    // console.log(e.target.innerText);
}

function createChallenge(title){
    const challenge = document.createElement("div");
    const challengeTitle = document.createElement("div");
    challenge.classList.add("challenge");
    challengeTitle.innerText = title;
    challengeTitle.classList.add("challenge-title");
    challenge.appendChild(challengeTitle);

    challenge.addEventListener("click",challengeHandler);

    challenges.appendChild(challenge);
    // console.log(title);
}
function addChallengeHandler(e){
    e.preventDefault();
    const challengeName = document.querySelector("#challenge-name").value;
    const challengeDays = document.querySelector("#challenge-days").value;

    if(challengeName.trim() === ''){
        showMessage("please enter challenge name");
        return;
    }

    if(isNaN(challengeDays) || challengeDays < 1){
        showMessage("days should be a number greater than 0");
        return;
    }
    storeChallengeInLocalStorage("challengeDataList",{
        "challengeName":challengeName,
        "challengeDays":challengeDays,
    });

    const calendarData = setCalendar(challengeDays);
    storeCalendarDataToLocalStorage("ListOfChallengeCalendar",challengeName,calendarData);
    createChallenge(challengeName);
    location.reload();
}

function challengeListIsEmpty(key){
    if(localStorage.getItem(key)){
        return false;
    }else{
        return true;
    }
}

function fetchChallengeList(key){

    if(challengeListIsEmpty(key)){
        return false;
    }else{
        return JSON.parse(localStorage.getItem(key));
    }
}

function loadChallenges(key){

    if(!challengeListIsEmpty(key)){
        const challengeDataList = fetchChallengeList(key);
        challenges.innerText = "";
        challengeDataList.forEach(challenge => {
            createChallenge(challenge.challengeName);
        });
    }
    
}

function showMessage(message){
    const messageSpan = document.querySelector("#message");
    messageSpan.innerText = message;
    messageSpan.style.display = "inline";
}

addChallengeBtn.addEventListener("click",addChallengeHandler);

window.addEventListener('load',loadChallenges("challengeDataList"));

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function daysInMonth(month,year){

    if(month == 2){
        return isLeapYear(year)?29:28;

    }else if(month == 8){
        return 31;
    }else{
        return (month%2 + 30);
    }
}

function getMonthString(month){

    const monthStrings = {
        0: "January",
        1: "February",
        2: "March",
        3: "April",
        4: "May",
        5: "June",
        6: "July",
        7: "August",
        8: "September",
        9: "October",
        10: "November",
        11: "December"
    };

    return monthStrings[month-1];
    
}

function setCalendar(days){
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth()+1;
    let currentDay = currentDate.getDate();
    let weekDay = currentDate.getDay();

    const calendarData = [];


    while(days){
        let startingDay = currentDay;
        let endingDay = daysInMonth(currentMonth,currentYear)>days?days:daysInMonth(currentMonth,currentYear);
        calendarData.push({
            "year":currentYear,
            "month":currentMonth,
            "startingDay":startingDay,
            "endingDay":endingDay,
            "weekDay":weekDay,
        });

        if(currentMonth == 12){
            currentYear++;
            currentMonth = 1;
        }else{
            currentMonth++;
        }
        weekDay = ((endingDay - startingDay + 1) + weekDay)%7;
        days = days - (endingDay - currentDay + 1);
        
        currentDay = 1;
    }

    return calendarData;

}

function todaysDate(){

    let date = new Date()

    return {
        day: date.getDate(),
        month:date.getMonth()+1,
        year:date.getFullYear(),
    }
}

function checkForBackgroundRed(month,year,ithDay){
    const date = todaysDate();
    console.log(month,year,ithDay);
    console.log(date.month,date.year,date.day);
    if(date.year === year){
        if(date.month === month){
            if(date.day > ithDay){
                return true;
            }
        }else if(date.month > month){
            return true;
        }
    }else if(date.year > year){
        return true;
    }

    return false;


}

function createCalendar(month,year,startingDay,endingDay,dayGap){
    console.log("create calendar");
    const calendar = document.createElement("div");
    calendar.classList.add("calendar");

    const header = document.createElement("div");
    header.classList.add("header");
    header.innerText = `${getMonthString(month-1)} ${year}`;

    calendar.appendChild(header);

    const days = document.createElement("div");
    days.classList.add("days");

    const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    weekDays.forEach((ele)=>{
        let day = document.createElement("div");
        day.classList.add("day");
        day.innerText = ele;
        days.appendChild(day);
    });
    let gap = dayGap;
    for(let i=startingDay;i<=endingDay+dayGap;i++){


        let day = document.createElement("div");
        day.classList.add("day");

        if(gap !== 0){
            day.innerText = "";
            days.appendChild(day);
            gap--;
            // console.log("hello i am here",gap);
        }else{
            day.innerText = i-dayGap;
            if(checkForBackgroundRed(month,year,i-dayGap)){
                day.classList.add("red-flag");
                console.log("red");
            }else{
                day.classList.add("green-flag");
                remainingDaysCount++;
                console.log("green");
            }
            console.log("print");
            days.appendChild(day);
        }
    }
    calendar.appendChild(days);

    challengeCalender.appendChild(calendar);

    remainingDays.firstElementChild.innerText = `Remaining Days ${remainingDaysCount}`;
    remainingDays.classList.remove("display-none");
    remainingDays.classList.add("display-block");

}

// createCalendar("February","2024" , 29 ,2 );

