import React from "react";
import { FootExamState, FootNeuroSymptoms, FootArtSymptoms, FootInspection } from "../types";
import { HeartPulse, Eye, AlertTriangle, HelpCircle, Check, Stethoscope, Footprints } from "lucide-react";

interface FootStepProps {
  data: FootExamState;
  onChange: (updated: Partial<FootExamState>) => void;
  subStep: "interrogatoire" | "inspection" | "palpation" | "sensibility" | "reflexes";
}

export default function FootStep({ data, onChange, subStep }: FootStepProps) {

  const updateNeuro = (field: keyof FootNeuroSymptoms, value: boolean) => {
    onChange({
      neuro: {
        ...data.neuro,
        [field]: value
      }
    });
  };

  const updateArt = (field: keyof FootArtSymptoms, value: boolean) => {
    onChange({
      art: {
        ...data.art,
        [field]: value
      }
    });
  };

  const updateInspection = (field: keyof FootInspection, value: boolean) => {
    onChange({
      inspection: {
        ...data.inspection,
        [field]: value
      }
    });
  };

  const updatePalpation = (field: keyof typeof data.palpation, value: any) => {
    onChange({
      palpation: {
        ...data.palpation,
        [field]: value
      }
    });
  };

  const updateSensibility = (field: keyof typeof data.sensibility, value: any) => {
    onChange({
      sensibility: {
        ...data.sensibility,
        [field]: value
      }
    });
  };

  const updateReflexes = (field: keyof typeof data.reflexes, value: any) => {
    onChange({
      reflexes: {
        ...data.reflexes,
        [field]: value
      }
    });
  };

  const countInspectionAnomalies = Object.values(data.inspection).filter(Boolean).length;

  return (
    <div className="space-y-6">

      {/* 1. INTERROGATOIRE */}
      {subStep === "interrogatoire" && (
        <div className="space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <ClipboardIcon className="h-5 w-5 text-teal-600" />
              <span>Interrogatoire du Pied Diabétique</span>
            </h3>
            <span className="text-xs font-medium text-slate-500 dir-rtl font-sans">1. استجواب أعراض القدم</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Neuropathy Symptoms */}
            <div className="bg-amber-50/20 border border-amber-100/50 rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-center border-b border-amber-100/50 pb-2">
                <h4 className="text-sm font-semibold text-amber-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Neuropathie (Symptômes sensitifs)</span>
                </h4>
                <span className="text-xs text-amber-600 font-sans">أعراض اعتلال الأعصاب</span>
              </div>

              <div className="space-y-3">
                {[
                  { key: "paresthesia", label: "Paresthésies (Fourmillements / Tenmal)", labelAr: "تنميل ووخز في القدمين" },
                  { key: "cottonWalking", label: "Sensation de marcher sur du coton / pierre", labelAr: "الإحساس بالمشي على قطن أو حجر" },
                  { key: "burns", label: "Brûlures (Sensations douloureuses nocturnes)", labelAr: "ألم حارق يشتد ليلاً" },
                  { key: "coldSensation", label: "Sensation de froid (Pieds glacés)", labelAr: "الإحساس ببرودة شديدة كالثلج" },
                ].map((item) => {
                  const actualKey = item.key as keyof FootNeuroSymptoms;
                  const isChecked = data.neuro[actualKey];
                  return (
                    <div key={item.key} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-slate-850">{item.label}</p>
                        <p className="text-[10px] text-slate-400 font-sans">{item.labelAr}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          id={`foot-neuro-${item.key}-oui`}
                          onClick={() => updateNeuro(actualKey, true)}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                            isChecked
                              ? "bg-amber-600 text-white shadow-sm"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Oui
                        </button>
                        <button
                          type="button"
                          id={`foot-neuro-${item.key}-non`}
                          onClick={() => updateNeuro(actualKey, false)}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                            !isChecked
                              ? "bg-slate-200 text-slate-800"
                              : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                          }`}
                        >
                          Non
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Arteriopthy Symptoms */}
            <div className="bg-rose-50/20 border border-rose-100/50 rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-center border-b border-rose-100/50 pb-2">
                <h4 className="text-sm font-semibold text-rose-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <span>Artériopathie vs Origine Articulaire</span>
                </h4>
                <span className="text-xs text-rose-600 font-sans">أمراض الشرايين والمفاصل</span>
              </div>

              <div className="space-y-3">
                {[
                  { key: "claudication", label: "Claudication intermittente d'effort", labelAr: "ألم الساق أثناء المشي يتوقف بالراحة" },
                  { key: "jointPain", label: "Douleur articulaire (Mécanique ou arthrose)", labelAr: "آلام المفاصل (خشونة أو ميكانيكية)" },
                ].map((item) => {
                  const actualKey = item.key as keyof FootArtSymptoms;
                  const isChecked = data.art[actualKey];
                  return (
                    <div key={item.key} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-slate-850">{item.label}</p>
                        <p className="text-[10px] text-slate-400 font-sans">{item.labelAr}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          id={`foot-art-${item.key}-oui`}
                          onClick={() => updateArt(actualKey, true)}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                            isChecked
                              ? "bg-rose-600 text-white shadow-sm"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Oui
                        </button>
                        <button
                          type="button"
                          id={`foot-art-${item.key}-non`}
                          onClick={() => updateArt(actualKey, false)}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                            !isChecked
                              ? "bg-slate-200 text-slate-850"
                              : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                          }`}
                        >
                          Non
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Note about mechanical vs ischemic pain from course */}
              <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg text-[11px] text-amber-800 leading-relaxed mt-2">
                ⚠️ <strong>Note de stage clinique :</strong> Une claudication vasculaire typique impose l'arrêt du mouvement rapidement.
                Si la douleur survient de façon continue ou posturale, une cause mécanique/articulaire (arthrose, usure) est plus probable.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. INSPECTION */}
      {subStep === "inspection" && (
        <div className="space-y-5">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Eye className="h-5 w-5 text-teal-600" />
              <span>Inspection des Pieds & Dermatologie</span>
            </h3>
            <span className="text-xs font-medium text-slate-500 dir-rtl font-sans">2. المعاينة البصرية والجلدية للقدمين</span>
          </div>

          <div className="flex justify-between items-center bg-teal-50/40 p-3 rounded-xl border border-teal-100 text-xs">
            <p className="text-teal-900 font-medium">Examinez minutieusement le dôme du pied, les faces plantaires et les sillons inter-digitaux.</p>
            <span className="bg-teal-100 text-teal-800 font-mono text-[10px] px-2 py-0.5 rounded">
              {countInspectionAnomalies} Alarme(s)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "hairlessSkin", label: "Peau dépilée (Absence de pilosité)", desc: "Suggère une ischémie chronique des membres", descAr: "غياب الشعر عن الساق والقدم" },
              { key: "shinySkin", label: "Peau luisante / amincie", desc: "Trophie cutanée diminuée", descAr: "جلد لامع ورقيق" },
              { key: "edema", label: "Œdème des chevilles ou pieds", desc: "Infiltration hydrique des tissus", descAr: "تورم وانتفاخ القدمين" },
              { key: "purpura", label: "Purpura (Ne s'efface pas à vitropression)", desc: "Plaques purpuriques (Vascularite probable)", descAr: "بقع فرفرية حمراء لا تزول بالضغط" },
              { key: "intertrigo", label: "Intertrigo (Mycose inter-orteils)", desc: "Risque infectieux de porte d'entrée", descAr: "فطريات وتسلخات بين الأصابع" },
              { key: "hyperkeratosis", label: "Hyperkératose / Corne mécanique", desc: "Durillons marqués aux points d'appui", descAr: "تسمك الجلد (الكالوس) في مناطق الضغط" },
              { key: "syndactyly", label: "Syndactylie congénitale", desc: "Fusion d'orteils présente depuis la naissance", descAr: "التصاق الأصابع الخلقي" },
              { key: "dysmorphia", label: "Dysmorphie du pied / Pied déformé", desc: "Pied cubique, griffes d'orteil ou Charcot", descAr: "تشوهات في شكل وبنية عظام القدم" }
            ].map((item) => {
              const actualKey = item.key as keyof FootInspection;
              const isChecked = data.inspection[actualKey];
              return (
                <div
                  key={item.key}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                    isChecked
                      ? "border-rose-150 bg-rose-50/30"
                      : "border-slate-150 bg-white"
                  }`}
                >
                  <div className="space-y-0.5 max-w-[70%]">
                    <p className="text-xs font-bold text-slate-800">{item.label}</p>
                    <p className="text-[10px] text-slate-400">{item.desc}</p>
                    <p className="text-[9px] text-slate-350 font-sans italic">{item.descAr}</p>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      id={`foot-inspect-${item.key}-oui`}
                      onClick={() => updateInspection(actualKey, true)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        isChecked
                          ? "bg-rose-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-150"
                      }`}
                    >
                      Oui
                    </button>
                    <button
                      type="button"
                      id={`foot-inspect-${item.key}-non`}
                      onClick={() => updateInspection(actualKey, false)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        !isChecked
                          ? "bg-slate-700 text-white"
                          : "bg-slate-150 text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      Non
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. PALPATION */}
      {subStep === "palpation" && (
        <div className="space-y-5">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-teal-600" />
              <span>Palpation Vasculaire & Trophique</span>
            </h3>
            <span className="text-xs font-medium text-slate-500 dir-rtl font-sans">3. جس الشرايين الطرفية والحرارة</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Godet sign */}
            <div className="p-4 bg-white border border-slate-150 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-700">Signe du godet (Œdème)</span>
                {data.palpation.godetSign === "Positif" && (
                  <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5 py-0.5 rounded">Infiltration</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Pression prolongée avec le pouce sur la face antérieure de la jambe. Laisse une empreinte temporaire si le godet est positif.
              </p>
              <div className="flex gap-2 pt-1">
                {["Négatif", "Positif"].map((val) => (
                  <button
                    key={val}
                    type="button"
                    id={`foot-palpation-godet-${val}`}
                    onClick={() => updatePalpation("godetSign", val)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      data.palpation.godetSign === val
                        ? val === "Positif" ? "bg-rose-600 text-white focus:ring-2 focus:ring-rose-500" : "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-150"
                    }`}
                  >
                    {val === "Positif" ? "Positif (منطبع)" : "Négatif (غير منطبع)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Thermal Gradient */}
            <div className="p-4 bg-white border border-slate-150 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-700">Gradient thermique cutané</span>
                {data.palpation.thermalGradient === "Diminué" && (
                  <span className="bg-rose-105 text-rose-800 text-[9px] font-bold px-1.5 py-0.5 rounded">Ischémie suspecte</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Comparaison de la chaleur cutanée entre le genou (proximal) et le pied (distal) à l'aide du dos de la main.
              </p>
              <div className="flex gap-2 pt-1">
                {["Normal", "Diminué"].map((val) => (
                  <button
                    key={val}
                    type="button"
                    id={`foot-palpation-thermal-${val}`}
                    onClick={() => updatePalpation("thermalGradient", val)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      data.palpation.thermalGradient === val
                        ? val === "Diminué" ? "bg-rose-600 text-white" : "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-150"
                    }`}
                  >
                    {val === "Normal" ? "Normal (حرارة متدرجة)" : "Diminué (برودة في الأطراف)"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Pouls pédieux */}
            <div className="p-4 bg-white border border-slate-150 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-700">Pouls pédieux (Dorsal du pied)</span>
                {data.palpation.pedalPulse !== "Présent" && (
                  <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5 py-0.5 rounded">Altéré</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { value: "Présent", label: "Présent", color: "bg-emerald-600 text-white" },
                  { value: "Diminué", label: "Diminué", color: "bg-amber-600 text-white" },
                  { value: "Absent", label: "Absent", color: "bg-rose-600 text-white" }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    id={`foot-palpation-pedal-${item.value}`}
                    onClick={() => updatePalpation("pedalPulse", item.value)}
                    className={`py-1.5 text-[11px] font-medium rounded-lg transition-all ${
                      data.palpation.pedalPulse === item.value
                        ? item.color
                        : "bg-slate-100 text-slate-600 hover:bg-slate-150"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {data.palpation.pedalPulse === "Absent" && (
                <p className="text-[10px] text-rose-600 italic">⚠️ Pouls aboli = Ischémie critique à investiguer urgemment.</p>
              )}
            </div>

            {/* Pouls tibial postérieur */}
            <div className="p-4 bg-white border border-slate-150 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-700">Pouls tibial postérieur (Malléole interne)</span>
                {data.palpation.tibialPulse !== "Présent" && (
                  <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5 py-0.5 rounded">Altéré</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { value: "Présent", label: "Présent", color: "bg-emerald-600 text-white" },
                  { value: "Diminué", label: "Diminué", color: "bg-amber-600 text-white" },
                  { value: "Absent", label: "Absent", color: "bg-rose-600 text-white" }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    id={`foot-palpation-tibial-${item.value}`}
                    onClick={() => updatePalpation("tibialPulse", item.value)}
                    className={`py-1.5 text-[11px] font-medium rounded-lg transition-all ${
                      data.palpation.tibialPulse === item.value
                        ? item.color
                        : "bg-slate-100 text-slate-600 hover:bg-slate-150"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {data.palpation.godetSign === "Positif" && (
                <div className="bg-amber-50 p-2 rounded text-[10px] text-amber-800">
                  ℹ️ <strong>Remarque pratique :</strong> La palpation des pouls peut être rendue très difficile par l'infiltration de l'œdème.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. SENSIBILITÉ */}
      {subStep === "sensibility" && (
        <div className="space-y-5">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-teal-600" />
              <span>Sensibilité Neurologique</span>
            </h3>
            <span className="text-xs font-medium text-slate-500 dir-rtl font-sans">4. اختبار درجات الإحساس السريري</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed mb-3">
            <strong>Rappel méthodologique :</strong> Demander à la patiente de <strong>fermer les yeux</strong>. Toucher brièvement les points plantaires ou mobiliser les segments et demander s'il y a perception et exactitude.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tactile */}
            <div className="p-4 bg-white border border-slate-150 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Sensibilité Tactile (superficielle)</h4>
                  <p className="text-[10px] text-slate-400">Test au monofilament de Semmes-Weinstein</p>
                </div>
                {data.sensibility.tactile === "Altérée" && (
                  <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5 py-0.5 rounded">Hypoesthésie</span>
                )}
              </div>
              <div className="flex gap-2">
                {["Normale", "Altérée"].map((val) => (
                  <button
                    key={val}
                    type="button"
                    id={`foot-sensibility-tactile-${val}`}
                    onClick={() => updateSensibility("tactile", val)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      data.sensibility.tactile === val
                        ? val === "Altérée" ? "bg-rose-600 text-white" : "bg-teal-700 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-150"
                    }`}
                  >
                    {val === "Normale" ? "Normale (طبيعي)" : "Altérée (ضعف الإحساس)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Algésique */}
            <div className="p-4 bg-white border border-slate-150 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Sensibilité Algésique (Douleur)</h4>
                  <p className="text-[10px] text-slate-400">Pique / Touche avec stylet émoussé</p>
                </div>
                {data.sensibility.algesic === "Altérée" && (
                  <span className="bg-rose-105 text-rose-800 text-[9px] font-bold px-1.5 py-0.5 rounded">Troubles de douleur</span>
                )}
              </div>
              <div className="flex gap-2">
                {["Normale", "Altérée"].map((val) => (
                  <button
                    key={val}
                    type="button"
                    id={`foot-sensibility-algesic-${val}`}
                    onClick={() => updateSensibility("algesic", val)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      data.sensibility.algesic === val
                        ? val === "Altérée" ? "bg-rose-600 text-white" : "bg-teal-700 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-150"
                    }`}
                  >
                    {val === "Normale" ? "Normale (طبيعي)" : "Altérée (اضطراب الألم)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Thermique */}
            <div className="p-4 bg-white border border-slate-150 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Sensibilité Thermique</h4>
                  <p className="text-[10px] text-slate-400">Distinction chaud / froid (Métal froid)</p>
                </div>
                {data.sensibility.thermal === "Altérée" && (
                  <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5 py-0.5 rounded">Altérée</span>
                )}
              </div>
              <div className="flex gap-2">
                {["Normale", "Altérée"].map((val) => (
                  <button
                    key={val}
                    type="button"
                    id={`foot-sensibility-thermal-${val}`}
                    onClick={() => updateSensibility("thermal", val)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      data.sensibility.thermal === val
                        ? val === "Altérée" ? "bg-rose-600 text-white" : "bg-teal-700 text-white"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-150"
                    }`}
                  >
                    {val === "Normale" ? "Normale (طبيعي)" : "Altérée (اضطراب الحرارة)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Proprioceptive */}
            <div className="p-4 bg-white border border-slate-150 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Sensibilité Proprioceptive / Profonde</h4>
                  <p className="text-[10px] text-slate-400">Arthrakinésie (Sensation de position de l'orteil)</p>
                </div>
                {data.sensibility.proprioceptive === "Altérée" && (
                  <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded">Ataxie sensitive</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">Déplacement vertical du gros orteil vers le haut (Fouk) ou vers le bas (Taht).</p>
              <div className="flex gap-2">
                {["Conservée", "Altérée"].map((val) => (
                  <button
                    key={val}
                    type="button"
                    id={`foot-sensibility-proprioceptive-${val}`}
                    onClick={() => updateSensibility("proprioceptive", val)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      data.sensibility.proprioceptive === val
                        ? val === "Altérée" ? "bg-rose-600 text-white" : "bg-teal-700 text-white"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-150"
                    }`}
                  >
                    {val === "Conservée" ? "Conservée (سليمة)" : "Altérée (مضطربة)"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. REFLEXES */}
      {subStep === "reflexes" && (
        <div className="space-y-5">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-teal-600" />
              <span>Réflexes Ostéotendineux & Motricité</span>
            </h3>
            <span className="text-xs font-medium text-slate-500 dir-rtl font-sans">5. منعكس وتر أكيل والحركية العضلية</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Achillean Reflex */}
            <div className="p-4 bg-white border border-slate-150 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Réflexe achilléen</h4>
                  <p className="text-[10px] text-slate-400">Percussion du tendon d'Achille</p>
                </div>
                {data.reflexes.achilleanReflex !== "Présent" && (
                  <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5 py-0.5 rounded">Neuropathie</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { value: "Présent", label: "Présent", color: "bg-emerald-600 text-white" },
                  { value: "Diminué", label: "Diminué", color: "bg-amber-600 text-white" },
                  { value: "Absent", label: "Aboli", color: "bg-rose-600 text-white" }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    id={`foot-reflexes-achillean-${item.value}`}
                    onClick={() => updateReflexes("achilleanReflex", item.value)}
                    className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                      data.reflexes.achilleanReflex === item.value
                        ? item.color
                        : "bg-slate-100 text-slate-600 hover:bg-slate-150"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-450 leading-relaxed">
                Une disparition ou abolition bilatérale du réflexe achilléen est une manifestation caractéristique précoce de la polyneuropathie diabétique longueur-dépendante.
              </p>
            </div>

            {/* Motor Function */}
            <div className="p-4 bg-white border border-slate-150 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Motricité distale active</h4>
                  <p className="text-[10px] text-slate-400">Flexion / Extension contre résistance</p>
                </div>
                {data.reflexes.motorFunction !== "Normale" && (
                  <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5 py-0.5 rounded">Amoindrie</span>
                )}
              </div>
              <div className="flex gap-2">
                {[
                  { value: "Normale", label: "Normale (طبيعية)" },
                  { value: "Diminuée", label: "Diminuée (متأثرة)" }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    id={`foot-reflexes-motor-${item.value}`}
                    onClick={() => updateReflexes("motorFunction", item.value)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                      data.reflexes.motorFunction === item.value
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-650 hover:bg-slate-150"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Compact helper components to avoid imports check
function ClipboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}
