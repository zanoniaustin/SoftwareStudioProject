FROM node:20

# set working directory
WORKDIR /app

# copy packages and dependencies
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./
COPY tsconfig.json ./
COPY eslint.config.mjs ./

COPY apps/web ./apps/web

# install dependencies
RUN npm install

# expose port
EXPOSE 3000

CMD ["npx", "nx", "serve-static", "@pokehub/web"]
