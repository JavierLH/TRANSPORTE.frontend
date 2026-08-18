export interface ProgramacionDeViajesVista {
  folio: number; // Necesario
  idEmpresa?: number; // extra
  numeroViaje?: string; // Necesario
  numeroConvenio?: string; // necesario
  fecha?: string; // necesario
  cliente?: string; //necesario
  ejecutivo?: string; //mecesario
  //falta turno

  turno?: string;

  ecoRuta?: string;
  nombreOperador?: string;
  ecoRetira?: string;
  mercanciaDescripcion?: string;
  operacion?: string;
  nombreOrigen?: string;
  nombreDestino?: string;
  destinosEstadosCuidad?: string;
  comision?: number;
  gasto?: number;
  asignacion?: string;
  temperatura?: string;
  estatus?: number;
  estatusConDetalle?: string;
  ecoIngresa?: string;
  operadorIngresa?: string;
  sIngreso?: string;
  entrega?: string;
  horaCita?: string;
  envioPod?: string;
  envioAsignacion?: string;
  envioDocumentos?: string;
  envioCita?: string;
  envioCcp?: string;
  salidaPatio?: string;
  llegadaPlanta?: string;
  operadorRetira?: string;
  citaTerminal?: string;
  comentarios?: string;
}
