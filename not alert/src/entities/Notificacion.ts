import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export type NotificacionTipo = "info" | "alerta" | "error";

@Entity({ name: "notificaciones" })
export class Notificacion {
    @PrimaryGeneratedColumn()
    id_notificacion!: number;

    @Column({ length: 150 })
    titulo!: string;

    @Column({ type: "text" })
    mensaje!: string;

    @Column({ type: "enum", enum: ["info", "alerta", "error"], default: "info" })
    tipo!: NotificacionTipo;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    fecha!: Date;

    @Column({ default: false })
    leido!: boolean;
}

