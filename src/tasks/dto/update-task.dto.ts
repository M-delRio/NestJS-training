import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task.model';

class UpdateTaskDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

export { UpdateTaskDto };
