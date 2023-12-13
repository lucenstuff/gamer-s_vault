class GameCard extends HTMLElement {
  constructor() {
    super();
    this.name;
    this.price;
    this.image;
    this.isInCart = false;
  }

  static get observedAttributes() {
    return ["name", "price", "image"];
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    switch (attributeName) {
      case "name":
        this.name = newValue;
        break;
      case "price":
        this.price = newValue;
        break;
      case "image":
        this.image = newValue;
        break;
    }

    if (this.name && this.price && this.image) {
      this.render();
    }
  }

  connectedCallback() {
    this.addEventListener("click", this.handleIconClick.bind(this));
  }

  renderIcons() {
    const cartIcon = this.isInCart
      ? "remove_shopping_cart"
      : "add_shopping_cart";

    const cartElement = this.querySelector(".cart");

    cartElement.textContent = cartIcon;
  }

  render() {
    fetch("components/game-card/game-card.html")
      .then((response) => response.text())
      .then((content) => {
        const template = document.createElement("template");
        template.innerHTML = content;

        const titleElement = template.content.querySelector(
          "[data-name='title']"
        );
        const priceElement = template.content.querySelector(
          "[data-price='price']"
        );
        const imageElement =
          template.content.querySelector(".product-card img");

        titleElement.textContent = this.name;
        priceElement.textContent = "$" + this.price;
        imageElement.setAttribute("src", this.image);

        this.appendChild(template.content.cloneNode(true));

        this.renderIcons();
      })
      .catch((error) => {
        console.error("Error loading HTML file:", error);
      });
  }

  handleIconClick(event) {
    const target = event.target;
    if (target.classList.contains("cart")) {
      if (this.isInCart) {
        this.removeFromCart();
      } else {
        this.addToCart();
      }
      this.renderIcons();
    }
  }

  addToCart() {
    this.isInCart = true;
    const cartItem = { name: this.name, price: this.price, image: this.image };
    eventBus.emit("addToCart", cartItem);
  }

  removeFromCart() {
    this.isInCart = false;
    const cartItem = { name: this.name, price: this.price, image: this.image };
    eventBus.emit("removeFromCart", cartItem);
  }
}

window.customElements.define("game-card", GameCard);
