import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFilieresListComponent } from './admin-filieres-list.component';

describe('AdminFilieresListComponent', () => {
  let component: AdminFilieresListComponent;
  let fixture: ComponentFixture<AdminFilieresListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFilieresListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFilieresListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
