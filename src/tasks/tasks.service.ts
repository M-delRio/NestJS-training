import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }

        return false;
      });
    }

    return tasks;
  }

  getTask(targetId: string): Task | undefined {
    for (const task of this.tasks) {
      if (task.id === targetId) {
        return task;
      }
    }
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  updateTask(targetId: string, newStatus: TaskStatus): Task | void {
    for (const task of this.tasks) {
      if (task.id === targetId) {
        task.status = newStatus;
        return task;
      }
    }
  }

  deleteTask(targetId: string): Task | undefined {
    let deletedTask: Task | undefined;
    this.tasks = this.tasks.filter((task) => {
      if (task.id === targetId) {
        deletedTask = task;
      }

      return task.id !== targetId;
    });
    return deletedTask;
  }
}
