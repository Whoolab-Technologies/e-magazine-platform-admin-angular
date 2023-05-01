import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgApexchartsModule } from 'ng-apexcharts';


import {
  DashedLineChartComponent,
  HeatmapChartComponent,
  IconsPageComponent,
  LineChartComponent,
  PieChartComponent
} from './components';
import {
  ChartsPageComponent,
  MapPageComponent
} from './containers';
import { UiElementsRoutingModule } from './ui-elements-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ChartsService } from './services';
import { DashboardModule } from '../dashboard/dashboard.module';
import { googleMapKey } from './consts';

@NgModule({
  declarations: [
    IconsPageComponent,
    ChartsPageComponent,
    MapPageComponent,
    LineChartComponent,
    DashedLineChartComponent,
    PieChartComponent,
    HeatmapChartComponent
  ],
  imports: [
    CommonModule,
    UiElementsRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    NgApexchartsModule,

    MatToolbarModule,
    SharedModule,
    DashboardModule,
  ],
  providers: [
    ChartsService
  ]
})
export class UiElementsModule { }
