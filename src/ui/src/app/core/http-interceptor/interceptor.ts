import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BusyService, ToasterService } from '@lib/services';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, filter } from 'rxjs/operators';
import { AskTokenDialogComponent } from './ask-token-dialog/ask-token-dialog.component';

export const TOKEN_URL = '/api/does-use-token';
const LS_TOKEN_KEY = 'DYNDEV_TOKEN';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  static isTokenNeeded = true;
  static isTokenNeededSolved$ = new BehaviorSubject(false);

  private isTokenSolved$ = new BehaviorSubject(false);
  private isTokenBeingSolved = false;
  private token = '';

  constructor(
    private dialog: MatDialog,
    private toaster: ToasterService,
    private busyService: BusyService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      !request.url.endsWith(TOKEN_URL) &&
      HttpConfigInterceptor.isTokenNeeded
    ) {
      // Don't know yet if token is even used, app component is in charge of finding that out and populating the static
      if (!HttpConfigInterceptor.isTokenNeededSolved$.value) {
        return HttpConfigInterceptor.isTokenNeededSolved$.pipe(
          filter((i) => i),
          switchMap((i) => this.intercept(request, next))
        );
      }
      if (!this.isTokenSolved$.value) {
        if (this.isTokenBeingSolved) {
          return this.isTokenSolved$.pipe(
            filter((i) => i),
            switchMap((i) => this.intercept(request, next))
          );
        } else {
          this.isTokenBeingSolved = true;
          const lsToken = localStorage.getItem(LS_TOKEN_KEY);
          if (lsToken) {
            this.token = lsToken;
            this.isTokenBeingSolved = false;
            this.isTokenSolved$.next(true);
            // And continue outside if
          } else {
            const dialogRef = this.dialog.open(AskTokenDialogComponent, {
              disableClose: true,
            });
            dialogRef.afterClosed().subscribe(async (token: string) => {
              this.token = token;
              localStorage.setItem(LS_TOKEN_KEY, token);
              this.isTokenBeingSolved = false;
              this.isTokenSolved$.next(true);
            });
            return this.isTokenSolved$.pipe(
              filter((i) => i),
              switchMap((i) => this.intercept(request, next))
            );
          }
        }
      }
    }

    let overwrite: { [key: string]: any } = {};

    if (this.token) {
      overwrite['headers'] = request.headers.set(
        'Authorization',
        'Token ' + this.token
      );
    }

    request = request.clone(overwrite);

    return next.handle(request).pipe(
      catchError((err, caught) => {
        if (err?.error?.detail == 'UNAUTHORIZED') {
          localStorage.removeItem(LS_TOKEN_KEY);
          this.busyService.show();
          this.toaster.showError('The given token is not valid');
          setTimeout(() => {
            location.reload();
          }, 1000);
        }
        return of(err);
      })
    );
  }
}
