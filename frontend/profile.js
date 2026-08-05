const resetPasswordbtn=document.getElementById("editProfileBtn");
const logoutBtn=document.getElementById("logoutBtn");


const profileBtn = document.getElementById("profileBtn");
const dropdown = document.getElementById("profileDropdown");

// Open/Close on Profile click
profileBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdown.classList.toggle("active");
    loadUser();

});

// Prevent closing when clicking inside dropdown
dropdown.addEventListener("click", function (e) {
    e.stopPropagation();
});

// Close if user clicks anywhere else
document.addEventListener("click", function () {
    dropdown.classList.remove("active");
});

// Load current user's details
async function loadUser() {
    try {
        const response = await fetch(
            "http://localhost:8000/api/v1/auth/current-user",
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();

        if (response.ok) {
            document.getElementById("userName").textContent =
                data.user.name;

            document.getElementById("userUsername").textContent =
                "@" + data.user.username;

            document.getElementById("userEmail").textContent =
                data.user.email;
        } else {
            console.log(data.message);
        }

    } catch (error) {
        console.error("Error fetching user:", error);
    }
}
