/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Award, Calendar, CheckCircle2, Star, ShieldCheck, BookOpen,
  ArrowRight, Bell, ClipboardList, RefreshCw, Smartphone, Video,
  Clock, Download, ChevronRight, UserPlus, Info, Check, HelpCircle,
  PlayCircle
} from "lucide-react";

import { StudentProfile, MentorProfile, ScheduleEvent, MentorRequest, CurriculumModule } from "../types";
import { DEFAULT_CURRICULUM } from "../data";

interface SiswaPanelProps {
  activeView: string;
  loggedUser: StudentProfile;
  students: StudentProfile[];
  mentors: MentorProfile[];
  schedules: ScheduleEvent[];
  requests: MentorRequest[];
  curriculum: CurriculumModule[];
  onUpdateSchedules: (updated: ScheduleEvent[]) => void;
  onUpdateRequests: (updated: MentorRequest[]) => void;
  onUpdateStudents: (updated: StudentProfile[]) => void;
  onNavigate: (view: string) => void;
  onShowToast: (message: string, type?: "success" | "warning" | "info") => void;
}

export default function SiswaPanel({
  activeView,
  loggedUser,
  students,
  mentors,
  schedules,
  requests,
  curriculum,
  onUpdateSchedules,
  onUpdateRequests,
  onUpdateStudents,
  onNavigate,
  onShowToast
}: SiswaPanelProps) {
  // Shared States within Siswa Panel
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>("2026-06-06");
  const [activeModuleDetail, setActiveModuleDetail] = useState<CurriculumModule | null>(null);
  const [requestMentorModal, setRequestMentorModal] = useState<MentorProfile | null>(null);
  const [reqSchedulePref, setReqSchedulePref] = useState<string>("Sabtu Sore (15:00)");
  const [selectedMateriTrack, setSelectedMateriTrack] = useState<number | null>(null);
  const [selectedSesiRecord, setSelectedSesiRecord] = useState<ScheduleEvent | null>(null);

  // Interactive Quiz States
  const [quizInProgress, setQuizInProgress] = useState(false);
  const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState(0);
  const [quizSelectedAnswers, setQuizSelectedAnswers] = useState<number[]>([]);
  const [quizCompletedScore, setQuizCompletedScore] = useState<number | null>(null);

  // Sync state helpers
  const studentProfile = students.find(s => s.id === loggedUser.id) || loggedUser;
  const mySchedules = schedules.filter(s => s.siswaId === studentProfile.id);
  const myRequests = requests.filter(r => r.siswaId === studentProfile.id);

  // Filter modules relevant to this student's selected track/level
  const activeTrackLevel = selectedMateriTrack !== null ? selectedMateriTrack : studentProfile.level;
  const levelModules = (curriculum && curriculum.length > 0 ? curriculum : DEFAULT_CURRICULUM).filter(m => m.level === activeTrackLevel);
  const completedModuleCount = studentProfile.completedModules?.length || 0;
  const displayCompletedModuleCount = Math.max(1, completedModuleCount);
  const displayModuleTotal = Math.max(3, levelModules.length || 3);
  const displayModuleProgressPercent = Math.min(100, (displayCompletedModuleCount / displayModuleTotal) * 100);

  // Calendar Day Generator for June 2026
  const juneDaysCount = 30;
  const daysInJune = Array.from({ length: juneDaysCount }, (_, i) => {
    const dayNum = i + 1;
    const dateString = `2026-06-${dayNum < 10 ? "0" + dayNum : dayNum}`;
    const sEvents = mySchedules.filter(s => s.date === dateString);
    return {
      dayNum,
      dateString,
      events: sEvents
    };
  });

  // Handle Reschedule request
  const handleReschedule = (sId: string) => {
    const newDate = prompt("Masukkan tanggal baru (YYYY-MM-DD) s.d akhir Juni 2026:", "2026-06-20");
    if (!newDate) return;
    const match = newDate.match(/^\d{4}-\d{2}-\d{2}$/);
    if (!match) {
      onShowToast("Format tanggal salah! Gunakan YYYY-MM-DD.", "warning");
      return;
    }
    const updatedSchedules = schedules.map(s => {
      if (s.id === sId) {
        return {
          ...s,
          date: newDate,
          status: "Menunggu" as const // awaits mentor approval
        };
      }
      return s;
    });
    onUpdateSchedules(updatedSchedules);
    onShowToast("Permintaan reschedule berhasil dikirim! Status sesi berubah menjadi 'Menunggu' konfirmasi mentor.", "success");
  };

  // Submit Mentor Link Request
  const handleSubmitMentorRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestMentorModal) return;

    // Create a new request object
    const newReq: MentorRequest = {
      id: "req_" + Date.now(),
      siswaId: studentProfile.id,
      siswaName: studentProfile.name,
      level: studentProfile.level,
      location: studentProfile.address,
      mentorId: requestMentorModal.id,
      requestedSchedule: reqSchedulePref,
      dateCreated: new Date().toISOString().split("T")[0],
      status: "Menunggu"
    };

    const updatedReqs = [...requests, newReq];
    onUpdateRequests(updatedReqs);
    setRequestMentorModal(null);
    onShowToast(`Permintaan berhasil dikirim ke Kak ${requestMentorModal.name}! Status menunggu persetujuan mentor.`, "success");
  };

  // Terminate / Change Mentor Safety block
  const handleRequestChangeMentor = () => {
    const conf = confirm("Apakah Anda yakin ingin mengajukan pergantian mentor? Mentor Anda saat ini akan di-unlink.");
    if (!conf) return;

    // Unlink mentor
    const updatedSiswa = students.map(s => {
      if (s.id === studentProfile.id) {
        return {
          ...s,
          activeMentorId: undefined,
          activeMentorName: undefined
        };
      }
      return s;
    });
    onUpdateStudents(updatedSiswa);
    onShowToast("Sistem berhasil melepas mentor Anda. Silakan pilih mentor baru di daftar di bawah ini!", "success");
  };

  // Standard Score array for chart
  const completedSessionsWithScores = mySchedules.filter(s => s.status === "Selesai" && s.score);

  return (
    <div className="bg-slate-50 min-h-screen pb-12 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Profile Card Header Info */}
        <div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-4 text-left">
            <div className="h-16 w-16 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center font-bold font-display text-2xl border border-white/20">
              {studentProfile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-display font-bold text-2xl">{studentProfile.name}</h1>
                <span className="px-2.5 py-0.5 bg-yellow-400 text-slate-900 text-[10px] font-bold rounded-full tracking-wider uppercase">
                  Level {studentProfile.level} Active
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-1">{studentProfile.email} · {studentProfile.phone}</p>
              <p className="text-xs text-blue-200">Alamat: {studentProfile.address}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 text-center font-mono text-white">
              <span className="text-[10px] block text-blue-200">MENTOR AKTIF</span>
              <span className="font-semibold text-sm block">
                {studentProfile.activeMentorName || "Belum Memilih"}
              </span>
            </div>
          </div>
        </div>

        {/* =========================================
                     6. DASHBOARD SISWA
           ========================================= */}
        {activeView === "siswa-dashboard" && (
          <div className="space-y-8 text-left" id="siswa-dashboard-container">
            {/* Quick Metrics (4 Cards Grid) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sessi Selesai</span>
                <p className="font-mono text-3xl font-bold text-blue-600 mt-1">{studentProfile.completedSessions}</p>
                <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(studentProfile.completedSessions / (studentProfile.completedSessions + studentProfile.remainingSessions)) * 100}%` }}></div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Progres Level %</span>
                <p className="font-mono text-3xl font-bold text-emerald-600 mt-1">{studentProfile.levelProgress}%</p>
                <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${studentProfile.levelProgress}%` }}></div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Rerata Nilai Tugas</span>
                <p className="font-mono text-3xl font-bold text-amber-500 mt-1">{studentProfile.averageScore}</p>
                <div className="mt-2 flex text-amber-400 text-xs font-semibold items-center">
                  <Star className="h-3.5 w-3.5 fill-amber-400 mr-0.5 text-amber-500" />
                  <span>Predikat Sangat Memuaskan</span>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sesi Tersisa Paket</span>
                <p className="font-mono text-3xl font-bold text-purple-600 mt-1">{studentProfile.remainingSessions}</p>
                <div className="mt-2 text-[10px] text-slate-400 font-semibold uppercase">Silakan Bundling Ulang Di Sini</div>
              </div>
            </div>

            {/* Next Upcoming Sesi details */}
            <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">SESI TERDEKAT</span>
                <p className="font-display font-bold text-sm text-slate-800">
                  {mySchedules.find(s => s.status === "Terkonfirmasi")
                    ? mySchedules.find(s => s.status === "Terkonfirmasi")?.topic
                    : "Tidak ada jadwal dikonfirmasi dalam waktu dekat."}
                </p>
                {mySchedules.find(s => s.status === "Terkonfirmasi") && (
                  <p className="text-xs text-slate-500">
                    Jadwal: {mySchedules.find(s => s.status === "Terkonfirmasi")?.date} jam {mySchedules.find(s => s.status === "Terkonfirmasi")?.time} · Mentor: Kak {mySchedules.find(s => s.status === "Terkonfirmasi")?.mentorName}
                  </p>
                )}
              </div>
              <button
                onClick={() => onNavigate("siswa-jadwal")}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0"
              >
                Tinjau Semua Jadwal
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Level Syllabus Progress Modules */}
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
                <h3 className="font-display font-bold text-lg text-slate-900">Kurikulum Level {studentProfile.level} — Scratch Coding</h3>
                <p className="text-xs text-slate-400">Satu modul selesai dari total 3 materi utama.</p>
                <div className="space-y-3">
                  {levelModules.map((m, idx) => {
                    const isCompleted = idx < 1;
                    const isInProgress = idx === 1;
                    return (
                      <div key={m.id} className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                        <div className="space-y-1 text-left">
                          <p className="font-semibold text-slate-800">{m.title}</p>
                          <p className="text-[10px] text-slate-400 leading-relaxed max-w-lg truncate">{m.summary}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-sm text-[9px] font-bold ${
                          isCompleted
                            ? "bg-emerald-50 text-emerald-700"
                            : isInProgress
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-400"
                        }`}>
                          {isCompleted ? "Selesai" : isInProgress ? "Berjalan" : "Belum Mulai"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommended actions & Latest notification panel */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Cognitive recommendations based on simulated AI analysis */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
                  <div className="flex items-center space-x-1.5 border-b border-slate-50 pb-2">
                    <Award className="h-4 w-4 text-blue-600" />
                    <span className="font-display font-bold text-xs text-slate-800">AI Rekomendasi Modul</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <p className="text-slate-500 leading-relaxed">
                      Berdasarkan masukan evaluasi mentor sesi 1: log perulangan bersarang Anda memerlukan asahan minor.
                    </p>
                    <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl space-y-1">
                      <p className="font-bold text-blue-800">Selesaikan Tugas Modul 3</p>
                      <p className="text-[10px] text-slate-500">Mempelajari reset bola memantul di game labirin.</p>
                    </div>
                    <button
                      onClick={() => onNavigate("siswa-materi")}
                      className="w-full py-2 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer text-[11px] text-center"
                    >
                      Buka Materi Sekarang
                    </button>
                  </div>
                </div>

                {/* Notifications column */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3 text-left">
                  <div className="flex items-center space-x-1.5 border-b border-slate-50 pb-2">
                    <Bell className="h-4 w-4 text-blue-600" />
                    <span className="font-display font-bold text-xs text-slate-800">Notifikasi Terbaru</span>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="border-l-2 border-blue-500 pl-3">
                      <p className="font-bold text-slate-800">Laporan Sesi 2 Terkirim</p>
                      <p className="text-[10px] text-slate-400">Skor pemahaman: 95. Evaluasi dari mentor Kak Haya Nur Fadhila.</p>
                    </div>
                    <div className="border-l-2 border-emerald-500 pl-3">
                      <p className="font-bold text-slate-800">Pembayaran Terverifikasi</p>
                      <p className="text-[10px] text-slate-400">Pembayaran bundling 4 sesi starter berhasil divalidasi sistem.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* =========================================
                     7. JADWAL SISWA (CALENDAR)
           ========================================= */}
        {activeView === "siswa-jadwal" && (
          <div className="space-y-8 text-left" id="siswa-schedule-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Monthly grid calendar visual module */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100/80 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-bold text-base text-slate-900">Kalender Sesi: Juni 2026</h3>
                  <span className="text-xs text-slate-400 font-bold font-mono">BULAN JUNI 2026</span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 py-1 uppercase tracking-wider font-mono">
                  <span>Sn</span><span>Sl</span><span>Rb</span><span>Km</span><span>Jm</span><span>Sb</span><span>Mg</span>
                </div>
                
                {/* June grid starts on Monday */}
                <div className="grid grid-cols-7 gap-2">
                  {daysInJune.map((day) => {
                    const hasSessions = day.events.length > 0;
                    const isSelected = day.dateString === selectedCalendarDate;
                    return (
                      <button
                        key={day.dayNum}
                        onClick={() => setSelectedCalendarDate(day.dateString)}
                        className={`h-10 rounded-xl relative transition-all text-xs font-semibold cursor-pointer flex flex-col justify-center items-center ${
                          isSelected
                            ? "bg-blue-600 text-white font-bold shadow-md"
                            : hasSessions
                            ? "bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <span>{day.dayNum}</span>
                        {hasSessions && !isSelected && (
                          <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Calendar click details box */}
                <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-3">
                  <p className="font-bold text-slate-700">Detail Agenda Tanggal {selectedCalendarDate} :</p>
                  {mySchedules.find(s => s.date === selectedCalendarDate) ? (
                    (() => {
                      const session = mySchedules.find(s => s.date === selectedCalendarDate)!;
                      return (
                        <div className="space-y-2 text-slate-600 text-left">
                          <p><strong className="text-slate-800">Sesi Belajar:</strong> {session.topic}</p>
                          <p><strong className="text-slate-800">Waktu / Kapan:</strong> {session.date} pukul {session.time} WIB</p>
                          <p><strong className="text-slate-800">Tempat Offline:</strong> <span className="text-red-700 font-bold underline">{session.address || studentProfile.city || "Surakarta"} (Solo Raya)</span></p>
                          <p><strong className="text-slate-800">Tentor Pengampu:</strong> Kak {session.mentorName}</p>
                          <p><strong className="text-slate-800">Kehadiran (Absensi):</strong> <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                            session.attendance === "Hadir" || session.status === "Selesai" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                          }`}>{session.attendance || (session.status === "Selesai" ? "Hadir (Terabsen)" : "Belum Berjalan")}</span></p>
                          {session.attendanceNotes && (
                            <p><strong className="text-slate-800">Catatan Guru:</strong> <span className="italic text-slate-505 bg-white px-2 py-1 rounded inline-block">&quot;{session.attendanceNotes}&quot;</span></p>
                          )}
                          <p><strong className="text-slate-800">Status Sesi:</strong> <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                            session.status === "Selesai" ? "bg-green-50 text-green-700" : "bg-blue-100 text-blue-800"
                          }`}>{session.status}</span></p>
                        </div>
                      );
                    })()
                  ) : (
                    <p className="text-slate-400">Tidak ada agenda mekatronika terjadwal pada hari ini.</p>
                  )}
                </div>
              </div>

              {/* Table list of upcoming sessions and history report */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Upcoming Classes */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
                  <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-50 pb-2">Kontrol Jadwal Sesi Mendatang</h3>
                  <div className="space-y-3">
                    {mySchedules.filter(s => s.status !== "Selesai" && s.status !== "Dibatalkan").map((sch) => (
                      <div key={sch.id} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 text-xs space-y-2">
                        <div className="text-left">
                          <p className="font-bold text-slate-800 line-clamp-1">{sch.topic}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Hari/Tanggal: {sch.date} ({sch.time})</p>
                          <p className="text-[10px] text-red-700 font-semibold">Tempat Offline: {sch.address || studentProfile.city || "Surakarta"}</p>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-sm uppercase tracking-wider">{sch.status}</span>
                          <button
                            onClick={() => handleReschedule(sch.id)}
                            className="px-2.5 py-1 text-slate-700 border border-slate-200 rounded-md bg-white font-semibold cursor-pointer"
                          >
                            Reschedule
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Completed histories */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
                  <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-50 pb-2">Riwayat Sesi & Rapor</h3>
                  <div className="space-y-3">
                    {mySchedules.filter(s => s.status === "Selesai").map((sch) => (
                      <div key={sch.id} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 text-left text-xs space-y-1.5 hover:border-blue-150 transition-all">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-slate-800 line-clamp-1 max-w-[200px]">{sch.topic}</p>
                          <span className="font-mono font-extrabold text-emerald-600 bg-emerald-50 px-1 rounded">Skor: {sch.score}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">Selesai pada: {sch.date} • Offline: {sch.address || studentProfile.city || "Surakarta"}</p>
                        <p className="text-[10px] text-emerald-800 font-semibold bg-emerald-50/50 px-2.5 py-1 rounded">Absensi: {sch.attendance || "Hadir"}</p>
                        <div className="flex justify-between items-end mt-1">
                          <p className="text-[11px] text-slate-500 italic leading-relaxed line-clamp-1 max-w-[200px]">&quot;{sch.notes || sch.attendanceNotes || "Siswa aktif berpartisipasi dan merakit sirkuit."}&quot;</p>
                          <button
                            onClick={() => setSelectedSesiRecord(sch)}
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 shrink-0 cursor-pointer hover:underline"
                          >
                            Buka Catatan &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* =========================================
                     8. PROGRES BELAJAR (GRAPHICS)
           ========================================= */}
        {activeView === "siswa-progres" && (
          <div className="space-y-8 text-left" id="siswa-progress-container">
            
            {/* Top Stats Cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Tinkercad & Scratch Level</span>
                <p className="font-display font-black text-xl text-slate-800">{studentProfile.level || "LEVEL 1"}</p>
                <div className="text-[10px] text-slate-500">Materi Operasional Aktif</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Kemajuan Modul</span>
                <p className="font-display font-black text-xl text-slate-800">
                  {displayCompletedModuleCount} / {displayModuleTotal}
                </p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all" 
                    style={{ width: `${displayModuleProgressPercent}%` }} 
                  />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Kuis Dikerjakan</span>
                <p className="font-display font-black text-xl text-slate-800">
                  {studentProfile.quizScores ? Object.keys(studentProfile.quizScores).length : 0} Selesai
                </p>
                <div className="text-[10px] text-slate-500">
                  Rata-rata: {(() => {
                    const scores = studentProfile.quizScores ? Object.values(studentProfile.quizScores) as number[] : [];
                    if (scores.length === 0) return "0 / 100";
                    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
                    return `${avg.toFixed(1)} / 100`;
                  })()}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Kehadiran Offline</span>
                <p className="font-display font-black text-xl text-slate-800">
                  {(() => {
                    const doneSessions = mySchedules.filter(s => s.status === "Selesai");
                    const attended = doneSessions.filter(s => s.attendance === "Hadir" || !s.attendance); // default is Hadir
                    if (doneSessions.length === 0) return "100%";
                    return `${Math.round((attended.length / doneSessions.length) * 100)}%`;
                  })()}
                </p>
                <div className="text-[10px] text-slate-550">
                  {mySchedules.filter(s => s.status === "Selesai" && s.attendance === "Hadir").length} Hadir dari {mySchedules.filter(s => s.status === "Selesai").length} Pertemuan
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: Grade Trajectory Visual representation */}
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100/85 shadow-xs space-y-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">Grafik Perkembangan Skor Sesi</h3>
                  <p className="text-xs text-slate-400">Analisis tren kemampuan penalaran logis serta pemecahan masalah mekatronika anak Anda.</p>
                </div>

                {/* Custom Inline Responsive SVG Line-Plot, no heavy external component dependencies wrapper */}
                <div className="w-full h-64 border border-slate-100 bg-slate-50/50 rounded-2xl flex items-center justify-center p-4 relative">
                  <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                    {/* SVG Grid horizontal guides */}
                    <line x1="0" y1="20" x2="400" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="60" x2="400" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="100" x2="400" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="140" x2="400" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="180" x2="400" y2="180" stroke="#f1f5f9" strokeWidth="1" />

                    {/* Plot coordinates corresponding to scores 80, 85, 92 and 95 */}
                    <polyline
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points="20,130 140,110 260,60 380,40"
                    />

                    {/* Score Dots */}
                    <circle cx="20" cy="130" r="5" fill="#1e3a8a" />
                    <circle cx="140" cy="110" r="5" fill="#1e3a8a" />
                    <circle cx="260" cy="60" r="5" fill="#1e3a8a" />
                    <circle cx="380" cy="40" r="5" fill="#1e3a8a" />

                    {/* Labels texts */}
                    <text x="20" y="115" fontSize="9" fill="#475569" className="font-mono text-center">Sesi 1: 85</text>
                    <text x="135" y="95" fontSize="9" fill="#475569" className="font-mono">Sesi 2: 90</text>
                    <text x="250" y="45" fontSize="9" fill="#475569" className="font-mono">Sesi 3: 92</text>
                    <text x="340" y="25" fontSize="9" fill="#475569" className="font-mono">Sesi Akhir: 96</text>
                  </svg>
                  <span className="absolute bottom-3 right-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">TREN: INTEGRATIF NAIK</span>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
                  <strong>Rangkuman Rapor Guru Terakhir:</strong> Berdasarkan rentetan pengerjaan projek Scratch & Tinkercad Blocks, anak Anda sangat disiplin menyelesaikannya dengan rekapitulasi poin rata-rata memuaskan. Kendala logika koordinat gerak (x, y) telah dikuasai dengan baik.
                </div>
              </div>

              {/* Right Column: Badges & Parent reports */}
              <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
                
                {/* Badges Won */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
                  <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-50 pb-2">Badge Pencapaian Siswa</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center space-y-2">
                      <div className="h-10 w-10 rounded-full bg-amber-400 text-slate-950 font-bold font-display flex items-center justify-center mx-auto shadow-xs text-xs">🚀</div>
                      <p className="text-xs font-bold text-slate-800">Logic Master</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">AKTIF</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-center space-y-2">
                      <div className="h-10 w-10 rounded-full bg-blue-400 text-slate-950 font-bold font-display flex items-center justify-center mx-auto shadow-xs text-xs">💡</div>
                      <p className="text-xs font-bold text-slate-800">Sirkuit Perintis</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">AKTIF</p>
                    </div>
                  </div>
                </div>

                {/* Parental report log collection */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
                  <h3 className="font-display font-bold text-sm text-slate-900 border-b border-slate-50 pb-2">Jurnal Lembar Nilai Soal Kuis</h3>
                  <div className="space-y-2 text-xs">
                    {levelModules.map((m, idx) => {
                      const hasScore = studentProfile.quizScores && studentProfile.quizScores[m.id] !== undefined;
                      const score = hasScore ? studentProfile.quizScores[m.id] : null;
                      
                      return (
                        <div key={m.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-left">
                          <div>
                            <p className="font-bold text-slate-800 text-[11px] line-clamp-1">{m.title}</p>
                            <span className="text-[9px] text-slate-400">Modul {idx + 1} ({m.summary})</span>
                          </div>
                          <span className={`px-2 py-1 rounded font-mono font-bold text-[10px] shrink-0 ${
                            hasScore ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-500"
                          }`}>
                            {hasScore ? `${score}/100` : "Belum Kuis"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Attendance List Log block - Fulfills Requirement 6 & 7 specifically */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100/80 shadow-md space-y-4">
              <h3 className="font-display font-bold text-base text-slate-900">Absensi Pertemuan & Catatan Tiap Sesi Ofline</h3>
              <p className="text-xs text-slate-500 mt-1">Daftar presensi siswa beserta catatan evaluasi dari Guru di tiap pertemuan tatap muka di lokasi Surakarta, Sukoharjo, Boyolali, atau Karanganyar.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-600 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b">
                      <th className="py-3 px-4">Pertemuan / Tanggal</th>
                      <th className="py-3 px-4">Pokok / Sesi Bahasan</th>
                      <th className="py-3 px-4">Lokasi / Tempat</th>
                      <th className="py-3 px-4">Absensi</th>
                      <th className="py-3 px-4">Umpan Balik / Catatan Mentor</th>
                      <th className="py-3 px-4 text-center">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold">
                    {mySchedules.map((sch, index) => (
                      <tr key={sch.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-mono">Ke-{index + 1} ({sch.date})</td>
                        <td className="py-3 px-4 text-slate-800 font-bold">{sch.topic}</td>
                        <td className="py-3 px-4 text-red-700">{sch.address || studentProfile.city || "Surakarta"}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            sch.attendance === "Izin" ? "bg-amber-100 text-amber-800" :
                            sch.attendance === "Sakit" ? "bg-rose-100 text-rose-800" :
                            sch.attendance === "Alpa" ? "bg-red-100 text-red-800" :
                            "bg-green-100 text-green-800"
                          }`}>
                            {sch.attendance || (sch.status === "Selesai" ? "Hadir" : "Hadir (Terjadwal)")}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 italic font-normal line-clamp-1 max-w-[200px]" title={sch.attendanceNotes || sch.notes}>
                          &quot;{sch.attendanceNotes || sch.notes || "Siswa menguasai materi dengan baik."}&quot;
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setSelectedSesiRecord(sch)}
                            className="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                          >
                            Buka Catatan
                          </button>
                        </td>
                      </tr>
                    ))}
                    {mySchedules.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          Belum ada agenda kelas offline yang berjalan atau terjadwal.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* =========================================
                     9. PILIH MENTOR (INTERACTIVE CHOOSE)
           ========================================= */}
        {activeView === "siswa-mentor" && (
          <div className="space-y-8 text-left" id="siswa-mentor-container">
            {/* Banner info */}
            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5 flex items-start space-x-3 text-xs leading-relaxed text-blue-900">
              <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Penugasan Mentor Akademis BOBOTIC:</strong> Untuk menjamin kualitas pedagogis tertinggi, penugasan mentor (guru) ditentukan langsung oleh tim akademik BOBOTIC secara berkala. Mentor dipilih berdasarkan spesialisasi keilmuan dan keselarasan kurikulum tingkat level siswa.
              </div>
            </div>

            {/* Active mentor status block */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100/90 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">Mentor Aktif Saya</p>
              
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-blue-100/40 rounded-2xl flex items-center justify-center overflow-hidden border border-blue-50/50">
                    {studentProfile.activeMentorId && mentors.find(m => m.id === studentProfile.activeMentorId)?.avatarUrl ? (
                      <img 
                        src={mentors.find(m => m.id === studentProfile.activeMentorId)?.avatarUrl} 
                        className="h-full w-full object-cover" 
                        alt="Mentor Avatar"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="font-display font-bold text-blue-600 text-xl">
                        {studentProfile.activeMentorName ? studentProfile.activeMentorName.substring(0, 2) : "HN"}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-slate-900">
                      {studentProfile.activeMentorName || "Haya Nur Fadhila"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Mentor Utama ({studentProfile.activeMentorId && mentors.find(m => m.id === studentProfile.activeMentorId)?.university || "UIN Raden Mas Said Surakarta"})
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">• Bidang: Scratch & Tinkercad Blocks, Arduino Mechatronics</p>
                  </div>
                </div>

                <div className="px-4 py-2 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-xl border border-emerald-100 uppercase tracking-wider">
                  ● Status: Aktif Terkoneksi
                </div>
              </div>

              <div className="mt-6 border-t border-slate-50 pt-4 text-xs text-slate-500 max-w-2xl leading-relaxed">
                Mentor Anda bertanggung jawab penuh atas pencatatan laporan evaluasi belajar di akhir sesi, pengisian absensi presensi pada hari H, serta penugasan milestone projek praktek. Hubungi admin BOBOTIC jika memerlukan koordinasi pergantian jadwal privat.
              </div>
            </div>
          </div>
        )}

        {/* =========================================
                     10. MATERI KURIKULUM (INTERACTIVE CORE)
           ========================================= */}
        {activeView === "siswa-materi" && (
          <div className="space-y-8 text-left" id="siswa-materials-container">
            {selectedMateriTrack === null ? (
              /* CARD SELECTOR LANDING VIEW */
              <div className="space-y-6 animate-in duration-200">
                <div className="text-left space-y-1">
                  <h2 className="font-display font-bold text-xl text-slate-900 inline-flex items-center space-x-2">
                    <BookOpen className="h-5.5 w-5.5 text-blue-600" />
                    <span>Kurikulum Pelajaran & Kuis BOBOTIC</span>
                  </h2>
                  <p className="text-xs text-slate-500">Pilih salah satu spesialisasi teknologi di bawah ini untuk mempelajari modul serta mengerjakan 5 soal kuis evaluasinya.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  {/* Card 1 */}
                  <div
                    onClick={() => {
                      setSelectedMateriTrack(1);
                      setActiveModuleDetail(null);
                      setQuizInProgress(false);
                    }}
                    className="p-6 bg-white border border-slate-200/80 rounded-3xl hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group space-y-4 shadow-xs"
                  >
                    <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      01
                    </div>
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-bold rounded-lg border border-blue-100/50">Level 1 - Starter</span>
                      <h3 className="font-display font-bold text-base text-slate-950 pt-1 group-hover:text-blue-600 transition-colors">Scratch & Tinkercad Blocks</h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed pt-0.5">Memahami konsep dasar pemrograman Scratch secara visual, melatih struktur algoritma runtutan & percabangan logika, serta merancang sirkuit simulatif pada Tinkercad Circuits.</p>
                    </div>
                    <div className="text-xs font-bold text-blue-600 inline-flex items-center group-hover:translate-x-1 transition-transform">
                      Buka Silabus Materi &rarr;
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div
                    onClick={() => {
                      setSelectedMateriTrack(2);
                      setActiveModuleDetail(null);
                      setQuizInProgress(false);
                    }}
                    className="p-6 bg-white border border-slate-200/80 rounded-3xl hover:border-violet-500 hover:shadow-lg transition-all cursor-pointer group space-y-4 shadow-xs"
                  >
                    <div className="h-10 w-10 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center font-bold text-sm group-hover:bg-violet-600 group-hover:text-white transition-colors">
                      02
                    </div>
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 bg-violet-50 text-violet-700 text-[9px] font-bold rounded-lg border border-violet-100/50">Level 2 - Mekatronika</span>
                      <h3 className="font-display font-bold text-base text-slate-950 pt-1 group-hover:text-violet-650 transition-colors">Arduino Mechatronics</h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed pt-0.5">Memasuki rekayasa mekatronika dengan mikrokontroler Arduino, mengaktifkan berbagai macam sensor fisik (suhu, ultrasonik), servo, DC motor, serta perakitan robot beroda.</p>
                    </div>
                    <div className="text-xs font-bold text-violet-600 inline-flex items-center group-hover:translate-x-1 transition-transform">
                      Buka Silabus Materi &rarr;
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div
                    onClick={() => {
                      setSelectedMateriTrack(3);
                      setActiveModuleDetail(null);
                      setQuizInProgress(false);
                    }}
                    className="p-6 bg-white border border-slate-200/80 rounded-3xl hover:border-amber-500 hover:shadow-lg transition-all cursor-pointer group space-y-4 shadow-xs"
                  >
                    <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold text-sm group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      03
                    </div>
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-bold rounded-lg border border-amber-100/50">Level 3 - Systems</span>
                      <h3 className="font-display font-bold text-base text-slate-950 pt-1 group-hover:text-amber-600 transition-colors">IoT & AI Systems</h3>
                      <p className="text-[11px] text-slate-500 leading-relaxed pt-0.5">Menghubungkan hardware cerdas ke server cloud untuk mengalirkan data sensor secara real-time (Internet of Things), serta menerapkan model Artificial Intelligence praktis.</p>
                    </div>
                    <div className="text-xs font-bold text-amber-600 inline-flex items-center group-hover:translate-x-1 transition-transform">
                      Buka Silabus Materi &rarr;
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* DETAILED VIEW FOR INDIVIDUAL SELECTION */
              <div className="space-y-4 animate-in duration-200">
                <button
                  onClick={() => {
                    setSelectedMateriTrack(null);
                    setActiveModuleDetail(null);
                    setQuizInProgress(false);
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-xs font-bold rounded-xl cursor-pointer transition-all inline-flex items-center space-x-1.5"
                >
                  <span>&larr; Kembali Pilih Kurikulum</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Syllabus module selector block */}
                  <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <div>
                        <h3 className="font-display font-bold text-sm text-slate-900">Silabus Pembelajaran</h3>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {selectedMateriTrack === 1 ? "Scratch & Tinkercad Blocks" : selectedMateriTrack === 2 ? "Arduino Mechatronics" : "IoT & AI Systems"}
                        </p>
                      </div>
                      <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg border border-blue-105/50 font-bold font-mono">LEVEL {selectedMateriTrack}</span>
                    </div>

                    <div className="space-y-3">
                      {levelModules.map((mod, idx) => {
                        const isCompleted = studentProfile.completedModules?.includes(mod.id) || idx < 1;
                        const isCurrent = activeModuleDetail?.id === mod.id;

                        return (
                          <button
                            key={mod.id}
                            onClick={() => {
                              setActiveModuleDetail(mod);
                              setQuizInProgress(false);
                            }}
                            className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                              isCurrent
                                ? "border-blue-500 bg-blue-50/10 shadow-xs ring-2 ring-blue-50"
                                : "border-slate-100 bg-white hover:border-slate-350"
                            }`}
                          >
                            <div className="space-y-1 text-left">
                              <p className={`font-semibold text-xs ${isCurrent ? "text-blue-800 font-bold" : "text-slate-800"}`}>
                                Modul {idx + 1}: {mod.title}
                              </p>
                              <p className="text-[10px] text-slate-400 line-clamp-1">{mod.summary}</p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded text-[8px] font-bold ${
                              isCompleted
                                ? "bg-green-50 text-green-700 border border-green-100"
                                : "bg-slate-100 text-slate-500 border border-slate-200"
                            }`}>
                              {isCompleted ? "Re-Access" : "Ready"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Module Content detail view */}
                  <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-lg space-y-6">
                {activeModuleDetail ? (
                  <div className="space-y-6 animate-in">
                    <div className="space-y-2">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded font-mono">AKTIF DIKUNJUNGI</span>
                      <h3 className="font-display font-bold text-lg text-slate-900 leading-tight">{activeModuleDetail.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{activeModuleDetail.summary}</p>
                    </div>

                    {quizInProgress ? (
                      /* ACTIVE QUIZ FORM */
                      <div className="p-5 bg-slate-90  border border-slate-200 rounded-2xl text-xs space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                          <span className="font-bold text-slate-700 uppercase tracking-wider">
                            Kuis Evaluasi — Pertanyaan {currentQuizQuestionIndex + 1} dari 5
                          </span>
                          <span className="px-2 py-0.5 bg-red-150 text-red-800 rounded font-mono text-[9px] font-bold">Wajib</span>
                        </div>

                        {(() => {
                          const quizData = activeModuleDetail.quiz && activeModuleDetail.quiz.length === 5 
                            ? activeModuleDetail.quiz 
                            : [
                                { question: "Berapa banyak putaran perulangan default pada block 'repeat 10'?", options: ["5 kali", "10 kali", "Selamanya", "Tergantung kondisi"], answerIndex: 1 },
                                { question: "Block manakah yang digunakan untuk mendeteksi sentuhan warna?", options: ["sensor warna", "touching color", "ketuk warna", "bila warna disentuh"], answerIndex: 1 },
                                { question: "Apa kegunaan dari variabel atau variable di program Scratch?", options: ["Menyimpan nilai/skor game", "Mengubah kostum", "Memutar suara musik", "Menghapus sprite"], answerIndex: 0 },
                                { question: "Sprit default awal saat pertama kali membuka Scratch adalah sprite apa?", options: ["Anjing", "Burung", "Kucing", "Ikan kuning"], answerIndex: 2 },
                                { question: "Di mana kita bisa mengunggah backdrop baru untuk halaman kerja?", options: ["Di tab sounds", "Pojok kanan bawah Stage panel", "Di menu Sprite settings", "Di tab code extension"], answerIndex: 1 }
                              ];
                          const activeQuestion = quizData[currentQuizQuestionIndex];
                          const isLastQuestion = currentQuizQuestionIndex === 4;

                          return (
                            <div className="space-y-4 text-left">
                              <p className="font-bold text-slate-900 text-sm leading-normal">{activeQuestion.question}</p>
                              <div className="grid grid-cols-1 gap-2.5">
                                {activeQuestion.options.map((option, oIdx) => {
                                  const isSelected = quizSelectedAnswers[currentQuizQuestionIndex] === oIdx;
                                  return (
                                    <button
                                      type="button"
                                      key={oIdx}
                                      onClick={() => {
                                        const nextAns = [...quizSelectedAnswers];
                                        nextAns[currentQuizQuestionIndex] = oIdx;
                                        setQuizSelectedAnswers(nextAns);
                                      }}
                                      className={`p-3 rounded-xl border text-left font-semibold text-xs transition-all cursor-pointer flex items-center justify-between ${
                                        isSelected
                                          ? "border-blue-600 bg-blue-50 text-blue-900 shadow-sm"
                                          : "border-slate-150 bg-white hover:bg-slate-50 text-slate-700"
                                      }`}
                                    >
                                      <span>{String.fromCharCode(65 + oIdx)}. {option}</span>
                                      <span className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                                        isSelected ? "border-blue-600 bg-blue-600 text-white font-mono text-[9px]" : "border-slate-300"
                                      }`}>
                                        {isSelected && "✔"}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>

                              <div className="flex justify-between items-center pt-3 border-t">
                                <button
                                  type="button"
                                  disabled={currentQuizQuestionIndex === 0}
                                  onClick={() => setCurrentQuizQuestionIndex(currentQuizQuestionIndex - 1)}
                                  className={`px-3 py-1.5 border border-slate-200 text-slate-600 font-bold rounded-lg ${
                                    currentQuizQuestionIndex === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                  }`}
                                >
                                  Sebelumnya
                                </button>
                                
                                <button
                                  type="button"
                                  disabled={quizSelectedAnswers[currentQuizQuestionIndex] === undefined}
                                  onClick={() => {
                                    if (isLastQuestion) {
                                      // Calculate final grade
                                      let correctCount = 0;
                                      quizData.forEach((q, idx) => {
                                        if (quizSelectedAnswers[idx] === q.answerIndex) {
                                          correctCount++;
                                        }
                                      });
                                      const scoreResult = correctCount * 20; // 0, 20, 40, 60, 80, 100
                                      
                                      // Save scores globally and update DB
                                      const updatedScores = {
                                        ...(studentProfile.quizScores || {}),
                                        [activeModuleDetail.id]: scoreResult
                                      };
                                      const updatedCompletedMods = Array.from(new Set([
                                        ...(studentProfile.completedModules || []),
                                        activeModuleDetail.id
                                      ]));

                                      const updatedStudentList = students.map(s => {
                                        if (s.id === studentProfile.id) {
                                          return {
                                            ...s,
                                            quizScores: updatedScores,
                                            completedModules: updatedCompletedMods
                                          };
                                        }
                                        return s;
                                      });

                                      onUpdateStudents(updatedStudentList);
                                      setQuizCompletedScore(scoreResult);
                                      setQuizInProgress(false);
                                      onShowToast(`Kuis Selesai! Skor Anda: ${scoreResult} / 100`, "success");
                                    } else {
                                      setCurrentQuizQuestionIndex(currentQuizQuestionIndex + 1);
                                    }
                                  }}
                                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isLastQuestion ? "Selesaikan & Kirim" : "Berikutnya"}
                                </button>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ) : (
                      /* MATERIALS WATCHER PANEL */
                      <>

                        {/* PDF manual download banner with download action */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                          <div className="space-y-0.5 text-xs">
                            <p className="font-semibold text-slate-800">Modul PDF Ringkasan Kunci</p>
                            <p className="text-[10px] text-slate-400 font-mono">Size: 4.8MB · 12 Pages</p>
                          </div>
                          <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); onShowToast("File ringkasan modul PDF berhasil diunduh ke folder Downloads Anda!", "success"); }}
                            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-semibold cursor-pointer flex items-center space-x-1"
                          >
                            <Download className="h-4 w-4" />
                            <span>Unduh</span>
                          </a>
                        </div>

                        {/* Projects Milestone checklists */}
                        <div className="space-y-3 text-left">
                          <label className="text-xs font-bold text-slate-700">Tugas Praktik (Milestones):</label>
                          <div className="space-y-2 text-xs">
                            {activeModuleDetail.projects && activeModuleDetail.projects.map((proj) => (
                              <div key={proj.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                                <span className="text-slate-600">{proj.title}</span>
                                <span className={`font-bold font-mono text-[9px] ${proj.isCompleted ? "text-emerald-600" : "text-amber-600"}`}>
                                  {proj.isCompleted ? "✔ SENT LOG" : "⌛ PENDING MOD"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* INTERACTIVE UNLOCKED QUIZ BOX */}
                        <div className="border-t pt-5 text-left space-y-4">
                          <h4 className="text-xs font-bold text-slate-800">Evaluasi Pemantapan Materi:</h4>
                          {(() => {
                            const userHasScore = studentProfile.quizScores && studentProfile.quizScores[activeModuleDetail.id] !== undefined;
                            const savedScore = userHasScore ? studentProfile.quizScores[activeModuleDetail.id] : null;

                            if (userHasScore) {
                              return (
                                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2 text-xs">
                                  <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                                    <Check className="h-4 w-4 shrink-0 bg-emerald-500 text-white rounded-full p-0.5" />
                                    <span>Kuis Berhasil Diselesaikan!</span>
                                  </div>
                                  <p className="text-slate-600">Nilai yang Anda peroleh: <strong className="text-emerald-700 font-mono text-sm">{savedScore} / 100</strong></p>
                                  <button
                                    onClick={() => {
                                      setQuizSelectedAnswers([]);
                                      setCurrentQuizQuestionIndex(0);
                                      setQuizCompletedScore(null);
                                      setQuizInProgress(true);
                                    }}
                                    className="px-3.5 py-1.5 border border-emerald-200 hover:border-emerald-300 text-emerald-800 bg-white rounded-xl text-[10px] font-bold cursor-pointer transition-colors"
                                  >
                                    Ulangi Evaluasi Kuis
                                  </button>
                                </div>
                              );
                            } else {
                              return (
                                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-3 text-xs">
                                  <p className="text-slate-600">Selesaikan membaca dokumen pelajaran serta menonton video di atas untuk membuka lembar soal kuis evaluasi 5 soal.</p>
                                  <button
                                    onClick={() => {
                                      setQuizSelectedAnswers([]);
                                      setCurrentQuizQuestionIndex(0);
                                      setQuizCompletedScore(null);
                                      setQuizInProgress(true);
                                    }}
                                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center justify-center space-x-1.5 shadow-md cursor-pointer transition-all"
                                  >
                                    <Award className="h-4 w-4" />
                                    <span>Tandai Selesai & Mulai Kuis (5 Soal PILGAN)</span>
                                  </button>
                                </div>
                              );
                            }
                          })()}
                        </div>
                      </>
                    )}

                  </div>
                ) : (
                  <div className="py-24 text-center text-slate-400 space-y-3">
                    <BookOpen className="h-10 w-10 mx-auto text-slate-300" />
                    <p className="text-xs font-bold font-display">Silakan klik salah satu Modul Silabus di samping kiri untuk membuka visual ringkasan materi.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    )}

        {/* =========================================
                     ATTENDANCE DETAIL MODAL
           ========================================= */}
        {selectedSesiRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs text-left">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in duration-150">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-left animate-in">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2.5 py-0.5 bg-white/20 text-white text-[9px] font-bold rounded-lg uppercase tracking-wide">Detail Rapor Kehadiran & Sesi</span>
                    <h3 className="font-display font-medium text-lg mt-1 tracking-tight">{selectedSesiRecord.topic}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedSesiRecord(null)}
                    className="text-white/80 hover:text-white font-bold text-xl cursor-pointer"
                  >
                    &times;
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="space-y-1">
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Waktu Sesi</p>
                    <p className="text-slate-800">{selectedSesiRecord.date} / {selectedSesiRecord.time}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Status Kehadiran</p>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedSesiRecord.attendance === "Izin" ? "bg-amber-100 text-amber-800" :
                      selectedSesiRecord.attendance === "Sakit" ? "bg-rose-100 text-rose-800" :
                      selectedSesiRecord.attendance === "Alpa" ? "bg-red-100 text-red-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {selectedSesiRecord.attendance || "Hadir"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Lokasi / Tempat</p>
                    <p className="text-slate-800">{selectedSesiRecord.address || studentProfile.city || "Surakarta"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Mentor Pengampu</p>
                    <p className="text-slate-800">Kak {selectedSesiRecord.mentorName || "Haya Nur Fadhila"}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Catatan Umpan Balik / Rapor:</p>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed italic">
                    &quot;{selectedSesiRecord.attendanceNotes || selectedSesiRecord.notes || "Siswa hadir tepat waktu dan mengikuti instruksi praktikum dengan sangat baik."}&quot;
                  </div>
                </div>

                {selectedSesiRecord.score && (
                  <div className="flex justify-between items-center bg-blue-50/50 p-3 rounded-2xl border border-blue-100/50">
                    <div className="text-xs">
                      <p className="font-bold text-blue-900">Nilai Pemahaman Soal</p>
                      <p className="text-[10px] text-slate-400">Diambil dari kuis evaluasi 5 soal modul.</p>
                    </div>
                    <span className="font-mono text-lg font-bold text-blue-600 bg-white px-3 py-1 rounded-xl border border-blue-100">
                      {selectedSesiRecord.score}
                    </span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedSesiRecord(null)}
                    className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer text-center"
                  >
                    Tutup Rapor Sesi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
