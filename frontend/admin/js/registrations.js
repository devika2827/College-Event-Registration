const EVENTS_API_URL = "https://college-event-registration-n942.onrender.com/api/events";
const REGISTRATIONS_API_URL = "https://college-event-registration-n942.onrender.com/api/registrations";

let registrations = [];
let events = [];

async function fetchRegistrations() {
    try {

        const response = await fetch(`${REGISTRATIONS_API_URL}/mine-as-host`, { credentials: "include" });
        registrations = await response.json();
        filterRegistrations();

    } catch (error) {
        console.log(error);
    }

}

async function fetchEventsForFilter() {
    try {

        const response = await fetch(EVENTS_API_URL);
        events = await response.json();

        const eventFilter = document.getElementById("eventFilter");

        events.forEach(event => {
            eventFilter.innerHTML += `<option value="${event._id}">${event.name}</option>`;
        });

    } catch (error) {
        console.log(error);
    }

}

const tableBody = document.getElementById("registrationTableBody");
const teamModal = document.getElementById("teamModal");
const closeModalBtn = document.getElementById("closeModal");
const teamModalBody = document.getElementById("teamModalBody");

function displayRegistrations(filtered = registrations) {

    tableBody.innerHTML = "";

    if (filtered.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    No registrations found.
                </td>
            </tr>
        `;
        return;
    }

    filtered.forEach(reg => {

        const memberCount = reg.teamMembers ? reg.teamMembers.length : 0;
        const totalSize = memberCount + 1;

        tableBody.innerHTML += `

            <tr>

                <td>${reg.eventName || "Deleted Event"}</td>
                <td>${reg.teamName || "-"}</td>
                <td>${reg.teamLeader.name}</td>
                <td>${reg.registrationId}</td>
                <td>${reg.teamSize}</td>
                <td>${new Date(reg.createdAt).toLocaleDateString("en-GB")}</td>
                <td>
                    <button class="edit-btn" onclick="viewTeam('${reg._id}')">View</button>
                </td>
                <td>
                    <button class="delete-btn" onclick="deleteRegistration('${reg._id}')">
                        <p>Delete</p>
                    </button>
                </td>

            </tr>

        `;

    });

}

function viewTeam(id) {

    const reg = registrations.find(r => r._id === id);
    const isSolo = reg.participationType === "Solo";

    function renderPerson(person) {
        return `
            <p><strong>Name:</strong> ${person.name}</p>
            <p><strong>College:</strong> ${person.college}</p>
            <p><strong>Department:</strong> ${person.department}</p>
            <p><strong>Year:</strong> ${person.year}</p>
            <p><strong>Roll No:</strong> ${person.rollNo}</p>
            <p><strong>Email:</strong> ${person.email}</p>
            <p><strong>Phone:</strong> ${person.phone}</p>
        `;
    }

    const leaderBlock = `
        <p style="margin-bottom:10px;"><strong style="text-decoration: underline;">${isSolo ? "Participant" : "Team Leader"}</strong></p>
        ${renderPerson(reg.teamLeader)}
    `;

    const membersBlock = (!isSolo && reg.teamMembers && reg.teamMembers.length > 0)
        ? `
            <br>
            <p style="margin-bottom:10px;"><strong style="text-decoration: underline;" >Team Members</strong></p>
            ${reg.teamMembers.map(m => `
                <div style="margin-bottom:14px;">
                    ${renderPerson(m)}
                </div>
            `).join("")}
        `
        : "";

    teamModalBody.innerHTML = `
        ${leaderBlock}
        ${membersBlock}
    `;

    teamModal.style.display = "flex";
}

closeModalBtn.onclick = () => {
    teamModal.style.display = "none";
};

window.addEventListener("click", (e) => {
    if (e.target === teamModal) {
        teamModal.style.display = "none";
    }
});

async function deleteRegistration(id) {

    if (!confirm("Delete this registration?")) return;

    await fetch(`${REGISTRATIONS_API_URL}/${id}`, { method: "DELETE" , credentials: "include"});
    fetchRegistrations();

}

const searchInput = document.getElementById("searchInput");
const eventFilter = document.getElementById("eventFilter");

function filterRegistrations() {

    const search = searchInput.value.toLowerCase();
    const eventId = eventFilter.value;

    const filtered = registrations.filter(reg => {

        const matchesSearch = 
            reg.teamLeader.name.toLowerCase().includes(search) ||
            reg.registrationId.toLowerCase().includes(search);

        const matchesEvent = !eventId || reg.eventId === eventId;

        return matchesSearch && matchesEvent;
    });

    displayRegistrations(filtered);
}

searchInput.addEventListener("input", filterRegistrations);
eventFilter.addEventListener("change", filterRegistrations);

fetchEventsForFilter();
fetchRegistrations();