import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksRepository', { timestamp: true });

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, user },
    });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  // could extract this driver
  async getTaskss(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.taskRepository.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR task.description LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }". Filter: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.getTaskss(filterDto, user);
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    const deleteOperationResult = await this.taskRepository.delete({
      id,
      user,
    });

    if (deleteOperationResult.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.taskRepository.save(task);

    return task;
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;
    await this.taskRepository.save(task);

    return task;
  }
}
