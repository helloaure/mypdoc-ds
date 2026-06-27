import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';
import fs from 'fs';

register(StyleDictionary);

const rawData = fs.readFileSync('tokens.json', 'utf8');
const figmaData = JSON.parse(rawData);

let cleanTokens = {};
for (const setKey in figmaData) {
  if (typeof figmaData[setKey] === 'object') {
    if (figmaData[setKey]['Mode 1']) {
      cleanTokens = { ...cleanTokens, ...figmaData[setKey]['Mode 1'] };
    } else {
      cleanTokens = { ...cleanTokens, ...figmaData[setKey] };
    }
  }
}

// SÉCURITÉ INFAILLIBLE : On parcourt nos tokens, si c'est un nombre pur et que la clé 
// contient "radius", "spacing", "size", "border" ou "icon", on lui ajoute 'px' manuellement.
const addPxToNumbers = (obj) => {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Si c'est un nœud de token final (il a une clé value ou $value)
      if (obj[key].value !== undefined || obj[key].$value !== undefined) {
        let val = obj[key].value !== undefined ? obj[key].value : obj[key].$value;
        
        // Si la valeur est un nombre pur (ou une chaîne qui est un nombre pur)
        if (!isNaN(val) && val !== '' && typeof val !== 'boolean') {
          if (obj[key].value !== undefined) obj[key].value = `${val}px`;
          if (obj[key].$value !== undefined) obj[key].$value = `${val}px`;
        }
      } else {
        // Sinon on continue de descendre dans l'arborescence
        addPxToNumbers(obj[key]);
      }
    }
  }
};

// On applique le correctif sur nos tokens nettoyés
addPxToNumbers(cleanTokens);

const sd = new StyleDictionary({
  tokens: cleanTokens,
  platforms: {
    css: {
      transforms: [
        'attribute/cti',
        'name/kebab',
        'ts/resolveMath',
        'ts/color/css/hexrgba'
      ],
      buildPath: 'src/styles/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables',
        options: {
          outputReferences: true
        }
      }]
    }
  }
});

await sd.buildAllPlatforms();
