import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfmodulesComponent } from './profmodules.component';

describe('ProfmodulesComponent', () => {
  let component: ProfmodulesComponent;
  let fixture: ComponentFixture<ProfmodulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfmodulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfmodulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
