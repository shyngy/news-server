import { UserEntity } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { OutputBlockData } from '../dto/create-post.dto';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  user: UserEntity;

  @Column({ type: 'jsonb' })
  body: OutputBlockData[];

  @Column()
  description: string;

  @Column({ nullable: true })
  tags?: string;

  @Column({ default: 0 })
  views: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
