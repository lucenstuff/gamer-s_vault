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

  Promise.all([waitForElement('.login-button'), waitForElement('.form')]).then((elements) => {
    const login = elements[0];
    const form = elements[1];

    login.addEventListener('click', () => {
      form.classList.toggle("active");
      console.log("sexo")
    });

  });