# Design Guidelines: User Information Collection & Admin Dashboard

## Design Approach: Modern Utility System

**Selected Approach:** Design System - Clean, Data-Focused Interface
**Rationale:** This is a utility-focused application for data collection and management. The primary goals are efficiency, clarity, and ease of data entry/review. The design should prioritize usability and readability over visual experimentation.

**Core Principles:**
- Clarity over decoration
- Consistent form patterns for easy data entry
- Scannable data presentation in admin dashboard
- Clear visual hierarchy between form fields and actions
- Professional, trustworthy aesthetic appropriate for data collection

---

## Typography System

**Font Stack:** Inter (primary) via Google Fonts
- **Headings:** 
  - Page titles: text-3xl font-semibold (form title, admin dashboard title)
  - Section headers: text-xl font-semibold (grouped sections in admin)
  - Card headers: text-lg font-medium
- **Body Text:**
  - Form labels: text-sm font-medium
  - Input text: text-base
  - Helper text/validation: text-sm
  - Table data: text-sm
- **Special:**
  - Success message: text-2xl font-semibold
  - Non-editable field label: text-xs font-medium uppercase tracking-wide

---

## Layout & Spacing System

**Spacing Units:** Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Form field vertical spacing: space-y-6
- Section padding: p-8 (form container), p-6 (admin cards)
- Input padding: px-4 py-3
- Button padding: px-6 py-3
- Card gap in admin dashboard: gap-6
- Page margins: max-w-2xl mx-auto (form), max-w-7xl mx-auto (admin dashboard)

**Grid Structure:**
- Form: Single column, centered (max-w-2xl)
- Admin Dashboard: Full-width container with grouped card layout
- Responsive: All single column on mobile, expand to multi-column grids on desktop for admin view

---

## Component Library

### Form Components

**Form Container:**
- Centered card with rounded corners (rounded-lg)
- Elevation: Subtle shadow (shadow-md)
- Padding: p-8
- Background treatment: Subtle contrast from page background

**Input Fields:**
- Consistent height across all inputs (h-12)
- Border style: 1px solid, rounded-md
- Focus states: Enhanced border, subtle ring effect
- Label positioning: Above input with mb-2
- Error states: Border change + error message below (text-sm, mt-1)

**Non-Editable Field:**
- Same visual structure as inputs but with distinct styling to indicate read-only
- Slightly muted treatment (reduced opacity or distinct background)
- Label: "Assigned To" or similar descriptor

**Dropdown Select:**
- Matches input field height and styling
- Chevron icon on right side
- When "Other" selected, text input appears below with slide-down animation (duration-200)
- "Other" text input matches standard input styling

**State & County Fields:**
- Standard text inputs
- Positioned side-by-side on desktop (grid-cols-2 gap-4), stacked on mobile

**Submit Button:**
- Primary action styling
- Full width on mobile, auto-width centered on desktop
- Height: h-12
- Font: text-base font-semibold
- Icon: No icon needed, text only

### Success State

**Success Message Container:**
- Same card structure as form
- Centered content (text-center)
- Vertical spacing: space-y-6

**Success Elements:**
- Checkmark icon: Large (w-16 h-16), centered, positioned at top
- Message text: "Thanks for submitting" - text-2xl font-semibold
- Subtext: "Your information has been recorded" - text-base, muted
- "Submit Another Response" button: Secondary button style, centered

### Admin Dashboard Components

**Dashboard Layout:**
- Full-width header with title and summary stats
- Main content area: Grouped cards by dropdown selection

**Summary Stats Bar:**
- Horizontal row of stat cards at top
- Each stat: Count + label (e.g., "Total Submissions: 47")
- Grid: grid-cols-1 md:grid-cols-4 gap-4
- Card styling: p-4, rounded-lg, border

**Grouped Sections:**
- Each dropdown option gets its own collapsible section
- Section header: Flex row with dropdown option name (text-lg font-semibold) + submission count badge + expand/collapse icon
- Header is clickable to toggle section
- Padding: p-4
- Border bottom for separation

**Data Table (within each section):**
- Responsive table design
- Columns: Name | Phone | State | County | Other (if applicable) | Timestamp
- Header row: text-xs font-medium uppercase tracking-wide
- Data rows: text-sm, alternating row backgrounds for scannability
- Row padding: py-3 px-4
- Hover state on rows: Subtle background change
- Mobile: Stack into cards instead of table

**Empty State:**
- When no submissions: Centered message in empty section
- Icon + "No submissions yet" text
- Subdued styling

**Badges:**
- Submission count badges: Rounded-full, px-3 py-1, text-xs font-medium
- Positioned next to section headers

---

## Interaction Patterns

**Form Validation:**
- Real-time validation on blur
- Error messages appear below fields
- Submit button disabled until all required fields valid
- Success submission: Form smoothly transitions to success state (no page navigation)

**Dashboard Interactivity:**
- Sections default to expanded state
- Smooth collapse/expand transitions (duration-300)
- Clicking section header toggles that section only
- Tables have fixed header on scroll

**Loading States:**
- Submit button shows loading spinner during submission
- Dashboard shows skeleton loaders while fetching data

---

## Accessibility & UX Details

**Focus Management:**
- Clear focus indicators on all interactive elements (ring-2 ring-offset-2)
- Tab order: Top to bottom through form fields
- Success state: Focus moves to "Submit Another Response" button

**Form UX:**
- Auto-capitalize Name field
- Phone number field with input mask formatting
- Required field indicators (asterisk) on labels
- Helpful placeholder text in inputs
- Disabled state for non-editable field clearly communicated

**Responsive Behavior:**
- Form: 90% width on mobile, fixed max-w-2xl on desktop
- Admin dashboard: Single column on mobile, appropriate multi-column on desktop
- Touch targets: Minimum 44px height for mobile interactions

---

## Page Structure

**User Form Page:**
- Centered vertically and horizontally
- Form title at top: "Submit Your Information"
- Form card below
- Minimal chrome, focus on the form

**Success State:**
- Replaces form with success message (same positioning)
- "Submit Another Response" button resets to fresh form

**Admin Dashboard:**
- Top navigation/header bar with "Admin Dashboard" title
- Summary stats below header
- Main content: Scrollable area with grouped sections
- Fixed header remains visible on scroll