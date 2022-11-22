import { Injectable } from '@angular/core';
import { SampleAppApiService } from '@gen/apis';
import { SideNavService } from '@core/index';
import { map, switchMap, tap } from 'rxjs';
import { NavigationService } from '@routing/navigation.service';
import { ControlStateService } from '@lib/services';
import { SampleAppStore } from './sample-app.store';
import { CreateTaskDTO, TaskDTO, TaskStatusEnum } from '@gen/models';

const CS_SCHEMA_KEY_PREFIX = 'TABLE_SCHEMA.';

@Injectable({ providedIn: 'root' })
export class SampleAppService {
  constructor(
    private store: SampleAppStore,
    private api: SampleAppApiService
  ) {}

  createTable() {
    return this.api.createTable();
  }

  createTaskCategory(name: string) {
    return this.api
      .createCategory({
        name,
      })
      .pipe(
        tap((i) => {
          const currentCategories = this.store.categories.obs$.value;
          currentCategories.push(i);
          currentCategories.sort((a, b) => (a.name < b.name ? -1 : 1));
          this.store.categories.set(currentCategories);
        })
      );
  }

  getTaskCategories() {
    if (this.store.categories.obs$.value.length > 0) {
      return this.store.categories.obs$;
    }
    return this.api.getCategories().pipe(
      tap((i) => this.store.categories.set(i.collection)),
      switchMap((i) => this.store.categories.obs$)
    );
  }

  getTasksByCategory(categoryId: string) {
    return this.store.tasksByCategory.subscribeToValue(categoryId, () =>
      this.api.getTasksOfCategory(categoryId).pipe(
        map((i) =>
          i.collection.map((j) => {
            this.store.tasks.set(j.id, j);
            return j.id;
          })
        )
      )
    );
  }

  getTasksByStatus(status: TaskStatusEnum) {
    return this.store.tasksByStatus.subscribeToValue(status, () =>
      this.api.getTasksOfStatus(status).pipe(
        map((i) =>
          i.collection.map((j) => {
            this.store.tasks.set(j.id, j);
            return j.id;
          })
        )
      )
    );
  }

  createTask(categoryId: string, task: CreateTaskDTO) {
    return this.api.createTask(categoryId, task).pipe(
      tap((createdTask) => {
        this.store.tasks.set(createdTask.id, createdTask);
        this.store.addTaskToCategory(createdTask);
        this.store.addTaskToStatus(createdTask);
      })
    );
  }

  saveTask(task: TaskDTO) {
    return this.api.editTask(task.id, task).pipe(
      tap((updatedTask) => {
        const originalTask = this.store.tasks.get(task.id);
        this.store.tasks.set(task.id, updatedTask);
        if (updatedTask.categoryId !== originalTask.categoryId) {
          this.store.removeTaskFromCategory(originalTask);
          this.store.addTaskToCategory(updatedTask);
        } else {
          this.store.sortTasksInCategory(updatedTask.categoryId);
        }
        if (updatedTask.status !== originalTask.status) {
          this.store.removeTaskFromStatus(originalTask);
          this.store.addTaskToStatus(updatedTask);
        } else {
          this.store.sortTasksInStatus(updatedTask.status);
        }
      })
    );
  }

  getTask(taskId: string) {
    return this.store.tasks.subscribeToValue(taskId, () =>
      this.api.getTask(taskId)
    );
  }

  removeTask(taskId: string) {}
}
