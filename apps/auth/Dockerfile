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

# Copy service source code and shared libs
COPY --chown=app:app apps/auth apps/auth
COPY --chown=app:app libs libs

# Generate Prisma client for this service (uses apps/auth/prisma/schema.prisma)
RUN pnpm prisma generate --schema apps/auth/prisma/schema.prisma

# Build the application
RUN pnpm run build auth

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

RUN npm install -g pnpm

# Reuse built node_modules (including Prisma engines and generated client) from development stage
COPY --from=development /usr/src/app/node_modules ./node_modules
# Keep package metadata for tooling
COPY package.json pnpm-lock.yaml ./

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/apps/auth/src/generated ./apps/auth/src/generated

CMD ["pnpm", "run", "start:prod", "dist/apps/auth/main"]