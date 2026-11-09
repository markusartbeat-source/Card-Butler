# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Container

Voraussetzungen: Node.js 24 und Docker. Die folgenden Befehle im Projektstamm ausfuehren:

```sh
npm ci
```

```sh
npm run build
```

```sh
docker build -t card-butler-frontend .
```

```sh
docker run --rm -p 8080:8080 card-butler-frontend
```

Das Frontend ist danach unter `http://localhost:8080` erreichbar. Das Dockerfile
kopiert ausschliesslich das zuvor gebaute `dist` und die danebenliegende
[`nginx.conf`](nginx.conf) in das Nginx-Image. Der Container läuft als Benutzer
10001 auf Port 8080.

Nginx liefert statische Dateien aus, beantwortet `/healthz` und verwendet für
SPA-Routen wie `/login/success` einen Fallback auf `index.html`. Fehlende Dateien
unter `/assets/` liefern HTTP 404. HTTPS, Reverse Proxy und die Weiterleitung
von API-Anfragen an das Backend übernehmen Kubernetes/Traefik.

## GitHub Actions

Der Workflow [`.github/workflows/container.yaml`](.github/workflows/container.yaml)
installiert die Abhängigkeiten, prüft TypeScript und baut das Frontend sowie
das Docker-Image. Vor der Veroeffentlichung prueft er die Nginx-Konfiguration,
den Laufzeitbenutzer, den Health-Endpunkt, die Startseite, den SPA-Fallback und
HTTP 404 fuer fehlende Assets.

Bei Pushes auf `main`/`master` und manuellen Starts wird das geprüfte Image als
`ghcr.io/<repository-owner>/card-butler-frontend:git-<commit-sha>` veröffentlicht.
Der Repository-Owner wird kleingeschrieben aus GitHub uebernommen. Pull Requests
bauen und pruefen das Image, veroeffentlichen es jedoch nicht.
