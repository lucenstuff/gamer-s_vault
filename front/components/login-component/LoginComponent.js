class LoginComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    fetch("components/login-component/login-component.html")
      .then((response) => response.text())
      .then((content) => {
        this.innerHTML = content;
        this.setupLoginForm();
      })
      .catch((error) => {
        console.error("Error fetching login component HTML:", error);
      });
  }

  setupLoginForm() {
    const loginForm = this.querySelector("#login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = loginForm.querySelector("#login_email");
        const password = loginForm.querySelector("#login_password");

        try {
          const token = await authenticateUser(email.value, password.value);
          //reload the page
          location.reload();
        } catch (error) {
          // console.error("Error during authentication:", error);
        }

        email.value = "";
        password.value = "";
      });
    }
  }
}

customElements.define("login-component", LoginComponent);
