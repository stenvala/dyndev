import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { subsToUrl } from '@gen/subs-to-url.func';
import { BehaviorSubject } from 'rxjs';

export type Link = string | ({ [key: string]: any } & { PATH: string });

@Injectable({ providedIn: 'root' })
export class NavigationService {
  activePath$ = new BehaviorSubject<string>('');
  data$ = new BehaviorSubject<any>(undefined);
  params$ = new BehaviorSubject<{ [key: string]: any }>({});

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    router.events.subscribe((event) => {
      let route: any;
      if ('snapshot' in event) {
        route = event.snapshot;
        while (route.firstChild) {
          route = route.firstChild;
        }
      }
      // Changed this to ActivationEnd, that I think works better
      if (event instanceof ActivationEnd) {
        this.params$.next(route.params || {});
        this.data$.next(event.snapshot.data);
        const path = '/' + route.routeConfig.path;
        if (path !== this.activePath$.value) {
          this.activePath$.next(path);
        }
      }
    });
  }

  goto(
    path: Link,
    params: { [key: string]: any } = {},
    queryStringParams?: { [key: string]: string | number | boolean }
  ) {
    const navPath = this.getLink(path, params)
      .split('/')
      .filter((i) => i);
    navPath[0] = '/' + navPath[0];
    this.router.navigate(navPath, {
      queryParams: queryStringParams,
      skipLocationChange: false,
    });
  }

  setQueryParams(params: any) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: params,
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
  }

  getLink(path: Link, params: { [key: string]: any } = {}): string {
    if (!(typeof path === 'string')) {
      return this.getLink(path.PATH, params);
    }
    // fill to params all current params, so they can be neglected when navigating to another route
    for (const i in this.params$.value) {
      if (!(i in params) && this.params$.value.hasOwnProperty(i)) {
        params[i] = this.params$.value[i];
      }
    }
    return subsToUrl(path, params);
  }
}
