class ShoppingCart extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    fetch('src/components/shopping-cart/shopping-cart.html')
      .then(response => response.text())
      .then(content => {
        this.innerHTML = content;
        
        const closeBtn = this.querySelector('.close-btn');
        const cartPanel = this.querySelector('.cart-panel');

        closeBtn.addEventListener('click', () => {
          this.toggleCart();
        })

      })
      .catch(error => {
        console.error('Error al cargar el archivo HTML:', error);
      });
  }
  toggleCart(){
    const cartPanel = this.querySelector('.cart-panel');
    cartPanel.classList.toggle("active")
  }
}

window.customElements.define('shopping-cart', ShoppingCart);
