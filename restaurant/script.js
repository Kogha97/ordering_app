// // empty/initial state WILL BE USED IN FINAL PRODUCT
const state = JSON.parse(localStorage.getItem("state")) || {
  menus: [],
  tables: [],
  orders: [],
};

function renderAll() {
  renderMenuList();
  populateDishDropdown();
  renderOrders();
  renderTablesList();
}

// eg. state after use, as a handy exaple how it will look:
// const stateIRL = {
//   menus: [new Dish("Salad", 7)],
//   //dishID as string of dishName.toLowerCase
//   tables: [new Table(1)],
//   orders: [new Order(1, 'salad')],
// };

// functions that do 1-5:
// write function with input as argument to function
class Dish {
  constructor(dishName, price) {
    this.dishName = dishName;
    this.price = price;
    this.dishID = dishName.toLowerCase().replace(" ", "");
  }
}

class Table {
  constructor(id) {
    this.id = id;
  }
}

class Order {
  constructor(tableID, dishID) {
    this.tableID = tableID;
    this.dishID = dishID;
  }
}

//LOCAL STORAGE

function saveStateToLocalStorage() {
  localStorage.setItem("state", JSON.stringify(state));
}

// add the dish info input to a menu list:
document.getElementById("addDish").addEventListener("click", addDish);

//ENTER BUTTON
// Event listener for keydown to handle Enter key for adding dish
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const activeElement = document.activeElement;
    const inputFieldDishName = document.getElementById("inputFieldDishName");
    const inputFieldDishPrice = document.getElementById("inputFieldDishPrice");
    const addOrderButton = document.getElementById("addOrder");
    const tableSelect = document.getElementById("tableSelect");
    const dishSelect = document.getElementById("dishSelect");

    // Check if focus is on dish name or dish price input fields
    if (
      activeElement === inputFieldDishName ||
      activeElement === inputFieldDishPrice
    ) {
      addDish();
    }
    // Check if focus is on order button, table select, or dish select
    else if (
      activeElement === addOrderButton ||
      activeElement === tableSelect ||
      activeElement === dishSelect
    ) {
      placeOrder();
    }
  }
});

//ADDING DISH continued...

const menuList = document.querySelector("#menulist");

function renderMenuList() {
  menuList.innerHTML = ""; // Clear existing content
  state.menus.forEach((dishObject) => {
    const li = document.createElement("li");
    li.textContent = `${dishObject.dishName} ${dishObject.price}€`;
    menuList.appendChild(li); // Append to the menu list

    const removeDishButton = document.createElement("button");
    removeDishButton.textContent = "X";
    removeDishButton.style.marginLeft = "20px";
    removeDishButton.onclick = function () {
      if (
        confirm(
          "Are you sure you want to remove this dish: ' " +
            dishObject.dishName +
            " ' ?"
        )
      ) {
        removeDish(dishObject.dishID);
        renderMenuList();
        saveStateToLocalStorage();
      }
    };
    li.appendChild(removeDishButton);
  });
}

// removing dish

function removeDish(dishID) {
  state.menus = state.menus.filter((dish) => dish.dishID !== dishID);
  saveStateToLocalStorage();
}

function addDish() {
  const dishNameValue = document.getElementById("inputFieldDishName").value;
  if (dishNameValue.trim() === "") {
    alert("There is no dish NAME to add yet 🤦‍♀️");
    return;
  }

  const dishPriceValue = document.getElementById("inputFieldDishPrice").value;
  if (dishPriceValue.trim() === "") {
    alert("There is no dish PRICE to add yet 💸");
    return;
  }

  const dishName = dishNameValue;
  const price = parseFloat(dishPriceValue); // Convert price to number

  addDishToState(dishName, price);
  renderMenuList();
  populateDishDropdown();
  saveStateToLocalStorage();

  document.getElementById("inputFieldDishName").value = "";
  document.getElementById("inputFieldDishPrice").value = "";
}

function addDishToState(dishName, price) {
  const newDish = new Dish(dishName, price);
  state.menus.push(newDish);
}

//PLACING ORDERS

// Adding the dishes to a dropdown
function populateDishDropdown() {
  const dishSelect = document.getElementById("dishSelect");
  dishSelect.innerHTML = "";
  state.menus.forEach((dish) => {
    const option = document.createElement("option");
    option.value = dish.dishID;
    option.textContent = dish.dishName;
    dishSelect.appendChild(option);
  });
}

// Creating tables
const tableSelect = document.getElementById("tableSelect");
const calcSelect = document.getElementById("calcSelect");

function renderTablesList() {
  tableSelect.innerHTML = "";
  state.tables.forEach((table) => {
    const option = document.createElement("option");
    option.value = table.id;
    option.textContent = `Table ${table.id}`;
    tableSelect.appendChild(option);
  });
}
// this adds the tables to the calcultate button
function renderTableCalcList() {
  calcSelect.innerHTML = "";
  state.tables.forEach((table) => {
    const option = document.createElement("option");
    option.value = table.id;
    option.textContent = `Table ${table.id}`;
    calcSelect.appendChild(option);
  });
}

function addTable() {
  const newTableID = state.tables.length + 1;
  const newTable = new Table(newTableID);
  state.tables.push(newTable);
  renderTablesList();
  renderTableCalcList();
}

// Adding some tables
function populateTablesState() {
  addTable();
  addTable();
  addTable();
  addTable();
}

populateTablesState();

// Placing the orders
document.getElementById("addOrder").addEventListener("click", placeOrder);

//to press ENTER for adding
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    // Check if the focus is on the order button or any of the dropdowns
    const activeElement = document.activeElement;
    const orderButton = document.getElementById("addOrder");
    const tableSelect = document.getElementById("tableSelect");
    const dishSelect = document.getElementById("dishSelect");

    if (
      activeElement === orderButton ||
      activeElement === tableSelect ||
      activeElement === dishSelect
    ) {
      placeOrder();
    }
  }
});

function placeOrder() {
  const tableID = parseInt(document.getElementById("tableSelect").value);
  const dishID = document.getElementById("dishSelect").value;

  const newOrder = new Order(tableID, dishID);
  state.orders.push(newOrder);

  renderOrders();

  // to make sure the table is 'empty' before placing the first order
  const cart = document.querySelector(".listRight");
  if (cart.style.display === "none" || cart.style.display === "") {
    cart.style.display = "flex"; //
  }
}

function renderOrders() {
  const ordersList = document.getElementById("cart");
  ordersList.innerHTML = "";
  if (state.orders.length === 0) {
    ordersList.style.display = "none";
  } else {
    ordersList.style.display = "block";
  }

  state.orders.forEach((order, index) => {
    const li = document.createElement("li");
    const dish = state.menus.find((d) => d.dishID === order.dishID);
    const table = state.tables.find((t) => t.id === order.tableID);
    if (dish && table) {
      li.textContent = `Table ${table.id}: ${dish.dishName} - ${dish.price}€`;

      const cancelButton = document.createElement("button");
      cancelButton.textContent = "X";
      cancelButton.style.marginLeft = "20px";
      cancelButton.onclick = function () {
        if (confirm("Are you sure you want to cancel this order?")) {
          cancelOrder(index);
          renderOrders();
          saveStateToLocalStorage();
        }
      };
      li.appendChild(cancelButton);

      ordersList.appendChild(li);
    }
  });
}

// Cancel Button placing orders

function cancelOrder(orderIndex) {
  state.orders.splice(orderIndex, 1);
  saveStateToLocalStorage();
}

//SURPRISE Button

function showSurprise() {
  document.body.innerHTML = "";
  const img = document.createElement("img");
  img.src = "./img/c19b414622520292b8cddd81d7604c86.gif";
  img.alt = "A surprising image!";
  document.body.appendChild(img);
  img.style.display = "block";
  img.style.margin = "auto";
  img.style.width = "55%";
  img.style.borderRadius = "60px";
  img.style.animation = "grow 5s infinite";
}

document
  .getElementById("surpriseButton")
  .addEventListener("click", showSurprise);

//RESET BUTTON for LOCAL STORAGE

// Function to reset local storage
function resetLocalStorage() {
  localStorage.clear();

  state.menus = [];
  state.tables = [];
  state.orders = [];

  populateTablesState();
  renderAll();
}

const resetButton = document.createElement("button");
resetButton.textContent = "Reset";
resetButton.classList.add("resetButton");

resetButton.addEventListener("click", resetLocalStorage);

const buttonsContainer = document.getElementById("content");
buttonsContainer.appendChild(resetButton);

//Calculate button

const calcButton = document.getElementById("calcButton");

calcButton.addEventListener("click", calculateBill);

function calculateBill() {
  const tableID = parseInt(document.getElementById("calcSelect").value);
  const ordersForTable = state.orders.filter(
    (order) => order.tableID === tableID
  );

  if (ordersForTable.length === 0) {
    alert(`Table ${tableID} has no orders.`);
    return;
  }

  let totalBill = 0;

  ordersForTable.forEach((order) => {
    const dish = state.menus.find((d) => d.dishID === order.dishID);
    if (dish) {
      totalBill += dish.price;
    }
  });
  alert(`Table ${tableID} total bill: ${totalBill.toFixed(1)}€`);
}
//Payment button

const payButton = document.getElementById("payButton");

payButton.addEventListener("click", payment);

function payment() {
  const tableID = parseInt(document.getElementById("calcSelect").value);

  const ordersPaid = state.orders.filter((order) => order.tableID === tableID);
  ordersPaid.forEach((order) => {
    const index = state.orders.indexOf(order);
    if (index !== -1) {
      state.orders.splice(index, 1);
    }
  });
  saveStateToLocalStorage();
  renderOrders();
}

//alert when pay

payButton.onclick = function () {
  if (confirm("Have the clients paid?")) {
    const tableID = parseInt(document.getElementById("calcSelect").value);
    payment(tableID);
    renderOrders();
    saveStateToLocalStorage();
  }
};

renderAll();
