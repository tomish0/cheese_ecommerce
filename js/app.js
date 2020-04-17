const itemsTotal = document.querySelector("#items-total");
const listWrapper = document.querySelector(".list-wrapper");

const dropDown = document
  .querySelector(".menu_wrapper")
  .addEventListener("click", () => {
    listWrapper.classList.toggle("active");
  });

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
