import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrosVikingo } from './registros-vikingo';

describe('RegistrosVikingo', () => {
  let component: RegistrosVikingo;
  let fixture: ComponentFixture<RegistrosVikingo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrosVikingo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrosVikingo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
