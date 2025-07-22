FROM node:alpine AS development

# Create a non-privileged user
RUN adduser -D -s /bin/sh -u 1001 app

WORKDIR /usr/src/app

# Install pnpm globally first (as root)
RUN npm install -g pnpm

# Copy package files for dependency installation (as root)
COPY --chown=app:app package.json pnpm-lock.yaml nest-cli.json tsconfig.json ./

# Set ownership of the working directory
RUN chown -R app:app /usr/src/app

# Switch to non-privileged user
USER app

# Install dependencies as app user
RUN pnpm install

# Copy source code (will be overridden by watch sync)
COPY --chown=app:app apps/gateway apps/gateway
COPY --chown=app:app libs libs

# Build the application
RUN pnpm run build gateway

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/gateway/main"]