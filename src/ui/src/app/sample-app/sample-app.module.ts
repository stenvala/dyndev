import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import {
  SampleAppDialogEditorNoteComponent,
  SampleAppRouteMainComponent,
  SampleAppDialogAddCategoryComponent,
} from './components';
import { MatSelectModule } from '@angular/material/select';
import { SampleAppShowNotesComponent } from './components/sample-app-show-notes/sample-app-show-notes.component';
import { SampleAppShowNoteComponent } from './components/sample-app-show-note/sample-app-show-note.component';
import { MarkdownModule } from 'ngx-markdown';
import { SampleAppRouteShowNotesComponent } from './components/sample-app-route-show-notes/sample-app-route-show-notes.component';
import { SampleAppToolbarComponent } from './components/sample-app-toolbar/sample-app-toolbar.component';

@NgModule({
  declarations: [
    SampleAppRouteMainComponent,
    SampleAppDialogAddCategoryComponent,
    SampleAppDialogEditorNoteComponent,
    SampleAppShowNotesComponent,
    SampleAppShowNoteComponent,
    SampleAppRouteShowNotesComponent,
    SampleAppToolbarComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSelectModule,
    MarkdownModule,
  ],
})
export class SampleAppModule {}
