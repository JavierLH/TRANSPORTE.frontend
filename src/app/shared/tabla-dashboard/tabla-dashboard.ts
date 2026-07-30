import { Component, Input, ContentChild, TemplateRef, ChangeDetectorRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { Output, EventEmitter } from '@angular/core';
import { Button } from "primeng/button";
import { DialogModule } from 'primeng/dialog';
import { ModalAgregarviajeViaje } from '../agregarviaje-modal/modal-agregarviaje-viaje/modal-agregarviaje-viaje';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import { CrearNuevViajeDto } from '../../core/models/CrearNuevoViajeDto';

@Component({
  standalone: true,
  imports: [
    CommonModule, // Obligatorio para que funcione *ngTemplateOutlet
    TableModule, // Obligatorio para <p-table>
    IconFieldModule, // Para <p-iconfield>
    InputIconModule, // Para <p-inputicon>
    InputTextModule, // Para pInputText
    TagModule,
    Button,
    DialogModule,
    ModalAgregarviajeViaje,
    ToastModule,
    RippleModule
  ],
  providers: [MessageService],
  selector: 'app-tabla-dashboard',
  templateUrl: './tabla-dashboard.html',
  styleUrl: './tabla-dashboard.css',
})
export class TablaDashboardComponent implements OnInit{

  @Input() data: any[] = [];
  @Input() loading: boolean = false;
  @Input() dataKey: string = 'id';
  @Input() globalFilterFields: string[] = [];

  @ContentChild('headerTemplate') headerTemplate!: TemplateRef<any>;
  @ContentChild('bodyTemplate') bodyTemplate!: TemplateRef<any>;

  @Output() rowClicked = new EventEmitter<any>();

  @Input() datosEmpresa: any;

  private _filaSeleccionada: any;

  @Output() recargarTabla = new EventEmitter<void>(); // <-- 1. NUEVO: Evento para el Abuelo

  @Input()
  get filaSeleccionada(): any {
    return this._filaSeleccionada;
  }

  set filaSeleccionada(val: any) {
    this._filaSeleccionada = val;
    this.datos = val; // Sincroniza automáticamente con tu variable 'datos'
    this.rowClicked.emit(val);

    if (val) {
      console.log('Fila seleccionada:', val);

    } else {
      console.log('Fila deseleccionada');

    }
  }

  @Input() totalRecords: number = 0;
  @Input() rows: number = 20; // tamaño de página, antes estaba fijo en el HTML
  @Output() lazyLoad = new EventEmitter<{ pagina: number; tamanoPagina: number }>();

  onLazyLoad(event: any) {
    const pagina = Math.floor(event.first / event.rows) + 1;
    this.lazyLoad.emit({ pagina, tamanoPagina: event.rows });
  }

  constructor(){

  }

  ngOnInit() {
    console.log(this.datosEmpresa);
  }

  private messageService = inject(MessageService);
    private cdr = inject(ChangeDetectorRef);

    mostrarModal = false;
    tituloFormulario = 'Agregar Viaje KARVE';

    datos : any;

  onRowSelect(event: any) {
    /*alert('select')
    this.datos = event.data;
    this.rowClicked.emit(event.data);*/
  }

  onRowUnselect(event: any) {
    /*alert('unselect')
    console.log(event.data);
    this.datos = null; // Esto es clave para que el botón vuelva a mostrar el toast
    this.rowClicked.emit(null);*/
  }


  abrirModal(titulo: string) {
    this.tituloFormulario = titulo;
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  agregarViaje() {
    this.datosEmpresa.tipoDeOperacion = "CREAR";
    this.abrirModal('Agregar viaje karve');
  }


  cerrarModal() {
      this.mostrarModal = false;
      this.cdr.detectChanges();
  }

  gestionarEdicion() {
    if (this.filaSeleccionada) {
      this.datosEmpresa.tipoDeOperacion = "EDITAR";
      this.abrirModal('Editar viaje karve');
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Por favor, seleccione una fila para editar.'
      });
    }
  }

viajeGuardadoConExito() {
    this.cerrarModal();
    this.recargarTabla.emit(); // Disparamos el aviso hacia el componente Padre (Principal)
  }

  showWarn() {

    if(!this.datos){
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Message Content' });
    }

  }




}









