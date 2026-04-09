const fs = require('fs');
const file = 'c:/Users/2240788/OneDrive - yamaguchigakuen/drawio/docs/aws1-exercises.drawio';
let content = fs.readFileSync(file, 'utf8');

let lines = content.split('\n');
let modifiedCount = 0;
for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.includes('<mxCell') && line.includes('value=') && line.includes('&lt;')) {
        let styleMatch = line.match(/style=\"([^\"]*)\"/);
        if (styleMatch) {
            let style = styleMatch[1];
            // Check if it already has html=1 or html=2
            if (!style.includes('html=1') && !style.includes('html=2')) {
                // Prepend html=1; to the style attribute
                lines[i] = line.replace(/style=\"([^\"]*)\"/, 'style=\"html=1;$1\"');
                modifiedCount++;
            }
        }
    }
}

if (modifiedCount > 0) {
    fs.writeFileSync(file, lines.join('\n'), 'utf8');
    console.log('Modified ' + modifiedCount + ' elements.');
} else {
    console.log('No elements needed modification.');
}
