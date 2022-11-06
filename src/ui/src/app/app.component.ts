import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { SideNavContent, SideNavItem, SideNavService } from '@core/services';
import { NavigationService, ROUTE_MAP } from '@routing/index';

type Link = {
  label: string;
  link: { PATH: string };
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  isDrawerOpened = true;
  sideNav?: SideNavContent;
  activeLink = '';

  links: Link[] = [
    {
      label: 'Tables',
      link: ROUTE_MAP.TABLES,
    },
    {
      label: 'Guide',
      link: ROUTE_MAP.GUIDE,
    },
    {
      label: 'Sample app',
      link: ROUTE_MAP.SAMPLE_APP,
    },
  ];

  constructor(
    private navigationService: NavigationService,
    private sideNavService: SideNavService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // No need to unsubscribe in root component
    this.navigationService.activePath$.subscribe((i) => {
      this.activeLink = i.substring(1);
      this.cdr.detectChanges();
    });
    this.sideNavService.sideNav$.subscribe((i) => {
      this.sideNav = i;
      this.cdr.detectChanges();
    });
  }

  goto(link: Link) {
    this.navigationService.goto(link.link);
  }

  toggleDrawer() {
    this.isDrawerOpened = !this.isDrawerOpened;
  }
}
