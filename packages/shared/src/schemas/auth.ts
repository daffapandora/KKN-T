import { z } from 'zod';
import { USER_ROLES } from '../constants/roles';

// Indonesian phone number regex: starts with 08 or +628 or 628, followed by 8-12 digits
export const IndonesianPhoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;

export const RegisterCitizenSchema = z.object({
  name: z.string().min(2, 'Nama lengkap minimal 2 karakter').max(100),
  phone: z.string().regex(IndonesianPhoneRegex, 'Format nomor telepon/WhatsApp tidak valid (contoh: 08123456789)'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
  rt: z.string().min(1, 'RT wajib diisi').max(5),
  rw: z.string().min(1, 'RW wajib diisi').max(5),
  dusun: z.string().min(2, 'Nama dusun wajib diisi').max(50),
  inviteCode: z.string().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Persetujuan kebijakan privasi UU PDP wajib dicentang' }),
  }),
  turnstileToken: z.string().optional(),
});

export type RegisterCitizenInput = z.infer<typeof RegisterCitizenSchema>;

export const LoginSchema = z.object({
  phone: z.string().regex(IndonesianPhoneRegex, 'Nomor telepon tidak valid'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
  turnstileToken: z.string().optional(),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
});

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  phone: z.string(),
  role: z.enum([
    USER_ROLES.PUBLIC,
    USER_ROLES.CITIZEN,
    USER_ROLES.VALIDATOR,
    USER_ROLES.ADMIN,
  ]),
  rt: z.string().nullable().optional(),
  rw: z.string().nullable().optional(),
  status: z.string(),
  consentAt: z.string().datetime().nullable().optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
