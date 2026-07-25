
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
        <div class="card">

            <h2>${found.description}</h2>

            <p><b>Код:</b> ${found.code}</p>

            <p><b>Производитель:</b> ${found.brand}</p>

            <p><b>Количество:</b> ${found.quantity}</p>

            <p><b>Цена:</b> ${found.price}</p>

            <img src="${found.photo}" alt="Фото товара">

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
