const mp = new MercadoPago("TEST-a07fbe27-6846-4747-a4b6-dae6a740987f", {
  locale: "es-AR",
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
