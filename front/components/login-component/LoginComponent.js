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
      loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const username = loginForm.querySelector("#login_username");
        const password = loginForm.querySelector("#login_password");
        this.userLogin(username.value, password.value);

        username.value = "";
        password.value = "";
      });
    } else {
      console.error("Login form not found");
    }
  }

  userLogin(username, password) {
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Login successful");
        } else {
          alert("Invalid username or password");
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  }
}

customElements.define("login-component", LoginComponent);
