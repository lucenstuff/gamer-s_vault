function waitForElement(selector) {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(checkInterval);
        resolve(element);
      }
    }, 100);
  });
}

Promise.all([
  waitForElement(".login-button"),
  waitForElement(".login-form-container"),
]).then((elements) => {
  const login = elements[0];
  const form = elements[1];

  login.addEventListener("click", () => {
    form.classList.toggle("active");
  });
});

Promise.all([
  waitForElement(".shopping-cart"),
  waitForElement(".cart-panel"),
]).then((elements) => {
  const cartButton = elements[0];
  const cartPanel = elements[1];

  cartButton.addEventListener("click", () => {
    cartPanel.classList.toggle("active");
  });
});

Promise.all([
  waitForElement(".to-register"),
  waitForElement(".register-form-container"),
]).then((elements) => {
  const loginRegister = elements[0];
  const registerForm = elements[1];

  loginRegister.addEventListener("click", () => {
    registerForm.classList.toggle("active");
  });
});

Promise.all([
  waitForElement(".to-register"),
  waitForElement(".login-form-container"),
]).then((elements) => {
  const loginRegister = elements[0];
  const loginForm = elements[1];

  loginRegister.addEventListener("click", () => {
    loginForm.classList.toggle("active");
  });
});

Promise.all([
  waitForElement(".to-login"),
  waitForElement(".login-form-container"),
]).then((elements) => {
  const tologin = elements[0];
  const loginForm = elements[1];

  tologin.addEventListener("click", () => {
    loginForm.classList.toggle("active");
  });
});

Promise.all([
  waitForElement(".to-login"),
  waitForElement(".register-form-container"),
]).then((elements) => {
  const tologin = elements[0];
  const registerForm = elements[1];

  tologin.addEventListener("click", () => {
    registerForm.classList.toggle("active");
  });
});

Promise.all([
  waitForElement(".login-button"),
  waitForElement(".register-form-container"),
]).then((elements) => {
  const login = elements[0];
  const form = elements[1];

  login.addEventListener("click", () => {
    form.classList.remove("active");
  });
});
