const signupForm = document.getElementById("signupForm");

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

    if(password !== confirmPassword){

        alert("Passwords do not match.");

        return;

    }

    const body = {

        name,
        username,
        email,
        password

    };

    try{

        const response = await fetch(
            "http://localhost:5001/api/v1/auth/register",
            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                credentials:"include",

                body:JSON.stringify(body)

            }

        );

        const data = await response.json();

        if(response.ok){

            alert("Registration Successful!");

            window.location.href="login.html";

        }

        else{

            alert(data.message);

        }

    }

    catch(error){

        console.error(error);

        alert("Could not connect to the server.");

    }

});