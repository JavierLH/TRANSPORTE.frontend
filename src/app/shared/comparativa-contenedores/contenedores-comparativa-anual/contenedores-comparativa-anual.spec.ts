import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenedoresComparativaAnual } from './contenedores-comparativa-anual';

describe('ContenedoresComparativaAnual', () => {
  let component: ContenedoresComparativaAnual;
  let fixture: ComponentFixture<ContenedoresComparativaAnual>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContenedoresComparativaAnual]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContenedoresComparativaAnual);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
