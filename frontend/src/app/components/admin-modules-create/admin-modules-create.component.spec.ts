import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminModulesCreateComponent } from './admin-modules-create.component';

describe('AdminModulesCreateComponent', () => {
  let component: AdminModulesCreateComponent;
  let fixture: ComponentFixture<AdminModulesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminModulesCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminModulesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
