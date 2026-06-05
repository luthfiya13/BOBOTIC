/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Award, Calendar, CheckCircle2, Star, ShieldCheck, Mail,
  Users, UserPlus, Info, Check, Trash2, Edit2, Play, Plus,
  ClipboardList, AlertTriangle, Clock, MapPin, UploadCloud, CheckSquare
} from "lucide-react";

import { StudentProfile, MentorProfile, ScheduleEvent, MentorRequest, CurriculumModule } from "../types";
import { DEFAULT_CURRICULUM } from "../data";

interface MentorPanelProps {
  activeView: string;
  loggedUser: any;
  mentors: MentorProfile[];
  students: StudentProfile[];
  schedules: ScheduleEvent[];
  requests: MentorRequest[];
  onUpdateSchedules: (updated: ScheduleEvent[]) => void;
  onUpdateRequests: (updated: MentorRequest[]) => void;
  onUpdateStudents: (updated: StudentProfile[]) => void;
  onUpdateMentors: (updated: MentorProfile[]) => void;
  onNavigate: (view: string) => void;
  onShowToast: (message: string, type?: "success" | "warning" | "info") => void;
}

export default function MentorPanel({
  activeView,
  loggedUser,
  mentors,
  students,
  schedules,
  requests,
  onUpdateSchedules,
  onUpdateRequests,
  onUpdateStudents,
  onUpdateMentors,
  onNavigate,
  onShowToast
}: MentorPanelProps) {
  // Centralised Mentor State Managers
  const mentorProfile = mentors.find(m => m.id === loggedUser.id) || mentors[0];
  const mySchedules = schedules.filter(s => s.mentorId === mentorProfile.id);
  const myRequests = requests.filter(r => r.mentorId === mentorProfile.id && r.status === "Menunggu");

  // Local CRUD Scheduling States
  const [isEditingSchedule, setIsEditingSchedule] = useState<ScheduleEvent | null>(null);
  const [showAddScheduleForm, setShowAddScheduleForm] = useState<boolean>(false);
  const [sessionForAttendance, setSessionForAttendance] = useState<ScheduleEvent | null>(null);
  const [attStatus, setAttStatus] = useState<string>("Hadir");
  const [attNotes, setAttNotes] = useState<string>("");

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionForAttendance) return;

    // Update schedule event status & attendance details
    const updatedSchedules = schedules.map(s => {
      if (s.id === sessionForAttendance.id) {
        return {
          ...s,
          status: "Selesai" as const,
          attendance: attStatus as any,
          attendanceNotes: attNotes || "Hadir tepat waktu dan mengikuti instruksi dengan baik."
        };
      }
      return s;
    });

    // Update student's completed session counts & packet balances
    const updatedStudents = students.map(std => {
      if (std.id === sessionForAttendance.siswaId) {
        return {
          ...std,
          completedSessions: std.completedSessions + 1,
          remainingSessions: Math.max(0, std.remainingSessions - 1)
        };
      }
      return std;
    });

    onUpdateSchedules(updatedSchedules);
    onUpdateStudents(updatedStudents);
    setSessionForAttendance(null);
    setAttNotes("");
    onShowToast(`Presensi absensi untuk ${sessionForAttendance.siswaName} berhasil diverifikasi dan disimpan! Orang tua mendapatkan laporan terintegrasi.`, "success");
  };
  const [scheduleForm, setScheduleForm] = useState({
    siswaId: students[0]?.id || "",
    date: "2026-06-12",
    time: "15:30 - 17:00",
    topic: "Level 1 Scratch - Modul 3: Logika Percabangan (If-Else) dalam Game Labirin",
    address: ""
  });

  // Local CRUD Progress Input States
  const [selectedSiswaId, setSelectedSiswaId] = useState<string>(students[0]?.id || "");
  const [completedTopic, setCompletedTopic] = useState<string>("Level 1 Scratch - Modul 3: Logika Percabangan (If-Else) dalam Game Labirin");
  const [comprehensionScore, setComprehensionScore] = useState<number>(90);
  const [attendanceStatus, setAttendanceStatus] = useState<string>("Hadir");
  const [parentAdvice, setParentAdvice] = useState<string>("");
  const [masteredSelection, setMasteredSelection] = useState<string[]>([]);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<StudentProfile | null>(null);

  // Availability state
  const [mentorMaxStudents, setMentorMaxStudents] = useState<number>(mentorProfile.maxStudents);
  const [profileBio, setProfileBio] = useState<string>(mentorProfile.bio);

  // CRUD Schedules: Add Event
  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const targetedStudent = students.find(s => s.id === scheduleForm.siswaId);
    if (!targetedStudent) return;

    const newEv: ScheduleEvent = {
      id: "sch_" + Date.now(),
      siswaId: targetedStudent.id,
      siswaName: targetedStudent.name,
      mentorId: mentorProfile.id,
      mentorName: mentorProfile.name,
      date: scheduleForm.date,
      time: scheduleForm.time,
      topic: scheduleForm.topic,
      address: scheduleForm.address || targetedStudent.address,
      status: "Terkonfirmasi"
    };

    onUpdateSchedules([...schedules, newEv]);
    setShowAddScheduleForm(false);
    onShowToast(`Jadwal baru Kelas Robotik untuk ${targetedStudent.name} berhasil dibuat! Siswa mendapatkan rincian jadwal via WhatsApp.`, "success");
  };

  // CRUD Schedules: Save Edit
  const handleSaveEditSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingSchedule) return;

    const updated = schedules.map(s => {
      if (s.id === isEditingSchedule.id) {
        return isEditingSchedule;
      }
      return s;
    });

    onUpdateSchedules(updated);
    setIsEditingSchedule(null);
    onShowToast("Jadwal Berhasil Diperbarui!", "success");
  };

  // CRUD Schedules: Cancel / Delete
  const handleCancelSchedule = (id: string) => {
    const reason = prompt("Masukkan alasan pembatalan sesi kelas mekatronika:", "Mentor jadwal bentrok dengan UTS Kuliah.");
    if (reason === null) return;

    const updated = schedules.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: "Dibatalkan" as const,
          cancelReason: reason
        };
      }
      return s;
    });

    onUpdateSchedules(updated);
    onShowToast("Sesi dibatalkan. Notifikasi WhatsApp alasan pembatalan dikirim instan ke orangtua siswa!", "info");
  };

  // Interactive Requests: ACC (Approve Student Request)
  const handleAcceptRequest = (reqId: string, item: MentorRequest) => {
    // 1. Mark request as Approved
    const updatedReqs = requests.map(r => {
      if (r.id === reqId) return { ...r, status: "Diterima" as const };
      return r;
    });
    onUpdateRequests(updatedReqs);

    // 2. Link student to this mentor
    const updatedSiswa = students.map(s => {
      if (s.id === item.siswaId) {
        return {
          ...s,
          activeMentorId: mentorProfile.id,
          activeMentorName: mentorProfile.name
        };
      }
      return s;
    });
    onUpdateStudents(updatedSiswa);

    // 3. Auto-schedule the first welcome session
    const firstSession: ScheduleEvent = {
      id: "sch_" + Date.now(),
      siswaId: item.siswaId,
      siswaName: item.siswaName,
      mentorId: mentorProfile.id,
      mentorName: mentorProfile.name,
      date: "2026-06-10",
      time: "15:00 - 16:30",
      topic: "Level 1 Scratch - Modul 1: Pengenalan Interface Scratch & Algoritma Sederhana",
      address: item.location,
      status: "Terkonfirmasi"
    };
    onUpdateSchedules([...schedules, firstSession]);

    onShowToast(`Selamat! Anda menyetujui Kakak ${item.siswaName} menjadi murid aktif Anda. Sesi perdana terbuat otomatis untuk tanggal 10 Juni.`, "success");
  };

  // Interactive Requests: Reject Request
  const handleRejectRequest = (reqId: string) => {
    const reason = prompt("Wajib menulis alasan penolakan permintaan siswa:", "Jarak lokasi rumah terlalu jauh melampaui area Solo Raya.");
    if (!reason) return;

    const updatedReqs = requests.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          status: "Ditolak" as const,
          rejectionReason: reason
        };
      }
      return r;
    });
    onUpdateRequests(updatedReqs);
    onShowToast("Permintaan berhasil ditolak. Informasi penolakan diteruskan ke siswa.", "info");
  };

  // Submit Progress Evaluation
  const handleSaveProgressEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswaId) return;

    const targetedStudent = students.find(s => s.id === selectedSiswaId);
    if (!targetedStudent) return;

    // 1. Create a Completed schedule event in schedules list
    const completedEv: ScheduleEvent = {
      id: "sch_comp_" + Date.now(),
      siswaId: targetedStudent.id,
      siswaName: targetedStudent.name,
      mentorId: mentorProfile.id,
      mentorName: mentorProfile.name,
      date: new Date().toISOString().split("T")[0],
      time: "15:30 - 17:00",
      topic: completedTopic,
      address: targetedStudent.address,
      status: "Selesai",
      score: comprehensionScore,
      attendance: attendanceStatus as any,
      attendanceNotes: parentAdvice || "Siswa hadir tepat waktu dan berhasil menuntaskan seluruh latihan logika.",
      masteredTopics: masteredSelection.length > 0 ? masteredSelection : ["Memahami Algoritma Logika Blok dasar"],
      notes: parentAdvice || "Pemahaman anak sangat bagus dalam merancang projek robotik modular."
    };

    // 2. Update Student metrics (completed sessions count, average scores, level progress increment)
    const updatedSiswaList = students.map(s => {
      if (s.id === targetedStudent.id) {
        const nextCompleted = s.completedSessions + 1;
        const nextRemaining = Math.max(0, s.remainingSessions - 1);
        const nextAvg = s.averageScore > 0 ? Math.round((s.averageScore + comprehensionScore) / 2) : comprehensionScore;
        const nextProgress = Math.min(100, s.levelProgress + 15); // increments by 15% each completed session
        
        return {
          ...s,
          completedSessions: nextCompleted,
          remainingSessions: nextRemaining,
          averageScore: nextAvg,
          levelProgress: nextProgress
        };
      }
      return s;
    });

    onUpdateSchedules([...schedules, completedEv]);
    onUpdateStudents(updatedSiswaList);

    // Reset local fields
    setParentAdvice("");
    setMasteredSelection([]);
    setAttendanceStatus("Hadir");
    onShowToast(`Rapor Sesi Evaluasi untuk ${targetedStudent.name} berhasil disimpan! Rapor transparan ini diteruskan ke akun orangtua.`, "success");
  };

  const handleLaunchSession = (topicName: string, stdName: string) => {
    onShowToast(`Sesi Kelas untuk ${stdName} topik "${topicName}" telah dimulai! Mentor terdaftar aktif dalam pengerjaan tatap muka.`, "info");
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-12 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Mentor profile banner header */}
        <div className="bg-linear-to-br from-purple-750 to-indigo-900 text-white rounded-3xl p-6 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-4 text-left">
            <img
              src={mentorProfile.avatarUrl}
              alt={mentorProfile.name}
              className="h-16 w-16 bg-white/15 rounded-2xl object-cover border border-white/20 referrerPolicy='no-referrer'"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-display font-bold text-2.5xl">{mentorProfile.name}</h1>
                <span className="px-2.5 py-0.5 bg-yellow-400 text-slate-900 text-[9px] font-bold rounded-full uppercase tracking-wider">
                  VERIFIED PARTNER
                </span>
              </div>
              <p className="text-xs text-purple-200 mt-1">{mentorProfile.university} · {mentorProfile.major}</p>
              <p className="text-xs text-purple-300">Spesialisasi: {mentorProfile.specialties.join(", ")}</p>
            </div>
          </div>
          <div className="flex space-x-2 shrink-0">
            <span className="px-3 py-1.5 bg-white/10 text-white font-mono font-bold text-xs rounded-xl border border-white/10 text-center">
              Rating: {mentorProfile.rating}
            </span>
            <span className="px-3 py-1.5 bg-white/10 text-white font-mono font-bold text-xs rounded-xl border border-white/10 text-center">
              Selesai: {mentorProfile.completedClassesCount} Sesi
            </span>
          </div>
        </div>

        {/* =========================================
                     11. DASHBOARD MENTOR
           ========================================= */}
        {activeView === "mentor-dashboard" && (
          <div className="space-y-8 text-left animate-in" id="mentor-dashboard-container">
            {/* Quick Metrics (4 Cards) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Siswa Aktif Saya</span>
                <p className="font-mono text-3xl font-bold text-purple-650 mt-1">{mentorProfile.activeStudentsCount}</p>
                <div className="mt-2 text-[10px] text-slate-400">Total kapasitas pengajaran: {mentorProfile.maxStudents}</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Sesi Bulan Ini</span>
                <p className="font-mono text-3xl font-bold text-emerald-600 mt-1">{mySchedules.length}</p>
                <div className="mt-2 text-[10px] text-slate-400">Target minimal: 8 sesi/aktif</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sesi Sukses Terlaksana</span>
                <p className="font-mono text-3xl font-bold text-amber-500 mt-1">
                  {mySchedules.filter(s => s.status === "Selesai").length}
                </p>
                <div className="mt-2 text-[10px] text-slate-400">Rapor bulanan sudah terkirim</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Permintaan Baru</span>
                <p className="font-mono text-3xl font-bold text-red-500 mt-1">{myRequests.length}</p>
                <div className="mt-2 text-[10px] text-slate-400 font-semibold text-red-500">BUTUH TINDAKAN ACC</div>
              </div>
            </div>

            {/* Today's schedule launcher action */}
            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
              <h3 className="font-display font-bold text-slate-900 border-b border-purple-100 pb-2 text-sm mb-4">Agenda Pembelajaran Aktif Terdekat</h3>
              <div className="space-y-4">
                {mySchedules.filter(s => s.status === "Terkonfirmasi").map((sch) => (
                  <div key={sch.id} className="bg-white p-4 rounded-xl border border-purple-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                    <div className="space-y-1 text-left">
                      <p className="font-bold text-slate-800 text-sm">{sch.topic}</p>
                      <p className="text-slate-500">Siswa: {sch.siswaName} · Alamat: {sch.address}</p>
                      <p className="text-purple-650 font-semibold font-mono mt-0.5">Rencana: {sch.date} pukul {sch.time} WIB</p>
                    </div>
                    <button
                      onClick={() => handleLaunchSession(sch.topic, sch.siswaName)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center space-x-1 cursor-pointer shrink-0 shadow-md"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>Mulai Sesi</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Requests preview */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
                <h3 className="font-display font-bold text-sm text-slate-900">Permintaan Masuk Tertunda ({myRequests.length})</h3>
                <div className="space-y-3 text-xs">
                  {myRequests.slice(0, 2).map((req) => (
                    <div key={req.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                      <div>
                        <p className="font-bold text-slate-800">{req.siswaName}</p>
                        <p className="text-[10px] text-slate-450 mt-0.5">Level {req.level} · Lokasi: {req.location}</p>
                        <p className="text-blue-600 font-semibold font-mono mt-0.2">Pref Waktu: {req.requestedSchedule}</p>
                      </div>
                      <button
                        onClick={() => onNavigate("mentor-permintaan")}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-xl font-bold cursor-pointer shrink-0"
                      >
                        Buka Aksi
                      </button>
                    </div>
                  ))}
                  {myRequests.length === 0 && (
                    <p className="text-slate-400 py-8 text-center text-xs">Tidak ada permintaan menunggu persetujuan Anda.</p>
                  )}
                </div>
              </div>

              {/* Verified partners */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs text-left space-y-4">
                <h3 className="font-display font-bold text-sm text-slate-900">Catatan Pengajar Teruji</h3>
                <div className="space-y-3 text-xs leading-relaxed text-slate-500">
                  <p>✔ Pastikan membawa laptop pengajaran cadangan berisikan pembuat block Scratch versi offline.</p>
                  <p>✔ Ambil visual foto hasil pengerjaan rakitan siswa untuk dilampirkan sebagai portofolio progres.</p>
                  <p>✔ Setiap konfirmasi reschedule atau feedback rapor langsung ter-sinkronisasi ke dasbor orangtua siswa.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =========================================
                     12. KELOLA JADWAL (CRUD CALENDAR)
           ========================================= */}
        {activeView === "mentor-jadwal" && (
          <div className="space-y-8 text-left" id="mentor-schedule-crud">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">Agenda Belajar Keseluruhan</h3>
                <p className="text-xs text-slate-400">Atur, tambah, ganti, dan batalkan jadwal sesi robotik murid Anda secara meluas.</p>
              </div>
              <button
                onClick={() => setShowAddScheduleForm(!showAddScheduleForm)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center space-x-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>Rancang Sesi Baru</span>
              </button>
            </div>

            {/* HARI-H ATTENDANCE FORM */}
            {sessionForAttendance && (
              <form onSubmit={handleSaveAttendance} className="bg-emerald-950 text-emerald-105 p-6 rounded-3xl border border-emerald-800 shadow-xl space-y-4 max-w-xl animate-in text-xs font-semibold">
                <div className="border-b border-emerald-800 pb-2">
                  <p className="text-white font-bold text-sm">Isi Absensi & Catatan Sesi (Hari H)</p>
                  <p className="text-[10px] text-emerald-300 mt-1">Siswa: {sessionForAttendance.siswaName} · Topik: {sessionForAttendance.topic}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-emerald-300 block">Status Kehadiran Siswa</label>
                    <select
                      className="w-full px-3 py-2 bg-emerald-900 border border-emerald-700 rounded-xl text-white"
                      value={attStatus}
                      onChange={(e) => setAttStatus(e.target.value)}
                    >
                      <option value="Hadir">Hadir (Present)</option>
                      <option value="Izin">Izin (Excused)</option>
                      <option value="Alfa">Alfa (Absent)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-emerald-300 block">Catatan Siswa (Optional)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-emerald-900 border border-emerald-700 rounded-xl text-white"
                      placeholder="Contoh: Sangat fokus merakit robot..."
                      value={attNotes}
                      onChange={(e) => setAttNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSessionForAttendance(null)}
                    className="w-1/2 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer text-center"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-center cursor-pointer shadow-md"
                  >
                    Simpan Presensi Hari H
                  </button>
                </div>
              </form>
            )}

            {/* CREATE / ADD Event Form Drawer */}
            {showAddScheduleForm && (
              <form onSubmit={handleCreateSchedule} className="bg-slate-900 text-slate-300 p-6 rounded-3xl border border-slate-850 shadow-xl space-y-4 max-w-xl animate-in text-xs font-semibold">
                <div className="border-b border-slate-800 pb-2">
                  <p className="text-white font-bold text-sm">Formulir Rancang Sesi Praktik Baru</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400">Pilih Murid Aktif</label>
                    <select
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                      value={scheduleForm.siswaId}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, siswaId: e.target.value })}
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name} - Level {s.level}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400">Tanggal Pertemuan</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100"
                      value={scheduleForm.date}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono">Daftar Slot Jam Belajar</label>
                    <select
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200"
                      value={scheduleForm.time}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                    >
                      <option value="15:30 - 17:00">Sore (15:30 - 17:00 WIB)</option>
                      <option value="09:00 - 10:30">Pagi (09:00 - 10:30 WIB)</option>
                      <option value="13:30 - 15:00">Siang (13:30 - 15:00 WIB)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400">Topik Silabus</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100"
                      value={scheduleForm.topic}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, topic: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddScheduleForm(false)}
                    className="w-1/2 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold cursor-not-allowed text-center"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-center cursor-pointer shadow-md"
                  >
                    Terbitkan Jadwal Sesi
                  </button>
                </div>
              </form>
            )}

            {/* List Table of schedules with Edit / Cancel operators */}
            <div className="bg-white rounded-3xl border border-slate-105 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-650">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-4 font-semibold text-slate-900">Siswa</th>
                      <th className="p-4 font-semibold text-slate-900">Tanggal/Waktu</th>
                      <th className="p-4 font-semibold text-slate-900">Topik Materi</th>
                      <th className="p-4 font-semibold text-slate-900">Status</th>
                      <th className="p-4 font-semibold text-slate-900 text-center">Operasi Kerja</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mySchedules.map((sch) => (
                      <tr key={sch.id} style={{ opacity: sch.status === "Dibatalkan" ? 0.6 : 1 }}>
                        <td className="p-4 font-bold text-slate-900">{sch.siswaName}</td>
                        <td className="p-4">
                          <p className="font-semibold text-slate-800">{sch.date}</p>
                          <p className="text-[10px] text-slate-400">{sch.time}</p>
                        </td>
                        <td className="p-4 line-clamp-1 max-w-[280px] mt-2">{sch.topic}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                            sch.status === "Selesai"
                              ? "bg-green-50 text-green-700"
                              : sch.status === "Terkonfirmasi"
                              ? "bg-blue-100 text-blue-800"
                              : sch.status === "Dibatalkan"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {sch.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {sch.status !== "Selesai" && sch.status !== "Dibatalkan" ? (
                            <div className="flex justify-center items-center space-x-2">
                              <button
                                onClick={() => {
                                  setSessionForAttendance(sch);
                                  setAttStatus("Hadir");
                                  setAttNotes("");
                                }}
                                className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-[10px] cursor-pointer inline-flex items-center space-x-1 transition-colors"
                              >
                                <CheckSquare className="h-3 w-3" />
                                <span>Isi Absen</span>
                              </button>
                              <button
                                onClick={() => handleCancelSchedule(sch.id)}
                                className="p-1 px-2.5 bg-red-150 hover:bg-red-200 text-red-800 font-bold rounded-lg cursor-pointer"
                                title="Batalkan Sesi"
                              >
                                Batal
                              </button>
                            </div>
                          ) : sch.status === "Dibatalkan" ? (
                            <span className="text-[10px] text-slate-400">Pembatalan: {sch.cancelReason || "No-Detail"}</span>
                          ) : (
                            <span className="text-green-600 font-bold">✔ Score {sch.score}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
                     13. DAFTAR SISWA SAYA + DETAIL
           ========================================= */}
        {activeView === "mentor-siswa" && (
          <div className="space-y-8 text-left" id="mentor-students-log">
            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-slate-900">Manajemen Siswa Kelolaan</h3>
              <p className="text-xs text-slate-400">Perhatikan nilai perkembangan per-anak di Solo Raya agar performa mengajar Anda terjaga.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Table list */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-600">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-4 font-semibold text-slate-800">Nama Siswa</th>
                        <th className="p-4 font-semibold text-slate-800 font-mono">Aktif Level</th>
                        <th className="p-4 font-semibold text-slate-800">Total Sembuh</th>
                        <th className="p-4 font-semibold text-slate-800">Skor Rerata</th>
                        <th className="p-4 font-semibold text-slate-800 text-center">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.map(s => (
                        <tr key={s.id}>
                          <td className="p-4 font-bold text-slate-800">
                            <p>{s.name}</p>
                            <p className="text-[10px] text-slate-400 font-normal line-clamp-1">{s.address}</p>
                          </td>
                          <td className="p-4 font-semibold text-slate-700">Lvl {s.level} ({s.levelProgress}%)</td>
                          <td className="p-4 font-mono font-bold text-purple-700">{s.completedSessions} Kelas Selesai</td>
                          <td className="p-4 font-mono text-emerald-600 font-bold">{s.averageScore || "Belum ada"}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setSelectedStudentDetail(s)}
                              className="px-3 py-1.5 bg-slate-900 text-white rounded-xl font-bold cursor-pointer transition-all"
                            >
                              Tinjau Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Student detail sidebar block */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-205/60 shadow-lg space-y-6">
                {selectedStudentDetail ? (
                  <div className="space-y-4 animate-in">
                    <div>
                      <span className="text-[8px] bg-purple-100 text-purple-800 font-bold rounded-md px-2 py-0.5 font-mono uppercase">STUDENT FILE</span>
                      <h4 className="font-display font-bold text-base text-slate-900 mt-1">{selectedStudentDetail.name}</h4>
                      <p className="text-xs text-slate-400">{selectedStudentDetail.email} · {selectedStudentDetail.phone}</p>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-2">
                      <p><strong>Progres Silabus:</strong> Level {selectedStudentDetail.level} ({selectedStudentDetail.levelProgress}%)</p>
                      <p><strong>Total Sesi Berhasil:</strong> {selectedStudentDetail.completedSessions} Sesi</p>
                      <p><strong>Alamat Kunjungan:</strong> {selectedStudentDetail.address}</p>
                    </div>

                    <button
                      onClick={() => onNavigate("mentor-input")}
                      className="w-full py-2.5 bg-purple-650 hover:bg-purple-750 text-white font-bold rounded-xl text-center text-xs cursor-pointer shadow-md flex items-center justify-center space-x-1.5"
                    >
                      <ClipboardList className="h-4 w-4" />
                      <span>Log Evaluasi & Rapor Sesi Baru</span>
                    </button>
                  </div>
                ) : (
                  <div className="py-16 text-center text-slate-450 space-y-2">
                    <ClipboardList className="h-8 w-8 mx-auto text-slate-300 animate-float" />
                    <p className="text-xs">Klik salah satu siswa di baris tabel sebelah kiri untuk menelaah status portofolionya dengan mendalam.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================
                     14. INPUT PROGRES SISWA (RAPOR)
           ========================================= */}
        {activeView === "mentor-input" && (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6 text-left" id="mentor-progress-crud">
            <div className="border-b border-slate-50 pb-3">
              <h3 className="font-display font-bold text-lg text-slate-900">Log Evaluasi & Rapor Sesi Baru</h3>
              <p className="text-xs text-slate-400">Tentukan penilaian kognitif dan ketikkan rekomendasi catatan wali setelah pertemuan merakit robot selesai.</p>
            </div>

            <form onSubmit={handleSaveProgressEvaluation} className="space-y-4 text-xs font-semibold">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-700 block">Pilih Nama Siswa</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    value={selectedSiswaId}
                    onChange={(e) => setSelectedSiswaId(e.target.value)}
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (Level {s.level})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 block">Status Kehadiran Siswa (Absensi)</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    value={attendanceStatus}
                    onChange={(e) => setAttendanceStatus(e.target.value)}
                  >
                    <option value="Hadir">Hadir (Tepat Waktu)</option>
                    <option value="Izin">Izin (Berhalangan)</option>
                    <option value="Sakit">Sakit (Kondisi Kurang Baik)</option>
                    <option value="Alpa">Alpa (Tanpa Keterangan)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-700 block">Skor Pemahaman Siswa (0-100)</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm"
                    value={comprehensionScore}
                    onChange={(e) => setComprehensionScore(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-705 block">Topik Sesi Hari Ini</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    value={completedTopic}
                    onChange={(e) => setCompletedTopic(e.target.value)}
                  />
                </div>
              </div>

              {/* Competencies checklist */}
              <div className="space-y-2">
                <label className="text-slate-700 block">Materi Kompleks yang Berhasil Dikuasai (Checklist):</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {["Sinkronisasi sumbu x/y game", "Algoritma Loops bersarang", "Pembuatan variabel skor", "Instalasi sirkuit Breadboard"].map((item) => (
                    <label key={item} className="flex items-center space-x-2 p-2 bg-slate-55 rounded-lg border border-slate-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={masteredSelection.includes(item)}
                        onChange={(e) => {
                          if (e.target.checked) setMasteredSelection([...masteredSelection, item]);
                          else setMasteredSelection(masteredSelection.filter(x => x !== item));
                        }}
                      />
                      <span className="text-slate-600 truncate">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block">Catatan Kemajuan Guru untuk Orang Tua (Wali)</label>
                <textarea
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[80px]"
                  placeholder="cth: Budi sangat cerdas merakit rangkaian LED hari ini, logika pemrogramannya di atas rata-rata. Perbanyak latihan loops ya dirumah."
                  value={parentAdvice}
                  onChange={(e) => setParentAdvice(e.target.value)}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-center text-xs transition-all shadow-md cursor-pointer"
              >
                Simpan & Terbitkan Rapor Evaluasi
              </button>
            </form>
          </div>
        )}

        {/* =========================================
                     15. PERMINTAAN MASUK (INTERACTIVE)
           ========================================= */}
        {activeView === "mentor-permintaan" && (
          <div className="space-y-8 text-left" id="mentor-requests">
            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-slate-900">Permintaan Masuk Pendampingan</h3>
              <p className="text-xs text-slate-400">Wali murid berhak menunjuk Anda sebagai pengajar privat secara langsung. Segera konfirmasi demi menjaga kepuasan siswa.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myRequests.map((req) => (
                <div key={req.id} className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col justify-between shadow-xs">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-700">
                        {req.siswaName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-slate-905">{req.siswaName}</h4>
                        <p className="text-[10px] text-slate-400">Level requested: Lvl {req.level} Scratch</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 border-t border-b border-slate-50 py-3">
                      <p className="flex items-center"><MapPin className="h-3.5 w-3.5 text-slate-400 mr-1 shrink-0" /> Lokasi: {req.location}</p>
                      <p className="flex items-center"><Clock className="h-3.5 w-3.5 text-slate-40s mr-1 shrink-0" /> Jadwal requested: <strong className="text-blue-600 ml-1">{req.requestedSchedule}</strong></p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={() => handleRejectRequest(req.id)}
                      className="w-1/2 py-2 border border-red-200 text-red-600 text-xs font-bold rounded-xl cursor-pointer hover:bg-red-50 transition-all text-center"
                    >
                      Tolak Permintaan
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(req.id, req)}
                      className="w-1/2 py-2 bg-green-600 text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-green-700 transition-all text-center shadow-md"
                    >
                      ACC & Hubungi Siswa
                    </button>
                  </div>
                </div>
              ))}

              {myRequests.length === 0 && (
                <div className="col-span-2 bg-white rounded-3xl border border-slate-100 p-12 text-center text-slate-400 space-y-2">
                  <span className="text-xl">🌟</span>
                  <p className="text-xs font-bold font-display">Hebat! Semua permintaan masuk penugasan murid mendaftarkan diri Anda telah rampung divalidasi prima.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================
                     16. PROFIL MENTOR (AVAILABILITY)
           ========================================= */}
        {activeView === "mentor-profil" && (
          <div className="space-y-8 text-left" id="mentor-profile-availability">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Profile card values */}
              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs space-y-4">
                <div className="text-center space-y-3">
                  <div className="relative inline-block mx-auto">
                    <img
                      src={mentorProfile.avatarUrl}
                      alt={mentorProfile.name}
                      className="h-20 w-20 rounded-3xl object-cover border-2 border-purple-100 referrerPolicy='no-referrer'"
                    />
                    <span className="absolute bottom-0 right-0 bg-green-500 h-3 w-3 rounded-full border-2 border-white"></span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-900">{mentorProfile.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Mentor Akreditasi UNS</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs border-t border-slate-50 pt-4 font-semibold text-slate-700">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block">Biografi Mengajar</label>
                    <textarea
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Limit Maks Siswa</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm"
                        value={mentorMaxStudents}
                        onChange={(e) => setMentorMaxStudents(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Status Absen</label>
                      <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                        <option value="Aktif">Tersedia Mengajar</option>
                        <option value="Off">Istirahat Sementara</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Availability tracker slot grid */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-205/60 shadow-lg space-y-6">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">Atur Kalender Ketersediaan Mingguan</h3>
                  <p className="text-xs text-slate-400">Wali murid hanya akan menjadwalkan kelas jika Anda memberikan centang waktu luang mengajar di bawah:</p>
                </div>

                <div className="space-y-4">
                  {["Senin", "Rabu", "Jumat", "Sabtu", "Minggu"].map((dayName) => (
                    <div key={dayName} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                      <span className="font-bold text-slate-800 text-sm w-20 shrink-0">{dayName}</span>
                      <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                        {["Pagi (08:00 - 11:30)", "Siang (13:00 - 15:00)", "Sore (15:30 - 18:00)"].map((slot) => (
                          <label key={slot} className="flex items-center space-x-1.5 p-1.5 px-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-slate-350 transition-all">
                            <input type="checkbox" defaultChecked={dayName === "Sabtu" || dayName === "Minggu"} />
                            <span className="text-slate-650">{slot}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onShowToast("Ketersediaan waktu mengajar mingguan Anda berhasil di-sinkronisasi instan!", "success")}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-center text-xs font-bold shadow-md cursor-pointer"
                >
                  Simpan Konfigurasi Ketersediaan
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
