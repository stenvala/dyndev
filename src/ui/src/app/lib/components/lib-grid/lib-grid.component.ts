import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lib-grid',
  templateUrl: './lib-grid.component.html',
  styleUrls: ['./lib-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibGridComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
