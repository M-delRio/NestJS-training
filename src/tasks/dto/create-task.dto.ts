import { TaskStatus } from '../task.model';

class CreateTaskDto {
  title: string;
  description: string;
}

class UpdateTaskDto {
  status: TaskStatus;
}

export { CreateTaskDto, UpdateTaskDto };
