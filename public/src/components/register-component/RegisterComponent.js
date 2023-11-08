class RegisterComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    fetch("src/components/register-component/register-component.html")
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
        const nameInput = registerForm.querySelector("#firstName");
        const lastNameInput = registerForm.querySelector("#lastName");
        const emailInput = registerForm.querySelector("#email");
        const passwordInput = registerForm.querySelector("#password");
        const repasswordInput = registerForm.querySelector("#repassword");
        const firstName = nameInput.value;
        const lastName = lastNameInput.value;
        const username = usernameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const repassword = repasswordInput.value;

        if (password !== repassword) {
          alert("Las contraseñas no coinciden");
          return;
        }

        if (password.length < 8) {
          alert("La contraseña debe tener al menos 8 caracteres");
          return;
        }

        if (username.length < 3) {
          alert("El nombre de usuario debe tener al menos 3 caracteres");
          return;
        }

        nameInput.value = "";
        lastNameInput.value = "";
        usernameInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";
        repasswordInput.value = "";

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

window.customElements.define("register-component", RegisterComponent);
