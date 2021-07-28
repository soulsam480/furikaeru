import { BoardColumn } from 'src/utils/types';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user';

@Entity('board')
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.boards, { nullable: true })
  user: User;

  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: true,
  })
  data: BoardColumn[];

  @Column('boolean', { nullable: true })
  is_public: boolean;

  @Column('integer', { default: 5, nullable: true })
  max_vote: number;

  @Column('boolean', { default: false, nullable: true })
  is_deleted: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
