import { Preset } from "@primeuix/themes/types";
import { DrakkarPreset } from "./presets/drakkar.presets";
import { GrupoPreset } from "./presets/grupo.presets";
import { KarvePreset } from "./presets/karve.presets";
import { LetcaPreset } from "./presets/letca.presets";
import { VikingoPreset } from "./presets/vikingo.presets";


export type BrandKey = 'vikingo' | 'karve' | 'drakkar' | 'letca' | 'grupo';

export interface Brand {
  key: BrandKey;
  nombre: string;
  logo: string;
  preset: Preset;

  /**
   * Si es una empresa real o un tema de pantalla. `grupo` no es una
   * empresa: no se persiste como la última elegida ni debe aparecer
   * donde se listen empresas.
   */
  esEmpresa: boolean;
}

export const BRANDS: Record<BrandKey, Brand> = {
  vikingo: { key: 'vikingo', nombre: 'Vikingo', logo: 'logos/vikingo.svg', preset: VikingoPreset, esEmpresa: true },
  karve:   { key: 'karve',   nombre: 'Karve',   logo: 'logos/karve.svg',   preset: KarvePreset,   esEmpresa: true },
  drakkar: { key: 'drakkar', nombre: 'Drakkar', logo: 'logos/drakkar.svg', preset: DrakkarPreset, esEmpresa: true },
  letca:   { key: 'letca',   nombre: 'Letca',   logo: 'logos/letca.svg',   preset: LetcaPreset,   esEmpresa: true },
  grupo:   { key: 'grupo',   nombre: 'Grupo',   logo: 'logos/grupo.svg',   preset: GrupoPreset,   esEmpresa: false },
};

export const BRAND_DEFAULT: BrandKey = 'vikingo';

export const BRAND_STORAGE_KEY = 'brand';

/**
 * Marca persistida en localStorage, validada contra el catálogo.
 * Se lee en `app.config.ts` para que `providePrimeNG` arranque ya con el
 * preset correcto: aplicarlo después con `usePreset` llega tarde, porque
 * el effect interno de PrimeNG lo sobrescribe en la primera detección de cambios.
 */
export function marcaGuardada(): BrandKey {
  if (typeof localStorage === 'undefined') return BRAND_DEFAULT;
  const key = localStorage.getItem(BRAND_STORAGE_KEY) as BrandKey | null;
  // Sólo empresas: arrancar la app en el tema de grupo dejaría todo gris
  // hasta que el usuario entrara a una pantalla de empresa.
  return key && BRANDS[key]?.esEmpresa ? key : BRAND_DEFAULT;
}
