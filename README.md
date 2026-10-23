<div align="center">

# ⚡ O Canto de Silício

<p align="center">
  <img src="assets/elara.jpg" alt="Elara - Protagonista de O Canto de Silício" width="100%" style="border-radius: 10px;" />
</p>

<p align="center">
  <em>"Onde os deuses-máquina dormem, a esperança desperta através de uma frequência proibida."</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-120%2B%20Cap%C3%ADtulos-7928CA?style=for-the-badge&logo=gitbook&logoColor=white" alt="Capítulos" />
  <img src="https://img.shields.io/badge/G%C3%AAnero-Sci--Fi%20%7C%20Biopunk-0070F3?style=for-the-badge" alt="Gênero" />
  <img src="https://img.shields.io/badge/Leitor-VitePress-42b883?style=for-the-badge&logo=vite&logoColor=white" alt="VitePress" />
  <a href="https://github.com/juninmd/o-canto-de-silicio/actions/workflows/pages.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/juninmd/o-canto-de-silicio/pages.yml?branch=master&style=for-the-badge&label=Deploy" alt="Deploy" />
  </a>
  <a href="https://juninmd.github.io/o-canto-de-silicio/">
    <img src="https://img.shields.io/badge/📖%20Ler%20Online-GitHub%20Pages-2ea44f?style=for-the-badge" alt="Ler Online" />
  </a>
</p>

<p align="center">
  <img src=".github/assets/screenshots/home.png" alt="Página inicial do leitor VitePress, com o título O Canto de Silício e os botões Começar a Ler e Conhecer Elara" width="860" />
</p>

</div>

---

## 🌌 Sinopse

Séculos após o **Grande Colapso**, a humanidade rasteja nas entranhas de **Nova Aether** sob a sombra de antigas inteligências artificiais transformadas em deuses mecânicos silenciosos.

**Elara**, uma jovem sucateira marcada por olhos violeta incandescentes e uma perigosa afinidade bioelétrica, sobrevive nas profundezas do Setor 4. Ao descobrir que consegue ouvir e sintonizar a frequência primordial da rede — o *canto das máquinas* —, ela e o veterano mercenário **Jaxon** desenterram o segredo grotesco que sustenta o poder da Ordem do Silício: mentes humanas escravizadas em tanques biomecânicos de *wetware*.

Uma odisseia de alta tensão, ferrugem, chuva ácida e sacrifício, onde a última faísca biológica desafia o silêncio eterno do silício.

---

## 👤 Protagonista: Elara

| Atributo | Detalhes |
| :--- | :--- |
| **Origem** | Setor 4 (A Pilha) / Dutos Térmicos |
| **Ocupação** | Sucateira de Relíquias Pré-Colapso |
| **Peculiaridade** | Olhos violeta e habilidade de interface neural biológica direta sem implantes |
| **Poder** | Condução bioelétrica, capaz de sobrecarregar circuitos e sintonizar nós de dados |
| **Companheiro** | Jaxon, mercenário veterano com prótese mecânica pesada e revólver de tambor |

---

## 🗺️ O Universo de Nova Aether

```
                           [ O CUME ]
               Elite corporativa e jardins puros
                            ▲
                            │
              [ A PILHA / SETORES CENTRAIS ]
     Favela vertical, neons trêmulos, chuva ácida e cartéis
                            │
                            ▼
                     [ ABISMO TERMAL ]
        Fornalha industrial tóxica, operários de amianto
                            │
                            ▼
                   [ NÓDULO PRIMÁRIO ]
             O covil de wetware do Deus-Máquina
```

- **Setor 4 (A Pilha):** Megacidade vertical densa, úmida e saturada de ozônio, controlada pelo Cartel da Água.
- **Ordem do Silício:** Fanáticos liderados pelo Alto Sacerdote Malakar que pregam a "Ascensão" artificial.
- **Deus-Máquina:** A colossal mente gestalt biomecânica que comanda os sentinelas e autômatos de purificação.

---

## 📖 Leitura Rápida

- 🚀 [Capítulo 1: O Canto](docs/public/capitulos/capitulo-1.md)
- ⚙️ [Capítulo 41: O Silenciamento do Deus-Máquina](docs/public/capitulos/capitulo-41.md)
- ❄️ [Capítulo 80: Frio e Ferrugem](docs/public/capitulos/capitulo-80.md)
- 🔥 [Capítulo 104: Forjas do Abismo](docs/public/capitulos/capitulo-104.md)
- 👥 [Dossiê Completo de Personagens](docs/personagens.md)
- 🪐 [Guia do Universo e Facções](docs/sobre.md)

---

## ⚙️ Como funciona

Os capítulos são Markdown; o VitePress gera um site estático e o workflow `pages.yml` publica no GitHub Pages.

```mermaid
flowchart LR
    A["docs/public/capitulos/*.md<br/>capítulos em Markdown"] --> B["docs/.vitepress/config.mjs<br/>rotas, navegação e tema"]
    B --> C["npm run docs:build<br/>VitePress"]
    C --> D["docs/.vitepress/dist"]
    D --> E[".github/workflows/pages.yml<br/>upload e deploy"]
    E --> F["GitHub Pages<br/>juninmd.github.io/o-canto-de-silicio"]
    D --> G["Dockerfile<br/>imagem nginx (workflow deploy.yml)"]
```

- O `base` do VitePress é `/o-canto-de-silicio/`, por isso o site fica sob esse caminho.
- O `deploy.yml` constrói a imagem Docker e publica no GHCR a cada push em `master` ou `main`.

---

## 💻 Ambiente de Leitura Local (VitePress)

O livro conta com interface web moderna e tema dark imersivo, gerados pelo VitePress.

```bash
# Clone o repositório
git clone git@github.com:juninmd/o-canto-de-silicio.git

# Acesse o diretório
cd o-canto-de-silicio

# Instale as dependências
npm install

# Inicie o leitor interativo
npm run docs:dev

# Para compilar versão estática de produção
npm run docs:build
```

---

## 📂 Estrutura do Projeto

```text
o-canto-de-silicio/
├── assets/             # Imagens e materiais visuais oficiais
├── docs/               # Conteúdo do livro e interface VitePress
│   ├── .vitepress/     # Configuração de rotas, navegação e tema
│   ├── public/         # Capítulos em Markdown (capitulos/, 1 a 122) e mídia (midia/)
│   ├── reflexoes/      # Análises críticas e reflexões de cada capítulo
│   ├── personagens.md  # Fichas técnicas dos personagens
│   └── sobre.md        # Lore e geografia do universo
└── scripts/            # Utilitários de automação e validação
```

---

## ⚠️ Limitações conhecidas

- O badge "120+ Capítulos" é texto fixo; não é atualizado sozinho quando há capítulos novos.

> [!NOTE]
> A licença é declarada como ISC no `package.json`, mas o repositório não tem arquivo `LICENSE`.

---

<p align="center">
  <sub>© O Canto de Silício. Desenvolvido para amantes de ficção científica, cyberpunk e narrativas imersivas.</sub>
</p>
