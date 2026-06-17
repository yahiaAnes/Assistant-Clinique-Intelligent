import React, { useState } from "react";
import { CompleteExamState } from "./types";
import { INITIAL_EXAM_STATE, EXAM_STEPS, ClinicalStep } from "./data/clinicalData";
import PatientInfoStep from "./components/PatientInfoStep";
import ThyroidStep from "./components/ThyroidStep";
import FootStep from "./components/FootStep";
import ReportViewer from "./components/ReportViewer";
import { 
  HeartPulse, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ClipboardCheck, 
  Footprints, 
  Stethoscope, 
  User, 
  HelpCircle,
  FileText,
  BadgeAlert,
  GraduationCap
} from "lucide-react";

export default function App() {
  const [state, setState] = useState<CompleteExamState>(INITIAL_EXAM_STATE);
  const [currentStepId, setCurrentStepId] = useState<string>("patient");
  const [report, setReport] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isBackup, setIsBackup] = useState<boolean>(false);

  // Find index of current step
  const currentStepIndex = EXAM_STEPS.findIndex(s => s.id === currentStepId);
  const currentStep = EXAM_STEPS[currentStepIndex] || EXAM_STEPS[0];

  // Quick State updaters
  const updatePatient = (updated: Partial<CompleteExamState["patient"]>) => {
    setState(prev => ({
      ...prev,
      patient: { ...prev.patient, ...updated }
    }));
  };

  const updateThyroid = (updated: Partial<CompleteExamState["thyroid"]>) => {
    setState(prev => ({
      ...prev,
      thyroid: { ...prev.thyroid, ...updated }
    }));
  };

  const updateFoot = (updated: Partial<CompleteExamState["foot"]>) => {
    setState(prev => ({
      ...prev,
      foot: { ...prev.foot, ...updated }
    }));
  };

  const handleNext = () => {
    if (currentStepIndex < EXAM_STEPS.length - 1) {
      setCurrentStepId(EXAM_STEPS[currentStepIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepId(EXAM_STEPS[currentStepIndex - 1].id);
    }
  };

  // Automated anomaly counters to display warning indicators
  const getThyroidAnomaliesCount = () => {
    let count = 0;
    // Hyper signs
    count += Object.values(state.thyroid.hyper).filter(Boolean).length;
    // Hypo signs
    count += Object.values(state.thyroid.hypo).filter(Boolean).length;
    // Inspection anomalies
    if (state.thyroid.inspection.goitre === "Présent") count++;
    if (state.thyroid.inspection.redness) count++;
    if (state.thyroid.inspection.lidInfiltration) count++;
    if (state.thyroid.inspection.exophthalmos) count++;
    if (state.thyroid.inspection.cushingoidAspect) count++;
    // Palpation
    if (state.thyroid.palpation.swallowing === "Difficile") count++;
    if (state.thyroid.palpation.thyroidPalpation === "Goitre") count++;
    if (state.thyroid.palpation.adenopathie === "Présentes") count++;
    // Auscultation
    if (state.thyroid.auscultation.souffle) count++;
    return count;
  };

  const getFootAnomaliesCount = () => {
    let count = 0;
    // Neuro functional symptoms
    count += Object.values(state.foot.neuro).filter(Boolean).length;
    // Vascular functional symptoms
    if (state.foot.art.claudication) count++;
    // Inspection skin signs
    count += Object.values(state.foot.inspection).filter(Boolean).length;
    // Palpation
    if (state.foot.palpation.godetSign === "Positif") count++;
    if (state.foot.palpation.pedalPulse !== "Présent") count++;
    if (state.foot.palpation.tibialPulse !== "Présent") count++;
    if (state.foot.palpation.thermalGradient === "Diminué") count++;
    // Sensibility
    if (state.foot.sensibility.tactile === "Altérée") count++;
    if (state.foot.sensibility.algesic === "Altérée") count++;
    if (state.foot.sensibility.thermal === "Altérée") count++;
    if (state.foot.sensibility.proprioceptive === "Altérée") count++;
    // Reflexes
    if (state.foot.reflexes.achilleanReflex !== "Présent") count++;
    if (state.foot.reflexes.motorFunction !== "Normale") count++;
    return count;
  };

  const tAnomalies = getThyroidAnomaliesCount();
  const fAnomalies = getFootAnomaliesCount();

  // Call the server API to generate the medical chart via Gemini
  const generateObservationReport = async () => {
    setIsGenerating(true);
    setReport("");
    setCurrentStepId("report"); // Switch view to reports page

    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
      });

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      const data = await response.json();
      setReport(data.report || "Erreur de génération du rapport");
      setIsBackup(!!data.isBackup);
    } catch (err) {
      console.error("Failed to generate report over server. Using client local templates.", err);
      // Fallback local generator can be executed immediately on client
      alert("La connexion au serveur d'intelligence artificielle a pris du retard. Génération de la fiche d'observation locale de secours.");
      
      // Let's call the backup function directly on server / API model locally:
      // Actually we compiled a highly standard backup inside server.ts, let's invoke a local render backup!
      // To be extremely clean, we will render locally:
      const localReport = getLocalBackupReport(state);
      setReport(localReport);
      setIsBackup(true);
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper local backup generator if client isolated
  const getLocalBackupReport = (s: CompleteExamState) => {
    const listHyper = Object.entries(s.thyroid.hyper).filter(([_, v]) => v).map(([k]) => k).join(", ") || "Aucun";
    const listHypo = Object.entries(s.thyroid.hypo).filter(([_, v]) => v).map(([k]) => k).join(", ") || "Aucun";
    const listNeuro = Object.entries(s.foot.neuro).filter(([_, v]) => v).map(([k]) => k).join(", ") || "Aucun";

    return `# 🗂️ FICHE D'OBSERVATION CLINIQUE (SECOURS LOCAL)

## 1. Informations Patient & Antécédents
* **Nom/Identifiant** : ${s.patient.name || "Anonyme"}
* **Âge** : ${s.patient.age || "Non indiqué"} ans  |  **Sexe** : ${s.patient.gender || "Non précisé"}
* **Date de consultation** : ${s.patient.date}
* **Antécédents Personnels** : ${s.patient.personalHistory || "Aucun notable"}
* **Antécédents Familiaux** : ${s.patient.familyHistory || "Aucun notable"}
* **Traitement en Cours** : ${s.patient.currentTreatment || "Aucun"}

---

## 2. Examen Clinique de la Glande Thyroïde

- **Interrogatoire (Anamnèse)** :
  * Signes d'hyperthyroïdie : ${listHyper}
  * Signes d'hypothyroïdie : ${listHypo}
  * Antécédents familiaux thyroïdiens : ${s.thyroid.familyHist}
  * Traitement thyroïdien préexistant : ${s.thyroid.treatment}

- **Inspection Cervicale** :
  * Goitre : ${s.thyroid.inspection.goitre}
  * Infiltration des paupières : ${s.thyroid.inspection.lidInfiltration ? "OUI" : "NON"}
  * Exophtalmie : ${s.thyroid.inspection.exophthalmos ? "OUI" : "NON"}
  * Aspect cushingoïde : ${s.thyroid.inspection.cushingoidAspect ? "OUI" : "NON"}

- **Palpation Cervicale** :
  * Technique : ${s.thyroid.palpation.technique}
  * Mobilité déglutition : ${s.thyroid.palpation.swallowing}
  * Parenchyme : ${s.thyroid.palpation.thyroidPalpation}
  * Adénopathies associées : ${s.thyroid.palpation.adenopathie}

- **Auscultation** :
  * Souffle thyroïdien : ${s.thyroid.auscultation.souffle ? "OUI (Basedow suspecté)" : "NON"}

---

## 3. Examen Clinique du Pied Diabétique

- **Interrogatoire podologique** :
  * Symptômes neuropathiques : ${listNeuro}
  * Claudication intermittente (artériopathie) : ${s.foot.art.claudication ? "OUI" : "NON"}
  * Douleurs articulaires mécaniques : ${s.foot.art.jointPain ? "OUI" : "NON"}

- **Inspection du pied** :
  * Peau dépilée : ${s.foot.inspection.hairlessSkin ? "OUI (Signe ischémique)" : "NON"}
  * Hyperkératose / durillons plantaires : ${s.foot.inspection.hyperkeratosis ? "OUI (Risque de mal perforant)" : "NON"}
  * Intertrigo interdigital : ${s.foot.inspection.intertrigo ? "OUI (Porte d'entrée infectieuse)" : "NON"}
  * Dysmorphie / Déformations : ${s.foot.inspection.dysmorphia ? "OUI" : "NON"}

- **Palpation vasculaire et cutanée** :
  * Signe du godet (Œdème) : ${s.foot.palpation.godetSign}
  * Pouls pédieux : ${s.foot.palpation.pedalPulse}
  * Pouls tibial postérieur : ${s.foot.palpation.tibialPulse}
  * Gradient thermique : ${s.foot.palpation.thermalGradient === "Normal" ? "Physiologique" : "Diminué (Pied froid distal)"}

- **Examen de la Sensibilité** :
  * Sensibilité Tactile (Monofilament) : ${s.foot.sensibility.tactile}
  * Sensibilité thermo-algésique : Douleur (${s.foot.sensibility.algesic}) | Thermique (${s.foot.sensibility.thermal})
  * Sensibilité proprioceptive : ${s.foot.sensibility.proprioceptive}

- **Réflexes & Motricité** :
  * Réflexe achilléen : ${s.foot.reflexes.achilleanReflex}
  * Force motrice : ${s.foot.reflexes.motorFunction}

---

## 4. Synthèse Clinique & Diagnostics Évoqués

* **Évaluation thyroïdienne** : ${s.thyroid.inspection.goitre === "Présent" || s.thyroid.palpation.thyroidPalpation === "Goitre" ? "Goitre thyroïdien." : "Parenchyme préservé."} ${s.thyroid.treatment === "Lévothyrox" ? "Hypothyroïdie substituée sous Lévothyrox." : ""}
* **Évaluation podologique au vu du diabète** : ${s.foot.sensibility.tactile === "Altérée" ? "Pied neuropathique avec hypoesthésie au monofilament." : "Sensibilité protectrice conservée."} ${s.foot.palpation.pedalPulse === "Absent" ? "Ischémie périphérique / Suspicion AOMI." : ""}

---

## 5. Conseils au Patient (Éducation Thérapeutique ETP)
- **Surveillance journalière** des pieds (dessous du pied et espaces inter-digitaux à l'aide d'un miroir).
- **Proscrire les bains de pieds prolongés** et proscrire absolument de marcher pieds nus à l'intérieur ou à l'extérieur.
- **Hygiène podologique méticuleuse** : séchage minutieux par tamponnement entre les orteils pour prévenir l'intertrigo.
- **Éviter tout instrument coupant** ou abrasif chimique agressif pour décharger la corne péripulsée.
`;
  };

  // Convert step progress out of total steps
  const progressPercent = Math.round(((currentStepIndex) / (EXAM_STEPS.length - 1)) * 100);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-blue-50 to-emerald-50 text-slate-800 flex flex-col antialiased relative overflow-x-hidden">
      
      {/* Decorative glass elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/25 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200/25 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* 1. TOP MEDICAL NAV WORKSTATION */}
      <header className="bg-white/40 backdrop-blur-xl border-b border-white/25 sticky top-0 z-40 px-4 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20">
              <HeartPulse className="h-6 w-6 pulsate-mild" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-md md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
                  Assistant Clinique Intelligent
                </h1>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  <span>Module Étudiant</span>
                </span>
              </div>
              <p className="text-[10px] md:text-xs text-slate-500 font-sans">
                Examen de la Thyroïde & du Pied Diabétique • CHU Algérie / France
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* Quick overview of anomalous indicators */}
            <div className="flex items-center gap-2 text-[11px] font-sans">
              <span className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-colors backdrop-blur-md ${
                tAnomalies > 0 ? "bg-rose-100/40 border-rose-200/50 text-rose-800" : "bg-white/30 border-white/40 text-slate-650"
              }`}>
                <Stethoscope className="h-3.5 w-3.5" />
                <span>Thyroïde : <strong>{tAnomalies}</strong></span>
              </span>
              <span className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-colors backdrop-blur-md ${
                fAnomalies > 0 ? "bg-amber-105/40 border-amber-200/50 text-amber-800" : "bg-white/30 border-white/40 text-slate-650"
              }`}>
                <Footprints className="h-3.5 w-3.5" />
                <span>Pied : <strong>{fAnomalies}</strong></span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. PROGRESS ROADMAP TOPBAR */}
      <section className="bg-white/30 backdrop-blur-xl border-b border-white/20 px-4 py-2.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="text-slate-505 font-medium shrink-0">Progression globale :</div>
          <div className="flex-1 bg-white/50 h-2 rounded-full overflow-hidden relative border border-white/20">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-350"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-slate-805 font-mono font-bold shrink-0">{progressPercent}%</div>
        </div>
      </section>

      {/* 3. CORE TWO-COLUMN MAIN WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN: INTERACTIVE CLINICAL TIMELINE */}
        <nav className="lg:col-span-1 space-y-3 print:hidden">
          <div className="bg-white/35 backdrop-blur-xl border border-white/50 rounded-2xl p-4 space-y-3 shadow-lg">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex justify-between">
              <span>Feuille de Route</span>
              <span>خريطة الفحص</span>
            </h3>

            <div className="space-y-1.5 pt-1">
              {EXAM_STEPS.map((step, idx) => {
                const isActive = step.id === currentStepId;
                const isCompleted = idx < currentStepIndex;
                let badgeColor = "bg-white/60 border border-white/70 text-slate-500";
                
                if (isActive) badgeColor = "bg-blue-600 text-white shadow-md";
                else if (isCompleted) badgeColor = "bg-blue-100 text-blue-700 border border-blue-200/50";

                return (
                  <button
                    key={step.id}
                    id={`sidebar-step-${step.id}`}
                    onClick={() => setCurrentStepId(step.id)}
                    className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center gap-2.5 border ${
                      isActive 
                        ? "border-blue-500/50 bg-white/60 text-slate-900 font-bold shadow-sm"
                        : "border-transparent bg-transparent hover:bg-white/40 text-slate-600"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${badgeColor}`}>
                      {idx + 1}
                    </span>
                    <div className="truncate flex-1">
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-[9px] text-slate-400 font-sans truncate">{step.titleAr}</p>
                    </div>
                  </button>
                );
              })}

              <hr className="border-t border-white/30 my-2" />

              {/* View Report Navigation Item */}
              <button
                id="sidebar-step-report"
                onClick={() => setCurrentStepId("report")}
                className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center gap-2.5 border ${
                  currentStepId === "report"
                    ? "border-emerald-500/50 bg-white/60 text-slate-900 font-bold shadow-sm"
                    : "border-transparent text-slate-600 hover:bg-white/40"
                }`}
              >
                <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                  currentStepId === "report" ? "bg-emerald-600 text-white" : "bg-white/60 border border-white/70 text-slate-500"
                }`}>
                  <FileText className="h-3.5 w-3.5" />
                </span>
                <div className="truncate flex-1">
                  <p className="font-bold text-emerald-800">Fiche d'Observation</p>
                  <p className="text-[9px] text-emerald-500 font-sans">ملف التشخيص النهائي</p>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-blue-50/40 backdrop-blur-md rounded-2xl p-4 text-[11px] text-blue-800 border border-blue-100/50 space-y-1">
            <h4 className="font-bold text-blue-700 flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
              <span>Consigne académique :</span>
            </h4>
            <p className="leading-relaxed">
              Veuillez dérouler chaque étape dans l'ordre sémiologique légitime sans sauter l'interrogatoire initial pour valider l'observation.
            </p>
          </div>
        </nav>

        {/* RIGHT COLUMN: ACTIVE WIZARD CARD & REPORT VIEW */}
        <section className="lg:col-span-3 space-y-6">

          {currentStepId !== "report" ? (
            <div className="custom-card rounded-2xl p-5 md:p-6 space-y-6">
              
              {/* Conditional step render */}
              {currentStepId === "patient" && (
                <PatientInfoStep data={state.patient} onChange={updatePatient} />
              )}

              {currentStepId.startsWith("thyroid-") && (
                <ThyroidStep 
                  data={state.thyroid} 
                  onChange={updateThyroid} 
                  subStep={currentStepId.replace("thyroid-", "") as any} 
                />
              )}

              {currentStepId.startsWith("foot-") && (
                <FootStep 
                  data={state.foot} 
                  onChange={updateFoot} 
                  subStep={currentStepId.replace("foot-", "") as any} 
                />
              )}

              {/* STEP CONTROLLER BUTTONS */}
              <div className="flex justify-between items-center border-t border-slate-100/60 pt-5">
                <button
                  type="button"
                  id="wizard-prev-btn"
                  disabled={currentStepIndex === 0}
                  onClick={handlePrev}
                  className="px-4 py-2.5 text-xs font-semibold border border-white/50 hover:bg-white/40 text-slate-705 bg-white/30 rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed backdrop-blur-md"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Précédent</span>
                </button>

                <div className="flex gap-2">
                  {/* Quick generation always accessible */}
                  <button
                    type="button"
                    id="wizard-quick-generate-btn"
                    onClick={generateObservationReport}
                    className="px-4 py-2.5 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-slate-900/10 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-teal-300" />
                    <span>Générer la fiche</span>
                  </button>

                  {currentStepIndex < EXAM_STEPS.length - 1 ? (
                    <button
                      type="button"
                      id="wizard-next-btn"
                      onClick={handleNext}
                      className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
                    >
                      <span>Suivant</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      id="wizard-finalize-btn"
                      onClick={generateObservationReport}
                      className="px-5 py-2.5 text-xs font-extrabold bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
                    >
                      <ClipboardCheck className="h-4 w-4" />
                      <span>Terminer l'examen</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* REPORT RENDER CARD */
            <div>
              {isGenerating ? (
                <div className="custom-card rounded-2xl p-12 text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-md font-bold text-slate-800 flex items-center justify-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
                      <span>Synthèse clinique par l'IA en cours...</span>
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      Notre expert virtuel en endocrinologie est en train de rédiger la fiche d'observation complète en français académique.
                    </p>
                  </div>
                </div>
              ) : (
                report ? (
                  <ReportViewer 
                    reportText={report} 
                    isGenerating={isGenerating} 
                    onRegenerate={generateObservationReport}
                    isBackup={isBackup}
                  />
                ) : (
                  <div className="custom-card rounded-2xl p-10 text-center space-y-4">
                    <HelpCircle className="h-10 w-10 text-slate-400 mx-auto" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-700">Aucune fiche observationnelle active</p>
                      <p className="text-xs text-slate-500">Veuillez d'abord remplir le questionnaire clinique puis cliquer sur "Générer la fiche".</p>
                    </div>
                    <button
                      type="button"
                      id="report-back-to-patient-btn"
                      onClick={() => setCurrentStepId("patient")}
                      className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Retourner au questionnaire
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </main>

      {/* 4. FOOTER CREDITS */}
      <footer className="bg-white/30 backdrop-blur-xl border-t border-white/20 py-4 px-4 text-center text-[10px] md:text-xs text-slate-500 font-sans print:hidden mt-auto">
        <p>© 2026 Assistant d'Examen Clinique Endocrinien et Pied Diabétique. Conçu spécifiquement pour l'entraînement sémiologique des étudiants en médecine.</p>
      </footer>
    </div>
  );
}
