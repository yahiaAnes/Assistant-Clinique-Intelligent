import React, { useRef } from "react";
import { FileText, Printer, Sparkles, Clipboard, CheckCircle, RefreshCw, AlertCircle } from "lucide-react";

interface ReportViewerProps {
  reportText: string;
  isGenerating: boolean;
  onRegenerate: () => void;
  isBackup?: boolean;
}

export default function ReportViewer({ reportText, isGenerating, onRegenerate, isBackup }: ReportViewerProps) {
  const paperRef = useRef<HTMLDivElement>(null);

  // Elegant Print handler that creates a beautiful print experience
  const handlePrint = () => {
    const printContent = paperRef.current?.innerHTML;
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    
    // Create custom print styling to ensure maximum resolution and hospital-sheet design
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Fiche d'observation Clinique</title>
            <style>
              body {
                font-family: 'Helvetica Neue', Arial, sans-serif;
                color: #0c1a30;
                padding: 40px;
                line-height: 1.5;
                background-color: #ffffff;
              }
              h1 {
                font-size: 24px;
                color: #0f766e;
                border-bottom: 2px solid #0d9488;
                padding-bottom: 8px;
                margin-top: 30px;
              }
              h2 {
                font-size: 18px;
                color: #115e59;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 5px;
                margin-top: 25px;
              }
              h3 {
                font-size: 14px;
                color: #0f172a;
                margin-top: 15px;
              }
              p {
                font-size: 13px;
                margin: 8px 0;
              }
              ul {
                margin: 10px 0;
                padding-left: 20px;
              }
              li {
                font-size: 13px;
                margin-bottom: 5px;
              }
              hr {
                border: 0;
                border-top: 1px solid #cbd5e1;
                margin: 20px 0;
              }
              .header-meta {
                display: flex;
                justify-content: space-between;
                border-bottom: 3px double #0d9488;
                padding-bottom: 15px;
                margin-bottom: 30px;
              }
              .header-meta .hospital {
                font-weight: bold;
                font-size: 14px;
                color: #115e59;
              }
              .header-meta .date {
                font-size: 12px;
                color: #64748b;
              }
              @media print {
                body { padding: 0; }
                button { display: none !important; }
              }
            </style>
          </head>
          <body>
            <div class="header-meta">
              <div>
                <div class="hospital">CENTRE HOSPITALIER UNIVERSITAIRE (CHU)</div>
                <div style="font-size: 11px; color: #475569;">Service de Médecine Interne et Endocrinologie</div>
              </div>
              <div class="date" style="text-align: right;">
                <div>FICHE D'OBSERVATION MÉDICALE</div>
                <div style="font-size: 10px;">Généré le ${new Date().toLocaleDateString('fr-FR')}</div>
              </div>
            </div>
            <div>${printContent}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  // Compile-safe, lightweight, custom markdown-to-React elements parser
  const renderFormattedReport = (text: string) => {
    if (!text) return null;

    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Trim line
      const trimmed = line.trim();

      // Heading 1 (#)
      if (trimmed.startsWith("# ")) {
        return (
          <h1 key={idx} className="text-xl md:text-2xl font-extrabold text-blue-900 border-b-2 border-blue-600 pb-2 mt-6 mb-3 font-sans">
            {trimmed.replace("# ", "")}
          </h1>
        );
      }

      // Heading 2 (##)
      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-md md:text-lg font-bold text-slate-850 border-b border-slate-200 pb-1 mt-5 mb-2 font-sans">
            {trimmed.replace("## ", "")}
          </h2>
        );
      }

      // Heading 3 (###)
      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-sm font-bold text-slate-800 mt-4 mb-2 font-sans">
            {trimmed.replace("### ", "")}
          </h3>
        );
      }

      // Horizontal break (---)
      if (trimmed === "---" || trimmed === "------------------") {
        return <hr key={idx} className="border-t border-slate-200 my-4" />;
      }

      // Bullet List (- or *)
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        // Parse bold symbols inside list items
        const rawContent = trimmed.substring(2);
        const boldParts = rawContent.split("**");
        return (
          <li key={idx} className="text-xs text-slate-705 ml-4 list-disc marker:text-blue-600 pl-1 mb-1.5 leading-relaxed font-sans">
            {boldParts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-semibold text-slate-900">{part}</strong> : part)}
          </li>
        );
      }

      // Empty line
      if (!trimmed) {
        return <div key={idx} className="h-2" />;
      }

      // Normal paragraph
      const boldParts = trimmed.split("**");
      return (
        <p key={idx} className="text-xs text-slate-705 leading-relaxed font-sans my-1">
          {boldParts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-semibold text-slate-900">{part}</strong> : part)}
        </p>
      );
    });
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(reportText);
    alert("Texte copié avec succès dans le presse-papiers !");
  };

  return (
    <div className="space-y-6">
      {/* Top action header for report controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white/35 backdrop-blur-xl border border-white/50 rounded-2xl gap-3 shadow-md">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-blue-600" />
            <span>Fiche Clinique d'Observation Prête</span>
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            Vous pouvez l'imprimer, l'exporter au format PDF ou la copier.
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            type="button"
            id="report-copy-btn"
            onClick={handleCopyClipboard}
            className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold bg-white/50 hover:bg-white/70 border border-slate-200 rounded-lg text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer backdrop-blur-md"
          >
            <Clipboard className="h-3.5 w-3.5" />
            <span>Copier</span>
          </button>

          <button
            type="button"
            id="report-regenerate-btn"
            onClick={onRegenerate}
            className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold bg-white/50 hover:bg-white/70 border border-slate-200 rounded-lg text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer backdrop-blur-md"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Régénérer</span>
          </button>

          <button
            type="button"
            id="report-print-btn"
            disabled={isGenerating}
            onClick={handlePrint}
            className="flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md disabled:opacity-50"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Exporter en PDF / Imprimer</span>
          </button>
        </div>
      </div>

      {isBackup && (
        <div className="bg-amber-50/40 backdrop-blur-md border border-amber-100/50 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-amber-805">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900">Mode d'évaluation hors ligne (Synthèse locale)</p>
            <p className="leading-relaxed mt-0.5">
              Le rapport a été généré localement de manière structurée car la clef d'accès Gemini est absente ou désactivée. 
              Configurez-la via le menu "Secrets" pour bénéficier de synthèses médicales avancées rédigées par l'IA.
            </p>
          </div>
        </div>
      )}

      {/* Hospital Sheet Presentation */}
      <div className="relative bg-white border border-slate-250 shadow-lg rounded-2xl overflow-hidden print:border-none print:shadow-none">
        
        {/* Academic Medical Sheet Header Accent */}
        <div className="bg-gradient-to-r from-slate-800 to-blue-900 text-white p-5 flex justify-between items-center print:hidden">
          <div className="space-y-1">
            <div className="text-xs font-bold tracking-widest text-blue-200">OBSERVATION CLINIQUE ACADÉMIQUE</div>
            <div className="text-sm font-semibold">Service d'Endocrinologie - Faculté des Sciences Médicales</div>
          </div>
          <CheckCircle className="h-8 w-8 text-blue-300" />
        </div>

        {/* Paper Sheet Padding */}
        <div 
          ref={paperRef} 
          className="p-6 md:p-10 font-sans space-y-2 bg-white print:p-0 select-text selection:bg-blue-100"
        >
          {renderFormattedReport(reportText)}
        </div>
      </div>
    </div>
  );
}
