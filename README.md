# Entre Combo Builder

Esta é uma aplicação web interativa que permite aos usuários montar e personalizar seu combo ideal de internet, TV e serviços da "Entre". A ferramenta foi projetada para ser intuitiva, guiando o usuário passo a passo na seleção de produtos e culminando em um resumo do pedido pronto para ser enviado via WhatsApp.

## ✨ Features

-   **Montagem de Combo Interativa:** Seleção passo a passo de planos de internet, TV, aplicativos e outros adicionais.
-   **Planos Residenciais e Empresariais:** Opções personalizadas para diferentes tipos de clientes.
-   **Perfis Sugeridos:** Combos pré-montados para perfis de uso comuns (Gamer, Família, Home Office, etc.).
-   **Carrinho e Resumo Dinâmico:** O carrinho de compras e o valor total são atualizados em tempo real.
-   **Design Responsivo:** Experiência otimizada para desktops, tablets e smartphones.
-   **Integração com WhatsApp:** Geração de uma mensagem de pedido formatada para envio direto a um consultor de vendas.

## 🚀 Tech Stack

-   **Frontend:** React, TypeScript
-   **Estilização:** Tailwind CSS

## 📂 Estrutura do Projeto

O projeto segue uma estrutura padrão para aplicações React, organizada para facilitar a manutenção e escalabilidade.

```
/
├── public/
│   ├── images/         # Todos os recursos de imagem (PNG, JPG, SVG)
│   └── index.html      # Template HTML principal
├── src/
│   ├── components/     # Componentes React reutilizáveis
│   ├── data/           # Dados estáticos dos produtos (products.ts)
│   ├── utils/          # Funções utilitárias (formatters.ts)
│   ├── App.tsx         # Componente principal da aplicação
│   ├── index.tsx       # Ponto de entrada da aplicação
│   ├── types.ts        # Definições de tipos TypeScript
│   └── ...
└── README.md           # Esta documentação
```

---
## 🖼️ Guia de Recursos de Imagem

Para que a aplicação funcione corretamente, todas as imagens devem ser salvas diretamente na pasta `public/images/`, seguindo as convenções de nomenclatura e dimensões recomendadas abaixo. **Não use subpastas como `tv/` ou `apps/`.**

| Imagem                  | Caminho do Arquivo                      | Dimensões Recomendadas (Largura x Altura) |
| ----------------------- | --------------------------------------- | ----------------------------------------- |
| **Logo Principal**      | `images/entre_logo.png`                 | 100px x 40px                              |
| **Logo OMNI**           | `images/omni_logo.png`                  | 200px x 200px (ou proporção quadrada)     |
| **Logo Watch TV**       | `images/watch_logo.png`                 | 100px x 40px                              |
| **Imagem NoBreak**      | `images/nobreak_source.png`             | ~200px x 100px (proporcional)             |

### Imagens dos Planos de TV

As imagens dos planos de TV devem ter uma proporção de **260:380** para se ajustarem perfeitamente ao card.

| Plano       | Nome do Arquivo          | Dimensões Recomendadas (Largura x Altura) |
| ----------- | --------------------------- | ----------------------------------------- |
| Essential   | `tv-essential.png`| 260px x 380px                             |
| Cine        | `tv-cine.png`     | 260px x 380px                             |
| Plus        | `tv-plus.png`     | 260px x 380px                             |
| Premium     | `tv-premium.png`  | 260px x 380px                             |

### Logos dos Aplicativos

Os logos dos aplicativos devem ser salvos em `public/images/`. O nome do arquivo é gerado automaticamente a partir do nome do aplicativo, seguindo um padrão "slugify" (letras minúsculas, espaços trocados por `_`, sem acentos ou caracteres especiais).

-   **Formato do Nome:** `{nome_do_app_slugified}_logo.png`
-   **Dimensões Recomendadas:** 200px x 200px (quadrado)

**Exemplos de Nomes de Arquivo:**

| Nome do App                  | Nome do Arquivo Gerado             |
| ---------------------------- | ---------------------------------- |
| Deezer                       | `deezer_logo.png`                  |
| Disney+ (com anúncio)        | `disneyplus_com_anuncio_logo.png`  |
| Kaspersky Standard (1 licença) | `kaspersky_standard_1_licenca_logo.png` |
| Queima Diária                | `queima_diaria_logo.png`           |

---
## ⚙️ Rodando Localmente

Para executar o projeto em seu ambiente de desenvolvimento local:

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DO_DIRETORIO>
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm start
    # ou
    yarn start
    ```

4.  Abra [http://localhost:5173](http://localhost:5173) (ou a porta indicada no seu terminal) no seu navegador.

---
## ☁️ Deploy no Vercel

O Vercel é uma plataforma ideal para fazer o deploy de aplicações React de forma rápida e gratuita. Siga os passos abaixo:

1.  **Crie uma conta:** Acesse [vercel.com](https://vercel.com/) e crie uma conta (é possível usar sua conta do GitHub, GitLab ou Bitbucket).

2.  **Crie um repositório Git:** Se o seu projeto ainda não estiver em um repositório Git (GitHub, etc.), crie um e envie seus arquivos para ele.

3.  **Importe o Projeto no Vercel:**
    -   No seu dashboard do Vercel, clique em "Add New..." -> "Project".
    -   Selecione o repositório Git que você acabou de criar/enviar.
    -   O Vercel irá detectar automaticamente que é um projeto **Vite**.

4.  **Configure o Build (geralmente não é necessário alterar):**
    -   **Framework Preset:** `Vite`
    -   **Build Command:** `npm run build` ou `yarn build`
    -   **Output Directory:** `dist`
    -   **Install Command:** `npm install` ou `yarn install`

5.  **Variáveis de Ambiente:**
    -   Este projeto não requer variáveis de ambiente. Se futuramente for necessário (ex: chaves de API), você pode adicioná-las na seção "Environment Variables".

6.  **Faça o Deploy:**
    -   Clique no botão "Deploy".
    -   O Vercel irá instalar as dependências, executar o build e publicar sua aplicação. Em poucos minutos, você receberá um link público para o seu projeto!