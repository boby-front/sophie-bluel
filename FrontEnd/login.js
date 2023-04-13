//Sélectionne le formulaire HTML par son ID et l'assigne à la variable form.
const form = document.querySelector('#form');
//Sélectionne l'élément HTML qui affichera le message d'erreur et l'assigne à la variable error.
const error = document.querySelector('#error-message');


//Ajoute un écouteur d'événement sur la soumission du formulaire qui exécute une fonction anonyme 
//lorsque le formulaire est soumis.
form.addEventListener('submit', (e) => {
//Empêche la soumission du formulaire de recharger la page.
  e.preventDefault(); 
//Récupère la valeur de l'e-mail entré par l'utilisateur dans le champ 
//"email" du formulaire et l'assigne à la variable email.
  const email = form.email.value;
//Récupère la valeur du mot de passe entré par l'utilisateur dans
//le champ "password" du formulaire et l'assigne à la variable password.
  const password = form.password.value;
//Envoie une requête POST à l'API pour se connecter, avec l'URL de l'API 
//et les options de la requête définies comme arguments.
  fetch('http://localhost:5678/api/users/login', {
//Définit la méthode de la requête HTTP comme POST.
    method: 'POST',
    headers: {
//Définit le type de contenu de la requête comme JSON.
      'Content-Type': 'application/json'
    },
//Convertit l'e-mail et le mot de passe en objet JSON et les inclut dans le corps de la requête.
    body: JSON.stringify({ email, password })
  })
//Convertit la réponse HTTP en objet JSON pour être manipulée plus facilement.
  .then(response => response.json())
  .then(data => {
//Vérifie si la réponse de l'API contient un jeton d'accès.
    if (data.token) {
//Enregistre le jeton d'accès dans le stockage local du navigateur.
      localStorage.setItem('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY4MDYwODk0NCwiZXhwIjoxNjgwNjk1MzQ0fQ.MiDaAmKlEryxowfeiLg_CeTGWCBgEFvrnuZjN8Lu52s', data.token);
//Redirige l'utilisateur vers la page d'accueil.
      window.location.href = 'index.html';
//Affiche un message d'erreur si l'API renvoie une erreur.
    } else {
      error.textContent = 'Nom d\'utilisateur ou mot de passe incorrect.';
    }
  })
});

