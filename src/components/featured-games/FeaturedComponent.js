class FeaturedComponent extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    fetch('src/components/featured-games/featured-component.html')
      .then(response => response.text())
      .then(content => {
        this.innerHTML = content;
      })
      .catch(error => {
        console.error('Error al cargar el archivo HTML:', error);
      });
  }
}

window.customElements.define('featured-component', FeaturedComponent);
