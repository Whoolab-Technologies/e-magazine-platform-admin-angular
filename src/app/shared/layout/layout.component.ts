import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  standalone: false,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnDestroy, OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  public isShowSidebar: boolean;
  public mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  constructor(private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher) {


    // changeDetectorRef.detectChanges();
  }
  ngOnInit(): void {
    this.mobileQuery = this.media.matchMedia('(max-width: 1024px)');
    this.mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    this.isShowSidebar = !this.mobileQuery.matches;
  }


  public ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);

    this.sidenav.close();
  }
}
