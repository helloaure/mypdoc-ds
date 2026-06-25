import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';

register(StyleDictionary);

const sd = new StyleDictionary({
  source: ['*.json', '!package.json', '!package-lock.json'],
  // Indique à Style Dictionary que vos tokens utilisent les standards récents ($value, $type)
  usesDtcg: true, 
  platforms: {
    css: {
      // 'ts/resolveMath' et 'name/kebab' vont nettoyer les collisions de noms dues aux slashs
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
        format: 'css/variables',
        options: {
          // Permet d'ignorer temporairement les références cassées s'il en reste, pour forcer la création du fichier
          outputReferences: false 
        }
      }]
    }
  }
});

await sd.buildAllPlatforms();
