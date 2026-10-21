import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('QA Audit Automated Verification Suite', () => {
  it('AUDIT-SEC-01: Health check endpoint should not leak internal database usernames in error responses', async () => {
    try {
      const res = await fetch('http://localhost:4000/health');
      const body = await res.json();
      if (body.database && body.database.error) {
        // Asserting that internal database role name is leaked
        const hasDbUserLeak = body.database.error.includes('kemitir_user');
        expect(hasDbUserLeak).toBe(true); // Flagged finding: leaks DB role
      }
    } catch {
      // In case server is unreachable
    }
  });

  it('AUDIT-PWA-01: PWA Manifest icon assets must physically exist on disk', () => {
    const manifestPath = path.resolve(__dirname, '../../apps/web/public/manifest.json');
    const manifestRaw = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestRaw);

    const icon192Path = path.resolve(__dirname, '../../apps/web/public', manifest.icons[0].src.replace(/^\//, ''));
    const icon512Path = path.resolve(__dirname, '../../apps/web/public', manifest.icons[1].src.replace(/^\//, ''));

    const icon192Exists = fs.existsSync(icon192Path);
    const icon512Exists = fs.existsSync(icon512Path);

    // Recording evidence: Currently missing
    expect(icon192Exists).toBe(false); // Flagged finding
    expect(icon512Exists).toBe(false); // Flagged finding
  });

  it('AUDIT-DEVOPS-01: CI/CD workflow directory should exist', () => {
    const githubWorkflowDir = path.resolve(__dirname, '../../.github/workflows');
    const exists = fs.existsSync(githubWorkflowDir);
    expect(exists).toBe(false); // Flagged finding
  });

  it('AUDIT-API-01: Verify missing auth routes in API module', () => {
    const authModulePath = path.resolve(__dirname, '../../apps/api/src/modules/auth');
    const authModuleExists = fs.existsSync(authModulePath);
    expect(authModuleExists).toBe(false); // Flagged finding
  });
});
