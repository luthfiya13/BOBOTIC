/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Award, CheckCircle2, Star, ShieldCheck, Users, HelpCircle,
  TrendingUp, Calendar, Zap, BookOpen, Calculator, MapPin,
  Sparkles, Check, ChevronRight, ChevronDown, GraduationCap,
  MessageSquare, UserPlus, Flame, PlayCircle, Download
} from "lucide-react";

import { MentorProfile, StudentProfile } from "../types";

interface PublicPagesProps {
  activeView: string;
  mentors: MentorProfile[];
  onNavigate: (view: string) => void;
  onAddStudent: (newStudent: any) => void;
  onShowToast: (message: string, type?: "success" | "warning" | "info") => void;
}

export default function PublicPages({
  activeView,
  mentors,
  onNavigate,
  onAddStudent,
  onShowToast
}: PublicPagesProps) {
  // Frequently Used State Mechanisms (Pricing, Register, Accordion)
  const [b2cActiveTab, setB2cActiveTab] = useState<"b2c" | "b2b">("b2c");
  const [faqCategory, setFaqCategory] = useState<string>("umum");
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);

  // B2B Calculator States
  const [b2bLevelSetting, setB2bLevelSetting] = useState<"SD" | "SMP" | "SMA">("SD");
  const [b2bStudentCount, setB2bStudentCount] = useState<number>(15);
  const maxB2bStudents = 30;

  // Class Selection & Register Modal State
  const [selectedClassCard, setSelectedClassCard] = useState<any | null>(null);
  const [registerStep, setRegisterStep] = useState<number>(1);
  const [registrationForm, setRegistrationForm] = useState({
    name: "",
    age: "8",
    phone: "",
    address: "",
    level: "1",
    schedulePreference: "Sabtu Sore",
    sessionCount: "4" // 1, 4 or 8
  });

  // Calculate pricing based on formula
  const getB2bQuote = () => {
    const baseCount = 10;
    const effectiveStudentCount = Math.min(maxB2bStudents, Math.max(baseCount, b2bStudentCount));
    const diff = Math.max(0, effectiveStudentCount - baseCount);
    let basePrice = 75000;
    let incrementalPrice = 10000;

    if (b2bLevelSetting === "SMP") {
      basePrice = 100000;
      incrementalPrice = 15000;
    } else if (b2bLevelSetting === "SMA") {
      basePrice = 120000;
      incrementalPrice = 20000;
    }

    return basePrice + (diff * incrementalPrice);
  };

  // Static Class Cards Data
  const classesData = [
    { id: "c1", name: "Paket Privat 1-on-1 Block Programming", level: 1, type: "Privat", age: "6-9 tahun", price: 75000, duration: "90 menit", rating: 4.9 },
    { id: "c2", name: "Paket Privat 1-on-1 Hardware Arduino", level: 2, type: "Privat", age: "10-13 tahun", price: 75000, duration: "900 menit", rating: 4.8 },
    { id: "c3", name: "Paket Kelompok Scratch Bersama Sahabat", level: 1, type: "Kelompok", age: "6-9 tahun", price: 60000, duration: "90 menit", remainingQuota: 3, rating: 4.8 },
    { id: "c4", name: "Paket Kelompok Arduino Mechatronics", level: 2, type: "Kelompok", age: "10-13 tahun", price: 60000, duration: "90 menit", remainingQuota: 2, rating: 4.9 },
    { id: "c5", name: "IoT Smart Home & AI Engineering", level: 3, type: "Privat", age: "14-17 tahun", price: 75000, duration: "90 menit", rating: 5.0 },
    { id: "c6", name: "Bootcamp Persiapan Kompetisi WRO", level: 4, type: "Bootcamp", age: "10-18 tahun", price: 950000, duration: "8 Sesi Intensif", rating: 5.0, isSpecial: true }
  ];

  // Open Checkout modal
  const handleOpenRegistration = (cCard: any) => {
    setSelectedClassCard(cCard);
    setRegisterStep(1);
    setRegistrationForm({
      ...registrationForm,
      level: String(cCard.level),
      name: "",
      phone: ""
    });
  };

  // Process Steps
  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrationForm.name || !registrationForm.phone || !registrationForm.address) {
      onShowToast("Mohon lengkapi semua isian terlebih dahulu.", "warning");
      return;
    }
    setRegisterStep(2);
  };

  const handleConfirmPayment = () => {
    // Inject the new student to our local state so we can log in as them
    const newStudentProfile = {
      id: "s_" + Date.now(),
      name: registrationForm.name,
      email: registrationForm.name.toLowerCase().replace(/\s+/g, "") + "@gmail.com",
      phone: registrationForm.phone,
      level: Number(registrationForm.level),
      levelProgress: 0,
      completedSessions: 0,
      remainingSessions: Number(registrationForm.sessionCount),
      averageScore: 0,
      address: registrationForm.address,
      activeMentorId: "m1", // auto-assigned Aris
      activeMentorName: "Aris Setiawan",
      city: "Surakarta"
    };
    onAddStudent(newStudentProfile);
    setRegisterStep(3);
  };

  // FAQ contents classified by Category
  const faqDatabase: { [key: string]: { q: string; a: string }[] } = {
    umum: [
      { q: "Apa itu BOBOTIC?", a: "BOBOTIC adalah platform EdTech yang menyediakan jasa pengiriman mentor robotika dan coding bersertifikat datang langsung ke rumah siswa di Solo Raya. Kami menyediakan kurikulum komprehensif mulai dari block programming Scratch, robotika dasar dengan Arduino, Smart Devices (IoT & AI), hingga bimbingan kompetisi nasional." },
      { q: "Di mana area layanan operasional BOBOTIC?", a: "Layanan kami mencakup seluruh wilayah Solo Raya, termasuk Kota Surakarta (Solo), Sukoharjo, Karanganyar, Boyolali, Klaten, dan Sragen. Mentor kami akan berkunjung ke kediaman Anda siap dengan segala kit pembelajaran." },
      { q: "Berapa usia minimal untuk bergabung?", a: "Siswa kami paling muda berusia 6 tahun (kelas 1 SD) untuk memulai Level 1 Scratch Coding. Bagi siswa berumur lebih di atas 10 tahun dapat langsung menempuh Level 2 Arduino Hardware atau disesuaikan dengan minat." }
    ],
    pembayaran: [
      { q: "Bagaimana cara melakukan pembayaran?", a: "Metode pembayaran utama kami menggunakan sistem e-payment QRIS instan atau Transfer Bank (BNI, Mandiri). Anda dibebaskan memesan sesi satuan (pay-as-you-go) atau paket bundle hemat (4 sesi, 8 sesi atau program intensif)." },
      { q: "Bagaimana jika ada pembatalan sesi belajar, apakah dana hangus?", a: "Tidak. Jika Anda melakukan reschedule atau pembatalan maksimal 24 jam sebelum sesi dimulai, kuota sesi Anda tidak berkurang sama sekali dan dapat diganti ke lain hari." }
    ],
    mentor: [
      { q: "Apakah mentor benar-benar datang membawa seluruh alat praktik?", a: "Ya, betul sekali. Orang tua tidak perlu pusing memikirkan pembelian toolkits yang mahal. Mentor kami datang membawakan laptop khusus siswa, modul mikrokontroler Arduino Uno, sensor, aktuator, servo, dan kit robot lengkap untuk dirakit di tempat." },
      { q: "Apakah siswa diperkenankan mengganti mentor yang tidak cocok?", a: "Tentu saja. Kepuasan belajar anak adalah prioritas utama. Untuk paket Privat 1-on-1, Anda dapat melihat statistik profil guru serta memohon pergantian mentor gratis kapan saja jika dirasa kurang klop." }
    ],
    kurikulum: [
      { q: "Apakah siswa mendapatkan sertifikat kelulusan?", a: "Setiap kali siswa berhasil menyelesaikan tantangan Tugas Akhir (Final Project) di tiap Level, sistem kami akan menerbitkan sertifikat digital resmi yang tervalidasi yang dapat diunduh langsung lewat dasbor siswa." }
    ],
    sekolah: [
      { q: "Bagaimana sistem kerja sama B2B Ekstrakurikuler Sekolah?", a: "BOBOTIC menyediakan guru ahli bersertifikat dan seluruh kurikulum silabus robotik sekolah. Biaya dihitung per-sesi secara progresif berbasis total jumlah murid. Sekolah juga dibekali Dasbor Guru untuk meninjau absensi dan progres siswa." }
    ]
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-12 font-sans text-slate-800">
      
      {/* =========================================
                     1. LANDING PAGE
         ========================================= */}
      {activeView === "home" && (
        <div id="landing-container">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-white/70 py-16 lg:py-24 border-b border-slate-100" id="landing-hero">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6 text-left">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                  <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
                  <span>Solo Raya Mobile Learning Robotics No. 1</span>
                </span>
                <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-slate-900 leading-tight">
                  Mentor Robotik & <span className="text-blue-600 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Coding</span> Datang ke Rumahmu
                </h1>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                  Bangun masa depan kreatif anak Anda melalui kurikulum berbasis projek praktikal. Kami menyediakan seluruh kits robotik canggih dan mentor ahli bersertifikat terpercaya langsung ke lokasi Anda.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    onClick={() => onNavigate("harga")}
                    className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-center shadow-lg hover:shadow-blue-200 transition-all cursor-pointer text-sm"
                  >
                    Lihat Paket & Harga
                  </button>
                  <a
                    href="https://wa.me/6282212345678?text=Halo%2520BOBOTIC%2520Robotics,%2520saya%2520ingin%2520konsultasi%2520gratis"
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 font-semibold rounded-xl text-center transition-all cursor-pointer text-sm flex items-center justify-center space-x-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Konsultasi Gratis via WA</span>
                  </a>
                </div>
              </div>
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="absolute inset-0 bg-blue-100 filter blur-3xl rounded-full opacity-30 -z-10"></div>
                <div className="relative border border-slate-100 p-4 bg-white/80 rounded-3xl shadow-xl max-w-md">
                  <img
                    src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=900"
                    alt="Robot modern yang menarik"
                    className="rounded-2xl shadow-inner w-full object-cover aspect-[4/3]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Social Proof (Statistik Kepercayaan) */}
          <section className="bg-slate-900 text-white py-12" id="landing-stats">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="space-y-1">
                  <p className="font-display text-4xl sm:text-5xl font-bold text-amber-400">450+</p>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium">Siswa Aktif Solo Raya</p>
                </div>
                <div className="space-y-1">
                  <p className="font-display text-4xl sm:text-5xl font-bold text-amber-400">40+</p>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium">Mentor Bersertifikat</p>
                </div>
                <div className="space-y-1">
                  <p className="font-display text-4xl sm:text-5xl font-bold text-amber-400">12+</p>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium">Sekolah Mitra Resmi</p>
                </div>
                <div className="space-y-1">
                  <p className="font-display text-4xl sm:text-5xl font-bold text-amber-400">4.9/5</p>
                  <p className="text-xs sm:text-sm text-slate-400 font-semibold">Rating Kepuasan Orangtua</p>
                </div>
              </div>
            </div>
          </section>

          {/* Cara Kerja (How It Works) */}
          <section className="py-16 bg-slate-50" id="landing-how-it-works">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
              <div className="space-y-3 max-w-2xl mx-auto">
                <h2 className="font-display font-semibold text-xs text-blue-600 tracking-wider uppercase">Metode Praktis</h2>
                <p className="font-display font-bold text-3xl sm:text-4xl text-slate-900">3 Langkah Visual Mulai Belajar</p>
                <p className="text-sm text-slate-500">Kami sederhanakan seluruh proses demi kemudahan keluarga Anda.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center text-center space-y-4">
                  <div className="h-14 w-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg font-display mb-2">1</div>
                  <h3 className="font-display font-bold text-lg text-slate-800">Pilih Paket & Daftar</h3>
                  <p className="text-sm text-slate-500">Pilih level Scratch, Arduino, IoT, atau Kompetisi yang cocok untuk usia buah hati Anda di halaman Daftar Kelas.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center text-center space-y-4">
                  <div className="h-14 w-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg font-display mb-2">2</div>
                  <h3 className="font-display font-bold text-lg text-slate-800">Pilih Mentor Terbaik</h3>
                  <p className="text-sm text-slate-500">Mahasiswa pilihan berprestasi dari universitas ternama (UNS/UMS) ditunjuk otomatis atau dipilih langsung sesuai kecocokan jadwal.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center text-center space-y-4">
                  <div className="h-14 w-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg font-display mb-2">3</div>
                  <h3 className="font-display font-bold text-lg text-slate-800">Praktik Sesi Pertama</h3>
                  <p className="text-sm text-slate-500">Mentor datang membawa laptop serta development kits robotik lengkap, siap mendampingi anak Anda berkreasi di rumah.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Preview Kurikulum Terintegrasi */}
          <section className="py-16 bg-white" id="landing-curriculum-preview">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="space-y-2 text-left">
                  <h2 className="font-display font-semibold text-xs text-blue-600 tracking-wider uppercase">Kurikulum Teruji</h2>
                  <p className="font-display font-bold text-3xl text-slate-900">4 Level Kurikulum Unggulan</p>
                </div>
                <button
                  onClick={() => onNavigate("kelas")}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Ekspos Seluruh Kelas
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="border border-slate-100 bg-slate-50/50 p-6 rounded-2xl relative hover:border-blue-500 transition-colors duration-200 text-left space-y-4">
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-md">Level 1</span>
                  <h3 className="font-display font-bold text-lg text-slate-800 leading-tight">Scratch & Tinkercad Blocks</h3>
                  <p className="text-xs text-slate-500 font-semibold">Usia Target: 6 - 9 Tahun · 12 Sesi</p>
                  <p className="text-sm text-slate-600">Siswa melatih logika urutan (sequence) dan visual programming lewat pembuatan game interaktif 2D di platform Scratch.</p>
                </div>
                <div className="border border-slate-100 bg-slate-50/50 p-6 rounded-2xl relative hover:border-blue-500 transition-colors duration-200 text-left space-y-4">
                  <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded-md">Level 2</span>
                  <h3 className="font-display font-bold text-lg text-slate-800 leading-tight">Arduino Mechatronics</h3>
                  <p className="text-xs text-slate-500 font-semibold">Usia Target: 10 - 13 Tahun · 16 Sesi</p>
                  <p className="text-sm text-slate-600">Pengenalan hardware sirkuit, memahami sensor cahaya, sensor jarak, motor penggerak, dan memprogram menggunakan C++ standard.</p>
                </div>
                <div className="border border-slate-100 bg-slate-50/50 p-6 rounded-2xl relative hover:border-blue-500 transition-colors duration-200 text-left space-y-4">
                  <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-md">Level 3</span>
                  <h3 className="font-display font-bold text-lg text-slate-800 leading-tight">IoT & AI Systems</h3>
                  <p className="text-xs text-slate-500 font-semibold">Usia Target: 14 - 17 Tahun · 16 Sesi</p>
                  <p className="text-sm text-slate-600">Pelajari konektivitas Wi-Fi ESP32, integrasi sensor suhu ke cloud, Smart Home, serta pengenalan dasar computer vision kecerdasan buatan.</p>
                </div>
                <div className="border border-slate-100 bg-slate-50/50 p-6 rounded-2xl relative hover:border-blue-500 transition-colors duration-200 text-left space-y-4">
                  <span className="px-2.5 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded-md">Level 4</span>
                  <h3 className="font-display font-bold text-lg text-slate-800 leading-tight">Alumni Kompetisi</h3>
                  <p className="text-xs text-slate-500 font-semibold">Usia Target: 10 - 18 Tahun · Intensif</p>
                  <p className="text-sm text-slate-600">Bimbingan intensif persiapan ajang robotika nasional dan global seperti WRO, KRI, dan olimpiade mekatronika eksklusif alumni juara.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimoni Orangtua */}
          <section className="py-16 bg-slate-50 border-t border-b border-slate-100" id="landing-testimonials">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="text-center space-y-2">
                <h2 className="font-display font-semibold text-xs text-blue-600 tracking-wider uppercase">Bukti Nyata</h2>
                <p className="font-display font-bold text-3xl text-slate-900">Kata Orang Tua Siswa BOBOTIC</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4 text-left">
                  <div className="flex text-amber-400">
                    <Star className="h-4 w-4 fill-amber-400" />
                    <Star className="h-4 w-4 fill-amber-400" />
                    <Star className="h-4 w-4 fill-amber-400" />
                    <Star className="h-4 w-4 fill-amber-400" />
                    <Star className="h-4 w-4 fill-amber-400" />
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed italic">
                    &quot;Mentornya baik & sangat sabar mengajari Budi dari yang buta coding sampai sekarang bisa bikin game labirin sendiri di Scratch. Sesi belajarnya dinanti-nanti terus!&quot;
                  </p>
                  <div className="flex items-center space-x-3 pt-2">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">IW</div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Ibu Wulandari</p>
                      <p className="text-[10px] text-slate-400">Orangtua Budi (Surakarta)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4 text-left">
                  <div className="flex text-amber-400">
                    <Star className="h-4 w-4 fill-amber-400" />
                    <Star className="h-4 w-4 fill-amber-400" />
                    <Star className="h-4 w-4 fill-amber-400" />
                    <Star className="h-4 w-4 fill-amber-400" />
                    <Star className="h-4 w-4 fill-amber-400" />
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed italic">
                    &quot;Solusi praktis untuk orang tua bekerja. Mentor membawa semua peralatan belajar dan langsung mengajar di rumah. Ryan jadi punya aktivitas produktif positif akhir pekan.&quot;
                  </p>
                  <div className="flex items-center space-x-3 pt-2">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">BP</div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Bapak Pratama</p>
                      <p className="text-[10px] text-slate-400">Orangtua Ryan (Sukoharjo)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4 text-left">
                  <div className="flex text-amber-400">
                    <Star className="h-4 w-4 fill-amber-400" />
                    <Star className="h-4 w-4 fill-amber-400" />
                    <Star className="h-4 w-4 fill-amber-400" />
                    <Star className="h-4 w-4 fill-amber-400" />
                    <Star className="h-4 w-4 fill-amber-400" />
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed italic">
                    &quot;Kurikulum level kompetisinya hebat. Anak kami sukses menyabet juara 2 di ajang regional berkat bimbingan mekatronika yang intens dari mentor lulusan UNS.&quot;
                  </p>
                  <div className="flex items-center space-x-3 pt-2">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">RH</div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Rahmat Hidayat</p>
                      <p className="text-[10px] text-slate-400">Orangtua Dimas (Karanganyar)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Logo Sekolah Mitra Strip */}
          <section className="py-12 bg-white" id="landing-schools">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Telah Dipercaya Untuk Pembelajaran Ekskul Di Berbagai Sekolah</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-65 grayscale hover:grayscale-0 transition-all duration-300">
                <div className="font-display font-bold text-slate-500 text-lg flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" /> <span>SD Muhammadiyah 1 Solo</span>
                </div>
                <div className="font-display font-bold text-slate-500 text-lg flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" /> <span>SD IT Nur Hidayah</span>
                </div>
                <div className="font-display font-bold text-slate-500 text-lg flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" /> <span>SMP Lazuardi Kamila</span>
                </div>
                <div className="font-display font-bold text-slate-500 text-lg flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" /> <span>SD Al Islam 2</span>
                </div>
              </div>
            </div>
          </section>

          {/* Footer CTA Banner */}
          <section className="bg-linear-to-br from-blue-700 to-indigo-800 text-white py-16" id="landing-cta-banner">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
              <h2 className="font-display font-bold text-3xl sm:text-4xl">Mulai Perjalanan Belajar Robotics Anak Anda Hari Ini</h2>
              <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
                Bantu anak Anda beralih dari sekadar bermain gadget pasif menjadi kreator teknologi masa depan. Pendaftaran praktis hanya memerlukan waktu 2 menit.
              </p>
              <button
                onClick={() => onNavigate("kelas")}
                className="px-8 py-4 bg-white text-blue-700 hover:bg-slate-50 font-bold rounded-xl text-sm transition-all shadow-xl hover:scale-105 cursor-pointer inline-block"
              >
                Daftar Kelas Sekarang
              </button>
            </div>
          </section>
        </div>
      )}


      {/* =========================================
                     2. HALAMAN TENTANG KAMI
         ========================================= */}
      {activeView === "tentang" && (
        <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-16 text-left" id="about-container">
          
          {/* Hero Tentang */}
          <section className="text-center space-y-4">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">Profil Tim</span>
            <h1 className="font-display font-bold text-3xl sm:text-5xl text-slate-900">Mencetak Generasi Teknolog Muda Solo Raya</h1>
            <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
              BOBOTIC didirikan pada pertengahan 2024 dengan sebuah tekad sederhana: mendemokratisasi akses robotik canggih dan coding interaktif tanpa membebani orangtua dengan biaya hardware yang melambung tinggi.
            </p>
          </section>

          {/* Visi & Misi */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="bg-slate-900 text-white p-8 rounded-2xl space-y-4 shadow-md">
              <h3 className="font-display font-bold text-lg text-amber-400">Visi Kami</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                &quot;Menjadi ekosistem pendidikan teknologi mobile terbesar di Indonesia yang menjembatani generasi muda Indonesia dengan kecakapan digital masa depan lewat cara belajar praktis, inklusif, dan menyenangkan.&quot;
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg text-slate-800">Misi Perusahaan</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 mr-2 shrink-0" />
                  <span><strong>Aksesibilitas Tanpa Batas:</strong> Mengantarkan pengajaran terbaik langsung ke ruang tamu siswa tanpa hambatan transportasi.</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 mr-2 shrink-0" />
                  <span><strong>Kurikulum Data-Driven:</strong> Menjamin laporan evaluasi progres per-sesi transparan demi kenyamanan orang tua.</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-600 mr-2 shrink-0" />
                  <span><strong>Eksklusivitas Mentor:</strong> Merekrut, mensertifikasi, dan memberdayakan mahasiswa berprestasi nasional sebagai agen perubahan.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Kisah Pendiri */}
          <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-xl text-slate-900 border-b border-slate-50 pb-2">Kisah di Balik BOBOTIC</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Dipelopori oleh sekelompok alumni Mekatronika UNS pada Q3 2024, mereka menyaksikan tantangan pendidikan di mana banyak anak yang berminat tinggi pada dunia robotik namun terkendala fasilitas sekolah yang minim ataupun keterbatasan waktu orang tua mengantarkan buah hatinya ke tempat les reguler.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Dengan konsep &quot;Mentor Datang ke Rumah&quot;, kami mengeliminasi kendala tersebut. Kami memberikan kedaulatan waktu, materi komprehensif, dan melengkapi seluruh proses belajar anak Anda di rumah secara prima.
            </p>
          </section>

          {/* Tim Inti Grid */}
          <section className="space-y-6">
            <h3 className="font-display font-bold text-xl text-slate-900 text-center">Tim Inti BOBOTIC</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-100 p-6 rounded-2xl text-center space-y-3">
                <div className="h-16 w-16 bg-blue-600 text-white font-bold font-display rounded-full flex items-center justify-center mx-auto text-lg glow-primary">MR</div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-800">Muhammad Rifqi, M.T.</h4>
                  <p className="text-[10px] text-blue-600 font-semibold uppercase">CEO & Co-Founder</p>
                </div>
                <p className="text-xs text-slate-500">Alumni S2 Teknik Instrumentasi Elektro UNS, Eks Peneliti Robotika Juara KRI.</p>
              </div>
              <div className="bg-white border border-slate-100 p-6 rounded-2xl text-center space-y-3">
                <div className="h-16 w-16 bg-blue-600 text-white font-bold font-display rounded-full flex items-center justify-center mx-auto text-lg glow-primary">AD</div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-800">Amelia Dewandari</h4>
                  <p className="text-[10px] text-blue-600 font-semibold uppercase">Chief Curriculum Officer</p>
                </div>
                <p className="text-xs text-slate-500">Eks Pengembang Kurikulum EdTech Nasional, Spesialis Block-Programming.</p>
              </div>
              <div className="bg-white border border-slate-100 p-6 rounded-2xl text-center space-y-3">
                <div className="h-16 w-16 bg-blue-600 text-white font-bold font-display rounded-full flex items-center justify-center mx-auto text-lg glow-primary">YK</div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-800">Yusuf Kurniadi</h4>
                  <p className="text-[10px] text-blue-600 font-semibold uppercase">Lead Software Engineer</p>
                </div>
                <p className="text-xs text-slate-500">Mantan Full-stack Engineer di SaaS Fintech startup, Penanggung jawab Dashboard BOBOTIC.</p>
              </div>
            </div>
          </section>

          {/* Timeline Milestone */}
          <section className="space-y-6">
            <h3 className="font-display font-bold text-xl text-slate-900 text-center">Milestone & Garis Waktu</h3>
            <div className="border-l-2 border-blue-500 ml-4 pl-6 space-y-8 text-left">
              <div className="relative space-y-1">
                <div className="absolute -left-[31px] top-1.5 h-4 w-4 bg-blue-600 rounded-full border-4 border-white"></div>
                <span className="text-xs font-bold text-blue-600 font-mono">Q3 2024</span>
                <h4 className="font-display font-bold text-sm text-slate-800">Pilot Project Diluncurkan</h4>
                <p className="text-xs text-slate-500">Mengajar 15 siswa perdana di Surakarta menggunakan dana bootstrapped, merumuskan silabus modular Level 1.</p>
              </div>
              <div className="relative space-y-1">
                <div className="absolute -left-[31px] top-1.5 h-4 w-4 bg-blue-600 rounded-full border-4 border-white"></div>
                <span className="text-xs font-bold text-blue-600 font-mono">Q1 2025</span>
                <h4 className="font-display font-bold text-sm text-slate-800">Sertifikasi & Mitra Universitas</h4>
                <p className="text-xs text-slate-500">Bekerja sama erat dengan himpunan mahasiswa universitas negeri UNS dan swasta UMS untuk rekrutmen mentor bersertifikat.</p>
              </div>
              <div className="relative space-y-1">
                <div className="absolute -left-[31px] top-1.5 h-4 w-4 bg-blue-600 rounded-full border-4 border-white"></div>
                <span className="text-xs font-bold text-blue-600 font-mono">Q2 - Q3 2025</span>
                <h4 className="font-display font-bold text-sm text-slate-800">Implementasi Real-Time Progress Engine</h4>
                <p className="text-xs text-slate-500">Perilisan Dashboard digital siswa, memberikan hak pantau penuh orangtua terhadap skor hasil karya si kecil.</p>
              </div>
              <div className="relative space-y-1">
                <div className="absolute -left-[31px] top-1.5 h-4 w-4 bg-blue-600 rounded-full border-4 border-white"></div>
                <span className="text-xs font-bold text-blue-600 font-mono">Tahun 2026 (Sekarang)</span>
                <h4 className="font-display font-bold text-sm text-slate-800">Ekspansi Solo Raya</h4>
                <p className="text-xs text-slate-500">Melayani lebih dari 450 siswa aktif dan resmi bermitra dengan belasan sekolah di berbagai distrik kabupaten.</p>
              </div>
            </div>
          </section>

          {/* Nilai Perusahaan */}
          <section className="bg-slate-50 p-8 rounded-2xl border border-slate-200/60">
            <h3 className="font-display font-bold text-xl text-slate-900 mb-6 text-center">Nilai-Nilai Utama BOBOTIC</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white p-4 rounded-xl shadow-xs space-y-2">
                <div className="font-display font-bold text-blue-600 text-lg">A</div>
                <h4 className="font-display font-bold text-xs text-slate-800 uppercase">Accessible</h4>
                <p className="text-[10px] text-slate-500">Mengeliminasi batasan jarak demi kemudahan belajar.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-xs space-y-2">
                <div className="font-display font-bold text-blue-600 text-lg">D</div>
                <h4 className="font-display font-bold text-xs text-slate-800 uppercase">Data-Driven</h4>
                <p className="text-[10px] text-slate-500">Penilaian terukur transparan untuk setiap modul.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-xs space-y-2">
                <div className="font-display font-bold text-blue-600 text-lg">I</div>
                <h4 className="font-display font-bold text-xs text-slate-800 uppercase">Impact</h4>
                <p className="text-[10px] text-slate-500">Berdayakan masa depan mekatronik di Solo Raya.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-xs space-y-2">
                <div className="font-display font-bold text-blue-600 text-lg">C</div>
                <h4 className="font-display font-bold text-xs text-slate-800 uppercase">Community</h4>
                <p className="text-[10px] text-slate-500">Silaturahmi aktif guru, murid, dan universitas negeri.</p>
              </div>
            </div>
          </section>

          {/* Mitra & Ekosistem */}
          <section className="space-y-4">
            <h3 className="font-display font-bold text-xl text-slate-900 text-center">Sumber Mentor & Mitra Ekosistem</h3>
            <p className="text-xs text-slate-500 text-center">Kami bekerja sama erat dengan instansi akademis terbaik di wilayah Solo Raya untuk menjamin kualitas pengajar.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-white p-4 rounded-xl border border-slate-100 font-display font-bold text-slate-700 text-xs flex items-center justify-center">Universitas Sebelas Maret (UNS)</div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 font-display font-bold text-slate-700 text-xs flex items-center justify-center">Univ. Muhammadiyah Surakarta (UMS)</div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 font-display font-bold text-slate-700 text-xs flex items-center justify-center text-blue-700">UIN Raden Mas Said Surakarta (UIN Surakarta)</div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 font-display font-bold text-slate-700 text-xs flex items-center justify-center">Indobot Academy (Sertifikasi Robotika)</div>
            </div>
          </section>
        </div>
      )}


      {/* =========================================
                     3. HALAMAN HARGA & PAKET
         ========================================= */}
      {activeView === "harga" && (
        <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-16" id="pricing-container">
          <div className="text-center space-y-4">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100 font-mono">ESTIMATOR BIAYA</span>
            <h1 className="font-display font-bold text-3xl sm:text-5xl text-slate-900">Pilih Paket Belajar Terbaik</h1>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              Berikan akses terbaik ke teknologi tanpa hambatan biaya sewa kits mahal.
            </p>

            {/* Switch Toggle Tab B2C/B2B */}
            <div className="flex justify-center pt-2">
              <div className="bg-slate-200/60 p-1.5 rounded-2xl flex items-center shadow-xs border border-slate-200">
                <button
                  onClick={() => setB2cActiveTab("b2c")}
                  className={`px-6 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    b2cActiveTab === "b2c" ? "bg-white text-slate-900 shadow-md" : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  TAB B2C — Privat & Kelompok
                </button>
                <button
                  onClick={() => setB2cActiveTab("b2b")}
                  className={`px-6 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    b2cActiveTab === "b2b" ? "bg-white text-slate-900 shadow-md" : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  TAB B2B — Ekskul Sekolah
                </button>
              </div>
            </div>
          </div>

          {/* Conditional Rendering based on Tab */}
          {b2cActiveTab === "b2c" ? (
            <div className="space-y-12 text-left" id="pricing-b2c-section">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                
                {/* B2C Single 1-on-1 Card */}
                <div className="bg-white border-2 border-blue-500 p-8 rounded-3xl relative flex flex-col justify-between shadow-xl glow-primary">
                  <div className="absolute top-0 right-6 -translate-y-1/2 bg-amber-500 text-slate-950 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-md flex items-center space-x-1">
                    <Flame className="h-3 w-3 fill-slate-950 text-indigo-950 shrink-0" />
                    <span>Paling Populer</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-display font-bold text-2xl text-slate-900">Paket Privat 1-on-1</h3>
                      <p className="text-xs text-slate-400 mt-1">Kami kirim mentor pilihan ke rumah Anda</p>
                    </div>
                    <div>
                      <span className="font-mono text-4xl font-extrabold text-blue-600">Rp 75.000</span>
                      <span className="text-xs text-slate-500 font-medium tracking-wide"> / sesi pertemuan (90 menit)</span>
                    </div>
                    <ul className="space-y-2 border-t border-slate-50 pt-4 text-xs text-slate-600">
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> <span>Pilih mentor favorit Anda sendiri</span></li>
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> <span>Jadwal fleksibel (reschedule bebas s.d H-24 jam)</span></li>
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> <span>Dasbor evaluasi progres real-time & skor</span></li>
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> <span>Laporan rinci ke orang tua setelah kelas selesai</span></li>
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> <span>Ganti mentor instan jika dirasa tidak cocok (Gratis)</span></li>
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> <span>Seluruh kit mekatronika eksklusif dibawa mentor</span></li>
                    </ul>
                  </div>
                  <button
                    onClick={() => onNavigate("kelas")}
                    className="w-full mt-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center text-xs transition-all shadow-md cursor-pointer"
                  >
                    Daftar Privat Sekarang
                  </button>
                </div>

                {/* B2C Kelompok Card */}
                <div className="bg-white border border-slate-200 p-8 rounded-3xl flex flex-col justify-between shadow-xs">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-display font-bold text-2xl text-slate-900">Paket Kelompok (2-5 Siswa)</h3>
                      <p className="text-xs text-slate-400 mt-1">Belajar seru bersama sahabat bertempat di satu rumah</p>
                    </div>
                    <div>
                      <span className="font-mono text-4xl font-bold text-slate-800">Rp 60.000</span>
                      <span className="text-xs text-slate-500 font-medium tracking-wide"> / siswa / sesi (90 menit)</span>
                    </div>
                    <ul className="space-y-2 border-t border-slate-50 pt-4 text-xs text-slate-600">
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> <span>Sangat cocok untuk hemat biaya bersama tetangga</span></li>
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> <span>Laporan perkembangan modular per individu siswa</span></li>
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> <span>Mentor ditugaskan otomatis via sistem</span></li>
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> <span>Jadwal tetap disepakati bersama kelompok</span></li>
                      <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> <span>Dibatasi maksimal 5 anak demi fokus kelas</span></li>
                    </ul>
                  </div>
                  <button
                    onClick={() => onNavigate("kelas")}
                    className="w-full mt-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-center text-xs transition-all cursor-pointer"
                  >
                    Daftar Kelas Kelompok
                  </button>
                </div>

              </div>

              {/* Kelompok Tabel Perbandingan Paket */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
                <h3 className="font-display font-bold text-lg text-slate-900 mb-4 text-center">Tabel Perbandingan Fitur Utama B2C</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-600">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-3 font-semibold text-slate-800">Nama Fitur</th>
                        <th className="p-3 font-semibold text-slate-800">Paket Privat 1-on-1</th>
                        <th className="p-3 font-semibold text-slate-800">Paket Kelompok (2-5 Anak)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-3 font-medium">Beban Biaya per Siswa</td>
                        <td className="p-3 font-mono text-blue-600 font-bold">Rp 75.000 / Sesi</td>
                        <td className="p-3 font-mono text-slate-800 font-bold">Rp 60.000 / Sesi</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Kedasulatan Memilih Mentor</td>
                        <td className="p-3">Bebas memilih di dasbor siswa</td>
                        <td className="p-3 text-slate-400">Mentor ditugaskan sistem</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Toleransi Kapasitas Murid</td>
                        <td className="p-3">Maksimal 1 Siswa</td>
                        <td className="p-3">2 - 5 Siswa</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Laporan Orang Tua Mandiri</td>
                        <td className="p-3 text-green-600 font-bold">Ya (Rinci Tiap Pertemuan)</td>
                        <td className="p-3 text-green-600 font-bold">Ya (Laporan Per-anak)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Fleksibilitas Pengubahan Waktu</td>
                        <td className="p-3 text-green-600 font-semibold">Sangat Tinggi (Atur Bebas)</td>
                        <td className="p-3">Menengah (Setuju Kolektif)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-12 text-left" id="pricing-b2b-section">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* B2B Interactive Calculator */}
                <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-lg space-y-6">
                  <div className="flex items-center space-x-2 border-b border-slate-50 pb-3">
                    <Calculator className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="font-display font-bold text-lg text-slate-900">Kalkulator Biaya B2B Interaktif</h3>
                      <p className="text-[11px] text-slate-400">Atur parameter di bawah untuk kalkulasi instan di tempat</p>
                    </div>
                  </div>

                  {/* Level dropdown selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">1. Pilih Jenjang Sekolah</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["SD", "SMP", "SMA"].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setB2bLevelSetting(lvl as any)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            b2bLevelSetting === lvl
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          }`}
                        >
                          {lvl === "SD" ? "Tingkat SD" : lvl === "SMP" ? "Tingkat SMP" : "Tingkat SMA"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Range slider for student count */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-700">2. Input Jumlah Siswa Terdaftar</label>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-mono font-bold rounded-lg border border-blue-100">
                        {b2bStudentCount} Siswa
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max={maxB2bStudents}
                      step="1"
                      value={Math.min(maxB2bStudents, b2bStudentCount)}
                      onChange={(e) => setB2bStudentCount(Math.min(maxB2bStudents, Number(e.target.value)))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold font-mono">
                      <span>10 SISWA (MINIMAL)</span>
                      <span>{maxB2bStudents} SISWA (MAKSIMAL)</span>
                    </div>
                  </div>

                  {/* Quote Display Area */}
                  <div className="bg-slate-900 p-6 rounded-2xl text-white text-center space-y-2 glow-primary">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">ESTIMASI TARIF PER SESI KELAS</p>
                    <p className="font-mono text-3xl font-extrabold text-amber-400">
                      Rp {getB2bQuote().toLocaleString("id-ID")}
                    </p>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Sesuai formula progresif: base 10 siswa pertama, +{b2bLevelSetting === "SD" ? "Rp 10.000" : b2bLevelSetting === "SMP" ? "Rp 15.000" : "Rp 20.000"} per-siswa tambahan, dibatasi maksimal {maxB2bStudents} siswa.
                    </p>
                    <div className="bg-slate-800 p-2.5 rounded-lg text-[10px] text-left space-y-1 font-mono text-slate-300 border border-slate-750">
                      <p>• Tarif Dasar 10 Anak: Rp {b2bLevelSetting === "SD" ? "75.000" : b2bLevelSetting === "SMP" ? "100.000" : "120.000"}</p>
                      <p>• Tambahan {Math.max(0, Math.min(maxB2bStudents, b2bStudentCount) - 10)} Anak: Rp {(Math.max(0, Math.min(maxB2bStudents, b2bStudentCount) - 10) * (b2bLevelSetting === "SD" ? 10000 : b2bLevelSetting === "SMP" ? 15000 : 20000)).toLocaleString("id-ID")}</p>
                    </div>
                  </div>

                  <a
                    href="https://wa.me/6282212345678?text=Halo%20BOBOTIC%20Robotics,%20saya%20ingin%20mengajukan%20penawaran%20B2B%20untuk%20sekolah"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-center text-xs transition-all block cursor-pointer"
                  >
                    Hubungi Kami Untuk Penawaran Resmi
                  </a>
                </div>

                {/* What School Gets Column */}
                <div className="lg:col-span-5 bg-slate-900 text-white p-6 rounded-3xl space-y-6 shadow-sm text-left">
                  <h3 className="font-display font-medium text-lg text-white">Fasilitas B2B Sekolah</h3>
                  <p className="text-xs text-slate-400">Seluruh paket kemitraan sudah bermuatan fasilitas berikut tanpa biaya tak terduga:</p>
                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-amber-500 mr-2 shrink-0 mt-0.5" />
                      <span>Guru bersertifikat terpercaya hadir mengajar di sekolah</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-amber-500 mr-2 shrink-0 mt-0.5" />
                      <span>Sekolah bebas biaya sewa toolkit mikrokontroler (alat dibawa instan)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-amber-500 mr-2 shrink-0 mt-0.5" />
                      <span>Dasbor penilaian guru & rapor bulanan ke kepsek reguler</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-amber-500 mr-2 shrink-0 mt-0.5" />
                      <span>Tersedia program pendistribusian sertifikat digital berverifikasi</span>
                    </li>
                  </ul>

                  {/* Bootcamp Option */}
                  <div className="border-t border-slate-800 pt-6 space-y-3">
                    <div className="flex items-center space-x-1">
                      <Flame className="h-4 w-4 text-orange-400" />
                      <span className="font-display font-semibold text-sm text-white">Bootcamp KRI/WRO</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Coaching intensif 4-8 minggu oleh alumni juara mekatronika nasional.</p>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      )}


      {/* =========================================
                     4. HALAMAN DAFTAR KELAS
         ========================================= */}
      {activeView === "kelas" && (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12" id="class-registry-container">
          <div className="text-center space-y-3">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100 font-mono">DASHBOARD PENDAFTARAN</span>
            <h1 className="font-display font-bold text-3xl sm:text-5xl text-slate-900">Eksplorasi Kurikulum & Daftar</h1>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              Situs ini terhubung langsung dengan sistem pembayaran QRIS cerdas dan pencocokan guru otomatis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {classesData.map((cls) => (
              <div
                key={cls.id}
                className={`bg-white border rounded-3xl p-6 relative flex flex-col justify-between shadow-xs ${
                  cls.isSpecial ? "border-purple-300 ring-2 ring-purple-100" : "border-slate-100"
                }`}
              >
                {cls.isSpecial && (
                  <span className="absolute top-4 right-4 bg-purple-600 text-white font-bold uppercase rounded-md text-[9px] px-2 py-0.5">
                    Rekomendasi Kompetisi
                  </span>
                )}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-sm uppercase ${
                      cls.type === "Privat"
                        ? "bg-blue-50 text-blue-700"
                        : cls.type === "Kelompok"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-purple-150 text-purple-800"
                    }`}>
                      {cls.type === "Privat" ? "1-on-1 Privat" : cls.type === "Kelompok" ? "Kelompok" : "Bootcamp"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold font-mono">LEVEL {cls.level}</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-800 line-clamp-1">{cls.name}</h3>
                  
                  <div className="space-y-1 text-xs text-slate-500 font-semibold font-mono">
                    <p>• Target Usia: {cls.age}</p>
                    <p>• Durasi: {cls.duration}</p>
                    {cls.remainingQuota && (
                      <p className="text-orange-600">• Kuota Tersisa: Sisa {cls.remainingQuota} Kursi</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 text-amber-500 text-xs font-semibold">
                    <Star className="h-4 w-4 fill-amber-500" />
                    <span>{cls.rating} (Rating Mentor Terverifikasi)</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-50 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Harga Mulai</p>
                    <p className="font-mono text-base font-bold text-blue-600">
                      Rp{cls.price.toLocaleString("id-ID")}{cls.type !== "Bootcamp" ? "/Sesi" : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenRegistration(cls)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer shrink-0"
                  >
                    Daftar Kelas
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Modal / Pop-Up */}
          {selectedClassCard && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl animate-in font-sans">
                
                {/* Header Modal */}
                <div className="flex justify-between items-start border-b border-slate-50 pb-4 mb-6">
                  <div>
                    <h3 className="font-display font-bold text-xl text-slate-900">Form Pendaftaran BOBOTIC</h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{selectedClassCard.name}</p>
                  </div>
                  <button
                    onClick={() => setSelectedClassCard(null)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 bg-slate-100 rounded-full h-8 w-8 flex items-center justify-center cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* 3 Steps Visual Bar */}
                <div className="flex justify-between items-center mb-6 text-xs text-slate-400 uppercase font-semibold">
                  <span className={`py-1 ${registerStep === 1 ? "text-blue-600 font-bold border-b-2 border-blue-600" : ""}`}>1. Data Diri</span>
                  <span className={`py-1 ${registerStep === 2 ? "text-blue-600 font-bold border-b-2 border-blue-600" : ""}`}>2. QRIS Pembayaran</span>
                  <span className={`py-1 ${registerStep === 3 ? "text-blue-600 font-bold border-b-2 border-blue-600" : ""}`}>3. Selesai</span>
                </div>

                {/* STEP 1: Form Inputs */}
                {registerStep === 1 && (
                  <form onSubmit={handleNextStep1} className="space-y-4 text-left">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Nama Siswa</label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none"
                        placeholder="Nama Lengkap Calon Siswa (cth: Budi Santoso)"
                        value={registrationForm.name}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, name: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Usia Siswa (Tahun)</label>
                        <select
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none"
                          value={registrationForm.age}
                          onChange={(e) => setRegistrationForm({ ...registrationForm, age: e.target.value })}
                        >
                          {["6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"].map((u) => (
                            <option key={u} value={u}>{u} Tahun</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 font-mono">No. WhatsApp Aktif (08xx)</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none"
                          placeholder="cth: 082345678901"
                          value={registrationForm.phone}
                          onChange={(e) => setRegistrationForm({ ...registrationForm, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Alamat Lengkap Kunjungan</label>
                      <textarea
                        required
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none min-h-[60px]"
                        placeholder="Tuliskan alamat rumah untuk kedatangan mentor (Solo Raya)"
                        value={registrationForm.address}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, address: e.target.value })}
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Preferensi Waktu Sesi</label>
                        <select
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500"
                          value={registrationForm.schedulePreference}
                          onChange={(e) => setRegistrationForm({ ...registrationForm, schedulePreference: e.target.value })}
                        >
                          <option value="Sabtu Pagi">Sabtu Pagi (09:00)</option>
                          <option value="Sabtu Sore">Sabtu Sore (15:00)</option>
                          <option value="Minggu Pagi">Minggu Pagi (10:00)</option>
                          <option value="Rabu Sore">Rabu Sore (15:30)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Jumlah Pertemuan Awal</label>
                        {selectedClassCard.type === "Bootcamp" ? (
                          <input type="text" disabled className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500" value="1 Program Intensif" />
                        ) : (
                          <select
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500"
                            value={registrationForm.sessionCount}
                            onChange={(e) => setRegistrationForm({ ...registrationForm, sessionCount: e.target.value })}
                          >
                            <option value="1">1 Sesi (Pay-as-you-go)</option>
                            <option value="4">4 Sesi (Bundle Starter)</option>
                            <option value="8">8 Sesi (Paket Mahir)</option>
                          </select>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center text-xs transition-all shadow-md cursor-pointer mt-4"
                    >
                      Lanjutkan Ke Pembayaran
                    </button>
                  </form>
                )}

                {/* STEP 2: Payment Gateway Interface */}
                {registerStep === 2 && (
                  <div className="space-y-6 text-center text-slate-700">
                    <div className="bg-slate-50 p-4 rounded-xl text-left border border-slate-150 space-y-2 text-xs">
                      <p className="font-semibold text-slate-800">Ringkasan Pendaftaran:</p>
                      <p>Siswa: {registrationForm.name} ({registrationForm.age} Tahun)</p>
                      <p>Paket: {selectedClassCard.name}</p>
                      <p>Preferensi Sesi: {registrationForm.schedulePreference}</p>
                      <p className="text-sm font-mono font-bold text-slate-900 border-t border-slate-200/80 pt-2 flex justify-between">
                        <span>Total Tagihan:</span>
                        <span className="text-blue-600">
                          Rp {selectedClassCard.type === "Bootcamp"
                            ? selectedClassCard.price.toLocaleString("id-ID")
                            : (selectedClassCard.price * Number(registrationForm.sessionCount)).toLocaleString("id-ID")
                          }
                        </span>
                      </p>
                    </div>

                    {/* QRIS Graphic Display */}
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Scan Kode QRIS Untuk Memproses Pembayaran</p>
                      <div className="mx-auto w-40 h-40 bg-zinc-950 p-2 rounded-2xl flex items-center justify-center border border-slate-200 shadow-md">
                        {/* Static dynamic QRIS rendering using an SVG representing a realistic QRIS scan box */}
                        <svg className="w-full h-full text-white fill-current" viewBox="0 0 100 100">
                          <rect x="5" y="5" width="20" height="20" className="text-white" />
                          <circle cx="15" cy="15" r="5" className="text-blue-500" />
                          <rect x="75" y="5" width="20" height="20" />
                          <circle cx="85" cy="15" r="5" className="text-blue-500" />
                          <rect x="5" y="75" width="20" height="20" />
                          <circle cx="15" cy="85" r="5" className="text-blue-500" />
                          {/* Inner lines representing QR Codes */}
                          <line x1="30" y1="10" x2="70" y2="10" stroke="white" strokeWidth="4" />
                          <line x1="30" y1="20" x2="60" y2="20" stroke="white" strokeWidth="4" />
                          <line x1="10" y1="30" x2="90" y2="30" stroke="white" strokeWidth="4" />
                          <line x1="40" y1="45" x2="80" y2="45" stroke="white" strokeWidth="6" />
                          <line x1="15" y1="60" x2="55" y2="60" stroke="white" strokeWidth="4" strokeDasharray="3 3" />
                          <line x1="70" y1="75" x2="85" y2="90" stroke="white" strokeWidth="6" />
                          <text x="32" y="85" className="text-emerald-400 font-bold" fontSize="13">QRIS</text>
                        </svg>
                      </div>
                      <p className="text-xs font-semibold text-slate-800">BOBOTIC Robotics & Coding</p>
                      <p className="text-[10px] text-slate-400">No Rekening Resmi: Mandiri 138-00-1122-4455</p>
                    </div>

                    <button
                      onClick={handleConfirmPayment}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-center text-xs transition-all shadow-md cursor-pointer glow-success"
                    >
                      Saya Sudah Bayar (Konfirmasi Instan)
                    </button>
                  </div>
                )}

                {/* STEP 3: Checkout Success State */}
                {registerStep === 3 && (
                  <div className="space-y-6 text-center py-6">
                    <div className="h-16 w-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-md">
                      <Check className="h-8 w-8 stroke-[3]" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-display font-bold text-xl text-slate-900">Pendaftaran Berhasil Selesai!</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                        Terima kasih! Pesanan Anda telah divalidasi sistem otomatis. Akun Siswa virtual telah didaftarkan aktif di platform.
                      </p>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/60 inline-block text-left text-xs space-y-1 font-mono text-slate-600">
                        <p>• Akun Baru: <span className="font-bold text-slate-800">{registrationForm.name}</span></p>
                        <p>• Password Default: <span className="font-bold text-slate-800">123456</span></p>
                      </div>
                      <p className="text-[10px] text-slate-400">Kami mengirim konfirmasi dan kontak mentor via WhatsApp (1x24 jam).</p>
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button
                        onClick={() => {
                          setSelectedClassCard(null);
                          onNavigate("auth-login");
                        }}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center text-xs transition-all shadow-md cursor-pointer"
                      >
                        Masuk Ke Dasbor Siswa
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      )}


      {/* =========================================
                     5. HALAMAN FAQ ACCORDIONS
         ========================================= */}
      {activeView === "faq" && (
        <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8 text-left" id="faq-container">
          <div className="text-center space-y-3">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100 font-mono">PUSAT INFORMASI</span>
            <h1 className="font-display font-bold text-3xl sm:text-5xl text-slate-900">Pertanyaan Sering Diajukan</h1>
            <p className="text-sm text-slate-500">
              Temukan jawaban tercepat seputar sistem kursus privat, penugasan mentor, mekatronika, dan skema sekolah.
            </p>
          </div>

          {/* FAQ Horizontal Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 border-b border-slate-200 pb-4">
            {Object.keys(faqDatabase).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setFaqCategory(cat);
                  setActiveFaqId(null);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl border capitalize cursor-pointer transition-all ${
                  faqCategory === cat
                    ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                    : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
              >
                {cat === "umum"
                  ? "Umum"
                  : cat === "pembayaran"
                  ? "Pembayaran"
                  : cat === "mentor"
                  ? "Mentor & Jadwal"
                  : cat === "kurikulum"
                  ? "Kurikulum"
                  : "Sekolah (B2B)"}
              </button>
            ))}
          </div>

          {/* Accordion List Layout */}
          <div className="space-y-4">
            {faqDatabase[faqCategory].map((faq, idx) => {
              const faqId = `${faqCategory}-${idx}`;
              const isOpen = activeFaqId === faqId;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setActiveFaqId(isOpen ? null : faqId)}
                    className="w-full p-5 text-left flex justify-between items-center hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
                  >
                    <span className="font-display font-bold text-sm text-slate-800 pr-4">{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-50 animate-in fade-in slide-in-from-top-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Callout */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl text-center space-y-3">
            <h4 className="font-display font-bold text-sm">Masih Ada Pertanyaan Belum Terpecahkan?</h4>
            <p className="text-[11px] text-slate-400">Tim CS kami stand-by melayani kebutuhan belajar anak Anda 12 Jam non-stop.</p>
            <a
              href="https://wa.me/6282212345678?text=Halo%2520CS%2520BOBOTIC%2520Robotics..."
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer inline-flex items-center space-x-1.5"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Hubungi CS via WhatsApp</span>
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
