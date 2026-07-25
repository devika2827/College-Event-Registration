
// Dummy Event Data

const event = {
    name: "Hackathon 2026",
    category: "Technical",
    date: "15 August 2026",
    deadline: "10 August 2026",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    venue: "IGDTUW Auditorium",
    capacity: 200,
    status: "Open",
    description: "Annual coding competition for students."
};

// Display Event Details

document.getElementById("eventName").textContent = event.name;
document.getElementById("category").textContent = event.category;
document.getElementById("date").textContent = event.date;
document.getElementById("deadline").textContent = event.deadline;
document.getElementById("startTime").textContent = event.startTime;
document.getElementById("endTime").textContent = event.endTime;
document.getElementById("venue").textContent = event.venue;
document.getElementById("capacity").textContent = event.capacity;
document.getElementById("status").textContent = event.status;
document.getElementById("description").textContent = event.description;

// Register Button

const registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", function(){

    alert("Registration Successful!");

    registerBtn.innerHTML = "Already Registered";

    registerBtn.disabled = true;

});
