FROM node:18.16.0

MAINTAINER "Andrea Accardo"

# Create app directory
WORKDIR /app

COPY package*.json ./

COPY ./ui/schema.prisma ./ui/

# Install app dependencies
RUN npm install

# Copy all files
COPY ./server ./server

COPY ./contracts ./contracts

COPY ./db ./db

COPY env.mjs jest.config.ts ./

COPY ./ui/.env ./ui/

# Build the server
RUN npm run build:server

USER node

EXPOSE 8000

# Experimental flag is needed to support ESM modules
ENTRYPOINT ["npm", "run", "start:server"]