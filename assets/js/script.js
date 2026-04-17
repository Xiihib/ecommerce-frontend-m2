

document.addEventListener("DOMContentLoaded", function () {
    const btnArriba = document.getElementById("btnArriba");

    btnArriba.style.display = "none";

    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            btnArriba.style.display = "block";
        } else {
            btnArriba.style.display = "none";
        }
    });

    btnArriba.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});