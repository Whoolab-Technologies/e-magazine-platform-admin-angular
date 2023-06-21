import { Component, OnInit } from '@angular/core';
import { ClassesService } from '../services/classes.service';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss']
})
export class ClassListComponent implements OnInit {

  constructor(public classService: ClassesService) {

  }
  ngOnInit(): void {

  }

  edit(clss: any) {
    console.log(clss);
  }

  delete(clss: any) {
    console.log(clss);
  }

  add() {

  }
}
