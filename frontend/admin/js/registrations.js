const API_URL = "http://localhost:8000/api/events";
const EVENTS_API_URL = "http://localhost:8000/api/events";

let registrations = [];
let events = [];

const response = await fetch(`${API_URL}/registrations/mine`, { credentials: "include" });


async function fetchRegistrations() {

    try {

        const response = await fetch(API_URL);
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
const closeTeamModalBtn = document.getElementById("closeTeamModal");
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

                <td>${reg.leaderName}</td>
                <td>${reg.leaderEmail}</td>
                <td>${reg.leaderContact}</td>
                <td>${reg.event ? reg.event.name : "Deleted Event"}</td>

                <td>
                    ${totalSize}
                    ${memberCount > 0
                        ? `<button class="edit-btn" onclick="viewTeam('${reg._id}')"><p>View Team</p></button>`
                        : ""
                    }
                </td>

                <td>${new Date(reg.createdAt).toLocaleDateString("en-GB")}</td>

                <td>
                    <button
                        class="delete-btn"
                        onclick="deleteRegistration('${reg._id}')"
                    >
                        <p>Delete</p>
                    </button>
                </td>

            </tr>

        `;

    });

}

function viewTeam(id) {

    const reg = registrations.find(r => r._id === id);

    const membersList = reg.teamMembers.map(m =>
        `<li>${m.name}${m.contact ? " — " + m.contact : ""}</li>`
    ).join("");

    teamModalBody.innerHTML = `
        <p><strong>Leader:</strong> ${reg.leaderName} (${reg.leaderContact})</p>
        <br>
        <p><strong>Members:</strong></p>
        <ul>${membersList}</ul>
    `;

    teamModal.style.display = "flex";

}

closeTeamModalBtn.onclick = () => {
    teamModal.style.display = "none";
};

window.addEventListener("click", (e) => {
    if (e.target === teamModal) {
        teamModal.style.display = "none";
    }
});

async function deleteRegistration(id) {

    if (!confirm("Delete this registration?")) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    fetchRegistrations();

}

const searchInput = document.getElementById("searchInput");
const eventFilter = document.getElementById("eventFilter");

function filterRegistrations() {

    const search = searchInput.value.toLowerCase();
    const eventId = eventFilter.value;

    const filtered = registrations.filter(reg => {

        const matchesSearch =
            reg.leaderName.toLowerCase().includes(search) ||
            reg.leaderEmail.toLowerCase().includes(search);

        const matchesEvent =
            !eventId || (reg.event && reg.event._id === eventId);

        return matchesSearch && matchesEvent;

    });

    displayRegistrations(filtered);

}

const profileBtn = document.getElementById("profileBtn");
const dropdown = document.getElementById("profileDropdown");

profileBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdown.classList.toggle("active");
});

dropdown.addEventListener("click", function (e) {
    e.stopPropagation();
});

document.addEventListener("click", function () {
    dropdown.classList.remove("active");
});

searchInput.addEventListener("input", filterRegistrations);
eventFilter.addEventListener("change", filterRegistrations);

fetchEventsForFilter();
fetchRegistrations();