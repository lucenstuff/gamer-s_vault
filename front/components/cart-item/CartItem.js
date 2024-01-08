class CartItem extends HTMLElement {
  constructor() {
    super();
    this.name = "";
    this.price = "";
    this.image = "";
    this.deleteButton = null;
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

        this.deleteButton = template.content.querySelector(".delete-button");
        this.deleteButton.addEventListener("click", () => {
          eventBus.emit("removeCartItem", this); // Emit the "removeCartItem" event with the CartItem instance as data
        });

        this.appendChild(template.content.cloneNode(true));
      })
      .catch((error) => {
        console.error("Error loading cart-item template:", error);
      });

    eventBus.on("removeCartItem", (cartItem) => {
      if (cartItem === this) {
        this.removeCartItem();
      }
    });
  }

  removeCartItem() {
    console.log("Removing cart item...");
    this.deleteButton.removeEventListener("click", () => {
      eventBus.emit("removeCartItem", this);
    });
    this.remove();
  }
}

window.customElements.define("cart-item", CartItem);
