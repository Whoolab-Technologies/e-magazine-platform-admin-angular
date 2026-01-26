import { NgModule } from '@angular/core';
//import { MatLegacyListModule as MatListModule } from '@angular/material/list';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';

import { HeaderModule } from './header/header.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout/layout.component';

import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { PipesModule } from './pipes/pipes.module';
import { ActionComponent } from './action/action.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { LoaderComponent } from './loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { formatDateTime } from 'app/shared/services/app/app.service';
@NgModule({
  declarations: [
    SidebarComponent,
    FooterComponent,
    LayoutComponent,
    ActionComponent,
    ConfirmationComponent,
    LoaderComponent,
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
    MatSidenavModule, MatProgressSpinnerModule,
    MatDialogModule, FlexLayoutModule, MatProgressBarModule
  ],
  exports: [
    HeaderModule, ActionComponent, MatProgressSpinnerModule, LoaderComponent,
    SidebarComponent, FormsModule, MatIconModule, MatDialogModule,
    FooterComponent, MatSidenavModule, FlexLayoutModule, MatButtonModule,
    LayoutComponent, MatCardModule, MatProgressBarModule, MatToolbarModule,
    MatGridListModule, MatInputModule, MatTableModule, PipesModule
  ],

})
export class SharedModule { }

