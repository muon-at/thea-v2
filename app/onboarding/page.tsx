'use client';

import { useState } from 'react';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    companyName: '',
    companyEmail: '',
    agentName: '',
    agentTone: 'professional',
    primaryEmail: '',
    primaryEmailPassword: '',
    integrations: [],
  });

  const handleNext = () => {
    if (step < 7) setStep(step + 1);
    else window.location.href = '/dashboard';
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateForm = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const progress = (step / 7) * 100;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1a2c4a 100%)', color: '#f1f5f9', fontFamily: "'DM Sans', sans-serif", padding: '2rem' }}>
      <style>{`
        .onboarding-container {
          max-width: 600px;
          margin: 0 auto;
          background: #1e293b;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          overflow: hidden;
          border: 1px solid #334155;
        }
        
        .onboarding-header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          padding: 2rem;
          text-align: center;
          border-bottom: 1px solid #334155;
        }
        
        .onboarding-logo {
          font-family: 'Instrument Serif', serif;
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: white;
        }
        
        .onboarding-subtitle {
          color: rgba(255,255,255,0.9);
          font-size: 0.95rem;
        }
        
        .progress-bar {
          height: 4px;
          background: #334155;
          position: relative;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981 0%, #059669 100%);
          transition: width 0.3s ease;
        }
        
        .onboarding-content {
          padding: 2.5rem;
          min-height: 400px;
        }
        
        .step-title {
          font-family: 'Instrument Serif', serif;
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
          color: #f1f5f9;
        }
        
        .step-desc {
          color: #cbd5e1;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.75rem;
          color: #cbd5e1;
        }
        
        .form-input, .form-select {
          width: 100%;
          padding: 1rem;
          background: #0f172a;
          border: 2px solid #334155;
          border-radius: 8px;
          color: #f1f5f9;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          transition: all 0.2s;
        }
        
        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }
        
        .checkbox-group {
          display: flex;
          align-items: center;
          padding: 1rem;
          background: #0f172a;
          border: 2px solid #334155;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 0.75rem;
        }
        
        .checkbox-group:hover {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }
        
        .checkbox-group input {
          margin-right: 1rem;
          cursor: pointer;
          width: 20px;
          height: 20px;
        }
        
        .checkbox-label {
          flex: 1;
          cursor: pointer;
        }
        
        .checkbox-label-title {
          font-weight: 500;
          color: #f1f5f9;
        }
        
        .checkbox-label-desc {
          font-size: 0.85rem;
          color: #94a3b8;
          margin-top: 0.25rem;
        }
        
        .onboarding-footer {
          padding: 2rem;
          background: #0f172a;
          border-top: 1px solid #334155;
          display: flex;
          gap: 1rem;
          justify-content: space-between;
        }
        
        .btn {
          padding: 1rem 2rem;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        
        .btn-secondary {
          background: transparent;
          color: #cbd5e1;
          border: 2px solid #334155;
        }
        
        .btn-secondary:hover {
          border-color: #10b981;
          color: #10b981;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          flex: 1;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
        }
        
        .btn-primary:disabled {
          background: #64748b;
          cursor: not-allowed;
          transform: none;
        }
        
        .step-counter {
          text-align: center;
          color: #94a3b8;
          font-size: 0.9rem;
          margin-top: 1.5rem;
        }
      `}</style>

      <div className="onboarding-container">
        <div className="onboarding-header">
          <div className="onboarding-logo">🚀 Thea</div>
          <p className="onboarding-subtitle">Sett opp din AI email agent på 5 minutter</p>
        </div>
        
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="onboarding-content">
          {/* Step 1: Bedriftsnavn */}
          {step === 1 && (
            <>
              <h2 className="step-title">Bedriftsinfo</h2>
              <p className="step-desc">Fortell oss om bedriften din</p>
              
              <div className="form-group">
                <label className="form-label">Bedriftsnavn</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="f.eks. Din Bedrift AS"
                  value={formData.companyName}
                  onChange={(e) => updateForm('companyName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bedrifts-e-postadresse</label>
                <input 
                  type="email" 
                  className="form-input"
                  placeholder="hallo@dinbedrift.no"
                  value={formData.companyEmail}
                  onChange={(e) => updateForm('companyEmail', e.target.value)}
                />
              </div>
            </>
          )}

          {/* Step 2: Agent navn og tone */}
          {step === 2 && (
            <>
              <h2 className="step-title">Agentinnstillinger</h2>
              <p className="step-desc">Tilpass agenten til ditt brand</p>
              
              <div className="form-group">
                <label className="form-label">Agentens navn</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="f.eks. Thea"
                  value={formData.agentName}
                  onChange={(e) => updateForm('agentName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Agentens tone</label>
                <select 
                  className="form-select"
                  value={formData.agentTone}
                  onChange={(e) => updateForm('agentTone', e.target.value)}
                >
                  <option value="professional">Profesjonell</option>
                  <option value="friendly">Vennlig</option>
                  <option value="casual">Uformell</option>
                  <option value="technical">Teknisk</option>
                </select>
              </div>
            </>
          )}

          {/* Step 3: Primær e-post */}
          {step === 3 && (
            <>
              <h2 className="step-title">Primær e-postkonto</h2>
              <p className="step-desc">Koble til din e-postkonto for at agenten skal fungere</p>
              
              <div className="form-group">
                <label className="form-label">E-postadresse</label>
                <input 
                  type="email" 
                  className="form-input"
                  placeholder="bruker@gmail.com eller bruker@outlook.com"
                  value={formData.primaryEmail}
                  onChange={(e) => updateForm('primaryEmail', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Passord eller App-passord</label>
                <input 
                  type="password" 
                  className="form-input"
                  placeholder="••••••••••••••••"
                  value={formData.primaryEmailPassword}
                  onChange={(e) => updateForm('primaryEmailPassword', e.target.value)}
                />
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.75rem' }}>
                  💡 For Gmail: Bruk <a href="#" style={{ color: '#10b981' }}>App Password</a>. For Outlook: Bruk passord eller 2-faktor-kode.
                </p>
              </div>
            </>
          )}

          {/* Step 4: Integrasjoner */}
          {step === 4 && (
            <>
              <h2 className="step-title">Integrering</h2>
              <p className="step-desc">Koble til andre tjenester (valgfritt)</p>
              
              {['Slack', 'Zapier', 'Google Drive', 'Airtable'].map((int) => (
                <label key={int} className="checkbox-group">
                  <input 
                    type="checkbox" 
                    checked={formData.integrations.includes(int)}
                    onChange={(e: any) => {
                      if (e.target.checked) {
                        updateForm('integrations', [...(formData.integrations || []), int]);
                      } else {
                        updateForm('integrations', (formData.integrations || []).filter((i: string) => i !== int));
                      }
                    }}
                  />
                  <div className="checkbox-label">
                    <div className="checkbox-label-title">{int}</div>
                    <div className="checkbox-label-desc">Integrer med {int}</div>
                  </div>
                </label>
              ))}
            </>
          )}

          {/* Step 5: Training */}
          {step === 5 && (
            <>
              <h2 className="step-title">Trening</h2>
              <p className="step-desc">Thea lærer av din e-posthistorikk</p>
              
              <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '2px solid #334155', marginBottom: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>Analyserer e-posthistorikk...</p>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Dette tar ca. 1-2 minutter</p>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', padding: '1rem', borderRadius: '8px', color: '#cbd5e1' }}>
                ✓ Agenten er nå trent på din kommunikasjonsstil og kan svare på e-poster
              </div>
            </>
          )}

          {/* Step 6: Gjennomgang */}
          {step === 6 && (
            <>
              <h2 className="step-title">Gjennomgang</h2>
              <p className="step-desc">Verifiser at alt er riktig</p>
              
              <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '2px solid #334155', marginBottom: '1.5rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Bedrift</div>
                  <div style={{ color: '#f1f5f9', fontWeight: 600 }}>{formData.companyName || 'Din Bedrift'}</div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Agent</div>
                  <div style={{ color: '#f1f5f9', fontWeight: 600 }}>{formData.agentName || 'Thea'} ({formData.agentTone})</div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>E-post</div>
                  <div style={{ color: '#f1f5f9', fontWeight: 600 }}>{formData.primaryEmail || 'Ikke lagt inn'}</div>
                </div>

                {formData.integrations.length > 0 && (
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Integrering</div>
                    <div style={{ color: '#f1f5f9', fontWeight: 600 }}>{formData.integrations.join(', ')}</div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Step 7: Velkomst */}
          {step === 7 && (
            <>
              <h2 className="step-title">Velkommen! 🎉</h2>
              <p className="step-desc">Din AI email agent er nå klar</p>
              
              <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)', padding: '2rem', borderRadius: '8px', border: '2px solid #10b981', textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚀</div>
                <p style={{ color: '#f1f5f9', marginBottom: '1rem', fontSize: '1.1rem' }}>Oppsettet er komplett!</p>
                <p style={{ color: '#cbd5e1' }}>Din agent svarer nå automatisk på e-poster. Gå til dashboarden for å monitor og fine-tune.</p>
              </div>
            </>
          )}

          <div className="step-counter">Steg {step} av 7</div>
        </div>

        <div className="onboarding-footer">
          <button className="btn btn-secondary" onClick={handlePrev} disabled={step === 1}>
            ← Tilbake
          </button>
          <button className="btn btn-primary" onClick={handleNext}>
            {step === 7 ? 'Gå til dashboard' : 'Neste'} →
          </button>
        </div>
      </div>
    </div>
  );
}
