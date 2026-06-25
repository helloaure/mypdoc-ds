import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';
import fs from 'fs';

register(StyleDictionary);

// 1. Charger et nettoyer le JSON
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

// 2. Formateur ultra-sécurisé pour récupérer la valeur (qu'elle soit dans value ou $value)
StyleDictionary.registerFormat({
  name: 'custom/css',
  format: function({ dictionary }) {
    const variables = dictionary.allTokens.map(token => {
      // Sécurité absolue : on cherche la valeur là où elle peut se cacher
      const value = token.value || token.$value || (token.original ? (token.original.value || token.original.$value) : undefined);
      return `  --${token.name}: ${value};`;
    }).join('\n');
    
    return `:root {\n${variables}\n}`;
  }
});

// 3. Initialisation et build
const sd = new StyleDictionary({
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
