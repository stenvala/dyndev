import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { RowSchemaDTO } from '@gen/models';

@Component({
  selector: 'tables-row-schema',
  templateUrl: './tables-row-schema.component.html',
  styleUrls: ['./tables-row-schema.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesRowSchemaComponent implements OnInit {
  @Input() schema!: RowSchemaDTO;
  constructor() {}

  ngOnInit(): void {}
}
