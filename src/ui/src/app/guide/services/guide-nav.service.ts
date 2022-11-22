import { Injectable } from '@angular/core';
import { TablesApiService } from '@gen/apis';
import { SideNavService } from '@core/index';
import { NavigationService } from '@routing/navigation.service';
import { ROUTE_MAP } from '@routing/routes.map';
import { ControlStateService } from '@lib/services';

type NavItem = {
  label: string;
  link: object & { PATH: string };
};

const NAV: NavItem[] = [
  {
    label: 'Home',
    link: ROUTE_MAP.GUIDE.MAIN,
  },
  {
    label: 'STD',
    link: ROUTE_MAP.GUIDE.BASICS,
  },
  {
    label: 'Python code examples',
    link: ROUTE_MAP.GUIDE.PYTHON,
  },
  {
    label: 'Provision table with CDK',
    link: ROUTE_MAP.GUIDE.CDK,
  },
  {
    label: 'About',
    link: ROUTE_MAP.GUIDE.ABOUT,
  },
];

@Injectable({ providedIn: 'root' })
export class GuideNavService {
  constructor(
    private sideNavService: SideNavService,
    private nav: NavigationService
  ) {}

  async setSideNav() {
    const current = this.nav.activePath$.value.substring(1);

    this.sideNavService.sideNav$.next({
      content: [
        {
          items: NAV.map((i) => {
            return {
              label: i.label,
              action: () => this.nav.goto(i.link),
              isActive: current === i.link.PATH.substring(1),
            };
          }),
        },
      ],
    });
  }
}
