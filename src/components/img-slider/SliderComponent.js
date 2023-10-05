class SliderComponent extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    try {
      const response = await fetch('src/components/img-slider/slider-component.html');

      if (!response.ok) {
        throw new Error(`Error loading HTML file: ${response.statusText}`);
      }

      const content = await response.text();
      this.innerHTML = content;
    } catch (error) {
      console.error('Error:', error);
    }
  }
}



window.customElements.define('slider-component', SliderComponent);
