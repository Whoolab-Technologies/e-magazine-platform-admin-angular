import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionsListComponent } from './editions-list.component';

describe('EditionsListComponent', () => {
  let component: EditionsListComponent;
  let fixture: ComponentFixture<EditionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditionsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
