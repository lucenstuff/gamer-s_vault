class SaleComponent extends HTMLElement {
  connectedCallback() {
    this.fetchAndRenderComponent();
  }

  async fetchAndRenderComponent() {
    try {
      const response = await fetch(
        "components/sale-container/sale-component.html"
      );
      const content = await response.text();
      this.innerHTML = content;

      const gameCardElements = this.querySelectorAll("game-card");

      Array.from(gameCardElements).forEach((gameCardElement) => {
        const id = gameCardElement.getAttribute("product-id");
        this.fetchProductDetails(id)
          .then((productData) => {
            if (productData) {
              this.updateGameCard(gameCardElement, productData);
            } else {
              console.error(`Error fetching product details for ID: ${id}`);
            }
          })
          .catch((error) =>
            console.error(`Error fetching product details:`, error)
          );
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  fetchProductDetails(id) {
    return new Promise((resolve, reject) => {
      getSingleProducts(id)
        .then((productData) => {
          if (
            productData &&
            productData.name &&
            productData.price &&
            productData.image
          ) {
            resolve({
              name: productData.name,
              price: productData.price,
              image: productData.image,
            });
          } else {
            resolve(null); // Resolve with null if the product details are invalid
          }
        })
        .catch((error) => reject(error));
    });
  }

  updateGameCard(gameCardElement, { name, price, image }) {
    if (name && price && image) {
      gameCardElement.setAttribute("name", name);
      gameCardElement.setAttribute("price", price);
      gameCardElement.setAttribute("image", image);
    } else {
      console.error("Error updating game card: Invalid product details");
    }
  }
}

window.customElements.define("sale-component", SaleComponent);
