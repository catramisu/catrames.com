const detailsLink = document.getElementById("detailsLink");
const correction = document.getElementById("correction");
const closeCorrection = document.getElementById("closeCorrection");
const secretTrigger = document.getElementById("secretTrigger");
const dossier = document.getElementById("dossier");

detailsLink.addEventListener("click", (event) => {
  event.preventDefault();
  correction.hidden = !correction.hidden;
  detailsLink.innerHTML = correction.hidden
    ? 'VIEW CORRECTION <span>↗</span>'
    : 'HIDE CORRECTION <span>↘</span>';
});

closeCorrection.addEventListener("click", () => {
  correction.hidden = true;
  detailsLink.innerHTML = 'VIEW CORRECTION <span>↗</span>';
});

secretTrigger.addEventListener("click", () => {
  const isHidden = dossier.hidden;
  dossier.hidden = !isHidden;
  secretTrigger.setAttribute("aria-expanded", String(isHidden));
  secretTrigger.innerHTML = isHidden
    ? '<span class="secret-mark">∎</span> CLOSE FILE'
    : '<span class="secret-mark">∎</span> FILE 17B';
  if (isHidden) dossier.scrollIntoView({ behavior: "smooth", block: "start" });
});
