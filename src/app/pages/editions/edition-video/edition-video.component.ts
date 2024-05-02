import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastPositionTypes } from '@app/shared/model/toast';
import { AppService, allowedVideoTypes } from '@app/shared/services/app/app.service';
import { ToastService } from '@app/shared/services/toast/toast.service';
import { filter, map } from 'rxjs';
import { Video } from '../models/video';

@Component({
  selector: 'app-edition-video',
  templateUrl: './edition-video.component.html',
  styleUrls: ['./edition-video.component.scss']
})
export class EditionVideoComponent {
  video: Video = { page: 1, link: "", topic: "" };
  @Input() videos: Video[] = [];
  @Output() onUpdateVideoList = new EventEmitter<Video[]>();
  isVideFileUploading: boolean = false;
  videoFile: string = "";
  toastrPositionTypes: typeof ToastPositionTypes = ToastPositionTypes;

  constructor(
    private _toastService: ToastService,
    private _appService: AppService,
  ) {

  }

  addVideo() {
    if (!this.videos) {
      this.videos = [];
    }
    if (this.video.page && this.video.link) {

      this.videos.push(this.video);
      this.onUpdateVideoList.emit(this.videos);
      this.videoFile = "";
      this.video = { page: this.video.page, link: "", topic: "" };
    }
    else {
      this._toastService.showInfoToastr("Enter a valid page number and select a video file", this.toastrPositionTypes.topRight);
    }
  }
  videoFileChangeEvent(event) {

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0]
      if (!allowedVideoTypes().includes(file.type)) {
        this._toastService.showInfoToastr("Please a valid image file", this.toastrPositionTypes.bottomRight)
        return
      }
      this.isVideFileUploading = true;
      this.uploadFile("editions/videos", file).pipe(map(url => {
        return url
      }
      )).subscribe((url) => {
        this.video.link = url;
        this.videoFile = file.name;
        this.isVideFileUploading = false;

      }, _error => {
        this.isVideFileUploading = false;

      });
    }
  }
  uploadFile(path, file): any {
    return this._appService.uploadImage(path, file, file.name).pipe(filter(resp => resp), map(resp => {
      return resp;
    }));
  }

  openFile(event) {

  }
}

