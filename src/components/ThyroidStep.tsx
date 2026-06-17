import React from "react";
import { ThyroidExamState, ThyroidHyperSymptoms, ThyroidHypoSymptoms } from "../types";
import { Stethoscope, Eye, ShieldAlert, HeartPulse, Sparkles, CheckCircle } from "lucide-react";

interface ThyroidStepProps {
  data: ThyroidExamState;
  onChange: (updated: Partial<ThyroidExamState>) => void;
  subStep: "interrogatoire" | "inspection" | "palpation" | "auscultation";
}

export default function ThyroidStep({ data, onChange, subStep }: ThyroidStepProps) {
  
  // Helpers to update state safely
  const updateHyper = (field: keyof ThyroidHyperSymptoms, value: boolean) => {
    onChange({
      hyper: {
        ...data.hyper,
        [field]: value
      }
    });
  };

  const updateHypo = (field: keyof ThyroidHypoSymptoms, value: boolean) => {
    onChange({
      hypo: {
        ...data.hypo,
        [field]: value
      }
    });
  };

  const updateInspection = (field: keyof typeof data.inspection, value: any) => {
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

  const updateAuscultation = (field: keyof typeof data.auscultation, value: any) => {
    onChange({
      auscultation: {
        ...data.auscultation,
        [field]: value
      }
    });
  };

  const countHyper = Object.values(data.hyper).filter(Boolean).length;
  const countHypo = Object.values(data.hypo).filter(Boolean).length;

  return (
    <div className="space-y-6">
      
      {/* 1. INTERROGATOIRE */}
      {subStep === "interrogatoire" && (
        <div className="space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-teal-600" />
              <span>Interrogatoire (Anamnèse)</span>
            </h3>
            <span className="text-xs font-medium text-slate-500 dir-rtl font-sans">1. الاستجواب الطبي للغدة الدرقية</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hyperthyroid symptoms */}
            <div className="bg-rose-50/25 border border-rose-100/50 rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-center border-b border-rose-100/50 pb-2">
                <h4 className="text-sm font-semibold text-rose-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <span>Signes d'Hyperthyroïdie</span>
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded-full font-mono">
                    {countHyper} présent(s)
                  </span>
                  <span className="text-xs text-rose-500 font-sans">أعراض نشاط الغدة</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { key: "lossOfWeightWithPolyphagia", label: "Amaigrissement avec polyphagie", labelAr: "فقدان الوزن مع كثرة الأكل" },
                  { key: "diarrhea", label: "Diarrhées fréquentiaires", labelAr: "الإسهال المتكرر" },
                  { key: "palpitations", label: "Palpitations cardiaques", labelAr: "خفقان وتسارع ضربات القلب" },
                  { key: "sweats", label: "Sueurs excessives / Moiteurs", labelAr: "التعرق المفرط بدون مجهود" },
                  { key: "hairLoss", label: "Chute de cheveux (Alopécie)", labelAr: "تساقط الشعر" },
                  { key: "nervousness", label: "Nervosité / Tremblements", labelAr: "العصبية والارتجاف" },
                  { key: "insomnie", keyMapped: "insomnia", label: "Insomnie / Troubles du sommeil", labelAr: "الأرق وصعوبة النوم" }
                ].map((item) => {
                  const actualKey = (item.keyMapped || item.key) as keyof ThyroidHyperSymptoms;
                  const isChecked = data.hyper[actualKey];
                  return (
                    <div key={item.key} className="flex items-center justify-between p-2 rounded-lg bg-white/70 border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-slate-800">{item.label}</p>
                        <p className="text-[10px] text-slate-400 font-sans">{item.labelAr}</p>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          id={`thyroid-hyper-${item.key}-oui`}
                          onClick={() => updateHyper(actualKey, true)}
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
                          id={`thyroid-hyper-${item.key}-non`}
                          onClick={() => updateHyper(actualKey, false)}
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

            {/* Hypothyroid symptoms */}
            <div className="bg-sky-50/25 border border-sky-100/50 rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-center border-b border-sky-100/50 pb-2">
                <h4 className="text-sm font-semibold text-sky-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                  <span>Signes d'Hypothyroïdie</span>
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-sky-700 bg-sky-100/60 px-2 py-0.5 rounded-full font-mono">
                    {countHypo} présent(s)
                  </span>
                  <span className="text-xs text-sky-500 font-sans">أعراض خمول الغدة</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { key: "constipation", label: "Constipation opiniâtre", labelAr: "الإمساك المستمر" },
                  { key: "weightGain", label: "Prise de poids malgré l'hypophagie", labelAr: "زيادة الوزن غير المبررة" },
                  { key: "coldIntolerance", label: "Frilosité inhabituelle / Sensibilité au froid", labelAr: "تحسس شديد من البرودة" },
                  { key: "somnolence", label: "Somnolence diurne / Hypersomnie", labelAr: "النعاس الدائم والخمول" },
                  { key: "depression", label: "Dépression / Ralentissement psychique", labelAr: "الاكتئاب وبطء التفكير" },
                  { key: "asthenia", label: "Asthénie matinale / Fatigue globale", labelAr: "التعب الشديد والضعف العام" }
                ].map((item) => {
                  const actualKey = item.key as keyof ThyroidHypoSymptoms;
                  const isChecked = data.hypo[actualKey];
                  return (
                    <div key={item.key} className="flex items-center justify-between p-2 rounded-lg bg-white/70 border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-slate-800">{item.label}</p>
                        <p className="text-[10px] text-slate-400 font-sans">{item.labelAr}</p>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          id={`thyroid-hypo-${item.key}-oui`}
                          onClick={() => updateHypo(actualKey, true)}
                          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                            isChecked
                              ? "bg-sky-600 text-white shadow-sm"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Oui
                        </button>
                        <button
                          type="button"
                          id={`thyroid-hypo-${item.key}-non`}
                          onClick={() => updateHypo(actualKey, false)}
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
          </div>

          {/* Family background and treatment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex justify-between">
                <span>Antécédents Familiaux de la Patient</span>
                <span className="text-slate-500">التاريخ العائلي للغدة والسكري</span>
              </label>
              <select
                id="thyroid-family-hist-select"
                value={data.familyHist}
                onChange={(e: any) => onChange({ familyHist: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 font-medium"
              >
                <option value="Aucun">Aucun antécédent (لا يوجد)</option>
                <option value="Diabète">Diabète familial (سكري في العائلة)</option>
                <option value="Goitre">Goitre thyroïdien (تضخم غدة لمقربين)</option>
                <option value="Pathologie thyroïdienne">Pathologie thyroïdienne autre (مرض غدة درقية عائلي)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex justify-between">
                <span>Traitement spécifique de la thyroïde</span>
                <span className="text-slate-500">العلاج الحالي للغدة</span>
              </label>
              <select
                id="thyroid-treatment-select"
                value={data.treatment}
                onChange={(e: any) => onChange({ treatment: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 font-medium"
              >
                <option value="Aucun">Aucun traitement (بدون علاج)</option>
                <option value="Lévothyrox">Lévothyrox substitutif (ليفوثيروكس هرموني)</option>
                <option value="Autre">Autre traitement (علاجات أخرى)</option>
              </select>
            </div>
          </div>

          {data.treatment === "Lévothyrox" && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-xs text-emerald-800">
              💡 <strong>Observation clinique :</strong> La patiente est sous substitution hormonale (Lévothyrox).
              L'absence de symptômes actuels d'hypothyroïdie signifie une bonne équilibration clinique par le traitement actuel.
            </div>
          )}
        </div>
      )}

      {/* 2. INSPECTION CERVICALE / VISAGE */}
      {subStep === "inspection" && (
        <div className="space-y-5">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Eye className="h-5 w-5 text-teal-600" />
              <span>Inspection Cervicale & Faciale</span>
            </h3>
            <span className="text-xs font-medium text-slate-500 dir-rtl font-sans">2. المعاينة البصرية والوجهية للغدة</span>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 text-xs text-slate-700 space-y-1">
            <p className="font-semibold text-slate-800">Positionnement correct lors de l'examen :</p>
            <p>L'étudiant en médecine doit se placer strictement <strong>en face de la patiente</strong>.</p>
            <p className="text-teal-700">Demander à la patiente de lever légèrement la tête (extension modérée du cou). Très crucial en cas de cou court.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Col Inspection parameters */}
            <div className="space-y-4">
              {/* Goitre */}
              <div className="p-3 bg-white border border-slate-150 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-semibold text-slate-800">Tuméfaction baso-cervicale (Goitre)</h4>
                    <p className="text-[10px] text-slate-400">تضخم أسفل العنق</p>
                  </div>
                  {data.inspection.goitre === "Présent" && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-850 rounded">Anomalie</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {["Absent", "Présent"].map((value) => (
                    <button
                      key={value}
                      type="button"
                      id={`thyroid-inspect-goitre-${value}`}
                      onClick={() => updateInspection("goitre", value)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                        data.inspection.goitre === value
                          ? value === "Présent" ? "bg-amber-600 text-white" : "bg-slate-700 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-150"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rougeur */}
              <div className="p-3 bg-white border border-slate-150 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-semibold text-slate-800">Signes inflammatoires (Rougeur)</h4>
                    <p className="text-[10px] text-slate-400">أعراض الالتهابات والاحمرار</p>
                  </div>
                  {data.inspection.redness && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded">Anomalie</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    id="thyroid-inspect-redness-oui"
                    onClick={() => updateInspection("redness", true)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      data.inspection.redness ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-150"
                    }`}
                  >
                    Oui (احمرار)
                  </button>
                  <button
                    type="button"
                    id="thyroid-inspect-redness-non"
                    onClick={() => updateInspection("redness", false)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      !data.inspection.redness ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-150"
                    }`}
                  >
                    Non (طبيعي)
                  </button>
                </div>
              </div>

              {/* Cicatrice */}
              <div className="p-3 bg-white border border-slate-150 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-semibold text-slate-800">Cicatrice de thyroïdectomie</h4>
                    <p className="text-[10px] text-slate-400">ندوب جراحة الغدة الدرقية السابقة</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    id="thyroid-inspect-scar-oui"
                    onClick={() => updateInspection("scar", true)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      data.inspection.scar ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-150"
                    }`}
                  >
                    Oui (موجودة)
                  </button>
                  <button
                    type="button"
                    id="thyroid-inspect-scar-non"
                    onClick={() => updateInspection("scar", false)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      !data.inspection.scar ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-150"
                    }`}
                  >
                    Non (لا يوجد)
                  </button>
                </div>
              </div>
            </div>

            {/* Right Col Inspection parameters */}
            <div className="space-y-4">
              {/* Infiltration palpébrale */}
              <div className="p-3 bg-white border border-slate-150 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-semibold text-slate-800">Infiltration des paupières</h4>
                    <p className="text-[10px] text-slate-400">انتفاخ الجفون (علامة خمول)</p>
                  </div>
                  {data.inspection.lidInfiltration && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-105 text-sky-850 rounded">Hypothyroïdie</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    id="thyroid-inspect-lidInfiltration-oui"
                    onClick={() => updateInspection("lidInfiltration", true)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      data.inspection.lidInfiltration ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-150"
                    }`}
                  >
                    Oui
                  </button>
                  <button
                    type="button"
                    id="thyroid-inspect-lidInfiltration-non"
                    onClick={() => updateInspection("lidInfiltration", false)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      !data.inspection.lidInfiltration ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-150"
                    }`}
                  >
                    Non
                  </button>
                </div>
              </div>

              {/* Exophtalmie */}
              <div className="p-3 bg-white border border-slate-150 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-semibold text-slate-800">Exophtalmie (Œil saillant)</h4>
                    <p className="text-[10px] text-slate-400">جحوظ العينين (فرط نشاط / Basedow)</p>
                  </div>
                  {data.inspection.exophthalmos && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded">Hyperthyroïdie</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    id="thyroid-inspect-exophthalmos-oui"
                    onClick={() => updateInspection("exophthalmos", true)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      data.inspection.exophthalmos ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-150"
                    }`}
                  >
                    Oui
                  </button>
                  <button
                    type="button"
                    id="thyroid-inspect-exophthalmos-non"
                    onClick={() => updateInspection("exophthalmos", false)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      !data.inspection.exophthalmos ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-150"
                    }`}
                  >
                    Non
                  </button>
                </div>
              </div>

              {/* Aspect cushingöide */}
              <div className="p-3 bg-white border border-slate-150 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-semibold text-slate-800">Aspect cushingoïde (Bosse de bison)</h4>
                    <p className="text-[10px] text-slate-400">وجه قمري ممتلئ، حدبة بوفالو</p>
                  </div>
                  {data.inspection.cushingoidAspect && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-850 rounded">Anomalie corticosurrénale</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    id="thyroid-inspect-cushingoid-oui"
                    onClick={() => updateInspection("cushingoidAspect", true)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      data.inspection.cushingoidAspect ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-150"
                    }`}
                  >
                    Oui
                  </button>
                  <button
                    type="button"
                    id="thyroid-inspect-cushingoid-non"
                    onClick={() => updateInspection("cushingoidAspect", false)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      !data.inspection.cushingoidAspect ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-150"
                    }`}
                  >
                    Non
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. PALPATION / DEGLUTITION */}
      {subStep === "palpation" && (
        <div className="space-y-5">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-teal-600" />
              <span>Palpation de la Thyroïde</span>
            </h3>
            <span className="text-xs font-medium text-slate-500 dir-rtl font-sans">3. الجس الطبي وحركية البلع</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Technique approach */}
            <div className="p-3.5 bg-white border border-slate-150 rounded-xl space-y-2">
              <h4 className="text-xs font-semibold text-slate-700 flex justify-between">
                <span>Technique de palpation</span>
                <span className="text-slate-400 font-sans">طريقة الجس</span>
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-1">
                La méthode postérieure (se placer derrière le malade) est académiquement supérieure pour bien sentir les contours des lobes thyroïdiens.
              </p>
              <div className="flex gap-2">
                {["Antérieure", "Postérieure"].map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    id={`thyroid-palpation-tech-${tech}`}
                    onClick={() => updatePalpation("technique", tech)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      data.palpation.technique === tech
                        ? "bg-slate-800 text-white font-semibold"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-150"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            {/* Swallowing mobility */}
            <div className="p-3.5 bg-white border border-slate-150 rounded-xl space-y-2">
              <h4 className="text-xs font-semibold text-slate-700 flex justify-between">
                <span>Déglutition (Ebl3i / Avalez - Ascension de la thyroïde)</span>
                <span className="text-slate-400 font-sans">حركة الغدة مع الابتلاع</span>
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-1">
                Demander à la patiente d'avaler sa salive. Une glande thyroïde normale ou goitreuse monte physiologiquement à la déglutition.
              </p>
              <div className="flex gap-2">
                {["Normale", "Difficile"].map((val) => (
                  <button
                    key={val}
                    type="button"
                    id={`thyroid-palpation-swallow-${val}`}
                    onClick={() => updatePalpation("swallowing", val)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      data.palpation.swallowing === val
                        ? val === "Difficile" ? "bg-amber-600 text-white" : "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-150"
                    }`}
                  >
                    {val === "Normale" ? "Normale (طبيعي)" : "Difficile (صعبة / معاقة)"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Gland palpation findings */}
            <div className="p-3.5 bg-white border border-slate-150 rounded-xl space-y-2">
              <h4 className="text-xs font-semibold text-slate-700 flex justify-between">
                <span>Palpation thyroïde</span>
                <span className="text-slate-400 font-sans">نتيجة الجس السريري</span>
              </h4>
              <div className="flex flex-col gap-1.5">
                {[
                  { value: "Normale", label: "Normale", sub: "Souple, homogène, non hypertrophiée" },
                  { value: "Goitre", label: "Goitre thyroïdien véritable", sub: "Glande hypertrophiée, ferme ou nodulaire" },
                  { value: "Tissu adipeux", label: "Tissu adipeux seulement", sub: "Gras cervical simulant un goitre (cou court)" }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    id={`thyroid-palpation-result-${item.value}`}
                    onClick={() => updatePalpation("thyroidPalpation", item.value)}
                    className={`w-full p-2 text-left rounded-lg border text-xs transition-all flex justify-between items-center ${
                      data.palpation.thyroidPalpation === item.value
                        ? "border-teal-500 bg-teal-50/55 text-teal-900 font-semibold"
                        : "border-slate-100 bg-slate-50/50 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{item.label}</p>
                      <p className="text-[10px] text-slate-450 mt-0.5">{item.sub}</p>
                    </div>
                    {data.palpation.thyroidPalpation === item.value && <CheckCircle className="h-4 w-4 text-teal-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Lymph nodes */}
            <div className="p-3.5 bg-white border border-slate-150 rounded-xl space-y-2">
              <h4 className="text-xs font-semibold text-slate-700 flex justify-between">
                <span>Palpation des aires ganglionnaires cervicales</span>
                <span className="text-slate-400 font-sans">العقد اللمفاوية بالرقبة</span>
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-1">
                Recherche de ganglions cervicaux, rétro-auriculaires, sous-mentonniers ou sus-claviculaires (adénopathies cervicales).
              </p>
              <div className="flex gap-2">
                {[
                  { value: "Absentes", label: "Absentes (لا يوجد)", color: "bg-slate-800" },
                  { value: "Présentes", label: "Présentes (موجودة)", color: "bg-rose-600" }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    id={`thyroid-palpation-adenopathie-${item.value}`}
                    onClick={() => updatePalpation("adenopathie", item.value)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      data.palpation.adenopathie === item.value
                        ? `${item.color} text-white font-semibold`
                        : "bg-slate-100 text-slate-600 hover:bg-slate-150"
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

      {/* 4. AUSCULTATION */}
      {subStep === "auscultation" && (
        <div className="space-y-5 text-center py-5">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center text-left">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-teal-600" />
              <span>Auscultation Thyroïdienne</span>
            </h3>
            <span className="text-xs font-medium text-slate-500 dir-rtl font-sans">4. سماع أصوات الجريان الدموي</span>
          </div>

          <div className="max-w-md mx-auto space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              L'auscultation se fait à l'aide d'un stéthoscope sur les pôles latéraux de la glande. Un <strong>souffle thyroïdien vasculaire</strong> (continu ou systolique) est évocateur d'une hyperthyroïdie majeure d'origine auto-immune (Maladie de Basedow).
            </p>

            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-850">Souffle vasculaire thyroïdien</span>
                <span className="text-xs text-slate-400">صوت صفير وعائي</span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  id="thyroid-auscultation-souffle-oui"
                  onClick={() => updateAuscultation("souffle", true)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    data.auscultation.souffle
                      ? "bg-rose-600 text-white shadow-md shadow-rose-200"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Présent (موجود)
                </button>
                <button
                  type="button"
                  id="thyroid-auscultation-souffle-non"
                  onClick={() => updateAuscultation("souffle", false)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    !data.auscultation.souffle
                      ? "bg-slate-800 text-white shadow-md shadow-slate-350"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Absent (غائب)
                </button>
              </div>
            </div>

            {data.auscultation.souffle && (
              <div className="bg-rose-50 border border-rose-100/60 rounded-lg p-3 text-xs text-rose-800 flex items-start gap-2 text-left">
                <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Signe pathognomonique Basedow :</p>
                  <p>La détection d'un souffle confirme l'importante hyper-vascularisation de la glande caractére de la maladie de Basedow.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
