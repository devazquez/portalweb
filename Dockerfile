# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY vite.config.js ./
COPY index.html ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY src ./src
COPY public ./public

# Construir aplicación
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Instalar servidor HTTP simple
RUN npm install -g serve

# Copiar archivos construidos desde builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando para iniciar la aplicación
CMD ["serve", "-s", "dist", "-l", "3000"]
