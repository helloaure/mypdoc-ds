import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';

// Enregistrement des transforms
register(StyleDictionary, {
  excludeParentKeys: true
});

const sd = new StyleDictionary({
  source: ['*.json', '!package.json', '!package-lock.json'],
  preprocessors: ['tokens-studio'],
  
  // 1. On crée un format personnalisé "custom/css" qui force l'écriture de TOUS les tokens
  format: {
    'custom/css': function({ dictionary }) {
      const variables = dictionary.allTokens.map(token => {
        // Sécurité si le nom n'est pas encore transformé en kebab-case
        const name = token.name || token.path.join('-');
        return `  --${name}: ${token.value};`;
      }).join('\n');
      
      return `:root {\n${variables}\n}`;
    }
  },
  
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
        // 2. On utilise notre format personnalisé ici au lieu de 'css/variables'
        format: 'custom/css' 
      }]
    }
  }
});

await sd.buildAllPlatforms();
