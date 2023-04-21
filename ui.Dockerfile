FROM node:18.16.0

MAINTAINER "Andrea Accardo"

# Create app directory
WORKDIR /app

COPY package*.json ./

COPY ./ui/schema.prisma ./ui/

# Install app dependencies
RUN npm install

# Copy all files
COPY ./ui ./ui

COPY ./contracts ./contracts

COPY ./db ./db

COPY env.mjs postcss.config.cjs prettier.config.cjs tailwind.config.ts ./

RUN npm run build:ui

USER node

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start:ui"]