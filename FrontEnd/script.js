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


function createImageWithCaption(src, alt, caption) {
  const figure = document.createElement('figure');
  figure.classList.add("gallery-item");
  const image = document.createElement('img');
  image.src = src;
  image.alt = alt;
  figure.append(image, document.createElement('figcaption').textContent = alt);
  if (caption === "Objets") figure.classList.add("objects");
  else if (caption === "Appartements") figure.classList.add("apartments");
  else if (caption === "Hotels & restaurants") figure.classList.add("hotels");
  return figure;
}


 const filterButtons = document.querySelectorAll('.filters button');
 filterButtons.forEach(button => {
  button.addEventListener('click', () => {
  filterButtons.forEach(b => b.classList.remove('fontButton2'));
 button.classList.add('fontButton2');
});
});


/**************   EDITOR MODE **************/

const loginLink = document.querySelectorAll("header nav ul li")[2];
function manageDisplay() {
const editorMode = document.querySelector('.editorMode');
const editorModePs = document.querySelectorAll('.editorModeP');
const filters = document.querySelector('.filters');
const token = localStorage.getItem('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY4MDYwODk0NCwiZXhwIjoxNjgwNjk1MzQ0fQ.MiDaAmKlEryxowfeiLg_CeTGWCBgEFvrnuZjN8Lu52s');
if (token) {
editorMode.style.display = 'flex';
editorModePs.forEach(editorModeP => {
  editorModeP.style.visibility = 'visible';
});
filters.style.display = 'none';
loginLink.textContent = 'logout';
loginLink.addEventListener('click', function (e) {
e.preventDefault();
localStorage.removeItem('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY4MDYwODk0NCwiZXhwIjoxNjgwNjk1MzQ0fQ.MiDaAmKlEryxowfeiLg_CeTGWCBgEFvrnuZjN8Lu52s');
window.location.reload();
});
} else {
editorMode.style.display = 'none';
loginLink.textContent = 'login';
loginLink.addEventListener('click', function (e) {
e.preventDefault();
window.location.href = 'login.html';
});
}
}

manageDisplay();



/************  GESTIONS DE CLICK // TRAVAUX  MODALE***************/
const galleryModal = document.getElementById("modal1");
const galleryModalContent = galleryModal.querySelector("#gallery-modal");
const closeModal = document.querySelector(".close-modal");
document.querySelectorAll(".editorModeP").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    galleryModalContent.innerHTML = "";
    fetch("http://localhost:5678/api/works/")
      .then(response => response.json())
      .then(data => {
        data.forEach(image => {
          const imgElement = document.createElement("img");
          imgElement.src = image.imageUrl;
          galleryModalContent.appendChild(imgElement);
        });
        galleryModal.style.display = "flex";
      })
      .catch(error => console.error(error));
  });
});
galleryModal.addEventListener("click", e => {
  if (e.target === galleryModal) {
    galleryModal.style.display = "none";
  }
});
closeModal.addEventListener("click", () => {
  galleryModal.style.display = "none";
});


