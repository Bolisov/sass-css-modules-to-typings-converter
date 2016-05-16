import * as sass from 'node-sass';
import * as tmp from 'tmp';
import * as fs from 'fs';
import * as pathUtils from 'path';
import * as program from 'commander';
import * as chokidar from 'chokidar';

let inputFileName = './test.scss'
let DtsCreator = require('typed-css-modules');
let find = require('find');

function getDestFileName(filename: string) {
    return filename + '.d.ts';
}

async function processFile(filename: string) {
    let tmpFile = tmp.fileSync();
    let destFileName = getDestFileName(filename);

    console.log(`Parsing file ${filename} to ${destFileName}`);

    try {
        let parsed = sass.renderSync({ file: filename, outFile: tmpFile.name });
        let css = (new Buffer(parsed.css)).toString();
        fs.writeFileSync(tmpFile.name, css);
        let cssToDtsConverter = new DtsCreator();
        let content = await cssToDtsConverter.create(tmpFile.name);
        fs.writeFileSync(destFileName, content.formatted);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
    finally {
        tmpFile.removeCallback();
    }
}

program
    .version('1.0.0')
    .option('-d, --dir [root]', 'set root directory')
    .option('-m, --match [regex]', 'set files regex', '\\.scss$')
    .option('-w, --watch', 'watch mode')
    .parse(process.argv);

let workingDirectory = pathUtils.join(process.cwd(), program['dir'] || '');
let match = new RegExp(program['match']);
let files: string[] = find.fileSync(match, workingDirectory);

files.reduce<Promise<void>>((previous, current) => previous.then(() => processFile(current)).catch(e => { }), Promise.resolve())
    .then(() => {
        console.log('completed');
    })
    .catch(e => {
        console.error(e);
        throw e;
    })
    .then(() => {
        if (program['watch']) {
            let watcher = chokidar.watch('*', { cwd: workingDirectory });

            watcher
                .on('add', path => {
                    if (match.test(path)) {
                        processFile(path);
                    }
                })
                .on('change', path => {
                    if (match.test(path)) {
                        processFile(path);
                    }
                })
                .on('unlink', path => {
                    if (match.test(path)) {
                        let destFileName = getDestFileName(path);

                        if (fs.existsSync(destFileName)) {
                            fs.unlinkSync(getDestFileName(path))
                        }
                    }
                });

            let watched = watcher.getWatched();
        }
    });