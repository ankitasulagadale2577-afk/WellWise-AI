// ==============================================================================
// WellWise AI — Supabase Client & Complete Database Services (12 Features)
// ==============================================================================

import { createClient } from "@supabase/supabase-js";
import { ARTICLES_DATA, VACCINES_DATA } from "../data/initialData.js";

function cleanSupabaseUrl(rawUrl) {
  if (!rawUrl) return "";
  let clean = rawUrl.trim();
  // Strip trailing slashes and /rest/v1 or /auth/v1 paths if inadvertently pasted
  clean = clean.replace(/\/rest\/v1\/?$/i, "");
  clean = clean.replace(/\/auth\/v1\/?$/i, "");
  clean = clean.replace(/\/+$/, "");
  return clean;
}

const rawEnvUrl = import.meta.env.VITE_SUPABASE_URL;
const envUrl = cleanSupabaseUrl(rawEnvUrl);
const envAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

export const isSupabaseConfigured = Boolean(
  envUrl &&
  envAnonKey &&
  !envUrl.includes("your-project-id") &&
  envUrl.startsWith("https://")
);

const supabaseUrl = isSupabaseConfigured ? envUrl : "https://placeholder-wellwise.supabase.co";
const supabaseAnonKey = isSupabaseConfigured ? envAnonKey : "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Helper for local demo fallback
function getLocalStorage(key, fallback = []) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalStorage(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // ignore
  }
}

// ==============================================================================
// 1. AUTH SERVICES
// ==============================================================================
export const authService = {
  async signUp(email, password, fullName, preferredLanguage = "en") {
    if (!isSupabaseConfigured) {
      const demoUser = {
        id: "demo-user-" + Date.now(),
        email,
        user_metadata: { full_name: fullName, preferred_language: preferredLanguage },
      };
      setLocalStorage("wellwise_demo_session", { user: demoUser });
      return { data: { user: demoUser, session: { user: demoUser } }, error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          preferred_language: preferredLanguage,
        },
      },
    });
    return { data, error };
  },

  async signIn(email, password) {
    if (!isSupabaseConfigured) {
      const demoUser = {
        id: "demo-user-1",
        email,
        user_metadata: { full_name: email.split("@")[0], preferred_language: "en" },
      };
      setLocalStorage("wellwise_demo_session", { user: demoUser });
      return { data: { user: demoUser, session: { user: demoUser } }, error: null };
    }

    return await supabase.auth.signInWithPassword({ email, password });
  },

  async signInWithOAuth(provider) {
    if (!isSupabaseConfigured) {
      const demoUser = {
        id: "demo-oauth-" + provider,
        email: `${provider}.user@wellwise.ai`,
        user_metadata: {
          full_name: `${provider === "google" ? "Google" : "GitHub"} User`,
          preferred_language: "en",
        },
      };
      setLocalStorage("wellwise_demo_session", { user: demoUser });
      return { data: { user: demoUser, session: { user: demoUser } }, error: null };
    }

    return await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  },

  async signOut() {
    localStorage.removeItem("wellwise_demo_session");
    localStorage.removeItem("wellwise_local_session");
    if (!isSupabaseConfigured) {
      return { error: null };
    }
    try {
      return await supabase.auth.signOut();
    } catch {
      return { error: null };
    }
  },

  async resetPassword(email) {
    if (!isSupabaseConfigured) {
      return { data: {}, error: null };
    }
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login?reset=true`,
    });
  },

  async updatePassword(newPassword) {
    if (!isSupabaseConfigured) {
      return { data: {}, error: null };
    }
    return await supabase.auth.updateUser({ password: newPassword });
  },

  async getSession() {
    const localFallback = getLocalStorage("wellwise_local_session", null);
    if (!isSupabaseConfigured) {
      const session = getLocalStorage("wellwise_demo_session", null) || localFallback;
      return { data: { session }, error: null };
    }
    try {
      const res = await supabase.auth.getSession();
      if (res?.data?.session) return res;
      if (localFallback) {
        return { data: { session: localFallback }, error: null };
      }
      return res;
    } catch {
      return { data: { session: localFallback }, error: null };
    }
  },

  onAuthStateChange(callback) {
    if (!isSupabaseConfigured) {
      return {
        data: {
          subscription: { unsubscribe: () => {} },
        },
      };
    }
    return supabase.auth.onAuthStateChange(callback);
  },
};

// ==============================================================================
// 2. PROFILES & PREFERENCES
// ==============================================================================
export const profileService = {
  async getProfile(userId) {
    if (!isSupabaseConfigured || !userId) {
      return {
        data: getLocalStorage("wellwise_user_profile", {
          id: userId || "demo-user-1",
          full_name: "WellWise Member",
          preferred_language: "en",
          phone_number: "+91 98765 43210",
          blood_group: "O+",
          region: "India",
        }),
        error: null,
      };
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;
      return { data, error: null };
    } catch {
      return { data: getLocalStorage("wellwise_user_profile", null), error: null };
    }
  },

  async updateProfile(userId, updates) {
    if (!isSupabaseConfigured || !userId) {
      const current = getLocalStorage("wellwise_user_profile", {});
      const updated = { ...current, ...updates, id: userId, updated_at: new Date().toISOString() };
      setLocalStorage("wellwise_user_profile", updated);
      return { data: updated, error: null };
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })
        .select()
        .single();
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async getPreferences(userId) {
    if (!isSupabaseConfigured || !userId) {
      return {
        data: getLocalStorage("wellwise_user_prefs", {
          compact_cards: false,
          notifications_enabled: true,
          medicine_alerts: true,
          accessibility_mode: false,
        }),
        error: null,
      };
    }

    try {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      return { data: data || { compact_cards: false, notifications_enabled: true }, error: null };
    } catch {
      return { data: getLocalStorage("wellwise_user_prefs", {}), error: null };
    }
  },

  async updatePreferences(userId, prefs) {
    if (!isSupabaseConfigured || !userId) {
      setLocalStorage("wellwise_user_prefs", prefs);
      return { data: prefs, error: null };
    }

    try {
      const { data, error } = await supabase
        .from("user_preferences")
        .upsert({ user_id: userId, ...prefs, updated_at: new Date().toISOString() })
        .select()
        .single();
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },
};

// ==============================================================================
// 3. HEALTH RECORDS VAULT
// ==============================================================================
export const healthRecordService = {
  async getRecords(userId) {
    if (!isSupabaseConfigured || !userId) {
      return {
        data: getLocalStorage("wellwise_health_records", [
          {
            id: "rec-1",
            user_id: userId,
            record_title: "Annual Comprehensive Blood Panel",
            record_type: "Lab Report",
            description: "HbA1c 5.4%, Total Cholesterol 185 mg/dL, Normal liver function.",
            record_date: "2026-02-14",
            metadata: { hba1c: 5.4, cholesterol: 185 },
            file_name: "lipid_panel_2026.pdf",
            created_at: new Date().toISOString(),
          },
          {
            id: "rec-2",
            user_id: userId,
            record_title: "Blood Pressure & Heart Rate Log",
            record_type: "Vitals",
            description: "Resting BP 118/76 mmHg, Pulse 72 bpm. Optimal range.",
            record_date: "2026-03-20",
            metadata: { systolic: 118, diastolic: 76, pulse: 72 },
            created_at: new Date().toISOString(),
          },
        ]),
        error: null,
      };
    }

    try {
      const { data, error } = await supabase
        .from("health_records")
        .select("*")
        .eq("user_id", userId)
        .order("record_date", { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch {
      return { data: getLocalStorage("wellwise_health_records", []), error: null };
    }
  },

  async addRecord(userId, record) {
    const payload = {
      user_id: userId,
      record_title: record.record_title,
      record_type: record.record_type || "Other",
      description: record.description || "",
      record_date: record.record_date || new Date().toISOString().split("T")[0],
      file_path: record.file_path || null,
      file_name: record.file_name || null,
      file_size: record.file_size || null,
      metadata: record.metadata || {},
    };

    if (!isSupabaseConfigured || !userId) {
      const newRec = { ...payload, id: "rec-" + Date.now(), created_at: new Date().toISOString() };
      const current = getLocalStorage("wellwise_health_records", []);
      setLocalStorage("wellwise_health_records", [newRec, ...current]);
      return { data: newRec, error: null };
    }

    try {
      const { data, error } = await supabase
        .from("health_records")
        .insert(payload)
        .select()
        .single();
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async deleteRecord(recordId) {
    if (!isSupabaseConfigured) {
      const filtered = getLocalStorage("wellwise_health_records", []).filter((r) => r.id !== recordId);
      setLocalStorage("wellwise_health_records", filtered);
      return { error: null };
    }

    return await supabase.from("health_records").delete().eq("id", recordId);
  },
};

// ==============================================================================
// 4. MEDICINE REMINDERS
// ==============================================================================
export const medicineService = {
  async getReminders(userId) {
    if (!isSupabaseConfigured || !userId) {
      return {
        data: getLocalStorage("wellwise_medicine_reminders", [
          {
            id: "med-1",
            user_id: userId,
            medicine_name: "Paracetamol 500mg",
            dosage: "1 tablet (500mg)",
            instructions: "Take with water after dinner",
            schedule: "Today • 8:00 PM",
            time_of_day: "20:00",
            start_date: "2026-03-01",
            is_active: true,
            taken_today: false,
          },
        ]),
        error: null,
      };
    }

    try {
      const { data, error } = await supabase
        .from("medicine_reminders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch {
      return { data: getLocalStorage("wellwise_medicine_reminders", []), error: null };
    }
  },

  async addReminder(userId, reminder) {
    const payload = {
      user_id: userId,
      medicine_name: reminder.medicine_name,
      dosage: reminder.dosage,
      instructions: reminder.instructions || "",
      schedule: reminder.schedule || "Daily",
      time_of_day: reminder.time_of_day || "20:00",
      start_date: reminder.start_date || new Date().toISOString().split("T")[0],
      is_active: true,
      taken_today: false,
    };

    if (!isSupabaseConfigured || !userId) {
      const newMed = { ...payload, id: "med-" + Date.now(), created_at: new Date().toISOString() };
      const current = getLocalStorage("wellwise_medicine_reminders", []);
      setLocalStorage("wellwise_medicine_reminders", [newMed, ...current]);
      return { data: newMed, error: null };
    }

    try {
      const { data, error } = await supabase
        .from("medicine_reminders")
        .insert(payload)
        .select()
        .single();
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async toggleTaken(reminderId, takenToday) {
    if (!isSupabaseConfigured) {
      const list = getLocalStorage("wellwise_medicine_reminders", []).map((m) =>
        m.id === reminderId
          ? { ...m, taken_today: takenToday, last_taken_at: takenToday ? new Date().toISOString() : null }
          : m
      );
      setLocalStorage("wellwise_medicine_reminders", list);
      return { error: null };
    }

    return await supabase
      .from("medicine_reminders")
      .update({
        taken_today: takenToday,
        last_taken_at: takenToday ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reminderId);
  },

  async deleteReminder(reminderId) {
    if (!isSupabaseConfigured) {
      const list = getLocalStorage("wellwise_medicine_reminders", []).filter((m) => m.id !== reminderId);
      setLocalStorage("wellwise_medicine_reminders", list);
      return { error: null };
    }

    return await supabase.from("medicine_reminders").delete().eq("id", reminderId);
  },
};

// ==============================================================================
// 5. VACCINATIONS
// ==============================================================================
export const vaccinationService = {
  async getVaccinations(userId) {
    if (!isSupabaseConfigured || !userId) {
      return {
        data: getLocalStorage("wellwise_vaccinations", [
          {
            id: "vac-1",
            user_id: userId,
            recipient_name: "Self",
            vaccine_name: "HPV Vaccine",
            dose: "Dose 2",
            vaccination_date: null,
            next_due_date: "2026-05-12",
            status: "upcoming",
            notes: "Follow-up dose for cervical HPV protection",
          },
        ]),
        error: null,
      };
    }

    try {
      const { data, error } = await supabase
        .from("vaccinations")
        .select("*")
        .eq("user_id", userId)
        .order("next_due_date", { ascending: true });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch {
      return { data: getLocalStorage("wellwise_vaccinations", []), error: null };
    }
  },

  async addVaccination(userId, vaccine) {
    const payload = {
      user_id: userId,
      recipient_name: vaccine.recipient_name || "Self",
      vaccine_name: vaccine.vaccine_name,
      dose: vaccine.dose || "Dose 1",
      vaccination_date: vaccine.vaccination_date || null,
      next_due_date: vaccine.next_due_date || null,
      status: vaccine.status || "upcoming",
      notes: vaccine.notes || "",
    };

    if (!isSupabaseConfigured || !userId) {
      const newVac = { ...payload, id: "vac-" + Date.now(), created_at: new Date().toISOString() };
      const current = getLocalStorage("wellwise_vaccinations", []);
      setLocalStorage("wellwise_vaccinations", [newVac, ...current]);
      return { data: newVac, error: null };
    }

    try {
      const { data, error } = await supabase.from("vaccinations").insert(payload).select().single();
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async updateStatus(vaccineId, status, vaccinationDate = null) {
    if (!isSupabaseConfigured) {
      const list = getLocalStorage("wellwise_vaccinations", []).map((v) =>
        v.id === vaccineId
          ? { ...v, status, vaccination_date: vaccinationDate || v.vaccination_date }
          : v
      );
      setLocalStorage("wellwise_vaccinations", list);
      return { error: null };
    }

    return await supabase
      .from("vaccinations")
      .update({
        status,
        vaccination_date: vaccinationDate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", vaccineId);
  },

  async deleteVaccination(vaccineId) {
    if (!isSupabaseConfigured) {
      const list = getLocalStorage("wellwise_vaccinations", []).filter((v) => v.id !== vaccineId);
      setLocalStorage("wellwise_vaccinations", list);
      return { error: null };
    }

    return await supabase.from("vaccinations").delete().eq("id", vaccineId);
  },
};

// ==============================================================================
// 6. DOCTOR APPOINTMENTS
// ==============================================================================
export const appointmentService = {
  async getAppointments(userId) {
    if (!isSupabaseConfigured || !userId) {
      return {
        data: getLocalStorage("wellwise_appointments", [
          {
            id: "apt-1",
            user_id: userId,
            doctor_name: "Dr. Ananya Sharma",
            specialty: "General Physician",
            clinic_name: "City Wellness Clinic",
            appointment_date: "2026-05-20T16:00:00",
            location: "MG Road, Suite 402",
            notes: "Routine checkup and blood pressure review",
            status: "scheduled",
          },
        ]),
        error: null,
      };
    }

    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", userId)
        .order("appointment_date", { ascending: true });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch {
      return { data: getLocalStorage("wellwise_appointments", []), error: null };
    }
  },

  async addAppointment(userId, apt) {
    const payload = {
      user_id: userId,
      doctor_name: apt.doctor_name,
      specialty: apt.specialty || "General Medicine",
      clinic_name: apt.clinic_name || "",
      appointment_date: apt.appointment_date,
      location: apt.location || "",
      notes: apt.notes || "",
      status: "scheduled",
    };

    if (!isSupabaseConfigured || !userId) {
      const newApt = { ...payload, id: "apt-" + Date.now(), created_at: new Date().toISOString() };
      const current = getLocalStorage("wellwise_appointments", []);
      setLocalStorage("wellwise_appointments", [newApt, ...current]);
      return { data: newApt, error: null };
    }

    try {
      const { data, error } = await supabase.from("appointments").insert(payload).select().single();
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async deleteAppointment(aptId) {
    if (!isSupabaseConfigured) {
      const list = getLocalStorage("wellwise_appointments", []).filter((a) => a.id !== aptId);
      setLocalStorage("wellwise_appointments", list);
      return { error: null };
    }
    return await supabase.from("appointments").delete().eq("id", aptId);
  },
};

// ==============================================================================
// 7. DOCTOR PASSPORT (Voice-to-Doctor Summaries)
// ==============================================================================
export const doctorPassportService = {
  async getPassports(userId) {
    if (!isSupabaseConfigured || !userId) {
      return {
        data: getLocalStorage("wellwise_doctor_passports", [
          {
            id: "pass-1",
            user_id: userId,
            patient_name: "Patient",
            visit_date: "2026-03-15",
            chief_symptoms: "Mild dry cough, slight throat irritation, fatigue",
            duration: "3 days",
            severity: "Mild",
            existing_conditions: "Seasonal allergic rhinitis",
            current_medicines: "Cetirizine 10mg PRN",
            allergies: "Penicillin",
            questions_for_doctor: "Could this be seasonal allergies or an early viral infection?",
            generated_summary:
              "PATIENT VISIT SUMMARY\nDate: 2026-03-15\nChief Symptoms: Mild dry cough, throat irritation for 3 days.\nAllergies: Penicillin.\nKey Questions: Allergy vs viral etiology.",
            created_at: new Date().toISOString(),
          },
        ]),
        error: null,
      };
    }

    try {
      const { data, error } = await supabase
        .from("doctor_passports")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch {
      return { data: getLocalStorage("wellwise_doctor_passports", []), error: null };
    }
  },

  async savePassport(userId, passport) {
    const payload = {
      user_id: userId,
      patient_name: passport.patient_name || "Patient",
      age: passport.age ? parseInt(passport.age, 10) : null,
      visit_date: passport.visit_date || new Date().toISOString().split("T")[0],
      chief_symptoms: passport.chief_symptoms,
      duration: passport.duration || "1 day",
      severity: passport.severity || "Moderate",
      existing_conditions: passport.existing_conditions || "None reported",
      current_medicines: passport.current_medicines || "None",
      allergies: passport.allergies || "None reported",
      questions_for_doctor: passport.questions_for_doctor || "",
      generated_summary: passport.generated_summary,
    };

    if (!isSupabaseConfigured || !userId) {
      const newPass = { ...payload, id: "pass-" + Date.now(), created_at: new Date().toISOString() };
      const current = getLocalStorage("wellwise_doctor_passports", []);
      setLocalStorage("wellwise_doctor_passports", [newPass, ...current]);
      return { data: newPass, error: null };
    }

    try {
      const { data, error } = await supabase.from("doctor_passports").insert(payload).select().single();
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async deletePassport(passportId) {
    if (!isSupabaseConfigured) {
      const list = getLocalStorage("wellwise_doctor_passports", []).filter((p) => p.id !== passportId);
      setLocalStorage("wellwise_doctor_passports", list);
      return { error: null };
    }
    return await supabase.from("doctor_passports").delete().eq("id", passportId);
  },
};

// ==============================================================================
// 8. CHAT CONVERSATIONS & MESSAGES
// ==============================================================================
export const chatDbService = {
  async getConversations(userId) {
    if (!isSupabaseConfigured || !userId) {
      return { data: getLocalStorage("wellwise_conversations", []), error: null };
    }

    try {
      const { data, error } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch {
      return { data: getLocalStorage("wellwise_conversations", []), error: null };
    }
  },

  async createConversation(userId, title, language = "en") {
    if (!isSupabaseConfigured || !userId) {
      const newConv = {
        id: "conv-" + Date.now(),
        user_id: userId,
        title,
        language,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setLocalStorage("wellwise_conversations", [newConv, ...getLocalStorage("wellwise_conversations", [])]);
      return { data: newConv, error: null };
    }

    try {
      const { data, error } = await supabase
        .from("chat_conversations")
        .insert({ user_id: userId, title, language })
        .select()
        .single();
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async getMessages(conversationId) {
    if (!isSupabaseConfigured || !conversationId) {
      const allMsgs = getLocalStorage("wellwise_chat_messages", {});
      return { data: allMsgs[conversationId] || [], error: null };
    }

    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch {
      const allMsgs = getLocalStorage("wellwise_chat_messages", {});
      return { data: allMsgs[conversationId] || [], error: null };
    }
  },

  async addMessage(conversationId, userId, role, content) {
    if (!isSupabaseConfigured || !conversationId) {
      const msg = {
        id: "msg-" + Date.now(),
        conversation_id: conversationId,
        user_id: userId,
        role,
        content,
        created_at: new Date().toISOString(),
      };
      const allMsgs = getLocalStorage("wellwise_chat_messages", {});
      allMsgs[conversationId] = [...(allMsgs[conversationId] || []), msg];
      setLocalStorage("wellwise_chat_messages", allMsgs);
      return { data: msg, error: null };
    }

    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert({ conversation_id: conversationId, user_id: userId, role, content })
        .select()
        .single();

      await supabase
        .from("chat_conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);

      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async deleteConversation(conversationId) {
    if (!isSupabaseConfigured) {
      const list = getLocalStorage("wellwise_conversations", []).filter((c) => c.id !== conversationId);
      setLocalStorage("wellwise_conversations", list);
      return { error: null };
    }
    return await supabase.from("chat_conversations").delete().eq("id", conversationId);
  },
};

// ==============================================================================
// 9. EMERGENCY CONTACTS
// ==============================================================================
export const emergencyContactService = {
  async getContacts(userId) {
    if (!isSupabaseConfigured || !userId) {
      return {
        data: getLocalStorage("wellwise_emergency_contacts", [
          {
            id: "cnt-1",
            user_id: userId,
            name: "Family Doctor / Clinic",
            phone: "+91 98220 12345",
            relationship: "Doctor",
            created_at: new Date().toISOString(),
          },
        ]),
        error: null,
      };
    }

    try {
      const { data, error } = await supabase
        .from("emergency_contacts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch {
      return { data: getLocalStorage("wellwise_emergency_contacts", []), error: null };
    }
  },

  async addContact(userId, { name, phone, relationship }) {
    if (!isSupabaseConfigured || !userId) {
      const contact = {
        id: "cnt-" + Date.now(),
        user_id: userId,
        name,
        phone,
        relationship: relationship || "Family",
        created_at: new Date().toISOString(),
      };
      setLocalStorage("wellwise_emergency_contacts", [contact, ...getLocalStorage("wellwise_emergency_contacts", [])]);
      return { data: contact, error: null };
    }

    try {
      const { data, error } = await supabase
        .from("emergency_contacts")
        .insert({ user_id: userId, name, phone, relationship })
        .select()
        .single();
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async deleteContact(contactId) {
    if (!isSupabaseConfigured) {
      const list = getLocalStorage("wellwise_emergency_contacts", []).filter((c) => c.id !== contactId);
      setLocalStorage("wellwise_emergency_contacts", list);
      return { error: null };
    }
    return await supabase.from("emergency_contacts").delete().eq("id", contactId);
  },
};

// ==============================================================================
// 10. HEALTH ARTICLES & BOOKMARKS
// ==============================================================================
export const articleService = {
  async getArticles() {
    if (!isSupabaseConfigured) {
      return { data: ARTICLES_DATA, error: null };
    }

    try {
      const { data, error } = await supabase
        .from("health_articles")
        .select("*")
        .order("created_at", { ascending: true });

      if (error || !data || data.length === 0) {
        return { data: ARTICLES_DATA, error: null };
      }
      return { data, error: null };
    } catch {
      return { data: ARTICLES_DATA, error: null };
    }
  },

  async getSavedArticleIds(userId) {
    if (!isSupabaseConfigured || !userId) {
      return { data: getLocalStorage("wellwise_saved_articles", []), error: null };
    }

    try {
      const { data, error } = await supabase
        .from("saved_articles")
        .select("article_id")
        .eq("user_id", userId);

      if (error) throw error;
      const ids = data ? data.map((d) => d.article_id) : [];
      return { data: ids, error: null };
    } catch {
      return { data: getLocalStorage("wellwise_saved_articles", []), error: null };
    }
  },

  async toggleSaveArticle(userId, articleId, isSaved) {
    if (!isSupabaseConfigured || !userId) {
      let saved = getLocalStorage("wellwise_saved_articles", []);
      if (isSaved) {
        saved = [...new Set([...saved, articleId])];
      } else {
        saved = saved.filter((id) => id !== articleId);
      }
      setLocalStorage("wellwise_saved_articles", saved);
      return { error: null };
    }

    try {
      if (isSaved) {
        return await supabase.from("saved_articles").insert({ user_id: userId, article_id: articleId });
      } else {
        return await supabase
          .from("saved_articles")
          .delete()
          .eq("user_id", userId)
          .eq("article_id", articleId);
      }
    } catch (err) {
      return { error: err };
    }
  },
};

// ==============================================================================
// 11. NOTIFICATIONS SERVICE
// ==============================================================================
export const notificationService = {
  async getNotifications(userId) {
    if (!isSupabaseConfigured || !userId) {
      return {
        data: getLocalStorage("wellwise_notifications", [
          {
            id: "notif-1",
            user_id: userId,
            notification_type: "reminder",
            title: "Evening Medicine Due",
            message: "Paracetamol 500mg scheduled today at 8:00 PM.",
            link: "/medicine-reminders",
            read_status: false,
            created_at: new Date().toISOString(),
          },
          {
            id: "notif-2",
            user_id: userId,
            notification_type: "system",
            title: "Welcome to WellWise AI",
            message: "Your smart, nature-inspired healthcare workspace is active.",
            link: "/dashboard",
            read_status: true,
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
        ]),
        error: null,
      };
    }

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch {
      return { data: getLocalStorage("wellwise_notifications", []), error: null };
    }
  },

  async markAsRead(notificationId) {
    if (!isSupabaseConfigured) {
      const list = getLocalStorage("wellwise_notifications", []).map((n) =>
        n.id === notificationId ? { ...n, read_status: true } : n
      );
      setLocalStorage("wellwise_notifications", list);
      return { error: null };
    }

    return await supabase
      .from("notifications")
      .update({ read_status: true })
      .eq("id", notificationId);
  },

  async markAllAsRead(userId) {
    if (!isSupabaseConfigured || !userId) {
      const list = getLocalStorage("wellwise_notifications", []).map((n) => ({ ...n, read_status: true }));
      setLocalStorage("wellwise_notifications", list);
      return { error: null };
    }

    return await supabase
      .from("notifications")
      .update({ read_status: true })
      .eq("user_id", userId);
  },

  async addNotification(userId, { type, title, message, link }) {
    const payload = {
      user_id: userId,
      notification_type: type || "system",
      title,
      message,
      link: link || "/dashboard",
      read_status: false,
    };

    if (!isSupabaseConfigured || !userId) {
      const notif = { ...payload, id: "notif-" + Date.now(), created_at: new Date().toISOString() };
      setLocalStorage("wellwise_notifications", [notif, ...getLocalStorage("wellwise_notifications", [])]);
      return { data: notif, error: null };
    }

    try {
      const { data, error } = await supabase.from("notifications").insert(payload).select().single();
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },
};

// ==============================================================================
// 12. GLOBAL SEARCH SERVICE
// Searches across records, medicines, vaccinations, appointments, library & tools
// ==============================================================================
export const searchService = {
  async searchAll(userId, query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results = [];

    // Search Tools / Navigation
    const tools = [
      { title: "AI Health Assistant", path: "/assistant", category: "Tool", snippet: "Ask general health questions in 4 languages" },
      { title: "Voice Assistant", path: "/voice", category: "Tool", snippet: "Speak symptoms and listen to answers hands-free" },
      { title: "Voice-to-Doctor Passport", path: "/doctor-passport", category: "Tool", snippet: "Prepare structured summaries for doctor visits" },
      { title: "Health Record Vault", path: "/health-records", category: "Tool", snippet: "Store blood pressure, vitals, and lab reports" },
      { title: "Medicine Reminders", path: "/medicine-reminders", category: "Tool", snippet: "Track daily prescriptions and schedules" },
      { title: "Vaccination Information", path: "/vaccination", category: "Tool", snippet: "UIP immunization schedules and family tracker" },
      { title: "Nearby Hospitals & Clinics", path: "/hospitals", category: "Tool", snippet: "Interactive OpenStreetMap facilities locator" },
      { title: "Emergency Assistance (112)", path: "/emergency", category: "Tool", snippet: "Rapid call 112, first-aid steps, emergency contacts" },
      { title: "Health Education Library", path: "/library", category: "Tool", snippet: "WHO and MoHFW verified medical articles" },
      { title: "WhatsApp Companion", path: "/whatsapp", category: "Tool", snippet: "Connect WellWise AI on WhatsApp" },
      { title: "Multilingual Support", path: "/multilingual", category: "Tool", snippet: "English, मराठी, हिन्दी, and ಕನ್ನಡ" },
      { title: "Profile & Settings", path: "/profile", category: "Tool", snippet: "Manage account, notifications, and preferences" },
    ];

    tools.forEach((t) => {
      if (t.title.toLowerCase().includes(q) || t.snippet.toLowerCase().includes(q)) {
        results.push({ ...t, type: "Navigation" });
      }
    });

    // Search Health Articles
    const { data: articles } = await articleService.getArticles();
    if (articles) {
      articles.forEach((art) => {
        if (
          art.title.toLowerCase().includes(q) ||
          art.summary.toLowerCase().includes(q) ||
          art.category.toLowerCase().includes(q)
        ) {
          results.push({
            title: art.title,
            snippet: art.summary.slice(0, 90) + "...",
            path: `/library?article=${art.slug}`,
            category: "Article: " + art.category,
            type: "Library",
          });
        }
      });
    }

    // Search User Health Records
    if (userId) {
      const { data: records } = await healthRecordService.getRecords(userId);
      if (records) {
        records.forEach((rec) => {
          if (
            rec.record_title.toLowerCase().includes(q) ||
            rec.record_type.toLowerCase().includes(q) ||
            (rec.description && rec.description.toLowerCase().includes(q))
          ) {
            results.push({
              title: rec.record_title,
              snippet: `${rec.record_type} • ${rec.record_date}`,
              path: "/health-records",
              category: "Health Record",
              type: "Record",
            });
          }
        });
      }

      // Search Medicine Reminders
      const { data: meds } = await medicineService.getReminders(userId);
      if (meds) {
        meds.forEach((m) => {
          if (
            m.medicine_name.toLowerCase().includes(q) ||
            m.dosage.toLowerCase().includes(q) ||
            m.instructions.toLowerCase().includes(q)
          ) {
            results.push({
              title: m.medicine_name,
              snippet: `${m.dosage} • ${m.schedule}`,
              path: "/medicine-reminders",
              category: "Medicine",
              type: "Reminder",
            });
          }
        });
      }
    }

    return results;
  },
};
