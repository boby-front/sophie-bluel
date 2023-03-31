const imagesGroup = document.querySelector(".imagesGroup");
const divGallery = document.createElement("div");
divGallery.classList.add("gallery");
imagesGroup.appendChild(divGallery);

fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      const image = createImageWithCaption(item.imageUrl, item.title, item.category.name);
      divGallery.appendChild(image);
    });

    const filterButtons = document.querySelectorAll(".filters button");

    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.toggle("active", b === button));
        const className = button.classList[0];
        const images = divGallery.querySelectorAll(".gallery-item");
        images.forEach(image => {
          image.style.display = (className === "all" || image.classList.contains(className)) ? "block" : "none";
        });
      });
    });

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
