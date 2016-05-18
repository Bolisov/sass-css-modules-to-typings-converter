"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const sass = require('node-sass');
const tmp = require('tmp');
const fs = require('fs');
const pathUtils = require('path');
const program = require('commander');
const chokidar = require('chokidar');
const TsTypeInfo = require('ts-type-info');
//  import styles from './test/test.scss'; 
//  styles.
let DtsCreator = require('typed-css-modules');
let find = require('find');
function getDestFileName(filename) {
    return filename + '.d.ts';
}
function processFile(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        let tmpFile = tmp.fileSync();
        let destFileName = getDestFileName(filename);
        console.log(`Parsing file ${filename} to ${destFileName}`);
        try {
            let parsed = sass.renderSync({ file: filename, outFile: tmpFile.name });
            let css = (new Buffer(parsed.css)).toString();
            fs.writeFileSync(tmpFile.name, css);
            let cssToDtsConverter = new DtsCreator();
            let content = yield cssToDtsConverter.create(tmpFile.name);
            let tokens = content.rawTokenList;
            let typings = TsTypeInfo.createFile();
            typings.addClasses({
                name: 'Styles',
                isExported: true,
                isDefaultExportOfFile: true,
                isAmbient: true,
                isNamedExportOfFile: true,
                hasDeclareKeyword: true,
                properties: tokens.map(token => ({ name: `'${token}'`, type: 'string' })),
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
    });
}
program
    .version('1.0.0')
    .option('-d, --dir [root]', 'set root directory')
    .option('-m, --match [regex]', 'set files regex', '^[^_].+\\.scss$')
    .option('-w, --watch', 'watch mode')
    .parse(process.argv);
let workingDirectory = pathUtils.join(process.cwd(), program['dir'] || '');
let match = new RegExp(program['match']);
let files = find.fileSync(match, workingDirectory);
files.reduce((previous, current) => previous.then(() => processFile(current)).catch(e => { }), Promise.resolve())
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
                    fs.unlinkSync(destFileName);
                }
            }
        });
        let watched = watcher.getWatched();
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxNQUFZLElBQUksV0FBTSxXQUFXLENBQUMsQ0FBQTtBQUNsQyxNQUFZLEdBQUcsV0FBTSxLQUFLLENBQUMsQ0FBQTtBQUMzQixNQUFZLEVBQUUsV0FBTSxJQUFJLENBQUMsQ0FBQTtBQUN6QixNQUFZLFNBQVMsV0FBTSxNQUFNLENBQUMsQ0FBQTtBQUNsQyxNQUFZLE9BQU8sV0FBTSxXQUFXLENBQUMsQ0FBQTtBQUNyQyxNQUFZLFFBQVEsV0FBTSxVQUFVLENBQUMsQ0FBQTtBQUNyQyxNQUFZLFVBQVUsV0FBTSxjQUFjLENBQUMsQ0FBQTtBQUUzQywyQ0FBMkM7QUFFM0MsV0FBVztBQUVYLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzlDLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUUzQix5QkFBeUIsUUFBZ0I7SUFDckMsTUFBTSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7QUFDOUIsQ0FBQztBQUVELHFCQUEyQixRQUFnQjs7UUFDdkMsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzdCLElBQUksWUFBWSxHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUU3QyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixRQUFRLE9BQU8sWUFBWSxFQUFFLENBQUMsQ0FBQztRQUUzRCxJQUFJLENBQUM7WUFDRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFDeEUsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMs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QztJQUN2QyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBzYXNzIGZyb20gJ25vZGUtc2Fzcyc7XHJcbmltcG9ydCAqIGFzIHRtcCBmcm9tICd0bXAnO1xyXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCAqIGFzIHBhdGhVdGlscyBmcm9tICdwYXRoJztcclxuaW1wb3J0ICogYXMgcHJvZ3JhbSBmcm9tICdjb21tYW5kZXInO1xyXG5pbXBvcnQgKiBhcyBjaG9raWRhciBmcm9tICdjaG9raWRhcic7XHJcbmltcG9ydCAqIGFzIFRzVHlwZUluZm8gZnJvbSAndHMtdHlwZS1pbmZvJztcclxuXHJcbi8vICBpbXBvcnQgc3R5bGVzIGZyb20gJy4vdGVzdC90ZXN0LnNjc3MnOyBcclxuXHJcbi8vICBzdHlsZXMuXHJcblxyXG5sZXQgRHRzQ3JlYXRvciA9IHJlcXVpcmUoJ3R5cGVkLWNzcy1tb2R1bGVzJyk7XHJcbmxldCBmaW5kID0gcmVxdWlyZSgnZmluZCcpO1xyXG5cclxuZnVuY3Rpb24gZ2V0RGVzdEZpbGVOYW1lKGZpbGVuYW1lOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiBmaWxlbmFtZSArICcuZC50cyc7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHByb2Nlc3NGaWxlKGZpbGVuYW1lOiBzdHJpbmcpIHtcclxuICAgIGxldCB0bXBGaWxlID0gdG1wLmZpbGVTeW5jKCk7XHJcbiAgICBsZXQgZGVzdEZpbGVOYW1lID0gZ2V0RGVzdEZpbGVOYW1lKGZpbGVuYW1lKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhgUGFyc2luZyBmaWxlICR7ZmlsZW5hbWV9IHRvICR7ZGVzdEZpbGVOYW1lfWApO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IHBhcnNlZCA9IHNhc3MucmVuZGVyU3luYyh7IGZpbGU6IGZpbGVuYW1lLCBvdXRGaWxlOiB0bXBGaWxlLm5hbWUgfSk7XHJcbiAgICAgICAgbGV0IGNzcyA9IChuZXcgQnVmZmVyKHBhcnNlZC5jc3MpKS50b1N0cmluZygpO1xyXG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmModG1wRmlsZS5uYW1lLCBjc3MpO1xyXG4gICAgICAgIGxldCBjc3NUb0R0c0NvbnZlcnRlciA9IG5ldyBEdHNDcmVhdG9yKCk7XHJcbiAgICAgICAgbGV0IGNvbnRlbnQgPSBhd2FpdCBjc3NUb0R0c0NvbnZlcnRlci5jcmVhdGUodG1wRmlsZS5uYW1lKTtcclxuICAgICAgICBsZXQgdG9rZW5zID0gY29udGVudC5yYXdUb2tlbkxpc3QgYXMgc3RyaW5nW107XHJcblxyXG4gICAgICAgIGxldCB0eXBpbmdzID0gVHNUeXBlSW5mby5jcmVhdGVGaWxlKCk7XHJcblxyXG4gICAgICAgIHR5cGluZ3MuYWRkQ2xhc3Nlcyh7XHJcbiAgICAgICAgICAgIG5hbWU6ICdTdHlsZXMnLFxyXG4gICAgICAgICAgICBpc0V4cG9ydGVkOiB0cnVlLFxyXG4gICAgICAgICAgICBpc0RlZmF1bHRFeHBvcnRPZkZpbGU6IHRydWUsXHJcbiAgICAgICAgICAgIGlzQW1iaWVudDogdHJ1ZSxcclxuICAgICAgICAgICAgaXNOYW1lZEV4cG9ydE9mRmlsZTogdHJ1ZSxcclxuICAgICAgICAgICAgaGFzRGVjbGFyZUtleXdvcmQ6IHRydWUsXHJcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHRva2Vucy5tYXA8VHNUeXBlSW5mby5DbGFzc1Byb3BlcnR5U3RydWN0dXJlPih0b2tlbiA9PiAoeyBuYW1lOiBgJyR7dG9rZW59J2AsIHR5cGU6ICdzdHJpbmcnIH0pKSxcclxuICAgICAgICAgICAgb25BZnRlcldyaXRlOiB3cml0ZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgd3JpdGVyLndyaXRlTGluZShgYCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHdyaXRlci53cml0ZUxpbmUoYGRlY2xhcmUgdmFyIHN0eWxlOiBTdHlsZXNgKTtcclxuICAgICAgICAgICAgICAgIHdyaXRlci53cml0ZUxpbmUoYGV4cG9ydCA9IHN0eWxlO2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGVzdEZpbGVOYW1lLCB0eXBpbmdzLndyaXRlKCkpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgIHRocm93IGU7XHJcbiAgICB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0bXBGaWxlLnJlbW92ZUNhbGxiYWNrKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbnByb2dyYW1cclxuICAgIC52ZXJzaW9uKCcxLjAuMCcpXHJcbiAgICAub3B0aW9uKCctZCwgLS1kaXIgW3Jvb3RdJywgJ3NldCByb290IGRpcmVjdG9yeScpXHJcbiAgICAub3B0aW9uKCctbSwgLS1tYXRjaCBbcmVnZXhdJywgJ3NldCBmaWxlcyByZWdleCcsICdeW15fXS4rXFxcXC5zY3NzJCcpXHJcbiAgICAub3B0aW9uKCctdywgLS13YXRjaCcsICd3YXRjaCBtb2RlJylcclxuICAgIC5wYXJzZShwcm9jZXNzLmFyZ3YpO1xyXG5cclxubGV0IHdvcmtpbmdEaXJlY3RvcnkgPSBwYXRoVXRpbHMuam9pbihwcm9jZXNzLmN3ZCgpLCBwcm9ncmFtWydkaXInXSB8fCAnJyk7XHJcbmxldCBtYXRjaCA9IG5ldyBSZWdFeHAocHJvZ3JhbVsnbWF0Y2gnXSk7XHJcbmxldCBmaWxlczogc3RyaW5nW10gPSBmaW5kLmZpbGVTeW5jKG1hdGNoLCB3b3JraW5nRGlyZWN0b3J5KTtcclxuXHJcbmZpbGVzLnJlZHVjZTxQcm9taXNlPHZvaWQ+PigocHJldmlvdXMsIGN1cnJlbnQpID0+IHByZXZpb3VzLnRoZW4oKCkgPT4gcHJvY2Vzc0ZpbGUoY3VycmVudCkpLmNhdGNoKGUgPT4geyB9KSwgUHJvbWlzZS5yZXNvbHZlKCkpXHJcbiAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NvbXBsZXRlZCcpO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChlID0+IHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgIHRocm93IGU7XHJcbiAgICB9KVxyXG4gICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGlmIChwcm9ncmFtWyd3YXRjaCddKSB7XHJcbiAgICAgICAgICAgIGxldCB3YXRjaGVyID0gY2hva2lkYXIud2F0Y2goJyonLCB7IGN3ZDogd29ya2luZ0RpcmVjdG9yeSB9KTtcclxuXHJcbiAgICAgICAgICAgIHdhdGNoZXJcclxuICAgICAgICAgICAgICAgIC5vbignYWRkJywgcGF0aCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoLnRlc3QocGF0aCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0ZpbGUocGF0aFV0aWxzLmpvaW4od29ya2luZ0RpcmVjdG9yeSwgcGF0aCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAub24oJ2NoYW5nZScsIHBhdGggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaC50ZXN0KHBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3NGaWxlKHBhdGhVdGlscy5qb2luKHdvcmtpbmdEaXJlY3RvcnksIHBhdGgpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLm9uKCd1bmxpbmsnLCBwYXRoID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2gudGVzdChwYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGVzdEZpbGVOYW1lID0gZ2V0RGVzdEZpbGVOYW1lKHBhdGhVdGlscy5qb2luKHdvcmtpbmdEaXJlY3RvcnksIHBhdGgpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmcy5leGlzdHNTeW5jKGRlc3RGaWxlTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZzLnVubGlua1N5bmMoZGVzdEZpbGVOYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgd2F0Y2hlZCA9IHdhdGNoZXIuZ2V0V2F0Y2hlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pOyJdfQ==