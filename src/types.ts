/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Roles
export type UserRole = "public" | "siswa" | "mentor" | "admin";

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: number; // 1 to 4
  levelProgress: number; // e.g. 65%
  completedSessions: number;
  remainingSessions: number;
  averageScore: number;
  address: string;
  activeMentorId?: string;
  activeMentorName?: string;
  city?: string;
  quizScores?: { [moduleId: string]: number }; // moduleId -> score from 0 to 100
  completedModules?: string[]; // list of completed moduleIds
}

export interface MentorProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  major: string;
  year: string;
  bio: string;
  levels: number[]; // e.g. [1, 2, 3]
  specialties: string[]; // e.g. ["Scratch", "Arduino"]
  rating: number;
  completedClassesCount: number;
  avatarUrl: string;
  ktmUrl?: string; // For backward compatibility
  cvUrl?: string; // New PDF CV slot
  certificateUrl?: string; // New Certification / Portofolio slot
  isVerified: boolean; // false, pending, true
  status: "Tersedia" | "Sibuk" | "Tidak Tersedia";
  maxStudents: number;
  activeStudentsCount: number;
  availability: {
    [key: string]: string[]; // "Senin" -> ["pagi", "sore"]
  };
}

export interface ScheduleEvent {
  id: string;
  siswaId: string;
  siswaName: string;
  mentorId: string;
  mentorName: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "14:00 - 15:30"
  topic: string;
  address: string;
  notes?: string;
  status: "Terkonfirmasi" | "Menunggu" | "Dibatalkan" | "Selesai";
  score?: number;
  masteredTopics?: string[];
  recheckTopics?: string[];
  photoUrl?: string;
  cancelReason?: string;
  attendance?: "Hadir" | "Absen" | "Izin" | "Sakit" | "Alpa"; // Attendance marking
  attendanceNotes?: string; // Additional meeting note
}

export interface MentorRequest {
  id: string;
  siswaId: string;
  siswaName: string;
  level: number;
  location: string;
  mentorId: string;
  requestedSchedule: string;
  dateCreated: string;
  status: "Menunggu" | "Diterima" | "Ditolak";
  rejectionReason?: string;
}

export interface CurriculumModule {
  id: string;
  level: number;
  title: string;
  summary: string;
  videoUrl: string;
  pdfUrl: string;
  projects: {
    id: string;
    title: string;
    description?: string;
    isCompleted: boolean;
  }[];
  quiz?: {
    question: string;
    options: string[];
    answerIndex: number;
  }[];
}
