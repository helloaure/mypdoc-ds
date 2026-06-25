import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';

register(StyleDictionary);

const sd = new StyleDictionary({
  // Modifié pour chercher TOUS les JSON à la racine sauf les configurations npm
  source: ['*.json', '!package.json', '!package-lock.json'], 
  platforms: {
    css: {
      transforms: ['attribute/cti', 'name/kebab', 'ts/color/css/hexrgba', 'ts/size/px'], 
      buildPath: 'src/styles/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables'
      }]
    }
  }
});

await sd.buildAllPlatforms();
