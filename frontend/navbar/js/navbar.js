const profileBtn = document.getElementById("profileBtn");
const dropdown = document.getElementById("profileDropdown");

profileBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdown.classList.toggle("active");
});

document.addEventListener("click", function () {
    dropdown.classList.remove("active");
});

dropdown.addEventListener("click", function (e) {
    e.stopPropagation();
});