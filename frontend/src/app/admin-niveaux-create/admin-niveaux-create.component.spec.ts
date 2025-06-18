import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNiveauxCreateComponent } from './admin-niveaux-create.component';

describe('AdminNiveauxCreateComponent', () => {
  let component: AdminNiveauxCreateComponent;
  let fixture: ComponentFixture<AdminNiveauxCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNiveauxCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNiveauxCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
