# Claude Agent Builder — Manual GitHub and Cloud Run Deployment

## 1. Prerequisites

- A GitHub account.
- A Google Cloud project with billing enabled.
- Google Cloud CLI and Git installed.
- An Anthropic API key.

Never place the Anthropic key in GitHub, source code or a committed environment file.

## 2. Create the GitHub repository

1. Sign in to GitHub and select **New repository**.
2. Name it **claude-agent-builder**.
3. Select **Private** for an enterprise demonstration.
4. Do not initialize it with a README, license or gitignore.
5. Select **Create repository**.

## 3. Push the project manually

Open a terminal in this project directory:

    git init -b main
    git add .
    git commit -m "Initial Claude Agent Builder"
    git remote add origin https://github.com/YOUR_GITHUB_USERNAME/claude-agent-builder.git
    git push -u origin main

If the origin remote already exists:

    git remote set-url origin https://github.com/YOUR_GITHUB_USERNAME/claude-agent-builder.git
    git push -u origin main

The downloaded package does not include any existing Git history or deployment remote.

## 4. Configure Google Cloud

Replace YOUR_GCP_PROJECT_ID with the project ID, not the display name:

    gcloud auth login
    gcloud config set project YOUR_GCP_PROJECT_ID
    gcloud services enable run.googleapis.com
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable artifactregistry.googleapis.com
    gcloud services enable secretmanager.googleapis.com

## 5. Create the Cloud Run service account

    gcloud iam service-accounts create claude-agent-builder-sa --display-name="Claude Agent Builder"

Its email will be:

    claude-agent-builder-sa@YOUR_GCP_PROJECT_ID.iam.gserviceaccount.com

## 6. Store the Anthropic key safely

In Google Cloud Console:

1. Open **Security → Secret Manager**.
2. Select **Create secret**.
3. Name it **anthropic-api-key**.
4. Paste the Anthropic API key as the value and create it.

Grant the runtime identity access:

    gcloud secrets add-iam-policy-binding anthropic-api-key --member="serviceAccount:claude-agent-builder-sa@YOUR_GCP_PROJECT_ID.iam.gserviceaccount.com" --role="roles/secretmanager.secretAccessor"

## 7. Deploy manually from the source folder

Replace YOUR_CLAUDE_MODEL_ID with a model enabled in your Anthropic account:

    gcloud run deploy claude-agent-builder --source . --region us-east1 --allow-unauthenticated --service-account claude-agent-builder-sa@YOUR_GCP_PROJECT_ID.iam.gserviceaccount.com --set-secrets ANTHROPIC_API_KEY=anthropic-api-key:latest --set-env-vars CLAUDE_MODEL=YOUR_CLAUDE_MODEL_ID

Google Cloud builds the Dockerfile, stores the container and returns the service URL.

## 8. Validate

Confirm:

1. The status says **Claude connected**.
2. Architecture Review produces a Claude response.
3. CTO Intelligence returns an executive brief.
4. Okta onboarding displays its CARTS DAG.
5. Rejecting approval stops safely.
6. Approving allows the audit JSON download.

Health check:

    curl https://YOUR_CLOUD_RUN_URL/healthz

Expected response:

    {"status":"ok"}

## 9. Deploy a later update

    git add .
    git commit -m "Describe the change"
    git push origin main
    gcloud run deploy claude-agent-builder --source . --region us-east1

## 10. Demonstration boundary

The Anthropic secret activates real Claude reasoning. ServiceNow, Okta,
GitHub or Azure DevOps, Azure and GCP actions remain demonstration adapters
until their endpoints, identities, permissions and connector code are configured.
