import React, { useState } from 'react';
import { Card, Button } from '@kemitir/ui';
import { ShieldCheck, Lock, Mail, KeyRound, ArrowRight, CheckCircle2, AlertCircle, Compass } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'validator' | 'official'>('validator');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await fetch('/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            fullName,
            role,
            inviteCode,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error?.message || 'Registrasi gagal. Periksa kembali data Anda.');
        }

        setSuccessMsg('Registrasi berhasil! Silakan masuk dengan akun baru Anda.');
        setIsRegister(false);
      } else {
        const res = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error?.message || 'Email atau kata sandi tidak cocok.');
        }

        setSuccessMsg('Berhasil masuk! Mengarahkan ke peta pantauan...');
        setTimeout(() => {
          navigate('/peta');
        }, 800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan pada sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50/60 py-16 flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full space-y-8">
        
        {/* Apple Portal Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Portal Validator Desa Kemitir
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Akses khusus Perangkat Desa, Pengurus RT/RW, dan Satgas Bencana
          </p>
        </div>

        {/* Apple Segmented Auth Tab */}
        <div className="bg-slate-200/80 p-1 rounded-2xl flex">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              !isRegister
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Masuk Petugas
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              isRegister
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Aktivasi Akun Baru
          </button>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Budi Santoso (Kadus Kidul)"
                    className="w-full text-sm sm:text-base px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Peran / Kewenangan *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full text-sm sm:text-base px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                  >
                    <option value="validator">Validator Lapangan (RT / RW / Satgas)</option>
                    <option value="official">Pejabat Desa / BPBD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Kode Undangan Resmi *
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      placeholder="Masukkan kode undangan verifikasi"
                      className="w-full text-sm sm:text-base pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                    />
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Diperoleh dari Sekretaris Desa / KKN Tematik UNDIP
                  </span>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Alamat Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@kemitir.desa.id"
                  className="w-full text-sm sm:text-base pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Kata Sandi *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full text-sm sm:text-base pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="brand"
              size="lg"
              className="w-full font-bold shadow-md mt-2"
              isLoading={loading}
            >
              <span>{isRegister ? 'Aktivasi Akun Validator' : 'Masuk ke Portal Verifikasi'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link to="/peta" className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900">
              ← Kembali ke Peta Publik
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
