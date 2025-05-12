# Utiliser une image Node.js 22 officielle comme base
FROM node:22-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install   

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port sur lequel l'application tourne
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
