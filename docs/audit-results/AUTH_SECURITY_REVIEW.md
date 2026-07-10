# Authentication Security Review

**Last Audit Date:** 2026-07-09

## Vulnerability Table

| Severity | File | Problem | Fix |
| :--- | :--- | :--- | :--- |
| Medium | src/app/api/auth/register/route.ts | Lack of Rate Limiting: Susceptible to spam/brute-force registration. | Implement rate-limiting (e.g., via Upstash or custom middleware). |
| Medium | src/app/api/auth/verify/route.ts | Lack of Rate Limiting: Susceptible to token probing/spam. | Implement rate-limiting per IP/email. |
| Medium | src/actions/auth.ts | Lack of Rate Limiting: Susceptible to email bombing/spam in forgotPassword. | Implement rate-limiting for the forgotPassword action. |
| Low | src/server/tokens.ts | Use of UUID v4 library: While secure, native crypto.randomUUID() is preferred for security tokens. | Replace uuidv4() with crypto.randomUUID(). |

## Passed Checks

- [x] **Password Hashing**: All passwords hashed with bcryptjs (10 rounds).
- [x] **Password Change Validation**: Current password verified before update.
- [x] **Token Expiration**: 1-hour TTL strictly validated for both verification and reset tokens.
- [x] **Token Single Use**: Tokens deleted immediately after successful use.
- [x] **User Enumeration**: Generic responses in forgotPassword flow prevent email discovery.
- [x] **Session Validation**: Profile actions use session-based IDs, preventing IDOR.
