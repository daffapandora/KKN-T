import { config } from '../../config';

export interface TurnstileVerifyResult {
  success: boolean;
  error?: string;
  challengeTs?: string;
  hostname?: string;
}

/**
 * Validates Cloudflare Turnstile token via Cloudflare Siteverify API.
 * Ensures automated bot traffic cannot submit forms or perform credential attacks.
 */
export async function verifyTurnstileToken(
  token?: string,
  remoteIp?: string
): Promise<TurnstileVerifyResult> {
  // If turnstile is disabled or in test mode without token, allow
  if (!config.TURNSTILE_ENABLED) {
    // If a token is provided in dev/test, test tokens starting with 1x or dummy pass
    if (!token || token.startsWith('1x') || token === 'dummy-turnstile-token') {
      return { success: true, hostname: 'localhost' };
    }
    if (token === 'fail-turnstile-token' || token === 'invalid') {
      return { success: false, error: 'Token Turnstile tidak valid (test failure)' };
    }
    return { success: true };
  }

  // In production / enabled mode, token is strictly required
  if (!token) {
    return {
      success: false,
      error: 'Token verifikasi manusia (Cloudflare Turnstile) wajib disertakan.',
    };
  }

  // Allow Cloudflare official dummy pass token in dev/test keys
  if (config.CLOUDFLARE_TURNSTILE_SECRET_KEY.startsWith('1x') && (token.startsWith('1x') || token === 'dummy-turnstile-token')) {
    return { success: true, hostname: 'desakemitir.id' };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', config.CLOUDFLARE_TURNSTILE_SECRET_KEY);
    formData.append('response', token);
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return {
        success: false,
        error: `Cloudflare verify API returned status ${res.status}`,
      };
    }

    const data: any = await res.json();

    if (data.success) {
      return {
        success: true,
        challengeTs: data.challenge_ts,
        hostname: data.hostname,
      };
    } else {
      const errCode = (data['error-codes'] || []).join(', ');
      return {
        success: false,
        error: `Verifikasi bot gagal: ${errCode || 'Tantangan interaksi tidak valid'}`,
      };
    }
  } catch (err: any) {
    // Handle network timeout or blip defensively
    if (err.name === 'AbortError') {
      return {
        success: false,
        error: 'Verifikasi Cloudflare Turnstile batas waktu (timeout). Silakan ulangi.',
      };
    }
    return {
      success: false,
      error: err.message || 'Gagal menghubungi layanan verifikasi bot Cloudflare.',
    };
  }
}

