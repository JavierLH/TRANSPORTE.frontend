import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrosDrakkar } from './registros-drakkar';

describe('RegistrosDrakkar', () => {
  let component: RegistrosDrakkar;
  let fixture: ComponentFixture<RegistrosDrakkar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrosDrakkar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrosDrakkar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
