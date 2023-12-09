class SliderComponent extends HTMLElement {
  constructor() {
    super();
    this.loadHtmlContent();
  }

  async loadHtmlContent() {
    try {
      const response = await fetch(
        "components/img-slider/slider-component.html"
      );
      if (!response.ok) {
        throw new Error(`Error loading HTML file: ${response.statusText}`);
      }
      const content = await response.text();
      this.innerHTML = content;

      const imgSlider = this.querySelector(".img-slider");
      const slides = imgSlider.querySelectorAll(".slide");
      const dotsContainer = this.querySelector(".dotsContainer");
      const dots = dotsContainer.querySelectorAll(".dot");

      let nIntervId;
      let slideIndex = 0;

      function switchImage(index) {
        slideIndex = index;
        clearInterval(nIntervId);
        updateSlider();
        autoSlide();
      }

      function updateSlider() {
        slides.forEach((slide, index) => {
          if (index == slideIndex) {
            slide.classList.add("active");
          } else {
            slide.classList.remove("active");
          }
        });

        dots.forEach((dot, index) => {
          if (index == slideIndex) {
            dot.classList.add("active");
          } else {
            dot.classList.remove("active");
          }
        });

        const translateXValue = -slideIndex * 100;
        imgSlider.style.transition = "transform 0.5s ease-in-out";
        imgSlider.style.transform = `translateX(${translateXValue}%)`;
      }

      function autoSlide() {
        nIntervId = setInterval(() => {
          slideIndex = (slideIndex + 1) % slides.length;
          updateSlider();
        }, 5000);
        updateSlider();
      }

      dots.forEach((dot, index) => {
        dot.onclick = function () {
          switchImage(index);
        };
      });

      let touchStartX = 0;
      let touchEndX = 0;

      this.addEventListener("touchstart", (event) => {
        touchStartX = event.touches[0].clientX;
      });

      this.addEventListener("touchend", (event) => {
        touchEndX = event.changedTouches[0].clientX;
        handleTouch();
        clearInterval(nIntervId);
        updateSlider();
        autoSlide();
      });

      function handleTouch() {
        const touchThreshold = 50;
        const distance = touchEndX - touchStartX;

        if (Math.abs(distance) >= touchThreshold) {
          if (distance > 0) {
            // Swipe right
            slideIndex = (slideIndex - 1 + slides.length) % slides.length;
          } else {
            // Swipe left
            slideIndex = (slideIndex + 1) % slides.length;
          }
          updateSlider();
        }
      }

      autoSlide();
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

window.customElements.define("slider-component", SliderComponent);
