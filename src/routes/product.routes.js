import { Router } from "express";
import { readDataFromFile, writeDataToFile } from "../utils/historial";

const productsFilePath = "../../history/products.json";
const productRouter = Router();
const products = [];
let productIdCounter = 1;

productRouter.get("/", (req, res) => {
  const limit = parseInt(req.query.limit) || products.length;
  const limitedProducts = products.slice(0, limit);
  res.send(limitedProducts);
});

productRouter.get("/products/:pid", (req, res) => {
  const productId = req.params.pid;
  const product = product.find((p) => p.id === productId);

  if (product) {
    res.send(product);
  } else {
    res.status(404).send("Producto no encontrado.");
  }
});

productRouter.post("/", (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails = [],
  } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res
      .status(400)
      .send("Todos los campos obligatorios deben ser proporcionados");
  }

  const id = productIdCounter++;

  const newProduct = {
    id,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };

  products.push(newProduct);
  writeDataToFile(productsFilePath, products);
  res.status(201).send(newProduct);
});

productRouter.put("/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedProductData = req.body;

  const productIndex = product.findIndex((p) => p.id === productId);

  if (productIndex !== -1) {
    products[productIndex] = {
      ...products[productIndex],
      ...updatedProductData,
    };
    writeDataToFile(productsFilePath, products);
    res.send(products[productIndex]);
  } else {
    res.status(404).send("Producto no encontrado");
  }
});

productRouter.delete("/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);

  const updatedProducts = products.filter((p) => p.id !== productId);

  if (updatedProducts.length < products.length) {
    products.length = 0;
    products.push(...updatedProducts);
    writeDataToFile(productsFilePath, products);
    res.send("Producto eliminado correctamente");
  } else {
    res.status(404).send("Producto no encontrado");
  }
});

export default productRouter;
