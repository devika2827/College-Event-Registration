const eventData = JSON.parse(localStorage.getItem("selectedEvent"));

document.getElementById("eventImage").src = `/uploads/${eventData.banner}`;
document.getElementById("title").innerHTML = eventData.name;
document.getElementById("date").innerHTML = new Date(eventData.date).toLocaleDateString();
document.getElementById("time").innerHTML = eventData.startTime;
document.getElementById("venue").innerHTML = eventData.venue;
document.getElementById("lastDate").innerHTML = new Date(eventData.registrationDeadline).toLocaleDateString();
document.getElementById("description").innerHTML = eventData.description;
document.getElementById("teamSize").innerHTML = eventData.teamSize;

const rules = document.getElementById("rules");

eventData.rules.forEach((rule) => {
  rules.innerHTML += `<li>${rule}</li>`;
});

document.getElementById("registerBtn").onclick = function () {
  alert("Registration page will open here.");
};

