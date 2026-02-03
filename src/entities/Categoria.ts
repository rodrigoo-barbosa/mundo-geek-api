import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Produto } from "./Produto.js";

@Entity("categoria")
export class Categoria {

    @PrimaryGeneratedColumn("uuid")
    declare id: string;

    @Column({ type: "varchar", length: 100, nullable: false, unique: true })
    declare nome: string;

    @Column({ type: "text", nullable: true })
    declare descricao: string | null;

    @CreateDateColumn({ type: "timestamp" })
    declare dataCriacao: Date;

    @UpdateDateColumn({ type: "timestamp" })
    declare dataAtualizacao: Date;

    @OneToMany(() => Produto, (produto) => produto.categoria, { cascade: true })
    declare produtos: Produto[];
}