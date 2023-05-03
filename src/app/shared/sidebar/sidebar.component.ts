import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { menu } from '../../consts/routes';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public menu = menu;
  public isOpenUiElements = false;
  constructor(private changeDetectorRef: ChangeDetectorRef) {
    console.log(" this.menu ", this.menu)
  }
  ngOnInit(): void {
    this.menu = menu;
    this.changeDetectorRef.detectChanges()
  }

  public openUiElements() {
    this.isOpenUiElements = !this.isOpenUiElements;
  }
}
