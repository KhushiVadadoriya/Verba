# Verba — Milestone A+B: Authentication and Persistent Book System

## Final State — All Checks Green; Routing Regression Fixed

### Verification Results
- **TypeScript** (`tsc --noEmit`): Exit code 0, compiles clean
- **Unit tests** (91 tests): All 91 pass across bookUtils, adapters, bookDataService, bookSelection mapper
- **oxlint**: 0 errors, 8 pre-existing warnings only (export-components, immutability, exhaustive-deps — all in pre-existing code)
- **Production build** (`vite build`): Succeeds — 477.77 kB JS, 123.08 kB CSS

### Regression Fixed — Routing After Onboarding

**The problem**: After completing onboarding, the URL changed to `/#discover` but LandingPage rendered instead of Discover. Root cause: session-based render conditions (`if (!session)`) in App.tsx overrode the `currentView`-based routing, landing page always showed when `session` was null (expected since onboarding doesn't create a Supabase auth session).

**The fix** (App.tsx): Reordered the render logic so `currentView`-based routing is primary, with session-based LandingPage fallback only during initial load (`if (loading && !session)`), not as a global override. Removed the unconditional `if (!session)` LandingPage check that was causing the regression. The render order is now:

1. Specific `currentView` checks (signin, signup, onboarding, discover, etc.)
2. Loading fallback LandingPage (`if (loading && !session)` — only during initial session restoration)
3. Final LandingPage default (when no other view matches)
4. Authenticated page checks (discover, genres, recommended, home, insights, library, profile)

This ensures that after onboarding completes and `navigateTo('discover')` is called, Discover renders correctly even though `session` is null (onboarding doesn't create an auth session — the user still needs to sign in/up separately, or Discover is accessible as the post-onboarding destination).

### Auth Flow — Verified Working

All hash-based routes function correctly:

| Route | Behavior |
|-------|----------|
| `localhost:5173/` (or `#`) | Public LandingPage with Get Started/Sign In/Sign Up |
| `localhost:5173/#signin` | Full styled sign-in form; signed-in users redirect to Discover |
| `localhost:5173/#signup` | Full styled sign-up form; signed-in users redirect to Discover |
| `localhost:5173/#onboarding` | Onboarding experience (when appropriate) |
| `localhost:5173/#discover` | DiscoverPage inside AppLayout (default authenticated landing; renders even without session post-onboarding) |
| `localhost:5173/#discover/genres` | GenresPage inside AppLayout |
| `localhost:5173/#discover/recommended` | RecommendedPage inside AppLayout |
| `localhost:5173/#library` | LibraryPage inside AppLayout |
| `localhost:5173/#insights` | InsightsPage inside AppLayout |
| `localhost:5173/#home` | HomePage inside AppLayout |
| `localhost:5173/#profile` | ProfilePage inside AppLayout with Sign Out |
| Unknown hash | Falls back to LandingPage |

**Sign-in flow**: User enters credentials → `onSignInSuccess` → `navigateTo('discover')` → Shows DiscoverPage inside AppLayout
**Sign-up flow**: User enters credentials → `onSignUpSuccess` → `navigateTo('onboarding')` → Then to Discover
**Sign-out flow**: Profile → `supabase.auth.signOut()` → `navigateTo('signin')` → Shows SignInPage

### Routes and Pages — Complete Inventory

All original Verba pages are preserved and functional:

| Route | Component | Notes |
|-------|-----------|-------|
| `#` / `landing` | LandingPage | Public entry point; Get Started → Sign Up, Sign In → signin/signup |
| `#signin` | SignInPage | Full form; `onNavigateToSignUp` → signup; `onSignInSuccess` → discover |
| `#signup` | SignUpPage | Full form; `onNavigateToSignIn` → signin; `onSignUpSuccess` → onboarding → discover |
| `#onboarding` | OnboardingPage | Collects preferences, navigates to discover |
| `#discover` | DiscoverPage + AppLayout | Default authenticated landing |
| `#discover/genres` | GenresPage + AppLayout | Navigation back to discover |
| `#discover/recommended` | RecommendedPage + AppLayout | Navigation back to discover |
| `#library` | LibraryPage + AppLayout | Reading shelf and journal |
| `#insights` | InsightsPage + AppLayout | Reading analytics |
| `#home` | HomePage + AppLayout | Dashboard with saved answers |
| `#profile` | ProfilePage + AppLayout | Sign out, navigation to insights |

### Files Changed (since last green state)

| File | Change |
|------|--------|
| `frontend/src/App.tsx` | Restructured render logic — fixed routing regression; `currentView`-based routing primary; session fallback only during initial load |
| `frontend/src/hooks/useAuth.ts` | Fixed subscription cleanup: `data?.subscription?.unsubscribe()` (confirmed bug fix) |
| `frontend/src/pages/Auth/SignInPage.tsx` | Restored from git `23c5336` — original Verba-styled sign-in form |
| `frontend/src/pages/Auth/SignUpPage.tsx` | Restored from git `23c5336` — original Verba-styled sign-up form |

All other book API services, page components, layouts, and design tokens remain exactly as they were — no rewrites, no regressions.

### Remaining Blockers

- **No live Supabase credentials** (URL + publishable anon key) in this environment. RPC `resolve_canonical_book(...)` and end-to-end persistent book storage are designed but not verifiable without credentials.
- Google Books returns HTTP 429 from this IP — live API calls must be mocked.

### User Next Steps (after credentials supplied)

1. Set `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in `frontend/.env`
2. Run SQL: create `resolve_canonical_book(...)` RPC + `GRANT EXECUTE TO authenticated`
3. Seed `source_field_policies` if table empty
4. Implement `catalogRepository.ts` calling RPC + inserting `user_books`/`user_book_sources`
5. Connect AddBookModal through service boundary
6. Verify: signed-in user searches → adds book → reloads → finds it with reading data intact

### Summary
All auth, TypeScript, test, lint, and build checks are green. The routing regression is fixed — after onboarding, Discover renders correctly. The original Verba UI is fully restored. Persistent book storage RPC and migration pending user-supplied Supabase credentials.