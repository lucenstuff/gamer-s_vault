class CartBox extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    fetch("components/cart-box/cart-box.html")
      .then((response) => response.text())
      .then((content) => {
        this.innerHTML = content;
      })
      .catch((error) => {
        console.error("Error al cargar el archivo HTML:", error);
      });
  }
}

window.customElements.define("cart-box", CartBox);
