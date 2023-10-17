class CartContainer extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    fetch("src/components/cart-container/cart-container.html")
      .then((response) => response.text())
      .then((content) => {
        this.innerHTML = content;
      })
      .catch((error) => {
        console.error("Error al cargar el archivo HTML:", error);
      });
  }
}

window.customElements.define("cart-container", CartContainer);
