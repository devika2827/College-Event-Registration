const upcoming = document.getElementById("upcoming");

const past = document.getElementById("past");

async function loadRegistrations() {
  const response = await fetch("/api/registrations/my", {
    credentials: "include",
  });

  const registrations = await response.json();

  registrations.forEach((reg) => {
    const event = reg.event;

    const today = new Date();

    const eventDate = new Date(event.date);

    const card = `

<div class="card">

<img src="/uploads/${event.banner}">

<h2>${event.name}</h2>

<p>${event.category}</p>

<p>${event.venue}</p>

<p>${eventDate.toLocaleDateString()}</p>

<span class="status ${eventDate >= today ? "upcoming" : "past"}">

${eventDate >= today ? "Upcoming" : "Completed"}

</span>

</div>

`;

    if (eventDate >= today) {
      upcoming.innerHTML += card;
    } else {
      past.innerHTML += card;
    }
  });
}

loadRegistrations();
