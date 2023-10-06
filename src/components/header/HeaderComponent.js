class HeaderComponent extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    fetch('src/components/header/header-component.html')
      .then(response => response.text())
      .then(content => {
        this.innerHTML = content;

        const burgerMenu = this.querySelector(".burger-menu");

        burgerMenu.addEventListener("click", () => {
          this.toggleMenu();
        });
      })
      .catch(error => {
        console.error('Error al cargar el archivo HTML:', error);
      });
  }

  toggleMenu() {
    const navMenu = this.querySelector(".nav-links");

    navMenu.classList.toggle("active");

    const burgerMenuIcon = this.querySelector(".burger-menu");
    burgerMenuIcon.classList.toggle("active");
  }
}

window.customElements.define('header-component', HeaderComponent);
