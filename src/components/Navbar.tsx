/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Award, LogOut, MessageSquare, Menu, X, User, ChevronDown, CheckCircle2, ShieldCheck } from "lucide-react";
import { UserRole } from "../types";

interface NavbarProps {
  activeView: string;
  activeRole: UserRole;
  loggedUser: any;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onQuickSwitch: (role: UserRole, userObj?: any) => void;
}

export default function Navbar({
  activeView,
  activeRole,
  loggedUser,
  onNavigate,
  onLogout,
  onQuickSwitch
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Check which public link is active
  const isPublicLinkActive = (view: string) => activeView === view;

  // Toggle switch roles helper
  const handleQuickRole = (role: UserRole) => {
    setUserDropdownOpen(false);
    if (role === "public") {
      onQuickSwitch("public", null);
      onNavigate("home");
    } else if (role === "siswa") {
      // Default student Budi Santoso
      const budi = {
        id: "s1",
        name: "Budi Santoso",
        email: "budi@gmail.com",
        level: 1,
        address: "Jl. Slamet Riyadi No. 124, Solo"
      };
      onQuickSwitch("siswa", budi);
      onNavigate("siswa-dashboard");
    } else if (role === "mentor") {
      // Default mentor Haya Nur Fadhila
      const haya = {
        id: "m1",
        name: "Haya Nur Fadhila",
        email: "haya.fadhila@nexus.com",
        major: "Pendidikan Guru Madrasah Ibtidaiyah",
        university: "UIN Raden Mas Said Surakarta"
      };
      onQuickSwitch("mentor", haya);
      onNavigate("mentor-dashboard");
    } else if (role === "admin") {
      const adminObj = {
        id: "admin1",
        name: "Super Admin NEXUS",
        email: "admin@nexus.com"
      };
      onQuickSwitch("admin", adminObj);
      onNavigate("admin-dashboard");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm" id="nexus-navbar">
      {/* Visual Demo Quick-Switcher Banner for Presentation Flow */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-xs font-mono flex flex-wrap justify-between items-center sm:px-6 gap-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-slate-400">Demo Quick-Switch Panel:</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleQuickRole("public")}
            className={`px-2.5 py-0.5 rounded cursor-pointer transition-all ${
              activeRole === "public"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            🌐 Guest (Landing)
          </button>
          <button
            onClick={() => handleQuickRole("siswa")}
            className={`px-2.5 py-0.5 rounded cursor-pointer transition-all ${
              activeRole === "siswa"
                ? "bg-blue-600 text-white font-bold"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            👦 Siswa: Budi
          </button>
          <button
            onClick={() => handleQuickRole("mentor")}
            className={`px-2.5 py-0.5 rounded cursor-pointer transition-all ${
              activeRole === "mentor"
                ? "bg-purple-600 text-white font-bold"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            👩 Mentor: Haya (UIN)
          </button>
          <button
            onClick={() => handleQuickRole("admin")}
            className={`px-2.5 py-0.5 rounded cursor-pointer transition-all ${
              activeRole === "admin"
                ? "bg-red-600 text-white font-bold animate-pulse"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            ⚙️ Admin Panel
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Brand */}
          <div className="flex items-center space-x-2 cursor-pointer shrink-0" onClick={() => handleQuickRole("public")}>
            <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md flex items-center justify-center glow-primary">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <span className="font-display font-bold text-xl text-slate-900 tracking-tight block">NEXUS</span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider block -mt-1 font-bold">ROBOTICS & CODING</span>
            </div>
          </div>

          {/* Navigation Links (Public Role) */}
          {activeRole === "public" && (
            <nav className="hidden md:flex space-x-6 text-sm font-medium" id="navbar-public-menu">
              <button
                onClick={() => onNavigate("home")}
                className={`transition-colors hover:text-blue-600 cursor-pointer ${
                  isPublicLinkActive("home") ? "text-blue-600 font-semibold" : "text-slate-600"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate("kelas")}
                className={`transition-colors hover:text-blue-600 cursor-pointer ${
                  isPublicLinkActive("kelas") ? "text-blue-600 font-semibold" : "text-slate-600"
                }`}
              >
                Daftar Kelas
              </button>
              <button
                onClick={() => onNavigate("tentang")}
                className={`transition-colors hover:text-blue-600 cursor-pointer ${
                  isPublicLinkActive("tentang") ? "text-blue-600 font-semibold" : "text-slate-600"
                }`}
              >
                Tentang Kami
              </button>
              <button
                onClick={() => onNavigate("harga")}
                className={`transition-colors hover:text-blue-600 cursor-pointer ${
                  isPublicLinkActive("harga") ? "text-blue-600 font-semibold" : "text-slate-600"
                }`}
              >
                Harga & Paket
              </button>
              <button
                onClick={() => onNavigate("faq")}
                className={`transition-colors hover:text-blue-600 cursor-pointer ${
                  isPublicLinkActive("faq") ? "text-blue-600 font-semibold" : "text-slate-600"
                }`}
              >
                FAQ
              </button>
            </nav>
          )}

          {/* Navigation Links (Siswa Role) */}
          {activeRole === "siswa" && (
            <nav className="hidden md:flex space-x-6 text-sm font-medium" id="navbar-siswa-menu">
              <button
                onClick={() => onNavigate("siswa-dashboard")}
                className={`transition-colors hover:text-blue-600 cursor-pointer ${
                  activeView === "siswa-dashboard" ? "text-blue-600 font-semibold" : "text-slate-600"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate("siswa-jadwal")}
                className={`transition-colors hover:text-blue-600 cursor-pointer ${
                  activeView === "siswa-jadwal" ? "text-blue-600 font-semibold" : "text-slate-600"
                }`}
              >
                Jadwal Sesi
              </button>
              <button
                onClick={() => onNavigate("siswa-progres")}
                className={`transition-colors hover:text-blue-600 cursor-pointer ${
                  activeView === "siswa-progres" ? "text-blue-600 font-semibold" : "text-slate-600"
                }`}
              >
                Progres Belajar
              </button>
              <button
                onClick={() => onNavigate("siswa-mentor")}
                className={`transition-colors hover:text-blue-600 cursor-pointer ${
                  activeView === "siswa-mentor" ? "text-blue-600 font-semibold" : "text-slate-600"
                }`}
              >
                Pilih Mentor
              </button>
              <button
                onClick={() => onNavigate("siswa-materi")}
                className={`transition-colors hover:text-blue-600 cursor-pointer ${
                  activeView === "siswa-materi" ? "text-blue-600 font-semibold" : "text-slate-600"
                }`}
              >
                Materi Belajar
              </button>
            </nav>
          )}

          {/* Navigation Links (Mentor Role) */}
          {activeRole === "mentor" && (
            <nav className="hidden md:flex space-x-6 text-sm font-medium" id="navbar-mentor-menu">
              <button
                onClick={() => onNavigate("mentor-dashboard")}
                className={`transition-colors hover:text-blue-600 cursor-pointer ${
                  activeView === "mentor-dashboard" ? "text-blue-600 font-semibold" : "text-slate-600"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate("mentor-jadwal")}
                className={`transition-colors hover:text-blue-600 cursor-pointer ${
                  activeView === "mentor-jadwal" ? "text-blue-600 font-semibold" : "text-slate-600"
                }`}
              >
                Kelola Jadwal
              </button>
              <button
                onClick={() => onNavigate("mentor-siswa")}
                className={`transition-colors hover:text-blue-600 cursor-pointer ${
                  activeView === "mentor-siswa" ? "text-blue-600 font-semibold" : "text-slate-600"
                }`}
              >
                Siswa Saya
              </button>
              <button
                onClick={() => onNavigate("mentor-permintaan")}
                className={`relative transition-colors hover:text-blue-600 cursor-pointer ${
                  activeView === "mentor-permintaan" ? "text-blue-600 font-semibold" : "text-slate-600"
                }`}
              >
                Permintaan
                <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-red-500 text-white font-bold rounded-full">1</span>
              </button>
              <button
                onClick={() => onNavigate("mentor-profil")}
                className={`transition-colors hover:text-blue-600 cursor-pointer ${
                  activeView === "mentor-profil" ? "text-blue-600 font-semibold" : "text-slate-600"
                }`}
              >
                Kelola Profil
              </button>
            </nav>
          )}

          {activeRole === "admin" && (
            <nav className="hidden md:flex space-x-6 text-sm font-medium" id="navbar-admin-menu">
              <button
                onClick={() => onNavigate("admin-siswa")}
                className={`transition-colors hover:text-red-500 cursor-pointer ${
                  activeView === "admin-siswa" || activeView === "admin-dashboard" ? "text-red-500 font-bold" : "text-slate-600"
                }`}
              >
                Kelola Siswa
              </button>
              <button
                onClick={() => onNavigate("admin-guru")}
                className={`transition-colors hover:text-red-500 cursor-pointer ${
                  activeView === "admin-guru" ? "text-red-500 font-bold" : "text-slate-600"
                }`}
              >
                Kelola Guru
              </button>
              <button
                onClick={() => onNavigate("admin-materi")}
                className={`transition-colors hover:text-red-500 cursor-pointer ${
                  activeView === "admin-materi" ? "text-red-500 font-bold" : "text-slate-600"
                }`}
              >
                Kurikulum & Kuis
              </button>
            </nav>
          )}

          {/* Actions & Profiles Group */}
          <div className="hidden md:flex items-center space-x-4" id="navbar-actions-group">
            {activeRole === "public" ? (
              <>
                <button
                  onClick={() => onNavigate("auth-login")}
                  className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-4 py-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-all"
                >
                  Masuk
                </button>
                <button
                  onClick={() => onNavigate("auth-register-siswa")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all hov-scale-md cursor-pointer flex items-center"
                >
                  Daftar Sekarang
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 pl-3 pr-2 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:outline-none cursor-pointer transition-all bg-slate-50"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold font-display text-sm">
                    {loggedUser?.name ? loggedUser.name.charAt(0) : "U"}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1 max-w-[120px]">
                      {loggedUser?.name || "User Nexus"}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium capitalize">
                      {activeRole} Logged
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-100 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
                    <div className="px-4 py-2 border-b border-slate-50">
                      <p className="text-xs text-slate-400">Masuk sebagai</p>
                      <p className="font-semibold text-sm text-slate-800 line-clamp-1">
                        {loggedUser?.name || "User Nexus"}
                      </p>
                      <p className="text-xs font-mono text-slate-500 line-clamp-1">{loggedUser?.email}</p>
                    </div>
                    {activeRole === "siswa" ? (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate("siswa-dashboard");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        <span>Ke App Siswa</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate("mentor-dashboard");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
                      >
                        <ShieldCheck className="h-4 w-4 text-slate-400" />
                        <span>Ke Portal Mentor</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 cursor-pointer border-t border-slate-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Keluar Dari Sistem</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu button trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu layout */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 px-4 pt-2 pb-4 space-y-2 shadow-inner" id="navbar-mobile-overlay">
          {/* Public Views listed on Mobile */}
          {activeRole === "public" && (
            <>
              <button
                onClick={() => {
                  onNavigate("home");
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  isPublicLinkActive("home") ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  onNavigate("kelas");
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  isPublicLinkActive("kelas") ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Daftar Kelas
              </button>
              <button
                onClick={() => {
                  onNavigate("tentang");
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  isPublicLinkActive("tentang") ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Tentang Kami
              </button>
              <button
                onClick={() => {
                  onNavigate("harga");
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  isPublicLinkActive("harga") ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Harga & Paket
              </button>
              <button
                onClick={() => {
                  onNavigate("faq");
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  isPublicLinkActive("faq") ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                FAQ
              </button>

              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    onNavigate("auth-login");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Masuk
                </button>
                <button
                  onClick={() => {
                    onNavigate("auth-register-siswa");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-md active:bg-blue-700"
                >
                  Daftar
                </button>
              </div>
            </>
          )}

          {/* Student mobile menu */}
          {activeRole === "siswa" && (
            <>
              <div className="px-4 py-2 bg-slate-50 rounded-xl mb-2 flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                  {loggedUser?.name?.charAt(0) || "S"}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">{loggedUser?.name}</p>
                  <p className="text-[10px] text-slate-400">Siswa Level {loggedUser?.level || 1}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onNavigate("siswa-dashboard");
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeView === "siswa-dashboard" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  onNavigate("siswa-jadwal");
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeView === "siswa-jadwal" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Jadwal Belajar
              </button>
              <button
                onClick={() => {
                  onNavigate("siswa-progres");
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeView === "siswa-progres" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Progres Belajar
              </button>
              <button
                onClick={() => {
                  onNavigate("siswa-mentor");
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeView === "siswa-mentor" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Pilih Mentor
              </button>
              <button
                onClick={() => {
                  onNavigate("siswa-materi");
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeView === "siswa-materi" ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Materi Belajar
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 border-t border-slate-100"
              >
                Keluar
              </button>
            </>
          )}

          {/* Mentor mobile menu */}
          {activeRole === "mentor" && (
            <>
              <div className="px-4 py-2 bg-slate-50 rounded-xl mb-2 flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                  {loggedUser?.name?.charAt(0) || "M"}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">{loggedUser?.name}</p>
                  <p className="text-[10px] text-slate-400">Mentor Portal</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onNavigate("mentor-dashboard");
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeView === "mentor-dashboard" ? "bg-purple-50 text-purple-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  onNavigate("mentor-jadwal");
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeView === "mentor-jadwal" ? "bg-purple-50 text-purple-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Kelola Jadwal
              </button>
              <button
                onClick={() => {
                  onNavigate("mentor-siswa");
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeView === "mentor-siswa" ? "bg-purple-50 text-purple-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Siswa Saya
              </button>
              <button
                onClick={() => {
                  onNavigate("mentor-permintaan");
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeView === "mentor-permintaan" ? "bg-purple-50 text-purple-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Permintaan Baru
              </button>
              <button
                onClick={() => {
                  onNavigate("mentor-profil");
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeView === "mentor-profil" ? "bg-purple-50 text-purple-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Profil Saya
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 border-t border-slate-100"
              >
                Keluar
              </button>
            </>
          )}

          {/* Admin mobile menu */}
          {activeRole === "admin" && (
            <>
              <div className="px-4 py-2 bg-slate-50 rounded-xl mb-2 flex items-center space-x-2 border border-red-100">
                <div className="h-8 w-8 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-sm">
                  A
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">{loggedUser?.name || "Super Admin"}</p>
                  <p className="text-[10px] text-red-600 font-bold">BOBOTIC HQ Administrator</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onNavigate("admin-siswa");
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeView === "admin-siswa" || activeView === "admin-dashboard" ? "bg-red-50 text-red-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Kelola Siswa
              </button>
              <button
                onClick={() => {
                  onNavigate("admin-guru");
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeView === "admin-guru" ? "bg-red-50 text-red-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Kelola Guru / Mentor
              </button>
              <button
                onClick={() => {
                  onNavigate("admin-materi");
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeView === "admin-materi" ? "bg-red-50 text-red-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                Kurikulum & Kuis
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 border-t border-slate-100"
              >
                Keluar
              </button>
            </>
          )}
        </div>
      )}

      {/* Floating WhastApp Action Hook */}
      <a
        href="https://wa.me/6282212345678?text=Halo%20NEXUS%20Robotics,%20saya%20ingin%20tanya%20mengenai%20paket%20kelas%20robotik"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl z-40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 duration-200"
        title="Konsultasi Gratis via WhatsApp"
        id="whatsapp-floating-action"
      >
        <MessageSquare className="h-6 w-6 stroke-2" />
        <span className="absolute right-full mr-3 text-emerald-950 bg-emerald-50 shadow-md border border-emerald-100 font-semibold px-3 py-1 rounded-xl text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none md:block hidden">
          Hubungi Kami via WA
        </span>
      </a>
    </header>
  );
}
