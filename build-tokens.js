import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';

register(StyleDictionary, {
  excludeParentKeys: true
});

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
        // Utilisation du format étendu pour s'assurer que tous les tokens (même modifiés) soient inclus
        format: 'css/variables',
        options: {
          outputReferences: false
        }
      }]
    }
  }
});

await sd.buildAllPlatforms();
