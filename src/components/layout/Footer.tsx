import React from 'react';
import { Briefcase, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white">SiapKerja</span>
              <span className="text-[10px] bg-brand-900 text-brand-300 font-semibold px-2 py-0.5 rounded border border-brand-700">
                Official Prep
              </span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed text-xs">
              Platform latihan psikotes kerja, simulasi tes koran (Kraepelin/Pauli), tes ketelitian QC, mekanika dasar, dan simulasi interview AI untuk lulusan SMA/SMK di Indonesia.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-xs tracking-wider uppercase">Modul Tes Populer</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition-colors cursor-pointer">• Simulasi Tes Kraepelin & Pauli</li>
              <li className="hover:text-white transition-colors cursor-pointer">• Tes Ketelitian & Barcode QC</li>
              <li className="hover:text-white transition-colors cursor-pointer">• Bennett Mechanical (Roda Gigi & Katrol)</li>
              <li className="hover:text-white transition-colors cursor-pointer">• Kanvas Interaktif Tes Wartegg</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-xs tracking-wider uppercase">Standar Rekrutmen</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>✓ Standar Astra Group & Daihatsu</li>
              <li>✓ Standar PT Epson & Omron</li>
              <li>✓ Standar Yamaha Motor & Denso</li>
              <li>✓ Standar Mayora & Indofood</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-[11px]">
            &copy; {new Date().getFullYear()} SiapKerja. Dibuat untuk kesuksesan lulusan SMA/SMK Indonesia.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Sesuai Format Rekrutmen Pabrik Nyata</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
