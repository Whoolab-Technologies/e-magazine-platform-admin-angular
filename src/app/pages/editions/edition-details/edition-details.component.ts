import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { EditionsService } from '../services/editions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, filter, map, takeUntil, tap } from 'rxjs';
import { AppService, allowedImageTypes, isNullish } from '@app/shared/services/app/app.service';
import * as moment from 'moment';
import { ToastPositionTypes } from '@app/shared/model/toast'
import { ToastService } from '@app/shared/services/toast/toast.service';
import { SettingsService } from '@app/pages/settings/service/settings.service';


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
    index: 1,
  };
  topic: any = { name: '', desc: '', pdf: '', pages: 1 }
  toastrPositionTypes: typeof ToastPositionTypes = ToastPositionTypes;

  classes$: Observable<any>;
  subjects$: Observable<any>;
  class: string;
  subject: string;
  latestIndex: number = -1;
  settings: any = {};
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  topicFile: any = null;
  isTopicFileUploading: boolean = false;

  topicPdfFile: any = null;
  overviewPdfFile: any = null;
  isTopicPdfFileUploading: boolean = false;
  isoverviewPdfFileUploading: boolean = false;

  editionImage: any = null;
  isEditionImageUploading: boolean = false;

  published: boolean = false;

  publishDate: any
  constructor(private _service: EditionsService,
    public _appService: AppService,
    private _toastService: ToastService,
    private _activatedRoute: ActivatedRoute,
    private _settingsService: SettingsService,
    private _router: Router,
  ) {

  }

  ngOnInit(): void {
    this.edition = {
      name: "",
      desc: "",
      image: null,
      index: 1,
    };
    this.publishDate = moment().add(1, 'M').startOf('month');
    this.classes$ = this._service.classes$.pipe(takeUntil(this._unsubscribeAll));
    this.subjects$ = this._service.subjects$.pipe(takeUntil(this._unsubscribeAll));

    this._service.editions$.pipe(takeUntil(this._unsubscribeAll), map((resp) => {
      const editions = JSON.parse(JSON.stringify(resp));
      const last = editions.sort((a, b) => a.index - b.index).reverse()[0];
      return last ? last.index : -2;
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
      this.edition.index = el.index;
      if (el.date) {
        this.publishDate = moment(el.date).isValid() ? moment(el.date) : moment(el.date.toDate());

      }
      this.edition.published = el.published ? el.published : false
      this.topicPdfFile = this.edition.fileName ? this.edition.fileName : null;
      if (el.index != null || el.index != undefined)
        this.latestIndex = el.index
      this.title = "Edit"
      this.edit = true
      this.published = JSON.parse(JSON.stringify(this.edition.published))
      this.edition.videos = this.edition.videos ? this.edition.videos : [];
    })).subscribe();
    this._settingsService.settings$.subscribe(data => {
      this.settings = data
    })
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
    this.edition.index = this.edition.index == -1 ? 1 : this.edition.index
    const desc = this.edition.desc;
    delete this.edition.desc;
    if (isNullish(this.edition)) {
      this._toastService.showInfoToastr("All fields are required", this.toastrPositionTypes.topRight);
      return
    }
    this.edition.desc = desc;
    if (!this.edition.published && !this.publishDate) {
      this._toastService.showInfoToastr("Publish date is required if 'Publish Now' is not selected", this.toastrPositionTypes.topRight);
      return
    }
    console.log("published", this.published)
    this.edition.published = this.published;
    if (this.edition.published && this.edition.featureTag != "Complementary") {
      this.edition.featureTag = "Published"
    }
    if (this.edition.featureTag == "Complementary")
      this.edition.published = this.published = true;
    this._service.addEditions(this.class, this.subject, this.publishDate, this.edition).pipe(
      tap(_el => this._toastService.showSuccess("Added successfully"))
    )
      .subscribe((_resp) => {
        this.resetEdition();
      })
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

        this.uploadFile("editions/pdf", file).pipe(map(url => {
          return url;
        }
        )).subscribe((url: any) => {

          this.edition.pdf = url;
          this.edition.fileName = file.name;
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

  overviewPdfFileChangeEvent(event) {

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (file.type == 'application/pdf') {
        this.isoverviewPdfFileUploading = true

        this.uploadFile("editions/pdf", file).pipe(map(url => {
          return url;
        }
        )).subscribe((url: any) => {

          this.edition.overviewPdf = url;
          this.edition.overviewPdfFileName = file.name;
          this.overviewPdfFile = file.name;
          this.isoverviewPdfFileUploading = false

        }, (_error) => {
          this.isoverviewPdfFileUploading = false

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



  resetEdition() {
    this.edition['name'] = '';
    this.edition['fileName'] = '';
    this.edition['pdf'] = '';
    this.edition['image'] = '';
    this.edition['overviewPdf'] = '';
    this.edition['overviewPdfFileName'] = '';
    this.editionImage = null;
    this.topicPdfFile = null;
    this.overviewPdfFile = null;
  }

  editEdition() {

    if (this.isEditionImageUploading || this.isTopicFileUploading || this.isTopicPdfFileUploading) {
      return false;
    }
    this.edition.index = this.latestIndex;
    this.edition.featureTag = this.edition.published != this.published && this.published ? "Published" : ((this.edition.featureTag == "Published") ? "" : this.edition.featureTag);
    this.edition.published = this.published;
    this._service.editEditions(this.class, this.subject, this.publishDate, this.edition)
      .pipe(tap(_el => {
        this._toastService.showSuccess("Updated successfully")
      }))
      .subscribe()
  }

  openFile(event) {
    window.open(event, '_blank');
  }

  cancel() {
    this._router.navigate(['../'], { relativeTo: this._activatedRoute });
  }

  onUpdateVideoList(event) {
    this.edition.videos = this.edition.videos ? this.edition.videos : []
    this.edition.videos = [...event]
  }

  clearOverViewPdf(pdfFileInput: HTMLInputElement) {
    pdfFileInput.value = '';
    this.edition.overviewPdf = '';
    this.edition.overviewPdfFileName = '';
    this.overviewPdfFile = null;
  }

  clearEditionPdf(pdfFileInput: HTMLInputElement) {
    pdfFileInput.value = '';
    this.edition.pdf = '';
    this.edition.fileName = '';
    this.topicPdfFile = null;

  }

  clearEditionPosture(imageFileInput: HTMLInputElement) {
    imageFileInput.value = '';
    this.edition.image = '';
    this.editionImage = null
  }
}
