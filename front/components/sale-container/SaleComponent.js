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

      const gameCardElements = Array.from(this.querySelectorAll("game-card"));
      const fetchPromises = gameCardElements.map((gameCardElement) => {
        const id = gameCardElement.getAttribute("product-id");
        return this.fetchProductDetails(id).then((productData) => {
          if (productData) {
            this.updateGameCard(gameCardElement, productData);
          } else {
            console.error(`Error fetching product details for ID: ${id}`);
          }
        });
      });
      await Promise.all(fetchPromises);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async fetchProductDetails(id) {
    try {
      const productData = await getSingleProducts(id);
      if (
        productData &&
        productData.ProductName &&
        productData.Price &&
        productData.ImageURL
      ) {
        return {
          name: productData.ProductName,
          price: productData.Price,
          image: productData.ImageURL,
        };
      } else {
        console.error(
          `Product data is missing required properties for ID ${id}:`,
          productData
        );
        return null;
      }
    } catch (error) {
      console.error(`Error fetching product details for ID ${id}:`, error);
      throw error; // Rethrow the error to be caught by the caller
    }
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
