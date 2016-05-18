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
//import styles from './test.scss'; 
//styles.aaaa;
let inputFileName = './test.scss';
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
            let typings = TsTypeInfo.createFile({
                classes: [{
                        name: 'Styles',
                        isExported: true,
                        isDefaultExportOfFile: true,
                        isAmbient: true,
                        isNamedExportOfFile: true,
                        hasDeclareKeyword: true,
                        properties: tokens.map(token => ({ name: `'${token}'`, type: 'string' }))
                    }]
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
    .option('-m, --match [regex]', 'set files regex', '\\.scss$')
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxNQUFZLElBQUksV0FBTSxXQUFXLENBQUMsQ0FBQTtBQUNsQyxNQUFZLEdBQUcsV0FBTSxLQUFLLENBQUMsQ0FBQTtBQUMzQixNQUFZLEVBQUUsV0FBTSxJQUFJLENBQUMsQ0FBQTtBQUN6QixNQUFZLFNBQVMsV0FBTSxNQUFNLENBQUMsQ0FBQTtBQUNsQyxNQUFZLE9BQU8sV0FBTSxXQUFXLENBQUMsQ0FBQTtBQUNyQyxNQUFZLFFBQVEsV0FBTSxVQUFVLENBQUMsQ0FBQTtBQUNyQyxNQUFZLFVBQVUsV0FBTSxjQUFjLENBQUMsQ0FBQTtBQUUzQyxvQ0FBb0M7QUFFcEMsY0FBYztBQUVkLElBQUksYUFBYSxHQUFHLGFBQWEsQ0FBQTtBQUNqQyxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUM5QyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFM0IseUJBQXlCLFFBQWdCO0lBQ3JDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0FBQzlCLENBQUM7QUFFRCxxQkFBMkIsUUFBZ0I7O1FBQ3ZDLElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM3QixJQUFJLFlBQVksR0FBRyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsUUFBUSxPQUFPLFlBQVksRUFBRSxDQUFDLENBQUM7UUFFM0QsSUFBSSxDQUFDO1lBQ0QsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3hFLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxNQUFN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QUFDO1FBRTdELE9BQU87YUFDRixFQUFFLENBQUMsS0FBSyxFQUFFLElBQUk7WUFDWCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN4RCxDQUFDO1FBQ0wsQ0FBQyxDQUFDO2FBQ0QsRUFBRSxDQUFDLFFBQVEsRUFBRSxJQUFJO1lBQ2QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDeEQsQ0FBQztRQUNMLENBQUMsQ0FBQzthQUNELEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSTtZQUNkLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixJQUFJLFlBQVksR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUUzRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQTtnQkFDL0IsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVQLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBzYXNzIGZyb20gJ25vZGUtc2Fzcyc7XHJcbmltcG9ydCAqIGFzIHRtcCBmcm9tICd0bXAnO1xyXG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCAqIGFzIHBhdGhVdGlscyBmcm9tICdwYXRoJztcclxuaW1wb3J0ICogYXMgcHJvZ3JhbSBmcm9tICdjb21tYW5kZXInO1xyXG5pbXBvcnQgKiBhcyBjaG9raWRhciBmcm9tICdjaG9raWRhcic7XHJcbmltcG9ydCAqIGFzIFRzVHlwZUluZm8gZnJvbSAndHMtdHlwZS1pbmZvJztcclxuXHJcbi8vaW1wb3J0IHN0eWxlcyBmcm9tICcuL3Rlc3Quc2Nzcyc7IFxyXG5cclxuLy9zdHlsZXMuYWFhYTtcclxuXHJcbmxldCBpbnB1dEZpbGVOYW1lID0gJy4vdGVzdC5zY3NzJ1xyXG5sZXQgRHRzQ3JlYXRvciA9IHJlcXVpcmUoJ3R5cGVkLWNzcy1tb2R1bGVzJyk7XHJcbmxldCBmaW5kID0gcmVxdWlyZSgnZmluZCcpO1xyXG5cclxuZnVuY3Rpb24gZ2V0RGVzdEZpbGVOYW1lKGZpbGVuYW1lOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiBmaWxlbmFtZSArICcuZC50cyc7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHByb2Nlc3NGaWxlKGZpbGVuYW1lOiBzdHJpbmcpIHtcclxuICAgIGxldCB0bXBGaWxlID0gdG1wLmZpbGVTeW5jKCk7XHJcbiAgICBsZXQgZGVzdEZpbGVOYW1lID0gZ2V0RGVzdEZpbGVOYW1lKGZpbGVuYW1lKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhgUGFyc2luZyBmaWxlICR7ZmlsZW5hbWV9IHRvICR7ZGVzdEZpbGVOYW1lfWApO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IHBhcnNlZCA9IHNhc3MucmVuZGVyU3luYyh7IGZpbGU6IGZpbGVuYW1lLCBvdXRGaWxlOiB0bXBGaWxlLm5hbWUgfSk7XHJcbiAgICAgICAgbGV0IGNzcyA9IChuZXcgQnVmZmVyKHBhcnNlZC5jc3MpKS50b1N0cmluZygpO1xyXG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmModG1wRmlsZS5uYW1lLCBjc3MpO1xyXG4gICAgICAgIGxldCBjc3NUb0R0c0NvbnZlcnRlciA9IG5ldyBEdHNDcmVhdG9yKCk7XHJcbiAgICAgICAgbGV0IGNvbnRlbnQgPSBhd2FpdCBjc3NUb0R0c0NvbnZlcnRlci5jcmVhdGUodG1wRmlsZS5uYW1lKTtcclxuICAgICAgICBsZXQgdG9rZW5zID0gY29udGVudC5yYXdUb2tlbkxpc3QgYXMgc3RyaW5nW107XHJcblxyXG4gICAgICAgIGxldCB0eXBpbmdzID0gVHNUeXBlSW5mby5jcmVhdGVGaWxlKHsgICAgICAgICAgICBcclxuICAgICAgICAgICAgY2xhc3NlczogW3tcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdTdHlsZXMnLFxyXG4gICAgICAgICAgICAgICAgaXNFeHBvcnRlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGlzRGVmYXVsdEV4cG9ydE9mRmlsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGlzQW1iaWVudDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGlzTmFtZWRFeHBvcnRPZkZpbGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBoYXNEZWNsYXJlS2V5d29yZDogdHJ1ZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllczogdG9rZW5zLm1hcDxUc1R5cGVJbmZvLkNsYXNzUHJvcGVydHlTdHJ1Y3R1cmU+KHRva2VuID0+ICh7IG5hbWU6IGAnJHt0b2tlbn0nYCwgdHlwZTogJ3N0cmluZycgfSkpXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGVzdEZpbGVOYW1lLCB0eXBpbmdzLndyaXRlKCkpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgIHRocm93IGU7XHJcbiAgICB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0bXBGaWxlLnJlbW92ZUNhbGxiYWNrKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbnByb2dyYW1cclxuICAgIC52ZXJzaW9uKCcxLjAuMCcpXHJcbiAgICAub3B0aW9uKCctZCwgLS1kaXIgW3Jvb3RdJywgJ3NldCByb290IGRpcmVjdG9yeScpXHJcbiAgICAub3B0aW9uKCctbSwgLS1tYXRjaCBbcmVnZXhdJywgJ3NldCBmaWxlcyByZWdleCcsICdcXFxcLnNjc3MkJylcclxuICAgIC5vcHRpb24oJy13LCAtLXdhdGNoJywgJ3dhdGNoIG1vZGUnKVxyXG4gICAgLnBhcnNlKHByb2Nlc3MuYXJndik7XHJcblxyXG5sZXQgd29ya2luZ0RpcmVjdG9yeSA9IHBhdGhVdGlscy5qb2luKHByb2Nlc3MuY3dkKCksIHByb2dyYW1bJ2RpciddIHx8ICcnKTtcclxubGV0IG1hdGNoID0gbmV3IFJlZ0V4cChwcm9ncmFtWydtYXRjaCddKTtcclxubGV0IGZpbGVzOiBzdHJpbmdbXSA9IGZpbmQuZmlsZVN5bmMobWF0Y2gsIHdvcmtpbmdEaXJlY3RvcnkpO1xyXG5cclxuZmlsZXMucmVkdWNlPFByb21pc2U8dm9pZD4+KChwcmV2aW91cywgY3VycmVudCkgPT4gcHJldmlvdXMudGhlbigoKSA9PiBwcm9jZXNzRmlsZShjdXJyZW50KSkuY2F0Y2goZSA9PiB7IH0pLCBQcm9taXNlLnJlc29sdmUoKSlcclxuICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZygnY29tcGxldGVkJyk7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGUgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XHJcbiAgICAgICAgdGhyb3cgZTtcclxuICAgIH0pXHJcbiAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgaWYgKHByb2dyYW1bJ3dhdGNoJ10pIHtcclxuICAgICAgICAgICAgbGV0IHdhdGNoZXIgPSBjaG9raWRhci53YXRjaCgnKicsIHsgY3dkOiB3b3JraW5nRGlyZWN0b3J5IH0pO1xyXG5cclxuICAgICAgICAgICAgd2F0Y2hlclxyXG4gICAgICAgICAgICAgICAgLm9uKCdhZGQnLCBwYXRoID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2gudGVzdChwYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9jZXNzRmlsZShwYXRoVXRpbHMuam9pbih3b3JraW5nRGlyZWN0b3J5LCBwYXRoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywgcGF0aCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoLnRlc3QocGF0aCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0ZpbGUocGF0aFV0aWxzLmpvaW4od29ya2luZ0RpcmVjdG9yeSwgcGF0aCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAub24oJ3VubGluaycsIHBhdGggPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaC50ZXN0KHBhdGgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkZXN0RmlsZU5hbWUgPSBnZXREZXN0RmlsZU5hbWUocGF0aFV0aWxzLmpvaW4od29ya2luZ0RpcmVjdG9yeSwgcGF0aCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoZGVzdEZpbGVOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnMudW5saW5rU3luYyhkZXN0RmlsZU5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGxldCB3YXRjaGVkID0gd2F0Y2hlci5nZXRXYXRjaGVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7Il19