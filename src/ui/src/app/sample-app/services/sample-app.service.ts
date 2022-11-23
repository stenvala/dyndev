import { Injectable } from '@angular/core';
import { SampleAppApiService } from '@gen/apis';
import { firstValueFrom, map, switchMap, tap } from 'rxjs';
import { SampleAppStore } from './sample-app.store';
import { CreateTaskDTO, TaskDTO, TaskStatusEnum } from '@gen/models';
import { SideNavItem, SideNavService } from '@core/services';
import { NavigationService } from '@routing/navigation.service';
import { ROUTE_MAP } from '@routing/routes.map';

const CS_SCHEMA_KEY_PREFIX = 'TABLE_SCHEMA.';

@Injectable({ providedIn: 'root' })
export class SampleAppService {
  constructor(
    private store: SampleAppStore,
    private api: SampleAppApiService,
    private sideNavService: SideNavService,
    private nav: NavigationService
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

  async initSideNav() {
    const categorySubItems = await this.getCategorySubItemsToMenu();

    this.sideNavService.sideNav$.next({
      content: [
        {
          items: [
            {
              label:
                categorySubItems.length === 0
                  ? 'Not yet any categories'
                  : 'By category',
              subitems: categorySubItems,
            },
            {
              label: 'By status',
              subitems: this.getStatusSubItemsToMenu(),
            },
          ],
        },
      ],
    });
  }

  private async getCategorySubItemsToMenu(): Promise<SideNavItem[]> {
    const categories = await firstValueFrom(this.getTaskCategories());
    return categories.map((i) => {
      return {
        label: i.name,
        action: () =>
          this.nav.goto(ROUTE_MAP.SAMPLE_APP.CATEGORY, { categoryId: i.id }),
        isActive: this.nav.params$.value['categoryId'] === i.id,
      };
    });
  }

  private getStatusSubItemsToMenu() {
    return Object.keys(TaskStatusEnum).map((i) => {
      return {
        label: i,
        action: () => this.nav.goto(ROUTE_MAP.SAMPLE_APP.STATUS, { status: i }),
        isActive: this.nav.params$.value['status'] === i,
      };
    });
  }
}
