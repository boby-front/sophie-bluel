// ****** 1. RECUPERATION DES DONNEES API ET AFFICHAGE DES IMAGES DANS LA GA
// On récupere les éléments HTML et on créé l'endroit de réception des images.

const imagesGroup = document.querySelector(".imagesGroup");
const divGallery = document.createElement("div");
divGallery.classList.add("gallery");
imagesGroup.appendChild(divGallery);

function createImageWithCaption(src, alt, caption) {
  const figure = document.createElement("figure");
  figure.classList.add("gallery-item");
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
let allCategories = [
  {
    id: -1,
    name: "Tous",
  },
];

fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {
    allProjects = data;
    data.forEach((item) => {
      const image = createImageWithCaption(
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

const loginLink = document.querySelectorAll("header nav ul li")[2];

// On définit une fonction manageDisplay() qui est appelée au chargement de la page.
// Cette fonction vérifie si un token d'authentification est présent dans le localStorage.
// On y créé une condition qui affiche les liens qui redirigent vers la modal d'editeur d'image
// et retire les filtres.

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

// On recupere les éléments HTML.
// On ajoute un écouteur d'événements sur chaque lien d'éditeur pour déclencher une action au clic.
// L'action consiste à vider le contenu du modal et à récupérer les données de l'API en envoyant une requête fetch.
// Chaque div d'image est ajoutée au contenu du modal. La div contenant l'image reçoit également
// un attribut "data-id" avec l'identifiant de l'image dans la base de données pour permettre l'édition et
// la suppression de l'image par l'utilisateur.

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
      imgContainer.innerHTML = `
            <img src="${image.imageUrl}" alt="">
            <div class="trash-icon-container">
              <i class="fa-solid fa-trash-can"></i>
            </div>
            <p>éditer</p>`;
      galleryModalContent.appendChild(imgContainer);

      const arrowLeftIcon = document.querySelector(".fa-arrow-left");
      arrowLeftIcon.addEventListener("click", () => {
        modalWrapper.style.display = "block";
        modalAddPhoto.style.display = "none";
      });

      // ************  SUPRESSION DES IMAGES DU DOM DEPUIS L'API ***************

      const trashIcons = document.querySelectorAll(".fa-trash-can");

      function removeImageFromDOM(imageId) {
        const imageElement = document.querySelector(
          `.gallery-item[data-category="${imageId}"]`
        );
        if (imageElement) {
          imageElement.remove();
        }

        const modalImageElement = document.querySelector(
          `.img-container[data-id="${imageId}"]`
        );
        if (modalImageElement) {
          modalImageElement.remove();
        }
      }

      trashIcons.forEach((trashIcon) => {
        trashIcon.addEventListener("click", () => {
          const imgContainer = trashIcon.parentNode.parentNode;
          const imageId = imgContainer.getAttribute("data-id");

          const confirmDelete = window.confirm(
            "Êtes-vous sûr de vouloir supprimer cette image ?"
          );
          if (confirmDelete) {
            fetch(`http://localhost:5678/api/works/${imageId}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            })
              .then((response) => {
                if (response.ok) {
                  removeImageFromDOM(imageId);
                } else {
                  throw new Error("Erreur lors de la suppression de l'image");
                }
              })
              .catch((error) => {
                console.error(error);
              });
          }
        });
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
            data.imageUrl,
            data.title,
            "data.category.name"
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
