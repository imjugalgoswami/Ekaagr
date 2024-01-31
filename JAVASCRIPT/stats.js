const subjectOptions = document.querySelector("#subject-options");
const subjectData = document.querySelector(".subject-data");
const byDate = document.querySelector("#bydate");
const byHour = document.querySelector("#byhour");

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




function handleSubjectOptions(evt){
    // console.log(subjectOptions.value);
    let title = subjectOptions.value;
    let studySessions = fetchLocalStorage("studySessions");
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