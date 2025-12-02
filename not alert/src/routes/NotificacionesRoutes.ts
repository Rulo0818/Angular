import { Router } from "express";
import { NotificacionesController } from "../controllers/NotificacionesController";

const router = Router();
const controller = new NotificacionesController();

router.get("/", controller.getAllNotificaciones.bind(controller));
router.get("/:id", controller.getNotificacionById.bind(controller));
router.post("/", controller.createNotificacion.bind(controller));
router.put("/:id", controller.updateNotificacion.bind(controller));
router.delete("/:id", controller.deleteNotificacion.bind(controller));

export default router;

