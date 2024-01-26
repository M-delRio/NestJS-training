import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

class UpdateTaskDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

export { UpdateTaskDto };
