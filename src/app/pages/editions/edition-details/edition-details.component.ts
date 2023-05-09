import { Component, OnDestroy, OnInit } from '@angular/core';
import { EditionsService } from '../services/editions.service';
import { Router } from '@angular/router';
import { Observable, Subject, filter, map, takeUntil, tap } from 'rxjs';
import { AppService, allowedImageTypes, isNullish } from '@app/shared/services/app/app.service';
import * as moment from 'moment';

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
  topicFile: any = null;
  topicPdfFile: any = null;
  editionImage: any = null;
  progress$: Observable<number> = new Observable();
  publishDate: any
  constructor(private _service: EditionsService,
    public _appService: AppService,
    private _router: Router,) {

  }

  ngOnInit(): void {
    this.publishDate = moment().add(1, 'M').startOf('month');
    console.log('publishDate ', this.publishDate)
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
    this.progress$ = this._appService.progress$.pipe(
      takeUntil(this._unsubscribeAll)
    );
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  changeClass() {
    this._service.getSubjects(this.class).subscribe()
  }

  submitEditions() {
    if (isNullish(this.edition)) {
      return
    }
    if ((this.topic.name && this.topic.desc && this.topic.image && this.topic.pdf)) {
      this.addTopic();
    }
    if (!this.edition.topics) {
      this.edition.topics = [];
    }
    this.edition['topicCount'] = this.edition.topics.length;
    this._service.addEditions(this.class, this.subject, this.publishDate, this.edition).pipe()
      .subscribe((resp) => {
        this.resetEdition();
      })
  }

  addTopic() {
    if (isNullish(this.topic)) {
      return
    }

    this.edition.topics = this.edition.topics || [];
    console.log(this.edition.topics)
    const topic = JSON.parse(JSON.stringify(this.topic))
    this.edition.topics.push(topic)
    this.resetTopic()
  }


  editionFileChangeEvent(event) {
    console.log("event.target");
    console.log(event.target.files);
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0]
      if (!allowedImageTypes().includes(file.type)) {
        return
      }
      this.uploadFile("editions/images", file).pipe(map(url => {
        return url
      }
      )).subscribe((url) => {
        this.edition.image = url;
        this.editionImage = file.name
        console.log("url", url)
      });
    }

  }

  fileChangeEvent(event) {
    console.log("event.target");
    console.log(event.target.files);
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0]
      if (!allowedImageTypes().includes(file.type)) {
        return
      }
      this.uploadFile("editions/topics/images", file).pipe(map(url => {
        return url
      }
      )).subscribe((url) => {
        this.topic.image = url;
        this.topicFile = file.name
        console.log("url", url)
      });
    }

  }

  pdfFileChangeEvent(event) {
    if (event.target.files && event.target.files.length) {
      console.log("event.target.file", event.target);
      console.log("event.target.file[0] ", event.target.files[0]);
      const file = event.target.files[0];
      if (file.type == 'application/pdf') {
        this.uploadFile("editions/topics/pdf", file).pipe(map(url => {
          return url;
        }
        )).subscribe((url: any) => {
          this.topic.pdf = url;
          this.topicPdfFile = file.name
        });
      }
    }
  }

  uploadFile(path, file): any {
    return this._appService.uploadImage(path, file).pipe(filter(resp => resp), map(resp => {
      return resp;
    }));
  }

  resetTopic() {
    this.topic = {
      name: '',
      desc: '',
      image: '',
      pdf: ''
    }
    this.topicFile = null;
    this.topicPdfFile = null;
  }

  resetEdition() {
    this.resetTopic()
    this.edition['name'] = '';
    this.edition['desc'] = '';
    this.edition['image'] = '';
    this.edition['topicCount'] = 0;
    this.edition['topics'] = [];
    this.editionImage = null;
  }
}
