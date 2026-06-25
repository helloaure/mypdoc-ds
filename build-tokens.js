import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';

// On enregistre les configurations spécifiques à Tokens Studio
register(StyleDictionary);

const sd = new StyleDictionary({
  source: ['*.json', '!package.json', '!package-lock.json'],
  // Ajout crucial pour pré-traiter les alias complexes de Tokens Studio / Figma
  preprocessors: ['tokens-studio'], 
  platforms: {
    css: {
      // Ajout de 'ts/description/to/comment' et 'ts/resolveMath' pour assainir les tokens figma
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
        format: 'css/variables'
      }]
    }
  }
});

await sd.buildAllPlatforms();
