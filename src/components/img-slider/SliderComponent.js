class SliderComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    fetch('src/components/img-slider/slider-component.html')
      .then(response => response.text())
      .then(content => {
        this.innerHTML = content;
      })
      .catch(error => {
        console.error('Error al cargar el archivo HTML:', error);
      });
  }
}

window.customElements.define('slider-component', SliderComponent);
