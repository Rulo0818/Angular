import { Request, Response } from "express";
import { AlertasService } from "../services/AlertasService";
import { Alerta } from "../entities/Alerta";

const service = new AlertasService();

export class AlertasController {
    async getAllalertas(req: Request, res: Response): Promise<void> {
        try {
            const data = await service.getAllalertas();
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al obtener alertas",
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    async getById_alerta(req: Request, res: Response): Promise<void> {
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

            const alerta = await service.getById_alerta(id);
            if (!alerta) {
                res.status(404).json({ success: false, message: "Alerta no encontrada" });
                return;
            }

            res.status(200).json({ success: true, data: alerta });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al obtener alerta",
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    async getByProducto(req: Request, res: Response): Promise<void> {
        try {
            const idProductoParam = req.params.id_producto;
            if (!idProductoParam) {
                res.status(400).json({ success: false, message: "ID de producto inválido" });
                return;
            }

            const id_producto = parseInt(idProductoParam, 10);
            if (isNaN(id_producto)) {
                res.status(400).json({ success: false, message: "ID de producto inválido" });
                return;
            }

            const alertas = await service.getByProducto(id_producto);
            res.status(200).json({ success: true, data: alertas });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al obtener alertas del producto",
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    async createalerta(req: Request, res: Response): Promise<void> {
        try {
            const { id_producto, stock_minimo, stock_maximo, notificar } = req.body;
            
            if (!id_producto || stock_minimo === undefined || stock_maximo === undefined) {
                res.status(400).json({
                    success: false,
                    message: "Los campos id_producto, stock_minimo y stock_maximo son obligatorios"
                });
                return;
            }

            if (stock_minimo < 0 || stock_maximo < 0) {
                res.status(400).json({
                    success: false,
                    message: "Los valores de stock no pueden ser negativos"
                });
                return;
            }

            if (stock_minimo > stock_maximo) {
                res.status(400).json({
                    success: false,
                    message: "El stock mínimo no puede ser mayor que el stock máximo"
                });
                return;
            }

            const data: Partial<Alerta> = {
                id_producto: parseInt(id_producto, 10),
                stock_minimo: parseFloat(stock_minimo),
                stock_maximo: parseFloat(stock_maximo)
            };
            
            if (notificar !== undefined) {
                data.notificar = Boolean(notificar);
            }

            const nueva = await service.createalerta(data);
            res.status(201).json({
                success: true,
                message: "Alerta creada exitosamente",
                data: nueva
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al crear alerta",
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
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

            const { id_producto, stock_minimo, stock_maximo, notificar } = req.body;

            if (stock_minimo !== undefined && stock_minimo < 0) {
                res.status(400).json({
                    success: false,
                    message: "El stock mínimo no puede ser negativo"
                });
                return;
            }

            if (stock_maximo !== undefined && stock_maximo < 0) {
                res.status(400).json({
                    success: false,
                    message: "El stock máximo no puede ser negativo"
                });
                return;
            }

            const data: Partial<Alerta> = {};
            if (id_producto !== undefined) data.id_producto = parseInt(id_producto, 10);
            if (stock_minimo !== undefined) data.stock_minimo = parseFloat(stock_minimo);
            if (stock_maximo !== undefined) data.stock_maximo = parseFloat(stock_maximo);
            if (notificar !== undefined) data.notificar = Boolean(notificar);

            // Validar que stock_minimo no sea mayor que stock_maximo
            if (data.stock_minimo !== undefined && data.stock_maximo !== undefined) {
                if (data.stock_minimo > data.stock_maximo) {
                    res.status(400).json({
                        success: false,
                        message: "El stock mínimo no puede ser mayor que el stock máximo"
                    });
                    return;
                }
            }

            const actualizada = await service.update(id, data);
            if (!actualizada) {
                res.status(404).json({ success: false, message: "Alerta no encontrada" });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Alerta actualizada exitosamente",
                data: actualizada
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al actualizar alerta",
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
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

            const eliminada = await service.delete(id);
            if (!eliminada) {
                res.status(404).json({ success: false, message: "Alerta no encontrada" });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Alerta eliminada exitosamente"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error al eliminar alerta",
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }
}

