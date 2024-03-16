import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { SettingsService } from '../service/settings.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsResolver implements Resolve<boolean> {
  constructor(private service: SettingsService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([this.service.loadSettings()]);
  }
}
