FROM node:20-alpine

WORKDIR /app

COPY package* .
RUN npm i 

COPY . .

CMD ["npm", "run", "dev"]