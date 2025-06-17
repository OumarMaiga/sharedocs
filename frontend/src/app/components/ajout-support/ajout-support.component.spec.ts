import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutSupportComponent } from './ajout-support.component';

describe('AjoutSupportComponent', () => {
  let component: AjoutSupportComponent;
  let fixture: ComponentFixture<AjoutSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutSupportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
