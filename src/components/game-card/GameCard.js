class GameCard extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    fetch('src/components/game-card/game-card.html')
      .then(response => response.text())
      .then(content => {
        this.innerHTML = content;
      })
      .catch(error => {
        console.error('Error al cargar el archivo HTML:', error);
      });
  }
}

window.customElements.define('game-card', GameCard);
