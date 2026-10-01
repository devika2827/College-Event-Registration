const eventData = JSON.parse(localStorage.getItem("selectedEvent"));

document.getElementById("eventImage").src = `${eventData.banner}`;
document.getElementById("title").textContent = eventData.name;
document.getElementById("date").innerHTML = new Date(eventData.date).toLocaleDateString();
document.getElementById("time").innerHTML = eventData.startTime;
document.getElementById("venue").textContent = eventData.mode === "Online" ? "-" : eventData.venue;
document.getElementById("lastDate").innerHTML = new Date(eventData.registrationDeadline).toLocaleDateString();
document.getElementById("description").textContent = eventData.description || "";
document.getElementById("teamSize").textContent =
    eventData.minTeamSize === eventData.maxTeamSize
        ? `${eventData.minTeamSize}`
        : `${eventData.minTeamSize}-${eventData.maxTeamSize}`;document.getElementById("eventMode").textContent = eventData.mode || "";
document.getElementById("organizer").textContent = `Organized by: ${eventData.organizerName}`;

const rules = document.getElementById("rules");

eventData.rules.forEach((rule) => {
  rule.split("\n").forEach((line) => {
    const li = document.createElement("li");
    li.textContent = line;
    rules.appendChild(li);
  });
});

async function checkRegistrationStatus() {

    try {
        const response = await fetch("https://college-event-registration-n942.onrender.com/api/registrations/my", {
            credentials: "include"
        });

        if (!response.ok) return;

        const myRegistrations = await response.json();

        const existing = myRegistrations.find(reg =>
            reg.eventId && reg.eventId._id === eventData._id
        );

        const registerBtn = document.getElementById("registerBtn");

        if (existing) {
            registerBtn.textContent = "Already Registered — View My Registrations";
            registerBtn.classList.add("already-registered");
            registerBtn.onclick = function () {
                window.location.href = "../../student-dashboard/html/registrations.html";
            };
        }

    } catch (error) {
        console.log(error);
    }

}

checkRegistrationStatus().then(refreshAndCheckClosed);

async function refreshAndCheckClosed() {
    try {
        const res = await fetch(`https://college-event-registration-n942.onrender.com/api/events/${eventData._id}`);
        if (!res.ok) return;

        const fresh = await res.json();
        localStorage.setItem("selectedEvent", JSON.stringify(fresh));

        const deadline = new Date(fresh.registrationDeadline);
        deadline.setHours(23, 59, 59, 999);
        const closed = fresh.status === "Closed" || deadline < new Date();

        const btn = document.getElementById("registerBtn");
        if (closed && !btn.classList.contains("already-registered")) {
            btn.textContent = "Registrations Closed";
            btn.disabled = true;
            btn.onclick = null;
        }
    } catch (error) {
        console.log(error);
    }
}
document.getElementById("registerBtn").onclick = function () {
    window.location.href = "../../Registration/html/registration.html";
};