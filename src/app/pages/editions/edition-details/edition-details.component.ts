import { Component, OnDestroy, OnInit } from '@angular/core';
import { EditionsService } from '../services/editions.service';
import { Router } from '@angular/router';
import { Observable, Subject, filter, map, takeUntil, tap } from 'rxjs';
import { AppService, allowedImageTypes, isNullish } from '@app/shared/services/app/app.service';
import * as moment from 'moment';
import { ToastPositionTypes } from '@app/shared/model/toast'
import { ToastService } from '@app/shared/services/toast/toast.service';
import { error } from 'console';

@Component({
  selector: 'app-edition-details',
  templateUrl: './edition-details.component.html',
  styleUrls: ['./edition-details.component.scss']
})
export class EditionDetailsComponent implements OnInit, OnDestroy {
  title: string = "Add New";
  edit: boolean = false;
  edition: any = {
    name: "",
    desc: "",
    image: null,
    index: 0,
    topicCount: 0,
  };
  topic: any = { name: '', banner: '', desc: '', pdf: '', pages: 1 }
  toastrPositionTypes: typeof ToastPositionTypes = ToastPositionTypes;

  classes$: Observable<any>;
  subjects$: Observable<any>;
  class: string;
  subject: string;
  latestIndex: number = -1;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  topicFile: any = null;
  isTopicFileUploading: boolean = false;

  topicPdfFile: any = null;
  isTopicPdfFileUploading: boolean = false;

  editionImage: any = null;
  isEditionImageUploading: boolean = false;

  published: boolean = false;

  publishDate: any
  constructor(private _service: EditionsService,
    public _appService: AppService,
    private _toastService: ToastService,
    private _router: Router,) {

  }

  ngOnInit(): void {
    this.publishDate = moment().add(1, 'M').startOf('month');
    this.classes$ = this._service.classes$.pipe(takeUntil(this._unsubscribeAll));
    this.subjects$ = this._service.subjects$.pipe(takeUntil(this._unsubscribeAll));

    this._service.editions$.pipe(takeUntil(this._unsubscribeAll), map((resp) => {
      const editions = JSON.parse(JSON.stringify(resp));
      const last = editions.sort((a, b) => a.index - b.index).reverse()[0];
      return last ? last.index : -1;
    }), tap((el: any) => {
      this.edition.index = el + 1;
    })).subscribe()

    this._service.class$.pipe(takeUntil(this._unsubscribeAll), map((resp) => {
      this.class = resp;
    })).subscribe();

    this._service.subject$.pipe(takeUntil(this._unsubscribeAll), map((resp) => {
      this.subject = resp
    })).subscribe();

    this._service.edition$.pipe(takeUntil(this._unsubscribeAll), filter((resp) =>

      resp
    ), map(el => {
      this.edition = el;
      this.edition.index = el.index
      if (el.date) {
        this.publishDate = moment(el.date).isValid() ? moment(el.date) : moment(el.date.toDate());

      }
      this.edition.published = el.published ? el.published : false
      if (el.index != null || el.index != undefined)
        this.latestIndex = el.index
      this.title = "Edit"
      this.edit = true
      this.published = this.edition.published
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
    if (this.isEditionImageUploading || this.isTopicFileUploading || this.isTopicPdfFileUploading
    ) {
      return false
    }
    if (isNullish(this.edition)) {
      this._toastService.showInfoToastr("All fields are required", this.toastrPositionTypes.topRight);
      return
    }
    if (!this.edition.published && !this.publishDate) {
      this._toastService.showInfoToastr("Publish date is required if 'Publish Now' is not selected", this.toastrPositionTypes.topRight);
      return
    }
    if ((this.topic.name && this.topic.desc && this.topic.pdf)) {
      console.log("add topic on edition submit")
      this.addTopic();
    }
    if (!this.edition.topics) {
      this.edition.topics = [];
    }
    this.edition['topicCount'] = this.edition.topics.length;
    this._service.addEditions(this.class, this.subject, this.publishDate, this.edition).pipe(
      tap(_el => this._toastService.showSuccess("Added successfully"))
    )
      .subscribe((_resp) => {
        this.resetEdition();
      })
  }

  addTopic() {
    if (this.isTopicFileUploading || this.isTopicPdfFileUploading) {
      return

    }
    if (isNullish(this.topic)) {
      this._toastService.showInfoToastr("All fields are required", this.toastrPositionTypes.topRight);
      return
    }

    this.edition.topics = this.edition.topics || [];
    const topic = JSON.parse(JSON.stringify(this.topic))
    this.edition.topics.push(topic)
    this.resetTopic()
  }


  editionFileChangeEvent(event) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0]
      if (!allowedImageTypes().includes(file.type)) {
        this._toastService.showInfoToastr("Please a valid image file", this.toastrPositionTypes.bottomRight)
        return
      }
      this.isEditionImageUploading = true;
      this.uploadFile("editions/images", file).pipe(map(url => {
        return url
      }
      )).subscribe((url) => {
        this.edition.image = url;
        this.editionImage = file.name;
        this.isEditionImageUploading = false;

      }, _error => {
        this.isEditionImageUploading = false;

      });
    }

  }




  pdfFileChangeEvent(event) {

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (file.type == 'application/pdf') {
        this.isTopicPdfFileUploading = true

        this.uploadFile("editions/topics/pdf", file).pipe(map(url => {
          return url;
        }
        )).subscribe((url: any) => {
          console.log('pdfFileChangeEvent  url', url)

          this.topic.pdf = url;
          this.topicPdfFile = file.name;
          this.isTopicPdfFileUploading = false

        }, (_error) => {
          this.isTopicPdfFileUploading = false

        });
      }
      else {
        this._toastService.showInfoToastr("Please select PDF file", this.toastrPositionTypes.bottomRight)
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
      banner: '',
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

  editEdition() {
    if (this.isEditionImageUploading || this.isTopicFileUploading || this.isTopicPdfFileUploading) {
      return false;
    }
    this.edition.index = this.latestIndex;
    this._service.editEditions(this.class, this.subject, this.publishDate, this.edition)
      .pipe(tap(_el => {
        this._toastService.showSuccess("Updated successfully")
      }))
      .subscribe()
  }

  openFile(event) {
    window.open(event, '_blank');
  }

}
