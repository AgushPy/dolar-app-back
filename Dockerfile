# Usa una imagen base de Node.js
FROM node:18-slim

# Instala dependencias necesarias para Chromium
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fontconfig \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libgtk-3-0 \
    lsb-release \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Instala Chromium
RUN apt-get update && apt-get install -y chromium

# Establece la variable de entorno para Chromium
ENV CHROMIUM_PATH=/usr/bin/chromium

# Crea y establece el directorio de trabajo
WORKDIR /api

# Copia tu código de la app en el contenedor
COPY . .

# Instala las dependencias de Node.js
RUN npm install

# Expon la puerta que usará la app
EXPOSE 3000

# Configura Puppeteer para usar Chromium instalado
ENV PUPPETEER_EXECUTABLE_PATH=$CHROMIUM_PATH

# Comando para ejecutar tu app
CMD ["node", "api/index.js"]
