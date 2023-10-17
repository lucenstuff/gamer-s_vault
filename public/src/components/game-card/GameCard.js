class GameCard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Fetch and render data for each game-card based on the provided data-product-id attribute
    const productId = this.getAttribute('data-product-id');
    if (productId) {
      this.fetchAndRenderGameData(productId);
      this.loadGameCardCSS(); // Load the CSS for the game card
    }
  }

  fetchAndRenderGameData(productId) {
    // Fetch data from your /getGameData endpoint on your server
    fetch('/getGameData')
      .then(response => response.json())
      .then(gameData => {
        // Filter the game data based on the product ID
        const productData = gameData.find(product => product.ProductID === parseInt(productId));

        if (productData) {
          this.renderGameCard(productData);
        } else {
          console.error(`Product with ID ${productId} not found.`);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  renderGameCard(data) {
    // Create a product card element
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    // Create an image element
    const image = document.createElement('img');
    image.src = data.ImageURL;
    image.alt = data.ProductName;

    // Create an element for product title
    const title = document.createElement('h3');
    title.textContent = data.ProductName;

    // Create an element for product price
    const price = document.createElement('p');
    price.textContent = `$${data.Price}`;

    // Create a div for card buttons
    const cardButtons = document.createElement('div');
    cardButtons.classList.add('card-buttons');

    // Create a favorite button
    const favoriteButton = document.createElement('a');
    favoriteButton.href = '#';
    favoriteButton.innerHTML = '<i class="material-icons heart">favorite</i>';

    // Create a cart button
    const cartButton = document.createElement('a');
    cartButton.href = '#';
    cartButton.innerHTML = '<i class="material-icons cart">shopping_cart</i>';

    // Append elements to the product card
    productCard.appendChild(image);
    productCard.appendChild(title);
    productCard.appendChild(price);
    cardButtons.appendChild(favoriteButton);
    cardButtons.appendChild(cartButton);
    productCard.appendChild(cardButtons);

    // Append the product card to the custom element (game-card)
    this.appendChild(productCard);
  }

  loadGameCardCSS() {
    // Create a link element for the CSS file
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'src/components/game-card/gameCard.css';

    // Append the link element to the document's head
    document.head.appendChild(linkElement);
  }
}

window.customElements.define('game-card', GameCard);
