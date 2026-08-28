import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperadoresLetca } from './operadores-letca';

describe('OperadoresLetca', () => {
  let component: OperadoresLetca;
  let fixture: ComponentFixture<OperadoresLetca>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperadoresLetca]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperadoresLetca);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
