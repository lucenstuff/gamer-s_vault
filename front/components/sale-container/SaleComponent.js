class SaleComponent extends HTMLElement {
  async connectedCallback() {
    try {
      const response = await fetch(
        "components/sale-container/sale-component.html"
      );
      const content = await response.text();
      this.innerHTML = content;

      const gameCardElement = this.querySelector("game-card");
      const id = gameCardElement.getAttribute("product-id");

      const productData = await this.fetchProductDetails(id);

      this.updateGameCard(gameCardElement, productData);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async fetchProductDetails(id) {
    try {
      const productData = await getSingleProducts(id);
      return {
        name: productData.name,
        price: productData.price,
        image: productData.image,
      };
    } catch (error) {
      console.error(error);
      console.log("todomal");
      return null;
    }
  }

  updateGameCard(gameCardElement, { name, price, image }) {
    gameCardElement.setAttribute("name", name);
    gameCardElement.setAttribute("price", price);
    gameCardElement.setAttribute("image", image);
  }
}

window.customElements.define("sale-component", SaleComponent);
