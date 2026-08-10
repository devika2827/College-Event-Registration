const eventData = JSON.parse(localStorage.getItem("selectedEvent"));

document.getElementById("eventImage").src = `/uploads/${eventData.banner}`;
document.getElementById("title").innerHTML = eventData.name;
document.getElementById("date").innerHTML = new Date(eventData.date).toLocaleDateString();
document.getElementById("time").innerHTML = eventData.startTime;
document.getElementById("venue").innerHTML = eventData.mode === "Online" ? "-" : eventData.venue;
document.getElementById("lastDate").innerHTML = new Date(eventData.registrationDeadline).toLocaleDateString();
document.getElementById("description").innerHTML = eventData.description;
document.getElementById("teamSize").textContent = `${eventData.minTeamSize}-${eventData.maxTeamSize}`;
document.getElementById("eventMode").textContent = eventData.mode || "";
document.getElementById("organizer").textContent = `Organized by: ${eventData.organizerName}`;

const rules = document.getElementById("rules");

eventData.rules.forEach((rule) => {
  rule.split("\n").forEach((line) => {
    rules.innerHTML += `<li>${line}</li>`;
  });
});

document.getElementById("registerBtn").onclick = function () {
    window.location.href = "../../Registration/html/registration.html";
};
