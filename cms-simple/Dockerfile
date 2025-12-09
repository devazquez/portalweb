FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

# Copiar script de inicialización
COPY init-data.sh /app/init-data.sh
RUN chmod +x /app/init-data.sh

# Ejecutar script de inicialización
RUN /app/init-data.sh

EXPOSE 3001

CMD ["npm", "start"]
