class ProductInfoPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    fetch("components/product-info-page/footer/product-info-page.html")
      .then((response) => response.text())
      .then((content) => {
        this.innerHTML = content;
      })
      .catch((error) => {
        console.error("Error al cargar el archivo HTML:", error);
      });
  }
}

window.customElements.define("product-info-page", ProductInfoPage);
