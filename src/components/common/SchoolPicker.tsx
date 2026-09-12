import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, School, Search, ChevronDown, Loader2, X, Edit3, CheckCircle2, AlertCircle } from "lucide-react";
import { PROVINSI_LIST } from "../../data/school-regions";
import { useTheme } from "../../utils/theme-context";

// ────────────────────────────────────────────────────────
//  Types
// ────────────────────────────────────────────────────────
interface KabupatenItem {
  kode_kab_kota: string;
  kabupaten_kota: string;
}

interface SekolahItem {
  npsn: string;
  sekolah: string;
  status: string; // "N" = Negeri, "S" = Swasta
  kecamatan?: string;
  alamat_jalan?: string;
}

export interface SchoolPickerProps {
  value: string;
  npsn?: string;
  onChange: (schoolName: string, npsn?: string) => void;
  disabled?: boolean;
  required?: boolean;
}

const API_BASE = "https://api-sekolah-indonesia.vercel.app/sekolah/smk";

// ────────────────────────────────────────────────────────
//  Helper
// ────────────────────────────────────────────────────────
function cleanKabName(raw: string) {
  return raw.replace(/^(Kota|Kab\.\s*)/i, "").trim();
}

// ────────────────────────────────────────────────────────
//  Component
// ────────────────────────────────────────────────────────
export const SchoolPicker: React.FC<SchoolPickerProps> = ({
  value,
  npsn,
  onChange,
  disabled = false,
  required = false,
}) => {
  const { isDark } = useTheme();

  // State
  const [selectedProvinsi, setSelectedProvinsi] = useState("");
  const [selectedKab, setSelectedKab] = useState("");
  const [kabList, setKabList] = useState<KabupatenItem[]>([]);
  const [sekolahList, setSekolahList] = useState<SekolahItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingKab, setIsLoadingKab] = useState(false);
  const [isLoadingSekolah, setIsLoadingSekolah] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualValue, setManualValue] = useState(value || "");
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSekolahList, setShowSekolahList] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Fetch kabupaten when provinsi changes
  useEffect(() => {
    if (!selectedProvinsi) {
      setKabList([]);
      setSelectedKab("");
      setSekolahList([]);
      return;
    }
    setIsLoadingKab(true);
    setApiError(null);
    setSelectedKab("");
    setSekolahList([]);
    setSearchQuery("");

    fetch(`${API_BASE}?propinsi=${selectedProvinsi}&perPage=500`)
      .then((r) => r.json())
      .then((json) => {
        if (json.dataSekolah) {
          // Ekstrak kabupaten unik dari data sekolah
          const kabMap = new Map<string, string>();
          json.dataSekolah.forEach((s: any) => {
            if (s.kode_kab_kota && s.kabupaten_kota) {
              kabMap.set(s.kode_kab_kota.trim(), s.kabupaten_kota);
            }
          });
          const list: KabupatenItem[] = Array.from(kabMap.entries())
            .map(([kode, nama]) => ({ kode_kab_kota: kode, kabupaten_kota: nama }))
            .sort((a, b) => a.kabupaten_kota.localeCompare(b.kabupaten_kota));
          setKabList(list);
        }
      })
      .catch(() => setApiError("Gagal memuat data kabupaten. Cek koneksi internet."))
      .finally(() => setIsLoadingKab(false));
  }, [selectedProvinsi]);

  // Fetch sekolah when kabupaten changes
  const fetchSekolah = useCallback(() => {
    if (!selectedProvinsi || !selectedKab) return;
    setIsLoadingSekolah(true);
    setApiError(null);
    setSekolahList([]);
    setSearchQuery("");

    fetch(`${API_BASE}?propinsi=${selectedProvinsi}&kabupaten=${selectedKab}&perPage=500`)
      .then((r) => r.json())
      .then((json) => {
        if (json.dataSekolah) {
          const list: SekolahItem[] = json.dataSekolah.map((s: any) => ({
            npsn: s.npsn,
            sekolah: s.sekolah,
            status: s.status,
            kecamatan: s.kecamatan,
            alamat_jalan: s.alamat_jalan,
          }));
          setSekolahList(list.sort((a, b) => a.sekolah.localeCompare(b.sekolah)));
          setShowSekolahList(true);
        }
      })
      .catch(() => setApiError("Gagal memuat data sekolah. Coba lagi atau isi manual."))
      .finally(() => setIsLoadingSekolah(false));
  }, [selectedProvinsi, selectedKab]);

  useEffect(() => {
    if (selectedKab) fetchSekolah();
  }, [selectedKab, fetchSekolah]);

  // Filter sekolah by search
  const filteredSekolah = sekolahList.filter((s) =>
    s.sekolah.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.npsn.includes(searchQuery)
  );

  // Handle select sekolah
  const handleSelectSekolah = (s: SekolahItem) => {
    onChange(s.sekolah, s.npsn);
    setShowSekolahList(false);
    setSearchQuery("");
    setTimeout(() => searchRef.current?.blur(), 100);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSekolahList(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const inputCls = `w-full px-3 py-2.5 rounded-xl text-xs border ${
    isDark
      ? "border-slate-700 bg-slate-800 text-white placeholder-slate-500"
      : "border-slate-300 bg-white text-slate-900 placeholder-slate-400"
  } outline-none focus:border-brand-500 shadow-xs transition-colors`;

  const selectCls = `w-full px-3 py-2.5 rounded-xl text-xs border appearance-none ${
    isDark
      ? "border-slate-700 bg-slate-800 text-white"
      : "border-slate-300 bg-white text-slate-900"
  } outline-none focus:border-brand-500 shadow-xs`;

  // ── Render ──────────────────────────────────────────
  if (isManualMode) {
    return (
      <div className="space-y-1.5">
        <div className="relative">
          <School className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={manualValue}
            onChange={(e) => {
              setManualValue(e.target.value);
              onChange(e.target.value, undefined);
            }}
            placeholder="Ketik nama sekolah Anda"
            disabled={disabled}
            required={required}
            className={`${inputCls} pl-9`}
          />
        </div>
        <button
          type="button"
          onClick={() => setIsManualMode(false)}
          className="text-[11px] text-brand-500 hover:underline font-semibold"
        >
          ← Pilih dari daftar Dapodik
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2" ref={dropdownRef}>
      {/* Row 1: Pilih Provinsi */}
      <div className="relative">
        <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <select
          value={selectedProvinsi}
          onChange={(e) => setSelectedProvinsi(e.target.value)}
          disabled={disabled}
          className={`${selectCls} pl-8 pr-8`}
        >
          <option value="">— Pilih Provinsi —</option>
          {PROVINSI_LIST.map((p) => (
            <option key={p.kode} value={p.kode}>
              {p.nama}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>

      {/* Row 2: Pilih Kabupaten */}
      {selectedProvinsi && (
        <div className="relative">
          {isLoadingKab ? (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Memuat kabupaten/kota...
            </div>
          ) : (
            <>
              <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={selectedKab}
                onChange={(e) => setSelectedKab(e.target.value)}
                disabled={disabled || kabList.length === 0}
                className={`${selectCls} pl-8 pr-8`}
              >
                <option value="">— Pilih Kabupaten / Kota —</option>
                {kabList.map((k) => (
                  <option key={k.kode_kab_kota} value={k.kode_kab_kota}>
                    {k.kabupaten_kota}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </>
          )}
        </div>
      )}

      {/* Row 3: Search & Pilih Sekolah */}
      {selectedKab && (
        <div className="relative">
          {isLoadingSekolah ? (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Memuat daftar SMK...
            </div>
          ) : (
            <>
              {/* Selected school display */}
              {value && !showSekolahList ? (
                <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs ${
                  isDark ? "border-brand-600 bg-brand-900/30 text-brand-300" : "border-brand-500 bg-brand-50 text-brand-700"
                }`}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-brand-500" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate">{value}</div>
                    {npsn && <div className="text-[10px] opacity-70">NPSN: {npsn}</div>}
                  </div>
                  <button
                    type="button"
                    onClick={() => { setShowSekolahList(true); setSearchQuery(""); onChange("", undefined); }}
                    className="p-0.5 rounded text-slate-400 hover:text-red-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowSekolahList(true); }}
                    onFocus={() => setShowSekolahList(true)}
                    placeholder={`Cari nama SMK (${sekolahList.length} sekolah)...`}
                    className={`${inputCls} pl-8`}
                    disabled={disabled}
                  />
                  {/* Dropdown list */}
                  {showSekolahList && (
                    <div className={`absolute top-full left-0 right-0 z-50 mt-1 rounded-xl border shadow-xl overflow-hidden ${
                      isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                    }`}>
                      <div className={`max-h-52 overflow-y-auto`}>
                        {filteredSekolah.length === 0 ? (
                          <div className="px-4 py-6 text-center text-xs text-slate-400">
                            <AlertCircle className="w-5 h-5 mx-auto mb-1 opacity-50" />
                            Sekolah tidak ditemukan. Coba isi manual.
                          </div>
                        ) : (
                          filteredSekolah.slice(0, 80).map((s) => (
                            <button
                              key={s.npsn}
                              type="button"
                              onClick={() => handleSelectSekolah(s)}
                              className={`w-full text-left px-3 py-2.5 hover:bg-brand-50 dark:hover:bg-brand-900/30 border-b last:border-b-0 transition-colors ${
                                isDark ? "border-slate-700" : "border-slate-100"
                              }`}
                            >
                              <div className={`text-xs font-bold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                                {s.sekolah}
                                <span className={`ml-1.5 text-[9px] font-normal px-1 py-0.5 rounded ${
                                  s.status === 'N'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                                }`}>
                                  {s.status === 'N' ? 'Negeri' : 'Swasta'}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                NPSN: {s.npsn}{s.kecamatan ? ` • ${s.kecamatan}` : ''}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* API Error */}
      {apiError && (
        <div className="flex items-center gap-2 text-[11px] text-red-500">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {apiError}
        </div>
      )}

      {/* Toggle manual */}
      <button
        type="button"
        onClick={() => { setIsManualMode(true); setManualValue(value || ""); }}
        className="text-[11px] text-slate-400 hover:text-brand-500 font-semibold flex items-center gap-1"
      >
        <Edit3 className="w-3 h-3" />
        Sekolah tidak ada di daftar? Isi manual
      </button>
    </div>
  );
};
