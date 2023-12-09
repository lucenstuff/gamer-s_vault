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
  }

  connectedCallback() {
    fetch("components/game-card/game-card.html")
      .then((response) => response.text())
      .then((content) => {
        const parser = new DOMParser();
        const html = parser.parseFromString(content, "text/html");

        const titleElement = html.querySelector("[data-name='title']");
        const priceElement = html.querySelector("[data-price='price']");
        const imageElement = html.querySelector(".product-card img");

        titleElement.textContent = this.getAttribute("name");
        priceElement.textContent = this.getAttribute("price");
        imageElement.setAttribute("src", this.getAttribute("image"));

        // Append the fetched HTML content to the component
        this.appendChild(html.head);
        this.appendChild(html.body.firstChild);
      })
      .catch((error) => {
        console.error("Error loading HTML file:", error);
      });
  }
}

window.customElements.define("game-card", GameCard);
