# Specification

## Summary
**Goal:** Create a private, members-only website where access is restricted to the owner and explicitly invited friends using Internet Identity.

**Planned changes:**
- Add Internet Identity sign-in gating so unauthenticated users only see a dedicated sign-in screen.
- Implement backend authorization using an owner Principal plus an allowlist of permitted Principals; enforce allowlist checks on all private backend methods.
- Build an owner-only admin/invite UI to view the allowlist and add/remove friend Principals; block non-owners from using admin features.
- Add a consistent members-only visual theme across sign-in, unauthorized, and admin screens (avoiding blue/purple as primary colors).
- Include and reference required static theme images from `frontend/public/assets/generated` on sign-in/unauthorized screens.

**User-visible outcome:** Visitors must sign in with Internet Identity; invited users can access the private site, uninvited users see a clear “not invited” message, and the owner can manage invited friends from an admin screen.
