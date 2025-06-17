import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfSidebarComponent } from './prof-sidebar.component';

describe('ProfSidebarComponent', () => {
  let component: ProfSidebarComponent;
  let fixture: ComponentFixture<ProfSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
