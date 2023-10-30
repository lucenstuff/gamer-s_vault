class GameCard extends HTMLElement {
  constructor() {
    super();
    this.template = null;
    this.dataLoaded = false;
  }

  connectedCallback() {
    // Load the static template immediately
    this.loadStaticTemplate();

    const productId = this.getAttribute("data-product-id");

    if (productId) {
      // Fetch all game data, and update all instances once the data is available
      this.fetchAllGameData()
        .then((gameData) => {
          this.dataLoaded = true;
          this.updateAllGameCards(gameData);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  async loadStaticTemplate() {
    if (!this.template) {
      try {
        const response = await fetch("src/components/game-card/game-card.html");
        this.template = await response.text();
        this.renderGameCard(); // Render the static template
      } catch (error) {
        console.error(error);
      }
    }
  }

  async fetchAllGameData() {
    try {
      const response = await fetch("/getGameData");
      const gameData = await response.json();
      return gameData;
    } catch (error) {
      throw error;
    }
  }

  updateAllGameCards(gameData) {
    if (this.dataLoaded) {
      const allCards = document.querySelectorAll("game-card");

      allCards.forEach((card) => {
        const productId = card.getAttribute("data-product-id");
        if (productId) {
          const productData = gameData.find(
            (product) => product.ProductID === parseInt(productId)
          );
          if (productData) {
            card.updateGameCard(productData);
          } else {
            console.error(`Product with ID ${productId} not found.`);
          }
        }
      });
    }
  }

  updateGameCard(data) {
    const image = this.querySelector(".product-card img");
    const title = this.querySelector(".product-card h3");
    const price = this.querySelector(".product-card .price");

    if (image && title && price) {
      image.src = data.ImageURL;
      image.alt = data.ProductName;
      title.textContent = data.ProductName;
      price.textContent = `$${data.Price}`;
    }
  }

  renderGameCard() {
    const template = document.createElement("template");
    template.innerHTML = this.template.trim();
    const content = template.content.cloneNode(true);
    this.appendChild(content);
  }
}

window.customElements.define("game-card", GameCard);
