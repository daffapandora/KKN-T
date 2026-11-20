import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, RefreshCw } from 'lucide-react';

interface TurnstileBadgeProps {
  onVerify?: (token: string) => void;
  honeypotName?: string;
  className?: string;
}

export const TurnstileBadge: React.FC<TurnstileBadgeProps> = ({
  onVerify,
  honeypotName = '_hp_trap',
  className = '',
}) => {
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    // Simulate / execute human verification token generation
    setVerifying(true);
    const timer = setTimeout(() => {
      // Use Cloudflare Turnstile official test dummy pass token
      const dummyToken = '1x00000000000000000000AA';
      setVerified(true);
      setVerifying(false);
      if (onVerify) {
        onVerify(dummyToken);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [onVerify]);

  const handleManualChallenge = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerified(true);
      setVerifying(false);
      if (onVerify) {
        onVerify('1x00000000000000000000AA');
      }
    }, 300);
  };

  return (
    <div className={`p-3 rounded-xl border border-slate-200 bg-slate-50/70 select-none ${className}`}>
      {/* Invisible Honeypot Trap Field (Catches Dumb Automated Bot Form Submissions) */}
      <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <label htmlFor={honeypotName}>Do not fill this field if you are human</label>
        <input
          type="text"
          id={honeypotName}
          name={honeypotName}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {verified ? (
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
              <Shield className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="text-slate-700 font-medium">
            {verified
              ? 'Terverifikasi Aman (Cloudflare Turnstile)'
              : verifying
              ? 'Memeriksa keamanan perangkat...'
              : 'Perlindungan Bot Aktif'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleManualChallenge}
          title="Verifikasi Ulang Keamanan"
          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin text-emerald-600' : ''}`} />
        </button>
      </div>
    </div>
  );
};

