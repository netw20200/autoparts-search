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
