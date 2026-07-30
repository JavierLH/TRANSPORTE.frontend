import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacionViajesVikingo } from './programacion-viajes-vikingo';

describe('ProgramacionViajesVikingo', () => {
  let component: ProgramacionViajesVikingo;
  let fixture: ComponentFixture<ProgramacionViajesVikingo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramacionViajesVikingo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramacionViajesVikingo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
