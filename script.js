window.addEventListener("scroll", () => {

const header = document.querySelector(".header");

if(window.scrollY > 100){
header.style.background = "rgba(255,255,255,.98)";
}
else{
header.style.background = "rgba(255,255,255,.92)";
}

});
