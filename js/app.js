const itemsTotal = document.querySelector("#items-total");

getCurrentCart = (localStorage) => {
  if (localStorage.itemsTotal > 0) {
    itemsTotal.classList.add("items-total");
    itemsTotal.innerHTML = localStorage.itemsTotal;
  } else {
    itemsTotal.classList.remove("items-total");
    itemsTotal.innerHTML = null;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  getCurrentCart(localStorage);
});
