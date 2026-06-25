import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';

// CRUCIAL : On configure sd-transforms pour ignorer le dossier parent créé par Figma ("primitive color/Mode 1")
register(StyleDictionary, {
  excludeParentKeys: true
});

const sd = new StyleDictionary({
  source: ['*.json', '!package.json', '!package-lock.json'],
  // On applique le préprocesseur dédié à Tokens Studio pour résoudre les alias nettoyés
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
        format: 'css/variables'
      }]
    }
  }
});

await sd.buildAllPlatforms();
