import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Page {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  date!: Date;

  @Column()
  slug!: string;

  @Column()
  title!: string;

  @Column()
  thumbnail!: string;

  @Column()
  content!: string;
}
