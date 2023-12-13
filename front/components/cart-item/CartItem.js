class CartItem extends HTMLElement {
  constructor() {
    super();
    this.name = "";
    this.price = "";
    this.image = "";
  }

  connectedCallback() {
    fetch("components/cart-item/cart-item.html")
      .then((response) => response.text())
      .then((content) => {
        const template = document.createElement("template");
        template.innerHTML = content;

        const nameElement =
          template.content.querySelector('[data-name="name"]');
        const priceElement = template.content.querySelector(
          '[data-price="price"]'
        );
        const imageElement = template.content.querySelector(".cart-item img");

        nameElement.textContent = this.name;
        priceElement.textContent = `$${this.price}`;
        imageElement.src = this.image;

        this.appendChild(template.content.cloneNode(true));
      })
      .catch((error) => {
        console.error("Error loading cart-item template:", error);
      });
  }
}

window.customElements.define("cart-item", CartItem);
