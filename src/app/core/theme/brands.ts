import { Preset } from "@primeuix/themes/types";
import { DrakkarPreset } from "./presets/drakkar.presets";
import { KarvePreset } from "./presets/karve.presets";
import { LetcaPreset } from "./presets/letca.presets";
import { VikingoPreset } from "./presets/vikingo.presets";


export type BrandKey = 'vikingo' | 'karve' | 'drakkar' | 'letca';

export interface Brand {
  key: BrandKey;
  nombre: string;
  logo: string;
  preset: Preset;
}

export const BRANDS: Record<BrandKey, Brand> = {
  vikingo: { key: 'vikingo', nombre: 'Vikingo', logo: 'logos/vikingo.svg', preset: VikingoPreset },
  karve:   { key: 'karve',   nombre: 'Karve',   logo: 'logos/karve.svg',   preset: KarvePreset },
  drakkar: { key: 'drakkar', nombre: 'Drakkar', logo: 'logos/drakkar.svg', preset: DrakkarPreset },
  letca:   { key: 'letca',   nombre: 'Letca',   logo: 'logos/letca.svg',   preset: LetcaPreset },
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
  return key && key in BRANDS ? key : BRAND_DEFAULT;
}
