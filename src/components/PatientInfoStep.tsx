import React from "react";
import { PatientInfo } from "../types";
import { User, Calendar, Activity, ClipboardList, BriefcaseMedical } from "lucide-react";

interface PatientInfoStepProps {
  data: PatientInfo;
  onChange: (updated: Partial<PatientInfo>) => void;
}

export default function PatientInfoStep({ data, onChange }: PatientInfoStepProps) {
  const handleInputChange = (field: keyof PatientInfo, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Arabic/French Bilingual Header */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <User className="h-5 w-5 text-teal-600" />
          <span>Informations Générales du Patient</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-sans text-right dir-rtl">
          بيانات المريض الأساسية وتاريخه المرضي الشخصي والعائلي
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Nom */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600 flex justify-between">
            <span>Nom complet / Identifiant</span>
            <span className="text-slate-400">الاسم الكامل / المعرّف</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="patient-name-input"
              value={data.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ex: Mme. Fatima B."
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-colors"
            />
            <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Âge */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600 flex justify-between">
            <span>Âge (ans)</span>
            <span className="text-slate-400">العمر (سنوات)</span>
          </label>
          <div className="relative">
            <input
              type="number"
              id="patient-age-input"
              value={data.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              placeholder="Ex: 58"
              min="0"
              max="120"
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-colors"
            />
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Sexe */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600 flex justify-between">
            <span>Sexe</span>
            <span className="text-slate-400">الجنس</span>
          </label>
          <select
            id="patient-gender-select"
            value={data.gender}
            onChange={(e) => handleInputChange("gender", e.target.value as any)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-colors appearance-none"
          >
            <option value="">Sélectionner / اختر</option>
            <option value="Homme">Homme (ذكر)</option>
            <option value="Femme">Femme (أنثى)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Date d'examen */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600 flex justify-between">
            <span>Date de la consultation</span>
            <span className="text-slate-400">تاريخ المعاينة</span>
          </label>
          <div className="relative">
            <input
              type="date"
              id="patient-date-input"
              value={data.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-colors"
            />
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Traitement Actuel */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600 flex justify-between">
            <span>Traitements Actuels</span>
            <span className="text-slate-400">العلاجات الحالية</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="patient-treatment-input"
              value={data.currentTreatment}
              onChange={(e) => handleInputChange("currentTreatment", e.target.value)}
              placeholder="Ex: Lévothyrox 100 µg, Metformine 850 mg"
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-colors"
            />
            <Activity className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* History and details - Text Areas with rich clinical prompts */}
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600 flex justify-between">
            <span>Antécédents Personnels (médicaux nés de diabète, durée d'évolution, thyroïdectomie...)</span>
            <span className="text-slate-400">السوابق المرضية الشخصية</span>
          </label>
          <div className="relative">
            <textarea
              id="patient-personal-history-input"
              value={data.personalHistory}
              onChange={(e) => handleInputChange("personalHistory", e.target.value)}
              rows={2}
              placeholder="Ex: Diabétique Type 1 depuis l'âge de 16 ans (ancien > 10 ans), rétinopathie diabétique débutante. Pas d'antécédent de cardiopathie."
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-colors placeholder:text-slate-300"
            />
            <ClipboardList className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-600 flex justify-between">
            <span>Antécédents Familiaux (goitre maternel, diabète héréditaire...)</span>
            <span className="text-slate-400">السوابق العائلية</span>
          </label>
          <div className="relative">
            <textarea
              id="patient-family-history-input"
              value={data.familyHistory}
              onChange={(e) => handleInputChange("familyHistory", e.target.value)}
              rows={2}
              placeholder="Ex: Mère opérée d'un goitre multi-nodulaire, Père diabétique Type 2. Risque génétique de diabète élevé."
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-colors placeholder:text-slate-300"
            />
            <BriefcaseMedical className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Clinical Tip Box */}
      <div className="bg-teal-50/50 border border-teal-100 rounded-lg p-3 text-xs text-teal-800 space-y-1">
        <h4 className="font-semibold flex items-center gap-1.5 text-teal-900">
          <Activity className="h-3.5 w-3.5 text-teal-600" />
          <span>Note méthodologique clinique</span>
        </h4>
        <p className="leading-relaxed">
          Un diabète ancien (&gt;10 ans) ou de type 1 pose des risques majeurs de complications de micro et macro-angiopathie.
          Recherchez rigoureusement les antécédents de pathologies thyroïdiennes (souvent auto-immunes associées au DT1).
        </p>
      </div>
    </div>
  );
}
