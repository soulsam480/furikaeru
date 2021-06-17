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

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: true,
  })
  data: BoardColumn[];

  @Column('boolean', { nullable: true })
  is_public: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
