const mp = new MercadoPago("TEST-a07fbe27-6846-4747-a4b6-dae6a740987f", {
  locale: "es-AR",
});

document.getElementById("checkout_btn").addEventListener("click", async () => {
  console.log("checkout_button");
  const orderData = {
    title: "Test",
    quantity: 1,
    price: 100,
  };

  try {
    const result = await fetch("http://localhost:8080/api/create_preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!result.ok) {
      throw new Error("Failed to create preference");
    }

    const preference = await result.json();
    createCheckoutButton(preference.id);
  } catch (error) {
    console.error(error);
  }
});

const createCheckoutButton = (preferenceId) => {
  const bricksBuilder = mp.bricks();

  if (window.checkoutButton) {
    window.checkoutButton.unmount();
  } else {
    const renderComponent = () => {
      bricksBuilder.create("wallet", "wallet__container", {
        initialization: {
          preferenceId: preferenceId,
        },
      });
    };
    renderComponent();
  }
};
