class ShoppingCart extends HTMLElement {
  constructor() {
    super();
    this.cartItems = [];
  }

  connectedCallback() {
    this.render();
  }

  render() {
    fetch("components/shopping-cart/shopping-cart.html")
      .then((response) => response.text())
      .then((content) => {
        this.innerHTML = content;
        const closeBtn = this.querySelector(".close-btn");
        if (closeBtn) {
          closeBtn.addEventListener("click", () => {
            this.toggleCart();
          });
        }

        this.setupEventListeners();
      })
      .catch((error) => {
        console.error("Error loading HTML file:", error);
      });
  }

  setupEventListeners() {
    document.addEventListener("addToCart", (event) => {
      this.addToCart(event.detail);
    });

    eventBus.on("addToCart", (item) => {
      this.addToCart(item);
    });

    eventBus.on("removeFromCart", (item) => {
      this.removeFromCart(item);
    });
  }

  addToCart(item) {
    this.cartItems.push(item);
    this.updateCartContent();
    console.log("addToCart Event:", item);
  }

  removeFromCart(item) {
    const index = this.cartItems.findIndex(
      (cartItem) => cartItem.name === item.name
    );
    if (index !== -1) {
      this.cartItems.splice(index, 1);
    }
    this.updateCartContent();
    console.log("removeFromCart Event:", item);
  }

  updateCartContent() {
    const cartBoxContainer = this.querySelector(".cart-box-container");
    if (cartBoxContainer) {
      cartBoxContainer.innerHTML = "";

      this.cartItems.forEach((item) => {
        const cartBox = document.createElement("cart-item");
        cartBox.name = item.name;
        cartBox.price = item.price;
        cartBox.image = item.image;
        cartBoxContainer.appendChild(cartBox);
      });

      const totalPriceElement = this.querySelector(
        ".price-container h3:last-child"
      );

      // Ensure all item prices are valid numbers before summing
      const totalPrice = this.cartItems
        .map((item) => Number(item.price))
        .filter((price) => !isNaN(price))
        .reduce((sum, price) => sum + price, 0);

      if (!isNaN(totalPrice) && totalPriceElement) {
        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
      } else {
        console.warn("Invalid total price:", totalPrice);
      }
    }
  }

  toggleCart() {
    const cartPanel = this.querySelector(".cart-panel");
    if (cartPanel) {
      cartPanel.classList.toggle("active");
    }
  }
}

window.customElements.define("shopping-cart", ShoppingCart);
