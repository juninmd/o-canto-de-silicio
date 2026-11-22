# AGENTS.md

**O Canto de Silício** ("Meu Livro 2") is a Portuguese cyberpunk noir / survival horror serial published as a VitePress
site. Chapters are Markdown with frontmatter; the site is built and deployed by GitHub Actions. Consolidates the findings
of the Global Narrative Review (chapters 1 to 121); the review tracker in the repo is `REVISÃO.md`.

## Stack

- VitePress (Vue components in `docs/.vitepress/theme/`), Node 22 (`Dockerfile`, `build.yml`, `pages.yml`), npm (`package-lock.json`)
- Python helper scripts in `scripts/` (dependency: `requests`, see `scripts/requirements.txt`)

## Commands

```bash
npm ci                          # install (lockfile is authoritative)
npm run docs:dev                # local site
npm run docs:build              # build check: run before finishing any task
npm run docs:preview            # serve the built site
npm test                        # node --test "tests/*.test.mjs"
```

## Structure

- `docs/public/capitulos/capitulo-XX.md`: chapters, one file each, with frontmatter (`title`, `personagens`, ...)
- `docs/personagens.md`: character dossiers (rendered by `<DossieGrid />`)
- `docs/reflexoes/reflexao-XXX.md`: reflections attached to chapters
- `docs/public/midia/` and `docs/static/midia/`: concept art, kept in sync (see Conventions)
- `docs/.vitepress/lib/`: `conteudo.mjs` (chapter list from frontmatter), `arcos.mjs` (story arcs)
- `docs/.vitepress/theme/`: Vue components, `dados/personagens.js` (dossier states), `dados/atlas.js` (Atlas layers), `som.js`
- `tests/`: `node --test` unit tests; `scripts/`: Python generators and checks
- `REVISÃO.md`: review status of each chapter; `ROADMAP.md`: project phases

## Conventions

- **Personas.** Write the prose as the **Scribe** (narrative architect, Cyberpunk Noir / Survival Horror, "show, don't tell",
  cynical pragmatic dialogue, consistent cliffhangers). Produce chapters 122+ and revisions without breaking the arc of
  human deconstruction of the protagonists. Produce concept art as the **Visionary** (cinematic lighting, strong contrast,
  industrial dirt) and keep character and scenery assets in sync in both media folders. Review as the **Validator**
  (continuity QA): hunt plot armor, power regressions, injury chronology errors and broken links; the build must be clean.
- **Continuity laws (after chapter 44, after chapter 121 and arc 130+).** Anyone generating or editing narrative content
  must follow these:
  1. **Elara, bioelectricity.** From chapter 45 to 129 she is strictly human, with no bioelectricity after she burned her
     synaptic overload against the Machine-God (ch. 41-44). Her crises are solved by agility, scrap-trader cunning, blunt
     blades and technical knowledge; any electricity comes from the physical environment (shorting exposed wires,
     throwing batteries into contaminated water, manual capacitors). **From chapter 130** she recovers her powers gradually,
     through ancestral or biocybernetic tech from the deep sublevels (pre-collapse relics, neural bio-grafts, cellular
     reconnection in the forgotten mesh). The recovery is unstable, painful and costly, not a miracle without consequences.
  2. **Jaxon, cybernetic and physical decay.** His mechanical arm was destroyed in the industrial machinery of the Thermal
     Abyss (ch. 107-120); only a mutilated socket wrapped in improvised bandages remains. His synthetic lung is dead, poisoned
     by sulfur soot and acid snow: wet cough and shortness of breath. He fights only with his remaining organic hand, a heavy
     revolver with very little ammunition, and depends on Elara to walk.
  3. **Atmosphere and style.** Genre: Cyberpunk Noir / Survival Horror. Evoke burning sulfur, ozone, acid-snow ammonia, old
     lubricant oil and chemical sludge. No plot armor: Nova Aether is merciless and every win costs a biological, physical
     or material price.
  4. **Geopolitics and world state.** The Order of Silicon is fragmented after the fall of the Machine-God; surviving priests
     rely on automated defenses such as the Thermal Purge Protocol. The Water Cartel (Silas) holds a violent monopoly on
     filters and clean water in Sector 4 and hunts Elara and Jaxon relentlessly. The Bottom of the Well (ch. 121+) is a
     flooded forgotten sublevel of acid water and chemical sludge, home to corrupted ancient machinery that works blind by
     echolocation and vibration.
- **Chapter files are the source of truth for the sidebar.** Do not hand-edit chapter lists in `docs/.vitepress/config.mjs`.
  Update the character states in `dados/personagens.js` and the Atlas layers in `dados/atlas.js` together with
  `docs/personagens.md`.
- **Media is saved twice:** every asset goes to both `docs/static/midia/` and `docs/public/midia/`.
- **Build check:** `npm run docs:build` must pass before a task is done.

## Gotchas

- The global narrative review lives outside this repository. Use `REVISÃO.md` for chapter review status.
- Do not commit local paths or machine-specific links.
- `test_frontend.py` is a one-off Playwright check, not run by CI; it hard-codes `localhost:4173` and chapter 65's title.
- `scripts/gerar_midia.py` needs a local Ollama and points at `docs/capitulo-1.md`, a path that no longer exists; check before use.

<!-- base-actions-main-policy -->
## GitHub Actions — padrão obrigatório (@main)

- Referencie as actions internas sempre pelo branch, nunca por SHA:
  - `uses: juninmd/base-actions/<action>@main`
  - `uses: juninmd/base-actions/.github/workflows/<arquivo>.yml@main`
- Não fixe `@<sha>` em `juninmd/base-actions`: a atualização é centralizada no
  `main` e passa a valer no próximo run.
- PRs cujos checks não iniciam por billing/spending limit são mesclados pelo bot central
  `juninmd/base-actions/.github/workflows/auto-merge-billing-blocked.yml`.
  Para impedir o merge automático de um PR, aplique a label `do-not-merge`.