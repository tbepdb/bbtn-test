const fs = require('fs');

let sum;
let min;
let xorSum;
let caseNum = 0;
let state = 'head';
let token = ''
let line = '';

function init () {
  // TODO ???
}

function caseInit () {
  console.log('init case');
  sum = 0;
  min = undefined;
  xorSum = 0;
  caseNum = caseNum  + 1;
}

function caseDataAppend(a) {
  console.log('append data in case', a);
  xorSum = xorSum ^ a;
  if (!min || a < min) {
    min = a
  }
  sum = sum + a;
}

const writable = fs.createWriteStream('out.txt');

function caseResult() {
  if (xorSum !== 0) {
    console.log(`Case #${caseNum}: NO\n`);
    writable.write(`Case #${caseNum}: NO\n`);
  } else {
    console.log(`Case #${caseNum}: ${sum - min}\n`);
    writable.write(`Case #${caseNum}: ${sum - min}\n`);
  }
}

const readable = fs.createReadStream('in.txt');
readable.pause();
readable.setEncoding('utf8');

readable.on('data', function(chunk) {
  for(let i = 0; i < chunk.length; i++) {
    const char = chunk[i];
    if (state === 'head') {
      if (char === '\n') {
        init(line);
        state = 'case';
        line = '';
        token = '';
      } else {
        line = line + char;
      }
    } else if (state === 'case') {
      if (char === '\n') {
        caseInit();
        state = 'data';
        line = '';
        token = '';
      } else {
        line = line + char;
      }
    } else if (state === 'data') {
      if (char === '\n') {
        caseDataAppend(parseInt(token, 10));
        caseResult();
        state = 'case';
        line = '';
        token = '';
      } else if (char === ' ') {
        caseDataAppend(parseInt(token, 10));
        token = '';
      } else {
        token = token + char;
      }
    } else {
      console.warn('unknow state', state);
    }
  }
});

readable.on('end', function() {
  if (state === 'data') {
    if (token) {
      caseDataAppend(parseInt(token, 10));
    }
    caseResult();
    state = 'end';
  }
  writable.end();
});

readable.resume();
