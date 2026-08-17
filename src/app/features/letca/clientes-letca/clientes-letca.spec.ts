import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesLetca } from './clientes-letca';

describe('ClientesLetca', () => {
  let component: ClientesLetca;
  let fixture: ComponentFixture<ClientesLetca>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesLetca]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientesLetca);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
