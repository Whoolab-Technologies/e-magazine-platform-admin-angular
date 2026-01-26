import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditUpdateComponent } from './admin-edit-update.component';

describe('AdminEditUpdateComponent', () => {
  let component: AdminEditUpdateComponent;
  let fixture: ComponentFixture<AdminEditUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEditUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
