/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { UserRole, StudentProfile, MentorProfile, ScheduleEvent, MentorRequest, CurriculumModule } from "./types";
import { getSavedState, saveStateToLocal } from "./data";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

// Sub-components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PublicPages from "./components/PublicPages";
import SiswaPanel from "./components/SiswaPanel";
import MentorPanel from "./components/MentorPanel";
import AuthPages from "./components/AuthPages";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  // Core Unified Reactive States
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [schedules, setSchedules] = useState<ScheduleEvent[]>([]);
  const [requests, setRequests] = useState<MentorRequest[]>([]);
  const [curriculum, setCurriculum] = useState<CurriculumModule[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole>("public");
  const [loggedUser, setLoggedUser] = useState<any>(null);
  const [activeView, setActiveView] = useState<string>("home");

  // Modern Toast Notification States
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "warning" | "info";
  } | null>(null);

  const showNotification = (message: string, type: "success" | "warning" | "info" = "success") => {
    setNotification({ message, type });
  };

  // Auto-dismiss logic for notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Load database entities from LocalStorage on mount
  useEffect(() => {
    const saved = getSavedState();
    setStudents(saved.students);
    setMentors(saved.mentors);
    setSchedules(saved.schedules);
    setRequests(saved.requests);
    setCurriculum(saved.curriculum);
    setActiveRole(saved.activeRole);
    setLoggedUser(saved.loggedUser);

    // Initialise reasonable starting view
    if (saved.activeRole === "siswa") {
      setActiveView("siswa-dashboard");
    } else if (saved.activeRole === "mentor") {
      setActiveView("mentor-dashboard");
    } else if (saved.activeRole === "admin") {
      setActiveView("admin-dashboard");
    } else {
      setActiveView("home");
    }
  }, []);

  // Write changes back to LocalStorage whenever critical models update
  const updateSchedules = (updated: ScheduleEvent[]) => {
    setSchedules(updated);
    saveStateToLocal({ schedules: updated });
  };

  const updateRequests = (updated: MentorRequest[]) => {
    setRequests(updated);
    saveStateToLocal({ requests: updated });
  };

  const updateStudents = (updated: StudentProfile[]) => {
    setStudents(updated);
    saveStateToLocal({ students: updated });
  };

  const updateMentors = (updated: MentorProfile[]) => {
    setMentors(updated);
    saveStateToLocal({ mentors: updated });
  };

  const updateCurriculum = (updated: CurriculumModule[]) => {
    setCurriculum(updated);
    saveStateToLocal({ curriculum: updated });
  };

  const handleLoginSucceed = (role: UserRole, userObj: any) => {
    setActiveRole(role);
    setLoggedUser(userObj);
    saveStateToLocal({ activeRole: role, loggedUser: userObj });
    showNotification(`Selamat datang kembali, ${userObj.name || "di BOBOTIC"}!`, "success");
  };

  const handleLogout = () => {
    setActiveRole("public");
    setLoggedUser(null);
    setActiveView("home");
    saveStateToLocal({ activeRole: "public", loggedUser: null });
    showNotification("Anda telah berhasil logout/keluar dari sistem BOBOTIC.", "info");
  };

  const handleQuickSwitch = (role: UserRole, userObj?: any) => {
    setActiveRole(role);
    setLoggedUser(userObj || null);
    saveStateToLocal({ activeRole: role, loggedUser: userObj || null });
    showNotification(`Beralih peran ke: ${role === "public" ? "Pengunjung (Landing)" : userObj?.name || "User"}`, "info");
  };

  // Add new entities directly through checkout / registration pipeline
  const handleAddNewStudentObj = (newStu: StudentProfile) => {
    const list = [...students, newStu];
    setStudents(list);
    saveStateToLocal({ students: list });
  };

  const handleAddNewMentorObj = (newMen: MentorProfile) => {
    const list = [...mentors, newMen];
    setMentors(list);
    saveStateToLocal({ mentors: list });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-blue-500 selection:text-white" id="bobotic-app-shell">
      
      {/* Centralised Akurasi Navbar */}
      <Navbar
        activeView={activeView}
        activeRole={activeRole}
        loggedUser={loggedUser}
        onNavigate={setActiveView}
        onLogout={handleLogout}
        onQuickSwitch={handleQuickSwitch}
      />

      {/* Floating Modern Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl border border-slate-800 shadow-2xl flex items-center justify-between space-x-3 text-xs animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center space-x-2.5 text-left">
            {notification.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
            {notification.type === "warning" && <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />}
            {notification.type === "info" && <Info className="h-5 w-5 text-blue-400 shrink-0" />}
            <span className="font-medium tracking-wide leading-relaxed text-slate-100">{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Primary Dynamic Content Dispatcher Router */}
      <main className="grow">
        {/* PUBLIC VIEWS: Home, Tentang, Harga, Kelas, FAQ */}
        {["home", "tentang", "harga", "kelas", "faq"].includes(activeView) && (
          <PublicPages
            activeView={activeView}
            mentors={mentors}
            onNavigate={setActiveView}
            onAddStudent={handleAddNewStudentObj}
            onShowToast={showNotification}
          />
        )}

        {/* AUTH VIEWS: Login, Register, Forgot */}
        {["auth-login", "auth-register-siswa", "auth-register-mentor", "auth-forgot"].includes(activeView) && (
          <AuthPages
            activeView={activeView}
            students={students}
            mentors={mentors}
            onNavigate={setActiveView}
            onLoginSucceed={handleLoginSucceed}
            onAddStudent={handleAddNewStudentObj}
            onAddMentor={handleAddNewMentorObj}
            onShowToast={showNotification}
          />
        )}

        {/* LOGGED STUDENT VIEWS: Dashboard, Jadwal, Progres, Mentor list, Materials */}
        {activeRole === "siswa" && activeView.startsWith("siswa-") && (
          <SiswaPanel
            activeView={activeView}
            loggedUser={loggedUser}
            students={students}
            mentors={mentors}
            schedules={schedules}
            requests={requests}
            curriculum={curriculum}
            onUpdateSchedules={updateSchedules}
            onUpdateRequests={updateRequests}
            onUpdateStudents={updateStudents}
            onNavigate={setActiveView}
            onShowToast={showNotification}
          />
        )}

        {/* LOGGED MENTOR VIEWS: Dashboard, Jadwal, Siswa, Input Rapor, Permintaan, Profile */}
        {activeRole === "mentor" && activeView.startsWith("mentor-") && (
          <MentorPanel
            activeView={activeView}
            loggedUser={loggedUser}
            mentors={mentors}
            students={students}
            schedules={schedules}
            requests={requests}
            onUpdateSchedules={updateSchedules}
            onUpdateRequests={updateRequests}
            onUpdateStudents={updateStudents}
            onUpdateMentors={updateMentors}
            onNavigate={setActiveView}
            onShowToast={showNotification}
          />
        )}

        {/* LOGGED ADMIN VIEWS */}
        {activeRole === "admin" && activeView.startsWith("admin-") && (
          <AdminPanel
            activeView={activeView}
            students={students}
            mentors={mentors}
            curriculum={curriculum}
            schedules={schedules}
            onUpdateStudents={updateStudents}
            onUpdateMentors={updateMentors}
            onUpdateCurriculum={updateCurriculum}
            onNavigate={setActiveView}
            onShowToast={showNotification}
          />
        )}
      </main>

      {/* Modern footer for entire site */}
      <Footer onNavigate={setActiveView} />

    </div>
  );
}
