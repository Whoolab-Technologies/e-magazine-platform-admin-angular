import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Video } from '../../models/video';

@Component({
  standalone: false,
  selector: 'app-video-item',
  templateUrl: './video-item.component.html',
  styleUrls: ['./video-item.component.scss']
})
export class VideoItemComponent {
  @Input() video: Video;
  @Input() index: number = 0;
  @Output() onDelete: EventEmitter<number> = new EventEmitter<number>();
  @Output() onClickFile: EventEmitter<string> = new EventEmitter<string>();


  constructor() { }
}
