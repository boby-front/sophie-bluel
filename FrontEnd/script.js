// Sélectionne l'élément HTML avec la classe "imagesGroup"
const imagesGroup = document.querySelector(".imagesGroup");

// Crée un nouvel élément <div> et lui attribue la classe "gallery"
const divGallery = document.createElement("div");
divGallery.className = "gallery";

// Ajoute l'élément <div> nouvellement créé à l'élément "imagesGroup"
imagesGroup.appendChild(divGallery);

// Envoie une requête à l'API "http://localhost:5678/api/works"
// et traite la réponse sous forme de données JSON
fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(data => {
    // Parcours les données reçues de l'API
    data.forEach(item => {
      // Crée un nouvel élément <figure> contenant une image, un texte alternatif et une légende
      const image = createImageWithCaption(item.imageUrl, item.title, item.category.name);
      // Ajoute l'élément <figure> nouvellement créé à l'élément "divGallery"
      divGallery.appendChild(image);
    });

    // Sélectionne tous les boutons de filtre
    const filterButtons = document.querySelectorAll(".filters button");

    // Ajoute un écouteur d'événements sur chaque bouton de filtre
    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        // Applique la classe "active" au bouton cliqué
        filterButtons.forEach(b => b.classList.toggle("active", b === button));
        // Récupère la première classe du bouton cliqué
        const className = button.className.split(" ")[0];
        // Sélectionne toutes les images à filtrer
        const images = divGallery.querySelectorAll(".gallery-item");
        // Parcours toutes les images et leur attribue la propriété "display" en fonction du filtre sélectionné
        images.forEach(image => image.style.display = (className === "all" || image.classList.contains(className)) ? "block" : "none");
      });
    });
  });

// Crée un nouvel élément <figure> contenant une image, un texte alternatif et une légende
function createImageWithCaption(src, alt, caption) {
  const figure = document.createElement('figure');
  figure.classList.add("gallery-item");
  const image = document.createElement('img');
  image.src = src;
  image.alt = alt;
  figure.append(image, document.createElement('figcaption').textContent = alt);
  // Attribue la classe correspondant à la catégorie de l'image
  if (caption === "Objets") figure.classList.add("objects");
  else if (caption === "Appartements") figure.classList.add("apartments");
  else if (caption === "Hotels & restaurants") figure.classList.add("hotels");
  return figure;
}

                 //Filter Button Selected//
                 
// Récupération de tous les boutons de la classe .filters
const filterButtons = document.querySelectorAll('.filters button');

// Boucle sur tous les boutons
filterButtons.forEach(button => {
  // Ajout d'un écouteur d'événements 'click'
  button.addEventListener('click', () => {
    // Suppression de la classe .fontButtonSelected de tous les boutons
    filterButtons.forEach(button => {
      button.classList.remove('fontButtonSelected');
    });
    // Ajout de la classe .fontButtonSelected au bouton sélectionné
    button.classList.add('fontButtonSelected');
  });
});
