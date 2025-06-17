import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfdashboardComponent } from './profdashboard.component';

describe('ProfdashboardComponent', () => {
  let component: ProfdashboardComponent;
  let fixture: ComponentFixture<ProfdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfdashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
