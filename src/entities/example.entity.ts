import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("admin")
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  example: string;
}
