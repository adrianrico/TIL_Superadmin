# Graph Report - .  (2026-10-22)

## Corpus Check
- Corpus is ~7,542 words - fits in a single context window. You may not need a graph.

## Summary
- 119 nodes · 221 edges · 9 communities (8 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6

## God Nodes (most connected - your core abstractions)
1. `errorMessage()` - 11 edges
2. `useAuth()` - 7 edges
3. `setAccessToken()` - 6 edges
4. `AuthProvider()` - 6 edges
5. `scripts` - 5 edges
6. `UsersPage()` - 5 edges
7. `UserActions()` - 5 edges
8. `UserFormModal()` - 5 edges
9. `DEFAULT_FILTERS` - 5 edges
10. `useUsers()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `login()` --calls--> `setAccessToken()`  [EXTRACTED]
  src/api/auth.api.js → src/api/http.js
- `LoginPage()` --calls--> `errorMessage()`  [EXTRACTED]
  src/features/auth/LoginPage.jsx → src/api/http.js
- `UserFormModal()` --calls--> `errorMessage()`  [EXTRACTED]
  src/features/users/components/UserFormModal.jsx → src/api/http.js
- `UsersPage()` --calls--> `errorMessage()`  [EXTRACTED]
  src/features/users/UsersPage.jsx → src/api/http.js
- `ProtectedRoute()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/ProtectedRoute.jsx → src/context/AuthContext.jsx

## Import Cycles
- None detected.

## Communities (9 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.17
Nodes (13): listUsers(), EmptyState(), useLoader(), CredentialsModal(), FiltersDrawer(), FiltersPanel(), SORT_OPTIONS, DEFAULT_FILTERS (+5 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (18): dependencies, @ant-design/icons, antd, axios, dayjs, react, react-dom, react-router-dom (+10 more)

### Community 2 - "Community 2"
Cohesion: 0.23
Nodes (12): login(), CLIENT_HEADER, http, logoutRequest(), refreshSession(), setAccessToken(), setSessionExpiredHandler(), NavBar() (+4 more)

### Community 3 - "Community 3"
Cohesion: 0.18
Nodes (11): App(), LoginPage, UsersPage, GlobalLoader(), ProtectedRoute(), LAYERS, WaveBackground(), LoaderContext (+3 more)

### Community 4 - "Community 4"
Cohesion: 0.30
Nodes (10): errorMessage(), AccessSwitch(), UserActions(), UserCards(), sortOrder(), UsersTable(), useDeleteUser(), useGenerateCredentials() (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.25
Nodes (8): devDependencies, jsdom, @testing-library/jest-dom, @testing-library/react, @testing-library/user-event, vite, @vitejs/plugin-react, vitest

## Knowledge Gaps
- **31 isolated node(s):** `name`, `version`, `test`, `dev`, `build` (+26 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `errorMessage()` connect `Community 4` to `Community 0`, `Community 2`, `Community 5`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 6` to `Community 1`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `name`, `version`, `test` to the rest of the system?**
  _31 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._