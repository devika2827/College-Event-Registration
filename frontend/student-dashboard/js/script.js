const events = [
  {
    id: 1,
    title: "Hackathon 2025",
    category: "Tech",
    date: "12 July 2025",
    time: "9:00 AM",
    venue: "Main Auditorium",
    lastDate: "5 July 2025",
    description: "24-hour coding competition.",
    rules: ["Bring College ID", "Laptop compulsory", "Maximum 4 members"],
    image:
      "https://www.shutterstock.com/image-vector/hackathon-banner-illustration-abstract-futuristic-260nw-1662606928.jpg",
  },

  {
    id: 2,
    title: "AI Workshop",
    category: "Workshop",
    date: "18 July 2025",
    time: "11:00 AM",
    venue: "Lab 3",
    lastDate: "15 July 2025",
    description: "Learn AI and Machine Learning.",
    rules: ["Notebook required", "Free Entry", "Limited Seats"],
    image:
      "https://ieaghg.org/wp-content/uploads/2025/03/AI-in-CCUS-Workshop-AI-Technology-held-in-mans-hand-1.webp",
  },
];

const cards = document.getElementById("cards");

function displayEvents(list) {
  cards.innerHTML = "";

  list.forEach((event) => {
    cards.innerHTML += `

<div class="card">

<img src="${event.image}">

<h2>${event.title}</h2>

<p class="info">
<i class="fa-solid fa-calendar"></i>
${event.date}
</p>

<p class="info">
<i class="fa-solid fa-location-dot"></i>
${event.venue}
</p>

<p class="info">
Category :
${event.category}
</p>

<button onclick="viewDetails(${event.id})">
    View Details
</button>

</div>

`;
  });
}

displayEvents(events);

const search = document.getElementById("search");

search.addEventListener("keyup", () => {
  const keyword = search.value.toLowerCase();

  const filtered = events.filter((event) =>
    event.title.toLowerCase().includes(keyword),
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
  const selectedEvent = events.find((event) => event.id === id);

  localStorage.setItem("selectedEvent", JSON.stringify(selectedEvent));

  window.location.href = "event.html";
}

//Profile dropdown box

const profileBtn = document.getElementById("profileBtn");
const dropdown = document.getElementById("profileDropdown");
const homeBtn = document.getElementById("homeBtn");
homeBtn.addEventListener("click", function () {
    window.location.href = "../../admin/html/dashboard.html";
});
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