import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-editions',
  templateUrl: './editions.component.html',
  styleUrls: ['./editions.component.scss']
})
export class EditionsComponent {
  drawerMode = 'side';
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  onBackdropClicked() {

  }
}
