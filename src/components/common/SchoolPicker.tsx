import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, School, Search, ChevronDown, Loader2, X, Edit3, CheckCircle2, AlertCircle } from "lucide-react";
import { PROVINSI_LIST, getKabupatenByProvinsi, KabupatenItem } from "../../data/school-regions";
import { useTheme } from "../../utils/theme-context";

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
  const [isLoadingSekolah, setIsLoadingSekolah] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualValue, setManualValue] = useState(value || "");
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSekolahList, setShowSekolahList] = useState(false);
  const [isChanging, setIsChanging] = useState(!value);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Update kabupaten list INSTANTLY when provinsi changes
  useEffect(() => {
    if (!selectedProvinsi) {
      setKabList([]);
      setSelectedKab("");
      setSekolahList([]);
      return;
    }
    const kabs = getKabupatenByProvinsi(selectedProvinsi);
    setKabList(kabs);
    setSelectedKab("");
    setSekolahList([]);
    setSearchQuery("");
    setApiError(null);
  }, [selectedProvinsi]);

  // Fetch sekolah when kabupaten changes
  const fetchSekolah = useCallback(() => {
    if (!selectedKab) return;
    setIsLoadingSekolah(true);
    setApiError(null);
    setSekolahList([]);
    setSearchQuery("");

    fetch(`${API_BASE}?kab_kota=${selectedKab}&perPage=500`)
      .then((r) => r.json())
      .then((json) => {
        if (json && Array.isArray(json.dataSekolah)) {
          const list: SekolahItem[] = json.dataSekolah.map((s: any) => ({
            npsn: s.npsn,
            sekolah: s.sekolah,
            status: s.status,
            kecamatan: s.kecamatan,
            alamat_jalan: s.alamat_jalan,
          }));
          setSekolahList(list.sort((a, b) => a.sekolah.localeCompare(b.sekolah)));
          setShowSekolahList(true);
        } else {
          setSekolahList([]);
        }
      })
      .catch(() => setApiError("Gagal memuat daftar sekolah dari Dapodik. Anda dapat mengisi manual."))
      .finally(() => setIsLoadingSekolah(false));
  }, [selectedKab]);

  useEffect(() => {
    if (selectedKab) fetchSekolah();
  }, [selectedKab, fetchSekolah]);

  // Filter sekolah by search input
  const filteredSekolah = sekolahList.filter((s) =>
    s.sekolah.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.npsn.includes(searchQuery)
  );

  // Handle select sekolah
  const handleSelectSekolah = (s: SekolahItem) => {
    onChange(s.sekolah, s.npsn);
    setShowSekolahList(false);
    setIsChanging(false);
    setSearchQuery("");
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

  // Mode Manual
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
            placeholder="Ketik nama sekolah SMK Anda"
            disabled={disabled}
            required={required}
            className={`${inputCls} pl-9`}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setIsManualMode(false);
            setIsChanging(true);
          }}
          className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline font-semibold"
        >
          ← Pilih dari daftar resmi Dapodik
        </button>
      </div>
    );
  }

  // Jika sekolah sudah terpilih dan tidak sedang mode edit/ganti
  if (value && !isChanging) {
    return (
      <div className="space-y-1.5">
        <div className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-xs ${
          isDark ? "border-brand-600 bg-brand-900/30 text-brand-300" : "border-brand-500 bg-brand-50 text-brand-800"
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
            <div className="min-w-0">
              <div className="font-bold truncate">{value}</div>
              {npsn ? (
                <div className="text-[10px] opacity-75 font-mono">NPSN: {npsn} (Dapodik Resmi)</div>
              ) : (
                <div className="text-[10px] opacity-75">Input Manual</div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsChanging(true);
              setShowSekolahList(false);
            }}
            disabled={disabled}
            className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline px-2 py-1 rounded whitespace-nowrap"
          >
            Ganti Sekolah
          </button>
        </div>
      </div>
    );
  }

  // Dropdown Picker: Provinsi -> Kabupaten/Kota -> Nama Sekolah
  return (
    <div className="space-y-2" ref={dropdownRef}>
      {/* Row 1: Dropdown Provinsi */}
      <div className="relative">
        <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <select
          value={selectedProvinsi}
          onChange={(e) => setSelectedProvinsi(e.target.value)}
          disabled={disabled}
          className={`${selectCls} pl-8 pr-8`}
        >
          <option value="">— 1. Pilih Provinsi —</option>
          {PROVINSI_LIST.map((p) => (
            <option key={p.kode} value={p.kode}>
              {p.nama}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>

      {/* Row 2: Dropdown Kabupaten / Kota (Sesuai Provinsi yang Dipilih) */}
      {selectedProvinsi && (
        <div className="relative">
          <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={selectedKab}
            onChange={(e) => setSelectedKab(e.target.value)}
            disabled={disabled || kabList.length === 0}
            className={`${selectCls} pl-8 pr-8`}
          >
            <option value="">— 2. Pilih Kabupaten / Kota ({kabList.length} daerah) —</option>
            {kabList.map((k) => (
              <option key={k.kode_kab_kota} value={k.kode_kab_kota}>
                {k.kabupaten_kota}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      )}

      {/* Row 3: Pencarian & Pilihan Nama SMK */}
      {selectedKab && (
        <div className="relative">
          {isLoadingSekolah ? (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Memuat daftar SMK di daerah ini...
            </div>
          ) : (
            <>
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSekolahList(true);
                }}
                onFocus={() => setShowSekolahList(true)}
                placeholder={`3. Cari & pilih SMK (${sekolahList.length} sekolah tersedia)...`}
                className={`${inputCls} pl-8`}
                disabled={disabled}
              />

              {/* Dropdown list hasil pencarian */}
              {showSekolahList && (
                <div className={`absolute top-full left-0 right-0 z-50 mt-1 rounded-xl border shadow-xl overflow-hidden ${
                  isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                }`}>
                  <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredSekolah.length === 0 ? (
                      <div className="px-4 py-5 text-center text-xs text-slate-400">
                        <AlertCircle className="w-5 h-5 mx-auto mb-1 opacity-50" />
                        Tidak ada sekolah yang cocok dengan "{searchQuery}".
                        <br />
                        <button
                          type="button"
                          onClick={() => {
                            setIsManualMode(true);
                            setManualValue(searchQuery || value || "");
                            onChange(searchQuery || value || "", undefined);
                          }}
                          className="mt-2 text-brand-500 hover:underline font-bold"
                        >
                          Gunakan "{searchQuery}" sebagai input manual
                        </button>
                      </div>
                    ) : (
                      filteredSekolah.slice(0, 100).map((s) => (
                        <button
                          key={s.npsn}
                          type="button"
                          onClick={() => handleSelectSekolah(s)}
                          className={`w-full text-left px-3.5 py-2.5 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors ${
                            isDark ? "hover:bg-slate-700" : ""
                          }`}
                        >
                          <div className={`text-xs font-bold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                            {s.sekolah}
                            <span className={`ml-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                              s.status === 'N'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                            }`}>
                              {s.status === 'N' ? 'Negeri' : 'Swasta'}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>NPSN: <strong className="text-slate-600 dark:text-slate-300">{s.npsn}</strong></span>
                            {s.kecamatan && <span>• {s.kecamatan}</span>}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Error API */}
      {apiError && (
        <div className="flex items-center gap-2 text-[11px] text-red-500">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {apiError}
        </div>
      )}

      {/* Tombol opsi manual / batal */}
      <div className="flex items-center justify-between text-[11px] pt-0.5">
        <button
          type="button"
          onClick={() => {
            setIsManualMode(true);
            setManualValue(value || "");
          }}
          className="text-slate-400 hover:text-brand-500 font-semibold flex items-center gap-1"
        >
          <Edit3 className="w-3 h-3" />
          Sekolah tidak ada di daftar? Isi manual
        </button>

        {value && isChanging && (
          <button
            type="button"
            onClick={() => setIsChanging(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Batal ganti
          </button>
        )}
      </div>
    </div>
  );
};
