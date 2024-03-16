import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastPositionTypes } from '@app/shared/model/toast';
import { AppService, allowedImageTypes } from '@app/shared/services/app/app.service';
import { ToastService } from '@app/shared/services/toast/toast.service';
import { filter, finalize, map, tap } from 'rxjs';



@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss']
})
export class ImageSelectorComponent implements OnInit {
  selectedFile: File | null = null;
  isImageUploading: boolean = false;
  selectedFileName: string | null;
  previewUrl: string | ArrayBuffer | null = null;
  @Input() uploadedImages: string[] = [];
  @Output() imageSelected: EventEmitter<string[]> = new EventEmitter();
  toastrPositionTypes: typeof ToastPositionTypes = ToastPositionTypes;

  constructor(private http: HttpClient,
    private _appService: AppService,
    private _toastService: ToastService) { }
  ngOnInit(): void {

  }

  onFileSelected(event: any) {
    console.log('event.target.files[0] => ', event.target.files[0])
    this.selectedFile = event.target.files[0];
    this.selectedFileName = this.selectedFile?.name || '';
    this.previewSelectedImage();
  }

  uploadImage() {
    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }
    if (!allowedImageTypes().includes(this.selectedFile.type)) {
      this._toastService.showInfoToastr("Please a valid image file", this.toastrPositionTypes.bottomRight)
      return
    }
    this.isImageUploading = true;
    this.uploadFile("banners", this.selectedFile).pipe(
      tap(() => {
        this.isImageUploading = false;
      }),
      map(url => {
        return url
      }
      )).subscribe((url) => {
        this.uploadedImages.push(url);
        this.selectedFile = null;
        this.previewUrl = null;
        this.selectedFileName = null;
        this.imageSelected.emit(this.uploadedImages)

      }, _error => {
        this._toastService.showErrorToastr("Something went wrong while uploading the Image")
      });
  }
  openFile(event) {

    // Convert data URL to Blob
    const byteString = atob(event.split(',')[1]);
    const mimeString = event.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    // Create URL object from Blob
    const blobUrl = URL.createObjectURL(blob);

    // Open the Blob URL in a new tab
    window.open(blobUrl);

    // Clean up by revoking the Blob URL after some time (optional)
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  }

  deleteImage(url: string) {
    this.uploadedImages = this.uploadedImages.filter(image => image !== url);
    this.imageSelected.emit(this.uploadedImages)
  }

  previewSelectedImage() {
    if (!this.selectedFile) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      this.previewUrl = event.target?.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  uploadFile(path, file): any {
    return this._appService.uploadImage(path, file).pipe(filter(resp => resp), map(resp => {
      return resp;
    }));
  }

}
