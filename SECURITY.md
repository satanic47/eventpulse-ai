# Security Policy & Vulnerability Reporting

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :white_check_mark: |

## Security Architecture & Defenses

EventPulse AI implements defense-in-depth principles:

1. **Strict Input Sanitization:**
   - All text inputs (celebration titles, event vibes, copilot questions) are stripped of HTML tags, script tags, and SQL/NoSQL injection tokens via regex sanitizers prior to processing.
2. **Pydantic Schema Validation:**
   - Strict range constraints on numeric inputs (guests: `1 <= n <= 10,000`, budget: `$100 <= b <= $10,000,000`, duration: `1 <= h <= 48`).
3. **Hardened HTTP Security Headers:**
   - `X-Content-Type-Options: nosniff` (MIME-sniffing prevention)
   - `X-Frame-Options: DENY` (Clickjacking prevention)
   - `X-XSS-Protection: 1; mode=block` (Reflected cross-site scripting filter)
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Content-Security-Policy (CSP)`: Restricted script, image, and font evaluation origins.
4. **Zero-Secret Client Footprint:**
   - No private API keys or database connection strings are exposed in client-side bundles.

## Reporting a Vulnerability

If you discover a security vulnerability, please submit an issue or email `security@eventpulse-ai.app` with:
- Description of the vulnerability and attack vector.
- Steps or code to reproduce.
- Potential impact.

We respond to security disclosures within 24 hours.
