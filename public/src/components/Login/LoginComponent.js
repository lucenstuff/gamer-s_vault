class LoginComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    fetch("src/components/Login/login-component.html")
      .then((response) => response.text())
      .then((content) => {
        this.innerHTML = content;
        this.setupRegisterForm();
      })
      .catch((error) => {
        console.error("Error al cargar el archivo HTML:", error);
      });
  }

  setupRegisterForm() {
    const registerForm = this.querySelector("#register-form");
    if (registerForm) {
      registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const usernameInput = registerForm.querySelector("#username");
        const nameImput = registerForm.querySelector("#firstName");
        const lastNameImput = registerForm.querySelector("#lastName");
        const emailInput = registerForm.querySelector("#email");
        const passwordInput = registerForm.querySelector("#password");
        const repaswwordInput = registerForm.querySelector("#repassword");

        const firstName = nameImput.value;
        const lastName = lastNameImput.value;
        const username = usernameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const repassword = repaswwordInput.value;

        if (password !== repassword) {
          alert("Las contraseñas no coinciden");
          return;
        }

        if (password.length < 8) {
          alert("La contraseña debe tener al menos 8 caracteres");
          return;
        }

        if (username.length < 3) {
          alert("El nombre de usuario debe tener al menos 3 caracteres");
          return;
        }

        nameImput.value = "";
        lastNameImput.value = "";
        usernameInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";
        repaswwordInput.value = "";

        this.addUserToDatabase(username, email, password, firstName, lastName);

        alert("Usuario registrado exitosamente");
      });
    }
  }

  addUserToDatabase(username, email, password, firstName, lastName) {
    fetch("/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        username,
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User added to the database:", data);
      })
      .catch((error) => {
        console.error("Error adding user to the database:", error);
      });
  }
}

window.customElements.define("login-component", LoginComponent);
