let root = document.getElementById("root");

let inputField = `<div id="logIn" class="logIn"><input type="text" placeholder="Användarnamn" id="userName">
                  <button id="btn">Logga in</button><div class="btnArea"></div></div></div>`;

root.insertAdjacentHTML("afterbegin", inputField);

btn.addEventListener("click", function() {
    if (userName.value == "admin" ){
        console.log("inloggad");
        location.href = "./users";

    } else{
        console.log("fel användarnamn");
        root.insertAdjacentHTML("afterend", "<p> Fel användarnamn! Försök igen.</p>");
    }
});


