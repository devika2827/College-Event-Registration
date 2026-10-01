let events = []

const cards = document.getElementById("cards");

async function loadEvents() {
  try {
    const res = await fetch("https://college-event-registration-n942.onrender.com/api/events"); 
    const all = await res.json();
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    events = all.filter((event) => {
      const deadline = new Date(event.registrationDeadline);
      deadline.setHours(23, 59, 59, 999); // open through the whole deadline day
      return event.status !== "Closed" && deadline >= now;
    });
    displayEvents(events);
  } catch (err) {
    console.error("Failed to load events:", err);
  }
}

function displayEvents(list) {
  cards.innerHTML = "";
  list.forEach((event) => {
    cards.innerHTML += `
      <div class="card">
        <img src="${event.banner}">
        <h2>${event.name}</h2>
        <p class="info"><i class="fa-solid fa-calendar"></i> ${new Date(event.date).toLocaleDateString()}</p>
        <p class="info"><i class="fa-solid fa-location-dot"></i> ${event.mode === "Online" ? "Online" : event.venue }</p>
        <p class="info">Category : ${event.category}</p>
        <p class="info">Team size : ${event.minTeamSize === event.maxTeamSize ? event.minTeamSize : `${event.minTeamSize} - ${event.maxTeamSize}`}</p>       
        <p class="info">${event.eligibility === "College Only" ? "IGDTUW Students Only" : "Open to All"}</p>
        <button onclick="viewDetails('${event._id}')">View Details</button>
      </div>
    `;
  });
}


loadEvents();

const search = document.getElementById("search");
const category = document.getElementById("category");

function applyFilters() {
  const keyword = search.value.toLowerCase();
  const value = category.value;

  const filtered = events.filter(
    (event) =>
      event.name.toLowerCase().includes(keyword) &&
      (value === "All" || event.category === value),
  );

  displayEvents(filtered);
}

search.addEventListener("input", applyFilters);
category.addEventListener("change", applyFilters);

function viewDetails(id) {
  const selectedEvent = events.find((event) => event._id === id);

  localStorage.setItem("selectedEvent", JSON.stringify(selectedEvent));

  window.location.href = "event.html";
}