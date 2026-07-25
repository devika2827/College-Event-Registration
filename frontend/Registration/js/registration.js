/* =========================================================
   EventHub — Registration Page Logic
   =========================================================
   How this connects to the rest of the site:
   On your Browse Events page, each "View Details" button should
   link here with the event's id in the URL, e.g.:

     <a href="../registration/registration.html?eventId=1">View Details</a>

   This file reads that id, finds the matching event, and fills
   in the event info card. Then it validates and "submits" the
   registration form.

   NOTE: eventsData below is a placeholder that mirrors the four
   events in your screenshot. Replace it with whatever your
   teammate's Events page actually uses (a shared JS file, JSON
   file, or API call) so both pages read from one source of truth.
   ========================================================= */

// ---------- 1. Placeholder event data (swap for shared data source) ----------
const eventsData = [
  {
    id: "1",
    title: "Hackathon 2025",
    date: "12 July 2026",
    location: "Main Hall",
    category: "Tech",
    seats: 42,
    image: "https://via.placeholder.com/500x300?text=Hackathon+2025",
    description: "A 24-hour coding hackathon open to all branches. Bring your own team or join one on the spot."
  },
  {
    id: "2",
    title: "Football Tournament",
    date: "20 July 2026",
    location: "Sports Ground",
    category: "Sports",
    seats: 16,
    image: "https://via.placeholder.com/500x300?text=Football+Tournament",
    description: "Inter-department football knockout tournament. Teams of 7, register as a squad."
  },
  {
    id: "3",
    title: "AI Workshop",
    date: "5 August 2026",
    location: "Lab 3",
    category: "Workshop",
    seats: 30,
    image: "https://via.placeholder.com/500x300?text=AI+Workshop",
    description: "Hands-on session covering the basics of machine learning with Python."
  },
  {
    id: "4",
    title: "Web Development Bootcamp",
    date: "10 August 2026",
    location: "Computer Lab",
    category: "Workshop",
    seats: 25,
    image: "https://via.placeholder.com/500x300?text=Web+Dev+Bootcamp",
    description: "A full-day bootcamp covering HTML, CSS, and JavaScript fundamentals for beginners."
  }
];

// ---------- 2. Read eventId from the URL and load the event ----------
function getEventIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("eventId");
}

function loadEventInfo() {
  const eventId = getEventIdFromUrl();
  const event = eventsData.find(e => e.id === eventId);

  const titleEl = document.getElementById("eventTitle");

  if (!event) {
    // No valid eventId in the URL — show a clear fallback instead of blank fields
    titleEl.textContent = "Event not found";
    document.getElementById("eventDescription").textContent =
      "We couldn't find this event. Please go back and choose an event from the list.";
    document.getElementById("submitBtn").disabled = true;
    return null;
  }

  document.getElementById("eventImage").src = event.image;
  document.getElementById("eventImage").alt = event.title;
  titleEl.textContent = event.title;
  document.getElementById("eventDate").textContent = event.date;
  document.getElementById("eventLocation").textContent = event.location;
  document.getElementById("eventCategory").textContent = event.category;
  document.getElementById("eventSeats").textContent = event.seats;
  document.getElementById("eventDescription").textContent = event.description;

  return event;
}

// ---------- 3. Validation helpers ----------
function showError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + "Error");
  input.classList.add("input-error");
  errorEl.textContent = message;
}

function clearError(fieldId) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + "Error");
  input.classList.remove("input-error");
  errorEl.textContent = "";
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value) {
  return /^[6-9]\d{9}$/.test(value); // 10-digit Indian mobile number pattern
}

function validateForm(form) {
  let isValid = true;

  const fullName = form.fullName.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const rollNo = form.rollNo.value.trim();
  const year = form.year.value;
  const terms = form.terms.checked;

  ["fullName", "email", "phone", "rollNo", "year", "terms"].forEach(clearError);

  if (fullName.length < 3) {
    showError("fullName", "Enter your full name (at least 3 characters).");
    isValid = false;
  }

  if (!isValidEmail(email)) {
    showError("email", "Enter a valid email address.");
    isValid = false;
  }

  if (!isValidPhone(phone)) {
    showError("phone", "Enter a valid 10-digit mobile number.");
    isValid = false;
  }

  if (rollNo.length < 3) {
    showError("rollNo", "Enter your roll number / student ID.");
    isValid = false;
  }

  if (!year) {
    showError("year", "Select your year.");
    isValid = false;
  }

  if (!terms) {
    showError("terms", "You must agree to the rules to register.");
    isValid = false;
  }

  return isValid;
}

// ---------- 4. Generate a simple registration ID ----------
function generateRegId(event) {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `EH-${event.id}-${random}`;
}

// ---------- 5. Handle submit ----------
function handleSubmit(event, currentEvent) {
  event.preventDefault();
  const form = event.target;

  if (!currentEvent) return; // no valid event loaded, nothing to submit

  if (!validateForm(form)) return;

  const regId = generateRegId(currentEvent);

  // Save the registration locally so the admin dashboard teammate
  // can later read it (swap this for a real API call once the
  // backend/auth teammates have an endpoint ready).
  const registration = {
    regId,
    eventId: currentEvent.id,
    eventTitle: currentEvent.title,
    fullName: form.fullName.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    rollNo: form.rollNo.value.trim(),
    year: form.year.value,
    teamName: form.teamName.value.trim(),
    registeredAt: new Date().toISOString()
  };

  const existing = JSON.parse(localStorage.getItem("eventRegistrations") || "[]");
  existing.push(registration);
  localStorage.setItem("eventRegistrations", JSON.stringify(existing));

  // Swap the form card for the success message
  form.hidden = true;
  document.getElementById("successEventName").textContent = currentEvent.title;
  document.getElementById("successRegId").textContent = regId;
  document.getElementById("successBox").hidden = false;
}

// ---------- 6. Wire everything up ----------
document.addEventListener("DOMContentLoaded", () => {
  const currentEvent = loadEventInfo();
  const form = document.getElementById("registrationForm");

  form.addEventListener("submit", e => handleSubmit(e, currentEvent));
});