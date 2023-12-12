// carts.routes.js

import { Router } from "express";
import CartManager from "../CartManager.js";

const cartManager = new CartManager("./Cart.json");
const cartsRouter = Router();

cartsRouter.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.json(carts);
  } catch (error) {
    console.error("Error getting carts:", error);
    res.status(500).send("Internal Server Error");
  }
});

cartsRouter.post("/", async (req, res) => {
  try {
    const cartAdded = await cartManager.addCart();
    if (!cartAdded) {
      return res.status(400).json({ message: "Error: cart not added" });
    }
    res.json({ message: "Cart added" });
  } catch (error) {
    console.error("Error adding cart:", error);
    res.status(500).send("Internal Server Error");
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cartById = await cartManager.getCartById(cartId);
    if (!cartById) {
      res.status(404).json({ message: "Cart not found" });
    }
    res.json(cartById);
  } catch (error) {
    console.error("Error getting cart by ID:", error);
    res.status(500).send("Internal Server Error");
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  try {
    const productAddedToCart = await cartManager.addProductToCart(productId, cartId);

    if (!productAddedToCart) {
      return res.status(400).json({ message: "Error: product not added to cart" });
    }
    res.json({ message: "Product added to cart" });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default cartsRouter;