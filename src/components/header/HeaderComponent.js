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
        const searchIcon = this.querySelector(".search-toggle");
        
        searchIcon.addEventListener

        searchIcon.addEventListener("click", () => {
          this.toggleSearch();
        });

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
    const burgerMenuIcon = this.querySelector(".burger-menu i")

    navMenu.classList.toggle("active");

    burgerMenuIcon.classList.toggle("active");
    if (navMenu.classList.contains("active")) {
      burgerMenuIcon.textContent = "close";
    } else {
      burgerMenuIcon.textContent = "menu";
    }
  }

  toggleSearch(){
    const searchBar = this.querySelector(".search-bar");
    const navMenu = this.querySelector(".nav-links");
    searchBar.classList.toggle("active");
    navMenu.classList.toggle("active");

}

  

  toggleSearch(){
    if (window.matchMedia("(max-width: 890px)").matches) {
    const hideLogo = this.querySelector(".logo");
    const searchBar = this.querySelector(".search-bar");
    searchBar.classList.toggle("active");
    hideLogo.classList.toggle("active");
  }
  else{
    const searchBar = this.querySelector(".search-bar");
    const navMenu = this.querySelector(".nav-links");
    searchBar.classList.toggle("active");
    navMenu.classList.toggle("active");
  }
}

}


window.customElements.define('header-component', HeaderComponent);

