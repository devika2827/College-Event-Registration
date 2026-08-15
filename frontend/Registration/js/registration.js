const API_URL = "https://college-event-registration-n942.onrender.com/api/registrations";

const eventData = JSON.parse(localStorage.getItem("selectedEvent"));

if (!eventData) {
    alert("No event selected.");
    window.location.href = "../../student-dashboard/html/index.html";
}


const soloRadio=document.getElementById("soloOption");
const teamRadio=document.getElementById("teamOption");
const teamSize=document.getElementById("teamSize");

function buildTeamSizeOptions() {

    const maxTeamSize = Number(eventData.maxTeamSize);
    const minTeamSize = Number(eventData.minTeamSize);

    teamSize.innerHTML = "";
    teamSize.innerHTML += `<option value="1">1</option>`;

    const startSize = Math.max(2, minTeamSize);
    for(let i = startSize; i <= maxTeamSize; i++){
        teamSize.innerHTML += `<option value="${i}">${i}</option>`;
    }

}

buildTeamSizeOptions();   


const maxTeamSize = Number(eventData.maxTeamSize);
const minTeamSize = Number(eventData.minTeamSize);

const participationSection = document.getElementById("participationSection");
const teamInfoSection = document.getElementById("teamInfoSection");
const leaderHeading = document.getElementById("leaderSectionHeading");
const leaderSubheading = document.getElementById("leaderSectionSubheading");
const teamNameInput = document.getElementById("teamName");
const teamModeOptions = document.getElementById("teamModeOptions");
const createTeamOption = document.getElementById("createTeamOption");
const joinTeamOption = document.getElementById("joinTeamOption");
const createTeamFields = document.getElementById("createTeamFields");
const joinTeamFields = document.getElementById("joinTeamFields");
const joinRegIdInput = document.getElementById("joinRegId");
const findTeamBtn = document.getElementById("findTeamBtn");
const teamFoundInfo = document.getElementById("teamFoundInfo");

let joinedTeamData = null;   

function showCreateMode(){
    createTeamFields.style.display = "";
    joinTeamFields.style.display = "none";
    teamFoundInfo.style.display = "none";
    joinedTeamData = null;
    leaderHeading.textContent = "Team Leader Information";
    leaderSubheading.textContent = "Enter the details of the team leader.";
    teamNameInput.required = true;
    teamSize.required = true;
}

function showJoinMode(){
    createTeamFields.style.display = "none";
    joinTeamFields.style.display = "";
    leaderHeading.textContent = "Your Information";
    leaderSubheading.textContent = "Enter your own details to join the team.";
    teamNameInput.required = false;
    teamSize.required = false;
}

createTeamOption.addEventListener("change", () => { if(createTeamOption.checked) showCreateMode(); });
joinTeamOption.addEventListener("change", () => { if(joinTeamOption.checked) showJoinMode(); });

findTeamBtn.addEventListener("click", async () => {

    const regId = joinRegIdInput.value.trim();
    document.getElementById("joinRegIdError").textContent = "";
    teamFoundInfo.style.display = "none";
    joinedTeamData = null;

    if (!regId) {
        document.getElementById("joinRegIdError").textContent = "Please enter a Registration ID.";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/lookup/${regId}`);
        const data = await response.json();

        if (!response.ok) {
            document.getElementById("joinRegIdError").textContent = data.message || "Team not found.";
            return;
        }

        if (data.eventId !== eventData._id) {
            document.getElementById("joinRegIdError").textContent = "This Registration ID belongs to a different event.";
            return;
        }

        joinedTeamData = data;

        document.getElementById("foundTeamName").textContent = data.teamName;
        document.getElementById("foundLeaderName").textContent = data.leaderName;
        document.getElementById("foundTeamSize").textContent = `${data.currentSize} / ${maxTeamSize}`;
        teamFoundInfo.style.display = "block";

    } catch (error) {
        console.log(error);
        document.getElementById("joinRegIdError").textContent = "Something went wrong. Please try again.";
    }

});

function showTeamFields(){

    teamInfoSection.style.display = "";
    leaderHeading.textContent = "Team Leader Information";
    leaderSubheading.textContent = "Enter the details of the team leader.";
    teamSize.disabled = false;
    teamNameInput.required = true;
    teamSize.required = true;

    if(!teamSize.value || Number(teamSize.value) < 2){
        teamSize.value = String(Math.max(2, minTeamSize));
    }

    createTeamOption.checked = true;
    showCreateMode();
}

function showSoloFields(){

    teamInfoSection.style.display = "none";
    leaderHeading.textContent = "Your Information";
    leaderSubheading.textContent = "Enter your details.";
    teamSize.disabled = true;
    teamNameInput.required = false;
    teamSize.required = false;
    teamSize.value = "1";
}

if(minTeamSize === 1 && maxTeamSize === 1){

    participationSection.style.display = "none";
    soloRadio.checked = true;
    teamRadio.disabled = true;
    showSoloFields();

}else if(minTeamSize === 1 && maxTeamSize > 1){

    participationSection.style.display = "";
    soloRadio.disabled = false;
    teamRadio.disabled = false;
    soloRadio.checked = true;
    teamRadio.checked = false;
    showSoloFields();

    soloRadio.addEventListener("change", () => { if(soloRadio.checked) showSoloFields(); });
    teamRadio.addEventListener("change", () => { if(teamRadio.checked) showTeamFields(); });

}else{

    participationSection.style.display = "none";
    teamRadio.checked = true;
    soloRadio.disabled = true;
    showTeamFields();

}


function isValidEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone){
    return /^[6-9]\d{9}$/.test(phone);
}



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

    if (!soloRadio.checked && document.getElementById("teamName").value.trim() === "") {
            alert("Please enter Team Name.");
            return false;
    }

    return true;
}


const registrationForm = document.getElementById("registrationForm");

registrationForm.addEventListener("submit", submitRegistration);

async function submitRegistration(e){

    e.preventDefault();

    const isJoining = joinTeamOption.checked;

    if (isJoining) {

        if (!joinedTeamData) {
            alert("Please find and confirm your team first using the Registration ID.");
            return;
        }

        const member = getTeamLeader();   // same fields, reused for the joining person

        if (member.name === "" || !isValidEmail(member.email) || !isValidPhone(member.phone)) {
            alert("Please fill in your details correctly.");
            return;
        }

        if(!document.getElementById("terms").checked){
            alert("Please accept Event Rules.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${joinRegIdInput.value.trim()}/join`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId: eventData._id, member })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Unable to join team.");
                return;
            }

            showSuccess({ registrationId: joinRegIdInput.value.trim() });

        } catch (error) {
            console.log(error);
            alert("Unable to join team.\nPlease try again.");
        }

        return;
    }

    if(!validateForm()) return;

    const eventId = eventData._id;
    const enteredTeamName = document.getElementById("teamName").value.trim();
    const registration = {
        eventId: eventData._id,
        eventName: eventData.name,
        participationType:  Number(teamSize.value) === 1 ? "Solo" : "Team",
        teamName: enteredTeamName === "" ? "-" : enteredTeamName,
        teamSize: Number(teamSize.value),
        teamLeader: getTeamLeader(),
        teamMembers: []
    };

    try{
        const response=await fetch(API_URL,{
            method:"POST",
            credentials: "include",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(registration)

        });

        if(!response.ok){
            throw new Error("Registration Failed");
        }
        const savedRegistration = await response.json();
        showSuccess(savedRegistration);

    }

    catch(error){
        console.log(error);
        alert("Unable to Register.\nPlease try again.");
    }

}


function showSuccess(registration){

    registrationForm.style.display="none";

    document.getElementById("successSection").hidden=false;
    document.getElementById("successEventName").innerHTML = eventData.name;
    document.getElementById("registrationId").innerHTML= registration.registrationId;
}