import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfmoduledetailsComponent } from './profmoduledetails.component';

describe('ProfmoduledetailsComponent', () => {
  let component: ProfmoduledetailsComponent;
  let fixture: ComponentFixture<ProfmoduledetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfmoduledetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfmoduledetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
