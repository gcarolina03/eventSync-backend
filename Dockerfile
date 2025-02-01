# Usa una imagen oficial de Node.js como base
FROM node:18

# Establece el directorio de trabajo
WORKDIR /usr/src/app


# Instala las dependencias
COPY package*.json ./
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Expone el puerto en el que corre la aplicación
EXPOSE 3001

# Comando para ejecutar la aplicación
# CMD ["npm", "start"]

# Comando para ejecutar la aplicación en modo desarrollo con nodemon
CMD ["npm", "run", "dev"]