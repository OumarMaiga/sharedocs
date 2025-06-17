import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminModulesListComponent } from './admin-modules-list.component';

describe('AdminModulesListComponent', () => {
  let component: AdminModulesListComponent;
  let fixture: ComponentFixture<AdminModulesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminModulesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminModulesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
