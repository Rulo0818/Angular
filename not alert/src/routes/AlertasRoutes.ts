import { Router } from "express";
import { AlertasController } from "../controllers/AlertasController";

const router = Router();
const controller = new AlertasController();

router.get("/", controller.getAllalertas.bind(controller));
router.get("/producto/:id_producto", controller.getByProducto.bind(controller));
router.get("/:id", controller.getById_alerta.bind(controller));
router.post("/", controller.createalerta.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

export default router;

