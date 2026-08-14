const loginForm = document.getElementById("loginForm");
document.querySelectorAll(".toggle-eye").forEach(button => {

    button.addEventListener("click", () => {

        console.log("Eye clicked");

        const input = document.getElementById(button.dataset.target);

        console.log(input);

        if (input.type === "password") {
            input.type = "text";
        } else {
            input.type = "password";
        }

    });

});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const identifier = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const body = { password };

    // Determine whether the user entered an email or username
    if (identifier.includes("@")) {
        body.email = identifier;
    } else {
        body.username = identifier;
    }

    try {
        const response = await fetch("https://college-event-registration-n942.onrender.com/api/v1/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (response.ok) {
             window.location.href = "../../student-dashboard/html/index.html";

        } else {
             if (data.unverified) {
                window.location.href =`verification.html?email=${encodeURIComponent(data.email)}`;
                return;
            }
            throw new Error(
                data.message || "Login failed"
            );
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Could not connect to the server.");
    }
});
