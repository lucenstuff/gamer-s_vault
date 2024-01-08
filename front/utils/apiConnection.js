// const apiUrl = "http://localhost:8080/api";
const apiUrl = "https://gamersvaultbackend.onrender.com/api";

async function getProducts() {
  try {
    const response = await fetch(`${apiUrl}/products`);
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
    const response = await fetch(`${apiUrl}/products/${id}`);
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

async function userRegister(
  username,
  email,
  password,
  firstName,
  lastName,
  callback
) {
  try {
    const response = await fetch(`${apiUrl}/authenticate`, {
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
      if (callback) {
        callback(null, data);
      }
      return data;
    } else {
      throw new Error("Error: " + response.status);
    }
  } catch (error) {
    console.error("Register failed:", error);
    if (callback) {
      callback(error, null);
    }
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
