// --- 1. LECTURE DES DONNÉES (Générées par Decap CMS) ---

// A. Charger les Oeuvres
fetch("content/oeuvres.json")
  .then((response) => response.json())
  .then((data) => {
    if (data && data.oeuvres) {
      afficherOeuvres(data.oeuvres);
      activerCarrousel();
    }
  })
  .catch((error) =>
    console.log("Pas encore d'œuvres ou fichier introuvable", error),
  );

// B. Charger les Marchés
fetch("content/marches.json")
  .then((response) => response.json())
  .then((data) => {
    if (data && data.marches) {
      afficherMarches(data.marches);
    }
  })
  .catch((error) =>
    console.log("Pas encore de marchés ou fichier introuvable", error),
  );

// --- 2. FONCTIONS D'AFFICHAGE ---

function afficherOeuvres(oeuvres) {
  const galerieContainer = document.getElementById("galerie-liste");
  galerieContainer.innerHTML = "";

  oeuvres.forEach((oeuvre) => {
    // Corrige le chemin de l'image si c'est une image locale/uploadée
    let srcImage = oeuvre.image;
    if (srcImage && !srcImage.startsWith("http://") && !srcImage.startsWith("https://")) {
      // S'assure que le chemin commence par un '/'
      srcImage = srcImage.startsWith("/") ? srcImage : "/" + srcImage;
    }

    galerieContainer.innerHTML += `
      <div class="carte-objet">
        <img src="${srcImage}" alt="${oeuvre.titre}">
        <h3>${oeuvre.titre}</h3>
        <p>${oeuvre.prix}</p>
      </div>
    `;
  });
}

function afficherMarches(marches) {
  const marchesContainer = document.getElementById("marches-liste");
  const zoneDroite = document.getElementById("zone-affichage-droite");
  marchesContainer.innerHTML = "";

  marches.forEach((marche) => {
    const elementListe = document.createElement("li");
    elementListe.innerHTML = `
      <strong>${marche.date}</strong>
      <div class="info-marche">
        <span>${marche.ville} — ${marche.lieu}</span>
        <button class="bouton-carte">📍 Voir sur la carte</button>
      </div>
    `;

    const bouton = elementListe.querySelector(".bouton-carte");
    bouton.addEventListener("click", () => {
      const adresseEncodee = encodeURIComponent(
        `${marche.lieu}, ${marche.ville}`,
      );
      zoneDroite.innerHTML = `
        <iframe 
          width="100%" height="100%" 
          style="border:0; min-height: 400px; border-radius: 8px;" 
          loading="lazy"
          src="https://maps.google.com/maps?q=${adresseEncodee}&output=embed">
        </iframe>
      `;
    });

    marchesContainer.appendChild(elementListe);
  });
}

function activerCarrousel() {
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const galerieContainer = document.getElementById("galerie-liste");

  if (btnNext && btnPrev) {
    btnNext.addEventListener("click", () => {
      galerieContainer.scrollBy({
        left: galerieContainer.offsetWidth,
        behavior: "smooth",
      });
    });
    btnPrev.addEventListener("click", () => {
      galerieContainer.scrollBy({
        left: -galerieContainer.offsetWidth,
        behavior: "smooth",
      });
    });
  }
}
