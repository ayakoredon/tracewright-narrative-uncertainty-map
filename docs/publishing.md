# GitHub Publishing Steps

## Recommended Repository

Repository name:

`tracewright-letter-uncertainty-map`

Short description:

`A synthetic demo for slowing down premature judgment when reviewing AI-mediated text.`

Visibility:

`Public`

## Create the Repository

1. Go to GitHub.
2. Click `+` in the top right.
3. Choose `New repository`.
4. Set the repository name to `tracewright-letter-uncertainty-map`.
5. Set visibility to `Public`.
6. Do not add a README, license, or gitignore on GitHub, because this folder already includes them.
7. Click `Create repository`.

## Upload Files Without Git

1. Open the new repository page.
2. Click `uploading an existing file`.
3. Upload the contents of the `public-release` folder, not the folder itself.
4. Commit with the message:

`Initial public synthetic demo`

## Enable GitHub Pages

1. Open the repository `Settings`.
2. Go to `Pages`.
3. Under `Build and deployment`, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
4. Save.

The public demo URL will usually become:

`https://YOUR-USERNAME.github.io/tracewright-letter-uncertainty-map/`
