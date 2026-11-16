# Setup

About five minutes. Run these in your own terminal.

## 0. What you need

- **A current Node.js LTS release** (the lab was tested on Node 22).
- **An OpenRouter API key**: openrouter.ai, account menu, Keys, Create Key.
- **A Cloudflare account** (the free plan is enough).

## 1. Install

```
cd week6-lab
npm install
```

## 2. Log in to Cloudflare

```
npx wrangler login
```

## 3. Store the OpenRouter key as a Cloudflare secret

```
npx wrangler secret put OPENROUTER_API_KEY
```

Paste the key at the prompt. It is stored encrypted in your Cloudflare
account and never touches a file in this project.

## 4. Run locally

Create a file named `.dev.vars` in this folder with one line:

```
OPENROUTER_API_KEY=your-key-here
```

`.dev.vars` is in `.gitignore`. Then:

```
npm test
npm run rehearse
npm run dev
```

`npm run dev` prints a local URL (usually `http://localhost:8787`).

## 5. Deploy

```
npm run deploy
```

This prints the live URL, `https://week6-lab.<your-subdomain>.workers.dev`.
Check the deployed copy with the real model before a session:

```
npm run rehearse -- --url https://week6-lab.<your-subdomain>.workers.dev
```

## Settings

In `wrangler.jsonc`:

- `MODEL`: the OpenRouter model. The lab is tuned for
  `meta-llama/llama-3.1-8b-instruct`. A stronger model will resist more
  of the prepared attacks; rerun the rehearsal after any change.
- `PROVIDER_ORDER`: the preferred OpenRouter provider (`Groq`). If
  OpenRouter falls back to another provider, the page says so next to the
  Run button, because the same model can behave differently there.

## If something goes wrong

- **"OPENROUTER_API_KEY is not set"**: step 3 (deployed) or step 4 (local)
  has not been done.
- **Cloudflare auth error on deploy**: run `npx wrangler login` again.
- **"The model provider returned an error"**: the detail shows OpenRouter's
  message. Usually a wrong key or no credit on the account.
- **"The model request did not complete"**: a timeout or network problem.
  Run again.
- **A step gives a different outcome from the one described**: see
  "If a run goes differently" in `PRESENTER-GUIDE.md`.
