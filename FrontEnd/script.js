fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(data => console.log(data))

  const projets = document.querySelector(".galery");
// DIV "gallery"
const divGallery = document.createElement("div");
divGallery.classList.add("gallery");
projets.appendChild(divGallery);
// Fonction gallery (image + texte alt + légende)
function createImageWithCaption(src, alt, caption) {
  const figure = document.createElement('figure');
  const image = document.createElement('img');
  image.setAttribute('src', src);
  image.setAttribute('alt', alt);
  figure.appendChild(image);
  const figcaption = document.createElement('figcaption');
  figcaption.textContent = caption;
  figure.appendChild(figcaption);
  return figure;
}
// Abajour Tahina
const item0 = createImageWithCaption("http://localhost:5678/images/abajour-tahina1651286843956.png", 'Abajour Tahina', 'Abajour Tahina');
divGallery.appendChild(item0);
// Appartement Paris V
const item1 = createImageWithCaption("http://localhost:5678/images/appartement-paris-v1651287270508.png", 'Appartement Paris V', 'Appartement Paris V');
divGallery.appendChild(item1);
// Restaurant Sushisen - Londres
const item2 = createImageWithCaption("http://localhost:5678/images/restaurant-sushisen-londres1651287319271.png", 'Restaurant Sushisen - Londres', 'Restaurant Sushisen - Londres');
divGallery.appendChild(item2);
// Villa “La Balisiere” - Port Louis
const item3 = createImageWithCaption("http://localhost:5678/images/la-balisiere1651287350102.png", 'Villa “La Balisiere” - Port Louis', 'Villa “La Balisiere” - Port Louis');
divGallery.appendChild(item3);
// Structures Thermopolis
const item4 = createImageWithCaption("http://localhost:5678/images/structures-thermopolis1651287380258.png", 'Structures Thermopolis', 'Structures Thermopolis');
divGallery.appendChild(item4);
// Appartement Paris X
const item5 = createImageWithCaption("http://localhost:5678/images/appartement-paris-x1651287435459.png", 'Appartement Paris X', 'Appartement Paris X');
divGallery.appendChild(item5);
// Pavillon “Le coteau” - Cassis
const item6 = createImageWithCaption("http://localhost:5678/images/le-coteau-cassis1651287469876.png", 'Pavillon “Le coteau” - Cassis', 'Pavillon “Le coteau” - Cassis');
divGallery.appendChild(item6);
// Villa Ferneze - Isola d’Elba
const item7 = createImageWithCaption("http://localhost:5678/images/villa-ferneze1651287511604.png", 'Villa Ferneze - Isola d’Elba', 'Villa Ferneze - Isola d’Elba');
divGallery.appendChild(item7);
// Appartement Paris XVIII
const item8 = createImageWithCaption("http://localhost:5678/images/appartement-paris-xviii1651287541053.png", 'Appartement Paris XVIII', 'Appartement Paris XVIII');
divGallery.appendChild(item8);
// Bar “Lullaby” - Paris
const item9 = createImageWithCaption("http://localhost:5678/images/bar-lullaby-paris1651287567130.png", 'Bar “Lullaby” - Paris', 'Bar “Lullaby” - Paris');
divGallery.appendChild(item9);
// Hotel First Arte - New Delhi
const item10 = createImageWithCaption("http://localhost:5678/images/hotel-first-arte-new-delhi1651287605585.png", 'Hotel First Arte - New Delhi', 'Hotel First Arte - New Delhi');
divGallery.appendChild(item10);
  