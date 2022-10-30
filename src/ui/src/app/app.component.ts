import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
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
  activeLink = '';

  links: Link[] = [
    {
      label: 'Home',
      link: ROUTE_MAP.TABLES,
    },
    {
      label: 'Guide',
      link: ROUTE_MAP.GUIDE,
    },
  ];

  constructor(
    private navigationService: NavigationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // No need to unsubscribe in root component
    this.navigationService.activePath$.subscribe((i) => {
      this.activeLink = i.substring(1);
      this.cdr.detectChanges();
    });
  }

  goto(link: Link) {
    this.navigationService.goto(link.link);
  }
}
