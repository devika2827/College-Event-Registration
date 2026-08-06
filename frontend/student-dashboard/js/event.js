const event = JSON.parse(localStorage.getItem("selectedEvent"));

document.getElementById("eventImage").src = event.image;

document.getElementById("title").innerHTML = event.title;

document.getElementById("date").innerHTML = event.date;

document.getElementById("time").innerHTML = event.time;

document.getElementById("venue").innerHTML = event.venue;

document.getElementById("lastDate").innerHTML = event.lastDate;

document.getElementById("description").innerHTML = event.description;

const rules = document.getElementById("rules");

event.rules.forEach((rule) => {
  rules.innerHTML += `<li>${rule}</li>`;
});

document.getElementById("registerBtn").onclick = function () {
    window.location.href = "../../Registration/html/registration.html";
};
