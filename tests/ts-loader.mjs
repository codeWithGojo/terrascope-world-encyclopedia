import {registerHooks} from 'node:module';
import {existsSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';

// Resolve the same extensionless TypeScript imports as the application bundler.
registerHooks({
  resolve(specifier,context,next){
    if(specifier.startsWith('.')&&context.parentURL?.startsWith('file:')){
      const url=new URL(specifier,context.parentURL);
      for(const suffix of ['.ts','.tsx','/index.ts'])if(existsSync(fileURLToPath(url)+suffix))return {url:url.href+suffix,shortCircuit:true};
    }
    if(/^next\/(og|headers|server)$/.test(specifier))return next(specifier+'.js',context);
    return next(specifier,context);
  },
  load(url,context,next){
    if(url.endsWith('.json')&&!url.includes('/node_modules/'))return {format:'module',source:`export default ${readFileSync(new URL(url),'utf8')}`,shortCircuit:true};
    if(/\.tsx?$/.test(url)&&!url.includes('/node_modules/'))return {format:'module',source:ts.transpileModule(readFileSync(new URL(url),'utf8'),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText,shortCircuit:true};
    return next(url,context);
  }
});
