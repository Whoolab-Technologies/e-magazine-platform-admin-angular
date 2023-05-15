import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AppService } from '../services/app/app.service';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  progress$: Observable<number> = new Observable();
  @Input() type: string = 'spinner';
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _appService: AppService) {

  }

  ngOnInit(): void {
    this.progress$ = this._appService.progress$.pipe(
      takeUntil(this._unsubscribeAll)
    );

  }

}
