import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantProjetsComponent } from './etudiant-projets.component';

describe('EtudiantProjetsComponent', () => {
  let component: EtudiantProjetsComponent;
  let fixture: ComponentFixture<EtudiantProjetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtudiantProjetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtudiantProjetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
