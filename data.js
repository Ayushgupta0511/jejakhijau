/**
 * JejakHijau — data.js
 * Emission factor constants (APPROXIMATE ESTIMATES) and demo dataset.
 * No DOM code here. Loaded before app.js.
 *
 * All factors are order-of-magnitude approximations for a student lifestyle
 * prototype. They are NOT official figures and are labeled as estimates in the UI.
 */

/* --- Transport: kg CO2e per typical student trip (one day) --- */
const TRANSPORT = {
  walk:        { kg: 0.00, icon: "🚶", en: "Walk",       bm: "Jalan kaki" },
  bicycle:     { kg: 0.00, icon: "🚲", en: "Bicycle",    bm: "Basikal" },
  motorbike:   { kg: 0.60, icon: "🏍️", en: "Motorbike",  bm: "Motorsikal" },
  bus:         { kg: 0.35, icon: "🚌", en: "Bus",        bm: "Bas" },
  lrt:         { kg: 0.20, icon: "🚆", en: "LRT / MRT",  bm: "LRT / MRT" },
  grab:        { kg: 1.60, icon: "🚗", en: "Grab / Car", bm: "Grab / Kereta" }
};

/* --- Food: kg CO2e per main meal --- */
const FOOD = {
  vegetarian:   { kg: 0.50, icon: "🥗", en: "Vegetarian",        bm: "Vegetarian" },
  chicken_fish: { kg: 1.50, icon: "🍗", en: "Chicken / Fish",    bm: "Ayam / Ikan" },
  beef:         { kg: 4.50, icon: "🥩", en: "Beef",              bm: "Daging" },
  mamak:        { kg: 2.20, icon: "🍛", en: "Mamak / Street",    bm: "Mamak / Jalanan" }
};

/* --- Energy: per hour --- */
const ENERGY = {
  aircondKgPerHour: 0.70, // air-conditioner, kg CO2e per hour
  laptopKgPerHour:  0.05  // laptop, kg CO2e per hour
};

/* Rough daily total for a "typical Malaysian student" — BENCHMARK ESTIMATE. */
const AVG_TARGET_KG = 9.5;

/* Badge definitions: unlocked by a predicate over computed stats. */
const BADGES = [
  { id: "first",   icon: "🌱", en: "First Step",   bm: "Langkah Pertama", test: s => s.daysLogged >= 1 },
  { id: "green",   icon: "🌿", en: "Green Day",    bm: "Hari Hijau",      test: s => s.bestDayKg > 0 && s.bestDayKg <= AVG_TARGET_KG * 0.6 },
  { id: "streak3", icon: "🔥", en: "3-Day Streak", bm: "Streak 3 Hari",   test: s => s.streak >= 3 },
  { id: "week",    icon: "🌳", en: "Full Week",    bm: "Seminggu Penuh",  test: s => s.daysLogged >= 7 },
  { id: "saver",   icon: "🏆", en: "Carbon Saver", bm: "Penjimat Karbon", test: s => s.weekTotalKg > 0 && s.weekTotalKg <= AVG_TARGET_KG * 7 * 0.75 }
];

const CHALLENGE_LENGTH = 7;

/* 14 days of realistic demo data. `day` is an offset from today (0 = today). */
const DEMO_LOGS = [
  { day: 0,  transport: "lrt",       food: "vegetarian",   aircondHours: 2, laptopHours: 5 },
  { day: 1,  transport: "grab",      food: "beef",         aircondHours: 6, laptopHours: 6 },
  { day: 2,  transport: "bus",       food: "chicken_fish", aircondHours: 3, laptopHours: 4 },
  { day: 3,  transport: "bicycle",   food: "vegetarian",   aircondHours: 1, laptopHours: 3 },
  { day: 4,  transport: "motorbike", food: "mamak",        aircondHours: 5, laptopHours: 4 },
  { day: 5,  transport: "lrt",       food: "chicken_fish", aircondHours: 2, laptopHours: 5 },
  { day: 6,  transport: "walk",      food: "vegetarian",   aircondHours: 0, laptopHours: 2 },
  { day: 7,  transport: "grab",      food: "beef",         aircondHours: 7, laptopHours: 7 },
  { day: 8,  transport: "bus",       food: "mamak",        aircondHours: 4, laptopHours: 4 },
  { day: 9,  transport: "lrt",       food: "chicken_fish", aircondHours: 3, laptopHours: 5 },
  { day: 10, transport: "bicycle",   food: "vegetarian",   aircondHours: 1, laptopHours: 3 },
  { day: 11, transport: "motorbike", food: "chicken_fish", aircondHours: 4, laptopHours: 4 },
  { day: 12, transport: "walk",      food: "vegetarian",   aircondHours: 0, laptopHours: 2 },
  { day: 13, transport: "grab",      food: "beef",         aircondHours: 6, laptopHours: 6 }
];

/* Smart swap suggestions: shown when the matching choice is present.
   `when` and `saveKg` both receive the current selection, so the saving is
   computed at call time (never at load time). */
const SWAPS = [
  { when: c => c.transport === "grab",    saveKg: c => TRANSPORT.grab.kg - TRANSPORT.lrt.kg,
    en: "Taking the LRT instead of Grab",  bm: "Naik LRT bukan Grab" },
  { when: c => c.transport === "motorbike" || c.transport === "grab", saveKg: c => TRANSPORT.motorbike.kg - TRANSPORT.bus.kg,
    en: "Taking the bus instead",          bm: "Naik bas pula" },
  { when: c => c.food === "beef",         saveKg: c => FOOD.beef.kg - FOOD.chicken_fish.kg,
    en: "Swapping beef for chicken or fish", bm: "Tukar daging kepada ayam atau ikan" },
  { when: c => c.food === "mamak",        saveKg: c => FOOD.mamak.kg - FOOD.vegetarian.kg,
    en: "Choosing a vegetarian meal",      bm: "Pilih hidangan vegetarian" },
  { when: c => c.aircondHours >= 4,       saveKg: c => (c.aircondHours - 2) * ENERGY.aircondKgPerHour,
    en: "Cutting aircond by 2 hours",      bm: "Kurangkan aircond 2 jam" }
];

/* UI label strings for the two supported languages (main labels only). */
const I18N = {
  en: {
    lang: "BM", themeDark: "Dark", themeLight: "Light",
    heroTitle: "JejakHijau",
    heroPitch: "Track your carbon footprint in 20 seconds a day — and grow a forest.",
    heroSub: "A simple, honest CO2 tracker for Malaysian university students. Everything stays in your browser.",
    start: "Start tracking",
    loggerTitle: "Log today",
    loggerHelp: "Tap one transport and one food, then set your hours. Estimates only.",
    transportLabel: "How did you travel?",
    foodLabel: "Main meal today?",
    energyLabel: "Energy use today",
    aircondLabel: "Aircond",
    laptopLabel: "Laptop",
    hours: "h",
    estimate: "Estimated today",
    kg: "kg CO₂e",
    saveBtn: "Save day",
    updateBtn: "Update day",
    editing: "Editing a saved day",
    cancelEdit: "Cancel edit",
    dashTitle: "Your impact",
    todayLabel: "Today",
    weekLabel: "This week",
    avgLabel: "Student avg",
    streakLabel: "Day streak",
    vsLower: "below the estimated student average",
    vsHigher: "above the estimated student average",
    forestTitle: "Your forest",
    forestLow: "Your week is low-carbon — the forest is thriving.",
    forestHigh: "Your week is high-carbon — the forest is wilting.",
    forestEmpty: "Log a few days to bring your forest to life.",
    suggestTitle: "Smart swaps",
    suggestEmpty: "Log a day to see swap suggestions.",
    save: "saves",
    chartTitle: "Last 7 days",
    chartEmpty: "No data for the last 7 days yet.",
    badgesTitle: "Achievements",
    challengeTitle: "7-Day Low Carbon Challenge",
    challengeStart: "Start challenge",
    challengeActive: "In progress",
    challengeDone: "Challenge complete!",
    challengeReset: "Restart",
    challengeProgress: "days done",
    shareBtn: "Share my forest",
    shareTitle: "JejakHijau — my green forest",
    shareCaption: "My weekly carbon footprint",
    demoBtn: "Load demo data",
    resetBtn: "Reset data",
    resetConfirm: "Delete all your saved days? This cannot be undone.",
    savedDaysTitle: "Saved days",
    emptyTitle: "No logs yet",
    emptyBody: "Start with one day. Tap a transport and a food above, then save.",
    edit: "Edit",
    delete: "Delete",
    estimateNote: "All figures are approximate estimates, not official measurements.",
    today: "Today",
    demoLoaded: "Demo data loaded (14 days).",
    dataCleared: "All data cleared.",
    daySaved: "Day saved.",
    dayUpdated: "Day updated.",
    dayDeleted: "Day deleted.",
    savedOn: "Saved"
  },
  bm: {
    lang: "EN", themeDark: "Gelap", themeLight: "Cerah",
    heroTitle: "JejakHijau",
    heroPitch: "Jejak karbon anda dalam 20 saat sehari — dan tanam hutan.",
    heroSub: "Penjejak CO₂ yang mudah dan jujur untuk pelajar universiti Malaysia. Semua data kekal dalam pelayar anda.",
    start: "Mula jejak",
    loggerTitle: "Log hari ini",
    loggerHelp: "Pilih satu pengangkutan dan satu makanan, kemudian tetapkan jam. Anggaran sahaja.",
    transportLabel: "Bagaimana anda bergerak?",
    foodLabel: "Makanan utama hari ini?",
    energyLabel: "Penggunaan tenaga hari ini",
    aircondLabel: "Aircond",
    laptopLabel: "Laptop",
    hours: "j",
    estimate: "Anggaran hari ini",
    kg: "kg CO₂e",
    saveBtn: "Simpan hari",
    updateBtn: "Kemas kini",
    editing: "Sedang mengedit hari disimpan",
    cancelEdit: "Batal edit",
    dashTitle: "Impak anda",
    todayLabel: "Hari ini",
    weekLabel: "Minggu ini",
    avgLabel: "Purata pelajar",
    streakLabel: "Streak hari",
    vsLower: "di bawah anggaran purata pelajar",
    vsHigher: "di atas anggaran purata pelajar",
    forestTitle: "Hutan anda",
    forestLow: "Minggu anda rendah karbon — hutan semakin subur.",
    forestHigh: "Minggu anda tinggi karbon — hutan semakin layu.",
    forestEmpty: "Log beberapa hari untuk hidupkan hutan anda.",
    suggestTitle: "Cadangan pintar",
    suggestEmpty: "Log satu hari untuk lihat cadangan.",
    save: "menjimatkan",
    chartTitle: "7 hari lepas",
    chartEmpty: "Belum ada data untuk 7 hari lepas.",
    badgesTitle: "Pencapaian",
    challengeTitle: "Cabaran Rendah Karbon 7 Hari",
    challengeStart: "Mula cabaran",
    challengeActive: "Sedang berjalan",
    challengeDone: "Cabaran selesai!",
    challengeReset: "Mula semula",
    challengeProgress: "hari selesai",
    shareBtn: "Kongsi hutan saya",
    shareTitle: "JejakHijau — hutan hijau saya",
    shareCaption: "Jejak karbon mingguan saya",
    demoBtn: "Muat data demo",
    resetBtn: "Padam data",
    resetConfirm: "Padam semua hari yang disimpan? Tindakan ini tidak boleh dibatalkan.",
    savedDaysTitle: "Hari disimpan",
    emptyTitle: "Belum ada log",
    emptyBody: "Mula dengan satu hari. Pilih pengangkutan dan makanan di atas, kemudian simpan.",
    edit: "Edit",
    delete: "Padam",
    estimateNote: "Semua angka adalah anggaran, bukan ukuran rasmi.",
    today: "Hari ini",
    demoLoaded: "Data demo dimuat (14 hari).",
    dataCleared: "Semua data dipadam.",
    daySaved: "Hari disimpan.",
    dayUpdated: "Hari dikemas kini.",
    dayDeleted: "Hari dipadam.",
    savedOn: "Disimpan"
  }
};

if (typeof window !== "undefined") {
  window.JH_DATA = { TRANSPORT, FOOD, ENERGY, AVG_TARGET_KG, BADGES, CHALLENGE_LENGTH, DEMO_LOGS, SWAPS, I18N };
}