import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNiveauxListComponent } from './admin-niveaux-list.component';

describe('AdminNiveauxListComponent', () => {
  let component: AdminNiveauxListComponent;
  let fixture: ComponentFixture<AdminNiveauxListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNiveauxListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNiveauxListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
