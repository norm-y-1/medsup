# InsureCare POC — Medicine Supply Demo

A **small but professional** frontend demo for a medical supplies catalog. Built with **React + Vite + TS + Tailwind + Effector** with a local **mock API** (persisted in `localStorage`). Includes **Jest** unit tests, a **Cypress** E2E example, and a tiny **Jasmine** spec to showcase multiple test runners.

> Ready to run offline. No external API required.

## Quickstart

```bash
# 1) Install
yarn

# 2) Start dev server
yarn dev

# 3) Run unit tests (Jest + RTL)
yarn test

# 4) Run Jasmine (pure function specs)
yarn jasmine

# 5) Open Cypress runner (E2E)
yarn e2e:open
```

## Tech choices

- **Vite** for development speed.
- **Effector** for explicit event-driven state.
- **Tailwind** for clean, consistent styling.
- **TypeScript** with strict compiler flags and zero `any`.
- **Mock API** backed by `localStorage` so your client can simply open the app and test.
- **Highly typed domain** (`Product`, `CategoryId`, `Paginated<T>` etc.).

## Project structure

```
src/
  entities/
    product/
      api/mockApi.ts       # localStorage-backed API with latency
      model/products.ts    # Effector model
      ui/ProductCard.tsx
  features/
    cart/                  # cart model + drawer UI
    filters/
  pages/CatalogPage.tsx
  shared/
    lib/                   # money, storage, id helpers
    types.ts               # domain types
```

## Notes

- The mock API **seeds data** on first load and simulates latency (360ms) to make async flows visible.
- All state is **strongly typed**, reducers are pure, and side-effects are isolated via Effector **effects**.
- Unit tests avoid touching the DOM where possible (focused on logic). E2E covers the happy path.
```

