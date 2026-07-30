import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacionViajesLetca } from './programacion-viajes-letca';

describe('ProgramacionViajesLetca', () => {
  let component: ProgramacionViajesLetca;
  let fixture: ComponentFixture<ProgramacionViajesLetca>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramacionViajesLetca]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramacionViajesLetca);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
