import { CompleteExamState } from "../types";

export const INITIAL_EXAM_STATE: CompleteExamState = {
  patient: {
    name: "",
    age: "",
    gender: "",
    date: new Date().toISOString().split('T')[0],
    personalHistory: "",
    familyHistory: "",
    currentTreatment: ""
  },
  thyroid: {
    hyper: {
      lossOfWeightWithPolyphagia: false,
      diarrhea: false,
      palpitations: false,
      sweats: false,
      hairLoss: false,
      nervousness: false,
      insomnia: false
    },
    hypo: {
      constipation: false,
      weightGain: false,
      coldIntolerance: false,
      somnolence: false,
      depression: false,
      asthenia: false
    },
    familyHist: "Aucun",
    treatment: "Aucun",
    inspection: {
      goitre: "Absent",
      redness: false,
      scar: false,
      lidInfiltration: false,
      exophthalmos: false,
      cushingoidAspect: false
    },
    palpation: {
      technique: "Postérieure",
      swallowing: "Normale",
      thyroidPalpation: "Normale",
      adenopathie: "Absentes"
    },
    auscultation: {
      souffle: false
    }
  },
  foot: {
    neuro: {
      paresthesia: false,
      cottonWalking: false,
      burns: false,
      coldSensation: false
    },
    art: {
      claudication: false,
      jointPain: false
    },
    inspection: {
      hairlessSkin: false,
      shinySkin: false,
      edema: false,
      purpura: false,
      intertrigo: false,
      hyperkeratosis: false,
      syndactyly: false,
      dysmorphia: false
    },
    palpation: {
      godetSign: "Négatif",
      pedalPulse: "Présent",
      tibialPulse: "Présent",
      thermalGradient: "Normal"
    },
    sensibility: {
      tactile: "Normale",
      algesic: "Normale",
      thermal: "Normale",
      proprioceptive: "Conservée"
    },
    reflexes: {
      achilleanReflex: "Présent",
      motorFunction: "Normale"
    }
  }
};

export interface ClinicalStep {
  id: string;
  title: string;
  titleAr: string;
  section: "patient" | "thyroid" | "foot";
}

export const EXAM_STEPS: ClinicalStep[] = [
  { id: "patient", title: "Informations Patient", titleAr: "معلومات المريض", section: "patient" },
  
  // Thyroid Subsections
  { id: "thyroid-interrogatoire", title: "Thyroïde : Interrogatoire", titleAr: "الدرقية : الاستجواب السريري", section: "thyroid" },
  { id: "thyroid-inspection", title: "Thyroïde : Inspection cervicale", titleAr: "الدرقية : المعاينة البصرية لالعنق", section: "thyroid" },
  { id: "thyroid-palpation", title: "Thyroïde : Palpation & Mobilité", titleAr: "الدرقية : الجس السريري والحركية", section: "thyroid" },
  { id: "thyroid-auscultation", title: "Thyroïde : Auscultation", titleAr: "الدرقية : التسمع بالسماعة", section: "thyroid" },
  
  // Foot Subsections
  { id: "foot-interrogatoire", title: "Pied : Symptomatologie", titleAr: "القدم السكري : استجواب الأعراض", section: "foot" },
  { id: "foot-inspection", title: "Pied : Inspection dermatologique", titleAr: "القدم السكري : فحص حالة الجلد", section: "foot" },
  { id: "foot-palpation", title: "Pied : Palpation vasculaire", titleAr: "القدم السكري : جس الشرايين والحرارة", section: "foot" },
  { id: "foot-sensibility", title: "Pied : Examen de la Sensibilité", titleAr: "القدم السكري : فحص درجات الإحساس", section: "foot" },
  { id: "foot-reflexes", title: "Pied : Réflexes & Motricité", titleAr: "القدم السكري : المنعكسات والحركية", section: "foot" },
];
