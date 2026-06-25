import StyleDictionary from 'style-dictionary';
// Ici, on a bien remplacé par "register" tout court
import { register } from '@tokens-studio/sd-transforms';

// Ici aussi, on utilise "register"
register(StyleDictionary);

const sd = new StyleDictionary({
  source: ['tokens.json'], 
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
