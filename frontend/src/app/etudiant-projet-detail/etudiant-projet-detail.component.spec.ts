import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantProjetDetailComponent } from './etudiant-projet-detail.component';

describe('EtudiantProjetDetailComponent', () => {
  let component: EtudiantProjetDetailComponent;
  let fixture: ComponentFixture<EtudiantProjetDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtudiantProjetDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtudiantProjetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
