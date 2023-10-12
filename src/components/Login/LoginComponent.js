

class LoginComponent extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    fetch("src/components/Login/login-component.html")
      .then((response) => response.text())
      .then((content) => {
        this.innerHTML = content;
      })
      .catch((error) => {
        console.error("Error al cargar el archivo HTML:", error);
      });
  }
}



window.customElements.define("login-component", LoginComponent);

