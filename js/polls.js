I’m attaching the full GMC project files. Read everything first before changing anything. Prioritize the home screen, admin editing permissions, CASSH Create spelling, and the broken bottom music player. Only send back the files you actually changed.

You are acting as a senior front-end + Firebase debugging engineer.

I am giving you the full codebase/files for my music group website/project: GREAT MINDS CREATING (GMC).

Your job is to audit the files carefully and fix every bug you can find, but for this round you must PRIORITIZE THE HOME SCREEN and the ADMIN/EDITING SYSTEM tied to it.

IMPORTANT:
Do NOT redesign the project.
Do NOT change working sections just because you think they can look better.
Do NOT restructure the whole app unless absolutely necessary for the bug fix.
Do NOT remove features that already exist.
Do NOT touch unrelated code.
Do NOT send explanations without action.
I need precise fixes with a very high probability of success.

MAIN OBJECTIVES FOR THIS ROUND

1. ADMIN LOGIN / ADMIN ACCESS MUST WORK
- My admin login should work properly.
- When I log in as an admin, I should actually be recognized as an admin in the system.
- Admin-only controls should appear only for admins.
- Non-admin users / public visitors must NOT see edit controls, admin buttons, or any content management tools.
- Normal users should still be able to sign up and log in for member access, exclusive drops, early notifications, clothing/music updates, etc.
- Public visitors should still be able to browse normally without gaining editing access.

2. ADMINS MUST BE ABLE TO EDIT THE HOME SCREEN
- All admins should have full control over home screen content.
- Admins should be able to edit the content that appears on the home page directly through the intended admin/editing system.
- If this is currently partially built, broken, disconnected from Firebase, hidden incorrectly, or not saving properly, fix it.
- Make sure home screen edits persist correctly in Firebase / Firestore / the current database structure being used.
- Make sure the UI updates correctly after save.
- Make sure saved content still loads correctly for public users.
- If there are missing permission checks, fix them.
- If there are missing event listeners, broken selectors, wrong IDs, wrong field names, or Firebase path mismatches, fix them.

3. CASH CREATE NAME MUST BE CORRECT EVERYWHERE
- The artist name must be spelled exactly:
CASSH Create
- Fix this across the entire platform wherever it is wrong.
- Check homepage, artist sections, artist page, admin/editor areas, stored data defaults, hardcoded text, buttons, headings, cards, navigation, metadata, and any Firebase-loaded content.
- Do not miss variant misspellings like:
  - Cash Create
  - Cass Create
  - C-A-S-H
  - any incorrect capitalization or missing S
The correct spelling everywhere is:
CASSH Create

4. CASSH CREATE ARTIST PAGE MUST BE ADMIN-EDITABLE
- I as an admin should be able to edit what is on my personal artist page for CASSH Create.
- If this page already has an admin editing system, fix it so it works.
- If it is supposed to pull editable content from Firebase but is failing, find and fix the issue.
- If it is hardcoded and that is preventing admin control, convert only what is necessary so admins can manage the content without breaking the rest of the site.
- Do not overbuild. Keep it practical and working.

5. HOME SCREEN MUSIC PLAYER / BOTTOM PLAYER MUST WORK
- At the bottom of the screen there should be music playing / a working music player.
- Right now it is not working.
- I already set things up on Firebase, so inspect the actual reason it is failing instead of guessing.
- Find whether the issue is caused by:
  - broken Firebase Storage URLs
  - bad file paths
  - auth rules
  - autoplay restrictions
  - bad event wiring
  - wrong audio source assignment
  - missing DOM elements
  - player initialization happening before data loads
  - muted/autoplay browser conflicts
  - broken playlist logic
  - fallback logic failing
  - broken artist/song object structure
- Fix the player so it reliably loads and plays music as intended.
- If autoplay is blocked by browser behavior, implement the cleanest realistic fallback so the player still works once the user interacts.
- The player should not look broken or dead.
- If there is supposed to be a “top music” or latest-release logic, make sure it actually resolves to a valid playable source.

6. HOME SCREEN BUG SWEEP
While prioritizing the above, inspect the home screen for any other obvious bugs and fix them too, including:
- broken buttons
- broken links
- missing images
- console errors
- Firebase read/write failures
- elements not rendering
- admin controls not toggling correctly
- sign-up / login UI bugs related to home page logic
- duplicated listeners
- bad imports
- incorrect collection/document names
- spelling inconsistencies
- sections failing silently

TECHNICAL EXPECTATIONS
- Read the existing files carefully before changing anything.
- Trace the actual current logic first.
- Respect the current project structure as much as possible.
- Keep Firebase-compatible logic clean and consistent.
- Preserve existing sign up / login capability for regular users.
- Preserve any existing admin architecture if it can be repaired instead of rebuilt.
- If admin roles are supposed to be based on email matching, custom claims, Firestore roles, or an admin list, find the existing intended method and repair it correctly.
- Make sure the final solution is secure enough that public users cannot access editing functionality just by toggling CSS or exposing buttons.

WHAT I NEED BACK FROM YOU
1. A short diagnosis of the real root causes you found.
2. The exact files you changed.
3. The fully updated code for ONLY the files you changed.
4. Clear notes on anything I need to configure in Firebase, if truly necessary.
5. Make sure your solution is copy-paste ready.

CRITICAL RULES
- Do not send all files back.
- Only send the updated files that were actually changed.
- Do not rewrite unrelated sections.
- Do not make cosmetic redesign changes unless required for a bug fix.
- Do not break signup/login for regular users.
- Do not remove the ability for fans/users to create accounts for exclusive drops and notifications.
- Focus on functionality, permissions, persistence, and reliability first.

SUCCESS STATE
The job is successful only if all of the following are true:
- Admin login works.
- Admin is recognized correctly.
- Admin-only edit controls appear only for admins.
- Admin can edit the home screen and save changes successfully.
- Admin can edit the CASSH Create artist page successfully.
- “CASSH Create” is spelled correctly everywhere.
- Public users can still sign up/log in normally but cannot edit anything.
- The bottom music player works.
- Home page loads without obvious bugs or silent failures.

Before writing code, inspect everything carefully and find the true cause of the bugs.
Then fix them with minimal, precise changes.
