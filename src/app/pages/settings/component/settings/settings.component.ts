import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastService } from '@app/shared/services/toast/toast.service';
import { SettingsService } from '../../service/settings.service';
import { Subject, filter, map, take, takeUntil } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  newFeatureTag: string;
  newSpecialTag: string;


  featureTags: string[] = [];
  banners: string[] = [];
  selectedFeatureTags: string[] = []

  specialTags: string[] = [];
  selectedSpecialTags: string[] = [];
  private _onDestroy$: Subject<void> = new Subject();
  constructor(
    private _toastService: ToastService,
    private _service: SettingsService
  ) {

  }
  ngOnDestroy(): void {
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }
  ngOnInit(): void {
    this._service.settings$.pipe(
      takeUntil(this._onDestroy$),
      filter((settings: any) => settings && settings.id),
      map(settings => {
        this.featureTags = [...settings.featureTags];
        this.specialTags = [...settings.specialTags];
        this.banners = settings.banners || [];
        return settings;
      }),
    )
      .subscribe((settings) => {
        this.selectedFeatureTags = [...settings.featureTags];
        this.selectedSpecialTags = [...settings.specialTags];
      });
  }

  addFeatureTag() {
    if (!this.newFeatureTag) {
      this._toastService.showErrorToastr('Please enter a valid tag');
      return;
    }
    const index = this.featureTags ? this.featureTags.findIndex(item => this.newFeatureTag.toLowerCase() === item.toLowerCase()) : -1

    if (index > -1) {
      this._toastService.showErrorToastr("This tag already exists");
      return
    }
    this.featureTags.push(this.newFeatureTag)
    this.selectedFeatureTags.push(this.newFeatureTag)

  }
  addSpecialTag() {
    if (!this.newSpecialTag) {
      this._toastService.showErrorToastr('Please enter a valid tag');
      return;
    }
    const index = this.specialTags ? this.specialTags.findIndex(item => this.newSpecialTag.toLowerCase() === item.toLowerCase()) : -1

    if (index > -1) {
      this._toastService.showErrorToastr("This tag already exists");
      return
    }
    this.specialTags.push(this.newSpecialTag)
    this.selectedSpecialTags.push(this.newSpecialTag)

  }

  onUpdateClick() {
    const data = {
      featureTags: this.selectedFeatureTags,
      specialTags: this.selectedSpecialTags,
      banners: this.banners,
    }
    this._service.updateSettings(data)
      .pipe(
        take(1),
        map((response) => response))
      .subscribe((response) => {
        this._toastService.showErrorToastr("Successfully updated settings!");
      })
  }
  handleImageSelected(event) {
    this.banners = event
  }
}
