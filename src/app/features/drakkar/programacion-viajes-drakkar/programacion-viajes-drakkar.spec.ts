import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacionViajesDrakkar } from './programacion-viajes-drakkar';

describe('ProgramacionViajesDrakkar', () => {
  let component: ProgramacionViajesDrakkar;
  let fixture: ComponentFixture<ProgramacionViajesDrakkar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramacionViajesDrakkar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramacionViajesDrakkar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
