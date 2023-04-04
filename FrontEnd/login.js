const form = document.querySelector('#form');
const error = document.querySelector('#error-message');
form.addEventListener('submit', (e) => {
  e.preventDefault(); // empêche la soumission du formulaire
  const email = form.email.value;
  const password = form.password.value;
  // envoie les informations de connexion au serveur pour vérification
  fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.token) {
      // stocke le token dans le stockage local
      localStorage.setItem('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY4MDYwODk0NCwiZXhwIjoxNjgwNjk1MzQ0fQ.MiDaAmKlEryxowfeiLg_CeTGWCBgEFvrnuZjN8Lu52s', data.token);
      // redirige l'utilisateur vers la page d'accueil
      window.location.href = 'index.html';
    } else {
      // affiche un message d'erreur
      error.textContent = 'Nom d\'utilisateur ou mot de passe incorrect.';
    }
  })
});