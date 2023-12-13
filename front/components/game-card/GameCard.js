class GameCard extends HTMLElement {
  constructor() {
    super();
    this.name;
    this.price;
    this.image;
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
    this.addEventListener("click", this.handleAddToCart.bind(this));
    this.addEventListener("click", this.handleAddToFavorites.bind(this));
  }

  handleAddToCart(event) {
    const target = event.target;
    if (target.classList.contains("cart")) {
      this.addToCart();
    }
  }

  handleAddToFavorites(event) {
    const target = event.target;
    if (target.classList.contains("heart")) {
      this.addToFavorites();
    }
  }

  addToFavorites() {
    //Implement Favorites Logic
    console.log("Product added to favorites:", this.name);
  }

  addToCart() {
    //Implement Cart Logic
    console.log("Product added to cart:", this.name);
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
      })
      .catch((error) => {
        console.error("Error loading HTML file:", error);
      });
  }
}

window.customElements.define("game-card", GameCard);
