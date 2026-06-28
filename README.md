# Chor-Übe-App

Diese App ist eine einfache kostenlose Chor-Übe-Webseite für GitHub Pages.

## Audiodateien einfügen

Lege deine Stimmen in den Ordner `audio` und benenne sie so:

- `sopran.mp3`
- `alt.mp3`
- `tenor.mp3`
- `bass.mp3`

Wenn deine Dateien anders heißen oder mehr/weniger Stimmen haben, öffne `script.js` und ändere oben die Liste `tracksConfig`.

## Bei GitHub hochladen

1. Auf github.com ein neues Repository erstellen, z. B. `chor-app`.
2. Diese Dateien hochladen: `index.html`, `styles.css`, `script.js` und den Ordner `audio`.
3. Im Repository auf `Settings` gehen.
4. Links auf `Pages` klicken.
5. Bei `Build and deployment` → `Source` auf `Deploy from a branch` stellen.
6. Branch `main` auswählen und speichern.
7. Nach kurzer Zeit erscheint dort dein öffentlicher Link.

## Wichtig

GitHub erlaubt pro Datei maximal 100 MB. Wenn deine Audiodateien größer sind, sollten sie vorher als MP3 komprimiert werden.
