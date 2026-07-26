const cart = JSON.parse(localStorage.getItem("cart")) || [];

const orderItems = document.getElementById("orderItems");
const orderTotal = document.getElementById("orderTotal");

let total = 0;

cart.forEach(item => {

    total += item.price * item.count;

    orderItems.innerHTML += `
<div class="w3-padding" style="border-bottom:1px solid #ddd;">

<b>${item.description}</b><br>

${item.count} × ${item.price} грн

<span style="float:right;font-weight:bold;">
${item.price * item.count} грн
</span>

</div>
`;

});

orderTotal.innerText = total;

function sendOrder(){

const name = document.getElementById("customerName").value;
const phone = document.getElementById("customerPhone").value;
const email = document.getElementById("customerEmail").value;
const comment = document.getElementById("customerComment").value;

let orderText = "";

cart.forEach(item=>{

orderText += `${item.description} (${item.count} шт.) - ${item.price * item.count} грн\n`;

});

emailjs.send("service_c66yum5","template_c2jum1w",{

name: name,
phone: phone,
email: email,
comment: comment,
order: orderText,
total: total + " грн"

}).then(function(){

alert("Заказ успешно отправлен!");

localStorage.removeItem("cart");

window.location.href="index.html";

},function(error){

alert("Ошибка отправки!");

console.log(error);

});

}
