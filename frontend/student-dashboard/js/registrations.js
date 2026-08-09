const upcoming = document.getElementById("upcoming");
const past = document.getElementById("past");

async function loadRegistrations() {

    try {

        const response = await fetch("http://localhost:8000/api/registrations/my", {
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
                // Original event was deleted — still show the registration, just without live event details
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

            ${event
                ? `<img src="/uploads/${event.banner}">`
                : `<div class="banner-fallback">Event Deleted</div>`
            }

            <h2>${reg.eventName}</h2>

            ${event ? `
                <p><i class="fa-solid fa-tag"></i> ${event.category}</p>
                <p><i class="fa-solid fa-location-dot"></i> ${event.mode === "Online" ? "Online" : event.venue}</p>
                <p><i class="fa-solid fa-calendar"></i> ${new Date(event.date).toLocaleDateString("en-GB")}</p>
            ` : ""}

            <p class="reg-id">Registration ID: <strong>${reg.registrationId}</strong></p>

            <p>${reg.participationType === "Solo" ? "Solo Entry" : `Team: ${reg.teamName} (${1 + reg.teamMembers.length} members)`}</p>

            <span class="status ${event ? (isUpcoming ? "upcoming" : "past") : "past"}">
                ${event ? (isUpcoming ? "Upcoming" : "Completed") : "Event Deleted"}
            </span>

        </div>
    `;

}

loadRegistrations();