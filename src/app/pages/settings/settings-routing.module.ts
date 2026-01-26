import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { settings } from 'firebase/analytics';
import { SettingsComponent } from './component/settings/settings.component';
import { SettingsResolver } from './resolve/settings.resolver';

const routes: Routes = [{
  path: "",
  component: SettingsComponent,
  resolve: {
    settings: SettingsResolver,
  },
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
