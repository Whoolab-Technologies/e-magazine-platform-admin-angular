import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent {
  @Input() edit: boolean = true;
  @Input() delete: boolean = true;
  @Input() view: boolean = true;
  @Input() data: any;
  @Input() index: number;

  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  @Output() onView: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

}
