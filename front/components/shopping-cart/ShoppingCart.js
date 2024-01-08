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

        // Add a click event listener to the checkout button
        const checkoutBtn = this.querySelector(".checkout-btn");
        if (checkoutBtn) {
          checkoutBtn.addEventListener("click", () => {
            this.initiateMercadoPagoCheckout();
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
  }

  removeFromCart(item) {
    const index = this.cartItems.findIndex(
      (cartItem) => cartItem.name === item.name
    );
    if (index !== -1) {
      this.cartItems.splice(index, 1);
    }
    this.updateCartContent();

    const cartItemElements = this.querySelectorAll("cart-item");
    cartItemElements.forEach((cartItemElement) => {
      if (cartItemElement.name === item.name) {
        cartItemElement.remove();
      }
    });
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

  initiateMercadoPagoCheckout() {
    // Disable the checkout button to prevent multiple clicks
    const checkoutBtn = this.querySelector(".checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
    }

    const orderData = {
      title: "Test",
      quantity: 1,
      price: 100,
    };

    try {
      fetch("http://localhost:8080/api/create_preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })
        .then((result) => {
          if (!result.ok) {
            throw new Error("Failed to create preference");
          }
          return result.json();
        })
        .then((preference) => {
          // Hide the checkout button after successful initiation
          this.hideCheckoutButton();

          // Create the MercadoPago checkout button
          this.createCheckoutButton(preference.id);
        })
        .catch((error) => {
          console.error(error);

          // Re-enable the checkout button in case of an error
          this.enableCheckoutButton();
        });
    } catch (error) {
      console.error(error);
    }
  }

  hideCheckoutButton() {
    const checkoutBtn = this.querySelector(".checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.style.display = "none";
    }
  }

  enableCheckoutButton() {
    const checkoutBtn = this.querySelector(".checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.disabled = false;
    }
  }

  createCheckoutButton(preferenceId) {
    const bricksBuilder = mp.bricks();

    if (window.checkoutButton) {
      window.checkoutButton.unmount();
    } else {
      const renderComponent = () => {
        bricksBuilder.create("wallet", "wallet__container", {
          initialization: {
            preferenceId: preferenceId,
          },
          payment: {
            callback: function (data) {
              console.log("Payment completed:", data);
            },
          },
        });
      };
      renderComponent();
    }
  }
}

window.customElements.define("shopping-cart", ShoppingCart);
