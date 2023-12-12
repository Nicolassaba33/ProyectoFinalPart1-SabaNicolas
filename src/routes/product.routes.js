import { Router } from "express";
import ProductManager from "../ProductManager.js";

const productManager = new ProductManager("./products.json");
const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const { limit } = req.query;
    if (!limit) {
      return res.json(products);
    }
    const productsLimited = products.slice(0, +limit);
    res.json(productsLimited);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).send("Internal Server Error");
  }
});

productRouter.get("/:pid", async (req, res) => {
  const productId = req.params.pid;
  try {
    const product = await productManager.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).send("Product not found.");
    }
  } catch (error) {
    console.error("Error getting product by ID:", error);
    res.status(500).send("Internal Server Error");
  }
});

productRouter.post("/", async (req, res) => {
  try {
    // ... (existing code for adding a product)
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send("Internal Server Error");
  }
});

productRouter.put("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedProductData = req.body;
  try {
    const updatedProduct = await productManager.updateProduct(productId, updatedProductData);
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(404).send("Product not found");
  }
});

productRouter.delete("/:pid", async (req, res) => {
  const productId = req.params.pid;
  try {
    const productDeleted = await productManager.deleteProduct(productId);
    if (!productDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default productRouter;