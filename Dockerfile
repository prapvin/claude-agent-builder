FROM node:22-slim

WORKDIR /app
COPY package.json server.js ./
COPY worker ./worker

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

USER node
CMD ["npm", "start"]
