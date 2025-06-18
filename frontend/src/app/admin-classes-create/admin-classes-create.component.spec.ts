import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClassesCreateComponent } from './admin-classes-create.component';

describe('AdminClassesCreateComponent', () => {
  let component: AdminClassesCreateComponent;
  let fixture: ComponentFixture<AdminClassesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminClassesCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminClassesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
