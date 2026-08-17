import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesKarve } from './clientes-karve';

describe('ClientesKarve', () => {
  let component: ClientesKarve;
  let fixture: ComponentFixture<ClientesKarve>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesKarve]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientesKarve);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
