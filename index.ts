import * as sass from 'node-sass';
import * as tmp from 'tmp';
import * as fs from 'fs';
import * as pathUtils from 'path';
import * as program from 'commander';
import * as chokidar from 'chokidar';
import * as TsTypeInfo from 'ts-type-info';

//  import styles from './test/test.scss'; 

//  styles.

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
        let tokens = content.rawTokenList as string[];

        let typings = TsTypeInfo.createFile();

        typings.addClasses({
            name: 'Styles',
            isExported: true,
            isDefaultExportOfFile: true,
            isAmbient: true,
            isNamedExportOfFile: true,
            hasDeclareKeyword: true,
            properties: tokens.map<TsTypeInfo.ClassPropertyStructure>(token => ({ name: `'${token}'`, type: 'string' })),
            onAfterWrite: writer => {
                writer.writeLine(``);                                
                writer.writeLine(`declare var style: Styles`);
                writer.writeLine(`export = style;`);
            }
        });

        fs.writeFileSync(destFileName, typings.write());
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
    .option('-m, --match [regex]', 'set files regex', '^[^_].+\\.scss$')
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
                        processFile(pathUtils.join(workingDirectory, path));
                    }
                })
                .on('change', path => {
                    if (match.test(path)) {
                        processFile(pathUtils.join(workingDirectory, path));
                    }
                })
                .on('unlink', path => {
                    if (match.test(path)) {
                        let destFileName = getDestFileName(pathUtils.join(workingDirectory, path));

                        if (fs.existsSync(destFileName)) {
                            fs.unlinkSync(destFileName)
                        }
                    }
                });

            let watched = watcher.getWatched();
        }
    });