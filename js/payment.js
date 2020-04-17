const itemsTotal = document.querySelector("#items-total");
const bagCheesesContainer = document.querySelector(".cheeses-container");
const totalCost = document.querySelector(".total-cost");
const bagContainer = document.querySelector(".bag-container");
const listWrapper = document.querySelector(".list-wrapper");
const cartIcon = document
  .querySelector(".cart-icon")
  .addEventListener("click", () => {
    bagContainer.classList.toggle("active");
  });
const dropDown = document
  .querySelector(".menu_wrapper")
  .addEventListener("click", () => {
    listWrapper.classList.toggle("active");
  });
const allCheeses =
  JSON.parse(localStorage.getItem("allCheeses")) !== null
    ? JSON.parse(localStorage.getItem("allCheeses"))
    : [];
let bag =
  JSON.parse(localStorage.getItem("bag")) !== null
    ? JSON.parse(localStorage.getItem("bag"))
    : [];

getCurrentCart = (localStorage) => {
  if (localStorage.itemsTotal > 0) {
    itemsTotal.classList.add("items-total");
    itemsTotal.innerHTML = localStorage.itemsTotal;
  } else {
    itemsTotal.classList.remove("items-total");
    itemsTotal.innerHTML = null;
  }
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

removeFromBag = () => {
  const removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach((btn) => {
    let correctCheese = bag.find((cheese) => cheese.id === btn.id);
    btn.addEventListener("click", () => {
      console.log("clicked");

      let priceTotal = JSON.parse(localStorage.getItem("priceTotal"));
      let itemsTotal = JSON.parse(localStorage.getItem("itemsTotal"));
      itemsTotal -= 1;
      priceTotal -= correctCheese.price * correctCheese.quantity;

      correctCheese.inBag = false;
      let correctCheeseBagIndex = bag.findIndex(
        (cheese) => cheese.id === correctCheese.id
      );
      bag.splice(correctCheeseBagIndex, 1);
      let correctAllCheeseIndex = allCheeses.findIndex(
        (cheese) => cheese.id === correctCheese.id
      );
      allCheeses[correctAllCheeseIndex] = correctCheese;

      localStorage.setItem("priceTotal", JSON.stringify(priceTotal.toFixed(2)));
      localStorage.setItem("itemsTotal", JSON.stringify(itemsTotal));
      localStorage.setItem("bag", JSON.stringify(bag));
      localStorage.setItem("allCheeses", JSON.stringify(allCheeses));

      showUpdatedBag();
      decreaseQuantityTotal(correctCheese);
      getCurrentCart(localStorage);
    });
  });

  const clearAllBtn = document.querySelector(".clear-btn");
  clearAllBtn.addEventListener("click", () => {
    bag.forEach((cheese) => {
      cheese.inBag = false;
      let correctAllCheeseIndex = allCheeses.findIndex(
        (allCheesesCheese) => allCheesesCheese.id === cheese.id
      );
      allCheeses[correctAllCheeseIndex] = cheese;
    });
    bag = [];
    let priceTotal = 0.0;
    let itemsTotal = 0;
    localStorage.setItem("allCheeses", JSON.stringify(allCheeses));
    localStorage.setItem("priceTotal", JSON.stringify(priceTotal.toFixed(2)));
    localStorage.setItem("itemsTotal", JSON.stringify(itemsTotal));
    localStorage.setItem("bag", JSON.stringify(bag));
    showUpdatedBag();
    getCurrentCart(localStorage);
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

  let itemsTotal = JSON.parse(localStorage.getItem("itemsTotal"));
  itemsTotal -= 1;
  localStorage.setItem("itemsTotal", JSON.stringify(itemsTotal));
  localStorage.setItem("bag", JSON.stringify(bag));
  localStorage.setItem("allCheeses", JSON.stringify(allCheeses));

  showUpdatedBag();
  decreasePriceTotal(correctCheese);
  getCurrentCart(localStorage);
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
      localStorage.setItem("bag", JSON.stringify(bag));
      showUpdatedBag();
      increasePriceTotal();
    });
  });
};

decreasePriceTotal = (correctCheese) => {
  let priceTotal = JSON.parse(localStorage.getItem("priceTotal"));
  priceTotal -= correctCheese.price;
  localStorage.setItem("priceTotal", JSON.stringify(priceTotal.toFixed(2)));
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
      localStorage.setItem("bag", JSON.stringify(bag));
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
  getCurrentCart(localStorage);
  showUpdatedBag();
});