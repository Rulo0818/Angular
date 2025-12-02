import { Request, Response } from "express";
import { NotificacionesService } from "../services/NotificacionesService";
import { Notificacion, NotificacionTipo } from "../entities/Notificacion";

const notificacionesService = new NotificacionesService();

const TIPOS_VALIDOS: NotificacionTipo[] = ["info", "alerta", "error"];

export class NotificacionesController {
    async getAllNotificaciones(req: Request, res: Response): Promise<void> {
        try {
            const data = await notificacionesService.getAll();
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al obtener notificaciones",
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    async getNotificacionById(req: Request, res: Response): Promise<void> {
        try {
            const idParam = req.params.id;
            if (!idParam) {
                res.status(400).json({ success: false, message: "ID inválido" });
                return;
            }

            const id = parseInt(idParam, 10);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: "ID inválido" });
                return;
            }

            const notificacion = await notificacionesService.getById(id);
            if (!notificacion) {
                res.status(404).json({ success: false, message: "Notificación no encontrada" });
                return;
            }

            res.status(200).json({ success: true, data: notificacion });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al obtener notificación",
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    async createNotificacion(req: Request, res: Response): Promise<void> {
        try {
            const { titulo, mensaje, tipo, fecha, leido } = req.body;
            if (!titulo || !mensaje) {
                res.status(400).json({
                    success: false,
                    message: "Los campos titulo y mensaje son obligatorios"
                });
                return;
            }

            if (tipo && !TIPOS_VALIDOS.includes(tipo)) {
                res.status(400).json({
                    success: false,
                    message: `El tipo debe ser uno de: ${TIPOS_VALIDOS.join(", ")}`
                });
                return;
            }

            const data: Partial<Notificacion> = { titulo, mensaje };
            if (tipo !== undefined) data.tipo = tipo;
            if (fecha !== undefined) data.fecha = new Date(fecha);
            if (leido !== undefined) data.leido = leido;

            const nueva = await notificacionesService.create(data);
            res.status(201).json({
                success: true,
                message: "Notificación creada exitosamente",
                data: nueva
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al crear notificación",
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    async updateNotificacion(req: Request, res: Response): Promise<void> {
        try {
            const idParam = req.params.id;
            if (!idParam) {
                res.status(400).json({ success: false, message: "ID inválido" });
                return;
            }

            const id = parseInt(idParam, 10);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: "ID inválido" });
                return;
            }

            const { titulo, mensaje, tipo, fecha, leido } = req.body;
            if (tipo && !TIPOS_VALIDOS.includes(tipo)) {
                res.status(400).json({
                    success: false,
                    message: `El tipo debe ser uno de: ${TIPOS_VALIDOS.join(", ")}`
                });
                return;
            }

            const data: Partial<Notificacion> = {};
            if (titulo !== undefined) data.titulo = titulo;
            if (mensaje !== undefined) data.mensaje = mensaje;
            if (tipo !== undefined) data.tipo = tipo;
            if (fecha !== undefined) data.fecha = new Date(fecha);
            if (leido !== undefined) data.leido = leido;

            const actualizada = await notificacionesService.update(id, data);
            if (!actualizada) {
                res.status(404).json({ success: false, message: "Notificación no encontrada" });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Notificación actualizada exitosamente",
                data: actualizada
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al actualizar notificación",
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    async deleteNotificacion(req: Request, res: Response): Promise<void> {
        try {
            const idParam = req.params.id;
            if (!idParam) {
                res.status(400).json({ success: false, message: "ID inválido" });
                return;
            }

            const id = parseInt(idParam, 10);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: "ID inválido" });
                return;
            }

            const eliminada = await notificacionesService.delete(id);
            if (!eliminada) {
                res.status(404).json({ success: false, message: "Notificación no encontrada" });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Notificación eliminada exitosamente"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al eliminar notificación",
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }
}

