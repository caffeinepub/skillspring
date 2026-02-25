# Specification

## Summary
**Goal:** Add a three-dot vertical ellipsis menu (⋮) to the left side of the app header in the Student Information System.

**Planned changes:**
- Add a ⋮ (vertical ellipsis) icon button to the left side of the header in AppLayout
- Clicking the button opens a dropdown menu with two options: "Share Website" and "Copy Link"
- "Share Website" uses the browser's native Web Share API (with fallback to clipboard copy if unsupported)
- "Copy Link" copies the current page URL to the clipboard and shows a toast confirmation
- Dropdown closes when an option is selected or when clicking outside

**User-visible outcome:** Users can click the ⋮ button on the left side of the header to share or copy the app's link directly from any page.
