// --- 1. LECTURE DES DONNÉES ---

// A. Charger le Profil & les Réseaux Sociaux
async function chargerProfil() {
  try {
    const response = await fetch('data/profil.json?t=' + Date.now());
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

    // Gestion des réseaux sociaux
    const containerReseaux = document.getElementById("reseaux-sociaux");
    if (containerReseaux) {
      containerReseaux.innerHTML = "";
      if (data.instagram) {
        containerReseaux.innerHTML += `<a href="${data.instagram}" target="_blank" rel="noopener">Instagram</a>`;
      }
      if (data.facebook) {
        containerReseaux.innerHTML += `<a href="${data.facebook}" target="_blank" rel="noopener">Facebook</a>`;
      }
      if (data.tiktok) {
        containerReseaux.innerHTML += `<a href="${data.tiktok}" target="_blank" rel="noopener">TikTok</a>`;
      }
    }
  } catch (error) {
    console.error("Erreur profil:", error);
  }
}

// B. Charger les Oeuvres
function chargerOeuvres() {
  fetch("content/oeuvres.json?t=" + Date.now())
    .then((response) => response.json())
    .then((data) => {
      if (data && data.oeuvres) {
        afficherOeuvres(data.oeuvres);
        activerCarrousel();
      }
    })
    .catch((error) => console.log("Pas d'œuvres trouvées", error));
}

// C. Charger les Marchés
function chargerMarches() {
  fetch("content/marches.json?t=" + Date.now())
    .then((response) => response.json())
    .then((data) => {
      if (data && data.marches) {
        afficherMarches(data.marches);
      }
    })
    .catch((error) => console.log("Pas de marchés trouvés", error));
}

// Lancement sécurisé une fois la page totalement chargée
document.addEventListener("DOMContentLoaded", () => {
  chargerProfil();
  chargerOeuvres();
  chargerMarches();
});

// --- 2. FONCTIONS D'AFFICHAGE ---

function afficherOeuvres(oeuvres) {
  const galerieContainer = document.getElementById("galerie-liste");
  if (!galerieContainer) return; // Sécurité anti-crash
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
  if (!marchesContainer) return; // Sécurité anti-crash
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
    if (bouton && zoneDroite) {
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
    }

    marchesContainer.appendChild(elementListe);
  });
}

function activerCarrousel() {
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const galerieContainer = document.getElementById("galerie-liste");

  if (btnNext && btnPrev && galerieContainer) {
    btnNext.onclick = () => galerieContainer.scrollBy({ left: 300, behavior: "smooth" });
    btnPrev.onclick = () => galerieContainer.scrollBy({ left: -300, behavior: "smooth" });
  }
}