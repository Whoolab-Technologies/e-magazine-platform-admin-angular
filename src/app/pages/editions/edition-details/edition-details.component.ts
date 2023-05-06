import { Component, OnDestroy, OnInit } from '@angular/core';
import { EditionsService } from '../services/editions.service';
import { Router } from '@angular/router';
import { Observable, Subject, filter, map, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-edition-details',
  templateUrl: './edition-details.component.html',
  styleUrls: ['./edition-details.component.scss']
})
export class EditionDetailsComponent implements OnInit, OnDestroy {
  edition: any = {
    name: "",
    index: 0,
    topicCount: 0,
  };
  topic: any = {}

  classes$: Observable<any>;
  subjects$: Observable<any>;
  class: string;
  subject: string;
  latestIndex: number = -1;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _service: EditionsService, private _router: Router,) {

  }

  ngOnInit(): void {
    console.log("EditionDetailsComponent")
    this.classes$ = this._service.classes$.pipe(takeUntil(this._unsubscribeAll));
    this.subjects$ = this._service.subjects$.pipe(takeUntil(this._unsubscribeAll));

    this._service.editions$.pipe(takeUntil(this._unsubscribeAll), map((resp) => {
      console.log("resp ", resp)
      const editions = JSON.parse(JSON.stringify(resp));
      console.log("reseditionsp ", editions)

      const last = editions.sort((a, b) => a.index - b.index).reverse()[0];
      return last ? last.index : -1;
    }), tap((el: any) => {
      this.latestIndex = el
      this.edition.index = el + 1;
    })).subscribe()

    this._service.class$.pipe(takeUntil(this._unsubscribeAll), map((resp) => {
      this.class = resp;
    })).subscribe();

    this._service.subject$.pipe(takeUntil(this._unsubscribeAll), map((resp) => {
      this.subject = resp
    })).subscribe();

  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  changeClass() {
    this._service.getSubjects(this.class).subscribe()
  }

  submitEditions() {
    this._service.addEditions(this.class, this.subject, this.edition).pipe().subscribe((resp) => {

    })
  }
  addTopic() {

    this.edition.topics = this.edition.topics || [];
    console.log(this.edition.topics)
    this.edition.topics.push(this.topic)
  }
}
