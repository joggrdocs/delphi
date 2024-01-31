FROM gcr.io/google.com/cloudsdktool/google-cloud-cli:latest

RUN gcloud run services list --format=json("metadata.name") --filter="metadata.creationTimestamp>=2024-01-15T12:00:00"