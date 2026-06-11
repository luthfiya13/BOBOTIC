/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Award, Mail, Lock, Phone, MapPin, Sparkles, BookOpen, UserCheck, ShieldAlert, Upload } from "lucide-react";
import { UserRole, StudentProfile, MentorProfile } from "../types";

interface AuthPagesProps {
  activeView: string;
  students: StudentProfile[];
  mentors: MentorProfile[];
  onNavigate: (view: string) => void;
  onLoginSucceed: (role: UserRole, userObj: any) => void;
  onAddStudent: (newStudent: any) => void;
  onAddMentor: (newMentor: any) => void;
  onShowToast: (message: string, type?: "success" | "warning" | "info") => void;
}

export default function AuthPages({
  activeView,
  students,
  mentors,
  onNavigate,
  onLoginSucceed,
  onAddStudent,
  onAddMentor,
  onShowToast
}: AuthPagesProps) {
  // Login Page parameters
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Student register parameters
  const [stuForm, setStuForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPass: "",
    city: "Surakarta"
  });

  // Mentor registrations parameters
  const [menForm, setMenForm] = useState({
    name: "",
    email: "",
    phone: "",
    university: "Universitas Sebelas Maret (UNS)",
    major: "Teknik Mekatronika",
    levels: [1, 2],
    password: "",
    confirmPass: ""
  });

  // Forgot password parameter
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Authenticated Match Action
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail) {
      onShowToast("Masukkan email atau nomor whatsapp terlebih dahulu.", "warning");
      return;
    }

    // Try finding username-based demo logins first
    const emailLower = loginEmail.toLowerCase();
    if (emailLower === "admin" || emailLower === "admin@bobotic.com") {
      onLoginSucceed("admin", { id: "admin", name: "Administrator BOBOTIC", email: "admin@bobotic.com" });
      onNavigate("admin-dashboard");
      onShowToast("Berhasil masuk sebagai Administrator BOBOTIC!", "success");
      return;
    }

    if (emailLower === "siswa") {
      const defaultBudi = students[0];
      onLoginSucceed("siswa", defaultBudi);
      onNavigate("siswa-dashboard");
      return;
    }

    if (emailLower === "haya") {
      const defaultHaya = mentors.find(m => m.id === "m1") || mentors[0];
      onLoginSucceed("mentor", defaultHaya);
      onNavigate("mentor-dashboard");
      return;
    }

    // Try finding matching student
    const matchedSiswa = students.find(s => s.email.toLowerCase() === emailLower);
    if (matchedSiswa) {
      onLoginSucceed("siswa", matchedSiswa);
      onNavigate("siswa-dashboard");
      return;
    }

    // Try finding matching mentor
    const matchedMentor = mentors.find(m => m.email.toLowerCase() === emailLower);
    if (matchedMentor) {
      onLoginSucceed("mentor", matchedMentor);
      onNavigate("mentor-dashboard");
      return;
    }

    // Default simulation fallback
    if (emailLower.includes("mentor") || emailLower === "haya" || emailLower === "haya.nur@bobotic.com") {
      const defaultHaya = mentors.find(m => m.id === "m1") || mentors[0];
      onLoginSucceed("mentor", defaultHaya);
      onNavigate("mentor-dashboard");
    } else {
      // Login Budi as default student
      const defaultBudi = students[0];
      onLoginSucceed("siswa", defaultBudi);
      onNavigate("siswa-dashboard");
    }
  };

  // Submit Student Registrations
  const handleStudentRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stuForm.name || !stuForm.email || !stuForm.phone) {
      onShowToast("Harap isi semua detail pendaftaran.", "warning");
      return;
    }
    if (stuForm.password !== stuForm.confirmPass) {
      onShowToast("Konfirmasi password tidak cocok!", "warning");
      return;
    }

    const newStu: StudentProfile = {
      id: "s_reg_" + Date.now(),
      name: stuForm.name,
      email: stuForm.email,
      phone: stuForm.phone,
      level: 1, // Start Level 1
      levelProgress: 0,
      completedSessions: 0,
      remainingSessions: 4, // 4 free starter bundle simulated
      averageScore: 0,
      address: "Alamat belum diatur, silakan edit",
      activeMentorId: "m1", // Kak Haya Auto-assigned
      activeMentorName: "Haya Nur Fadhila",
      city: stuForm.city
    };

    onAddStudent(newStu);
    onLoginSucceed("siswa", newStu);
    onNavigate("siswa-dashboard");
    onShowToast("Akun Siswa baru sukses dibuat! Selamat datang di BOBOTIC.", "success");
  };

  // Submit Mentor Registrations
  const handleMentorRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menForm.name || !menForm.email || !menForm.phone) {
      onShowToast("Harap lengkapi isian data diri.", "warning");
      return;
    }
    if (menForm.password !== menForm.confirmPass) {
      onShowToast("Kata sandi konfirmasi tidak sinkron.", "warning");
      return;
    }

    const newMen: MentorProfile = {
      id: "m_reg_" + Date.now(),
      name: menForm.name,
      email: menForm.email,
      phone: menForm.phone,
      university: menForm.university,
      major: menForm.major,
      year: "Angkatan 2022",
      bio: "Freshly certified mekatronika mentor.",
      levels: menForm.levels,
      specialties: ["Scratch", "Basic Electronic Architecture"],
      rating: 5.0,
      completedClassesCount: 0,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      isVerified: false, // requires admin verifying state
      status: "Tersedia",
      maxStudents: 3,
      activeStudentsCount: 0,
      availability: { "Sabtu": ["Sore"] }
    };

    onAddMentor(newMen);
    onLoginSucceed("mentor", newMen);
    onNavigate("mentor-dashboard");
    onShowToast("Pendaftaran Mentor baru sukses dikirim untuk verifikasi admin! Sementara ini akun Anda aktif dalam masa percobaan.", "success");
  };

  return (
    <div className="bg-slate-50 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* =========================================
                     8.3 SIGN-IN MAIN LOGIN PAGE
         ========================================= */}
      {activeView === "auth-login" && (
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xl space-y-6 text-left animate-in">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <Award className="h-6 w-6" />
            </div>
            <h2 className="font-display font-bold text-2xl text-slate-900">Masuk Platform BOBOTIC</h2>
            <p className="text-xs text-slate-400">Gunakan email yang terdaftar untuk melanjutkan belajar.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-slate-700">Email Utama / No. WhatsApp</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="siswa / haya / admin"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center mb-0.5">
                <label className="text-slate-705">Kata Sandi (Password)</label>
                <button
                  type="button"
                  onClick={() => onNavigate("auth-forgot")}
                  className="text-[10px] text-blue-600 hover:underline"
                >
                  Lupa Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center text-xs transition-all shadow-md cursor-pointer mt-2"
            >
              Masuk Akun
            </button>
          </form>

          {/* Quick login helper panel inside Auth form for frictionless demos */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">💡 Demo Quick-Tips BOBOTIC:</p>
            <p>• 👦 Siswa: <strong className="text-blue-600">siswa</strong></p>
            <p>• 👩 Mentor: <strong className="text-purple-600">haya</strong></p>
            <p>• ⚙️ Admin: <strong className="text-rose-600">admin</strong> (Sandi: bebas)</p>
          </div>

          <div className="text-center text-xs text-slate-500 border-t border-slate-50 pt-4">
            Belum punya akun belajar?{" "}
            <button
              onClick={() => onNavigate("auth-register-siswa")}
              className="text-blue-600 font-bold hover:underline"
            >
              Daftar Sebagai Siswa
            </button>
          </div>
        </div>
      )}


      {/* =========================================
                     8.1 HALAMAN REGISTRASI SISWA
         ========================================= */}
      {activeView === "auth-register-siswa" && (
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xl space-y-6 text-left animate-in">
          <div className="text-center space-y-2">
            <h2 className="font-display font-bold text-2xl text-slate-900">Daftar Akun Siswa Baru</h2>
            <p className="text-xs text-slate-400">Raih bimbingan mekatronika terbaik di ruang tamu Anda.</p>
          </div>

          <form onSubmit={handleStudentRegister} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-slate-700">Nama Lengkap Siswa</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="cth: Dimas Wijaya"
                value={stuForm.name}
                onChange={(e) => setStuForm({ ...stuForm, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-700">Email Utama Wali</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="cth: wali@gmail.com"
                  value={stuForm.email}
                  onChange={(e) => setStuForm({ ...stuForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700">No. WhatsApp Wali</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="cth: 08123456789"
                  value={stuForm.phone}
                  onChange={(e) => setStuForm({ ...stuForm, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-700">Kata Sandi (Password)</label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="Minimum 6 Karakter"
                  value={stuForm.password}
                  onChange={(e) => setStuForm({ ...stuForm, password: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700">Konfirmasi Kata Sandi</label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="Ulangi Kata Sandi"
                  value={stuForm.confirmPass}
                  onChange={(e) => setStuForm({ ...stuForm, confirmPass: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-705">Kota / Distrik Operasi</label>
              <select
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                value={stuForm.city}
                onChange={(e) => setStuForm({ ...stuForm, city: e.target.value })}
              >
                <option value="Surakarta">Kota Surakarta</option>
                <option value="Boyolali">Boyolali</option>
                <option value="Sukoharjo">Sukoharjo</option>
                <option value="Karanganyar">Karanganyar</option>
                <option value="Klaten">Klaten</option>
                <option value="Sragen">Sragen</option>
              </select>
            </div>

            <label className="flex items-start space-x-2 p-1 cursor-pointer">
              <input type="checkbox" required className="mt-0.5" defaultChecked />
              <span className="text-[10px] text-slate-500 font-medium leading-tight">
                Saya menyetujui seluruh Syarat, Ketentuan, Rencana Operasi, serta Kebijakan Privasi BOBOTIC Solo Raya.
              </span>
            </label>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center text-xs transition-all shadow-md cursor-pointer"
            >
              Daftar sebagai Siswa
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 border-t border-slate-50 pt-4">
            Ingin bermitra mendaftarkan diri sebagai pengajar?{" "}
            <button
              onClick={() => onNavigate("auth-register-mentor")}
              className="text-purple-600 font-bold hover:underline"
            >
              Registrasi Mentor
            </button>
          </div>
        </div>
      )}


      {/* =========================================
                     8.2 HALAMAN REGISTRASI MENTOR
         ========================================= */}
      {activeView === "auth-register-mentor" && (
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xl space-y-6 text-left animate-in">
          <div className="text-center space-y-2">
            <h2 className="font-display font-bold text-2xl text-purple-700">Daftar Mitra Mentor Resmi</h2>
            <p className="text-xs text-slate-400">Dapatkan penghasilan mengajar robotics fleksibel dari rumah.</p>
          </div>

          <form onSubmit={handleMentorRegister} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-slate-705">Nama Lengkap & Gelar Akademik</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none"
                placeholder="cth: Kak Aris Setiawan, S.T."
                value={menForm.name}
                onChange={(e) => setMenForm({ ...menForm, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-700">Email Instansi / Pribadi</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="cth: haya@bobotic.com"
                  value={menForm.email}
                  onChange={(e) => setMenForm({ ...menForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700">No. WhatsApp Pribadi</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="08xxxxxxxx"
                  value={menForm.phone}
                  onChange={(e) => setMenForm({ ...menForm, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 col-span-2">
              <div className="space-y-1">
                <label className="text-slate-750">Asal Universitas</label>
                <select
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500"
                  value={menForm.university}
                  onChange={(e) => setMenForm({ ...menForm, university: e.target.value })}
                >
                  <option value="UIN Raden Mas Said Surakarta">UIN Raden Mas Said Surakarta</option>
                  <option value="Universitas Sebelas Maret (UNS)">UNS Surakarta</option>
                  <option value="Universitas Muhammadiyah Surakarta (UMS)">UMS Kartasura</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-slate-700">Program Studi / Major</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="cth: Pendidikan Guru / IT"
                  value={menForm.major}
                  onChange={(e) => setMenForm({ ...menForm, major: e.target.value })}
                />
              </div>
            </div>

            {/* Curriculum Vitae slot (Required) */}
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 space-y-1.5 text-left">
              <span className="text-[10px] uppercase font-bold text-purple-750 block flex items-center space-x-1">
                <Upload className="h-3 w-3 shrink-0" />
                <span>Upload Curriculum Vitae (PDF - Wajib)</span>
              </span>
              <input 
                type="file" 
                accept=".pdf"
                id="cv-upload-input"
                className="hidden" 
                required
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onShowToast(`CV berhasil dilampirkan: ${file.name}`, "info");
                  }
                }}
              />
              <label 
                htmlFor="cv-upload-input"
                className="h-10 bg-white hover:bg-slate-50 border border-dashed border-purple-200 rounded-md flex items-center justify-center text-[10px] text-slate-500 cursor-pointer transition-all"
              >
                Klik untuk Memilih File CV (PDF) Anda
              </label>
            </div>

            {/* Certification / Portofolio Slot (Optional) */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-left">
              <span className="text-[10px] uppercase font-bold text-slate-700 block flex items-center space-x-1">
                <Award className="h-3 w-3 shrink-0 text-slate-500" />
                <span>Sertifikasi Kompetensi & Portofolio (Opsional)</span>
              </span>
              <input 
                type="file" 
                accept=".pdf,image/*"
                id="cert-upload-input"
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onShowToast(`Sertifikasi berhasil dilampirkan: ${file.name}`, "info");
                  }
                }}
              />
              <label 
                htmlFor="cert-upload-input"
                className="h-10 bg-white hover:bg-slate-50 border border-dashed border-slate-200 rounded-md flex items-center justify-center text-[10px] text-slate-400 cursor-pointer transition-all"
              >
                Klik untuk Memilih File Sertifikat / KTM / Portofolio (PDF/Image)
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-700">Buat Kata Sandi</label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="Minimum 6 Karakter"
                  value={menForm.password}
                  onChange={(e) => setMenForm({ ...menForm, password: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-700">Verifikasi Kata Sandi</label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="Ulangi Kata Sandi"
                  value={menForm.confirmPass}
                  onChange={(e) => setMenForm({ ...menForm, confirmPass: e.target.value })}
                />
              </div>
            </div>

            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100 text-[10px] text-amber-900 leading-normal flex items-start space-x-1.5">
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <span>Pendaftaran ini memerlukan tinjauan dokumen resmi oleh tim verifikator admin maksimal 1-3 hari kerja sebelum dinyatakan lulus mengajar.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-center text-xs transition-all shadow-md cursor-pointer"
            >
              Kirim Formulir Kemitraan Mentor
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 border-t border-slate-50 pt-4">
            Sudah memiliki akun?{" "}
            <button
              onClick={() => onNavigate("auth-login")}
              className="text-blue-600 font-bold hover:underline"
            >
              Masuk Di Sini
            </button>
          </div>
        </div>
      )}


      {/* =========================================
                     8.4 HALAMAN LUPA PASSWORD
         ========================================= */}
      {activeView === "auth-forgot" && (
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xl space-y-6 text-left animate-in">
          <div className="text-center space-y-2">
            <h2 className="font-display font-bold text-2xl text-slate-900">Pemulihan Kata Sandi</h2>
            <p className="text-xs text-slate-400">Masukkan email terdaftar Anda untuk menerima tautan pemulihan sandi baru.</p>
          </div>

          {forgotSuccess ? (
            <div className="p-4 bg-green-50 text-green-800 rounded-2xl border border-green-100 text-xs text-center space-y-3">
              <span className="text-2xl">✔</span>
              <p className="font-bold">Link Berhasil Dikirim!</p>
              <p>Tautan instruksi penyetelan ulang sandi telah terkirim ke {forgotEmail}. Mohon cek folder Inbox maupun Spam email Anda.</p>
              <button
                type="button"
                onClick={() => {
                  setForgotSuccess(false);
                  onNavigate("auth-login");
                }}
                className="w-full py-2 bg-slate-900 text-white font-bold rounded-xl"
              >
                Kembali Ke Log Sesi
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!forgotEmail) return;
                setForgotSuccess(true);
              }}
              className="space-y-4 text-xs font-semibold"
            >
              <div className="space-y-1">
                <label className="text-slate-700">Email Pemulihan Akun</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500"
                    placeholder="cth: budi@gmail.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center text-xs transition-all shadow-md cursor-pointer"
              >
                Kirim Link Reset Sandi
              </button>
            </form>
          )}

          <div className="text-center text-xs text-slate-500 border-t border-slate-50 pt-4">
            Ingat kata sandi Anda?{" "}
            <button
              onClick={() => onNavigate("auth-login")}
              className="text-blue-600 font-bold hover:underline"
            >
              Kembali Ke Login
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
