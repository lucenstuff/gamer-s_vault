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
      return {
        name: data.ProductName,
        price: data.Price,
        image: data.ImageURL,
        category: data.Category,
        description: data.Description,
      };
    } else {
      throw new Error("Error: " + response.status);
    }
  } catch (error) {
    console.error(error);
  }
}

async function fetchProducts() {
  try {
    const products = await getProducts();
    products.forEach((product) => {
      const {
        Category: category,
        Description: description,
        ProductId: id,
        ProductName: name,
        Price: price,
        Image: image,
      } = product;
      console.log(product);
    });
  } catch (error) {
    console.error(error);
  }
}
