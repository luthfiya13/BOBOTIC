/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Youtube, Award } from "lucide-react";

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 font-sans border-t border-slate-800" id="nexus-footer">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo & Bios */}
          <div className="space-y-4" id="footer-logo-desc">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-2 rounded-xl flex items-center justify-center shadow-lg">
                <Award className="h-6 w-6" />
              </div>
              <span className="font-display font-bold text-2xl text-white tracking-tight">NEXUS</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pionir mobile learning robotika dan coding di Solo Raya. Mentor bersertifikat datang langsung ke rumah Anda dengan membawa seluruh peralatan praktik lengkap.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors" aria-label="Youtube">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div id="footer-quick-links">
            <h3 className="font-display font-semibold text-lg text-white mb-4">Navigasi Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate("home")} className="hover:text-amber-400 hover:underline transition-all cursor-pointer">Home</button>
              </li>
              <li>
                <button onClick={() => onNavigate("kelas")} className="hover:text-amber-400 hover:underline transition-all cursor-pointer">Daftar Kelas</button>
              </li>
              <li>
                <button onClick={() => onNavigate("tentang")} className="hover:text-amber-400 hover:underline transition-all cursor-pointer">Tentang Kami</button>
              </li>
              <li>
                <button onClick={() => onNavigate("harga")} className="hover:text-amber-400 hover:underline transition-all cursor-pointer">Harga & Paket</button>
              </li>
              <li>
                <button onClick={() => onNavigate("faq")} className="hover:text-amber-400 hover:underline transition-all cursor-pointer">Pertanyaan Umum (FAQ)</button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="space-y-3" id="footer-contacts">
            <h3 className="font-display font-semibold text-lg text-white mb-4">Kontak Kami</h3>
            <div className="flex items-start space-x-2 text-sm text-slate-400">
              <Mail className="h-4 w-4 text-blue-500 mt-1 shrink-0" />
              <span>info@nexusrobotics.id</span>
            </div>
            <div className="flex items-start space-x-2 text-sm text-slate-400">
              <Phone className="h-4 w-4 text-blue-500 mt-1 shrink-0" />
              <span>+62 822-1234-5678 (WhatsApp)</span>
            </div>
            <div className="flex items-start space-x-2 text-sm text-slate-400">
              <MapPin className="h-4 w-4 text-blue-500 mt-1 shrink-0" />
              <span>Jl. Slamet Riyadi No. 100, Kota Surakarta, Jawa Tengah</span>
            </div>
          </div>

          {/* Column 4: Hours & Coverage */}
          <div className="space-y-3" id="footer-hours">
            <h3 className="font-display font-semibold text-lg text-white mb-4">Layanan & Operasional</h3>
            <div className="flex items-start space-x-2 text-sm text-slate-400">
              <Clock className="h-4 w-4 text-blue-500 mt-1 shrink-0" />
              <div>
                <p className="font-medium text-slate-300">Setiap Hari</p>
                <p className="text-xs">08.00 - 21.00 WIB</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-white tracking-wider uppercase mb-1">Area Layanan (Solo Raya):</p>
              <p className="text-sm text-slate-400">Surakarta · Sukoharjo · Karanganyar · Boyolali · Klaten · Sragen</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright list */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row justify-between items-center text-xs text-slate-500" id="footer-bottom-claims">
          <p>© 2026 NEXUS Robotics & Coding. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-amber-500 transition-colors">Kebijakan Privasi</a>
            <span>•</span>
            <a href="#" className="hover:text-amber-500 transition-colors">Syarat & Ketentuan</a>
            <span>•</span>
            <span className="text-blue-500 font-mono font-bold">Surakarta, Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
