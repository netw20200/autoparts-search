const API_URL = CONFIG.API_URL;
const input = document.getElementById("searchInput");
const button = document.getElementById("searchButton");
const result = document.getElementById("result");

let products = [];
let cart = [];
async function loadProducts() {

    result.innerHTML = "<p>Загрузка товаров...</p>";
    
    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Ошибка загрузки");
        }

        products = await response.json();

        result.innerHTML = "";

        console.log(products);

    } catch (error) {

        console.log(error);

        result.innerHTML =
        "<p>Не удалось загрузить товары.</p>";
    }

}
function searchProduct() {
if (products.length === 0) {
    result.innerHTML = "<p>Подождите, товары ещё загружаются...</p>";
    return;
}
    const query = input.value.trim().toLowerCase();

    if (query === "") {
        result.innerHTML = "<p>Введите каталожный номер.</p>";
        return;
    }

    const found = products.find(item => {

    const codeMatch =
        String(item.code).toLowerCase() === query;

    const crossMatch =
        item.crosses &&
        String(item.crosses)
            .toLowerCase()
            .split(",")
            .map(x => x.trim())
            .includes(query);

    return codeMatch || crossMatch;

});

    if (!found) {
        result.innerHTML = "<p>Товар не найден.</p>";
        return;
    }
    
result.innerHTML = `
<div class="w3-card w3-white w3-round-large"
style="max-width:560px;margin:15px auto;padding:12px;">

<div style="display:flex;align-items:center;gap:12px;">

<img
src="https://raw.githubusercontent.com/netw20200/autoparts-search/main/images/${found.photo || 'no-image.jpeg'}"
onerror="this.src='https://raw.githubusercontent.com/netw20200/autoparts-search/main/images/no-image.jpeg'"
style="
width:90px;
height:90px;
object-fit:contain;
border:1px solid #ddd;
border-radius:8px;
padding:4px;
background:white;">

<div style="flex:1;">

<div style="font-size:18px;font-weight:bold;color:#c62828;margin-bottom:8px;">
${found.description}
</div>

<div><b>Код:</b> ${found.code}</div>

<div><b>Производитель:</b> ${found.manufacturer}</div>

<div><b>Остаток:</b> ${found.quantity}</div>

<div style="
margin-top:10px;
display:flex;
justify-content:space-between;
align-items:center;">

<div>
<b>Цена:</b>
<span style="
font-size:20px;
font-weight:bold;
color:#d32f2f;">

${found.price} грн

</span>
</div>

<button
class="w3-button w3-red w3-round-large"
onclick="addToCart('${found.code}')">

Купить

</button>

</div>

</div>

</div>

</div>
`;
    
}
button.addEventListener("click", searchProduct);

input.addEventListener("keydown", function(e){

    if(e.key === "Enter"){

        searchProduct();

    }

});

loadProducts();

function addToCart(code){

    console.log("addToCart вызвана", code);
    const product = products.find(item => item.code == code);

    if(!product) return;

    const existing = cart.find(item => item.code == code);

    if(existing){

        if(existing.count < Number(product.quantity)){
            existing.count++;
        }else{
            alert("На складе больше нет товара.");
        }

    }else{

        cart.push({
            code: product.code,
            description: product.description,
            price: parseFloat(String(product.price).replace(",", ".").replace(/[^\d.]/g, "")),
            count: 1
        });
updateCart();
    }

    console.log(cart);
    
updateCart();
    showMessage("✓ Товар добавлен в корзину");

input.value = "";
input.focus();
}

function updateCart(){

    const cartDiv = document.getElementById("cartItems");
    const totalDiv = document.getElementById("cartTotal");

    cartDiv.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

        total += item.price * item.count;

        cartDiv.innerHTML += `
<div class="w3-padding-small" style="border-bottom:1px solid #ddd;">

<b>${item.description}</b><br>

Количество: ${item.count}

<button class="w3-button w3-green w3-round-small"
onclick="increaseItem('${item.code}')">+</button>

<button class="w3-button w3-orange w3-round-small"
onclick="decreaseItem('${item.code}')">−</button>

<button class="w3-button w3-red w3-round-small"
onclick="removeItem('${item.code}')">✕</button>

<p>${item.price} грн × ${item.count} = <b>${item.price * item.count} грн</b></p>

</div>
`;

    });

    totalDiv.innerText = total;
localStorage.setItem("cart", JSON.stringify(cart));

updateCartCounter();
}

function increaseItem(code){

    const item = cart.find(i => i.code == code);
    const product = products.find(i => i.code == code);

    if(item.count < Number(product.quantity)){
        item.count++;
    }

    updateCart();

}

function decreaseItem(code){

    const item = cart.find(i => i.code == code);

    if(item.count > 1){
        item.count--;
    }

    updateCart();

}

function removeItem(code){

    cart = cart.filter(i => i.code != code);

    updateCart();

    if(cart.length == 0){
        document.getElementById("cart").style.display = "none";
    }

}
window.increaseItem = increaseItem;
window.decreaseItem = decreaseItem;
window.removeItem = removeItem;
function sendOrder(){
    
if (cart.length === 0) {
    alert("Корзина пуста.");
    return;
}
    const name = document.getElementById("customerName").value;
    const phone = document.getElementById("customerPhone").value;
    const comment = document.getElementById("customerComment").value;
if(name.trim() === "" || phone.trim() === ""){
    alert("Введите имя и телефон.");
    return;
}
    let productsText = "";

    cart.forEach(item=>{
        productsText += `${item.description}\n${item.count} × ${item.price} грн = ${item.count*item.price} грн\n\n`;
    });

    const total = cart.reduce((sum,item)=>sum + item.count*item.price,0);

    emailjs.send(
    CONFIG.EMAILJS_SERVICE,
    CONFIG.EMAILJS_TEMPLATE_ORDER,
        {
            name: name,
            phone: phone,
            comment: comment,
            order: productsText,
            total: total
        }
    ).then(function(){

        alert("Заказ успешно отправлен!");

        cart = [];
        updateCart();

        document.getElementById("cart").style.display = "none";
        document.getElementById("orderForm").style.display = "none";
document.getElementById("cartOverlay").style.display = "none";
        document.getElementById("customerName").value = "";
        document.getElementById("customerPhone").value = "";
        document.getElementById("customerComment").value = "";

    }, function(error){

        alert(error.text || error.message || JSON.stringify(error));
        console.log(error);

    });

}
function showMessage(text){

    const msg = document.getElementById("message");

    msg.innerText = text;
    msg.style.display = "block";

    setTimeout(function(){
        msg.style.display = "none";
    },2500);

}

function goToCheckout(){

    localStorage.setItem("cart", JSON.stringify(cart));

    window.location.href = "checkout.html";

}
function sendVinRequest() {
if (
    document.getElementById("vinName").value.trim() === "" ||
    document.getElementById("vinPhone").value.trim() === "" ||
    document.getElementById("vinCode").value.trim() === "" ||
    document.getElementById("vinPart").value.trim() === ""
) {
    alert("Заполните имя, телефон, VIN-код и укажите, что требуется подобрать.");
    return;
}
const params = {

name: document.getElementById("vinName").value,

phone: document.getElementById("vinPhone").value,

email: document.getElementById("vinEmail").value,

vin: document.getElementById("vinCode").value,

part: document.getElementById("vinPart").value,

comment: document.getElementById("vinComment").value

};

emailjs.send(
    CONFIG.EMAILJS_SERVICE,
    CONFIG.EMAILJS_TEMPLATE_VIN,
params
).then(function () {

alert("Запрос по VIN успешно отправлен!");

document.getElementById("vinForm").style.display = "none";

document.getElementById("vinName").value = "";
document.getElementById("vinPhone").value = "";
document.getElementById("vinEmail").value = "";
document.getElementById("vinCode").value = "";
document.getElementById("vinPart").value = "";
document.getElementById("vinComment").value = "";

}, function (error) {

alert(error.text || error.message || JSON.stringify(error));

console.log(error);

});

}
const clearButton = document.getElementById("clearSearch");

searchInput.addEventListener("input", function () {

    if (this.value.trim() === "") {

        clearButton.style.display = "none";

        result.innerHTML = "";

    } else {

        clearButton.style.display = "block";

    }

});

clearButton.addEventListener("click", function () {

    searchInput.value = "";

    result.innerHTML = "";

    clearButton.style.display = "none";

    searchInput.focus();

});
function updateCartCounter(){

    let count = 0;

    cart.forEach(item => {

        count += item.count;

    });

    const badge = document.getElementById("cartCount");

    if(count > 0){

        badge.style.display = "flex";
        badge.innerText = count;

    }else{

        badge.style.display = "none";

    }

}
updateCartCounter();

document.getElementById("cartIcon").addEventListener("click", function(){

    const cartBlock = document.getElementById("cart");

    if(cartBlock.style.display === "block"){

        cartBlock.style.display = "none";

    }else{

        cartBlock.style.display = "block";

    }

});


function openOrderForm(){

    if(cart.length === 0){
        alert("Корзина пуста.");
        return;
    }

    document.getElementById("cartOverlay").style.display = "block";
    document.getElementById("orderForm").style.display = "block";

    document.getElementById("orderForm").style.position = "fixed";
    document.getElementById("orderForm").style.top = "50%";
    document.getElementById("orderForm").style.left = "50%";
    document.getElementById("orderForm").style.transform = "translate(-50%, -50%)";

    document.getElementById("cart").style.display = "none";
}

document.getElementById("shopName").innerText = CONFIG.SHOP_NAME;
document.getElementById("shopPhone").innerText = CONFIG.PHONE;
document.getElementById("shopLogo").src = CONFIG.LOGO;

document.querySelector(".bgimg").style.backgroundImage =
`url('${CONFIG.BACKGROUND}')`;


function closeOrderForm(){

    document.getElementById("orderForm").style.display = "none";
    document.getElementById("cartOverlay").style.display = "none";

}

// ================= ЯЗЫК =================

let currentLang = LANG_RU;

function applyLanguage(){

document.getElementById("searchButton").innerText =
currentLang.search;

document.getElementById("searchInput").placeholder =
currentLang.searchPlaceholder;

// VIN

document.querySelector("#vinForm h3").innerText =
"🚗 " + currentLang.vin;

document.getElementById("vinCode").placeholder =
currentLang.vinCode;

document.getElementById("vinPart").placeholder =
currentLang.vinPart;

document.getElementById("vinName").placeholder =
currentLang.name;

document.getElementById("vinPhone").placeholder =
currentLang.phone;

document.getElementById("vinEmail").placeholder =
currentLang.email;

document.getElementById("vinComment").placeholder =
currentLang.comment;

// Кнопка запроса VIN

document.querySelector(
'button[onclick="sendVinRequest()"]'
).innerText = currentLang.send;

document.querySelector(
'button[onclick="document.getElementById(\'vinForm\').style.display=\'none\'"]'
).innerText = currentLang.cancel;

// Кнопка открытия VIN

document.querySelector(
'button[onclick="document.getElementById(\'vinForm\').style.display=\'block\'"]'
).innerText = currentLang.vinButton;

// Корзина

document.querySelector("#cart h3").innerText =
"🛒 " + currentLang.cart;

const checkoutBtn = document.getElementById("checkoutButton");
if (checkoutBtn) checkoutBtn.innerText = currentLang.checkout;

const vinTitle = document.getElementById("vinTitle");
if (vinTitle) vinTitle.innerText = currentLang.vin;

const salesLink = document.getElementById("salesLink");
if (salesLink) salesLink.innerText = currentLang.sales;

const accessoriesLink = document.getElementById("accessoriesLink");
if (accessoriesLink) accessoriesLink.innerText = currentLang.accessories;

const fluidsLink = document.getElementById("fluidsLink");
if (fluidsLink) fluidsLink.innerText = currentLang.fluids;
}

function setLanguage(lang){

if(lang === "ua"){

currentLang = LANG_UA;

localStorage.setItem("lang","ua");

}else{

currentLang = LANG_RU;

localStorage.setItem("lang","ru");

}

applyLanguage();

}

const savedLang = localStorage.getItem("lang");

if(savedLang === "ua"){

currentLang = LANG_UA;

}
applyLanguage();


