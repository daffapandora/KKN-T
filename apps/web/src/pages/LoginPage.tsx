import React, { useState } from 'react';
import { Button } from '@kemitir/ui';
import {
  ShieldCheck,
  Lock,
  Phone,
  User,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Check,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TurnstileBadge } from '../components/security/TurnstileBadge';

const DUSUN_OPTIONS = [
  'Dusun Kemitir Kidul',
  'Dusun Kemitir Lor',
  'Dusun Garon',
  'Dusun Weru',
  'Dusun Kaliduren',
];

const RT_OPTIONS = ['01', '02', '03', '04', '05'];
const RW_OPTIONS = ['01', '02', '03', '04'];

export const LoginPage: React.FC = () => {
  const { user: currentUser, isAuthenticated, login: authLogin, logout: authLogout } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dusun, setDusun] = useState(DUSUN_OPTIONS[0]);
  const [rt, setRt] = useState('01');
  const [rw, setRw] = useState('01');
  const [inviteCode, setInviteCode] = useState('');
  const [consent, setConsent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('1x00000000000000000000AA');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  // Normalize phone to format starting with 08
  const handlePhoneChange = (val: string) => {
    let clean = val.replace(/[^0-9+]/g, '');
    if (clean.startsWith('+62')) {
      clean = '0' + clean.slice(3);
    } else if (clean.startsWith('62')) {
      clean = '0' + clean.slice(2);
    }
    setPhone(clean);
  };

  const handleFillDemo = (demoPhone: string) => {
    setIsRegister(false);
    setPhone(demoPhone);
    setPassword('KemitirTangguh2026!');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!consent) {
          throw new Error('Persetujuan kebijakan privasi data UU PDP wajib dicentang.');
        }

        const res = await fetch('/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            phone,
            password,
            dusun,
            rt,
            rw,
            inviteCode: inviteCode.trim() ? inviteCode.trim() : undefined,
            consent: true,
            turnstileToken,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          const detailMsg = data.error?.details?.[0]?.issue || data.error?.message;
          throw new Error(detailMsg || 'Registrasi gagal. Periksa kembali format data Anda.');
        }

        if (data.data?.accessToken && data.data?.user) {
          authLogin(data.data.accessToken, data.data.user);
        } else {
          throw new Error(data.error?.message || 'Pendaftaran berhasil, tetapi sesi tidak dapat diinisialisasi.');
        }

        setSuccessMsg('Pendaftaran berhasil! Akun Anda telah aktif.');
        setTimeout(() => {
          navigate('/peta');
        }, 500);
      } else {
        const res = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, password, turnstileToken }),
        });

        const data = await res.json();
        if (!res.ok) {
          const detailMsg = data.error?.details?.[0]?.issue || data.error?.message;
          throw new Error(detailMsg || 'Nomor telepon atau kata sandi tidak cocok.');
        }

        if (data.data?.accessToken && data.data?.user) {
          authLogin(data.data.accessToken, data.data.user);
        } else {
          throw new Error(data.error?.message || 'Nomor telepon atau kata sandi tidak cocok.');
        }

        setSuccessMsg('Berhasil masuk! Mengarahkan ke dasbor...');
        setTimeout(() => {
          navigate('/dasbor');
        }, 500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi gangguan koneksi pada sistem verifikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-6 sm:py-16 flex items-start sm:items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full space-y-5 sm:space-y-8">
        
        {/* Header Portal Validator & Warga */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Portal Petugas & Warga
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Akses verifikasi laporan dan pemantauan mitigasi kekeringan Desa Kemitir
          </p>
        </div>

        {/* Active Session Status */}
        {isAuthenticated && currentUser && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-bold text-slate-900 block truncate">
                  {currentUser.name}
                </span>
                <span className="text-xs font-semibold text-emerald-800 block truncate">
                  {currentUser.role === 'validator'
                    ? `Validator Resmi (RT ${currentUser.rt || '-'} / RW ${currentUser.rw || '-'})`
                    : currentUser.role === 'admin'
                    ? 'Administrator Desa Kemitir'
                    : `Warga Terdaftar (${currentUser.dusun || 'Desa Kemitir'})`}
                </span>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button as={Link} to="/dasbor" variant="brand" size="sm" className="flex-1">
                Buka Dasbor & Verifikasi
              </Button>
              <Button type="button" onClick={authLogout} variant="secondary" size="sm">
                Keluar Akun
              </Button>
            </div>
          </div>
        )}

        {/* Tab Pilihan Masuk / Daftar */}
        <div className="bg-slate-200 p-1 rounded-2xl flex">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 min-h-[44px] px-2 rounded-xl text-sm font-semibold transition-colors ${
              !isRegister
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 min-h-[44px] px-2 rounded-xl text-sm font-semibold transition-colors ${
              isRegister
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Aktivasi Warga / Petugas
          </button>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 space-y-5 shadow-sm">
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
                  <label htmlFor="reg-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Nama Lengkap *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                    <input
                      type="text"
                      id="reg-name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full text-base pl-10 pr-4 min-h-[48px] rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-dusun" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Wilayah Dusun *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                    <select
                      id="reg-dusun"
                      value={dusun}
                      onChange={(e) => setDusun(e.target.value)}
                      className="w-full text-base pl-10 pr-4 min-h-[48px] rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                    >
                      {DUSUN_OPTIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg-rt" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      RT *
                    </label>
                    <select
                      id="reg-rt"
                      value={rt}
                      onChange={(e) => setRt(e.target.value)}
                      className="w-full text-base px-4 min-h-[48px] rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                    >
                      {RT_OPTIONS.map((num) => (
                        <option key={num} value={num}>
                          RT {num}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="reg-rw" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      RW *
                    </label>
                    <select
                      id="reg-rw"
                      value={rw}
                      onChange={(e) => setRw(e.target.value)}
                      className="w-full text-base px-4 min-h-[48px] rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                    >
                      {RW_OPTIONS.map((num) => (
                        <option key={num} value={num}>
                          RW {num}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-invite" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Kode Undangan Khusus (Opsional)
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                    <input
                      type="text"
                      id="reg-invite"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      placeholder="Contoh: KEMITIR-RT01"
                      className="w-full text-base pl-10 pr-4 min-h-[48px] rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                    />
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Diperlukan jika mendaftar sebagai Validator resmi RT/RW atau Satgas Bencana.
                  </span>
                </div>
              </>
            )}

            <div>
              <label htmlFor="login-phone" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Nomor Telepon / WhatsApp *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                <input
                  type="tel"
                  id="login-phone"
                  required
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="081234567890"
                  className="w-full text-base pl-10 pr-4 min-h-[48px] rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                Format nomor Indonesia (diawali 08...). Sesuai standar privasi UU PDP.
              </span>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Kata Sandi *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                <input
                  type="password"
                  id="login-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full text-base pl-10 pr-4 min-h-[48px] rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>
            </div>

            {isRegister && (
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-600 leading-normal">
                    Saya menyetujui pengelolaan data secara aman sesuai prinsip privasi{' '}
                    <strong className="text-slate-800 font-medium">UU PDP No. 27/2022</strong> demi keperluan penanggulangan kekeringan Desa Kemitir.
                  </span>
                </label>
              </div>
            )}

            <TurnstileBadge onVerify={setTurnstileToken} className="mt-2" />

            <Button
              type="submit"
              variant="brand"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
            >
              <span>{isRegister ? 'Aktivasi Akun Desa' : 'Masuk ke Portal'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </form>

          {/* Akses Cepat Petugas Pengujian (Demo / KKN Evaluation) */}
          {!isRegister && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">
                Uji Coba Cepat (Akun Uji Lapangan):
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('081234567891')}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Validator: 081234567891
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('081234567890')}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Admin: 081234567890
                </button>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link to="/peta" className="inline-flex items-center min-h-[44px] px-3 text-sm font-semibold text-slate-600 hover:text-slate-900">
              Kembali ke Peta Publik
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
