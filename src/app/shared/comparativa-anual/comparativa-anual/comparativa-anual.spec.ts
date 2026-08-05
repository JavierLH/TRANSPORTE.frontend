import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparativaAnual } from './comparativa-anual';

describe('ComparativaAnual', () => {
  let component: ComparativaAnual;
  let fixture: ComponentFixture<ComparativaAnual>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparativaAnual]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparativaAnual);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
