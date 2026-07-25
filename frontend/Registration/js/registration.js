
// Registration Button

const registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", function(){

    const confirmRegister = confirm("Do you want to register for this event?");

    if(confirmRegister){

        alert("You have successfully registered!");

        registerBtn.innerHTML = "Registered";

        registerBtn.disabled = true;

    }

});
