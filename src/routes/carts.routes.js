import { Router } from "express";
import CartManager from "../CartManager.js";

const cartManager = new CartManager("./src/Cart.json");

const cartsRouter = Router();
let cartIdCounter = 1;

cartsRouter.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.send(carts);
  } catch (error) {
    res.status(500).send("Error obteniendo carritos");
  }
});

cartsRouter.post("/", async (req, res) => {
  const cartAdded = await cartManager.addCart();
  if (!cartAdded) {
    return res.status(400).send({ message: "error: cart not added" });
  }
  res.send({ message: "Cart added" });
});

cartsRouter.get("/:cid", async (req, res) => {
  const { cId } = req.params;
  const cartById = await cartManager.getCartById(cId);
  if (!cartById) {
    res.status(404).send({ message: "cart not found" });
  }
  res.send(cartById);
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const productAddedToCart = await cartManager.addProductToCart(
    productId,
    cartId
  );

  if (!productAddedToCart) {
    return res.status(400).send({ message: "error: product not added" });
  }
  res.send({ message: "product added to cart" });
  // const { quantity = 1 } = req.body;

  // try {
  //   const cart = await cartManager.getCart(cartId);

  //   if (cart) {
  //     const existingProductIndex = cart.products.findIndex(
  //       (p) => p.product === productId
  //     );

  //     if (existingProductIndex !== -1) {
  //       cart.products[existingProductIndex].quantity += quantity;
  //     } else {
  //       cart.products.push({ product: productId, quantity });
  //     }

  //     await cartManager.updateCart(cart);
  //     res.status(201).send(cart.products);
  //   } else {
  //     res.status(404).send("Carrito no encontrado");
  //   }
  // } catch (error) {
  //   res.status(500).send("Error actualizando carrito");
  // }
});

export default cartsRouter;
