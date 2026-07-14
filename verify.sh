#!/bin/bash
set -e

echo "Building React app..."
cd react-portfolio
npm run build
cd ..

echo "Assembling site..."
rm -rf _site
mkdir -p _site
cp -r react-portfolio/dist/. _site/
cp -r images projects resume _site/

# Serve files at their literal paths (no clean-URL redirects). Without this,
# serve rewrites /projects/project1.html -> /projects/project1, which shifts the
# base for relative links (project.css) and produces false 404s. GitHub Pages
# serves the literal path, so this makes the check match production.
printf '{ "cleanUrls": false, "trailingSlash": false }\n' > _site/serve.json

echo "Serving locally..."
# No -s / SPA fallback: with it, serve returns 200 for every path (masking 404s),
# so the link check below would never catch a broken link. Plain static serving
# also matches how GitHub Pages responds in production.
npx serve _site -l 8080 &
SERVER_PID=$!

# Always tear down the server and build output, even if a step below fails.
cleanup() {
  echo "Cleaning up..."
  kill "$SERVER_PID" 2>/dev/null || true
  rm -rf _site
}
trap cleanup EXIT

npx wait-on http://localhost:8080

echo "Checking for broken links..."
# The site root is a client-rendered React SPA, so linkinator (which does not run
# JavaScript) only sees the static shell. Seed the project pages explicitly so
# their back-links get crawled too.
BASE="http://localhost:8080"
SEEDS="$BASE"
for i in 1 2 3 4 5 6; do
  SEEDS="$SEEDS $BASE/projects/project$i.html"
done

# Capture linkinator's exit code without letting set -e abort before cleanup.
LINK_STATUS=0
npx linkinator $SEEDS --recurse --skip "^(?!http://localhost)" || LINK_STATUS=$?

if [ "$LINK_STATUS" -ne 0 ]; then
  echo "Broken links found. Do not push yet."
  exit 1
else
  echo "No broken links. Safe to commit and push."
fi
