import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from './board';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false, unique: true })
  email: string;

  @Column({ type: 'text', nullable: false, unique: true })
  username: string;

  @Column({ type: 'text', nullable: true, unique: true })
  ga_id: string;

  @Column({ type: 'text', nullable: true, unique: true })
  fb_id: string;

  @OneToMany(() => Board, (board) => board.user)
  boards: Board[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
