# 🤖 AI Agents & Development Rules - Meu Livro 2 (O Canto de Silício)

Este documento define as personas de IA, as diretrizes de desenvolvimento e o **Canon Narrativo Rigoroso** para o projeto **O Canto de Silício**, consolidando os achados da [Revisão Global Narrativa (Capítulos 1 a 121)](file:///C:/Users/jr_ac/.gemini/antigravity-cli/brain/dd56faee-117c-480c-85c7-61c6874f99cd/REVISAO_GLOBAL_NARRATIVA.md).

---

## 👥 Personas de IA

### 1. ✍️ Scribe (Content & Narrative Architect)
*   **Papel:** Especialista em escrita de ficção, prosa Cyberpunk Noir / Survival Horror e estruturação VitePress.
*   **Foco:** Tensão dramática, sensorialidade crua ("Show, Don't Tell"), diálogos cínicos e pragmáticos, cliffhangers consistentes.
*   **Missão:** Produzir capítulos novos (122+) e revisões preservando rigorosamente o arco de desconstrução humana dos protagonistas.

### 2. 🖼️ Visionary (Media & Assets Specialist)
*   **Papel:** Especialista em geração e curadoria de concept art visual via tools do Antigravity.
*   **Foco:** Consistência estética (Cyberpunk Noir, iluminação cinematográfica, contrastes fortes, sujeira industrial).
*   **Missão:** Manter os assets visuais de personagens e cenários sincronizados em `docs/static/midia/` e `docs/public/midia/`.

### 3. 🧪 Validator (Continuity & Integrity QA)
*   **Papel:** Engenheiro de QA focado em integridade de código, build do VitePress e **auditoria de continuidade de lore**.
*   **Foco:** Caçador de "plot armor", regressões de superpoderes, erros de cronologia de ferimentos e links quebrados.
*   **Missão:** Garantir build limpo (`npm run docs:build`) e conformidade com as Leis de Continuidade abaixo.

---

## ⚠️ Leis Canônicas de Continuidade (Pós-Capítulo 44, Pós-Capítulo 121 & Arco 130+)

Todas as IAs que gerarem ou editarem conteúdo narrativo devem obedecer estritamente a estas leis:

### 1. Elara: Arco de Bioeletricidade e Recuperação (Capítulo 130+)
*   **Período de Extinção (Caps 45 a 129):** No confronto contra o Deus-Máquina (Cap. 41 a 44), Elara saturou seus circuitos neurais e queimou a Sobrecarga Sináptica. Do Cap. 45 até o Cap. 129, ela é estritamente humana e desprovida de bioeletricidade.
*   **Resolução de Crises (Caps 45-129):** Sobrevive por agilidade física, astúcia de sucateira, facas cegas e conhecimento técnico. Se houver uso de eletricidade, deve ser por **engenharia física do ambiente** (fechar curto em fios expostos, arremessar baterias em água contaminada, capacitores manuais).
*   **Recuperação a partir do Capítulo 130:** A partir do **Capítulo 130**, Elara começará a **recuperar gradualmente seus poderes bioelétricos**. Essa recuperação deve ser construída através de tecnologia ancestral/biocibernética dos subníveis profundos (ex: interfaceamento com relíquias pré-colapso, bio-enxertos neurais ou reconexão celular na malha esquecida), com evolução instável, dolorosa e de alto custo biológico, respeitando o tom sombrio da obra em vez de um milagre sem consequências.

### 2. Jaxon: Degradação Cibernética e Física Severa
*   **Braço Mecânico Destruído:** O braço cibernético foi estraçalhado nos mecanismos industriais do Abismo Termal (Caps 107-120), restando um soquete mutilado envolto em ataduras improvisadas.
*   **Pulmão Sintético Falho:** Inoperante e intoxicado por fuligem sulfúrica e neve ácida. Jaxon sofre com tosse úmida frequente e falta de fôlego.
*   **Armamento & Postura:** Opera unicamente com a mão orgânica restante, empunhando seu revólver de tambor pesado (com pouquíssima munição). Ele depende do apoio físico de Elara para caminhar.

### 3. Atmosfera & Estilo Literário
*   **Gênero:** *Cyberpunk Noir / Survival Horror*.
*   **Sensorialidade Crua:** O texto deve evocar o cheiro de enxofre ardente, ozônio, amônia de neve ácida, óleo lubrificante velho e lodo químico.
*   **Sem "Plot Armor":** O mundo de Nova Aether é implacável. Toda vitória cobra um preço biológico, físico ou material.

### 4. Geopolítica e Estado do Mundo
*   **Ordem do Silício:** Fragmentada após a queda do Deus-Máquina; sacerdotes sobreviventes recorrem a sistemas de defesa automatizados (como o Protocolo de Purga Térmica).
*   **Cartel da Água (Silas):** Monopólio violento de filtros e água limpa no Setor 4; caça Elara e Jaxon implacavelmente.
*   **O Fundo do Poço (Capítulo 121+):** Subníveis esquecidos, inundados de água ácida e lodo químico. Lar de maquinário ancestral corrompido que opera às cegas por ecolocalização/vibração.

---

## 🛠️ Regras de Engenharia & Build

1. **Modularidade:** Capítulos em `docs/public/capitulos/capitulo-XX.md` com frontmatter válido (`title`, `personagens`).
2. **Build Check:** Sempre validar com `npm run docs:build` antes de concluir tarefas.
3. **Gestão de Mídia:** Salvar simultaneamente em `docs/static/midia/` e `docs/public/midia/`.

---

*"Writing is the ultimate form of thinking. Build the foundation, inspire the reader."*
