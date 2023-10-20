class LoginComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    fetch("src/components/login-component/login-component.html")
      .then((response) => response.text())
      .then((content) => {
        this.innerHTML = content;
      })
      .catch((error) => {
        console.error("Error fetching login component HTML:", error);
      });
  }
}

customElements.define("login-component", LoginComponent);
