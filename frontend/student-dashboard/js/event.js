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
  alert("Registration page will open here.");
};
const profileBtn = document.getElementById("profileBtn");
const dropdown = document.getElementById("profileDropdown");

// Open/Close on Profile click
profileBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdown.classList.toggle("active");
});

// Prevent closing when clicking inside dropdown
dropdown.addEventListener("click", function (e) {
    e.stopPropagation();
});

// Close if user clicks anywhere else
document.addEventListener("click", function () {
    dropdown.classList.remove("active");
});

