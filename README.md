# Ideomind

A decentralized AI content-generation studio and dePIN gateway.

Ideomind is the open-source predecessor of **Unreal AI**, built to democratize generative AI by combining SvelteKit ergonomics with decentralized GPU compute ("darts"), tokenised access, and a web-first creator experience.

## ✨ Highlights

- Unified text-to-anything workspace (text, image, code)
- Plug-and-play AI inference API — still powering Unreal AI’s network
- On-chain wallet auth and micro-payments (ERC-20 $UNREAL token)
- **darts dePIN**: route intensive jobs to community GPUs with provable accounting
- 70+ headless UI components (shadcn-svelte)
- Supabase-backed user profiles, likes & social graph
- End-to-end tests with Playwright and automated Vercel previews

## 🏗️ Architecture

```text
ideomind/
 ├─ src
 │  ├─ lib/          # shared logic, state, blockchain, api clients
 │  ├─ routes/       # SvelteKit pages + server/API endpoints
 │  ├─ app.html      # root html shell
 │  └─ service-worker.js
 ├─ darts/           # model checkpoints & wasm blobs (git-lfs)
 ├─ utils/           # helper scripts
 └─ devops/          # CI/CD, Docker, Vercel, Lighthouse
```

Key services:

1. **Supabase** – auth & database
2. **Lighthouse / Filecoin** – decentralized asset storage
3. **Ethereum / Torus mainnet** – payments & staking
4. **darts nodes** – distributed GPU runners

## 🔌 Public APIs (excerpt)

Ideomind exposes REST-flavoured endpoints under `/api/*`. Unreal AI currently reverse-proxies these for compute operations.

| Route               | Method | Purpose                     |
| ------------------- | ------ | --------------------------- |
| `/api/inference`    | POST   | Submit a generation job     |
| `/api/job/{id}`     | GET    | Stream job status & outputs |
| `/api/wallet/nonce` | POST   | EIP-191 login nonce         |

## 🗺️ Project Status

Ideomind is feature-frozen; active development continues in the [Unreal AI](https://github.com/unreal-art/v0) repo. Bug-fix PRs are welcome.

## 🤝 Contributing

1. Fork and create a feature branch.
2. Follow the style guide: `pnpm lint` & `prettier`.
3. Open a PR describing the change and its impact.

Security issues? Email **hiro@unreal.art**.

## ⚖️ License

MIT © Hiro & Unreal AI contributors
