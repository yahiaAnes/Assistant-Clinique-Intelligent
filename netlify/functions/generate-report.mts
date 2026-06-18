import type { Config, Context } from '@netlify/functions'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({})

export default async (req: Request, _context: Context) => {
  const { patient, thyroid, foot } = await req.json()

  if (!patient || !thyroid || !foot) {
    return Response.json({ error: 'Missing required clinical examination data' }, { status: 400 })
  }

  const clinicalPrompt = `
You are an expert Professor of Internal Medicine and Endocrinology.
Your task is to take the structured answers from a medical student's clinical examination of a patient and transform them into a highly professional, technically precise, and elegant French Clinical File ("Fiche d'observation clinique"), Clinical Synthesis ("Synthèse clinique"), Evoked Diagnostic ("Diagnostic évoqué"), and Patient Advices ("Conseils au patient").

Write exactly what a medical resident or expert physician would document in the patient's medical record. Use standard, elegant medical French terminology (e.g. "amaigrissement involontaire avec conservation de l'appétit / polyphagie", "tachycardie / palpitations", "érythrose faciale", "amyotrophie", "gradient thermique distal", "abolition / diminution des réflexes ostéotendineux achilléens", "atteinte sensitive thermo-algésique", "stade de risque du pied diabétique selon le groupe international d'étude sur le pied diabétique (IWGDF) / classification de l'OMS").

Do not include any conversational preamble, pleasantries, or JSON wraps in your reply. Output directly in clean, readable, professional Markdown.

Here is the collected patient data:

=== DONNÉES DU PATIENT ===
- Nom/Identifiant : ${patient.name || "Anonyme"}
- Âge : ${patient.age || "Non renseigné"} ans
- Sexe : ${patient.gender || "Non renseigné"}
- Date d'examen : ${patient.date || "Non renseignée"}
- Antécédents Personnels : ${patient.personalHistory || "Aucun signalé"}
- Antécédents Familiaux : ${patient.familyHistory || "Aucun signalé"}
- Traitement Actuel : ${patient.currentTreatment || "Aucun signalé"}

=== EXAMEN DE LA THYROÏDE ===
1. Interrogatoire / Signes fonctionnels :
  - Signes d'hyperthyroïdie :
    * Amaigrissement avec polyphagie : ${thyroid.hyper.lossOfWeightWithPolyphagia ? "OUI" : "NON"}
    * Diarrhées : ${thyroid.hyper.diarrhea ? "OUI" : "NON"}
    * Palpitations : ${thyroid.hyper.palpitations ? "OUI" : "NON"}
    * Sueurs excessives : ${thyroid.hyper.sweats ? "OUI" : "NON"}
    * Chute de cheveux : ${thyroid.hyper.hairLoss ? "OUI" : "NON"}
    * Nervosité / Irritabilité : ${thyroid.hyper.nervousness ? "OUI" : "NON"}
    * Insomnie : ${thyroid.hyper.insomnia ? "OUI" : "NON"}
  - Signes d'hypothyroïdie :
    * Constipation : ${thyroid.hypo.constipation ? "OUI" : "NON"}
    * Prise de poids : ${thyroid.hypo.weightGain ? "OUI" : "NON"}
    * Frilosité accrue : ${thyroid.hypo.coldIntolerance ? "OUI" : "NON"}
    * Somnolence excessive : ${thyroid.hypo.somnolence ? "OUI" : "NON"}
    * Dépression / Ralentissement psycho-moteur : ${thyroid.hypo.depression ? "OUI" : "NON"}
    * Asthénie / Fatigue chronique : ${thyroid.hypo.asthenia ? "OUI" : "NON"}
  - Antécédents familiaux thyroïdiens particuliers : ${thyroid.familyHist || "Aucun"}
  - Traitement thyroïdien en cours : ${thyroid.treatment || "Aucun"}

2. Inspection Cervicale et Faciale :
  - Goitre visible : ${thyroid.inspection.goitre}
  - Érythème / Rougeur cervicale : ${thyroid.inspection.redness ? "OUI" : "NON"}
  - Cicatrice de thyroïdectomie : ${thyroid.inspection.scar ? "OUI" : "NON"}
  - Infiltration des paupières (myxœdème) : ${thyroid.inspection.lidInfiltration ? "OUI" : "NON"}
  - Exophtalmie : ${thyroid.inspection.exophthalmos ? "OUI" : "NON"}
  - Aspect cushingoïde (visage lunaire, bosse de bison) : ${thyroid.inspection.cushingoidAspect ? "OUI" : "NON"}

3. Palpation Cervicale :
  - Technique de palpation : ${thyroid.palpation.technique} (Approche)
  - Déglutition (Ascension de la thyroïde) : ${thyroid.palpation.swallowing}
  - Palpation du corps thyroïde : ${thyroid.palpation.thyroidPalpation}
  - Adénopathies cervicales palpables : ${thyroid.palpation.adenopathie}

4. Auscultation :
  - Souffle vasculaire thyroïdien : ${thyroid.auscultation.souffle ? "OUI" : "NON"}

=== EXAMEN DU PIED DIABÉTIQUE ===
1. Interrogatoire / Symptômes fonctionnels :
  - Signes de neuropathie :
    * Paresthésies / Fourmillements : ${foot.neuro.paresthesia ? "OUI" : "NON"}
    * Sensation de marcher sur du coton ou de la pierre : ${foot.neuro.cottonWalking ? "OUI" : "NON"}
    * Brûlures nocturnes : ${foot.neuro.burns ? "OUI" : "NON"}
    * Sensation de pieds glacés : ${foot.neuro.coldSensation ? "OUI" : "NON"}
  - Signes d'artériopathie :
    * Claudication intermittente (douleur à la marche, calmée au repos) : ${foot.art.claudication ? "OUI" : "NON"}
    * Douleur articulaire (arthrose ou mécanique) : ${foot.art.jointPain ? "OUI" : "NON"}

2. Inspection des Pieds et des Jambes :
  - Canaux de trophicité cutanée altérée :
    * Peau dépilée (signe d'ischémie) : ${foot.inspection.hairlessSkin ? "OUI" : "NON"}
    * Peau luisante / amincie : ${foot.inspection.shinySkin ? "OUI" : "NON"}
    * Œdème des membres inférieurs : ${foot.inspection.edema ? "OUI" : "NON"}
    * Purpura ou taches vasculaires (ne s'effaçant pas à la vitropression) : ${foot.inspection.purpura ? "OUI" : "NON"}
    * Intertrigo / Mycose inter-orteils : ${foot.inspection.intertrigo ? "OUI" : "NON"}
    * Hyperkératose / Corne (zones de surappui) : ${foot.inspection.hyperkeratosis ? "OUI" : "NON"}
  - Malformations du pied :
    * Syndactylie (fusion d'orteils congénitale) : ${foot.inspection.syndactyly ? "OUI" : "NON"}
    * Dysmorphie ou déformation (pied cubique, griffe d'orteil, pied de Charcot) : ${foot.inspection.dysmorphia ? "OUI" : "NON"}

3. Palpation Vasculaire et Cutanée :
  - Signe du godet (pour l'œdème) : ${foot.palpation.godetSign}
  - Pouls pédieux : ${foot.palpation.pedalPulse}
  - Pouls tibial postérieur : ${foot.palpation.tibialPulse}
  - Température cutanée ou gradient thermique (proximal vers distal) : ${foot.palpation.thermalGradient}

4. Examen de la Sensibilité Neurologique (Système Nerveux Périphérique) :
  - Sensibilité Tactile (superficielle, ex. test au monofilament de Semmes-Weinstein) : ${foot.sensibility.tactile}
  - Sensibilité Algésique / À la douleur (test pique/touche au stylet) : ${foot.sensibility.algesic}
  - Sensibilité Thermique (chaud/froid) : ${foot.sensibility.thermal}
  - Sensibilité Proprioceptive / Profonde (ex. sens de position de l'hallux / arthrakinésie) : ${foot.sensibility.proprioceptive}

5. Réflexes et Motricité :
  - Réflexe achilléen : ${foot.reflexes.achilleanReflex}
  - Motricité distale (flexion/extension contre résistance) : ${foot.reflexes.motorFunction}

------------------
REQUIRED STRUCTURE FOR THE OUTPUT:
Use a formal, elegant template with clear headers and professional formatting:

# 🗂️ FICHE D'OBSERVATION CLINIQUE COHÉRENTE

## 1. Informations Patient & Antécédents
Provide a well-styled paragraph detailing the patient's identity, age, gender, exact reasons of assessment, precise history, and ongoing treatment. State their relative risk due to history (e.g., Duration of Diabetes or family endocrine traits).

## 2. Examen Clinique de la Glande Thyroïde
Write a highly dense, professional clinical report covering:
- **Interrogatoire (Anamnèse)**: Interpret the functional signs (the balance or presence of hypo/hyperthyroidism symptoms). For example: "L'interrogatoire met en évidence un syndrome de thyrotoxicose franc caractérisé par..." or "Absence de signes fonctionnels de dysthyroïdie...".
- **Inspection**: Describe facial and cervical inspection results. Comment on potential Cushingoid/Pseudo-Cushing signs if aspect cushingoïde is present, or exophthalmos/eyelid infiltration.
- **Palpation (Thyroïde et aires ganglionnaires)**: Elaborate on the technique used, swallowing movement (ascension de la loge thyroïdienne), the texture felt (e.g. standard parenchyma, adipose tissue simulating a goiter, or authentic goiter), and whether cervical lymph nodes (adénopathies) are isolated.
- **Auscultation**: Detail the presence or absence of a vascular murmur (souffle vasculaire) over the lobes.

## 3. Examen Clinique du Pied Diabétique
Provide an expert clinical narrative on:
- **Interrogatoire & Signes Fonctionnels**: Summarize neuropathic and arteriopathic symptoms. Note specifically the clinical significance of "sensation de froid/glace" or "sensation de marcher sur du coton/pierre". Contrast mechanical pain of arthrosis with ischemic claudication.
- **Inspection (État cutané et morphologie)**: Describe the skin's state (dépilée, luisante, presence of edema, purpura, zones lines of hyperkeratosis, syndactyly, or secondary joint deformities).
- **Palpation (Hémodynamique & Trophique)**: Present the palpation of distal pulses (pedal, posterior tibial) noting if they are masked by edema (signe du godet), and analyze the distal thermal gradient.
- **Examen de la Sensibilité (Bilan Neurologique)**: Analyze the different modalities (Tactile, Algésique, Thermique, Profonde). Explicitly state if there is "Neuropathie Diabétique Distale Symétrique" (loss of monofilament test, pain confusion, while positional kinesthesia might be intact).
- **Réflexes & Statut Moteur**: Document the Achilles reflex state and distal active motor function.

## 4. Synthèse Clinique & Diagnostics Évoqués
Formulate a highly scholarly clinical synthesis (Synthèse clinique globale) linking thyroid state and diabetic foot risks.
List evoked diagnoses with bullet points (e.g., "Pied diabétique mixte à prédominance neuropathique (Grade IWGDF XX)", "Dysthyroïdie à typer", "Médiacalcose soupçonnée", "Syndrome de Cushing ou imprégnation cortisonique exogène"). Indicate precise medical severity and grades.

## 5. Recommandations Thérapeutiques & Conseils d'Éducation
Create a tabular or clean list of specific endocrinology/diabetic foot education advices (Éducation Thérapeutique du Patient - ETP) for daily care based on their specific vulnerabilities.

Write exclusively in French. Use markdown styling, bolding, and premium spacing.
`

  const modelsToTry = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest']

  try {
    let lastError: unknown = null

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: clinicalPrompt,
        })

        if (response && response.text) {
          return Response.json({ report: response.text, isBackup: false, model: modelName })
        }
        throw new Error(`Model ${modelName} returned empty response`)
      } catch (err) {
        lastError = err
      }
    }

    throw lastError || new Error('All fallback models failed to generate content')
  } catch (error) {
    const backupReport = generateBackupLocalReport(patient, thyroid, foot)
    return Response.json({ report: backupReport, isBackup: true })
  }
}

export const config: Config = {
  path: '/api/generate-report',
  method: 'POST',
}

function generateBackupLocalReport(patient: any, thyroid: any, foot: any) {
  const hyperSigns = Object.entries(thyroid.hyper)
    .filter(([_, v]) => v)
    .map(([k]) => {
      const labels: Record<string, string> = {
        lossOfWeightWithPolyphagia: "amaigrissement avec polyphagie",
        diarrhea: "diarrhée",
        palpitations: "palpitations",
        sweats: "sueurs excessives",
        hairLoss: "alopécie/chute de cheveux",
        nervousness: "nervosité/irritabilité",
        insomnia: "insomnie"
      }
      return labels[k] || k
    })

  const hypoSigns = Object.entries(thyroid.hypo)
    .filter(([_, v]) => v)
    .map(([k]) => {
      const labels: Record<string, string> = {
        constipation: "constipation opiniâtre",
        weightGain: "prise de poids inexpliquée",
        coldIntolerance: "frilosité excessive",
        somnolence: "somnolence diurne",
        depression: "syndrome dépressif/ralentissement psychique",
        asthenia: "asthénie physique intense"
      }
      return labels[k] || k
    })

  const neuroSymptoms = Object.entries(foot.neuro)
    .filter(([_, v]) => v)
    .map(([k]) => {
      const labels: Record<string, string> = {
        paresthesia: "paresthésies à type de fourmillements",
        cottonWalking: "sensation de marcher sur du coton ou de la pierre",
        burns: "douleurs de type brûlures nocturnes",
        coldSensation: "sensation subjective de pieds glacés"
      }
      return labels[k] || k
    })

  const thyroidDiagnosis: string[] = []
  if (hyperSigns.length > 2) thyroidDiagnosis.push("Suspicion d'Hyperthyroïdie clinique (thyrotoxicose)")
  if (hypoSigns.length > 2) thyroidDiagnosis.push("Suspicion d'Hypothyroïdie clinique")
  if (thyroid.inspection.goitre === "Présent" || thyroid.palpation.thyroidPalpation === "Goitre") {
    thyroidDiagnosis.push("Goitre thyroïdien à explorer par échographie cervicale et bilan hormonal")
  } else if (thyroid.palpation.thyroidPalpation === "Tissu adipeux") {
    thyroidDiagnosis.push("Surcharge adipeuse baso-cervicale simulant un goitre (Pseudogoitré)")
  }
  if (thyroid.inspection.cushingoidAspect) {
    thyroidDiagnosis.push("Suspicion de Syndrome de Cushing ou d'imprégnation cortisonique à explorer")
  }
  if (thyroid.treatment === "Lévothyrox") {
    thyroidDiagnosis.push("Hypothyroïdie substituée sous Lévothyrox (à équilibrer par dosage TSH)")
  }

  const footDiagnosis: string[] = []
  const isNeuropathic = neuroSymptoms.length > 0 || foot.sensibility.tactile === "Altérée" || foot.sensibility.algesic === "Altérée"
  const isArteriopathic = foot.art.claudication || foot.palpation.pedalPulse === "Absent" || foot.palpation.pedalPulse === "Diminué" || foot.palpation.tibialPulse === "Absent"

  if (isNeuropathic && isArteriopathic) {
    footDiagnosis.push("Pied diabétique mixte (neuro-ischémique) à haut risque podologique")
  } else if (isNeuropathic) {
    footDiagnosis.push("Pied neuropathique pur (neuropathie diabétique sensitive distale symétrique)")
  } else if (isArteriopathic) {
    footDiagnosis.push("Suspicion d'Artériopathie Oblitérante des Membres Inférieurs (AOMI) chez le diabétique")
  } else {
    footDiagnosis.push("Pied diabétique de grade 0 (sensibilité et pouls conservés)")
  }

  if (foot.inspection.purpura) footDiagnosis.push("Purpura vasculaire des membres inférieurs à documenter")
  if (foot.inspection.intertrigo) footDiagnosis.push("Intertrigo inter-orteils (suspicion de dermo-mycose)")
  if (foot.inspection.hyperkeratosis) footDiagnosis.push("Hyperkératose plantaire mécanique (zone d'hyper-appui à décharger)")

  return `# 🗂️ FICHE D'OBSERVATION CLINIQUE (GÉNÉRATION LOCALE)

## 1. Informations Patient & Antécédents
Le/la patient(e) **${patient.name || "Anonyme"}**, âgé(e) de **${patient.name ? patient.age : "non renseigné"}** ans, de sexe **${patient.gender || "non spécifié"}**, a bénéficié d'une évaluation approfondie le **${patient.date || "ce jour"}**.

* **Antécédents Personnels** : ${patient.personalHistory || "Aucun antécédent médical notable signalé."}
* **Antécédents Familiaux** : ${patient.familyHistory || "Absence d'antécédents thyroïdiens ou métaboliques connus."}
* **Traitement Actuel** : ${patient.currentTreatment || "Aucune thérapeutique active."}

---

## 2. Examen de la Glande Thyroïde

### Interrogatoire (Signes fonctionnels)
* **Signes d'hyperactivité thyroïdienne (Hyperthyroïdie)** : ${hyperSigns.length > 0 ? "Présence de : " + hyperSigns.join(', ') + "." : "Absence de signes fonctionnels de thyrotoxicose."}
* **Signes de ralentissement thyroïdien (Hypothyroïdie)** : ${hypoSigns.length > 0 ? "Présence de : " + hypoSigns.join(', ') + "." : "Absence de signes d'hypothyroïdie clinique."}
* **Traitement en cours** : ${thyroid.treatment === "Lévothyrox" ? "Patient bénéficiant d'une hormonothérapie substitutive par Lévothyrox." : thyroid.treatment === "Autre" ? "Sous autre traitement thyroïdien." : "Aucun traitement thyroïdien spécifique."}

### Inspection Cervicale
* **Région antérieure du cou** : Le goitre est qualifié d'**${thyroid.inspection.goitre === "Présent" ? "Présent (tuméfaction baso-cervicale visible à l'extension du cou)" : "Absent"}**.
* **Signes cutanés et cutanéo-muqueux** :
  * Présence de rougeur inflammatoire : **${thyroid.inspection.redness ? "Oui" : "Non"}**
  * Présence d'une cicatrice de cervicotomie médiane : **${thyroid.inspection.scar ? "Oui" : "Non"}**
* **Signes faciaux et orbito-palpébraux** :
  * Infiltration palpébrale : **${thyroid.inspection.lidInfiltration ? "Oui" : "Non (absence de myxœdème palpébral)"}**
  * Exophtalmie bilatérale : **${thyroid.inspection.exophthalmos ? "Oui (signe de maladie de Basedow possible)" : "Non"}**
  * Faciès cushingoïde (visage lunaire, érythrosique, bosse de bison cervicale postérieure) : **${thyroid.inspection.cushingoidAspect ? "Oui (suggérant une imprégnation cortisonique ou syndrome de Cushing)" : "Non"}**

### Palpation Clinique
* **Technique médicale** : Réalisée de manière **${thyroid.palpation.technique}**.
* **Mobilité à la déglutition** : L'ascension thyroïdienne est jugée **${thyroid.palpation.swallowing === "Normale" ? "physiologique (normale)" : "altérée / difficile"}**.
* **Parenchyme palpé** : **${thyroid.palpation.thyroidPalpation === "Normale" ? "Souple, non nodulaire, homogène" : thyroid.palpation.thyroidPalpation === "Goitre" ? "Hypertrophie globale palpable" : "Tissu adipeux prédominant, rendant la délimitation de la glande ardue (chez patient à cou court)"}**.
* **Aires ganglionnaires cervicales** : **${thyroid.palpation.adenopathie === "Présentes" ? "Présence d'adénopathies cervicales à caractériser" : "Absence d'adénopathie cervicale palpable"}**.

### Auscultation Cervicale
* **Souffle thyroïdien** : **${thyroid.auscultation.souffle ? "Présence d'un souffle vasculaire continu à l'auscultation des lobes de la thyroïde" : "Auscultation muette (aucun souffle audible)"}**.

---

## 3. Examen du Pied Diabétique

### Interrogatoire (Neuropathie & Artériopathie)
* **Symptomatologie neuropathique fonctionnelle** : ${neuroSymptoms.length > 0 ? "Présence de : " + neuroSymptoms.join(', ') + "." : "Absence de troubles sensitifs paresthésiques."}
* **Symptomatologie artériopathique fonctionnelle** :
  * Claudication intermittente d'effort : **${foot.art.claudication ? "Oui (douleurs crampiformes nécessitant l'arrêt de la marche)" : "Non"}**
  * Douleurs osteo-articulaires chroniques : **${foot.art.jointPain ? "Oui (arthralgies mécaniques prédominantes)" : "Non"}**

### Inspection des Membres Inférieurs
* **Trophicité cutanée et phanères** :
  * Dépilation des pieds et des jambes : **${foot.inspection.hairlessSkin ? "Oui (signe d'insuffisance circulatoire)" : "Non"}**
  * Peau fine et luisante : **${foot.inspection.shinySkin ? "Oui" : "Non"}**
  * Œdème des pieds/chevilles : **${foot.inspection.edema ? "Oui" : "Non"}**
  * Éruption purpurique / taches purpuriques persistantes : **${foot.inspection.purpura ? "Oui (vascularite ou troubles microcirculatoires associés)" : "Non"}**
  * Intertrigo / macération interdigitale : **${foot.inspection.intertrigo ? "Oui (risque important de porte d'entrée infectieuse)" : "Non"}**
  * Hyperkératose / durillons plantaires : **${foot.inspection.hyperkeratosis ? "Oui (zones de friction chronique à haut risque d'ulcération)" : "Non"}**
* **Morphologie et squelette** :
  * Syndactylie congénitale : **${foot.inspection.syndactyly ? "Oui" : "Non"}**
  * Dysmorphie (déviations axiales, affaissement de la voûte plantaire) : **${foot.inspection.dysmorphia ? "Oui" : "Non (pieds harmonieux)"}**

### Palpation Circulatoire & Thermique
* **Signe du godet** : **${foot.palpation.godetSign === "Positif" ? "Positif (œdème prenant le godet aux chevilles)" : "Négatif (pas d'œdème)"}**.
* **Palpation des pouls périphériques** :
  * Pouls pédieux : **${foot.palpation.pedalPulse === "Présent" ? "Perçu bilatéralement et symétrique" : foot.palpation.pedalPulse === "Diminué" ? "Faiblement perçu (possible ischémie ou masqué par l'œdème)" : "Aboli (signe critique d'artériopathie)"}**
  * Pouls tibial postérieur : **${foot.palpation.tibialPulse === "Présent" ? "Perçu de façon satisfaisante" : foot.palpation.tibialPulse === "Diminué" ? "Atténué" : "Abolit"}**
* **Gradient thermique cutané** : **${foot.palpation.thermalGradient === "Normal" ? "Gradient physiologique conservé (chaleur décroissante en distalité)" : "Gradient perturbé (refroidissement excessif et asymétrique du pied par rapport au genou)"}**.

### Examen Neurologique et Sensibilité
* **Sensibilité Tactile (superficielle)** : **${foot.sensibility.tactile === "Normale" ? "Conservée au monofilament" : "Altérée (hypoesthésie tactile plantaire - Risque d'ulcération indolore)"}**.
* **Sensibilité Thermo-algésique** :
  * Douleur (Pique/Touche) : **${foot.sensibility.algesic === "Normale" ? "Discrimination intègre" : "Altérée / Confusionnelle (paresthésie douloureuse ou anesthésie)"}**
  * Thermique (Chaud/Froid) : **${foot.sensibility.thermal === "Normale" ? "Reconnaissance correcte" : "Altérée"}**
* **Sensibilité Proprioceptive / Profonde** : **${foot.sensibility.proprioceptive === "Conservée" ? "Intègre (arthrakinésie de l'hallux correctement identifiée yeux fermés)" : "Déficitaire"}**.

### Réflexes Ostéotendineux & Motricité
* **Réflexe achilléen** : **${foot.reflexes.achilleanReflex === "Présent" ? "Présent et symétrique" : foot.reflexes.achilleanReflex === "Diminué" ? "Diminué (hyporéflexie bilatérale)" : "Abolit (aréflexie achilléenne - typique de la polyneuropathie diabétique)"}**.
* **Motricité active intrinsèque** : **${foot.reflexes.motorFunction === "Normale" ? "Force motrice conservée" : "Pauvre ou diminuée contre résistance"}**.

---

## 4. Synthèse Clinique & Diagnostics Évoqués

### Diagnostics thyroïdiens évoqués :
${thyroidDiagnosis.map(d => `- **${d}**`).join('\n')}

### Complications podologiques diabétiques suspectées :
${footDiagnosis.map(d => `- **${d}**`).join('\n')}

---

## 5. Recommandations Thérapeutiques & Conseils d'Éducation (ETP)

* **Surveillance quotidienne** : Inspection journalière rigoureuse de la plante des pieds et des espaces interdigitaux à l'aide d'un miroir.
* **Hygiène podologique stricte** : Laver quotidiennement à l'eau tiède (vérifier la température de l'eau avec le coude, <37°C) et un savon doux. Sécher minutieusement à l'aide d'une serviette douce par tamponnement, sans frotter, surtout entre les orteils pour éviter l'intertrigo.
* **Prévention active des traumatismes** : Ne JAMAIS marcher pieds nus, même à domicile. Porter constamment des chaussettes propres en coton léger sans couture serrée.
* **Chaussage de protection** : Acheter des chaussures en fin de journée (quand le pied est plus gonflé). Utiliser des chaussures larges, sans coutures intérieures blessantes, et vérifier systématiquement l'absence de corps étrangers à l'intérieur avant de se chausser.
* **Prise en charge spécialisée** : Consultation régulière chez un pédicure-podologue formé au pied diabétique pour l'ablation atraumatique de l'hyperkératose. Ne jamais utiliser de kératolitiques chimiques ("coricides"), ni d'instruments tranchants (ciseaux, lames) par soi-même.
`
}
