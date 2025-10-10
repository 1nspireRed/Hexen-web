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


document.querySelectorAll('.box').forEach(box => {
  // создаём контейнер с полосами поверх бокса
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  const stripes = 12; // количество жалюзи
  overlay.style.display = 'grid';
  overlay.style.gridTemplateColumns = `repeat(${stripes}, 1fr)`;
  overlay.style.position = 'absolute';
  overlay.style.inset = 0;
  overlay.style.zIndex = 5;
  overlay.style.pointerEvents = 'none';
  
  for (let i = 0; i < stripes; i++) {
    const strip = document.createElement('div');
    strip.style.background = '#000';
    strip.style.transformOrigin = 'right';
    strip.style.transition = 'transform 0.8s ease';
    strip.style.transitionDelay = `${i * 60}ms`;
    overlay.appendChild(strip);
  }

  box.appendChild(overlay); // добавляем поверх содержимого
  box.classList.add('ready');
});

// IntersectionObserver для скролла
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      const strips = entry.target.querySelectorAll('.overlay div');
      strips.forEach(s => s.style.transform = 'rotateY(90deg)');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.box').forEach(b => observer.observe(b));



let lastScrollTop = 0;
const header = document.querySelector('header');
let scrollDelta = 0;                    // насколько прокрутили вверх
const scrollUpThreshold = 400;          // порог (в пикселях)
const showThresholdTop = 80;            // зона сверху, где header всегда виден

function onScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // ВСЕГДА показывать хедер, если мы в верхней зоне страницы
  if (scrollTop <= showThresholdTop) {
    header.style.top = "0";
    header.style.opacity = "1";
    scrollDelta = 0;
    lastScrollTop = scrollTop;
    return;
  }

  // Скроллим вниз
  if (scrollTop > lastScrollTop) {
    scrollDelta = 0;
    header.style.top = "-125px";
    header.style.opacity = "0";
  }
  // Скроллим вверх
  else if (scrollTop < lastScrollTop) {
    scrollDelta += (lastScrollTop - scrollTop);
    if (scrollDelta > scrollUpThreshold) {
      header.style.top = "0";
      header.style.opacity = "1";
      scrollDelta = 0;
    }
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}

window.addEventListener('scroll', onScroll);
onScroll(); // инициализация при загрузке


(function() {
    emailjs.init({
      publicKey: "HHJ9YzpZrM8tcbJ76" // например: "y4hS5vXg7q2k5abcD"
    });
  })();

  // Отправка формы
  document.querySelector(".contact-form").addEventListener("submit", function(e) {
    e.preventDefault(); // блокируем перезагрузку страницы

    // Отправляем форму через EmailJS
    emailjs.sendForm("service_npwq7t5", "template_xkkq6im", this)
      .then(() => {
        alert("✅ Your message has been sent!");
        this.reset(); // очищаем поля
      }, (error) => {
        console.error("❌ EmailJS error:", error);
        alert("Failed to send. Please try again later.");
      });
  });

