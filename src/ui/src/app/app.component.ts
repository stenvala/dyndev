import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SideNavContent, SideNavService } from '@core/services';
import { BusyService, ControlStateService } from '@lib/services';
import { NavigationService, ROUTE_MAP } from '@routing/index';
import { firstValueFrom } from 'rxjs';
import { HttpConfigInterceptor, TOKEN_URL } from './core';

type Link = {
  label: string;
  link: { PATH: string };
};

const CS_KEY = 'MAIN';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  @ViewChild('busyLayer') busyLayer?: ElementRef;
  isDrawerOpened = this.cs.get(CS_KEY, true);
  sideNav?: SideNavContent;
  activeLink = '';
  licenseText?: string;

  links: Link[] = [
    {
      label: 'Tables',
      link: ROUTE_MAP.TABLES,
    },
    {
      label: 'DynamoDB STD',
      link: ROUTE_MAP.GUIDE.MAIN,
    },
    {
      label: 'Sample app',
      link: ROUTE_MAP.SAMPLE_APP,
    },
    {
      label: 'About',
      link: ROUTE_MAP.ABOUT,
    },
  ];

  constructor(
    private navigationService: NavigationService,
    private sideNavService: SideNavService,
    private cdr: ChangeDetectorRef,
    private busyService: BusyService,
    private cs: ControlStateService,
    private http: HttpClient
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
    this.solveTokenNeed();
  }

  ngAfterViewInit() {
    this.busyService.setElement(this.busyLayer!);
  }

  goto(link: Link) {
    this.navigationService.goto(link.link);
  }

  toggleDrawer() {
    this.isDrawerOpened = !this.isDrawerOpened;
    this.cs.set(CS_KEY, this.isDrawerOpened);
  }

  private async solveTokenNeed() {
    const response = await firstValueFrom(
      this.http.get<{ is: boolean; licenseText: string }>(TOKEN_URL)
    );
    this.licenseText = response.licenseText;
    this.cdr.detectChanges();
    HttpConfigInterceptor.isTokenNeeded = response.is;
    HttpConfigInterceptor.isTokenNeededSolved$.next(true);
  }
}
