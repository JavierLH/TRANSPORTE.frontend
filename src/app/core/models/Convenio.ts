export default interface Convenio {
  idConvenio?: number;
  noConvenio: string;
  idEmpresa: number;
  vigencia?: string; // formato yyyy-MM-dd (DateOnly? en el backend)
}
