import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';

// 1. Enregistrement des transforms Tokens Studio
register(StyleDictionary, {
  excludeParentKeys: true
});

// 2. Enregistrement en bonne et due forme du format personnalisé pour le CSS
StyleDictionary.registerFormat({
  name: 'custom/css',
  format: function({ dictionary }) {
    const variables = dictionary.allTokens.map(token => {
      const name = token.name || token.path.join('-');
      return `  --${name}: ${token.value};`;
    }).join('\n');
    
    return `:root {\n${variables}\n}`;
  }
});

// 3. Initialisation et build
const sd = new StyleDictionary({
  source: ['*.json', '!package.json', '!package-lock.json'],
  preprocessors: ['tokens-studio'],
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
