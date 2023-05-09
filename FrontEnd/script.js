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

// On récupère des catégories à partir d'une API et crée des boutons de filtrage pour afficher
// des éléments de galerie selon la catégorie choisie. Il commence par définir un tableau
// allCategories avec une catégorie "Tous" ayant un ID de -1. Ensuite, il récupère les catégories
// via l'API, les ajoute au tableau, et crée des boutons de filtrage pour chaque catégorie.
// Les boutons sont ajoutés à l'élément HTML avec l'ID "blocFilter", et lorsqu'un bouton est cliqué,
// les éléments de la galerie sont affichés ou masqués en fonction de la catégorie sélectionnée.

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

      // ************  SUPRESSION DES IMAGES DU DOM DEPUIS L'API ***************

      // On gère la suppression d'images dans une galerie en ajoutant un événement "click"
      // aux icônes de corbeille. Lorsqu'une icône est cliquée, une confirmation est demandée à l'utilisateur.
      // Si confirmé, une requête DELETE est envoyée à l'API avec l'ID de l'image et le token d'authentification.
      //  En cas de succès, le DOM est mis à jour pour refléter la suppression de l'image.

      function updateMainGallery(imageId) {
        const mainImage = document.querySelector(
          `figure[data-id="${imageId}"]`
        );
        if (mainImage) {
          mainImage.remove();
          console.log("Image supprimée du DOM principal");
        } else {
          console.log("Image non trouvée dans le DOM principal");
        }
      }
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

// On ajoute un écouteur d'événement pour la fermeture de la fenêtre modale. Lorsqu'on
// clique sur le bouton de fermeture la fenêtre modale est cachée.

closeModal.forEach((element) => {
  element.addEventListener("click", () => {
    galleryModal.style.display = "none";
  });
});

// On ajoute un écouteur d'événement pour le bouton "Ajouter une photo" dans la fenêtre modale.
// Lorsque l'utilisateur clique sur le bouton, la fenêtre modale de la galerie est cachée et
// la fenêtre modale d'ajout de photo est affichée.

boutonModal.addEventListener("click", (e) => {
  e.preventDefault();
  modalWrapper.style.display = "none";
  modalAddPhoto.style.display = "block";
});

//************  AJOUTER UNE IMAGE COMME TRAVAUX *****************/

function categorySelect(categories) {
  const categorySelect = document.getElementById("category");
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}

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
// sélectionne le bouton d'ajout de photo et le formulaire d'upload en utilisant leur classe et
//  leur identifiant respectifs.

const buttonAddPhoto = document.querySelector(".buttonAddPhoto");
const uploadForm = document.getElementById("uploadForm");

buttonAddPhoto.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.name = "image";
  input.accept = "image/*";
  input.style.display = "none";
  uploadForm.appendChild(input);

  // Dans la fonction de rappel de l'événement "change", le code récupère la photo sélectionnée
  //  par l'utilisateur et l'affiche dans la fenêtre modale.

  input.addEventListener("change", () => {
    const file = input.files[0];
    const modal = document.querySelector(".modal-addPhoto");
    const titleInput = modal.querySelector("#title");
    const categorySelect = modal.querySelector("#category");
    const buttonValidate = modal.querySelector(".buttonValidate");

    function enableValidateButton() {
      buttonValidate.style.backgroundColor =
        titleInput.value.trim() !== "" && categorySelect.value !== "default"
          ? "#1D6154"
          : "";
    }

    titleInput.addEventListener("input", enableValidateButton);
    categorySelect.addEventListener("input", enableValidateButton);

    // Lorsqu'on clique sur le bouton "Valider", une requête fetch est envoyée au serveur
    // pour envoyer la photo avec le titre et la catégorie sélectionnés. Si la requête réussit,
    // la fenêtre modale est fermée.

    buttonValidate.addEventListener("click", (event) => {
      event.preventDefault();
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
        })
        .catch((error) => console.error(error));
    });

    // On affiche l'image selectionné et masque le paragraphe et le boutton.

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    const divAddPhoto = modal.querySelector(".divAddPhoto");
    divAddPhoto.appendChild(img);
    divAddPhoto.querySelector("p").style.display = "none";
    divAddPhoto.querySelector("button").style.display = "none";
  });
  input.click();
});
