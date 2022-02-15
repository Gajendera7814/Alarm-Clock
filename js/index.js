const display = document.getElementById('clock');
const timeInput = document.getElementById('alarm-date-input');
const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
audio.loop = true;
let alarmTime = null;
let alarmTimeout = null;
const alarmListDiv = document.getElementById('alarm-list');
const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let alarmList = []

var today = new Date().toISOString().slice(0, 16);
document.getElementsByName("alarmTime")[0].min = today;

function updateTime() {
    const date = new Date();
    const hour = formatTime(date.getHours());
    const minutes = formatTime(date.getMinutes());
    const seconds = formatTime(date.getSeconds());
    display.innerText=`${hour} : ${minutes} : ${seconds}`
}

function formatTime(time) {
    if ( time < 10 ) {
        return '0' + time;
    }
    return time;
}

function setAlarmTime(value) {
    alarmTime = value;
}

// function setAlarm() {
//     if(alarmTime) {
//         const current = new Date();
//         const timeToAlarm = new Date(alarmTime);

//         if (timeToAlarm > current) {
//             const timeout = timeToAlarm.getTime() - current.getTime();
//             alarmTimeout = setTimeout(() => audio.play(), timeout);
//             alert('Alarm set');
//         }
//     }else{
//         alert("please select date and time")
//     }
// }

function setAlarm() {
    if(alarmTime) {
        const current = new Date();
        const timeToAlarm = new Date(alarmTime);
        const newalarmtime = "alram set at "+timeToAlarm.getHours() + ":" + timeToAlarm.getMinutes()+ " on " + days[timeToAlarm.getDay()] + " " + timeToAlarm.getDate() + " " + months[timeToAlarm.getMonth()] + " "+ timeToAlarm.getFullYear();
        // console.log(newalarmtime)
        if (timeToAlarm > current) {
            const timeout = timeToAlarm.getTime() - current.getTime();
            const newAlarmTimeout = setTimeout(() => timeOutFunction(current.getTime()) , timeout);
            const alarmObj = {
                id : current.getTime(),
                alarmTime : newalarmtime,
                timeOut : timeToAlarm.getTime(),
                timeOutVar : newAlarmTimeout,
                snozzedNumber : 0
            }
            alarmList.push(alarmObj);
            createList()
            alarmTime = null;
            timeInput.value=null;
            alert(`Alarm set at ${timeToAlarm.getHours() + ":" + timeToAlarm.getMinutes()}`);
        }
    }else{
        alert("please select date and time")
    }
}

function clearAlarm() {
    audio.pause();
    if (alarmList && alarmList.length) {
        alarmList.map(ele=>{
            clearTimeout(ele.timeOutVar)
        })
        alarmList = [];
        createList()
        alert('All Alarms are deleted');
    }
}

function createList() {
    while(alarmListDiv.hasChildNodes()){
        alarmListDiv.removeChild(alarmListDiv.firstChild)
    }
    if(alarmList && alarmList.length){
        shortAlarm()
        alarmList.map((ele,index)=>{
            const div = document.createElement("div");
            div.setAttribute("id", "alarm-li-"+index);
            
            const p = document.createElement("p");
            p.innerHTML = (index+1) + ". " + ele.alarmTime

            const snoozebutton = document.createElement("button");
            snoozebutton.innerHTML = "Snooze"
            snoozebutton.setAttribute("id","snooze-"+index);
            snoozebutton.setAttribute("class","snooze");
            snoozebutton.addEventListener("click",snoozeAlarm)
            snoozebutton.style.display = "none"

            const pausebutton = document.createElement("button");
            pausebutton.innerHTML = "Pause Alarm"
            pausebutton.setAttribute("id","pause-"+index);
            pausebutton.setAttribute("class","pause");
            pausebutton.addEventListener("click",pauseAlarm)
            pausebutton.style.display = "none"

            const deletebutton = document.createElement("button");
            deletebutton.innerHTML = "Delete"
            deletebutton.setAttribute("id","delete-"+index);
            deletebutton.setAttribute("class","delete");
            deletebutton.addEventListener("click",deleteAlarm)

            div.appendChild(p);
            div.appendChild(snoozebutton);
            div.appendChild(pausebutton);
            div.appendChild(deletebutton);

            alarmListDiv.appendChild(div);
        })
    }
}

createList();

function shortAlarm() {
    alarmList.sort((a,b)=> a.timeOut - b.timeOut)
}

function snoozeAlarm(event) {
    let index = event.target.id.split("-")[1];
    let alarmObj = alarmList[index];
    audio.pause();
    clearTimeout(alarmObj.timeOutVar);
    const newAlarmTimeout = setTimeout(() => timeOutFunction(alarmObj.id) , 300000);
    alarmObj.snozzedNumber = alarmObj.snozzedNumber+1
    alarmObj.timeOutVar = newAlarmTimeout;
    alarmList[index] = alarmObj;
    // console.log(alarmList)
    document.getElementById("snooze-"+index).style.display = "none"
    document.getElementById("pause-"+index).style.display = "none"
}

function pauseAlarm(event) {
    let index = event.target.id.split("-")[1];
    let alarmObj = alarmList[index]
    audio.pause();
    clearTimeout(alarmObj.timeOutVar);
    document.getElementById("snooze-"+index).style.display = "none"
    document.getElementById("pause-"+index).style.display = "none"
}

function deleteAlarm(event) {
    let index = event.target.id.split("-")[1];
    let newObj = {}
    alarmList = alarmList.filter((ele,i)=>{
        if(i == index){
            newObj = ele
        }
        return i != index;
    })
    clearTimeout(newObj.timeOutVar)
    audio.pause();
    createList()
}

function timeOutFunction(id){
    console.log("timeout")
    let index = 0;
    alarmList.map((ele,i)=>{
        if(ele.id == id){
            index = i;
        }
    })
    if(alarmList[index].snozzedNumber <= 3)
        document.getElementById("snooze-"+index).style.display = "block"
    document.getElementById("pause-"+index).style.display = "block"
    audio.play()
}

setInterval(updateTime, 1000);