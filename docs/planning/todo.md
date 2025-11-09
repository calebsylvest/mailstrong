# Todo Tasks

## Improvements

### Interceptor Modal

- [ ] Show full URL in the Interceptor modal  
  - Rationale: users must see the complete target URL to make correct whitelist/security decisions. Truncation hides important host/path/query information and can cause mistaken approvals or rejections.  
  - Next step: update the modal template and CSS to allow wrapping or horizontal scrolling of the URL field; ensure the content script/popup supplies the untruncated URL. Add tests that validate long URLs render and copy correctly.

- [ ] Whitelist button is too close to Cancel, needs more space  
  - Rationale: proximity increases risk of accidental whitelist clicks, a security and UX issue. Clear separation reduces accidental user errors.  
  - Next step: adjust modal layout/CSS to add spacing and, optionally, move whitelist to a safer location (e.g., confirm step or secondary action). Consider adding a visual affordance (color/outline) to differentiate primary vs destructive actions.

- [ ] Prevent rapid clicking of the Copy URL button (debounce + single toast)  
  - Rationale: rapid clicks spawn many toast notifications and duplicate copy operations; this creates noisy UX and may confuse users. A debounce or disabling during the copy prevents spamming.  
  - Next step: implement a short debounce or disable the copy button for ~500ms after click; consolidate to show a single toast per copy action and ensure clipboard fallback behaviors are handled. Add unit/interaction tests.

- [ ] Rework how the HTTP/HTTPS message is visually designed  
  - Rationale: security state (secure vs insecure) must be obvious; current design may not make the difference clear, reducing user trust and increasing mistakes.  
  - Next step: redesign indicator using distinct colors, accessible icons, and explicit text ("Secure (HTTPS)" / "Insecure (HTTP)"); ensure contrast and screen-reader labels. Update CSS and component tests.

- [ ] Show character count for URL length (at least for testing)  
  - Rationale: useful for QA to detect truncation, overflow, or clipboard edge cases; low effort and helps in diagnosing long-URL bugs.  
  - Next step: add a small counter near the URL display in the modal (visible in testing mode or behind a feature flag). Add tests that assert counts for long URLs.

### Options Modal

- [ ] Make action buttons sticky and always visible  
  - Rationale: Save/Refresh/Clear are critical actions; making them always visible prevents users from scrolling and potentially losing unsaved changes. Improves discoverability and reduces accidental navigation away.  
  - Next step: pin the action bar to the bottom of the modal/page using CSS (sticky/fixed) and ensure mobile/responsive behavior. Add visual separation and keyboard-accessible focus order tests.

#### Link History

- [ ] Secure Table Column  
  - Rationale: lock/unlock emojis are too similar visually, leading to misinterpretation of a link's security state. Clear icons reduce misclicks and misjudgments.  
  - Next step: replace emojis with distinct SVG icons (locked padlock vs open padlock) and add accessible alt/title text. Update table cell styling and tests.

- [ ] Domain url column. Add a copy button to copy full url  
  - Rationale: users often need the full domain/path for logging or debugging; a dedicated copy control improves usability.  
  - Next step: add per-row copy button that copies the full URL to clipboard and shows a single toast. Add debounce and tests for copy behavior.

## Bugs

### Test 7: Reset Statistics
- [x] Statistics are not reseting after clicking the button  
  - Rationale: fixed — statistics now reset as expected.  
  - Notes: leave tests to assert reset behavior to prevent regressions.

### Test 8: Clear History
- [x] History is not clearning  
  - Rationale: fixed — history clearing now works.  
  - Notes: add an integration test to confirm DB/storage is cleared and UI updates.

---
Priority recommendations (short)
1. Show full URL in interceptor modal  
2. Prevent rapid clicks on Copy URL (debounce + single toast)  
3. Improve HTTP/HTTPS visual design  
4. Make Options modal action buttons sticky  
5. Add URL character count (testing)  
6. Improve Link History icons and add per-row copy

If you want, I can apply the highest-priority changes (1 and 2) and open a PR with code and tests.