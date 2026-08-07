let events = []

const cards = document.getElementById("cards");

async function loadEvents() {
  try {
    const res = await fetch("/api/events"); // match your server's port/base path
    events = await res.json();
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
        <img src="/uploads/${event.banner}">
        <h2>${event.name}</h2>
        <p class="info"><i class="fa-solid fa-calendar"></i> ${new Date(event.date).toLocaleDateString()}</p>
        <p class="info"><i class="fa-solid fa-location-dot"></i> ${event.mode === "Online" ? "Online" : event.venue }</p>
        <p class="info">Category : ${event.category}</p>
        <p class="info">Team size : ${event.minTeamSize} - ${event.maxTeamSize}</p>
        <p class="info">${event.eligibility === "College Only" ? "IGDTUW Students Only" : "Open to All"}</p>
        <button onclick="viewDetails('${event._id}')">View Details</button>
      </div>
    `;
  });
}


loadEvents();

const search = document.getElementById("search");

search.addEventListener("keyup", () => {
  const keyword = search.value.toLowerCase();

  const filtered = events.filter((event) =>
    event.name.toLowerCase().includes(keyword),
  );

  displayEvents(filtered);
});

const category = document.getElementById("category");

category.addEventListener("change", () => {
  const value = category.value;

  if (value === "All") {
    displayEvents(events);

    return;
  }

  const filtered = events.filter((event) => event.category === value);

  displayEvents(filtered);
});

function viewDetails(id) {
  const selectedEvent = events.find((event) => event._id === id);

  localStorage.setItem("selectedEvent", JSON.stringify(selectedEvent));

  window.location.href = "event.html";
}

