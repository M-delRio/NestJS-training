import { TaskStatus } from '../task-status.enum';
import { IsNotEmpty } from 'class-validator';

class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}

class UpdateTaskDto {
  status: TaskStatus;
}

export { CreateTaskDto, UpdateTaskDto };
