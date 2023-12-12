import express from "express";
import cartsRouter from "./routes/carts.routes.js";
import productRouter from "./routes/product.routes.js";

const PORT = 8080;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Product Manager</h1>");
});

app.use("/api/carts", cartsRouter);
app.use("/api/products", productRouter);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
