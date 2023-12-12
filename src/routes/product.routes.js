import { Router } from "express";
import { readDataFromFile, writeDataToFile } from "../utils/historial.js";
import ProductManager from "../ProductManager.js";

const productManager = new ProductManager("../../products.json");
const productsFilePath = "../../history/products.json";
const productRouter = Router();
let productIdCounter = 1;

productRouter.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  const { limit } = req.query;
  if (!limit) {
    return res.send(products);
  }
  const productsLimited = products.slice(0, +limit);
  res.send(productsLimited);
});

productRouter.get("/products/:pid", async (req, res) => {
  const productId = req.params.pid;
  const product = await productManager.getProductById(productId);

  if (product) {
    res.send(product);
  } else {
    res.status(404).send("Producto no encontrado.");
  }
});

productRouter.post("/", async (req, res) => {
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

  const id = await productManager.getId();

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

  await productManager.addProduct(newProduct);
  res.status(201).send(newProduct);
});

productRouter.put("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedProductData = req.body;

  try {
    const updatedProduct = await productManager.updateProduct(
      productId,
      updatedProductData
    );
    res.send(updatedProduct);
  } catch (error) {
    res.status(404).send("Producto no encontrado");
  }
});

productRouter.delete("/:pid", async (req, res) => {
  const { pId } = req.params;
  const productDeleted = await productManager.deleteProduct(pId);
  if (!productDeleted) {
    return res.status(404).send({ message: "product not found" });
  }
  res.send({ message: "product deleted" });
});

export default productRouter;
