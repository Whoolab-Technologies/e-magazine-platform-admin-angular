import { Component } from '@angular/core';
import { menu } from '../../consts/routes';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  public menu = menu;
  public isOpenUiElements = false;
  constructor() {
    console.log(" this.menu ", this.menu)
  }
  public openUiElements() {
    this.isOpenUiElements = !this.isOpenUiElements;
  }
}
