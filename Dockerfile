FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_STRIPE_PUBLIC_KEY
ARG VITE_ONE_SIGNAL_APP_ID

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_STRIPE_PUBLIC_KEY=${VITE_STRIPE_PUBLIC_KEY}
ENV VITE_ONE_SIGNAL_APP_ID=${VITE_ONE_SIGNAL_APP_ID}

RUN npm run build

FROM node:22-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 5174

CMD ["serve", "-s", "dist", "-l", "5174"]
