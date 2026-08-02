// --- 1. LECTURE DES DONNÉES ---

// A. Charger le Profil
async function chargerProfil() {
  try {
    const response = await fetch('data/profil.json');
    if (!response.ok) return;
    const data = await response.json();

    const elNom = document.getElementById("nom-artiste");
    if (elNom && data.nom_artiste) elNom.textContent = data.nom_artiste;

    const elBio = document.getElementById("bio-artiste");
    if (elBio && data.bio) elBio.textContent = data.bio;

    const elImage = document.getElementById("image-entete");
    if (elImage && data.image_en_tete) {
      let src = data.image_en_tete;
      if (!src.startsWith("http://") && !src.startsWith("https://")) {
        src = src.startsWith("/") ? src : "/" + src;
      }
      elImage.src = src;
    }
  } catch (error) {
    console.error("Erreur profil:", error);
  }
}

// B. Charger les Oeuvres
fetch("content/oeuvres.json")
  .then((response) => response.json())
  .then((data) => {
    if (data && data.oeuvres) {
      afficherOeuvres(data.oeuvres);
      activerCarrousel();
    }
  })
  .catch((error) => console.log("Pas d'œuvres trouvées", error));

// C. Charger les Marchés
fetch("content/marches.json")
  .then((response) => response.json())
  .then((data) => {
    if (data && data.marches) {
      afficherMarches(data.marches);
    }
  })
  .catch((error) => console.log("Pas de marchés trouvés", error));

// Appeler le profil dès le chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  chargerProfil();
});

// --- 2. FONCTIONS D'AFFICHAGE ---

function afficherOeuvres(oeuvres) {
  const galerieContainer = document.getElementById("galerie-liste");
  galerieContainer.innerHTML = "";

  oeuvres.forEach((oeuvre) => {
    let srcImage = oeuvre.image;
    if (srcImage && !srcImage.startsWith("http://") && !srcImage.startsWith("https://")) {
      srcImage = srcImage.startsWith("/") ? srcImage : "/" + srcImage;
    }

    galerieContainer.innerHTML += `
      <div class="carte-objet">
        <img src="${srcImage}" alt="${oeuvre.titre}">
        <h3>${oeuvre.titre}</h3>
        <p>${oeuvre.prix} €</p>
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
      const adresseEncodee = encodeURIComponent(`${marche.lieu}, ${marche.ville}`);
      zoneDroite.innerHTML = `
        <iframe 
          width="100%" height="100%" 
          style="border:0; min-height: 350px; border-radius: 8px;" 
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

  if (btnNext && btnPrev && galerieContainer) {
    btnNext.addEventListener("click", () => {
      galerieContainer.scrollBy({ left: 300, behavior: "smooth" });
    });
    btnPrev.addEventListener("click", () => {
      galerieContainer.scrollBy({ left: -300, behavior: "smooth" });
    });
  }
}