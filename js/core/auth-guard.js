// Passport & Stamp Studio - Public User (Open Access, 100% Free & No Password Required)

export function isStudioAuthorized() {
  return true;
}

export function authorizeStudio() {
  return true;
}

export function revokeStudioAuth() {
  return true;
}

export async function verifyUserPassword() {
  return true;
}

export function setupAuthGuard() {
  // Public user portal is open for everyone. No lock screen or password check needed.
  return true;
}
