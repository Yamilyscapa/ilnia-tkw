# ilnia-tkw local dev orchestration
#
# Prerequisites: Docker running, plus `vercel login` once (for the API).
# Quickstart:
#   make setup            # one-time: deps, keys, both stacks, env files, users
#   make api-staging      # terminal 2
#   make mobile-staging   # terminal 3  (first run: make ios-staging)

.DEFAULT_GOAL := help

.PHONY: help setup install keys up down reset env-sync seed \
        db-staging db-prod api-staging api-prod \
        mobile-staging mobile-prod ios-staging ios-prod \
        e2e-staging e2e-prod

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) \
		| awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

setup: install keys up env-sync seed ## One-time bootstrap (run this first)
	@echo ""
	@echo "Setup complete. Demo users: user@staging.com / user@prod.com  (Password123!)"
	@echo "Next: 'make api-staging' and 'make mobile-staging' in separate terminals."

install: ## Install workspace dependencies
	pnpm install

keys: ## Generate per-env JWT signing keys
	./scripts/gen-keys.sh

up: ## Start both Supabase stacks (staging + prod)
	./scripts/sb.sh staging start
	./scripts/sb.sh production start

down: ## Stop both Supabase stacks
	-./scripts/sb.sh staging stop
	-./scripts/sb.sh production stop

reset: ## Reset both DBs (re-run migrations + seed)
	./scripts/sb.sh staging db reset
	./scripts/sb.sh production db reset

env-sync: ## Write apps/api/.env.* from the running stacks
	./scripts/sync-env.sh

seed: ## Seed demo users in both envs
	./scripts/seed-user.sh staging
	./scripts/seed-user.sh production

db-staging: ## Start the staging stack only
	./scripts/sb.sh staging start
db-prod: ## Start the prod stack only
	./scripts/sb.sh production start

api-staging: ## Run staging API (vercel dev :3001)
	./scripts/api.sh staging
api-prod: ## Run prod API (vercel dev :3002)
	./scripts/api.sh production

mobile-staging: ## Run the app against staging
	./scripts/mobile.sh staging
mobile-prod: ## Run the app against prod
	./scripts/mobile.sh production

ios-staging: ## Build + install the dev client (staging) — first run / native deps
	./scripts/mobile.sh staging run:ios
ios-prod: ## Build + install the dev client (prod)
	./scripts/mobile.sh production run:ios

e2e-staging: ## Run the Maestro E2E flow against staging
	./scripts/e2e.sh staging
e2e-prod: ## Run the Maestro E2E flow against prod
	./scripts/e2e.sh production
