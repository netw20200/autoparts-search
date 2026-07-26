const API_URL = "https://script.google.com/macros/s/AKfycbzyjZerJYwh_9QYO2lscOAiFUI9lerQChi_CKhIPOvu-90qJ148ndigwgvcDgqYX-T8nA/exec";
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

    const found = products.find(item =>
        String(item.code).toLowerCase() === query
    );

    if (!found) {
        result.innerHTML = "<p>Товар не найден.</p>";
        return;
    }
    
result.innerHTML = `
<div class="w3-card w3-white w3-round-large"
style="max-width:560px;margin:15px auto;padding:12px;">

<div style="display:flex;align-items:center;gap:12px;">

<img
src="https://raw.githubusercontent.com/netw20200/autoparts-search/main/images/${found.photo}"
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
    document.getElementById("cart").style.display = "block";
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

    const name = document.getElementById("customerName").value;
    const phone = document.getElementById("customerPhone").value;
    const comment = document.getElementById("customerComment").value;

    let productsText = "";

    cart.forEach(item=>{
        productsText += `${item.description}\n${item.count} × ${item.price} грн = ${item.count*item.price} грн\n\n`;
    });

    const total = cart.reduce((sum,item)=>sum + item.count*item.price,0);

    emailjs.send(
        "service_c66yum5",
        "template_c2jum1w",
        {
            name: name,
            phone: phone,
            comment: comment,
            products: productsText,
            total: total
        }
    ).then(function(){

        alert("Заказ успешно отправлен!");

        cart = [];
        updateCart();

        document.getElementById("cart").style.display = "none";
        document.getElementById("orderForm").style.display = "none";

        document.getElementById("customerName").value = "";
        document.getElementById("customerPhone").value = "";
        document.getElementById("customerComment").value = "";

    }, function(error){

        alert("Ошибка отправки заказа.");
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
