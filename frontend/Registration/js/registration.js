const API_URL = "http://localhost:8000/api/registrations";

/* SELECTED EVENT */

const eventData = JSON.parse(localStorage.getItem("selectedEvent"));

if (!eventData) {
    alert("No event selected.");
    window.location.href = "../../student-dashboard/html/index.html";
}


/* LOAD EVENT */

function loadEvent() {

    document.getElementById("eventBanner").src = `/uploads/${eventData.banner}`;
    document.getElementById("eventName").innerHTML = eventData.name;
    document.getElementById("eventDate").innerHTML = new Date(eventData.date).toLocaleDateString();
    document.getElementById("eventTime").innerHTML = eventData.startTime;
    document.getElementById("eventVenue").innerHTML = eventData.venue;
    document.getElementById("eventCategory").innerHTML = eventData.category;

    const maxTeamSize = Number(eventData.maxTeamSize);
    const minTeamSize = Number(eventData.minTeamSize);

    teamSize.innerHTML = "";


    for(let i = minTeamSize; i <= maxTeamSize; i++){
        teamSize.innerHTML += `<option value="${i}">${i}</option>`;
    }

}


/* SOLO / TEAM */

const soloRadio=document.getElementById("soloOption");
const teamRadio=document.getElementById("teamOption");
const teamSize=document.getElementById("teamSize");

/* EVENT TYPE */

const maxTeamSize = Number(eventData.maxteamSize);

if(maxTeamSize === 1){
    soloRadio.checked = true;
    teamRadio.disabled = true;
    teamSize.disabled = true;
    teamSize.value = 1;
}else{
    teamRadio.checked = true;
    soloRadio.disabled = true;
    teamSize.disabled = false;
}

teamSize.addEventListener("change", generateMembers);

/* CREATE MEMBER CARDS */

function generateMembers(){

    const container=document.getElementById("teamMembersContainer");

    container.innerHTML="";

    const size=parseInt(teamSize.value);

    if(size===1) return;

    for(let i=2;i<=size;i++){
        const card=document.createElement("section");
        card.className="card member-card";
        card.innerHTML=`

            <h2>Team Member ${i}</h2>

            <div class="form-grid">

                <div class="form-group">

                    <label>Full Name</label>

                    <input
                    type="text"
                    id="member${i}Name">

                </div>

                <div class="form-group">

                    <label>College</label>

                    <input
                    type="text"
                    id="member${i}College">

                </div>

                <div class="form-group">

                    <label>Department</label>

                    <input
                    type="text"
                    id="member${i}Department">

                </div>

                <div class="form-group">

                    <label>Year</label>

                    <select id="member${i}Year">
                        <option value="">Select</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                    </select>

                </div>

                <div class="form-group">

                    <label>Roll Number</label>

                    <input
                    type="text"
                    id="member${i}Roll">

                </div>

                <div class="form-group">

                    <label>Email</label>

                    <input
                    type="email"
                    id="member${i}Email">

                </div>

                <div class="form-group full-width">

                    <label>Phone</label>

                    <input
                    type="tel"
                    maxlength="10"
                    id="member${i}Phone">

                </div>

            </div>

        `;

        container.appendChild(card);
    }
}

/* VALIDATION FUNCTIONS */

function isValidEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone){
    return /^[6-9]\d{9}$/.test(phone);
}

function generateRegistrationId(){
    const random=Math.floor(Math.random()*9000)+1000;
    return "EH"+random;
}


/* GET TEAM LEADER */

function getTeamLeader(){

    return{
        name:document.getElementById("leaderName").value.trim(),
        college:document.getElementById("leaderCollege").value.trim(),
        department:document.getElementById("leaderDepartment").value.trim(),
        year:document.getElementById("leaderYear").value,
        rollNo:document.getElementById("leaderRollNo").value.trim(),
        email:document.getElementById("leaderEmail").value.trim(),
        phone:document.getElementById("leaderPhone").value.trim()
    };

}

/* GET TEAM MEMBERS */

function getMembers(){

    const members=[];
    const size=parseInt(teamSize.value);

    if(size===1){
        return members;
    }

    for(let i=2;i<=size;i++){
        members.push({
            name:document.getElementById(`member${i}Name`).value.trim(),
            college:document.getElementById(`member${i}College`).value.trim(),
            department:document.getElementById(`member${i}Department`).value.trim(),
            year:document.getElementById(`member${i}Year`).value,
            rollNo:document.getElementById(`member${i}Roll`).value.trim(),
            email:document.getElementById(`member${i}Email`).value.trim(),
            phone:document.getElementById(`member${i}Phone`).value.trim()
        });
    }

    return members;

}

/* FORM VALIDATION */

function validateForm(){

    const leader=getTeamLeader();

    if(leader.name===""){
        alert("Please enter Team Leader Name.");
        return false;
    }

    if(leader.college===""){
        alert("Please enter College Name.");
        return false;
    }

    if(leader.department===""){
        alert("Please enter Department.");
        return false;
    }

    if(leader.year===""){
        alert("Please select Year.");
        return false;
    }

    if(leader.rollNo===""){
        alert("Please enter Roll Number.");
        return false;
    }

    if(!isValidEmail(leader.email)){
        alert("Please enter valid Email.");
        return false;
    }

    if(!isValidPhone(leader.phone)){
        alert("Please enter valid Phone Number.");
        return false;
    }

    if(!document.getElementById("terms").checked){
        alert("Please accept Event Rules.");
        return false;
    }

    /* TEAM MEMBER VALIDATION */

    const members = getMembers();

    for (const member of members) {

        if (
            member.name === "" ||
            member.college === "" ||
            member.department === "" ||
            member.year === "" ||
            member.rollNo === "" ||
            member.email === "" ||
            member.phone === ""
        ) {
            alert("Please complete all Team Member details.");
            return false;
        }

        if (!isValidEmail(member.email)) {
            alert("Please enter a valid Team Member email.");
            return false;
        }

        if (!isValidPhone(member.phone)) {
            alert("Please enter a valid Team Member phone number.");
            return false;

        }

    }

    if (maxTeamSize > 1 && document.getElementById("teamName").value.trim() === "") {
        alert("Please enter Team Name.");
        return false;
}

    return true;

}

/* SUBMIT FORM */

const registrationForm = document.getElementById("registrationForm");

registrationForm.addEventListener("submit", submitRegistration);

async function submitRegistration(e){

    e.preventDefault();

    if(!validateForm()) return;

    const eventId = eventData._id;
    const registration = {
        eventId: eventData._id,
        eventName: eventData.name,
        participationType:  Number(teamSize.value) === 1 ? "Solo" : "Team",
        teamName: document.getElementById("teamName").value.trim(),
        teamSize: Number(teamSize.value),
        registrationId: generateRegistrationId(),
        teamLeader: getTeamLeader(),
        teamMembers: getMembers()
    };

    try{
        const response=await fetch(API_URL,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(registration)

        });

        if(!response.ok){
            throw new Error("Registration Failed");
        }

        showSuccess(registration);

    }

    catch(error){
        console.log(error);
        alert("Unable to Register.\nPlease try again.");
    }

}

/* SUCCESS PAGE */

function showSuccess(registration){

    registrationForm.style.display="none";

    document.getElementById("successSection").hidden=false;
    document.getElementById("successEventName").innerHTML = document.getElementById("eventName").innerHTML;
    document.getElementById("registrationId").innerHTML= registration.registrationId;
}


/* ==========================================
INITIALIZE PAGE
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

    loadEvent();

    generateMembers();

    if(soloRadio.checked){

        teamSize.disabled=true;

    }

});