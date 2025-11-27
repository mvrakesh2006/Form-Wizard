# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler# 🧩 Form Wizard (React + Ant Design)

A powerful **multi-step form wizard** built using **React 18**, **Ant Design**, and **custom field-level validation logic**.  
This project includes dynamic validation, step-wise error tracking, keyboard-based auto-navigation, enhanced paste restrictions, scroll-to-error behavior, age validation, and fully customizable step progress indicators.

---

# 🚀 Features Overview

## ✔️ 1. **Multi-Step Wizard**
- Built using **Antd `<Steps>`**
- 5 Form Sections:
  1. Candidate  
  2. Jobs  
  3. Employer  
  4. Referral  
  5. Financial  
- Each step contains fully validated fields
- Ability to **click on steps** (step navigation enabled)

---

## ✔️ 2. **Step-Level Error Tracking (Red Warning Icon)**
- Each step shows a **red warning icon** if:
  - One or more fields in that step are invalid  
- Error state persists even after moving across steps
- Removes error icon automatically when step validates successfully

---

## ✔️ 3. **Field-Level Real-Time Validation**
### Works on:
- **Typing (onChange)**
- **Blur (onBlur)**
- **Keyboard input validation**
- **Paste validation**
- **Enter key navigation**
- **Tab behavior override for email**  
- **Regex validations**

### Validates:
- Alphabet-only fields  
- Digit-only fields  
- Required fields  
- Email  
- Federal Tax ID (exactly 9 digits)  
- Contact numbers (exactly 10 digits)  
- Experience (max 2 digits)  
- Work Authorization  
- URLs  
- DOB 21+ validation  

---

## ✔️ 4. **Keyboard Navigation (Smart Field Switching)**
- Press **Enter** moves to the next field  
- If current step fields end, pressing Enter:
  - moves to NEXT STEP automatically  
- On last step → pressing Enter runs **Finish** action  
- Email field has a special validation + focus jump logic

---

## ✔️ 5. **Advanced Paste Protection**
Paste is blocked for invalid values in:
- Alphabet-only fields  
- Numeric-only fields  
- Federal Tax ID  
- Email  
- Contact numbers  

If invalid paste → prevents paste + shows custom error.

---

## ✔️ 6. **Sticky Step Header**
- Step indicator stays **fixed at the top**  
- Helps long forms remain user-friendly  
- CSS powered `position: sticky`  

---

## ✔️ 7. **Scroll-to-Error Auto-Focus**
When submission fails:
- Automatically identifies the field belonging to the **incorrect step**
- Switches to that step
- Scrolls smoothly to the field
- Focuses the input box

Perfect for UX.

---

## ✔️ 8. **DOB Validation (Must be 21+)**
- Custom date picker using:
  - `open`, `mode`, `onPanelChange`  
- User must be **21 years old or older**
- Restricts:
  - future dates
  - invalid date picking from UI panel

---

## ✔️ 9. **Responsive Layout with Ant Design Grid**
- Uses `<Row gutter={16}>`  
- `<Col span={8}>`  
- Auto spacing  
- Uniform layout across all steps  

---

## ✔️ 10. **Clean Component Structure**
- Single form instance for all steps
- Fields grouped by step via:
  ```js
  const fieldsByStep = [...]


The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
