import { Injectable } from '@angular/core';
import {
  TableSchemaDTO,
  TaskCategoryDTO,
  SampleAppApiService,
  TaskDTO,
} from '@gen/index';
import {
  IListStore,
  IMappedStore,
  IMappedListStore,
  StateManagementStoreFactory,
} from '@lib/index';

export interface TableSchema {
  updated: number;
  schema: TableSchemaDTO;
}

@Injectable({ providedIn: 'root' })
export class SampleAppStore {
  categories: IListStore<TaskCategoryDTO>;
  tasks: IMappedStore<TaskDTO>;
  tasksByCategory: IMappedListStore<string>;
  tasksByStatus: IMappedListStore<string>;

  constructor(
    sms: StateManagementStoreFactory,
    private api: SampleAppApiService
  ) {
    this.categories = sms.createListStore<TaskCategoryDTO>();
    this.tasks = sms.createMappedStore<TaskDTO>();
    this.tasksByCategory = sms.createMappedListStore<string>();
    this.tasksByStatus = sms.createMappedListStore<string>();
  }

  removeTaskFromCategory(task: TaskDTO) {
    if (this.tasksByCategory.has(task.categoryId)) {
      this.tasksByCategory.set(
        task.categoryId,
        this.tasksByCategory.get(task.categoryId).filter((i) => i !== task.id)
      );
    }
  }

  addTaskToCategory(task: TaskDTO) {
    this.tasks.set(task.id, task);
    const current = this.tasksByCategory.has(task.categoryId)
      ? this.tasksByCategory.get(task.categoryId)
      : [];
    current.unshift(task.id);
    this.tasksByCategory.set(task.categoryId, current);
  }

  sortTasksInCategory(categoryId: string) {
    if (this.tasksByCategory.has(categoryId)) {
      const tasks = this.tasksByCategory.get(categoryId);
      tasks.sort((a, b) => {
        return this.tasks.get(a).lastUpdated > this.tasks.get(b).lastUpdated
          ? -1
          : 1;
      });
      this.tasksByCategory.set(categoryId, tasks);
    }
  }

  removeTaskFromStatus(task: TaskDTO) {
    if (this.tasksByStatus.has(task.status)) {
      this.tasksByStatus.set(
        task.status,
        this.tasksByStatus.get(task.status).filter((i) => i !== task.id)
      );
    }
  }

  addTaskToStatus(task: TaskDTO) {
    this.tasks.set(task.id, task);
    const current = this.tasksByStatus.has(task.status)
      ? this.tasksByStatus.get(task.status)
      : [];
    current.unshift(task.id);
    this.tasksByStatus.set(task.status, current);
  }

  sortTasksInStatus(status: string) {
    if (this.tasksByStatus.has(status)) {
      const tasks = this.tasksByStatus.get(status);
      tasks.sort((a, b) => {
        return this.tasks.get(a).lastUpdated > this.tasks.get(b).lastUpdated
          ? -1
          : 1;
      });
      this.tasksByStatus.set(status, tasks);
    }
  }
}
