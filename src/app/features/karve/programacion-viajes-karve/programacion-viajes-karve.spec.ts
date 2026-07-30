import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacionViajesKarve } from './programacion-viajes-karve';

describe('ProgramacionViajesKarve', () => {
  let component: ProgramacionViajesKarve;
  let fixture: ComponentFixture<ProgramacionViajesKarve>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramacionViajesKarve]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramacionViajesKarve);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
