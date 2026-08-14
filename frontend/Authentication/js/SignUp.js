const signupForm = document.getElementById("signupForm");


// ================= PASSWORD VISIBILITY =================

document.querySelectorAll(".toggle-eye").forEach(button => {

    button.addEventListener("click", () => {

        const input = document.getElementById(
            button.dataset.target
        );

        input.type =
            input.type === "password"
                ? "text"
                : "password";

    });

});


// ================= SIGNUP =================

signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();


    const name =
        document.getElementById("name").value.trim();

    const username =
        document.getElementById("username").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // ================= VALIDATION =================

    if (username.includes(" ")) {

        alert("Username cannot contain spaces.");

        return;

    }


    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;

    }


    const body = {

        name,
        username,
        email,
        password

    };


    try {

        const response = await fetch(
            "https://college-event-registration-n942.onrender.com/api/v1/auth/register",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify(body)

            }
        );


        // ================= READ RESPONSE =================

        const contentType =
            response.headers.get("content-type") || "";

        let data;


        if (contentType.includes("application/json")) {

            data = await response.json();

        } else {

            const text = await response.text();

            console.error(
                "Server returned non-JSON response:",
                text
            );

            alert(
                `Server error (${response.status}). Please try again.`
            );

            return;
        }


        // ================= SUCCESS =================
       if (response.ok) {

    alert(
        data.message ||
        "Please verify your email."
    );

    window.location.href =`verification.html?email=${encodeURIComponent(email)}`;

    return;
}

        // ================= BACKEND ERROR =================

        alert(
            data.message ||
            "Registration failed."
        );

    }


    catch (error) {

        console.error(
            "Signup error:",
            error
        );

        alert(
            "Could not connect to the server."
        );

    }

});