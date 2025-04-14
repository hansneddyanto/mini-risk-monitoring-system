FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build React app for production
RUN npm run build

# Use a lightweight web server to serve frontend
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
