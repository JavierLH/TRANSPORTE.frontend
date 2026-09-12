import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifarioVikingo } from './tarifario-vikingo';

describe('TarifarioVikingo', () => {
  let component: TarifarioVikingo;
  let fixture: ComponentFixture<TarifarioVikingo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarifarioVikingo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarifarioVikingo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
