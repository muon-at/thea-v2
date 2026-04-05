'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    agentName: '',
    tone: 'professional',
    signature: '',
    emailProvider: '',
  });

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#f1f5f9', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <style>{`
        .onboarding-container { max-width: 600px; width: 100%; }
        .progress-bar { display: flex; gap: 0.5rem; margin-bottom: 2rem; }
        .progress-step { flex: 1; height: 4px; background: #334155; border-radius: 2px; transition: all 0.3s; }
        .progress-step.active { background: #10b981; }
        .progress-step.completed { background: #10b981; }
        .onboarding-card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 2rem; }
        .step-title { font-family: 'Instrument Serif', serif; font-size: 1.75rem; margin-bottom: 0.5rem; color: #f1f5f9; }
        .step-description { color: #94a3b8; margin-bottom: 2rem; font-size: 1rem; }
        .form-group { margin-bottom: 1.5rem; }
        .form-label { display: block; font-weight: 500; margin-bottom: 0.75rem; color: #f1f5f9; }
        .form-input { width: 100%; padding: 0.75rem; border: 1px solid #334155; background: #0f172a; color: #f1f5f9; border-radius: 6px; font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .form-input:focus { outline: none; border-color: #10b981; }
        .form-select { width: 100%; padding: 0.75rem; border: 1px solid #334155; background: #0f172a; color: #f1f5f9; border-radius: 6px; font-family: 'DM Sans', sans-serif; }
        .form-select:focus { outline: none; border-color: #10b981; }
        .button-group { display: flex; gap: 1rem; justify-content: space-between; margin-top: 2rem; }
        .btn { padding: 0.75rem 1.5rem; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .btn-primary { background: #10b981; color: white; flex: 1; }
        .btn-primary:hover { background: #059669; }
        .btn-secondary { background: transparent; color: #cbd5e1; border: 1px solid #334155; }
        .btn-secondary:hover { border-color: #10b981; color: #10b981; }
        .checklist { list-style: none; padding: 0; }
        .checklist li { padding: 0.75rem 0; border-bottom: 1px solid #334155; display: flex; align-items: center; gap: 0.75rem; }
        .checklist li:last-child { border-bottom: none; }
        .checklist-icon { font-size: 1.5rem; }
      `}</style>

      <div className="onboarding-container">
        <div className="progress-bar">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`progress-step ${s <= step ? 'active' : ''} ${s < step ? 'completed' : ''}`}
            />
          ))}
        </div>

        <div className="onboarding-card">
          {step === 1 && (
            <>
              <h1 className="step-title">Velkommen til Thea! 👋</h1>
              <p className="step-description">La oss sette opp agenten din på 5 minutter</p>
              
              <ul className="checklist">
                <li><span className="checklist-icon">✓</span> Konfigurer bedriftsinformasjon</li>
                <li><span className="checklist-icon">✓</span> Lag din personlig agent</li>
                <li><span className="checklist-icon">✓</span> Koble til e-postkonto</li>
                <li><span className="checklist-icon">✓</span> Sett tone og stil</li>
                <li><span className="checklist-icon">✓</span> Ferdig!</li>
              </ul>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="step-title">Bedriftsinformasjon</h1>
              <p className="step-description">Hva heter bedriften din?</p>
              
              <div className="form-group">
                <label className="form-label">Bedriftsnavn</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="f.eks. Acme Corp"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="step-title">Agentens navn</h1>
              <p className="step-description">Hva skal agenten hete?</p>
              
              <div className="form-group">
                <label className="form-label">Agent navn</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="f.eks. Alex"
                  value={formData.agentName}
                  onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                />
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h1 className="step-title">Agent Tone</h1>
              <p className="step-description">Hvordan skal agenten snakke?</p>
              
              <div className="form-group">
                <label className="form-label">Tone</label>
                <select
                  className="form-select"
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                >
                  <option value="professional">Profesjonell</option>
                  <option value="friendly">Vennlig</option>
                  <option value="casual">Uformell</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">E-postsignatur (valgfritt)</label>
                <textarea
                  className="form-input"
                  placeholder="Din signatur her"
                  value={formData.signature}
                  onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                  style={{ minHeight: '80px', fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <h1 className="step-title">Ferdig! 🎉</h1>
              <p className="step-description">Din agent er nå klar til bruk</p>
              
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>Neste steg:</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ padding: '0.5rem 0', color: '#cbd5e1' }}>1. Gå til Integrasjoner</li>
                  <li style={{ padding: '0.5rem 0', color: '#cbd5e1' }}>2. Koble Gmail eller Outlook</li>
                  <li style={{ padding: '0.5rem 0', color: '#cbd5e1' }}>3. Agenten begynner å behandle e-poster</li>
                </ul>
              </div>
            </>
          )}

          <div className="button-group">
            {step > 1 && (
              <button className="btn btn-secondary" onClick={handleBack}>
                Tilbake
              </button>
            )}
            <button 
              className="btn btn-primary" 
              onClick={handleNext}
              style={{ marginLeft: step === 1 ? 'auto' : '0' }}
            >
              {step === 5 ? 'Gå til Dashboard' : 'Neste'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
