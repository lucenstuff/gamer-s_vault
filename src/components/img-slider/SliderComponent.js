class SliderComponent extends HTMLElement {
  constructor() {
    super();
    this.loadHtmlContent();
  }

  async loadHtmlContent() {
    try {
      const response = await fetch('src/components/img-slider/slider-component.html');

      if (!response.ok) {
        throw new Error(`Error loading HTML file: ${response.statusText}`);
      }

      const content = await response.text();
      this.innerHTML = content;

      const imgSlider = this.querySelector('.img-slider');
      const slides = imgSlider.querySelectorAll('.slide');
      const dotsContainer = document.querySelector('.dotsContainer');
      const dots = dotsContainer.querySelectorAll('.dot');

      let slideIndex = 0;

      function switchImage(index) {
        slideIndex = index;
        updateSlider();
      }

      function updateSlider() {
        slides.forEach((slide, index) => {
          if (index == slideIndex) {
            slide.classList.add('active');
          } else {
            slide.classList.remove('active');
          }
        });

        dots.forEach((dot, index) => {
          if (index == slideIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });

        const translateXValue = -slideIndex * 100;
        imgSlider.style.transition = 'transform 0.5s ease-in-out'; 
        imgSlider.style.transform = `translateX(${translateXValue}%)`;
      }

      function autoSlide() {
        setInterval(() => {
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

      // Iniciar la rotación automática
      autoSlide();
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

window.customElements.define('slider-component', SliderComponent);
