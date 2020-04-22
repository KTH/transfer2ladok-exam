# Stage 0. Compile the frontend code
FROM kthse/kth-nodejs:12.0.0
WORKDIR /tmp/lms-transfer2ladok-exam/
# Copying only package.json to avoid reinstalling dependencies if only code has changed
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 1. Build the actual image
FROM kthse/kth-nodejs:12.0.0
COPY . .
COPY --from=0 /tmp/lms-transfer2ladok-exam/dist ./dist
RUN node -v
RUN npm ci --only=production

EXPOSE 3001
CMD ["node", "app.js"]
