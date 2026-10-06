# =============================================================================
# Lion Park — Frontend (Angular 21 + UnoCSS, servido por nginx)
# Contexto de build esperado: ./frontend
# =============================================================================

# ----------------------------------------------------------------------------
# Estágio 1 — build
# ----------------------------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app

# package*.json primeiro: a camada de dependências só é refeita quando elas mudam
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# build = build:unocss && build:ng (sequencial, via npm-run-all).
# O UnoCSS precisa gerar src/uno.css ANTES da compilação do Angular.
# A configuração de produção troca environment.ts por environment.prod.ts,
# fazendo apiUrl virar "/api" (relativo, resolvido pelo proxy do nginx).
RUN npm run build

# ----------------------------------------------------------------------------
# Estágio 2 — runtime
# ----------------------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/lionpark.conf

# O builder @angular/build:application emite os assets em dist/<projeto>/browser
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# nginx precisa escrever cache e PID; a imagem oficial já traz o usuário nginx
RUN touch /var/run/nginx.pid \
 && chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /usr/share/nginx/html

USER nginx
EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
