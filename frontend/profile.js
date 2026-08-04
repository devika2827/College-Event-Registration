const resetPasswordbtn=document.getElementById("editProfileBtn");
const logoutBtn=document.getElementById("logoutBtn");


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