/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudentProfile, MentorProfile, ScheduleEvent, MentorRequest, CurriculumModule } from "./types";

export const DEFAULT_MENTORS: MentorProfile[] = [
  {
    id: "m1",
    name: "Haya Nur Fadhila",
    email: "haya.fadhila@bobotic.com",
    phone: "081234567805",
    university: "UIN Raden Mas Said Surakarta",
    major: "Pendidikan Guru Madrasah Ibtidaiyah",
    year: "Angkatan 2022",
    bio: "Pecinta robotika dengan spesialisasi Scratch & Tinkercad Blocks serta integrasi media pembelajaran interaktif kreatif. Berpengalaman 3 tahun mendampingi anak-anak.",
    levels: [1, 2, 3],
    specialties: ["Scratch & Tinkercad Blocks", "Arduino", "IoT"],
    rating: 4.9,
    completedClassesCount: 124,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    isVerified: true,
    status: "Tersedia",
    maxStudents: 5,
    activeStudentsCount: 2,
    availability: {
      "Senin": ["sore"],
      "Rabu": ["sore"],
      "Sabtu": ["pagi", "siang"]
    }
  },
  {
    id: "m2",
    name: "Clara Amanda",
    email: "clara.amanda@bobotic.com",
    phone: "081234567802",
    university: "Universitas Muhammadiyah Surakarta (UMS)",
    major: "Informatika",
    year: "Angkatan 2022",
    bio: "Fokus pada game development anak-anak dan kurikulum block programming seperti Scratch & Kodular. Ceria dan sangat bersabar mendampingi anak usia Playgroup & SD.",
    levels: [1, 2],
    specialties: ["Scratch & Tinkercad Blocks", "Game Design"],
    rating: 4.8,
    completedClassesCount: 86,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    isVerified: true,
    status: "Tersedia",
    maxStudents: 3,
    activeStudentsCount: 1,
    availability: {
      "Selasa": ["sore"],
      "Kamis": ["sore"],
      "Sabtu": ["pagi", "siang"],
      "Minggu": ["pagi", "siang"]
    }
  },
  {
    id: "m3",
    name: "Fadhil Rahman",
    email: "fadhil.rahman@bobotic.com",
    phone: "081234567803",
    university: "UIN Raden Mas Said Surakarta",
    major: "Informatika",
    year: "Angkatan 2020",
    bio: "Alumni kompetisi robotika nasional (KRI). Spesialisasi perancangan mekanik robot presisi tinggi dan pemodelan 3D CAD. Mentor andalan tim kompetisi.",
    levels: [2, 3],
    specialties: ["Arduino", "IoT", "Kompetisi"],
    rating: 5.0,
    completedClassesCount: 182,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    isVerified: true,
    status: "Tersedia",
    maxStudents: 4,
    activeStudentsCount: 1,
    availability: {
      "Jumat": ["sore", "malam"],
      "Sabtu": ["sore", "malam"],
      "Minggu": ["pagi", "siang", "sore"]
    }
  },
  {
    id: "m4",
    name: "Sekar Ayu",
    email: "sekar.ayu@bobotic.com",
    phone: "081234567804",
    university: "Universitas Sebelas Maret (UNS)",
    major: "Informatika (AI Lab)",
    year: "Angkatan 2021",
    bio: "Peneliti muda di bidang Machine Learning dan Computer Vision. Mengajar robotika level lanjat dengan integrasi modul Python AI & ESP32-CAM.",
    levels: [3],
    specialties: ["IoT", "AI", "Kompetisi"],
    rating: 4.7,
    completedClassesCount: 42,
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    isVerified: false,
    status: "Tidak Tersedia",
    maxStudents: 2,
    activeStudentsCount: 2,
    availability: {
      "Senin": ["malam"],
      "Selasa": ["malam"],
      "Kamis": ["malam"]
    }
  },
  {
    id: "m5",
    name: "Aris Setiawan, S.Pd.",
    email: "aris.setiawan@bobotic.com",
    phone: "081234567801",
    university: "Universitas Sebelas Maret (UNS)",
    major: "Pendidikan Teknik Elektro",
    year: "Angkatan 2021",
    bio: "Spesialis pengajaran robotika mikro, Scratch & Tinkercad, serta elektronika dasar bagi anak-anak di Solo Raya. Berpengalaman melatih tim olimpiade robotika sekolah.",
    levels: [1, 2, 3],
    specialties: ["Scratch & Tinkercad Blocks", "Arduino", "IoT"],
    rating: 4.9,
    completedClassesCount: 140,
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
    isVerified: true,
    status: "Tersedia",
    maxStudents: 5,
    activeStudentsCount: 1,
    availability: {
      "Sabtu": ["sore", "malam"],
      "Minggu": ["pagi", "siang", "sore"]
    }
  }
];

export const DEFAULT_STUDENTS: StudentProfile[] = [
  {
    id: "s1",
    name: "Budi Santoso",
    email: "budi@gmail.com",
    phone: "082345678901",
    level: 1,
    levelProgress: 75,
    completedSessions: 9,
    remainingSessions: 3,
    averageScore: 92,
    address: "Jl. Slamet Riyadi No. 124, Solo",
    activeMentorId: "m1",
    activeMentorName: "Haya Nur Fadhila",
    city: "Surakarta"
  },
  {
    id: "s2",
    name: "Ryan Pratama",
    email: "ryan@gmail.com",
    phone: "082345678902",
    level: 3,
    levelProgress: 25,
    completedSessions: 4,
    remainingSessions: 12,
    averageScore: 88,
    address: "Perum Solo Baru Sektor 2, Sukoharjo",
    activeMentorId: "m3",
    activeMentorName: "Fadhil Rahman",
    city: "Sukoharjo"
  }
];

export const DEFAULT_CURRICULUM: CurriculumModule[] = [
  // TRACK 1: Scratch & Tinkercad Blocks (Level 1)
  {
    id: "cur-1-1",
    level: 1,
    title: "Scratch Dasar",
    summary: "Memahami antarmuka Scratch, panggung (stage), sprite karakter pengontrol, dan cara merakit blok rangkaian kode berurutan agar kucing dapat berjalan dan bersuara secara logic.",
    videoUrl: "",
    pdfUrl: "https://bobotic.id/pdf/scratch-dasar.pdf",
    projects: [
      { id: "p111", title: "Merangkai project halo dunia pada panggung Scratch", isCompleted: true },
      { id: "p112", title: "Membuahkan manipulasi rotasi sprite dengan tombol keyboard", isCompleted: true }
    ],
    quiz: [
      {
        question: "Tombol ikon apa yang digunakan untuk memulai eksekusi blok skrip program di Scratch?",
        options: ["Bendera Hijau", "Hexagon Merah", "Bintang Emas", "Tanda Panah Biru"],
        answerIndex: 0
      },
      {
        question: "Apa nama komponen visual representatif objek gambar/karakter yang diberikan instruksi di Scratch?",
        options: ["Stage", "Sprite", "Backdrop", "Script Block"],
        answerIndex: 1
      },
      {
        question: "Sumbu koordinat kartesian apakah yang berubah nilainya saat sprite digerakkan ke kanan/kiri?",
        options: ["Sumbu Y", "Sumbu X", "Sumbu Z", "Sumbu Diagonal"],
        answerIndex: 1
      },
      {
        question: "Balok blok instruksi berwarna Biru di Scratch secara fungsional mengontrol aspek apa?",
        options: ["Motion (Gerakan)", "Looks (Tampilan/Kostum)", "Sound (Suara)", "Events (Kejadian)"],
        answerIndex: 0
      },
      {
        question: "Apa fungsi dari komponen Backdrop pada lembar Scratch?",
        options: ["Karakter utama robot", "Efek suara bip", "Latar belakang panggung pementasan", "Variabel penyimpanan data"],
        answerIndex: 2
      }
    ]
  },
  {
    id: "cur-1-2",
    level: 1,
    title: "Logika Pemrograman",
    summary: "Menguasai konsep fundamental Loops (perulangan selamanya/terbatas), variabel penyimpan skor, kondisi percabangan (if-then), dan sensor warna dalam membuat game tangkap bola interaktif.",
    videoUrl: "",
    pdfUrl: "https://bobotic.id/pdf/logika-pemrograman.pdf",
    projects: [
      { id: "p121", title: "Menetapkan timer countdown dengan nilai dinamis", isCompleted: true },
      { id: "p122", title: "Game Over trigger saat menyentuh sensor dinding merah", isCompleted: false }
    ],
    quiz: [
      {
        question: "Balok loop perulangan apa yang terus-menerus mengeksekusi instruksi tanpa henti?",
        options: ["Repeat 10", "Forever", "If-Else", "Wait 1 seconds"],
        answerIndex: 1
      },
      {
        question: "Komponen pemrograman apakah yang berfungsi menampung/menyimpan nilai angka skor secara dinamis?",
        options: ["Sprite", "Variable (Variabel)", "Operator", "Backdrops List"],
        answerIndex: 1
      },
      {
        question: "Jika ingin bola memantul balik saat menyentuh garis merah, block kontrol utama apakah yang dipakai?",
        options: ["If touching red color, then", "Change score by 1", "Next costume", "Repeat 10 times"],
        answerIndex: 0
      },
      {
        question: "Bagaimanakah cara menaikkan skor jika keranjang berhasil menangkap buah?",
        options: ["Change score by 1", "Set score to 0", "Hide variable score", "Stop all"],
        answerIndex: 0
      },
      {
        question: "Kombinasi gerbang logika 'AND' akan menghasilkan keputusan benar (true) apabila...",
        options: ["Salah satu input benar", "Kedua input wajib bernilai benar", "Semua input bernilai salah", "Menggunakan variabel global nilgai"],
        answerIndex: 1
      }
    ]
  },
  {
    id: "cur-1-3",
    level: 1,
    title: "Tinkercad Circuits",
    summary: "Memulai dasar kelistrikan elektronika. Siswa mengenal komponen virtual resistor, LED, breadboard, baterai, multimeter, serta hukum Ohm dasar sebelum merakit ke hardware riil.",
    videoUrl: "",
    pdfUrl: "https://bobotic.id/pdf/tinkercad-circuits.pdf",
    projects: [
      { id: "p131", title: "Rangkaian LED tunggal menyala stabil dengan resistor pengaman", isCompleted: true },
      { id: "p132", title: "Simulasi Multimeter mengukur tegangan baterai koin", isCompleted: false }
    ],
    quiz: [
      {
        question: "Software simulator 3D desain dan sirkuit listrik online gratis buatan Autodesk adalah...",
        options: ["Scratch", "Tinkercad Circuits", "Arduino IDE", "VS Code"],
        answerIndex: 1
      },
      {
        question: "Apa kegunaan utama dari komponen Resistor dalam rangkaian lampu LED?",
        options: ["Memperkuat sinyal Wi-Fi", "Membatasi arus listrik agar lampu tidak putus / terbakar", "Mengubah warna pendar LED", "Menyimpan baterai darurat"],
        answerIndex: 1
      },
      {
        question: "Kaki LED yang lebih panjang dengan tekukan kecil menunjukkan polaritas apa?",
        options: ["Katoda (Negatif)", "Anoda (Positif)", "Ground", "Neutralizer"],
        answerIndex: 1
      },
      {
        question: "Papan plastik berlubang tempat merangkai komponen kabel secara sementara tanpa solder dinamakan...",
        options: ["Resistor Board", "Breadboard / Project Board", "Multimeter", "Battery Holder"],
        answerIndex: 1
      },
      {
        question: "Apa satuan standar kelistrikan hambatan dari komponen resistor?",
        options: ["Volt", "Ampere", "Ohm", "Watt"],
        answerIndex: 2
      }
    ]
  },

  // TRACK 2: Arduino Mechatronics (Level 2)
  {
    id: "cur-2-1",
    level: 2,
    title: "Arduino Dasar",
    summary: "Mengenal hardware Arduino Uno asli, instalasi driver Arduino IDE di laptop, struktur setup() dan loop() C++, sirkuit dasar pin Input/Output digital, serta program Traffic Light 3 LED.",
    videoUrl: "",
    pdfUrl: "https://bobotic.id/pdf/arduino-dasar.pdf",
    projects: [
      { id: "p211", title: "Konfigurasi blink LED internal Pin 13", isCompleted: true },
      { id: "p212", title: "Projek sirkuit lampu lalu lintas 3 LED sinkron", isCompleted: true }
    ],
    quiz: [
      {
        question: "Papan sirkuit komputer mini mikrokontroler open-source terpopuler di dunia untuk pemula adalah...",
        options: ["ESP32-CAM", "Arduino Uno", "Raspberry Pi 5", "Transistor PNP"],
        answerIndex: 1
      },
      {
        question: "Berapa tegangan output digital pin Arduino Uno jika diberi instruksi digitalWrite(pin, HIGH)?",
        options: ["0 Volt", "5 Volt", "12 Volt", "220 Volt"],
        answerIndex: 1
      },
      {
        question: "Fungsi utama dari bagian 'void setup()' pada kode program Arduino adalah...",
        options: ["Mengulang kode selamanya", "Menjalankan inisialisasi awal hanya 1 kali saat dinyalakan", "Membuat delay program", "Mengimpor gambar sprite"],
        answerIndex: 1
      },
      {
        question: "Fungsi utama dari program 'void loop()' pada Arduino IDE adalah...",
        options: ["Membaca library eksternal", "Menjalankan program secara berulang terus menerus", "Menghapus program dalam chip", "Membatasi arus listrik"],
        answerIndex: 1
      },
      {
        question: "Ingin memberi jeda mati-nyala lampu selama 1,5 detik, berapa parameter nilai delay() yang harus dimasukkan?",
        options: ["1.5", "150", "1500", "15000"],
        answerIndex: 2
      }
    ]
  },
  {
    id: "cur-2-2",
    level: 2,
    title: "Sensor dan Aktuator",
    summary: "Menghubungkan sensor jarak ultrasonik (HC-SR04), sensor cahaya LDR, buzzer, dan motor servo. Menulis program pembacaan jarak untuk sistem alarm parkir mobil otomatis.",
    videoUrl: "",
    pdfUrl: "https://bobotic.id/pdf/sensor-aktuator.pdf",
    projects: [
      { id: "p221", title: "Membaca nilai analog sensor LDR di serial monitor", isCompleted: true },
      { id: "p222", title: "Alarm bunyi buzzer dinamis berdasarkan sensor jarak", isCompleted: false }
    ],
    quiz: [
      {
        question: "Sensor manakah yang berguna mendeteksi jarak dengan memantulkan gelombang suara tingkat tinggi?",
        options: ["LDR (Cahaya)", "DHT11 (Suara)", "Ultrasonik HC-SR04", "Buzzer Piezo"],
        answerIndex: 2
      },
      {
        question: "Komponen mekanik/aktuator yang dapat berputar secara presisi dari sudut 0 derajat hingga 180 derajat disebut...",
        options: ["Motor DC Biasa", "Motor Servo", "Buzzer", "Relay Saklar"],
        answerIndex: 1
      },
      {
        question: "Perintah apa yang digunakan untuk membaca intensitas analog dari sensor cahaya pada Pin A0?",
        options: ["digitalRead(A0)", "analogRead(A0)", "digitalWrite(A0, HIGH)", "analogWrite(A0, 255)"],
        answerIndex: 1
      },
      {
        question: "Semakin terang cahaya yang menyinari sensor LDR, maka resistansi/hambatan LDR akan...",
        options: ["Makin kecil / rendah", "Makin besar / tinggi", "Tetap konstan", "Meledak tiba-tiba"],
        answerIndex: 0
      },
      {
        question: "Bagaimanakah cara mencetak teks/angka pembacaan sensor ke layar laptop lewat Arduino IDE?",
        options: ["Serial.print(nilai)", "digitalWrite(nilai)", "pinMode(nilai)", "loop(nilai)"],
        answerIndex: 0
      }
    ]
  },
  {
    id: "cur-2-3",
    level: 2,
    title: "Robotika Dasar",
    summary: "Konstruksi dasar robot beroda. Merakit chassis akrilik robot beroda, menginstal modul driver motor L298N, baterai Li-ion, serta memprogram robot berjalan maju, mundur, belok kanan/kiri.",
    videoUrl: "",
    pdfUrl: "https://bobotic.id/pdf/robotika-dasar.pdf",
    projects: [
      { id: "p231", title: "Merakit mekanik sasis robot beroda lengkap", isCompleted: false },
      { id: "p232", title: "Program navigasi dasar (Belok kanan, kiri, memutar)", isCompleted: false }
    ],
    quiz: [
      {
        question: "Komponen penting yang berfungsi mengontrol arah putaran maju-mundur motor DC berdaya besar dinamakan...",
        options: ["Buzzer", "L298N H-Bridge Driver Motor", "Sensor Suhu", "Resistor Pull-down"],
        answerIndex: 1
      },
      {
        question: "Baterai isi ulang berkualitas tinggi yang biasa dirangkai seri untuk menyuplai daya robot mobil pintar adalah...",
        options: ["Baterai ABC AA Karbon", "Baterai koin CR2032", "Baterai Li-ion tipe 18650 (3.7V)", "Baterai Aki Mobil 120A"],
        answerIndex: 2
      },
      {
        question: "Jenis robot beroda yang berjalan otomatis mengikuti garis hitam panduan dilantai disebut...",
        options: ["Robot Drone Udara", "Line Follower Robot", "Robot Humanoid", "Robot Lengan Industri"],
        answerIndex: 1
      },
      {
        question: "Roda bantuan di bagian depan robot mobil yang bebas berputar ke segala arah tanpa motor penggerak disebut...",
        options: ["Roda Trail", "Castor Wheel / Omnidirectional", "Gears", "Belt Sumbu"],
        answerIndex: 1
      },
      {
        question: "Komponen elektromagnetik pengatur bunyi suara bip bernada tinggi di rangkaian robot adalah...",
        options: ["LED", "LDR", "Buzzer", "Relay"],
        answerIndex: 2
      }
    ]
  },

  // TRACK 3: IoT & AI Systems (Level 3)
  {
    id: "cur-3-1",
    level: 3,
    title: "Dasar Internet of Things (IoT)",
    summary: "Memulai dunia konektivitas nirkabel. Pengenalan chip ESP32 NodeMCU, konfigurasi WiFi.h library, memprogram ESP32 untuk memindai jaringan Wi-Fi lokal, serta mencetak sinyal RSSI.",
    videoUrl: "",
    pdfUrl: "https://bobotic.id/pdf/dasar-iot.pdf",
    projects: [
      { id: "p311", title: "Scan jaringan Wi-Fi nirkabel aktif sekitar Solo", isCompleted: true },
      { id: "p312", title: "Menghubungkan ESP32 ke Hotspot handphone pribadi", isCompleted: true }
    ],
    quiz: [
      {
        question: "Apa singkatan dari istilah teknologi IoT?",
        options: ["Intranet of Technologies", "Internet of Things", "Integration of Telecoms", "Inverse of Tangent"],
        answerIndex: 1
      },
      {
        question: "Apa perbedaan krusial chip ESP32 jika dibandingkan dengan board Arduino Uno?",
        options: ["ESP32 sudah dilengkapi modul Wi-Fi dan Bluetooth built-in", "ESP32 tidak butuh coding", "ESP32 hanya bisa menyala 5 menit", "ESP32 harganya jauh lebih mahal"],
        answerIndex: 0
      },
      {
        question: "Berapakah batas rekomendasi tegangan kerja aman langsung pada suplai pin masukan ESP32?",
        options: ["1.2 Volt", "3.3 Volt", "12 Volt", "24 Volt"],
        answerIndex: 1
      },
      {
        question: "Library bawaan yang wajib di-include di baris pertama skrip program internet ESP32 adalah...",
        options: ["Servo.h", "LiquidCrystal.h", "WiFi.h", "Wire.h"],
        answerIndex: 2
      },
      {
        question: "Perintah instan apa yang menginstruksikan modul ESP32 meluncurkan pencarian koneksi internet ke router?",
        options: ["WiFi.begin(ssid, password)", "WiFi.status()", "WiFi.disconnect()", "WiFi.localIP()"],
        answerIndex: 0
      }
    ]
  },
  {
    id: "cur-3-2",
    level: 3,
    title: "Cloud dan Komunikasi Data",
    summary: "Integrasi hardware ke Cloud IoT Platform (Blynk / ThingSpeak). Membuat token keamanan, mengirimkan data sensor suhu ke cloud dashboard, serta mengontrol relay saklar AC lewat handphone resmi.",
    videoUrl: "",
    pdfUrl: "https://bobotic.id/pdf/cloud-komunikasi.pdf",
    projects: [
      { id: "p321", title: "Link Blynk BlynkAuth Token ke kode program", isCompleted: false },
      { id: "p322", title: "Kontrol saklar lampu rumah Pintar via Blynk Widget", isCompleted: false }
    ],
    quiz: [
      {
        question: "Kunci keamanan otentikasi unik dari server blynk agar ESP32 dapat tersambung dengan gadget Anda dinamakan...",
        options: ["Wi-Fi Name", "Blynk Auth Token / API Key", "IP Gateway", "Subnet Mask"],
        answerIndex: 1
      },
      {
        question: "Pin simulasi software khusus di Blynk untuk mengirim / menerima selain pin fisik hardware dinamakan...",
        options: ["Analog Pin", "Virtual Pin (V0, V1, etc.)", "Relay Pin", "Serial Pin Tx"],
        answerIndex: 1
      },
      {
        question: "Format penulisan data standar berukuran ringan yang populer untuk pertukaran data mikrokontroler dengan cloud server adalah...",
        options: ["EXE", "XML", "JSON / Key-Value", "TXT"],
        answerIndex: 2
      },
      {
        question: "Apa fungsi dari widget 'Switch / Button' di dalam aplikasi Blynk Dashboard?",
        options: ["Sebagai saklar menyalakan / mematikan pin kontrol jarak jauh", "Sebagai penampil tren grafik", "Sebagai penaksir kelembaban", "Laporan cetak printer"],
        answerIndex: 0
      },
      {
        question: "Fungsi komponen Relay dalam sistem Smart Home IoT adalah...",
        options: ["Menghemat penggunaan kuota Wi-Fi", "Sebagai saklar elektronik mengontrol alat listrik tegangan tinggi AC rumah", "Menghitung debit voltase baterai", "Melindungi ESP32 dari debu"],
        answerIndex: 1
      }
    ]
  },
  {
    id: "cur-3-3",
    level: 3,
    title: "Artificial Intelligence untuk IoT",
    summary: "Memasuki tingkat mahir integrasi kecerdasan buatan lokal (Edge AI). Implementasi modul kamera ESP32-CAM, instalasi model klasifikasi wajah/warna, serta aksi sortir sortir barang otomatis berbasis AI vision.",
    videoUrl: "",
    pdfUrl: "https://bobotic.id/pdf/ai-iot.pdf",
    projects: [
      { id: "p331", title: "Streaming video feed dari modul ESP32-CAM ke web local", isCompleted: false },
      { id: "p332", title: "Model deteksi barang warna merah/hijau tersortir", isCompleted: false }
    ],
    quiz: [
      {
        question: "Modul mikrokontroler ESP32 ekonomis yang sudah dilengkapi slot kamera built-in untuk project AI vision adalah...",
        options: ["Arduino Uno R3", "Nano ESP32", "ESP32-CAM", "Raspberry Pi Zero W"],
        answerIndex: 2
      },
      {
        question: "Apa kepanjangan dari singkatan istilah teknologi AI?",
        options: ["Automatic Interaction", "Artificial Intelligence", "Advanced Integration", "Aura Informatics"],
        answerIndex: 1
      },
      {
        question: "Kemampuan komputer mendeteksi objek, warna, ciri wajah pada video feed dinamakan bidang...",
        options: ["Machine Translation", "Computer Vision / Image Processing", "Acoustics Sound Analysis", "Cloud Database Storage"],
        answerIndex: 1
      },
      {
        question: "Konsep menjalankan kecerdasan buatan (Machine Learning) langsung di perangkat hardware mini lokal tanpa internet dinamakan...",
        options: ["Cloud AI Server", "Edge AI / TinyML", "Deep Web Search", "Supercomputer Cluster"],
        answerIndex: 1
      },
      {
        question: "Framework kecerdasan buatan mini buatan Google yang legendaris untuk mikrokontroler adalah...",
        options: ["TensorFlow Lite for Microcontrollers", "PyTorch Server", "OpenCV Desktop", "Gemini Pro Web API"],
        answerIndex: 0
      }
    ]
  }
];

export const DEFAULT_SCHEDULES: ScheduleEvent[] = [
  {
    id: "sch-1",
    siswaId: "s1",
    siswaName: "Budi Santoso",
    mentorId: "m1",
    mentorName: "Haya Nur Fadhila",
    date: "2026-06-03",
    time: "15:00 - 16:30",
    topic: "Scratch & Tinkercad Blocks - Scratch Dasar",
    address: "Jl. Slamet Riyadi No. 124, Solo",
    status: "Selesai",
    score: 95,
    attendance: "Hadir",
    attendanceNotes: "Budi hadir tepat waktu dan sukses memahami sirkuit virtual. Pemikiran logikanya sangat mantap!",
    masteredTopics: ["Pengenalan panggung Scratch", "Merakit block sequence gerak berurutan", "Custom efek suara"],
    recheckTopics: ["Sinkronisasi ketukan suara dengan frame animasi"],
    notes: "Budi sangat antusias menyusun blok animasi kucing berlari. Pemahaman logikanya di atas rata-rata! Terus asah logika perulangannya di rumah ya.",
    photoUrl: "https://images.unsplash.com/photo-1597839219216-a773cb2473e4?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "sch-2",
    siswaId: "s1",
    siswaName: "Budi Santoso",
    mentorId: "m1",
    mentorName: "Haya Nur Fadhila",
    date: "2026-06-06",
    time: "15:00 - 16:30",
    topic: "Scratch & Tinkercad Blocks - Logika Pemrograman",
    address: "Jl. Slamet Riyadi No. 124, Solo",
    status: "Terkonfirmasi"
  },
  {
    id: "sch-3",
    siswaId: "s1",
    siswaName: "Budi Santoso",
    mentorId: "m1",
    mentorName: "Haya Nur Fadhila",
    date: "2026-06-13",
    time: "15:00 - 16:30",
    topic: "Scratch & Tinkercad Blocks - Tinkercad Circuits",
    address: "Jl. Slamet Riyadi No. 124, Solo",
    status: "Menunggu"
  },
  {
    id: "sch-4",
    siswaId: "s2",
    siswaName: "Ryan Pratama",
    mentorId: "m3",
    mentorName: "Fadhil Rahman",
    date: "2026-06-07",
    time: "10:00 - 11:30",
    topic: "IoT & AI Systems - Cloud dan Komunikasi Data",
    address: "Perum Solo Baru Sektor 2, Sukoharjo",
    status: "Terkonfirmasi"
  }
];

export const DEFAULT_REQUESTS: MentorRequest[] = [
  {
    id: "req-1",
    siswaId: "s1",
    siswaName: "Budi Santoso",
    level: 1,
    location: "Slamet Riyadi, Solo",
    mentorId: "m2",
    requestedSchedule: "Sabtu Sore (15:00)",
    dateCreated: "2026-06-04",
    status: "Menunggu"
  }
];

// Helper to access LocalStorage safely
export function getSavedState() {
  if (typeof window === "undefined") {
    return {
      mentors: DEFAULT_MENTORS,
      students: DEFAULT_STUDENTS,
      schedules: DEFAULT_SCHEDULES,
      requests: DEFAULT_REQUESTS,
      curriculum: DEFAULT_CURRICULUM,
      activeRole: "public" as const,
      loggedUser: null as any
    };
  }

  const mentors = localStorage.getItem("bobotic_mentors")
    ? JSON.parse(localStorage.getItem("bobotic_mentors")!)
    : DEFAULT_MENTORS;

  const students = localStorage.getItem("bobotic_students")
    ? JSON.parse(localStorage.getItem("bobotic_students")!)
    : DEFAULT_STUDENTS;

  const schedules = localStorage.getItem("bobotic_schedules")
    ? JSON.parse(localStorage.getItem("bobotic_schedules")!)
    : DEFAULT_SCHEDULES;

  const requests = localStorage.getItem("bobotic_requests")
    ? JSON.parse(localStorage.getItem("bobotic_requests")!)
    : DEFAULT_REQUESTS;

  const curriculum = localStorage.getItem("bobotic_curriculum")
    ? JSON.parse(localStorage.getItem("bobotic_curriculum")!)
    : DEFAULT_CURRICULUM;

  const activeRole = (localStorage.getItem("bobotic_active_role") || "public") as any;

  const loggedUser = localStorage.getItem("bobotic_logged_user")
    ? JSON.parse(localStorage.getItem("bobotic_logged_user")!)
    : null;

  return { mentors, students, schedules, requests, curriculum, activeRole, loggedUser };
}

export function saveStateToLocal(state: {
  mentors?: MentorProfile[];
  students?: StudentProfile[];
  schedules?: ScheduleEvent[];
  requests?: MentorRequest[];
  curriculum?: CurriculumModule[];
  activeRole?: string;
  loggedUser?: any;
}) {
  if (typeof window === "undefined") return;
  if (state.mentors) localStorage.setItem("bobotic_mentors", JSON.stringify(state.mentors));
  if (state.students) localStorage.setItem("bobotic_students", JSON.stringify(state.students));
  if (state.schedules) localStorage.setItem("bobotic_schedules", JSON.stringify(state.schedules));
  if (state.requests) localStorage.setItem("bobotic_requests", JSON.stringify(state.requests));
  if (state.curriculum) localStorage.setItem("bobotic_curriculum", JSON.stringify(state.curriculum));
  if (state.activeRole) localStorage.setItem("bobotic_active_role", state.activeRole);
  if (state.loggedUser !== undefined) localStorage.setItem("bobotic_logged_user", JSON.stringify(state.loggedUser));
}
