const fs = require('fs');
const c = JSON.parse(fs.readFileSync('lab05-collection.json', 'utf8'));
const folder = c.item.find(x => x.name.includes('03:'));
const req = folder.item[folder.item.length - 1];
const ev = req.event[0].script;
ev.exec = ev.exec.map(l => l.replace('to.eql("ERROR_INACTIVE_STUDENT")', 'to.eql("ERROR_NO_STUDENT")'));
fs.writeFileSync('lab05-collection-fail.json', JSON.stringify(c, null, 2), 'utf8');
console.log('lab05-collection-fail.json үүслээ');