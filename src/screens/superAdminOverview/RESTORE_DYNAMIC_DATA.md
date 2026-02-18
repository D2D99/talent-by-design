# Restore Dynamic Data Sync

This document provides instructions on how to switch the **Super Admin Overview** back from static mock data to live API data.

## 🛠 Steps to Restore Live Data

1.  **Open the Overview file:**
    *   `src/screens/superAdminOverview/index.tsx`

2.  **Restore the state initialization:**
    *   Find the `intelData` state at the top of the component.
    *   Change it from the large mock object back to:
    ```tsx
    const [intelData, setIntelData] = useState<any>(null);
    ```

3.  **Uncomment the Fetching Logic:**
    *   Find the `useEffect` block (around line 45).
    *   Remove the `/*` and `*/` comment markers so the `api.get` call becomes active again.

4.  **Verify Backend Connection:**
    *   Ensure your backend server is running and the `/assessment/super-admin/intelligence` endpoint is accessible.

---

**Current Status:** The dashboard is currently using a **static `intelData` object** defined inside the component to ensure the UI looks perfect during development/demo.
