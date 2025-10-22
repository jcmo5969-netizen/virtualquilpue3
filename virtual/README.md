# Asistente de Triage Quilpué — Final

## Qué incluye
- Next.js (App Router) + Tailwind
- Vercel AI SDK
- Chat en `app/api/chat/route.ts` con `createOpenAI`, cast `as any`, y manejo de errores
- `next.config.ts` con `typescript.ignoreBuildErrors = true`
- Alias `@/` en `tsconfig.json` y `jsconfig.json`
- `@types/react`, `@types/react-dom`, `@types/node` en devDependencies
- APIs: `/api/triage`, `/api/wait-times`
- Motor ESI simplificado en `lib/esi.ts`

## Variables de entorno (Vercel → Settings → Environment Variables)
```
OPENAI_API_KEY=tu_clave
OPENAI_MODEL=gpt-4o-mini  # opcional
```

## Local
```
pnpm install
pnpm dev
```

## Deploy
- Asegura que **Root Directory** apunte a la carpeta con `app/` y `package.json` (root del repo)
- Framework: **Next.js**
- Redeploy
