let itemsArr = JSON.parse(localStorage.getItem("Array"));

for (let i = 0; i < itemsArr.length; i++) {
  document.querySelector("ul").innerHTML +=
    `<li class="orderLi" "id="` +
    itemsArr[i].id +
    `">` +
    `<img class="orderIMG" src="` +
    itemsArr[i].picture +
    `">` +
    "<br>" +
    `<p class="orderName">` +
    itemsArr[i].name +
    `</p>` +
    `<p class="orderPrice">` +
    itemsArr[i].price +
    `</p>` +
    `<p class="orderCount" id="p` +
    itemsArr.id +
    `">` +
    itemsArr[i].count.toString() +
    " st</p>" +
    "</li>";
}

document.querySelector(".orderTotal").innerHTML +=
  " " + localStorage.getItem("TOTAL") + " kr";

localStorage.clear();
