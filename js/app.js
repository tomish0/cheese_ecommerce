// Variables
const itemsTotal = document.querySelector(".item-total");

// Bag 

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
  
  });