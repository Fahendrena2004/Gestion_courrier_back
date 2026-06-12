const fs = require('fs');
const path = require('path');
const d = 'd:/gestion_courrier/gestion_courrier_Backend/src';
const r = (dir) => {
  const files = fs.readdirSync(dir);
  files.forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      r(p);
    } else if (p.endsWith('.js')) {
      let content = fs.readFileSync(p, 'utf-8');
      let updated = content
        .replace(/error:\s*Au moins un champ est requis/g, `error: 'Au moins un champ est requis'`)
        .replace(/error:\s*Aucun token fourni/g, `error: 'Aucun token fourni'`)
        .replace(/error:\s*Token invalide/g, `error: 'Token invalide'`)
        .replace(/error:\s*Non trouvé/g, `error: 'Non trouvé'`);
      if (content !== updated) {
        fs.writeFileSync(p, updated);
        console.log('Fixed ' + p);
      }
    }
  });
};
r(d);
