const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const target = path.join(root, 'workbench/wwwroot/lab');
const files = ['index.html','intake.html','intake.js','intake.css','public-demo.js','public-demo.css','workflow-review.js','workflow-review.css','demo/cases.js','demo/workflow-case.js','demo/access-materials.js','demo/access-case.js','demo/review-model.js','demo/intake-model.js','workbench/wwwroot/app.css','docs/workflow-sample.md','docs/workflow-review-design.md','docs/review-intake.md'];
for (const file of files) {
  if (!fs.existsSync(path.join(root,file))) {
    throw Error('Missing allowlisted asset: '+file);
  }
  const destination=path.join(target,file);
  fs.mkdirSync(path.dirname(destination),{recursive:true});
  fs.copyFileSync(path.join(root,file),destination);
}
console.log('Synced only allowlisted public assets to the desktop package.');
