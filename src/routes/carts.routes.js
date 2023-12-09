import { Router } from "express";

const cartsRouter = Router();
const carts = [];
let cartIdCounter = 1;

cartsRouter.get("/", (req, res) => {
  res.send(carts);
});

cartsRouter.post("/", (req, res) => {
  const newCart = {
    id: cartIdCounter++,
    products: [],
  };

  carts.push(newCart);

  res.status(201).send(newCart);
});

cartsRouter.get("/:cid", (req, res) => {
  const cartId = parseInt(req.params.cid);

  const cart = carts.find((c) => c.id === cartId);

  if (cart) {
    res.send(cart.products);
  } else {
    res.status(404).send("Carrito no encontrado");
  }
});

cartsRouter.post("/:cid/product/:pid", (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const { quantity = 1 } = req.body;

  const cart = carts.find((c) => c.id === cartId);

  if (cart) {
    const existingProductIndex = cart.products.findIndex(
      (p) => p.product === productId
    );

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    res.status(201).send(cart.products);
  } else {
    res.status(404).send("Carrito no encontrado");
  }
});

export default cartsRouter;
