import dapodikRegionsData from "./dapodik-regions.json";

export interface KabupatenItem {
  kode_kab_kota: string;
  kabupaten_kota: string;
}

export interface ProvinsiItem {
  kode_prop: string;
  propinsi: string;
  kabupaten: KabupatenItem[];
}

export const DAPODIK_REGIONS: ProvinsiItem[] = dapodikRegionsData as ProvinsiItem[];

export const PROVINSI_LIST = DAPODIK_REGIONS.map((p) => ({
  kode: p.kode_prop,
  nama: p.propinsi,
}));

export function getKabupatenByProvinsi(kodeProp: string): KabupatenItem[] {
  const found = DAPODIK_REGIONS.find((p) => p.kode_prop === kodeProp);
  return found ? found.kabupaten : [];
}
