const API_URL = "/api/events";
const REGISTRATIONS_API_URL = "/api/registrations";

async function loadDashboard(){

    try{
        const response = await fetch(`${API_URL}/my`, { credentials: "include" });
        const events = await response.json();
        const today = new Date();
        const totalEvents = events.length;
        const regResponse = await fetch(`${REGISTRATIONS_API_URL}/mine-as-host`, { credentials: "include" });
        const registrations = regResponse.ok ? await regResponse.json() : [];
        const totalRegistrations = registrations.length;
        const upcomingEvents = events.filter(event => new Date(event.date) >= today).length;
        const completedEvents = events.filter(event =>  new Date(event.date) < today ).length;
        const upcoming = events
            .filter(event => new Date(event.date) >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);
        const table = document.getElementById("upcomingEventsTable");

        table.innerHTML = "";

        if(upcoming.length === 0){
            table.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center; padding:30px;">
                        No upcoming events.
                    </td>
                </tr>
            `;
            return;
        }

        upcoming.forEach(event => {

            const eventDate = new Date(event.date);
            const daysLeft = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
            const isClosed = event.status === "Closed" || new Date(event.registrationDeadline) < today;
            const displayStatus = isClosed ? "Closed" : "Open";
            
            table.innerHTML += `

                <tr>
                    <td>${event.name}</td>
                    <td>${new Date(event.date).toLocaleDateString("en-GB")}</td>
                    <td>${daysLeft} day${daysLeft !== 1 ? "s" : ""}</td>
                    <td>
                        <span class="${isClosed ? "badge closed" : "badge open"}">
                            ${displayStatus}
                        </span>
                    </td>
                </tr>
            `;
        });

        document.getElementById("totalEvents").textContent = totalEvents;
        document.getElementById("totalRegistrations").textContent = totalRegistrations;
        document.getElementById("upcomingEvents").textContent = upcomingEvents;
        document.getElementById("completedEvents").textContent = completedEvents;
    }

    catch(error){
        console.log(error);
    }
}

loadDashboard();