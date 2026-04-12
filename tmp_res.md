# Plan de Résolution des Vulnérabilités Sécurité

## Contexte

L'application Electron "Finances" (gestion de portefeuille financier) présente **30 vulnérabilités npm** dont 1 critique, 18 high, 5 moderate. Le problème principal est qu'**Electron 28.1.3 est en fin de vie depuis juin 2024** avec 6 CVEs HIGH non corrigés. L'app a une surface d'API minimale (BrowserWindow + IPC + contextBridge) ce qui facilite grandement la mise à jour.

### Vulnérabilités par priorité

| Priorité | Package | Sévérité | Type | CVEs |
|----------|---------|----------|------|------|
| **P0** | electron 28.1.3 | 6x HIGH | Direct | Use-after-free (3), cmd injection (1) |
| **P1** | react-router-dom 6.21.3 | HIGH | Direct | XSS via Open Redirects |
| **P2** | electron-builder 24.9.1 | 5x HIGH+ | Transitif | tar, xmldom, form-data, glob, minimatch |
| **P3** | serialize-javascript 6.0.2 | HIGH | Transitif | RCE via RegExp.flags |
| **P4** | lodash/lodash-es 4.17.21 | HIGH+MOD | Transitif | Code injection, prototype pollution |

---

## Phase 1 : Corrections automatiques (risque très faible)

**Action** : `npm audit fix`

Résout les dépendances transitives avec des patches compatibles semver (picomatch, webpack, tmp, yaml).

**Vérification** :
- `npm run build` (main + renderer)
- `npm run start` — l'app démarre et charge les données
- `npm audit` — vérifier la réduction

---

## Phase 2 : Mise à jour react-router-dom (risque faible)

**Fichier** : `package.json`
**Changement** : `"react-router-dom": "^6.21.3"` → `"^6.30.0"`

**Justification** : L'app utilise uniquement `HashRouter`, `Route`, `Routes`, `useNavigate` — APIs stables sans breaking changes entre 6.21 et 6.30. Le HashRouter réduit déjà le risque XSS (pas de navigation serveur).

**Vérification** :
- `npm ls @remix-run/router` — version patchée
- Navigation sidebar (routes `/tam`, `/other-feature`, catch-all `*`)

---

## Phase 3 : Mise à jour electron-builder (risque moyen)

**Fichier** : `package.json`
**Changement** : `"electron-builder": "^24.9.1"` → `"^26.0.0"`

**Résout** : tar (5 HIGH), @xmldom/xmldom, form-data (Critical), glob, minimatch — toutes transitives via electron-builder.

**Justification** : La config build dans `package.json` (lignes 49-72) utilise des options basiques (`appId`, `productName`, targets win/mac/linux) stables entre v24 et v26. Pas d'utilisation d'electron-updater ni de plugins avancés.

**Vérification** :
- `npm ls tar` / `npm ls @xmldom/xmldom` — versions corrigées
- `npm run pack` — packaging fonctionne
- `npm run dist` — distribution complète (optionnel)

---

## Phase 4 : Mise à jour Electron (critique, risque moyen)

**Fichier** : `package.json`
**Changement** : `"electron": "^28.1.3"` → `"^32.0.0"`

**Résout** : 6 CVEs HIGH — use-after-free (offscreen, PowerMonitor, WebContents), renderer cmd injection.

### Analyse des breaking changes 28 → 32

| Version | Breaking Change | Impact sur notre app |
|---------|----------------|---------------------|
| 29 | ipcRenderer ne peut plus être envoyé via contextBridge | **NON** — `preload.js` expose déjà des wrappers individuels |
| 30 | BrowserView déprécié | **NON** — pas utilisé |
| 31 | Changements Chromium API | **NON** — APIs basiques uniquement |
| 32 | Web File `.path` supprimé | **NON** — pas de drag-and-drop |

**Fichiers critiques à vérifier (pas de changement de code attendu)** :
- [main.js](src/main/main.js) — utilise `app`, `BrowserWindow`, `ipcMain` (APIs stables)
- [preload.js](src/main/preload.js) — pattern `contextBridge.exposeInMainWorld` déjà conforme Electron 29+
- [dataFiles.js](src/main/services/dataFiles.js) — `app.getPath()` (API stable)

**Vérification complète** :
1. `npm run build` — compilation sans erreurs
2. `npm run start` — fenêtre s'ouvre, charge index.html
3. Test IPC : données TAM chargées via `request-data-channel` / `response-data-channel`
4. Test écriture : soumission formulaire TAM → optimisation s'exécute → résultats affichés
5. Test sauvegarde : `update-tam-config` écrit le JSON
6. `npm run dev` — mode développement avec hot reload

---

## Phase 5 : Overrides npm pour serialize-javascript (risque faible)

**Fichier** : `package.json`
**Ajout** :
```json
"overrides": {
  "serialize-javascript": ">=6.0.2"
}
```

**Justification** : `copy-webpack-plugin` et `terser-webpack-plugin` dépendent de serialize-javascript ^6.x. Si `npm audit fix` ne résout pas le problème, l'override force la résolution vers une version patchée.

**Vérification** : `npm run build` — webpack compile correctement

---

## Phase 6 : Décision lodash (risque accepté)

**Recommandation : accepter le risque.**

- lodash 4.17.21 est la dernière version disponible (projet effectivement non maintenu)
- Dépendance transitive de formik uniquement — **jamais importé directement** dans le code source
- Les fonctions vulnérables (`_.template()`) ne sont **pas utilisées** par formik (qui utilise `cloneDeep`, `isPlainObject`, etc.)
- Alternative lourde : remplacer formik par react-hook-form (refactoring de ~5 composants formulaire)

---

## Ordre d'exécution

| Étape | Phase | Risque | Vulnérabilités résolues |
|-------|-------|--------|------------------------|
| 1 | Phase 1 : npm audit fix | Très faible | picomatch, webpack, tmp, yaml |
| 2 | Phase 2 : react-router-dom | Faible | 1 HIGH (XSS) |
| 3 | Phase 3 : electron-builder | Moyen | ~8 vulnérabilités (tar, xmldom, form-data, glob, minimatch) |
| 4 | Phase 4 : Electron 32 | Moyen | 6 HIGH (use-after-free, cmd injection) |
| 5 | Phase 5 : overrides npm | Faible | serialize-javascript (1 HIGH) |
| 6 | Phase 6 : lodash | N/A | Risque accepté (transitive, non exploitable) |

## Vérification finale

Après toutes les phases :
- `npm audit` — devrait montrer 0 high/critical (sauf lodash accepté)
- `npm run build && npm run start` — app fonctionnelle
- `npm run pack` — packaging réussi
