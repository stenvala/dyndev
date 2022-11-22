import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { GuideApiService } from '@gen/apis';
import { firstValueFrom } from 'rxjs';

import hljs from 'highlight.js';

@Component({
  selector: 'guide-show-code',
  templateUrl: './guide-show-code.component.html',
  styleUrls: ['./guide-show-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideShowCodeComponent implements OnInit {
  @Input() file!: string;

  content?: string;
  constructor(private api: GuideApiService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    this.content = (
      await firstValueFrom(this.api.getFileContent(this.file))
    ).content;
    this.cdr.detectChanges();
    setTimeout(() => {
      hljs.highlightAll();
    }, 0);
  }
}
