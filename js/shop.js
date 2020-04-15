// Variables
const productsContainer = document.querySelector(".products-container");
const bagCheesesContainer = document.querySelector(".cheeses-container");
const totalCost = document.querySelector(".total-cost");

const allCheeses =
  JSON.parse(localStorage.getItem("allCheeses")) !== null
    ? JSON.parse(localStorage.getItem("allCheeses"))
    : [];
const bag =
  JSON.parse(localStorage.getItem("bag")) !== null
    ? JSON.parse(localStorage.getItem("bag"))
    : [];

async function getCheeses() {
  try {
    let result = await fetch("cheeses.json");
    let data = await result.json();
    JSON.parse(localStorage.getItem("allCheeses")) === null
      ? localStorage.setItem("allCheeses", JSON.stringify(data.cheeses))
      : null;
    return data.cheeses;
  } catch (error) {
    console.log(error);
  }
}

displayCheeses = () => {
  let result = "";
  allCheeses.forEach((cheese) => {
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

addToBagButtons = () => {
  const addToBagButtons = [...document.querySelectorAll(".add-to-bag-btn")];
  addToBagButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.target.innerHTML = "In Bag";
      event.target.disabled = true;
      let correctCheese = allCheeses.find((cheese) => cheese.id === btn.id);
      let cheeseInBag = { ...correctCheese, quantity: 1, inBag: true };
      bag.unshift(cheeseInBag);
      let correctCheeseIndex = allCheeses.findIndex(
        (cheese) => cheese.id === correctCheese.id
      );
      allCheeses[correctCheeseIndex] = cheeseInBag;
      localStorage.setItem("bag", JSON.stringify(bag));
      localStorage.setItem("allCheeses", JSON.stringify(allCheeses));

      showUpdatedBag();
      increasePriceTotal();
      increaseQuantityTotal();
    });
  });
};

handleAddToBagButtons = () => {
  const addToBagButtons = [...document.querySelectorAll(".add-to-bag-btn")];
  allCheeses.forEach((cheese) => {
    let inBagButtons = addToBagButtons.find((btn) => btn.id === cheese.id);
    if (cheese.inBag) {
      inBagButtons.innerHTML = "In Bag";
      inBagButtons.disabled = true;
    } else {
      inBagButtons.innerHTML = `<i class="fas fa-shopping-cart"></i> Add to Bag`;
      inBagButtons.disabled = false;
    }
  });
};

removeFromBag = () => {
  const removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach((btn) => {
    let correctCheese = bag.find((cheese) => cheese.id === btn.id);
    btn.addEventListener("click", () => {
      correctCheese.inBag = false;
      let correctCheeseBagIndex = bag.findIndex(
        (cheese) => cheese.id === correctCheese.id
      );
      bag.splice(correctCheeseBagIndex, 1);
      let correctAllCheeseIndex = allCheeses.findIndex(
        (cheese) => cheese.id === correctCheese.id
      );
      allCheeses[correctAllCheeseIndex] = correctCheese;
      localStorage.setItem("bag", JSON.stringify(bag));
      localStorage.setItem("allCheeses", JSON.stringify(allCheeses));

      showUpdatedBag();
      decreasePriceTotal(correctCheese);
      decreaseQuantityTotal(correctCheese);
      handleAddToBagButtons();
    });
  });
};

quantityRemoveFromBag = (correctCheese) => {
  correctCheese.inBag = false;
  let correctCheeseBagIndex = bag.findIndex(
    (cheese) => cheese.id === correctCheese.id
  );
  bag.splice(correctCheeseBagIndex, 1);
  let correctAllCheeseIndex = allCheeses.findIndex(
    (cheese) => cheese.id === correctCheese.id
  );
  allCheeses[correctAllCheeseIndex] = correctCheese;
  localStorage.setItem("bag", JSON.stringify(bag));
  localStorage.setItem("allCheeses", JSON.stringify(allCheeses));

  showUpdatedBag();
  decreasePriceTotal(correctCheese);
  handleAddToBagButtons();
};

showUpdatedBag = () => {
  let priceTotal =
    JSON.parse(localStorage.getItem("priceTotal")) !== null
      ? JSON.parse(localStorage.getItem("priceTotal"))
      : 0;
  totalCost.innerText = `Total: £${priceTotal}`;
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
        <button class="quantity-up" id="${cheese.id}"><i class="fas fa-sort-up"></i></button>
        <div class="quantity-count">${cheese.quantity}</div>
        <button class="quantity-down" id="${cheese.id}"><i class="fas fa-sort-down"></i></button>
      </div>
    </div>`;
  });
  bagCheesesContainer.innerHTML = result;
  removeFromBag();
  increaseQuantityTotal();
  decreaseQuantityTotal();
};

increasePriceTotal = () => {
  let itemsTotal = 0;
  let priceTotal = 0;
  bag.map((cheese) => {
    itemsTotal += 1;
    priceTotal += cheese.price * cheese.quantity;
  });
  localStorage.setItem("priceTotal", JSON.stringify(priceTotal.toFixed(2)));
  localStorage.setItem("itemsTotal", JSON.stringify(itemsTotal));
  totalCost.innerText = `Total: £${priceTotal.toFixed(2)}`;
};

increaseQuantityTotal = () => {
  const quantityUp = document.querySelectorAll(".quantity-up");
  quantityUp.forEach((btn) => {
    let correctCheese = bag.find((cheese) => cheese.id === btn.id);
    let quantity = correctCheese.quantity;
    btn.addEventListener("click", () => {
      quantity += 1;
      correctCheese.quantity = quantity;
      localStorage.setItem("bag", JSON.stringify(bag))
      showUpdatedBag();
      increasePriceTotal();
    });
  });
};

decreasePriceTotal = (correctCheese) => {
  priceTotal = JSON.parse(localStorage.getItem("priceTotal"));
  itemsTotal = JSON.parse(localStorage.getItem("itemsTotal"));
  itemsTotal -= 1;
  priceTotal -= correctCheese.price;
  localStorage.setItem("priceTotal", JSON.stringify(priceTotal.toFixed(2)));
  localStorage.setItem("itemsTotal", JSON.stringify(itemsTotal));
  totalCost.innerText = `Total: £${priceTotal.toFixed(2)}`;
};

decreaseQuantityTotal = () => {
  const quantityDown = document.querySelectorAll(".quantity-down");
  quantityDown.forEach((btn) => {
    let correctCheese = bag.find((cheese) => cheese.id === btn.id);
    let quantity = correctCheese.quantity;
    btn.addEventListener("click", () => {
      quantity -= 1;
      correctCheese.quantity = quantity;
      localStorage.setItem("bag", JSON.stringify(bag))
      if (quantity === 0) {
        quantityRemoveFromBag(correctCheese);
      }
      showUpdatedBag();
      if (quantity !== 0) {
        decreasePriceTotal(correctCheese);
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  // localStorage.clear();
  getCheeses()
    .then(() => {
      displayCheeses();
    })
    .then(() => {
      addToBagButtons();
      handleAddToBagButtons();
      showUpdatedBag();
    });
});
