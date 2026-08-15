const resetPasswordbtn=document.getElementById("editProfileBtn");
const logoutBtn=document.getElementById("logoutBtn");
const profileBtn = document.getElementById("profileBtn");
const dropdown = document.getElementById("profileDropdown");

profileBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdown.classList.toggle("active");

});

dropdown.addEventListener("click", function (e) {
    e.stopPropagation();
});

document.addEventListener("click", function () {
    dropdown.classList.remove("active");
});

async function loadUser() {
    try {
        const response = await fetch(
            "https://college-event-registration-n942.onrender.com/api/v1/auth/current-user",
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
loadUser();

logoutBtn.addEventListener("click", async () => {
    try {
        const response = await fetch("https://college-event-registration-n942.onrender.com/api/v1/auth/logout", {
            method: "POST",
            credentials: "include"
        });

        if (response.ok) {
            window.location.href = "../../Authentication/html/login.html";
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        console.error(error);
        alert("Logout failed.");
    }
});

resetPasswordbtn.addEventListener("click", () => {
    window.location.href = "../../Authentication/html/change-password.html";
});