// VARIABLES
const productsContainer = document.querySelector(".products-container");
const bagCheesesContainer = document.querySelector(".cheeses-container");
const totalCost = document.querySelector(".total-cost");
const itemsTotal = document.querySelector("#items-total");
const bagContainer = document.querySelector(".bag-container");
const listWrapper = document.querySelector(".list-wrapper");
const menuWrapper = document.querySelector(".menu-wrapper");
// event listener on cart icon to drop down bag
const cartIcon = document
  .querySelector(".cart-icon")
  .addEventListener("click", () => {
    bagContainer.classList.toggle("active");
  });
// event listener on hamburger menu to drop down list
const dropDown = menuWrapper.addEventListener("click", () => {
  listWrapper.classList.toggle("active");
  menuWrapper.classList.toggle("active");
});
// event listener to exit bag
const bagExit = document
  .querySelector(".exit-btn")
  .addEventListener("click", () => {
    bagContainer.classList.remove("active");
  });
let allCheeses =
  JSON.parse(localStorage.getItem("allCheeses")) !== null
    ? JSON.parse(localStorage.getItem("allCheeses"))
    : [];
let bag =
  JSON.parse(localStorage.getItem("bag")) !== null
    ? JSON.parse(localStorage.getItem("bag"))
    : [];

// METHODS

// Get all the cheeses from cheeses.json
// Put into local storage if allCheeses is an empty array (first time opening website)
async function getCheeses() {
  try {
    let result = await fetch("cheeses.json");
    let data = await result.json();
    if (allCheeses.length === 0) {
      localStorage.setItem("allCheeses", JSON.stringify(data.cheeses));
      allCheeses = JSON.parse(localStorage.getItem("allCheeses"));
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}

// display allCheeses on page
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

// Check the local storage if there is an items total
// if yes, add the number box on the cart
getCurrentCart = (localStorage) => {
  if (localStorage.itemsTotal > 0) {
    itemsTotal.classList.add("items-total");
    itemsTotal.innerHTML = localStorage.itemsTotal;
  } else {
    itemsTotal.classList.remove("items-total");
    itemsTotal.innerHTML = null;
  }
};

// Add all the add to bag buttons on allCheeses
addToBagButtons = () => {
  const addToBagButtons = [...document.querySelectorAll(".add-to-bag-btn")];
  addToBagButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      // If clicked, change text to say 'In Bag' & disable the button
      event.target.innerHTML = "In Bag";
      event.target.disabled = true;
      let correctCheese = allCheeses.find((cheese) => cheese.id === btn.id);
      let cheeseInBag = { ...correctCheese, quantity: 1, inBag: true };
      // Add to bag with additional object key/values
      // quantity will be edited later to calculate priceTotal
      // inBag boolean is used so upon page reload it is still disabled - handled in handleAddToBagButtons()
      bag.unshift(cheeseInBag);
      let correctCheeseIndex = allCheeses.findIndex(
        (cheese) => cheese.id === correctCheese.id
      );
      allCheeses[correctCheeseIndex] = cheeseInBag; // allCheeses is updated with altered cheese object
      localStorage.setItem("bag", JSON.stringify(bag));
      localStorage.setItem("allCheeses", JSON.stringify(allCheeses));

      bagContainer.classList.add("active"); // bagContainer class 'active' is toggled so bag is shown upon add

      showUpdatedBag();
      increasePriceTotal();
      increaseQuantityTotal();
      getCurrentCart(localStorage);
    });
  });
};

// Check every cheese with its associated button to see if inBag is true
// If true, change text to say 'In Bag' & disable the button
// If false, re-add the cart icon & 'Add to Bag', & set disabled to false
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

// Used to display the bag in its current state
showUpdatedBag = () => {
  // Use conditional for piceTotal to handle initial load of website
  let priceTotal =
    JSON.parse(localStorage.getItem("priceTotal")) !== null
      ? JSON.parse(localStorage.getItem("priceTotal"))
      : 0;
  // put the priceTotal into the totalCost div
  totalCost.innerHTML = `Total: £${priceTotal}`;
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

// Handles remove and clear button clicks in the bag
removeFromBag = () => {
  const removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach((btn) => {
    let correctCheese = bag.find((cheese) => cheese.id === btn.id);
    btn.addEventListener("click", () => {
      // if a remove is clicked, update items/price totals
      let priceTotal = JSON.parse(localStorage.getItem("priceTotal"));
      let itemsTotal = JSON.parse(localStorage.getItem("itemsTotal"));
      itemsTotal -= 1;
      priceTotal -= correctCheese.price * correctCheese.quantity;
      // set the removed cheeses' inBag to false to be handled by handleAddToBagButtons()
      correctCheese.inBag = false;
      let correctCheeseBagIndex = bag.findIndex(
        (cheese) => cheese.id === correctCheese.id
      );
      bag.splice(correctCheeseBagIndex, 1);
      let correctAllCheeseIndex = allCheeses.findIndex(
        (cheese) => cheese.id === correctCheese.id
      );
      allCheeses[correctAllCheeseIndex] = correctCheese; // allCheeses is updated with altered cheese object

      localStorage.setItem("priceTotal", JSON.stringify(priceTotal.toFixed(2)));
      localStorage.setItem("itemsTotal", JSON.stringify(itemsTotal));
      localStorage.setItem("bag", JSON.stringify(bag));
      localStorage.setItem("allCheeses", JSON.stringify(allCheeses));

      showUpdatedBag();
      decreaseQuantityTotal(correctCheese);
      handleAddToBagButtons();
      getCurrentCart(localStorage);
    });
  });

  const clearAllBtn = document.querySelector(".clear-btn");
  clearAllBtn.addEventListener("click", () => {
    // if clear all button is clicked
    bag.forEach((cheese) => {
      cheese.inBag = false; // set each cheese inBag to false
      let correctAllCheeseIndex = allCheeses.findIndex(
        (allCheesesCheese) => allCheesesCheese.id === cheese.id
      );
      allCheeses[correctAllCheeseIndex] = cheese; // allCheeses is updated with altered cheese objects
    });
    bag = []; // remove all cheeses from bag
    // set items/price totals to 0
    let priceTotal = 0;
    let itemsTotal = 0;

    localStorage.setItem("allCheeses", JSON.stringify(allCheeses));
    localStorage.setItem("priceTotal", JSON.stringify(priceTotal.toFixed(2)));
    localStorage.setItem("itemsTotal", JSON.stringify(itemsTotal));
    localStorage.setItem("bag", JSON.stringify(bag));

    showUpdatedBag();
    handleAddToBagButtons();
    getCurrentCart(localStorage);
  });
};

// If cheese quantity is reduced to 0 upon button click in bag, remove cheese from bag
// correctCheese received from decreaseQuantityTotal() once quantity === 0
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
  handleAddToBagButtons();
  getCurrentCart(localStorage);
};

// Used to update price/items totals
// don't need previous totals, just need to map through the bag
increasePriceTotal = () => {
  let itemsTotal = 0;
  let priceTotal = 0;
  bag.map((cheese) => {
    itemsTotal += 1;
    priceTotal += cheese.price * cheese.quantity;
  });
  localStorage.setItem("priceTotal", JSON.stringify(priceTotal.toFixed(2)));
  localStorage.setItem("itemsTotal", JSON.stringify(itemsTotal));
  totalCost.innerHTML = `Total: £${priceTotal.toFixed(2)}`;
};

// Used to increase cheese.quantity to then increase priceTotal
increaseQuantityTotal = () => {
  // click listener added to all the up-arrow icons
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

// Used to decrease the priceTotal when quantity of correctCheese is altered
// correctCheese is received decreaseQuantityTotal()
decreasePriceTotal = (correctCheese) => {
  let priceTotal = JSON.parse(localStorage.getItem("priceTotal"));
  priceTotal -= correctCheese.price;
  localStorage.setItem("priceTotal", JSON.stringify(priceTotal.toFixed(2)));
  totalCost.innerHTML = `Total: £${priceTotal.toFixed(2)}`;
};

// Used to reduce the cheese.quantity to decrease priceTotal
decreaseQuantityTotal = () => {
  // click listener added to all the down-arrow icons
  const quantityDown = document.querySelectorAll(".quantity-down");
  quantityDown.forEach((btn) => {
    let correctCheese = bag.find((cheese) => cheese.id === btn.id);
    let quantity = correctCheese.quantity;
    btn.addEventListener("click", () => {
      quantity -= 1;
      correctCheese.quantity = quantity;
      localStorage.setItem("bag", JSON.stringify(bag));
      // if quantity reduced to 0 quantityRemoveFromBag() is called
      if (quantity === 0) {
        quantityRemoveFromBag(correctCheese);
      }
      showUpdatedBag();
      // if quantity doesn't = 0 decreasePriceTotal is called
      if (quantity !== 0) {
        decreasePriceTotal(correctCheese);
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  getCheeses() // initialise website with data from cheeses.json
    .then(() => {
      displayCheeses(); // display cheeses once gotten from getCheeses()
    })
    .then(() => {
      getCurrentCart(localStorage); // show cart icon with items if have in bag
      addToBagButtons(); // make all add to bag buttons listening for click
      handleAddToBagButtons(); // check allCheese objects to see if they are inBag or not
      showUpdatedBag(); // so can see cart straight away if cart icon is clicked
    });
});
