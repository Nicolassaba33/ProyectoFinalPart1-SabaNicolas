import express from "express";
import productRouter from "./routes/product.routes.js";
import cartsRouter from "./routes/carts.routes.js";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});