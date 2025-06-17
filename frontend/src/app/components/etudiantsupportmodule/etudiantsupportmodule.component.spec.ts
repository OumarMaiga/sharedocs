import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantsupportmoduleComponent } from './etudiantsupportmodule.component';

describe('EtudiantsupportmoduleComponent', () => {
  let component: EtudiantsupportmoduleComponent;
  let fixture: ComponentFixture<EtudiantsupportmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtudiantsupportmoduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtudiantsupportmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
