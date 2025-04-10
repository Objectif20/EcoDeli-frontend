# Étape 1 : Build de l'application
FROM node:22 AS builder

WORKDIR /app

# Installer npm et dépendances
RUN npm install -g npm@10

COPY package*.json ./
RUN npm install

# Copier le code source et construire l'application
COPY . .
ARG VITE_API_BASE_URL
ARG VITE_STRIPE_PUBLIC_KEY

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_STRIPE_PUBLIC_KEY=${VITE_STRIPE_PUBLIC_KEY}

# Limiter la mémoire et ralentir le build pour éviter de surcharger le serveur
RUN NODE_OPTIONS="--max-old-space-size=512" nice -n 19 npm run build

# Étape 2 : Image finale plus légère avec juste les fichiers build
FROM node:22 AS runner

WORKDIR /app

# Installer `serve` pour servir l'app
RUN npm install -g serve

# Copier uniquement les fichiers de build
COPY --from=builder /app/dist dist/

EXPOSE 5174

CMD ["serve", "-s", "dist", "-l", "5174"]