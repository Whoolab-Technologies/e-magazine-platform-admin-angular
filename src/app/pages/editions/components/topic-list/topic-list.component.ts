import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.scss']
})
export class TopicListComponent {
  @Input() topics: any
  @Output() onClickFile: EventEmitter<string> = new EventEmitter<string>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,) {

  }

  onDelete(event: number) {

    if (this.topics[event]) {
      this.topics.splice(event, 1);
      this._changeDetectorRef.detectChanges()
    }
  }

}
