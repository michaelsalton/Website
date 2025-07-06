const fs = require('fs');
const path = require('path');

// Path to the About component
const aboutComponentPath = path.join(__dirname, '../app/components/About.tsx');

// Get the file's last modified time
const stats = fs.statSync(aboutComponentPath);
const lastModified = new Date(stats.mtime);

// Format the date
const formattedDate = lastModified.toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
});

// Read the current file content
let content = fs.readFileSync(aboutComponentPath, 'utf8');

// Update the date in the constant
const dateRegex = /'2024-\d{2}-\d{2}'/;
if (dateRegex.test(content)) {
  content = content.replace(dateRegex, `'${formattedDate}'`);
} else {
  // If no date found, replace the placeholder
  content = content.replace(
    /'2024-01-15' \/\/ This will be updated by the build script/,
    `'${formattedDate}' // Last updated: ${formattedDate}`
  );
}

// Write the updated content back to the file
fs.writeFileSync(aboutComponentPath, content, 'utf8');

console.log(`Updated last modified date to: ${formattedDate}`); 