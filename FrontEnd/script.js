// ****** 1. RECUPERATION DES DONNEES API ET AFFICHAGE DES IMAGES DANS LA GALLERIE.

// Récupération des données de l'API et affichage des images dans la galerie : On commence
// par créer des éléments de la galerie et les ajouter au DOM. Ensuite, on effectue une requête
// fetch à l'API pour récupérer les projets (images) et les catégories. Les projets sont stockés
// dans le tableau allProjects. Les images sont créées à l'aide de la fonction createImageWithCaption
// et ajoutées à la galerie.

const imagesGroup = document.querySelector(".imagesGroup");
const divGallery = document.createElement("div");
divGallery.classList.add("gallery");
imagesGroup.appendChild(divGallery);

function createImageWithCaption(id, src, alt, caption) {
  const figure = document.createElement("figure");
  figure.classList.add("gallery-item");
  figure.setAttribute("data-id", id);
  const image = document.createElement("img");
  image.src = src;
  image.alt = alt;
  figure.append(
    image,
    (document.createElement("figcaption").textContent = alt)
  );
  figure.setAttribute("data-category", caption);
  return figure;
}

let allProjects = [];

fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {
    allProjects = data;
    data.forEach((item) => {
      const image = createImageWithCaption(
        item.id,
        item.imageUrl,
        item.title,
        item.categoryId
      );
      divGallery.appendChild(image);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// **********  2. FILTRAGE DES IMAGES PAR CATEGORIE. ************

// Les images sont filtrées en fonction des catégories sélectionnées.

// - "allCategories" est initialisée avec un tableau contenant une catégorie spéciale "Tous".
// - Une requête est effectuée à l'URL  pour obtenir la liste des catégories disponibles.
// - La réponse de la requête est traitée en convertissant la réponse en JSON.
// - Pour chaque catégorie obtenue, l'objet catégorie est ajouté au tableau allCategories.
// HTML avec les options de catégorie.
// - L'élément du DOM avec l'ID "blocFilter" est sélectionné.
// - Pour chaque catégorie dans allCategories, un bouton est créé et configuré avec les
// attributs appropriés, tels que la classe, l'ID et le texte.
// - Si la catégorie a un ID de -1, une classe supplémentaire "fontButton2" est ajoutée au bouton.
// - Le bouton est ajouté à l'élément du DOM avec l'ID "blocFilter"
// - Un écouteur d'événement est attaché à chaque bouton pour gérer le clic de l'utilisateur.
// - Lorsqu'un bouton est cliqué, tous les boutons du filtre sont réinitialisés en supprimant la classe "fontButton2" et le bouton cliqué reçoit la classe "fontButton2".
// - Ensuite, tous les éléments de la galerie d'images ayant la classe "gallery-item" sont parcourus.

let allCategories = [
  {
    id: -1,
    name: "Tous",
  },
];

fetch("http://localhost:5678/api/categories")
  .then((response) => response.json())
  .then((categories) => {
    categories.forEach((element) => {
      allCategories.push(element);
    });

    categorySelect(categories);

    const filterBloc = document.getElementById("blocFilter");

    allCategories.forEach((category) => {
      const buttonFilter = document.createElement("button");
      buttonFilter.setAttribute("class", "all active fontButton");
      buttonFilter.setAttribute("id", category.id);
      buttonFilter.textContent = category.name;

      if (category.id === -1) {
        buttonFilter.classList.add("fontButton2");
      }

      filterBloc.appendChild(buttonFilter);
      buttonFilter.addEventListener("click", () => {
        filterBloc.querySelectorAll("button").forEach((btn) => {
          btn.classList.remove("fontButton2");
        });
        buttonFilter.classList.add("fontButton2");

        buttonFilter.setAttribute("class", "all active fontButton fontButton2");
        divGallery.querySelectorAll(".gallery-item").forEach((image) => {
          image.style.display =
            buttonFilter.id == -1 ||
            image.getAttribute("data-category") === buttonFilter.id
              ? "block"
              : "none";
        });
      });
    });
  })
  .catch((error) => {
    console.log(error);
  });

//**************   3. EDITOR MODE **************//

// Pour le mode Administrateur on gère l'affichage des éléments en fonction de l'état de connexion
// de l'utilisateur. Il vérifie si un token d'authentification existe dans le localStorage.
// Si le token existe, l'utilisateur est considéré comme connecté et les éléments relatifs
// au mode éditeur sont affichés, tandis que les filtres sont masqués. Le texte du lien de
// connexion devient "logout" et un événement "click" est ajouté pour déconnecter l'utilisateur
// en supprimant le token d'authentification et en rechargeant la page. Si le token n'existe pas,
// le mode éditeur est masqué, le texte du lien de connexion est "login" et un événement "click"
// est ajouté pour rediriger l'utilisateur vers la page de connexion. La fonction manageDisplay
// est appelée pour gérer ces affichages.

const loginLink = document.querySelectorAll("header nav ul li")[2];

function manageDisplay() {
  const editorMode = document.querySelector(".editorMode");
  const editorModePs = document.querySelectorAll(".editorModeP");
  const filters = document.querySelector(".filters");
  const token = localStorage.getItem("authToken");

  if (token) {
    editorMode.style.display = "flex";
    editorModePs.forEach((editorModeP) => {
      editorModeP.style.visibility = "visible";
    });
    filters.style.display = "none";
    loginLink.textContent = "logout";
    loginLink.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("authToken");
      window.location.reload();
    });
  } else {
    editorMode.style.display = "none";
    loginLink.textContent = "login";
    loginLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "login.html";
    });
  }
}

manageDisplay();

// ************  4. GESTIONS DE CLICK // TRAVAUX  MODALE ***************

// - Sélection des éléments DOM nécessaires avec des sélecteurs.
// - Attachement d'un écouteur d'événement à chaque élément  pour exécuter une fonction associée au clic.
// - Vidage du contenu de l'élément avec l'ID "gallery-modal".
// - Configuration de l'affichage ou de la masquage d'éléments de l'interface utilisateur via les
// éléments "modalWrapper" et "modalAddPhoto".
// - Création et configuration d'éléments DOM pour chaque élément du tableau allProjects.
// - Attachement d'un écouteur d'événement à l'icône de corbeille pour afficher une boîte de
// confirmation de suppression.
// - Attachement d'un écouteur d'événement à l'icône de la flèche gauche pour configurer l'affichage
// des éléments de l'interface utilisateur.
// - Ajout du contenu généré à l'élément avec l'ID "gallery-modal".
// - Affichage de la modalité de la galerie en définissant la propriété display sur "flex".

const galleryModal = document.getElementById("modal1");
const galleryModalContent = galleryModal.querySelector("#gallery-modal");
const closeModal = document.querySelectorAll(".close-modal");
const boutonModal = document.querySelector(".buttonModal");
const modalWrapper = document.querySelector(".modal-wrapper");
const modalAddPhoto = document.querySelector(".modal-addPhoto");

document.querySelectorAll(".editorModeP").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    galleryModalContent.innerHTML = "";

    modalWrapper.style.display = "block";
    modalAddPhoto.style.display = "none";

    allProjects.forEach((image) => {
      const imgContainer = document.createElement("div");
      imgContainer.classList.add("img-container");
      imgContainer.setAttribute("data-id", image.id);
      const img = document.createElement("img");
      img.src = image.imageUrl;
      img.alt = "";
      imgContainer.appendChild(img);
      const divTrash = document.createElement("div");
      divTrash.setAttribute("class", "trash-icon-container");

      const icon = document.createElement("i");
      icon.setAttribute("class", "fa-solid fa-trash-can");
      divTrash.appendChild(icon);
      imgContainer.appendChild(divTrash);

      divTrash.addEventListener("click", function (Event) {
        const confirmDelete = window.confirm(
          "Êtes-vous sûr de vouloir supprimer cette image ?"
        );
        if (confirmDelete) {
          deleteItem(image.id);
        }
      });

      const text = document.createElement("p");
      text.textContent = "éditer";
      imgContainer.appendChild(text);
      galleryModalContent.appendChild(imgContainer);

      const arrowLeftIcon = document.querySelector(".fa-arrow-left");
      arrowLeftIcon.addEventListener("click", () => {
        modalWrapper.style.display = "block";
        modalAddPhoto.style.display = "none";
      });
    });
    galleryModal.style.display = "flex";
  });
});

// On ajoute un événements au "click" qui ferme le modal quand on click à l'extérieur de celle-ci.

galleryModal.addEventListener("click", (e) => {
  if (e.target === galleryModal) {
    galleryModal.style.display = "none";
    modalWrapper.style.display = "block";
    modalAddPhoto.style.display = "none";
  }
});

closeModal.forEach((element) => {
  element.addEventListener("click", () => {
    galleryModal.style.display = "none";
  });
});

boutonModal.addEventListener("click", (e) => {
  e.preventDefault();
  modalWrapper.style.display = "none";
  modalAddPhoto.style.display = "block";
});
// ************  SUPRESSION DES IMAGES DU DOM DEPUIS L'API ***************

// La fonction deleteItem(imageId) envoie une requête DELETE à l'URL spécifiée avec l'ID de l'image
//  à supprimer, en incluant l'autorisation d'accès. Elle vérifie la réponse de la requête pour
// s'assurer que l'élément a été supprimé avec succès. Si tel est le cas, elle met à jour allProjects
// en filtrant l'élément correspondant, et supprime l'élément de la galerie et du modal en utilisant
// les sélecteurs appropriés. Si la suppression échoue, une erreur est générée et une alerte est affichée
// à l'utilisateur.

function deleteItem(imageId) {
  fetch(`http://localhost:5678/api/works/${imageId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  })
    .then((response) => {
      if (response.ok && response.status == 204) {
        console.log("l'element est bien supprimé");
        allProjects = allProjects.filter((element) => element.id != imageId);
        const figuresGalery = document.querySelectorAll(".gallery-item");
        figuresGalery.forEach((element) => {
          if (element.dataset.id == imageId) {
            element.remove();
          }
        });
        const figuresModal = document.querySelectorAll(".img-container");
        figuresModal.forEach((element) => {
          if (element.dataset.id == imageId) {
            element.remove();
          }
        });
      } else {
        throw new Error("Erreur lors de la suppression de l'image");
      }
    })
    .catch((error) => {
      console.log(error);
      alert("Une erreur est survenue Veuillez contacter l'admin du site!!");
    });
}
//************  AJOUTER UNE IMAGE COMME TRAVAUX *****************/

// On créé une fonction qui permet de remplir un élément de sélection HTML avec des options générées
// à partir d'un tableau d'objets de catégories. Chaque option a une valeur et un texte
// correspondant à l'id et au nom de la catégorie.

function categorySelect(categories) {
  const categorySelect = document.getElementById("category");
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}

// Ce bloc déclare les variables et constantes nécessaires pour les éléments et les données
// utilisées dans le reste du code. Il crée également un élément <input> de type "file"
// qui est ajouté au formulaire de téléchargement.

const buttonAddPhoto = document.querySelector(".buttonAddPhoto");
const uploadForm = document.getElementById("uploadForm");
const buttonValidate = document.querySelector(".buttonValidate");

const input = document.createElement("input");
input.type = "file";
input.name = "image";
input.accept = "image/*";
input.style.display = "none";
uploadForm.appendChild(input);

let file;

// Cet événement se déclenche lorsque l'utilisateur sélectionne un fichier à télécharger.
// Il récupère le premier fichier sélectionné et effectue des actions pour mettre à jour
// l'interface utilisateur en conséquence.

input.addEventListener("change", () => {
  file = input.files[0];
  const modal = document.querySelector(".modal-addPhoto");
  const titleInput = modal.querySelector("#title");
  const categorySelect = modal.querySelector("#category");

  // On active ou désactive le bouton de validation en fonction de l'état des champs titleInput
  // et categorySelect. La fonction  définit la couleur de fond du bouton
  // de validation en vert  si les champs sont valides (non vides pour titleInput
  // et différent de "default" pour categorySelect), sinon elle le réinitialise.

  function enableValidateButton() {
    buttonValidate.style.backgroundColor =
      titleInput.value.trim() !== "" && categorySelect.value !== "default"
        ? "#1D6154"
        : "";
  }

  titleInput.addEventListener("input", enableValidateButton);
  categorySelect.addEventListener("input", enableValidateButton);

  // On affiche l'image sélectionné et retire le logo et boutton de recherche d'ajout de fichier.

  const img = document.createElement("img");
  img.id = "upload-image";
  img.src = URL.createObjectURL(file);
  const divAddPhoto = modal.querySelector(".divAddPhoto");
  divAddPhoto.appendChild(img);
  divAddPhoto.querySelector("p").style.display = "none";
  divAddPhoto.querySelector("button").style.display = "none";
});

// L'événement de clic écoute le bouton "buttonValidate", envoie les données du formulaire
// via une requête POST, traite la réponse JSON et effectue des actions sur l'interface utilisateur.

// - Il empêche le comportement par défaut de l'événement de clic.
// - Il sélectionne des éléments du document.
// - Il crée un objet FormData pour stocker les données du formulaire.
// - Il envoie une requête POST à une URL spécifique avec les données du formulaire.
// - Il traite la réponse JSON obtenue.
// - Il effectue des modifications sur l'interface utilisateur en fonction de la réponse.
// - Il gère les erreurs éventuelles.

buttonValidate.addEventListener("click", (event) => {
  event.preventDefault();
  const modal = document.querySelector(".modal-addPhoto");
  const titleInput = modal.querySelector("#title");
  const categorySelect = modal.querySelector("#category");
  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", titleInput.value);
  formData.append("category", categorySelect.value);

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      allProjects.push(data);
      const image = createImageWithCaption(
        data.id,
        data.imageUrl,
        data.title,
        data.categoryId
      );
      console.log(image);
      divGallery.appendChild(image);
      galleryModal.style.display = "none";

      uploadForm.reset();
      const divAddPhoto = modal.querySelector(".divAddPhoto");
      divAddPhoto.querySelector("p").style.display = "block";
      divAddPhoto.querySelector("button").style.display = "block";
      buttonValidate.style.background = "#a7a7a7";
      const uploadedImage = document.getElementById("upload-image");
      if (uploadedImage) {
        divAddPhoto.removeChild(uploadedImage);
      }
    })
    .catch((error) => console.error(error));
});

// On simule le clic pour ouvrir la fenetre de recherche du fichier a telecharger.

buttonAddPhoto.addEventListener("click", () => {
  input.click();
});
