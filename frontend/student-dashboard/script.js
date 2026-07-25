const events = [
  {
    title: "Hackathon 2025",
    category: "Tech",
    date: "12 July",
    venue: "Main Hall",
    image: "https://picsum.photos/400/250?1",
  },

  {
    title: "Football Tournament",
    category: "Sports",
    date: "20 July",
    venue: "Sports Ground",
    image: "https://picsum.photos/400/250?2",
  },

  {
    title: "AI Workshop",
    category: "Workshop",
    date: "5 August",
    venue: "Lab 3",
    image: "https://picsum.photos/400/250?3",
  },

  {
    title: "Web Development Bootcamp",
    category: "Workshop",
    date: "10 August",
    venue: "Computer Lab",
    image: "https://picsum.photos/400/250?4",
  },

  {
    title: "Coding Contest",
    category: "Tech",
    date: "15 August",
    venue: "Seminar Hall",
    image:
      "https://media.istockphoto.com/id/1976099664/photo/artificial-intelligence-processor-concept-ai-big-data-array.jpg?s=612x612&w=0&k=20&c=rTtWP9ywxZM_BygzURikdoWRHnO4ohD73Z-RDAg_u8M=",
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

<button>View Details</button>

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
