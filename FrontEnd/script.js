// ********* RECUPERATION DES DONNEES API (IMAGES, TITLE, CATEGORY) ********* //

// On  crée une galerie d'images en ajoutant un élément div
// à un autre élément HTML qui contiendra la galerie.

//Sélectionne l'élément HTML qui contiendra la galerie d'images et l'assigne à la variable 'imagesGroup'
const imagesGroup = document.querySelector(".imagesGroup");
//Crée un élément div pour la galerie et l'assigne à la variable divGallery.
const divGallery = document.createElement("div");
//Ajoute la classe "gallery" à l'élément div de la galerie.
divGallery.classList.add("gallery");
//Ajoute l'élément div de la galerie à l'élément HTML qui contiendra la galerie d'images.
imagesGroup.appendChild(divGallery);

// ON utilise la méthode fetch() pour envoyer une requête HTTP à l'API.
// La requête récupère les données des travaux qui seront utilisées pour
// créer des images pour la galerie.

//Envoie une requête GET à l'API pour récupérer les données des travaux,
//avec l'URL de l'API comme argument.
fetch("http://localhost:5678/api/works")
  //Convertit la réponse HTTP en objet JSON pour être manipulée plus facilement.
  .then((response) => response.json())
  //Exécute une fonction anonyme avec les données des travaux en argument.
  .then((data) => {
    //Parcourt chaque élément de la liste des travaux.
    data.forEach((item) => {
      //Crée une image avec une légende et une catégorie, en utilisant les données de l'élément
      //courant de la liste des travaux.
      const image = createImageWithCaption(
        item.imageUrl,
        item.title,
        item.category.name
      );
      divGallery.appendChild(image);
    });

    //La fonction  createImageWithCaption() sert à créer un élément figure contenant une image
    // et une légende avec une classe CSS optionnelle en fonction de la valeur de caption.
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
      if (caption === "Objets") figure.classList.add("objects");
      else if (caption === "Appartements") figure.classList.add("apartments");
      else if (caption === "Hotels & restaurants")
        figure.classList.add("hotels");
      return figure;
    }

    // ********** AJOUTS ET FONCTIONS DES FILTRES IMAGES **********//

    //

    //Sélectionne tous les boutons de filtre et les assigne à la variable filterButtons.
    const filterButtons = document.querySelectorAll(".filters button");
    //Parcourt chaque bouton de filtre et ajoute un écouteur d'événement sur chaque bouton.
    filterButtons.forEach((button) => {
      //Ajoute un écouteur d'événement sur le clic du bouton de filtre.
      button.addEventListener("click", () => {
        //Ajoute la classe "active" au bouton cliqué et la supprime des autres.
        filterButtons.forEach((b) =>
          b.classList.toggle("active", b === button)
        );
        //Récupère la première classe du bouton cliqué.
        const className = button.classList[0];
        //Sélectionne toutes les images de la galerie.
        const images = divGallery.querySelectorAll(".gallery-item");
        //Parcourt chaque image de la galerie.
        images.forEach((image) => {
          //Affiche ou masque les images selon la classe du bouton cliqué.
          image.style.display =
            className === "all" || image.classList.contains(className)
              ? "block"
              : "none";
        });
      });
    });
    //Ajoute la classe "fontButton2" au premier bouton de filtre.
    filterButtons[0].classList.add("fontButton2");
  });

const filterButtons = document.querySelectorAll(".filters button");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("fontButton2"));
    button.classList.add("fontButton2");
  });
});

//**************   EDITOR MODE **************//

const loginLink = document.querySelectorAll("header nav ul li")[2];
function manageDisplay() {
  const editorMode = document.querySelector(".editorMode");
  const editorModePs = document.querySelectorAll(".editorModeP");
  const filters = document.querySelector(".filters");
  const token = localStorage.getItem(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY4MDYwODk0NCwiZXhwIjoxNjgwNjk1MzQ0fQ.MiDaAmKlEryxowfeiLg_CeTGWCBgEFvrnuZjN8Lu52s"
  );
  if (token) {
    editorMode.style.display = "flex";
    editorModePs.forEach((editorModeP) => {
      editorModeP.style.visibility = "visible";
    });
    filters.style.display = "none";
    loginLink.textContent = "logout";
    loginLink.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY4MDYwODk0NCwiZXhwIjoxNjgwNjk1MzQ0fQ.MiDaAmKlEryxowfeiLg_CeTGWCBgEFvrnuZjN8Lu52s"
      );
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

/************  GESTIONS DE CLICK // TRAVAUX  MODALE***************/

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
    fetch("http://localhost:5678/api/works/")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((image) => {
          const imgContainer = document.createElement("div");
          imgContainer.classList.add("img-container");
          // Ajoutez cette ligne pour définir l'attribut 'data-id'
          imgContainer.setAttribute("data-id", image.id);
          imgContainer.innerHTML = `
            <img src="${image.imageUrl}" alt="">
            <div class="trash-icon-container">
              <i class="fa-solid fa-trash-can"></i>
            </div>
            <p>éditer</p>`;
          galleryModalContent.appendChild(imgContainer);

          /************  SUPRESSION DES IMAGES DU DOM DEPUIS L'API***************/

          // Récupère l'icône de corbeille pour chaque image
          const trashIcon = imgContainer.querySelector(".fa-trash-can");
          // Ajoute un écouteur d'événement 'click' sur l'icône de corbeille
          trashIcon.addEventListener("click", () => {
            // Récupère l'ID de l'image stocké dans l'attribut 'data-id'
            const imageId = imgContainer.getAttribute("data-id");
            // Envoie une requête DELETE à l'API pour supprimer l'image
            fetch(`http://localhost:5678/api/works/${imageId}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem(
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY4MDYwODk0NCwiZXhwIjoxNjgwNjk1MzQ0fQ.MiDaAmKlEryxowfeiLg_CeTGWCBgEFvrnuZjN8Lu52s"
                )}`,
              },
            })
              .then((response) => {
                console.log(response);
                if (response.ok) {
                  // Supprime l'élément imgContainer du DOM s'il est supprimé avec succès de l'API
                  imgContainer.remove();
                } else {
                  throw new Error("Erreur lors de la suppression de l'image");
                }
              })
              .catch((error) => {
                console.error(error);
              });
          });
        });
        galleryModal.style.display = "flex";
      })
      .catch((error) => console.error(error));
  });
});

function closeModalHandler() {
  galleryModal.style.display = "none";
  modalWrapper.style.display = "block";
  modalAddPhoto.style.display = "none";
}

galleryModal.addEventListener("click", (e) => {
  if (e.target === galleryModal) {
    closeModalHandler();
  }
});

closeModal.forEach((element) => {
  element.addEventListener("click", closeModalHandler);
});

boutonModal.addEventListener("click", (e) => {
  e.preventDefault();
  modalWrapper.style.display = "none";
  modalAddPhoto.style.display = "block";
});

//************  AJOUTER UNE IMAGE COMME TRAVAUX *****************/

const buttonAddPhoto = document.querySelector(".buttonAddPhoto");
const uploadForm = document.getElementById("uploadForm");

buttonAddPhoto.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.name = "image";
  input.accept = "image/*";
  input.style.display = "none";
  uploadForm.appendChild(input);

  input.addEventListener("change", () => {
    const file = input.files[0];
    console.log(file);

    const modal = document.querySelector(".modal-addPhoto");
    const titleInput = modal.querySelector("#title");
    const categorySelect = modal.querySelector("#category");
    const buttonValidate = modal.querySelector(".buttonValidate");

    // Ajouter un écouteur d'événements input aux champs de formulaire
    [titleInput, categorySelect].forEach((field) => {
      field.addEventListener("input", () => {
        // Vérifier si tous les champs sont remplis
        const isAllFieldsFilled =
          titleInput.value.trim() !== "" && categorySelect.value !== "default";
        // Mettre à jour le style du bouton en conséquence
        buttonValidate.style.backgroundColor = isAllFieldsFilled
          ? "#1D6154"
          : "";
      });
    });

    buttonValidate.addEventListener("click", (event) => {
      event.preventDefault();
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", titleInput.value);
      formData.append("category", categorySelect.value);

      fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4",
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // Fermer la modale après l'ajout réussi de la nouvelle image
          closeModalHandler();
        })
        .catch((error) => console.error(error));
    });

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    const divAddPhoto = modal.querySelector(".divAddPhoto");
    divAddPhoto.appendChild(img);
    divAddPhoto.querySelector("p").style.display = "none";
    divAddPhoto.querySelector("button").style.display = "none";
  });
  input.click();
});
