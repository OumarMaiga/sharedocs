import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClassesListComponent } from './admin-classes-list.component';

describe('AdminClassesListComponent', () => {
  let component: AdminClassesListComponent;
  let fixture: ComponentFixture<AdminClassesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminClassesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminClassesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
