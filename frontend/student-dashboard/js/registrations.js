const upcoming = document.getElementById("upcoming");
const past = document.getElementById("past");

async function loadRegistrations() {

    try {
        const response = await fetch("https://college-event-registration-n942.onrender.com/api/registrations/my", {
            credentials: "include",
        });

        const registrations = await response.json();

        upcoming.innerHTML = "";
        past.innerHTML = "";

        if (registrations.length === 0) {
            upcoming.innerHTML = `<p class="empty-state">You haven't registered for any events yet.</p>`;
            return;
        }

        const today = new Date();
        let upcomingCount = 0;
        let pastCount = 0;

        registrations.forEach((reg) => {

            const event = reg.eventId;

            if (!event) {
                const card = buildCard(reg, null, false);
                past.innerHTML += card;
                pastCount++;
                return;
            }

            const eventDate = new Date(event.date);
            const isUpcoming = eventDate >= today;
            const card = buildCard(reg, event, isUpcoming);

            if (isUpcoming) {
                upcoming.innerHTML += card;
                upcomingCount++;
            } else {
                past.innerHTML += card;
                pastCount++;
            }

        });

        if (upcomingCount === 0) {
            upcoming.innerHTML = `<p class="empty-state">No upcoming registrations.</p>`;
        }

        if (pastCount === 0) {
            past.innerHTML = `<p class="empty-state">No past registrations.</p>`;
        }

    } catch (error) {
        console.log(error);
        upcoming.innerHTML = `<p class="empty-state">Unable to load your registrations.</p>`;
    }

}

function buildCard(reg, event, isUpcoming) {

    return `
        <div class="card">

            <h2>${reg.eventName}</h2>

            ${event ? `
                <p><i class="fa-solid fa-tag"></i> ${event.category}</p>
                <p><i class="fa-solid fa-location-dot"></i> ${event.mode === "Online" ? "Online" : event.venue}</p>
                <p><i class="fa-solid fa-calendar"></i> ${new Date(event.date).toLocaleDateString("en-GB")}</p>
            ` : ""}

            <p>${reg.participationType === "Solo" ? "Solo Entry" : `Team: ${reg.teamName} (${1 + reg.teamMembers.length} members)`}</p>
            <p class="reg-id">Registration ID: <strong>${reg.registrationId}</strong></p>

            <span class="status ${event ? (isUpcoming ? "upcoming" : "past") : "past"}">
                ${event ? (isUpcoming ? "Upcoming" : "Completed") : "Event Deleted"}
            </span>
            <button class="withdraw-btn" onclick="withdrawRegistration('${reg.registrationId}')">
                ${reg.participationType === "Team" ? "Leave / Cancel" : "Withdraw"}
            </button>


        </div>
    `;

}

async function withdrawRegistration(registrationId) {

    if (!confirm("Are you sure you want to withdraw from this registration? This cannot be undone.")) {
        return;
    }

    try {
        const response = await fetch(`https://college-event-registration-n942.onrender.com/api/registrations/${registrationId}/leave`, {
            method: "DELETE",
            credentials: "include"
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Unable to withdraw.");
            return;
        }

        alert(data.message);
        loadRegistrations();

    } catch (error) {
        console.log(error);
        alert("Something went wrong. Please try again.");
    }

}

loadRegistrations();