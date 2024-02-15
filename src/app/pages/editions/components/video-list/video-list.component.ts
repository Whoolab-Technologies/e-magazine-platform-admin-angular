import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent {
  @Input() videos: any
  @Output() onClickFile: EventEmitter<string> = new EventEmitter<string>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,) {

  }

  onDelete(event: number) {

    if (this.videos[event]) {
      this.videos.splice(event, 1);
      this._changeDetectorRef.detectChanges()
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.videos, event.previousIndex, event.currentIndex);
  }

}
