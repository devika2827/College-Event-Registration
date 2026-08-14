const form = document.getElementById("changePasswordForm");
const toast = document.getElementById("toast");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {

        toast.className = "toast error";
        toast.textContent = "Passwords do not match.";

        return;
    }

    try {

        const response = await fetch(
            "https://college-event-registration-n942.onrender.com/api/v1/auth/change-password",
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            toast.className = "toast success";
            toast.textContent = data.message;

            form.reset();

        } else {

            toast.className = "toast error";
            toast.textContent = data.message;

        }

    } catch (err) {

        toast.className = "toast error";
        toast.textContent = "Something went wrong.";

    }

});