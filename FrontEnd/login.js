// **************** GESTION DE CONNECTION *************//

const form = document.querySelector("#form");
const errorMessage = document.querySelector("#error-message");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = form.email.value;
  const password = form.password.value;

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 404) {
        throw new Error("Nom d'utilisateur ou mot de passe incorrect.");
      } else {
        throw new Error("Une erreur s'est produite lors de la connexion.");
      }
    })
    .then((data) => {
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        window.location.href = "index.html";
      }
    })
    .catch((error) => {
      errorMessage.innerText = error.message;
    });
});
