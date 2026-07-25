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
