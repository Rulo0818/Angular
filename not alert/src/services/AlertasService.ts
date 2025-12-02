import { AppDataSource } from "../config/data-source";
import { Alerta } from "../entities/Alerta";

const alertasRepository = AppDataSource.getRepository(Alerta);

export class AlertasService {
    async getAllalertas(): Promise<Alerta[]> {
        return await alertasRepository.find();
    }

    async getById_alerta(id_alerta: number): Promise<Alerta | null> {
        return await alertasRepository.findOneBy({ id_alerta });
    }

    async getByProducto(id_producto: number): Promise<Alerta[]> {
        return await alertasRepository.find({
            where: { id_producto }
        });
    }

    async createalerta(data: Partial<Alerta>): Promise<Alerta> {
        const nueva = alertasRepository.create(data);
        return await alertasRepository.save(nueva);
    }

    async update(id_alerta: number, data: Partial<Alerta>): Promise<Alerta | null> {
        const existente = await alertasRepository.findOneBy({ id_alerta });
        if (!existente) {
            return null;
        }
        alertasRepository.merge(existente, data);
        return await alertasRepository.save(existente);
    }

    async delete(id_alerta: number): Promise<boolean> {
        const result = await alertasRepository.delete(id_alerta);
        return result.affected !== 0;
    }
}

