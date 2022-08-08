import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, primary: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ default: true })
  isActive: boolean;
}
