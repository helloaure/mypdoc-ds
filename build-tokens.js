import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';
import fs from 'fs';

register(StyleDictionary);

// 1. Charger et nettoyer le JSON manuellement à l'aide de Node.js
// Remplacez 'tokens.json' par le nom exact de votre fichier JSON si nécessaire
const rawData = fs.readFileSync('tokens.json', 'utf8');
const figmaData = JSON.parse(rawData);

let cleanTokens = {};

// On parcourt le JSON pour extraire tout ce qui est confiné dans "primitive color/Mode 1" 
// ou dans d'autres sets, et on remonte tout à la racine du JSON
for (const setKey in figmaData) {
  if (typeof figmaData[setKey] === 'object') {
    // Si Tokens Studio a créé un sous-dossier "Mode 1"
    if (figmaData[setKey]['Mode 1']) {
      cleanTokens = { ...cleanTokens, ...figmaData[setKey]['Mode 1'] };
    } else {
      cleanTokens = { ...cleanTokens, ...figmaData[setKey] };
    }
  }
}

// 2. Enregistrer le format CSS ultra-robuste
StyleDictionary.registerFormat({
  name: 'custom/css',
  format: function({ dictionary }) {
    const variables = dictionary.allTokens.map(token => {
      return `  --${token.name}: ${token.value};`;
    }).join('\n');
    return `:root {\n${variables}\n}`;
  }
});

// 3. Passer les tokens nettoyés directement à Style Dictionary (sans passer par l'option source)
const sd = new StyleDictionary({
  // Au lieu de lire le fichier, on lui injecte notre objet nettoyé en mémoire
  tokens: cleanTokens, 
  platforms: {
    css: {
      transforms: [
        'attribute/cti', 
        'name/kebab', 
        'ts/resolveMath', 
        'ts/color/css/hexrgba', 
        'ts/size/px'
      ], 
      buildPath: 'src/styles/',
      files: [{
        destination: 'variables.css',
        format: 'custom/css' 
      }]
    }
  }
});

await sd.buildAllPlatforms();
