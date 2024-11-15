# Build Stage
FROM node:22-alpine3.19 AS builder

# Instalar las dependencias necesarias
RUN apk update && apk upgrade && apk add --no-cache git
# ARG DATABASE_URL
# ENV DATABASE_URL=$DATABASE_URL
# RUN echo "DATABASE_URL is: $DATABASE_URL"
# Crear y configurar el directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos necesarios para instalar dependencias
COPY mineminer/package.json mineminer.package-lock.json ./mineminer/
# COPY prisma ./prisma




# Instalar las dependencias
RUN npm install 
# --production && npm cache clean --force
# RUN npm run prisma:pull
# RUN npm run prisma:generate

# Copiar el resto del código y construir la aplicación
COPY . .

# (Opcional) Ejecutar Prisma si es necesario
# RUN npx prisma generate

RUN npm run build





# Production Stage
FROM node:22-alpine3.19

# Crear el directorio de trabajo
WORKDIR /usr/src/app

# Copiar solo los archivos necesarios del stage de construcción
COPY --from=builder /usr/src/app/. ./
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/package-lock.json ./
# COPY --from=builder /usr/src/app/prisma ./prisma
# COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma    

# Instalar solo las dependencias de producción
RUN npm install --production && npm cache clean --force


# Configurar la variable de entorno para producción
ENV NODE_ENV=production
ARG PORT
ENV PORT=$PORT
# Exponer el puerto
EXPOSE $PORT

RUN echo  "puerto expuesto es  $PORT"
# Exponer el puerto
EXPOSE $PORT

# Comando para arrancar la aplicación
CMD ["npm", "run", "start:prod"]