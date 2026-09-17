import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTarifarioVkKv } from './modal-tarifario-vk-kv';

describe('ModalTarifarioVkKv', () => {
  let component: ModalTarifarioVkKv;
  let fixture: ComponentFixture<ModalTarifarioVkKv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTarifarioVkKv]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTarifarioVkKv);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
