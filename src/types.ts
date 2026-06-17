/**
 * Shared Type Definitions for the Endocrinology & Diabetic Foot Clinical Assistant
 */

export interface PatientInfo {
  name: string;
  age: string;
  gender: "Homme" | "Femme" | "";
  date: string;
  personalHistory: string;
  familyHistory: string;
  currentTreatment: string;
}

export interface ThyroidHyperSymptoms {
  lossOfWeightWithPolyphagia: boolean; // Amaigrissement avec polyphagie
  diarrhea: boolean;                 // Diarrhées
  palpitations: boolean;             // Palpitations
  sweats: boolean;                   // Sueurs
  hairLoss: boolean;                 // Chute de cheveux
  nervousness: boolean;              // Nervosité
  insomnia: boolean;                 // Insomnie
}

export interface ThyroidHypoSymptoms {
  constipation: boolean;             // Constipation
  weightGain: boolean;               // Prise de poids
  coldIntolerance: boolean;          // Frilosité
  somnolence: boolean;               // Somnolence
  depression: boolean;               // Dépression
  asthenia: boolean;                 // Asthénie
}

export interface ThyroidInspection {
  goitre: "Absent" | "Présent";
  redness: boolean;
  scar: boolean;
  lidInfiltration: boolean;
  exophthalmos: boolean;
  cushingoidAspect: boolean; // Aspect cushingoïde (bosse de bison, visage lunaire)
}

export interface ThyroidPalpation {
  technique: "Antérieure" | "Postérieure";
  swallowing: "Normale" | "Difficile";
  thyroidPalpation: "Normale" | "Goitre" | "Tissu adipeux";
  adenopathie: "Absentes" | "Présentes";
}

export interface ThyroidAuscultation {
  souffle: boolean; // Souffle thyroïdien
}

export interface ThyroidExamState {
  hyper: ThyroidHyperSymptoms;
  hypo: ThyroidHypoSymptoms;
  familyHist: "Aucun" | "Diabète" | "Goitre" | "Pathologie thyroïdienne";
  treatment: "Aucun" | "Lévothyrox" | "Autre";
  inspection: ThyroidInspection;
  palpation: ThyroidPalpation;
  auscultation: ThyroidAuscultation;
}

export interface FootNeuroSymptoms {
  paresthesia: boolean;     // Paresthésies
  cottonWalking: boolean;   // Sensation de marcher sur du coton / pierre
  burns: boolean;           // Brûlures nocturnes
  coldSensation: boolean;   // Sensation de froid
}

export interface FootArtSymptoms {
  claudication: boolean;    // Claudication intermittente
  jointPain: boolean;       // Douleur articulaire
}

export interface FootInspection {
  hairlessSkin: boolean;    // Peau dépilée
  shinySkin: boolean;       // Peau luisante
  edema: boolean;           // Œdème
  purpura: boolean;         // Purpura (ne s'efface pas à la vitropression)
  intertrigo: boolean;       // Intertrigo (mycose inter-orteils)
  hyperkeratosis: boolean;  // Hyperkératose / corne
  syndactyly: boolean;      // Syndactylie (fusion d'orteils congénitale)
  dysmorphia: boolean;      // Dysmorphie du pied
}

export interface FootPalpation {
  godetSign: "Négatif" | "Positif"; // Signe du godet
  pedalPulse: "Présent" | "Diminué" | "Absent"; // Pouls pédieux
  tibialPulse: "Présent" | "Diminué" | "Absent"; // Pouls tibial postérieur
  thermalGradient: "Normal" | "Diminué"; // Gradient thermique (plus froid en distal)
}

export interface FootSensibility {
  tactile: "Normale" | "Altérée";        // Sensibilité tactile
  algesic: "Normale" | "Altérée";        // Sensibilité algésique (pique/touche)
  thermal: "Normale" | "Altérée";        // Sensibilité thermique
  proprioceptive: "Conservée" | "Altérée"; // Sensibilité proprioceptive / profonde
}

export interface FootReflexes {
  achilleanReflex: "Présent" | "Diminué" | "Absent"; // Réflexe achilléen
  motorFunction: "Normale" | "Diminée";              // Motricité
}

export interface FootExamState {
  neuro: FootNeuroSymptoms;
  art: FootArtSymptoms;
  inspection: FootInspection;
  palpation: FootPalpation;
  sensibility: FootSensibility;
  reflexes: FootReflexes;
}

export interface CompleteExamState {
  patient: PatientInfo;
  thyroid: ThyroidExamState;
  foot: FootExamState;
}

export type ExamSection = "patient" | "thyroid" | "foot" | "report";
