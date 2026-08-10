const API_URL = "/api/events";

let events = []

let editEventId = null;

async function fetchEvents(){
    try{
        const response = await fetch(`${API_URL}/my`, { credentials: "include" });
        
        if (!response.ok) {
            console.log("Failed to fetch events:", response.status);
            events = [];
            filterEvents();
            return;
        }
 
        events = await response.json();
        filterEvents();
    }
    catch(error){
        console.log(error);
    }
}


// Modal Elements
const modal = document.getElementById("eventModal");
const openBtn = document.getElementById("addEventBtn");
const closeBtn = document.getElementById("closeModal");
const deleteModal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");
let deleteEventId = null;
const venueSelect = document.getElementById("eventVenue");

venueSelect.addEventListener("change", () => {
    if(venueSelect.value === "other"){
        customVenueGroup.style.display = "flex";
    }
    else{
        customVenueGroup.style.display = "none";
    }
});
    
// Event Mode Selection
const eventModeSelect = document.getElementById("eventMode");
const venueGroup = document.getElementById("venueGroup");

eventModeSelect.addEventListener("change", () => {
    if (eventModeSelect.value === "Online") {
        venueGroup.style.display = "none";
    } else {
        venueGroup.style.display = "flex";
    }
});

const customVenueGroup = document.getElementById("customVenueGroup");
const uploadBox = document.getElementById("uploadBox");
const bannerInput = document.getElementById("eventBanner");
const preview = document.getElementById("bannerPreview");

uploadBox.addEventListener("click", () => {
    bannerInput.click();
});

bannerInput.addEventListener("change", function () {
    const file = this.files[0];

    if(file){
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    }
});

const form = document.getElementById("eventForm");
const tableBody = document.getElementById("eventTableBody");

function deleteEvent(id){
    deleteEventId = id;
    deleteModal.style.display = "flex";
}

function displayEvents(filteredEvents = events) {

    tableBody.innerHTML = "";

    if(filteredEvents.length === 0){
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    No events found.
                </td>
            </tr>
        `;
        return;
    }

    filteredEvents.forEach((event) => {
        
        const isClosed = event.status === "Closed" || new Date(event.registrationDeadline) < new Date();
        const displayStatus = isClosed ? "Closed" : "Open";

        tableBody.innerHTML += `

        <tr>

            <td>${event.name}</td>
            <td>${event.category}</td>
            <td>${new Date(event.date).toLocaleDateString("en-GB")}</td>
            <td>${event.mode === "Online" ? "-" : event.venue}</td>

            <td>
                <span class="${isClosed ? "closed badge" : "open badge"}">
                    ${displayStatus}
                </span>
            </td>

            <td>
                <button
                    class="edit-btn"
                    onclick="editEvent('${event._id}')"
                >
                    <p>Edit</p>
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteEvent('${event._id}')"
                >
                    <p>Delete</p>
                </button>
            </td>

        </tr>
        `;
    });
}

fetchEvents();

function editEvent(id){

    const event = events.find(event => event._id === id);

    editEventId = id;

    document.getElementById("eventName").value = event.name;
    document.getElementById("eventCategory").value = event.category;
    document.getElementById("eventDate").value = event.date.split("T")[0];
    document.getElementById("registrationDeadline").value = event.registrationDeadline.split("T")[0];
    document.getElementById("startTime").value = event.startTime || "";
    document.getElementById("minTeamSize").value = event.minTeamSize || "";
    document.getElementById("maxTeamSize").value = event.maxTeamSize || "";
    document.getElementById("eventMode").value = event.mode || "Offline";
    document.getElementById("eventEligibility").value = event.eligibility || "Open";
    document.getElementById("organizerName").value = event.organizerName || "";
    document.getElementById("organizerContact").value = event.organizerContact || "";

    if (event.mode === "Online") {
    venueGroup.style.display = "none";
    } else {
    venueGroup.style.display = "flex";
    }

    if([
        "Auditorium, IGDTUW",
        "Seminar Hall, IGDTUW",
        "Ground, IGDTUW",
        "Basketball Court, IGDTUW",
    ].includes(event.venue)){

        venueSelect.value = event.venue;
        customVenueGroup.style.display = "none";

    }else{
        venueSelect.value = "other";
        customVenueGroup.style.display = "flex";
        document.getElementById("customVenue").value = event.venue;
    }

    document.getElementById("eventStatus").value = event.status;
    document.getElementById("eventDescription").value = event.description || "";
    document.getElementById("eventRules").value = ( event.rules || []).join("\n");
    document.querySelector(".modal-header h2").textContent = "Edit Event";

    modal.style.display = "flex";
}


function closeModal(){
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
}

// Open Modal
openBtn.onclick = () => {
    modal.style.display = "flex";
    document.body.classList.add("modal-open");
};

// Close Modal
closeBtn.onclick = closeModal;

document.getElementById("cancelBtn").onclick =
    closeModal;

window.onclick = (e) => {
    if (e.target === modal) {
        closeModal();
    }
};

confirmDeleteBtn.onclick = async () => {

    await fetch(`${API_URL}/${deleteEventId}`,{
        method:"DELETE",
        credentials: "include"
    });

    fetchEvents();
    deleteModal.style.display="none";
};

cancelDeleteBtn.onclick = () => {
    deleteModal.style.display = "none";
};

window.addEventListener("click",(e)=>{
    if(e.target===deleteModal){
        deleteModal.style.display="none";
    }
});

// Create Event
form.addEventListener("submit", async function(e){
    e.preventDefault();

    const dateVal = document.getElementById("eventDate").value;
    const deadlineVal = document.getElementById("registrationDeadline").value;
    const minTeamSizeVal = document.getElementById("minTeamSize").value;
    const maxTeamSizeVal = document.getElementById("maxTeamSize").value;    const contactVal = document.getElementById("organizerContact").value;
    const today = new Date().toISOString().split("T")[0];

    if (dateVal <= today) {
        alert("Event date must be after today.");
        return;
    }

    if (deadlineVal < today || deadlineVal >= dateVal) {
        alert("Registration deadline must be between today and the event date.");
        return;
    }

    if (minTeamSizeVal <= 0 || maxTeamSizeVal <= 0) {
        alert("Team size must be at least 1.");
        return;
    }

    if (Number(minTeamSizeVal) > Number(maxTeamSizeVal)) {
        alert("Minimum team size cannot be greater than maximum team size.");
        return;
    }

    if (!/^\d{10}$/.test(contactVal)) {
        alert("Enter a valid 10-digit contact number.");
        return;
    }

    const formData = new FormData();

    formData.append("name", document.getElementById("eventName").value);
    formData.append("category", document.getElementById("eventCategory").value);
    formData.append("date", dateVal);
    formData.append("registrationDeadline", deadlineVal);
    formData.append("mode", eventModeSelect.value);
    formData.append("eligibility", document.getElementById("eventEligibility").value);
    formData.append("minTeamSize", minTeamSizeVal);
    formData.append("maxTeamSize", maxTeamSizeVal);  
    if (eventModeSelect.value === "Offline") {
        formData.append("venue", venueSelect.value === "other"
                                    ? document.getElementById("customVenue").value
                                    : venueSelect.value);
    }
    formData.append("status", document.getElementById("eventStatus").value);
    formData.append("startTime", document.getElementById("startTime").value);  
    formData.append("organizerName", document.getElementById("organizerName").value);
    formData.append("organizerContact", contactVal);
    formData.append("description", document.getElementById("eventDescription").value);
    formData.append("rules", document.getElementById("eventRules").value)
    const bannerFile = document.getElementById("eventBanner").files[0];
    if (bannerFile) {
        formData.append("banner", bannerFile); // the actual File object, not the name
    }


    let response;

    if(editEventId){

        response = await fetch(`${API_URL}/${editEventId}`,{
            method:"PUT",
            credentials: "include",
            body:formData
        });

    }
    else{

        response = await fetch(API_URL,{
            method:"POST",
            credentials: "include",
            body:formData
        });

    }

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        alert(errData.message || "Something went wrong saving the event.");
        return; // stop here — don't reset/close on failure
    }

    await fetchEvents();

    form.reset();
    venueGroup.style.display = "flex";
    editEventId = null;
    document.querySelector(".modal-header h2").textContent = "Create Event";
    preview.style.display = "none";
    closeModal();
});

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");

function filterEvents(){

    const search = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const status = statusFilter.value;

    const filtered = events.filter(event =>{

        const isClosed = event.status === "Closed" || new Date(event.registrationDeadline) < new Date();
        const computedStatus = isClosed ? "Closed" : "Open";

        const matchesSearch =

            event.name.toLowerCase().includes(search) ||
            event.category.toLowerCase().includes(search) ||
            event.venue.toLowerCase().includes(search);

        const matchesCategory =
            !category || event.category === category;

        const matchesStatus =
            !status || computedStatus === status;

        return matchesSearch &&
               matchesCategory &&
               matchesStatus;
    });
    displayEvents(filtered);
}
    

searchInput.addEventListener("input", filterEvents);
categoryFilter.addEventListener("change", filterEvents);
statusFilter.addEventListener("change", filterEvents);