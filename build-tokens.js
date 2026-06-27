import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';
import fs from 'fs';

// 1. On configure les transforms officiels de Tokens Studio (gestion du px, rem, etc.)
register(StyleDictionary);

// 2. Charger et aplatir le JSON manuellement pour éviter le bug des dossiers Figma
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

// 3. Configuration de Style Dictionary standard de niveau production
const sd = new StyleDictionary({
  tokens: cleanTokens,
  platforms: {
    css: {
      // Les transforms indispensables pour transformer vos chiffres Figma en vraies unités web (px)
      transforms: [
        'attribute/cti',
        'name/kebab',
        'ts/resolveMath',
        'ts/color/css/hexrgba',
        'ts/size/px' // Ajoute automatiquement 'px' à vos spacings, font-sizes, borders, etc
      ],
      buildPath: 'src/styles/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables', // Format standard officiel
        options: {
          outputReferences: true // Force l'écriture des alias sous forme de var(--...)
        }
      }]
    }
  }
});

await sd.buildAllPlatforms();
