import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';

import { TablesPageComponent } from './containers';
import { TablesRoutingModule } from './tables-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { EmployeeTableComponent, MaterialTableComponent } from './components';
import { TablesService } from './services';

@NgModule({
  declarations: [
    TablesPageComponent,
    MaterialTableComponent,
    EmployeeTableComponent
  ],
  imports: [
    CommonModule,
    TablesRoutingModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatFormFieldModule,
    SharedModule
  ],
  providers: [
    TablesService
  ]
})
export class TablesModule { }
