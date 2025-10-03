AOS.init({
once: false,
mirror: true,
});


$(document).ready(function(){
  $('.rightbox5block').slick({
    slidesToShow: 1,        // один слайд за раз
    slidesToScroll: 1,
    dots: true,   
    arrows: false,          // точки навигации
    infinite: true,         // зацикливание
    autoplay: true,         // автопрокрутка
    autoplaySpeed: 3000,    // каждые 3 секунды
    fade: true,             // плавное переключение
    cssEase: 'linear'
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const box = document.querySelector(".mpbox5");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      let ratio = entry.intersectionRatio; // сколько % блока видно (0 → 1)

      // Чем больше видно блока, тем сильнее затемняем фон
      // opacity = 1 - ratio → когда блок на 100% в экране → overlay=0 (виден фон)
      // когда блок только на 20% → overlay≈0.8 (почти черный)
      let opacity = ratio;

      opacity = Math.min(Math.max(opacity, 0), 1);

      box.style.setProperty("--overlay-opacity", opacity);
      box.querySelector("::before"); // триггер обновления (опционально)
      // проще: напрямую меняем opacity у псевдоэлемента
      box.style.setProperty("--darkness", opacity);
    });
  }, {
    threshold: Array.from({length: 101}, (_, i) => i / 100)
  });

  observer.observe(box);
});
