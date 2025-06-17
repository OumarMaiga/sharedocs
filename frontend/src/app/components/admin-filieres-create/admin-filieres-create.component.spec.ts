import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFilieresCreateComponent } from './admin-filieres-create.component';

describe('AdminFilieresCreateComponent', () => {
  let component: AdminFilieresCreateComponent;
  let fixture: ComponentFixture<AdminFilieresCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFilieresCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFilieresCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
