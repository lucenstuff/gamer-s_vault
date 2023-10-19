// game-card.js
class GameCard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const productId = this.getAttribute("data-product-id");
    if (productId) {
      this.fetchAndRenderGameData(productId);
    }
  }

  fetchAndRenderGameData(productId) {
    fetch("/getGameData")
      .then((response) => response.json())
      .then((gameData) => {
        const productData = gameData.find(
          (product) => product.ProductID === parseInt(productId)
        );

        if (productData) {
          this.renderGameCard(productData);
        } else {
          console.error(`Product with ID ${productId} not found.`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  renderGameCard(data) {
    fetch("src/components/game-card/game-card.html")
      .then((response) => response.text())
      .then((html) => {
        const template = document.createElement("template");
        template.innerHTML = html.trim();
        const content = template.content.cloneNode(true);
        const image = content.querySelector(".product-card img");
        const title = content.querySelector(".product-card h3");
        const price = content.querySelector(".product-card .price");

        image.src = data.ImageURL;
        image.alt = data.ProductName;
        title.textContent = data.ProductName;
        price.textContent = `$${data.Price}`;

        this.appendChild(content);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

window.customElements.define("game-card", GameCard);
