# The first FROM is now a stage called build-stage

FROM node:16 AS build-stage
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

ENV REACT_APP_BACKEND_URL=http://localhost:3003

# To avoid conflicting dependencies (@mui/styles is not compatible with React.StrictMode or React 18, and it will not be updated.)
RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

# This is a new stage, everything before this is gone, except the files we want to COPY

FROM nginx:1.20-alpine
# COPY the directory build from build-stage to /usr/share/nginx/html
# The target location here was found from the Docker hub page

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to run Nginx and serve the static files
CMD ["nginx", "-g", "daemon off;"]