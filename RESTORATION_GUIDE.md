# Restoration Guide - Commented Features

This document provides instructions on how to restore the features that have been temporarily commented out to clean up the UI and address build issues.

## 1. Sidebar Navigation (Assessments)
**File:** `src/components/sidebar/index.tsx`

To restore the Assessments links in the sidebar:
- **Super Admin Assessment Link:** Uncomment the block starting around **Line 125**.
- **Admin Assessment Link:** Uncomment the block starting around **Line 148**.

---

## 2. Bulk Invitation Feature
**File:** `src/components/orgInvitation/index.tsx`

To restore the Bulk CSV Invitation feature, you need to uncomment three sections in this file:

### A. State Variable
- **Line 36:** Uncomment the `csvFile` state declaration:
  ```tsx
  const [csvFile, setCsvFile] = useState<File | null>(null);
  ```

### B. Logic Handlers
- **Lines 140 to 226:** Remove the `/*` and `*/` comment markers around the following functions:
  - `handleFileSelect`
  - `handleClearFile`
  - `handleBulkInvite`

### C. UI Component
- **Lines 328 to 466 (approx):** Remove the `{/*` and `*/}` comment markers around the `Bulk Upload Section` wrapper. This restores the visual wizard and upload dropzone.

---

## Technical Note
These features were commented out to streamline the user experience while certain modules are under refinement. Ensure all related backend services are active before restoring the bulk upload logic to avoid 404 or 500 errors during CSV processing.
