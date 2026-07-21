const API_URL = "http://localhost:5001/api/events";

let events = []

let editEventId = null;

async function fetchEvents(){

    try{

        const response = await fetch(API_URL);

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
const customVenueGroup = document.getElementById("customVenueGroup");

// const uploadBox = document.getElementById("uploadBox");
// const bannerInput = document.getElementById("eventBanner");
// const preview = document.getElementById("bannerPreview");

// uploadBox.addEventListener("click", () => {

//     bannerInput.click();

// });

// bannerInput.addEventListener("change", function () {

//     const file = this.files[0];

//     if(file){

//         preview.src = URL.createObjectURL(file);

//         preview.style.display = "block";

//     }

// });


// Form
const form = document.getElementById("eventForm");

// Table
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

        tableBody.innerHTML += `

        <tr>

            <td>${event.name}</td>
            <td>${event.category}</td>
            <<td>${new Date(event.date).toLocaleDateString("en-GB")}</td>
            <td>${event.venue}</td>

            <td>
                <span class="${event.status === "Open" ? "open badge" : "closed badge"}">
                    ${event.status}
                </span>
            </td>

            <td>
                <button
                    class="edit-btn"
                    onclick="editEvent('${event._id}')"
                >
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteEvent('${event._id}')"
                >
                    <i class="fa-solid fa-trash"></i>
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
    document.getElementById("registrationDeadline").value = event.registrationDeadline || "";
    document.getElementById("startTime").value = event.startTime || "";
    document.getElementById("endTime").value = event.endTime || "";

    if([
        "Auditorium",
        "Seminar Hall",
        "Ground",
        "Room 301",
        "Room 302",
        "Basketball Court",
        
    ].includes(event.venue)){

        venueSelect.value = event.venue;
        customVenueGroup.style.display = "none";

    }else{

        venueSelect.value = "other";
        customVenueGroup.style.display = "flex";
        document.getElementById("customVenue").value = event.venue;

    }

    document.getElementById("eventCapacity").value = event.capacity;
    document.getElementById("eventStatus").value = event.status;
    document.getElementById("eventDescription").value = event.description || "";

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

        method:"DELETE"

    });

    fetchEvents();

    deleteModal.style.display="none";

    deleteModal.style.display = "none";

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

    const newEvent = {

        

        name: document.getElementById("eventName").value,

        category: document.getElementById("eventCategory").value,

        date: document.getElementById("eventDate").value,

        registrationDeadline: document.getElementById("registrationDeadline").value,

        venue: venueSelect.value === "other"
                ? document.getElementById("customVenue").value
                : venueSelect.value,

        capacity: document.getElementById("eventCapacity").value,

        status: document.getElementById("eventStatus").value,

        startTime: document.getElementById("startTime").value,

        endTime: document.getElementById("endTime").value,

        description: document.getElementById("eventDescription").value,

        // banner: document.getElementById("eventBanner").files[0]
        //     ? document.getElementById("eventBanner").files[0].name
        //     : "No Banner",
    };

    const today = new Date().toISOString().split("T")[0];

    if (newEvent.date <= today) {
        alert("Event date must be after today.");
        return;
    }

    if (
        newEvent.registrationDeadline < today ||
        newEvent.registrationDeadline >= newEvent.date
    ) {
        alert("Registration deadline must be between today and the event date.");
        return;
    }

    if (newEvent.endTime <= newEvent.startTime) {
        alert("End time must be after start time.");
        return;
    }

    

    venueSelect.addEventListener("change", () => {

        if(venueSelect.value === "other"){

            customVenueGroup.style.display = "flex";

        }

        else{

            customVenueGroup.style.display = "none";

        }

    });

    if(editEventId){

        await fetch(`${API_URL}/${editEventId}`,{

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(newEvent)

        });
    }
    else{

    
    await fetch(API_URL,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(newEvent)

    });
    await fetchEvents();
    }

    

    form.reset();

    editEventId = null;

    document.querySelector(".modal-header h2").textContent =
        "Create Event";

    // preview.style.display = "none";

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

        const matchesSearch =

            event.name.toLowerCase().includes(search) ||

            event.category.toLowerCase().includes(search) ||

            event.venue.toLowerCase().includes(search);

        const matchesCategory =
            !category || event.category === category;

        const matchesStatus =
            !status || event.status === status;

        return matchesSearch &&
               matchesCategory &&
               matchesStatus;

    });

    displayEvents(filtered);

}

searchInput.addEventListener("input", filterEvents);

categoryFilter.addEventListener("change", filterEvents);

statusFilter.addEventListener("change", filterEvents);