const productsContainer = document.querySelector(".products-container");
const bag = [];

async function getCheeses() {
  try {
    let result = await fetch("cheeses.json");
    let data = await result.json();
    return data.cheeses;
  } catch (error) {
    console.log(error);
  }
}

displayCheeses = (cheeses) => {
  let result = "";
  cheeses.forEach((cheese) => {
    result += `<div class="each-cheese" id="${cheese.id}">
      <div class="img-container">
        <img src="${cheese.image.url}" alt="" />
        <div class="add-to-bag">
          <button class="add-to-bag-btn" id="${cheese.id}"><i class="fas fa-shopping-cart"></i> Add to Bag</button>
        </div>
      </div>
      <div class="each-cheese-info">
        <h3>${cheese.title}</h3>
        <p>£${cheese.price}</p>
      </div>
    </div>`;
  });
  productsContainer.innerHTML = result;
};

getAddToBagButtons = () => {
  const addToBagButtons = [...document.querySelectorAll(".add-to-bag-btn")];
  addToBagButtons.forEach((btn) => {
    let id = btn.id;
    let inBag = bag.find((cheese) => cheese.id === id);
    if (inBag) {
    } else {
      btn.addEventListener("click", event => {
        console.log(event.target);
        event.target.innerHTML = "In Bag";
        event.target.disabled = true;
      });
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  getCheeses()
    .then((cheeses) => displayCheeses(cheeses))
    .then(() => {
      getAddToBagButtons();
    });
});
