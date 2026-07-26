const API_URL = "https://script.google.com/macros/s/AKfycbzyjZerJYwh_9QYO2lscOAiFUI9lerQChi_CKhIPOvu-90qJ148ndigwgvcDgqYX-T8nA/exec";

const input = document.getElementById("searchInput");
const button = document.getElementById("searchButton");
const result = document.getElementById("result");

let products = [];

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
<div class="w3-card-4 w3-white w3-round-xxlarge w3-padding"
style="max-width:700px;margin:30px auto;">

<img src="https://raw.githubusercontent.com/netw20200/autoparts-search/main/images/${found.photo}"
style="width:100%;max-height:320px;object-fit:contain;border-radius:15px;">

<h2 style="color:#d32f2f;margin-top:20px;">
${found.description}
</h2>

<hr>

<p><b>Код:</b> ${found.code}</p>

<p><b>Производитель:</b> ${found.manufacturer}</p>

<p><b>Количество:</b> ${found.quantity}</p>


<p style="font-size:30px;color:#0b8f32;font-weight:bold;text-align:right;">
Цена: ${found["Цена"]}
</p>
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
