async function getProducts() {
  try {
    const response = await fetch("http://localhost:8080/api/products");
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Error: " + response.status);
    }
  } catch (error) {
    console.error(error);
  }
}

async function getSingleProducts(id) {
  try {
    const response = await fetch(`http://localhost:8080/api/products/${id}`);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data[0];
      } else {
        return data;
      }
    } else {
      throw new Error("Error: " + response.status);
    }
  } catch (error) {
    console.error(error);
  }
}

async function userRegister(username, email, password, firstName, lastName) {
  try {
    const response = await fetch("http://localhost:8080/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        firstName,
        lastName,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Error: " + response.status);
    }
  } catch (error) {
    console.error("Register failed:", error);
  }
}

async function authenticateUser(email, password) {
  try {
    const response = await fetch("http://localhost:8080/api/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      if (response.status === 401) {
      } else {
      }
    }
  } catch (error) {
    console.error(error);

    // Show a generic error message to the user
    alert("Authentication failed. Please try again.");
  }
}
