const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      // Ensure we don't duplicate dark classes
      if (content.includes('dark:text-white') && content.includes('dark:bg-slate-900')) {
        // Skip if largely processsed already
      }

      const replacements = [
        // Backgrounds
        { from: /\bbg-slate-50\b/g, to: 'bg-slate-50 dark:bg-slate-900' },
        { from: /\bbg-slate-100\b/g, to: 'bg-slate-100 dark:bg-slate-800' },
        { from: /\bbg-slate-200\b/g, to: 'bg-slate-200 dark:bg-slate-700' },
        { from: /\bbg-background\b/g, to: 'bg-background dark:bg-slate-950' },
        { from: /\bbg-surface\b/g, to: 'bg-surface dark:bg-slate-900' },
        { from: /\bbg-white\b/g, to: 'bg-white dark:bg-slate-900' },
        { from: /\bg-gray-50\b/g, to: 'bg-gray-50 dark:bg-gray-900' },
        { from: /\bg-gray-100\b/g, to: 'bg-gray-100 dark:bg-gray-800' },
        { from: /\bhover:bg-slate-50\b/g, to: 'hover:bg-slate-50 dark:hover:bg-slate-800' },
        { from: /\bhover:bg-slate-100\b/g, to: 'hover:bg-slate-100 dark:hover:bg-slate-700' },
        { from: /\bhover:bg-white\b/g, to: 'hover:bg-white dark:hover:bg-slate-800' },
        
        // Borders
        { from: /\bborder-slate-50\b/g, to: 'border-slate-50 dark:border-slate-800' },
        { from: /\bborder-slate-100\b/g, to: 'border-slate-100 dark:border-slate-800' },
        { from: /\bborder-slate-200\b/g, to: 'border-slate-200 dark:border-slate-700' },
        { from: /\bborder-gray-200\b/g, to: 'border-gray-200 dark:border-gray-800' },
        { from: /\bhover:border-slate-100\b/g, to: 'hover:border-slate-100 dark:hover:border-slate-700' },
        
        // Text
        { from: /\btext-sidebar\b/g, to: 'text-slate-900 dark:text-white' },
        { from: /\btext-slate-900\b/g, to: 'text-slate-900 dark:text-white' },
        { from: /\btext-slate-700\b/g, to: 'text-slate-700 dark:text-slate-200' },
        { from: /\btext-slate-600\b/g, to: 'text-slate-600 dark:text-slate-300' },
        { from: /\btext-slate-500\b/g, to: 'text-slate-500 dark:text-slate-400' },
        { from: /\btext-slate-400\b/g, to: 'text-slate-500 dark:text-slate-400' },
        { from: /\btext-slate-300\b/g, to: 'text-slate-500 dark:text-slate-400' },
        { from: /\bhover:text-slate-600\b/g, to: 'hover:text-slate-600 dark:hover:text-slate-200' }
      ];

      for (const { from, to } of replacements) {
        // Only replace if the trailing space doesn't already have a dark mode class directly ahead
        // But a raw replace string is safer if we just clean up duplicates later
        content = content.replace(from, to);
      }

      // Clean up accidental duplicate additions like 'bg-slate-50 dark:bg-slate-900 dark:bg-slate-900'
      const uniqueRegex = /(dark:[a-z0-9-]+)\s+\1/g;
      while (uniqueRegex.test(content)) {
        content = content.replace(uniqueRegex, '$1');
      }

      // Cleanup nested concatenations like 'text-slate-500 dark:text-slate-400 dark:text-slate-400'
      content = content.replace(/dark:text-white dark:text-white/g, 'dark:text-white');
      content = content.replace(/dark:bg-slate-900 dark:bg-slate-900/g, 'dark:bg-slate-900');
      content = content.replace(/dark:border-slate-800 dark:border-slate-800/g, 'dark:border-slate-800');
      
      // text-slate-500 dark:text-slate-400 when replaced again pushes text-slate-500 dark:text-slate-400 dark:text-slate-400
      content = content.replace(/(dark:[^\s"']+)\s+\1/g, '$1');
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Processed', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
