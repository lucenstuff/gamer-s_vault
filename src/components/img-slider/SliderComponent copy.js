class SliderComponent extends HTMLElement {
  constructor() {
    super();
    this.currentSlide = 0;
    this.slides = [];
    this.autoChangeInterval = 5000;
    this.autoChangeTimer = null;
  }

  connectedCallback() {
    fetch('src/components/img-slider/slider-component.html')
      .then(response => response.text())
      .then(content => {
        this.innerHTML = content;
        this.slides = this.querySelectorAll('.showSlide');
        this.showSlide(this.currentSlide);
        this.startAutoChange();
        this.setupButtons();
      })
      .catch(error => {
        console.error('Error al cargar el archivo HTML:', error);
      });
  }

  showSlide(n) {
    if (n < 0) {
      this.currentSlide = this.slides.length - 1;
    }
    if (n >= this.slides.length) {
      this.currentSlide = 0;
    }
    this.slides.forEach(slide => {
      slide.style.display = 'none';
    });
    this.slides[this.currentSlide].style.display = 'block';
  }

  nextSlide() {
    this.currentSlide++;
    this.showSlide(this.currentSlide);
    this.resetAutoChange();
  }

  prevSlide() {
    this.currentSlide--;
    this.showSlide(this.currentSlide);
    this.resetAutoChange(); 
  }

  startAutoChange() {
    this.autoChangeTimer = setInterval(() => {
      this.nextSlide();
    }, this.autoChangeInterval);
  }

  stopAutoChange() {
    clearInterval(this.autoChangeTimer);
  }

  resetAutoChange() {
    this.stopAutoChange(); 
    this.startAutoChange(); 
  }

  setupButtons() {
    const buttons = this.querySelectorAll('.slider-button');

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        this.currentSlide = index;
        this.showSlide(this.currentSlide);
        this.resetAutoChange(); 
      });
    });
  }
  
}



window.customElements.define('slider-component', SliderComponent);
