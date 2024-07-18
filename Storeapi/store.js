async function fetchProd() {
  const response = await fetch("https://fakestoreapi.com/products");
  const products = await response.json();
  return products;
}
var search;
var min_price;
var max_price;
var category;
var currentPage = 1;
var itemsPerPage = 6;

function addToCart(product) {
  const cart = document.getElementById("cart");
  const item = document.createElement("div");
  item.classList.add("cart-item");
  item.dataset.productId = product.id;
  item.innerHTML = `
    <h4>${product.title}</h4>
    <p>${product.price}</p>
    <button class="remove-btn">Remove</button>
  `;
  cart.appendChild(item);

  item.querySelector(".remove-btn").addEventListener("click", function () {
    removeFromCart(item);
  });
  updateCartTotals();
}

function updateCartTotals() {
  const cartItems = document.querySelectorAll(".cart-item");
  let totalItems = cartItems.length;
  let totalPrice = 0;

  cartItems.forEach((item) => {
    console.log(item);
    totalPrice += parseFloat(item.childNodes[3].textContent);
  });

  document.getElementById(
    "total-items"
  ).textContent = `Total Items: ${totalItems}`;
  document.getElementById(
    "total-price"
  ).textContent = `Total Price: $${totalPrice.toFixed(2)}`;
}

function initializeCartTotals() {
  const cart = document.getElementById("cart");
  const cartTotalsContainer = document.createElement("div");
  cartTotalsContainer.innerHTML = `
    <p id="total-items">Total Items: 0</p>
    <p id="total-price">Total Price: $0.00</p>
  `;
  cart.appendChild(cartTotalsContainer);
}
initializeCartTotals();
function removeFromCart(item) {
  item.remove();
  updateCartTotals();
}
function load_prod() {
  fetchProd().then((products) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedProducts = products.slice(startIndex, endIndex);
    var prod_length = 0;

    const cont = document.getElementsByClassName("container_items")[0];
    cont.innerHTML = "";
    displayedProducts.forEach((product) => {
      if (search && min_price && max_price && category) {
        if (
          product.title.toLowerCase().includes(search.toLowerCase()) &&
          product.category == category &&
          product.price < max_price &&
          product.price > min_price
        ) {
          const item = document.createElement("div");
          item.innerHTML = `<div class="items"><img src=${product.image}></img><br><h1>${product.title}</h1><h3 class="description" style="display: none;">${product.description}</h3><h3>${product.price}</div>`;
          const addButton = document.createElement("button");
          addButton.innerText = "Add to Cart";
          addButton.onclick = () => addToCart(product);
          item.appendChild(addButton);
          const description_button = document.createElement("button");
          description_button.innerText = "Description";
          description_button.onclick = () => {
            const description = item.querySelector(".description");
            if (description.style.display === "none") {
              description.style.display = "block";
            } else {
              description.style.display = "none";
            }
          };
          item.appendChild(description_button);
          cont.appendChild(item);
          prod_length += 1;
        }
      } else {
        const item = document.createElement("div");
        item.innerHTML = `<div class="items"><img src=${product.image}></img><br><h1>${product.title}</h1><h3 class="description" style="display: none;">${product.description}</h3><h3>${product.price}</div>`;
        const addButton = document.createElement("button");
        addButton.innerText = "Add to Cart";
        addButton.onclick = () => addToCart(product);
        item.appendChild(addButton);
        const description_button = document.createElement("button");
        description_button.innerText = "Description";
        description_button.onclick = () => {
          const description = item.querySelector(".description");
          if (description.style.display === "none") {
            description.style.display = "block";
          } else {
            description.style.display = "none";
          }
        };
        item.appendChild(description_button);
        cont.appendChild(item);
        prod_length = products.length;
      }
    });
    createPaginationButtons(prod_length);
  });
}

function createPaginationButtons(totalItems) {
  const paginationCont = document.getElementById("pagination");
  paginationCont.innerHTML = "";

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.onclick = () => {
      currentPage = i;
      load_prod();
    };
    paginationCont.appendChild(btn);
  }
}

load_prod();
const form = document.getElementById("searchForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();
});

function prod_search() {
  const formData = new FormData(form);

  search = formData.get("search") || " ";
  category = formData.get("category");
  min_price = formData.get("min_price") || 1;
  max_price = parseInt(formData.get("max_price")) || 1000000000000;

  load_prod();
}

function clear_search() {
  search = "";
  category = "";
  min_price = 1;
  max_price = 1000000000000;
  load_prod();
}
