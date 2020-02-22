let div = document.querySelector("#itemsDiv");
let productList = document.querySelector("#productList");
let basketList = document.querySelector("#basketList");
let total = document.querySelector("#total");
let basketBtn = document.querySelector("#basketBtn");
let count;
let data;
let basketArray = [];
let liList = basketList.getElementsByTagName("li");

//Hämtar json och kör myFunc
fetch("items.json")
  .then(response => response.json())
  .then(data => myFunc(data));

// Main funktionen
function myFunc(data) {
  // Clear local storage - tömmer hela localstorage
  localStorage.clear();

  // ClearCartEventListener - eventlistener för tömning i varukorg
  clearCartEventListener(data);

  // DisplayView - ritar upp hela menylistan
  displayView(data);

  //orderEventListener - eventlistener på köp knapp
  orderEventListener(data);

  // orderClick - funktion för beställknappen
  orderClick();

  updateCounter(data);
}

// Funktion för att tömma hela varukorgen samt localstorage
function clearCartEventListener(data) {
  document.querySelector("#clear").addEventListener("click", function() {
    localStorage.clear();
    total.textContent = `Total 0:-`;
    for (let x = 0; x < data.length; x++) {
      data[x].count = "0";
    }
    while (basketList.firstChild) {
      basketList.removeChild(basketList.firstChild);
    }
    basketArray = [];
    updateTotalSum(basketArray);
    updateCounter(data);
  });
}

// Ritar upp hela menylistan
function displayView(data) {
  for (let i = 0; i < data.length; i++) {
    productList.innerHTML +=
      `<li class="menuLi" id="li` +
      data[i].id +
      `">` +
      `<img class="foodImg" src="` +
      data[i].picture +
      `">` +
      `<div class="dishP">` +
      `<p class="dish">` +
      data[i].name +
      `</p>` +
      `<p class="dishInfo">` +
      data[i].info +
      `</p>` +
      `<p class="priceTag">` +
      data[i].price +
      `</p>` +
      `</div>` +
      `<input class="qtyInput" type="number"  value="1" min="1" id="input` +
      data[i].id +
      `">` +
      `<button class="buyBtn" id="buy` +
      data[i].id +
      `">` +
      "+";
    ("</li>");
  }
}

// Funktion för köpknappen
function orderEventListener(data) {
  for (let i = 0; i < data.length; i++) {
    document.getElementById(`buy${i}`).addEventListener("click", function() {
      count = parseInt(document.querySelector(`#input${data[i].id}`).value);

      // Hämtar ut antal från localstorage
      let item_count = localStorage.getItem(data[i].name);
      let totalCountOfSpecificItem;

      if (item_count != null) {
        totalCountOfSpecificItem = parseInt(item_count) + count;
        localStorage.setItem(data[i].name, totalCountOfSpecificItem);
      } else {
        localStorage.setItem(data[i].name, count);

        // Visa varukorg
        displayCart(data[i], count);

        // Array med objekt
        basketArray.push(data[i]);

        totalCountOfSpecificItem = count;
        document.querySelector("#basket").classList.remove("hide");
        document.querySelector("#itemCounter").classList.add("hide");
      }

      data[i].count = localStorage.getItem(data[i].name);
      updateBasketView(liList, basketArray, data);
      xButtonClick(data);
    });
  }
}

// Ritar upp varukorgen
function displayCart(data, count) {
  basketList.innerHTML +=
    `<li class="basketLi"id="` +
    data.id +
    `">` +
    `<img class="basketIMG" src="` +
    data.picture +
    `">` +
    "<br>" +
    `<button class="removeBtn" id="removeBtn` +
    data.id +
    `">` +
    "X </button>" +
    `<p class="nameP">` +
    data.name +
    `</p>` +
    `<p class="priceP">` +
    data.price +
    `</p>` +
    `<input class="basketInput" type="number" value="` +
    localStorage.getItem(data.name) +
    `" min="1" id="basketinput` +
    data.id +
    `">` +
    "</li>";
}

basketBtn.addEventListener("click", function() {
  document.querySelector("#basket").classList.toggle("hide");
  document.querySelector("#itemCounter").classList.toggle("hide");
});

// Uppdatering av totalsumma
function updateTotalSum(basketArray) {
  let totalsum = 0;
  for (let i = 0; i < basketArray.length; i++) {
    let item_count = parseInt(localStorage.getItem(basketArray[i].name));

    // Hämtar alla priser från arrayen
    let totalItemSum = parseInt(basketArray[i].price) * item_count;
    totalsum += totalItemSum;
  }

  // Lägger till totalsumma i localstorage samt i html-taggen
  localStorage.setItem("TOTAL", totalsum.toString());
  total.textContent = `Totalt:  ${totalsum.toString()}:-`;
}

// Uppdatering av varukorgsvyn
function updateBasketView(liList, basketArray, data) {
  for (let i = 0; i < liList.length; i++) {
    // Hämtar values från localstorage efter produktnamn och sparar till nbrOfItem.
    let nbrOfItem = localStorage.getItem(basketArray[i].name);
    //Uppdatera basketinput med nbrOfItem
    liList[i].querySelector(`#basketinput${liList[i].id}`).value = nbrOfItem;
  }
  basketInputListener(data, liList);
  updateTotalSum(basketArray);
  updateCounter(data);
}

// Eventlistener för input i varukorgen
function basketInputListener(data) {
  for (let x = 0; x < data.length; x++) {
    if (parseInt(data[x].count) > 0) {
      document
        .querySelector(`#basketinput${data[x].id}`)
        .addEventListener("change", function() {
          data[x].count = document.querySelector(
            `#basketinput${data[x].id}`
          ).value;
          localStorage.setItem(data[x].name, data[x].count);
          updateTotalSum(basketArray);
          updateCounter(data);
          document
            .querySelector(`#basketinput${data[x].id}`)
            .setAttribute(
              "value",
              document.querySelector(`#basketinput${data[x].id}`).value
            );
        });
    }
  }
}

// Beställ-knappen
function orderClick() {
  document.querySelector("#order").addEventListener("click", function() {
    localStorage.setItem("Array", JSON.stringify(basketArray));
  });
}

// Kryssknappen i varukorgen
function xButtonClick(data) {
  for (let x = 0; x < data.length; x++) {
    if (data[x].count > 0) {
      document
        .querySelector(`#removeBtn${data[x].id}`)
        .addEventListener("click", function() {
          localStorage.removeItem(data[x].name);
          let elemnt_id = document.getElementById(data[x].id);
          if (elemnt_id != null) {
            elemnt_id.remove();
          }
          data[x].count = "0";
          for (let i = 0; i < basketArray.length; i++) {
            if (data[x].name == basketArray[i].name) {
              basketArray.splice(i, 1);
            }
          }
          updateTotalSum(basketArray);
          updateCounter(data);
        });
    }
  }
}

function updateCounter(data) {
  let counter = 0;
  for (let i = 0; i < data.length; i++) {
    counter += parseInt(data[i].count);
  }

  document.querySelector("#itemCounter").textContent = counter;
}
