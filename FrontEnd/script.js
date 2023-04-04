// Sélectionner l'élément HTML avec la classe "imagesGroup"
const imagesGroup = document.querySelector(".imagesGroup");

// Créer un nouvel élément <div> et lui attribuer la classe "gallery"
const divGallery = document.createElement("div");
divGallery.classList.add("gallery");

// Ajouter l'élément <div> nouvellement créé à l'élément "imagesGroup"
imagesGroup.appendChild(divGallery);

// Envoyer une requête à l'API "http://localhost:5678/api/works"
// et traiter la réponse sous forme de données JSON
fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(data => {
    // Parcourir les données reçues de l'API
    data.forEach(item => {
      // Créer un nouvel élément <figure> contenant une image, un texte alternatif et une légende
      const image = createImageWithCaption(item.imageUrl, item.title, item.category.name);
      // Ajouter l'élément <figure> nouvellement créé à l'élément "divGallery"
      divGallery.appendChild(image);
    });

    // Sélectionner tous les boutons de filtre
    const filterButtons = document.querySelectorAll(".filters button");

    // Ajouter un écouteur d'événements sur chaque bouton de filtre
    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        // Appliquer la classe "active" au bouton cliqué
        filterButtons.forEach(b => b.classList.toggle("active", b === button));
        // Récupérer la première classe du bouton cliqué
        const className = button.classList[0];
        // Sélectionner toutes les images à filtrer
        const images = divGallery.querySelectorAll(".gallery-item");
        // Parcourir toutes les images et leur attribuer la propriété "display" en fonction du filtre sélectionné
        images.forEach(image => {
          image.style.display = (className === "all" || image.classList.contains(className)) ? "block" : "none";
        });
      });
    });

    // Ajouter la classe "fontButton2" au bouton "Tous"
    filterButtons[0].classList.add('fontButton2');
  });

// Créer un nouvel élément <figure> contenant une image, un texte alternatif et une légende
function createImageWithCaption(src, alt, caption) {
  const figure = document.createElement('figure');
  figure.classList.add("gallery-item");
  const image = document.createElement('img');
  image.src = src;
  image.alt = alt;
  figure.append(image, document.createElement('figcaption').textContent = alt);
  // Attribuer la classe correspondant à la catégorie de l'image
  if (caption === "Objets") figure.classList.add("objects");
  else if (caption === "Appartements") figure.classList.add("apartments");
  else if (caption === "Hotels & restaurants") figure.classList.add("hotels");
  return figure;
}

// Ajouter un écouteur d'événements 'click' sur chaque bouton
const filterButtons = document.querySelectorAll('.filters button');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Supprimer la classe "fontButton2" de tous les boutons
    filterButtons.forEach(b => b.classList.remove('fontButton2'));
    // Ajouter la classe "fontButton2" au bouton sélectionné
    button.classList.add('fontButton2');
  });
});


// Récupération de l'élément <li> correspondant à la connexion
const loginLink = document.querySelectorAll("header nav ul li")[2];

// Ajout d'un gestionnaire d'événements de clic
loginLink.addEventListener("click", function() {
  // Redirection vers la page de connexion
  window.location.href = "login.html";
});


