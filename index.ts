import * as sass from 'node-sass';
import * as tmp from 'tmp';
import * as fs from 'fs';
import * as pathUtils from 'path';

let inputFileName = './test.scss'

let DtsCreator = require('typed-css-modules');



let creator = new DtsCreator();

tmp.file(async (err, tempPath, fd, cleanupCallback) => {

    let destFileName = inputFileName + '.d.ts';

    try {
        let parsed = sass.renderSync({ file: inputFileName, outFile: tempPath });
        let css = (new Buffer(parsed.css)).toString();
        fs.writeFileSync(tempPath, css);        
        let content = await creator.create(tempPath);
        fs.writeFileSync(destFileName, content.formatted);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
    finally {
        cleanupCallback();
    }

});