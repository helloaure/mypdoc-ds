JavaScript
import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';
import fs from 'fs';

register(StyleDictionary);

// 1. Charger et aplatir le JSON Figma pour éviter les dossiers fantômes
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

// 2. On crée un format customisé ultra-intelligent
// Il écrit les variables normalement, mais si la valeur finale est un chiffre pur, il ajoute 'px' !
StyleDictionary.registerFormat({
  name: 'custom/css-resolved',
  format: function({ dictionary, options }) {
    const variables = dictionary.allTokens.map(token => {
      let value = token.value;
      
      // Si c'est un alias/référence (et qu'on veut garder les alias), on génère le var()
      if (options.outputReferences && dictionary.usesReference(token.original.value || token.original.$value)) {
        const refs = dictionary.getReferences(token.original.value || token.original.$value);
        value = refs.map(ref => `var(--${ref.name})`).join(' ');
      } else {
        // Si c'est une valeur brute et que c'est un nombre pur (ex: 8, 16, 400)
        // On exclut les épaisseurs de graisse de police (font-weight comme 400, 600, 700) et les opacités
        if (!isNaN(value) && value !== '' && !token.name.includes('weight') && !token.name.includes('opacity')) {
          value = `${value}px`;
        }
      }
      
      return `  --${token.name}: ${value};`;
    }).join('\n');
    
    return `:root {\n${variables}\n}`;
  }
});

// 3. Initialisation de Style Dictionary
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
        format: 'custom/css-resolved', // On utilise notre formateur intelligent
        options: {
          outputReferences: true // Conserve les var(--mon-alias)
        }
      }]
    }
  }
});

await sd.buildAllPlatforms();
