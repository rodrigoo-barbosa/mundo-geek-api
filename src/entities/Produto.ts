import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Categoria } from "./Categoria.js";

@Entity("produto")
export class Produto {

    @PrimaryGeneratedColumn("uuid")
    declare id: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    declare nome: string;

    @Column({ type: "text", nullable: true })
    declare descricao: string | null;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    declare preco: number;

    @Column({ type: "int", nullable: false, default: 0 })
    declare estoque: number;

    @CreateDateColumn({ type: "timestamp" })
    declare dataCriacao: Date;

    @UpdateDateColumn({ type: "timestamp" })
    declare dataAtualizacao: Date;

    @ManyToOne(() => Categoria, (categoria) => categoria.produtos, { nullable: false })
    @JoinColumn({ name: "categoriaId" })
    declare categoria: Categoria;
}