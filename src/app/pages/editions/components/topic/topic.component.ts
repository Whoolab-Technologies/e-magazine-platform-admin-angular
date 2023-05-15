import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent {
  @Input() topic: any
  @Input() index: number = 0;
  @Output() onDelete: EventEmitter<number> = new EventEmitter<number>();
  @Output() onClickFile: EventEmitter<string> = new EventEmitter<string>();
}
