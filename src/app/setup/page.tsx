"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, MapPin, Sprout, Search, Check, ChevronRight, ChevronLeft, 
  Activity, Landmark, ShieldCheck, HelpCircle, Camera, Image as ImageIcon, X
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { pushUserDetails } from "@/utils/supabase/profile";


export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    // Step 1: Basic
    name: "",
    state: "",
    district: "",
    village: "",
    ageGroup: "",
    profileImage: "",
    // Step 2: Farm
    landArea: "",
    landUnit: "acres",
    landStatus: "",
    crops: [] as string[],
    seasons: [] as string[],
    irrigation: "",
    // Step 3: Monitoring
    monitoringTools: [] as string[],
    soilHealth: "",
    pestManagement: "",
    machinery: [] as string[],
    lastYield: "",
    // Step 4: Preferences & Schemes
    challenges: [] as string[],
    alerts: { weather: true, price: true, pest: true, schemes: true },
    pastSchemes: [] as string[],
    supportInterests: [] as string[]
  });

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    else handleComplete();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      console.log('[Setup] Auth user:', user?.id ?? 'null');
      if (authError) console.error('[Setup] Auth error:', authError);

      if (!user) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      // Build the local storage data structure (matches what dashboard reads)
      const localData = {
        name: formData.name,
        village: formData.village,
        state: formData.state,
        district: formData.district,
        ageGroup: formData.ageGroup,
        landArea: formData.landArea,
        landUnit: formData.landUnit,
        landStatus: formData.landStatus,
        crops: formData.crops,
        seasons: formData.seasons,
        irrigation: formData.irrigation,
        monitoringTools: formData.monitoringTools,
        soilHealth: formData.soilHealth,
        pestManagement: formData.pestManagement,
        machinery: formData.machinery,
        lastYield: formData.lastYield,
        challenges: formData.challenges,
        alerts: formData.alerts,
        pastSchemes: formData.pastSchemes,
        supportInterests: formData.supportInterests,
        profileImage: formData.profileImage,
      };

      // Save locally first for instant dashboard load
      localStorage.setItem("krishidhara_user", JSON.stringify(localData));
      // Clear any legacy demo mode flags
      localStorage.removeItem("krishidhara_demo_mode");

      // Sync to Supabase database
      console.log('[Setup] User authenticated — syncing to Supabase via server API...');

      const profilePayload = {
        full_name: formData.name,
        state: formData.state,
        district: formData.district,
        village: formData.village,
        age_group: formData.ageGroup,
        farm_details: {
          profileImage: formData.profileImage,
          landArea: formData.landArea,
          landUnit: formData.landUnit,
          landStatus: formData.landStatus,
          crops: formData.crops,
          seasons: formData.seasons,
          irrigation: formData.irrigation,
          monitoringTools: formData.monitoringTools,
          soilHealth: formData.soilHealth,
          pestManagement: formData.pestManagement,
          machinery: formData.machinery,
          lastYield: formData.lastYield,
          challenges: formData.challenges,
          alerts: formData.alerts,
          pastSchemes: formData.pastSchemes,
          supportInterests: formData.supportInterests,
        }
      };

      try {
        // Primary: server-side API route (correctly reads auth cookies)
        const res = await fetch('/api/save-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profilePayload),
        });
        const result = await res.json();

        if (!res.ok) {
          console.warn('[Setup] API route failed, trying client-side fallback:', result);
          await pushUserDetails(user.id, profilePayload);
        } else {
          console.log('[Setup] Profile synced via API ✅', result);
        }
        toast.success("Namaste! Your profile is ready and synced to cloud. ✅");
      } catch (syncErr) {
        console.error('[Setup] Cloud sync failed:', syncErr);
        toast.warning("Profile saved locally. Cloud sync failed — check browser console.");
      }

      router.push("/");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMultiSelect = (key: keyof typeof formData, value: string) => {
    const current = formData[key] as string[];
    if (Array.isArray(current)) {
      if (current.includes(value)) {
        setFormData({ ...formData, [key]: current.filter(v => v !== value) });
      } else {
        setFormData({ ...formData, [key]: [...current, value] });
      }
    }
  };

  const states = ["Punjab", "Maharashtra", "Uttar Pradesh", "Madhya Pradesh", "Karnataka", "Bihar", "Rajasthan"];
  const cropsList = ["Wheat", "Rice", "Maize", "Cotton", "Sugarcane", "Pulses", "Vegetables", "Fruits", "Millets"];
  const seasonsList = ["Kharif", "Rabi", "Zaid", "Perennial"];
  const challengesList = ["Weather uncertainty", "Market price fluctuations", "Pest attacks", "Water scarcity", "Input costs", "Labor shortage", "Access to credit/schemes"];
  const schemesList = ["PM-KISAN", "PMFBY (Insurance)", "Soil Health Card", "KCC (Loan)", "PMKSY (Irrigation)", "None"];
  const supportList = ["Income support", "Crop insurance", "Subsidies", "Irrigation support", "Credit/loans", "Training"];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--beige)" }}>
      {/* Progress Header */}
      <div
        className="px-5 pt-12 pb-5 sticky top-0 z-10"
        style={{
          background: "linear-gradient(160deg, #1B5E20 0%, #2E7D32 100%)",
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-green-200 text-xs font-semibold uppercase tracking-wider mb-0.5">Setup Step {step}/{totalSteps}</p>
            <h2 className="text-white text-xl font-extrabold">
              {step === 1 && "Basic Info 👤"}
              {step === 2 && "Farm Details 🌾"}
              {step === 3 && "Monitoring 📊"}
              {step === 4 && "Preferences ⚙️"}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg"
            style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
            {step}/{totalSteps}
          </div>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
          <motion.div
            initial={{ width: "25%" }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            className="h-full rounded-full"
            style={{ background: "var(--yellow-accent)" }}
          />
        </div>
      </div>

      <div className="flex-1 p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative w-24 h-24 bg-slate-200 rounded-full overflow-hidden mb-2 border-4 border-white shadow-sm flex items-center justify-center">
                    <User size={48} className="text-slate-400" />
                    <div className="absolute bottom-0 right-0 left-0 bg-black/30 text-white p-1 flex justify-center">
                      <Camera size={14} />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Add Photo</p>
                </div>

                <div className="bg-primary-green-light/30 p-4 rounded-2xl border border-primary-green/10">
                  <p className="text-primary-green-dark font-medium text-sm text-center">
                    Namaste! Let's personalize KrishiDhara for your farm.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">State</label>
                    <select 
                      className="input-field appearance-none"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                    >
                      <option value="">Select State</option>
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">District</label>
                    <input 
                      type="text" 
                      placeholder="Search District" 
                      className="input-field"
                      value={formData.district}
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Village / Block</label>
                  <input 
                    type="text" 
                    placeholder="Enter your village" 
                    className="input-field"
                    value={formData.village}
                    onChange={(e) => setFormData({...formData, village: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Age Group (Optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {["<30", "30-45", "45-60", ">60"].map(age => (
                      <button
                        key={age}
                        type="button"
                        onClick={() => setFormData({...formData, ageGroup: age})}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                          formData.ageGroup === age 
                          ? "bg-primary-green text-white border-primary-green" 
                          : "bg-white text-slate-600 border-slate-200"
                        }`}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Farm Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Land Area</label>
                    <input 
                      type="number" 
                      placeholder="Total area" 
                      className="input-field"
                      value={formData.landArea}
                      onChange={(e) => setFormData({...formData, landArea: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Unit</label>
                    <select 
                      className="input-field"
                      value={formData.landUnit}
                      onChange={(e) => setFormData({...formData, landUnit: e.target.value})}
                    >
                      <option value="acres">Acres</option>
                      <option value="bigha">Bigha</option>
                      <option value="hectares">Hectares</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Land Ownership</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Own", "Lease", "Both"].map(status => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setFormData({...formData, landStatus: status})}
                        className={`py-3 rounded-xl text-sm font-semibold border ${
                          formData.landStatus === status 
                          ? "bg-primary-green text-white border-primary-green" 
                          : "bg-white text-slate-600 border-slate-200"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Crops You Grow (Multi-select)</label>
                  <div className="flex flex-wrap gap-2">
                    {cropsList.map(crop => (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => toggleMultiSelect("crops", crop)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                          formData.crops.includes(crop) 
                          ? "bg-primary-green text-white border-primary-green" 
                          : "bg-white text-slate-600 border-slate-200"
                        }`}
                      >
                        {crop}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Cropping Seasons</label>
                  <div className="grid grid-cols-2 gap-2">
                    {seasonsList.map(season => (
                      <button
                        key={season}
                        type="button"
                        onClick={() => toggleMultiSelect("seasons", season)}
                        className={`py-3 rounded-xl text-sm font-semibold border ${
                          formData.seasons.includes(season) 
                          ? "bg-soil-brown text-white border-soil-brown" 
                          : "bg-white text-slate-600 border-slate-200"
                        }`}
                      >
                        {season}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Irrigation Method</label>
                  <select 
                    className="input-field"
                    value={formData.irrigation}
                    onChange={(e) => setFormData({...formData, irrigation: e.target.value})}
                  >
                    <option value="">Select Method</option>
                    <option value="Canal">Canal</option>
                    <option value="Tubewell">Tubewell</option>
                    <option value="Drip">Drip</option>
                    <option value="Sprinkler">Sprinkler</option>
                    <option value="Rainfed">Rainfed</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Monitoring & Practices */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tools / Apps Used</label>
                  <div className="flex flex-wrap gap-2">
                    {["WhatsApp", "Weather Apps", "Soil Testing", "Drones", "None"].map(tool => (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => toggleMultiSelect("monitoringTools", tool)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
                          formData.monitoringTools.includes(tool) 
                          ? "bg-blue-600 text-white border-blue-600" 
                          : "bg-white text-slate-600 border-slate-200"
                        }`}
                      >
                        {tool}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Soil Health Check Method</label>
                  <select 
                    className="input-field"
                    value={formData.soilHealth}
                    onChange={(e) => setFormData({...formData, soilHealth: e.target.value})}
                  >
                    <option value="">Select Method</option>
                    <option value="Lab testing">Lab testing</option>
                    <option value="Visual observation">Visual observation</option>
                    <option value="Never tested">Never tested</option>
                    <option value="Govt card">Govt Soil Health Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Pest Management Preference</label>
                  <div className="space-y-2">
                    {["Chemical", "Organic/Biological", "Integrated (IPM)", "Traditional"].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFormData({...formData, pestManagement: p})}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold border ${
                          formData.pestManagement === p 
                          ? "bg-amber-100 text-amber-800 border-amber-300" 
                          : "bg-white text-slate-600 border-slate-200"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Last Season Yield (per acre)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g. 20 quintals" 
                      className="input-field"
                      value={formData.lastYield}
                      onChange={(e) => setFormData({...formData, lastYield: e.target.value})}
                    />
                    <Sprout size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Preferences & Goals */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Biggest Challenges Faced</label>
                  <div className="flex flex-wrap gap-2">
                    {challengesList.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleMultiSelect("challenges", c)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
                          formData.challenges.includes(c) 
                          ? "bg-red-500 text-white border-red-500" 
                          : "bg-white text-slate-600 border-slate-200"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">Scheme History & Interests</label>
                  
                  <div>
                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">Have you used these schemes?</p>
                    <div className="flex flex-wrap gap-2">
                      {schemesList.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleMultiSelect("pastSchemes", s)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
                            formData.pastSchemes.includes(s) 
                            ? "bg-accent-saffron text-white border-accent-saffron" 
                            : "bg-white text-slate-600 border-slate-200"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">Support interested in?</p>
                    <div className="flex flex-wrap gap-2">
                      {supportList.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleMultiSelect("supportInterests", s)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
                            formData.supportInterests.includes(s) 
                            ? "bg-accent-gold text-white border-accent-gold" 
                            : "bg-white text-slate-600 border-slate-200"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-sm font-bold text-slate-700 mb-3">Alert Preferences</p>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(formData.alerts).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={val} 
                          onChange={(e) => setFormData({...formData, alerts: {...formData.alerts, [key]: e.target.checked}})}
                          className="w-5 h-5 accent-primary-green"
                        />
                        <span className="text-sm capitalize text-slate-600 font-medium">{key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="p-5 flex gap-3"
        style={{ background: "white", borderTop: "1px solid var(--border)" }}>
        {step > 1 && (
          <button
            onClick={prevStep}
            className="flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
            style={{ background: "var(--beige)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
          >
            <ChevronLeft size={18} /> Back
          </button>
        )}
        <button
          onClick={nextStep}
          disabled={loading}
          className="flex-[2] py-4 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #2E7D32, #388E3C)", boxShadow: "0 6px 20px rgba(46,125,50,0.3)" }}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {step === totalSteps ? "✅ Finish Setup" : "Continue"} <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
