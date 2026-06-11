/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Users, BookOpen, UserPlus, GraduationCap, Award, CheckCircle, Edit, Save, Plus, Trash2, Eye, FileText
} from "lucide-react";
import { StudentProfile, MentorProfile, CurriculumModule, ScheduleEvent } from "../types";

interface AdminPanelProps {
  activeView: string;
  students: StudentProfile[];
  mentors: MentorProfile[];
  curriculum: CurriculumModule[];
  schedules: ScheduleEvent[];
  onUpdateStudents: (updated: StudentProfile[]) => void;
  onUpdateMentors: (updated: MentorProfile[]) => void;
  onUpdateCurriculum: (updated: CurriculumModule[]) => void;
  onNavigate: (view: string) => void;
  onShowToast: (message: string, type?: "success" | "warning" | "info") => void;
}

export default function AdminPanel({
  activeView,
  students,
  mentors,
  curriculum,
  schedules,
  onUpdateStudents,
  onUpdateMentors,
  onUpdateCurriculum,
  onNavigate,
  onShowToast
}: AdminPanelProps) {
  // Local States for Managing Lists
  const [activeTab, setActiveTab] = useState<"siswa" | "guru" | "materi">(
    activeView === "admin-siswa" ? "siswa" : activeView === "admin-guru" ? "guru" : activeView === "admin-materi" ? "materi" : "siswa"
  );

  // Sync state if activeView changes
  React.useEffect(() => {
    if (activeView === "admin-siswa") setActiveTab("siswa");
    if (activeView === "admin-guru") setActiveTab("guru");
    if (activeView === "admin-materi") setActiveTab("materi");
  }, [activeView]);

  // --- STUDENT CREATION STATE ---
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    level: 1,
    remainingSessions: 4,
    city: "Surakarta",
    address: ""
  });

  // --- GURU / MENTOR CREATION STATE ---
  const [showAddMentorForm, setShowAddMentorForm] = useState(false);
  const [newMentor, setNewMentor] = useState({
    name: "",
    email: "",
    phone: "",
    university: "UIN Raden Mas Said Surakarta",
    major: "Pendidikan Guru",
    bio: "",
    levels: [1],
    specialties: "Scratch & Tinkercad Blocks"
  });

  // --- CURRICULUM EDIT STATE ---
  const [selectedModuleForEdit, setSelectedModuleForEdit] = useState<CurriculumModule | null>(null);
  const [editModuleData, setEditModuleData] = useState<{
    title: string;
    summary: string;
    videoUrl: string;
    pdfUrl: string;
    quiz: {
      question: string;
      options: string[];
      answerIndex: number;
    }[];
  } | null>(null);

  // Add Student Handler
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email || !newStudent.phone) {
      onShowToast("Semua data wajib diisi!", "warning");
      return;
    }
    const studentObj: StudentProfile = {
      id: "s_admin_" + Date.now(),
      name: newStudent.name,
      email: newStudent.email,
      phone: newStudent.phone,
      level: Number(newStudent.level),
      levelProgress: 0,
      completedSessions: 0,
      remainingSessions: Number(newStudent.remainingSessions),
      averageScore: 0,
      address: newStudent.address || "Kab./Kota " + newStudent.city,
      city: newStudent.city,
      activeMentorId: "m1",
      activeMentorName: "Haya Nur Fadhila",
      quizScores: {},
      completedModules: []
    };

    onUpdateStudents([studentObj, ...students]);
    setShowAddStudentForm(false);
    setNewStudent({
      name: "",
      email: "",
      phone: "",
      level: 1,
      remainingSessions: 4,
      city: "Surakarta",
      address: ""
    });
    onShowToast("Berhasil menambahkan siswa baru!", "success");
  };

  // Add Mentor Handler
  const handleAddMentorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMentor.name || !newMentor.email || !newMentor.phone) {
      onShowToast("Semua data mentor wajib diisi!", "warning");
      return;
    }
    const mentorObj: MentorProfile = {
      id: "m_admin_" + Date.now(),
      name: newMentor.name,
      email: newMentor.email,
      phone: newMentor.phone,
      university: newMentor.university,
      major: newMentor.major,
      year: "Angkatan 2022",
      bio: newMentor.bio || "Mentor berdedikasi tinggi untuk pendidikan robotik anak.",
      levels: newMentor.levels,
      specialties: newMentor.specialties.split(",").map(s => s.trim()),
      rating: 5.0,
      completedClassesCount: 0,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      cvUrl: "dummy_cv.pdf",
      isVerified: true,
      status: "Tersedia",
      maxStudents: 5,
      activeStudentsCount: 0,
      availability: { "Sabtu": ["Sore"], "Minggu": ["Siang"] }
    };

    onUpdateMentors([mentorObj, ...mentors]);
    setShowAddMentorForm(false);
    setNewMentor({
      name: "",
      email: "",
      phone: "",
      university: "UIN Raden Mas Said Surakarta",
      major: "Pendidikan Guru",
      bio: "",
      levels: [1],
      specialties: "Scratch & Tinkercad Blocks"
    });
    onShowToast("Berhasil mendaftarkan mentor baru!", "success");
  };

  // Select Module for Editing
  const handleEditModuleInit = (module: CurriculumModule) => {
    setSelectedModuleForEdit(module);
    setEditModuleData({
      title: module.title,
      summary: module.summary,
      videoUrl: module.videoUrl,
      pdfUrl: module.pdfUrl,
      quiz: module.quiz && module.quiz.length === 5 ? [...module.quiz] : [
        { question: "Pertanyaan 1?", options: ["A", "B", "C", "D"], answerIndex: 0 },
        { question: "Pertanyaan 2?", options: ["A", "B", "C", "D"], answerIndex: 0 },
        { question: "Pertanyaan 3?", options: ["A", "B", "C", "D"], answerIndex: 0 },
        { question: "Pertanyaan 4?", options: ["A", "B", "C", "D"], answerIndex: 0 },
        { question: "Pertanyaan 5?", options: ["A", "B", "C", "D"], answerIndex: 0 }
      ]
    });
  };

  // Save Module Edits
  const handleSaveModuleEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleForEdit || !editModuleData) return;

    const updatedCurriculum = curriculum.map(m => {
      if (m.id === selectedModuleForEdit.id) {
        return {
          ...m,
          title: editModuleData.title,
          summary: editModuleData.summary,
          videoUrl: editModuleData.videoUrl,
          pdfUrl: editModuleData.pdfUrl,
          quiz: editModuleData.quiz
        };
      }
      return m;
    });

    onUpdateCurriculum(updatedCurriculum);
    setSelectedModuleForEdit(null);
    setEditModuleData(null);
    onShowToast("Materi & Kuis berhasil diperbarui oleh Admin!", "success");
  };

  // Delete Student
  const handleDeleteStudent = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus siswa "${name}" dari sistem?`)) {
      const updated = students.filter(s => s.id !== id);
      onUpdateStudents(updated);
      onShowToast(`Siswa "${name}" telah dihapus!`, "info");
    }
  };

  // Delete Mentor
  const handleDeleteMentor = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus mentor "${name}"?`)) {
      const updated = mentors.filter(m => m.id !== id);
      onUpdateMentors(updated);
      onShowToast(`Mentor "${name}" telah dihapus!`, "info");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-slate-800" id="admin-panel-container">
      {/* Header and Quick Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="text-left space-y-1">
          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full border border-red-200">
            ADMIN WORKSPACE
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
            BOBOTIC Headquarters Control
          </h1>
          <p className="text-xs text-slate-500">
            Panel manajemen terpusat untuk data siswa, berkas guru, dan pengaturan kurikulum interaktif.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="bg-slate-100 p-1 rounded-2xl flex border border-slate-200">
          <button
            onClick={() => setActiveTab("siswa")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "siswa" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Siswa ({students.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("guru")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "guru" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Guru ({mentors.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("materi")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === "materi" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Syllabus & Kuis</span>
          </button>
        </div>
      </div>

      {/* ========================================================
                    TAB 1: MANAGE SISWA (STUDENTS)
         ======================================================== */}
      {activeTab === "siswa" && (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-bold text-lg text-slate-900 inline-flex items-center space-x-2">
              <Users className="h-5 w-5 text-rose-500" />
              <span>Daftar Siswa Aktif BOBOTIC</span>
            </h2>
            <button
              onClick={() => setShowAddStudentForm(!showAddStudentForm)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Tambah Siswa Baru</span>
            </button>
          </div>

          {/* Add Student Form Modal/Collapse */}
          {showAddStudentForm && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 max-w-xl animate-in duration-200">
              <h3 className="font-display font-semibold text-sm text-slate-800 border-b pb-2">Formulir Pendaftaran Siswa oleh Admin</h3>
              <form onSubmit={handleAddStudentSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label>Nama Siswa</label>
                  <input
                    type="text"
                    required
                    placeholder="cth: Ryan Pratama"
                    value={newStudent.name}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label>Email Utama</label>
                  <input
                    type="email"
                    required
                    placeholder="cth: ryan@gmail.com"
                    value={newStudent.email}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label>No. WhatsApp Orangtua</label>
                  <input
                    type="text"
                    required
                    placeholder="08xxxxxxxxxx"
                    value={newStudent.phone}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label>Level Program</label>
                  <select
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    value={newStudent.level}
                    onChange={(e) => setNewStudent({ ...newStudent, level: Number(e.target.value) })}
                  >
                    <option value={1}>Level 1: Scratch & Tinkercad Blocks</option>
                    <option value={2}>Level 2: Arduino Mechatronics</option>
                    <option value={3}>Level 3: IoT & AI Systems</option>
                    <option value={4}>Level 4: Alumni Kompetisi</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label>Jumlah Sesi Dibeli</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    value={newStudent.remainingSessions}
                    onChange={(e) => setNewStudent({ ...newStudent, remainingSessions: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1">
                  <label>Kota / Distrik Operasi</label>
                  <select
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    value={newStudent.city}
                    onChange={(e) => setNewStudent({ ...newStudent, city: e.target.value })}
                  >
                    <option value="Surakarta">Kota Surakarta</option>
                    <option value="Boyolali">Boyolali</option>
                    <option value="Sukoharjo">Sukoharjo</option>
                    <option value="Karanganyar">Karanganyar</option>
                    <option value="Klaten">Klaten</option>
                    <option value="Sragen">Sragen</option>
                  </select>
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label>Alamat Belajar Lengkap (Di Rumah)</label>
                  <textarea
                    rows={2}
                    placeholder="Masukkan nama jalan, nomor, RT/RW, kelurahan, kecamatan"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    value={newStudent.address}
                    onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddStudentForm(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl cursor-pointer"
                  >
                    Batalkan
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl cursor-pointer shadow-sm"
                  >
                    Simpan Siswa
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Students Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-wider font-bold text-slate-500">
                    <th className="py-3.5 px-4 font-semibold">Nama Siswa / ID</th>
                    <th className="py-3.5 px-4 font-semibold">Kontak & Email</th>
                    <th className="py-3.5 px-4 font-semibold">Level Program</th>
                    <th className="py-3.5 px-4 font-semibold">Kota Operasi</th>
                    <th className="py-3.5 px-4 text-center font-semibold">Sisa Sesi</th>
                    <th className="py-3.5 px-4 font-semibold">Mentor Pendamping</th>
                    <th className="py-3.5 px-4 font-semibold">Alamat Rumah</th>
                    <th className="py-3.5 px-4 text-center font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((std) => (
                    <tr key={std.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{std.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono block">ID: {std.id}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-700 block">{std.phone}</span>
                        <span className="text-[10px] text-slate-400 block">{std.email}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-100/50 block w-fit">
                          Lvl {std.level}: {std.level === 1 ? "Scratch & Tinkercad" : std.level === 2 ? "Arduino" : std.level === 3 ? "IoT & AI" : "Alumni"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-semibold">{std.city || "Surakarta"}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-blue-600">
                        {std.remainingSessions} Sesi
                      </td>
                      <td className="py-3 px-4 text-slate-800 font-medium">
                        {std.activeMentorName || <span className="text-slate-400 italic text-[11px]">Belum diatur</span>}
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate animate-in" title={std.address}>
                        {std.address}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDeleteStudent(std.id, std.name)}
                          className="p-1.5 text-slate-405 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer inline-flex items-center"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-400">
                        Belum ada data siswa terdaftar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
                    TAB 2: MANAGE GURU (MENTORS / TEACHERS)
         ======================================================== */}
      {activeTab === "guru" && (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="font-display font-bold text-lg text-slate-900 inline-flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-rose-500" />
              <span>Daftar Guru / Mentor Terakreditasi BOBOTIC</span>
            </h2>
            <button
              onClick={() => setShowAddMentorForm(!showAddMentorForm)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Tambah Mentor Baru</span>
            </button>
          </div>

          {/* Add Mentor Form */}
          {showAddMentorForm && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 max-w-xl animate-in duration-200">
              <h3 className="font-display font-semibold text-sm text-slate-800 border-b pb-2">Form Pendaftaran Mentor Terpilih</h3>
              <form onSubmit={handleAddMentorSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label>Nama Mentor & Gelar</label>
                  <input
                    type="text"
                    required
                    placeholder="cth: Haya Nur Fadhila, S.Pd."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    value={newMentor.name}
                    onChange={(e) => setNewMentor({ ...newMentor, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label>Email Instansi / Pribadi</label>
                  <input
                    type="email"
                    required
                    placeholder="cth: haya.fadhila@bobotic.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    value={newMentor.email}
                    onChange={(e) => setNewMentor({ ...newMentor, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label>No. WhatsApp Aktif</label>
                  <input
                    type="text"
                    required
                    placeholder="08xxxxxxxx"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    value={newMentor.phone}
                    onChange={(e) => setNewMentor({ ...newMentor, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label>Sertifikasi / Spesialisasi Utama</label>
                  <input
                    type="text"
                    placeholder="cth: Scratch & Tinkercad Blocks, IoT, Arduino"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    value={newMentor.specialties}
                    onChange={(e) => setNewMentor({ ...newMentor, specialties: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label>Asal Universitas Mitra</label>
                  <select
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    value={newMentor.university}
                    onChange={(e) => setNewMentor({ ...newMentor, university: e.target.value })}
                  >
                    <option value="UIN Raden Mas Said Surakarta">UIN Raden Mas Said Surakarta</option>
                    <option value="Universitas Sebelas Maret (UNS)">Universitas Sebelas Maret (UNS)</option>
                    <option value="Universitas Muhammadiyah Surakarta (UMS)">Universitas Muhammadiyah Surakarta (UMS)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label>Jurusan / Program Studi</label>
                  <input
                    type="text"
                    placeholder="cth: Pendidikan Guru Madrasah Ibtidaiyah"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    value={newMentor.major}
                    onChange={(e) => setNewMentor({ ...newMentor, major: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label>Dedikasi / Biodata Singkat</label>
                  <textarea
                    rows={2}
                    placeholder="Tuliskan pengalaman kompetisi atau metodologi mengajar kreatif..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    value={newMentor.bio}
                    onChange={(e) => setNewMentor({ ...newMentor, bio: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddMentorForm(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl cursor-pointer"
                  >
                    Batalkan
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl cursor-pointer shadow-sm"
                  >
                    Simpan Guru
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Mentors Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-wider font-bold text-slate-500">
                    <th className="py-3.5 px-4 font-semibold">Nama Mentor</th>
                    <th className="py-3.5 px-4 font-semibold">Asal Universitas</th>
                    <th className="py-3.5 px-4 font-semibold">Jurusan / Major</th>
                    <th className="py-3.5 px-4 font-semibold">Kontak WA</th>
                    <th className="py-3.5 px-4 font-semibold">Spesialisasi Keahlian</th>
                    <th className="py-3.5 px-4 font-semibold">Lembaga Afiliasi</th>
                    <th className="py-3.5 px-4 text-center font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mentors.map((men) => (
                    <tr key={men.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={men.avatarUrl}
                            alt={men.name}
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                            className="h-8 w-8 rounded-full object-cover shrink-0 border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{men.name}</span>
                            <span className="text-[9px] text-slate-400 font-mono block">ID: {men.id} · {men.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700 uppercase font-mono text-[10px]">
                        {men.university}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{men.major}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">{men.phone}</td>
                      <td className="py-3 px-4">
                        <span className="text-blue-850 font-medium">
                          {men.specialties.join(", ")}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-100/60 px-2 py-0.5 rounded-full inline-flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3 shrink-0" />
                          <span>{men.university.includes("UIN") ? "UIN Surakarta" : "Mitra UNS/UMS"}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDeleteMentor(men.id, men.name)}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-650 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                  {mentors.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-400">
                        Belum ada data mentor terakreditasi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
                    TAB 3: MANAGE CURRICULUM MODULES & QUIZZES
         ======================================================== */}
      {activeTab === "materi" && (
        <div className="space-y-6 text-left">
          <div className="border-b pb-2">
            <h2 className="font-display font-bold text-lg text-slate-900 inline-flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-red-650" />
              <span>Pengaturan Kurikulum, Soal Kuis (Syllabus Control)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Admin dapat dengan bebas mengubah alur kurikulum, menyempurnakan video pengantar, berkas PDF modul, serta mengubah lembar 5 soal kuis pilgan murid.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* List modules */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                DAFTAR SILABUS YANG TERSEDIA di BOBOTIC
              </span>

              {curriculum.map((m) => {
                const isActive = selectedModuleForEdit?.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleEditModuleInit(m)}
                    className={`w-full p-4 rounded-2xl border text-left cursor-pointer transition-all flex justify-between items-center ${
                      isActive
                        ? "border-red-500 bg-red-50 text-red-950 ring-2 ring-red-50"
                        : "border-slate-100 bg-white hover:border-slate-200"
                    }`}
                  >
                    <div className="space-y-1.5 pr-2">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[9px] font-bold rounded-sm uppercase font-mono">
                        Lvl {m.level} · {m.id}
                      </span>
                      <h4 className="font-display font-bold text-xs text-slate-850 line-clamp-1">
                        {m.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 leading-normal line-clamp-1">{m.summary}</p>
                    </div>
                    <Edit className="h-4 w-4 text-slate-400 shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* Editing Panel Form */}
            <div className="lg:col-span-7">
              {selectedModuleForEdit && editModuleData ? (
                <form onSubmit={handleSaveModuleEdits} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
                  <div className="border-b pb-3 flex justify-between items-center">
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-900 uppercase">
                        Edit Modul: {selectedModuleForEdit.id}
                      </h3>
                      <p className="text-[10px] text-slate-400">Atur parameter video, PDF, dan kuis 5 soal murid.</p>
                    </div>
                    <span className="px-2.5 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded">
                      Level {selectedModuleForEdit.level}
                    </span>
                  </div>

                  <div className="space-y-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <label>Judul Modul Pembelajaran</label>
                      <input
                        type="text"
                        required
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        value={editModuleData.title}
                        onChange={(e) => setEditModuleData({ ...editModuleData, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1">
                      <label>Dekripsi Summary / Ringkasan</label>
                      <textarea
                        rows={2}
                        required
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        value={editModuleData.summary}
                        onChange={(e) => setEditModuleData({ ...editModuleData, summary: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label>Embed Youtube Video URL</label>
                        <input
                          type="text"
                          required
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[10px]"
                          value={editModuleData.videoUrl}
                          onChange={(e) => setEditModuleData({ ...editModuleData, videoUrl: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label>Dokumen Pembelajaran PDF URL</label>
                        <input
                          type="text"
                          required
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[10px]"
                          value={editModuleData.pdfUrl}
                          onChange={(e) => setEditModuleData({ ...editModuleData, pdfUrl: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* QUIZ EDITING SECTION */}
                    <div className="border-t border-slate-100 pt-4 space-y-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <h4 className="text-xs uppercase font-extrabold text-blue-700 flex items-center space-x-1">
                          <Award className="h-4 w-4" />
                          <span>Lembar 5 Soal Kuis Pilihan Ganda</span>
                        </h4>
                        <span className="text-[10px] text-slate-400">Pastikan Soal Terjawab dengan Kunci Jawaban Benar</span>
                      </div>

                      {editModuleData.quiz.map((q, idx) => (
                        <div key={idx} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 text-[11px] space-y-3">
                          <div className="space-y-1">
                            <label className="text-slate-800 font-bold block">Soal Kuis Nomor {idx + 1}</label>
                            <input
                              type="text"
                              required
                              className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                              value={q.question}
                              onChange={(e) => {
                                const updatedQuiz = [...editModuleData.quiz];
                                updatedQuiz[idx].question = e.target.value;
                                setEditModuleData({ ...editModuleData, quiz: updatedQuiz });
                              }}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {q.options.map((opt, optIdx) => (
                              <div key={optIdx} className="space-y-0.5 text-left">
                                <label className="text-[10px] text-slate-450 block">Pilihan ({String.fromCharCode(65 + optIdx)})</label>
                                <input
                                  type="text"
                                  required
                                  className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-[10px]"
                                  value={opt}
                                  onChange={(e) => {
                                    const updatedQuiz = [...editModuleData.quiz];
                                    updatedQuiz[idx].options[optIdx] = e.target.value;
                                    setEditModuleData({ ...editModuleData, quiz: updatedQuiz });
                                  }}
                                />
                              </div>
                            ))}
                          </div>

                          <div className="space-y-1">
                            <label className="text-slate-700 block">Kunci Jawaban Benar</label>
                            <select
                              className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                              value={q.answerIndex}
                              onChange={(e) => {
                                const updatedQuiz = [...editModuleData.quiz];
                                updatedQuiz[idx].answerIndex = Number(e.target.value);
                                setEditModuleData({ ...editModuleData, quiz: updatedQuiz });
                              }}
                            >
                              <option value={0}>Pilihan A</option>
                              <option value={1}>Pilihan B</option>
                              <option value={2}>Pilihan C</option>
                              <option value={3}>Pilihan D</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 border-t pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedModuleForEdit(null);
                        setEditModuleData(null);
                      }}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 cursor-pointer"
                    >
                      Batalkan
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl text-xs cursor-pointer inline-flex items-center space-x-1 shadow-md hover:bg-red-700"
                    >
                      <Save className="h-4 w-4 shrink-0" />
                      <span>Simpan Perubahan Materi</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="h-full border border-dashed border-slate-200 rounded-3xl p-12 text-center flex flex-col justify-center items-center text-slate-400 space-y-2">
                  <BookOpen className="h-10 w-10 text-slate-300" />
                  <p className="font-semibold text-xs text-slate-650">Tidak ada modul yang sedang diseleksi</p>
                  <p className="text-[10px] text-slate-400 max-w-xs">Silakan pilih salah satu kartu Modul Pembelajaran di panel sebelah kiri untuk mulai mengedit materi detail & soal ujian kuis kustom.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
