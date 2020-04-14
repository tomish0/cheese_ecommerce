// Variables
const productsContainer = document.querySelector(".products-container");
const bagCheesesContainer = document.querySelector(".cheeses-container");
const totalCost = document.querySelector(".total-cost");
const bag =
  JSON.parse(localStorage.getItem("bag")) !== null
    ? JSON.parse(localStorage.getItem("bag"))
    : [];

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
  addToBag(cheeses);
};

addToBag = (cheeses) => {
  const addToBagButtons = [...document.querySelectorAll(".add-to-bag-btn")];
  addToBagButtons.forEach((btn) => {
    // for each add to bag button check if already in bag, if not then add event listener
    if (!btn.disabled) {
      btn.addEventListener("click", (event) => {
        event.target.innerHTML = "In Bag";
        event.target.disabled = true;
        let correctCheese = cheeses.find((cheese) => cheese.id === btn.id);
        let cheeseWithAmount = { ...correctCheese, quantity: 1 };
        bag.unshift(cheeseWithAmount);
        localStorage.setItem("bag", JSON.stringify(bag));
        // show bag with localStorage values
        showUpdatedBag();
        updateTotals(cheeseWithAmount);
      });
    }
  });
};

removeFromBag = (bag) => {
  const removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach((btn) => {
    // for each add to bag button check if already in bag, if not then add event listener
    btn.addEventListener("click", () => {
      let correctCheese = bag.find((cheese) => cheese.id === btn.id);
      console.log(correctCheese);
      let correctCheeseId = bag.findIndex(
        (cheese) => cheese.id === correctCheese.id
      );
      bag.splice(correctCheeseId, 1);
      localStorage.setItem("bag", JSON.stringify(bag));
      showUpdatedBag(bag);
    });
  });
};

showUpdatedBag = () => {
  if (JSON.parse(localStorage.getItem("priceTotal"))) {
    totalCost.innerText = `Total: £${JSON.parse(
      localStorage.getItem("priceTotal")
    ).toFixed(2)}`;
  }
  let result = "";
  bag.forEach((cheese) => {
    result += `<div class="each-cheese-container">
        <div class="each-cheese" id="${cheese.id}">
        <div class="img-container">
          <img src="${cheese.image.url}" alt="" />
        </div>
        <div class="each-cheese-info">
          <h3>${cheese.title}</h3>
          <p>£${cheese.price}</p>
          <button class="remove-btn" id="${cheese.id}"><i class="fas fa-trash"></i> Remove</button>
        </div>
      </div>
      <div class="quantity">
        <button class="arrow"><i class="fas fa-sort-up"></i></button>
        <div class="quantity-count">${cheese.quantity}</div>
        <button><i class="fas fa-sort-down"></i></button>
      </div>
    </div>`;
  });
  bagCheesesContainer.innerHTML = result;
  removeFromBag(bag);
};

updateTotals = (cheeseWithAmount) => {
  let itemsTotal = 0;
  let quantity = cheeseWithAmount.quantity;
  let priceTotal = 0;
  JSON.parse(localStorage.getItem("bag")).map((cheese) => {
    itemsTotal += 1;
    priceTotal += cheese.price;
  });
  localStorage.setItem("priceTotal", JSON.stringify(priceTotal));
  localStorage.setItem("itemsTotal", JSON.stringify(itemsTotal));
  totalCost.innerText = `Total: £${JSON.parse(
    localStorage.getItem("priceTotal")
  ).toFixed(2)}`;
};

document.addEventListener("DOMContentLoaded", () => {
  // localStorage.clear()
  getCheeses()
    .then((cheeses) => {
      displayCheeses(cheeses);
    })
    .then(() => {
      showUpdatedBag();
      removeFromBag();
    });
});
