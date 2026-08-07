# FE-05 Playground Accessibility Notes & shadcn/ui Comparison

> **Assignment**: FE-05: Accessible Component Fundamentals  
> **Student**: Friend / ZenFlow Team  
> **Project**: ZenFlow — Mindfulness & Task Flow Workspace  

---

## 1. Overview of Hand-Built Components

Three custom React + TypeScript components were built from scratch against W3C ARIA Authoring Practices patterns without using external UI libraries:

1. **Modal Dialog (`ModalDialog.tsx`)**:
   - **ARIA**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`.
   - **Keyboard & Focus**: Traps focus inside the modal on `Tab` / `Shift+Tab`, closes on `Escape`, and restores focus to the invoking trigger element on close.

2. **Tabs (`Tabs.tsx`)**:
   - **ARIA**: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`.
   - **Keyboard Navigation**: `ArrowRight` / `ArrowLeft` cycle active tab focus; `Home` and `End` jump to the first and last tabs.

3. **Disclosure (`Disclosure.tsx`)**:
   - **ARIA**: Button trigger with `aria-expanded="true|false"`, matching `aria-controls` panel ID.
   - **Keyboard Navigation**: Native `<button>` keyboard triggering (`Space` / `Enter`).

---

## 2. Concrete Gaps: Custom vs. shadcn/ui (Radix UI) Analysis

After reviewing the generated source code for `shadcn/ui` components (`@radix-ui/react-dialog` and `@radix-ui/react-tabs`), we identified **four concrete engineering gaps** that `shadcn/ui` handles:

### Gap 1: React Portal & Body Scroll-Lock Management
- **Our Custom Version**: Renders inline within the parent component hierarchy using standard fixed CSS layout (`fixed inset-0`). Additionally, `document.body.style.overflow = 'hidden'` is not automatically managed, allowing the background page to scroll behind the modal overlay on mobile devices.
- **shadcn/ui Version**: Uses `Radix.DialogPortal` (`React.createPortal`) to attach the modal node directly to `document.body` outside the React root DOM tree. It automatically injects `pointer-events: none` and locks body scroll (`overflow: hidden` + scrollbar padding compensation) to prevent layout shifts.

### Gap 2: Asynchronous & Dynamic Focus Target Management
- **Our Custom Version**: Uses a simple query selector (`button, input, select, textarea`) inside a fixed 50ms `setTimeout` to place initial focus on the first element. If the modal content contains no interactive inputs or loads asynchronously, focus falls back to the container container.
- **shadcn/ui Version**: Radix Primitives utilize `FocusScope` with custom `onOpenAutoFocus` and `onCloseAutoFocus` props. It handles dynamic rendering, autofocus overrides (`autoFocus` attribute on any child), and prevents focus loss if elements unmount while active.

### Gap 3: Orientation-Aware & Manual vs. Automatic Tab Activation
- **Our Custom Version**: Supports horizontal arrow navigation (`ArrowRight` / `ArrowLeft`) with automatic tab panel switching on arrow key press.
- **shadcn/ui Version**: Supports both `horizontal` and `vertical` orientation (`ArrowUp` / `ArrowDown`), and allows configuring `activationMode="manual"` (where arrow keys move focus without switching tabs until `Space` or `Enter` is pressed), adhering to complex ARIA authoring guidelines.

### Gap 4: Screen Reader Announcement of Dynamic Content Transitions
- **Our Custom Version**: Toggles tab panels directly via conditional rendering without ARIA live region wrappers.
- **shadcn/ui Version**: Includes `VisuallyHidden` screen reader utility elements and aria-live announcements for complex state changes, ensuring assistive technologies explicitly announce panel updates.

---

## 3. TypeScript Strictness Verification

- **Zero `any` Escapes**: All component props (`ModalDialogProps`, `TabsProps`, `DisclosureProps`) use strict TypeScript interfaces, typed `ReactNode` children, precise function signatures (`() => void`), and typed HTML event interfaces (`React.KeyboardEvent`, `React.FormEvent`).
