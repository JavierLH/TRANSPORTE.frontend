import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjecutivosDrakkar } from './ejecutivos-drakkar';

describe('EjecutivosDrakkar', () => {
  let component: EjecutivosDrakkar;
  let fixture: ComponentFixture<EjecutivosDrakkar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjecutivosDrakkar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjecutivosDrakkar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
