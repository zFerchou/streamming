# Usa la imagen base de Node
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos
COPY package*.json ./
RUN npm install
COPY . .

# Construye la app para producción
RUN npm run build

# Usa una imagen de Nginx para servir la app
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
