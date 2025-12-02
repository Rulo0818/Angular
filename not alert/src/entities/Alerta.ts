import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "alertas_stock" })
export class Alerta {
    @PrimaryGeneratedColumn({ name: "id_alerta" })
    id_alerta!: number;

    @Column({ name: "id_producto", type: "int" })
    id_producto!: number;

    @Column({ name: "stock_minimo", type: "decimal", precision: 10, scale: 2 })
    stock_minimo!: number;

    @Column({ name: "stock_maximo", type: "decimal", precision: 10, scale: 2 })
    stock_maximo!: number;

    @Column({ name: "notificar", type: "boolean", default: true })
    notificar!: boolean;
}

