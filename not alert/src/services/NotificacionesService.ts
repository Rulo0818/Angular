import { AppDataSource } from "../config/data-source";
import { Notificacion } from "../entities/Notificacion";

const notificacionRepository = AppDataSource.getRepository(Notificacion);

export class NotificacionesService {
    async getAll(): Promise<Notificacion[]> {
        return await notificacionRepository.find();
    }

    async getById(id_notificacion: number): Promise<Notificacion | null> {
        return await notificacionRepository.findOneBy({ id_notificacion });
    }

    async create(data: Partial<Notificacion>): Promise<Notificacion> {
        const nueva = notificacionRepository.create(data);
        return await notificacionRepository.save(nueva);
    }

    async update(id_notificacion: number, data: Partial<Notificacion>): Promise<Notificacion | null> {
        const existente = await notificacionRepository.findOneBy({ id_notificacion });
        if (!existente) {
            return null;
        }
        notificacionRepository.merge(existente, data);
        return await notificacionRepository.save(existente);
    }

    async delete(id_notificacion: number): Promise<boolean> {
        const result = await notificacionRepository.delete(id_notificacion);
        return result.affected !== 0;
    }
}

