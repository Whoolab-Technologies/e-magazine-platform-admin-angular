import { Component } from '@angular/core';
import { HttpLoaderService } from '../services/http-loader.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-http-loader',
  templateUrl: './http-loader.component.html',
  styleUrls: ['./http-loader.component.scss']
})
export class HttpLoaderComponent {

  isLoading: Subject<boolean> = this.loaderService.isLoading;

  constructor(private loaderService: HttpLoaderService) {
  }
}