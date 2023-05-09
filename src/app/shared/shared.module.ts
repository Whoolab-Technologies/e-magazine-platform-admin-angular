import { NgModule } from '@angular/core';
//import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { CommonModule } from '@angular/common';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';

import { HeaderModule } from './header/header.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout/layout.component';

import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { PipesModule } from './pipes/pipes.module';
import { ActionComponent } from './action/action.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ConfirmationComponent } from './confirmation/confirmation.component';


@NgModule({
  declarations: [
    SidebarComponent,
    FooterComponent,
    LayoutComponent,
    ActionComponent,
    ConfirmationComponent
  ],
  imports: [
    HeaderModule,
    MatListModule,
    MatIconModule,
    RouterModule,
    MatButtonModule,
    CommonModule,
    MatMenuModule,
    MatSelectModule,
    FormsModule,
    MatSidenavModule,
    MatDialogModule, FlexLayoutModule
  ],
  exports: [
    HeaderModule, ActionComponent,
    SidebarComponent, FormsModule, MatIconModule, MatDialogModule,
    FooterComponent, MatSidenavModule, FlexLayoutModule,
    LayoutComponent, MatCardModule, MatProgressBarModule, MatToolbarModule,
    MatGridListModule, MatInputModule, MatTableModule, PipesModule
  ],
})
export class SharedModule { }
