import { Injectable, OnDestroy } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { StudentsService } from '@app/pages/students/services/students.service';
import { Observable, Subject, forkJoin, of, takeUntil, tap } from 'rxjs';
import { NotificationService } from '@app/pages/notifications/service/notification.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsResolver  {
  constructor(private _service: NotificationService) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([this._service.getStudents(), this._service.getNotifications()]);
  }
}

@Injectable({
  providedIn: 'root'
})
export class NotificationResolver  implements OnDestroy {
  private _onDestroy: Subject<any> = new Subject<any>()
  constructor(private _service: NotificationService) {

  }
  ngOnDestroy(): void {
    this._onDestroy.next(null);
    this._onDestroy.complete()
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this._service.getClasses()
      .pipe(takeUntil(this._onDestroy));
  }
}
