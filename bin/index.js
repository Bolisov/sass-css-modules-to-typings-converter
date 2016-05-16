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
let inputFileName = './test.scss';
let DtsCreator = require('typed-css-modules');
let creator = new DtsCreator();
tmp.file((err, tempPath, fd, cleanupCallback) => __awaiter(this, void 0, void 0, function* () {
    let destFileName = inputFileName + '.d.ts';
    try {
        let parsed = sass.renderSync({ file: inputFileName, outFile: tempPath });
        let css = (new Buffer(parsed.css)).toString();
        fs.writeFileSync(tempPath, css);
        let content = yield creator.create(tempPath);
        fs.writeFileSync(destFileName, content.formatted);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
    finally {
        cleanupCallback();
    }
}));
//import * as q from './test.scss'; 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxNQUFZLElBQUksV0FBTSxXQUFXLENBQUMsQ0FBQTtBQUNsQyxNQUFZLEdBQUcsV0FBTSxLQUFLLENBQUMsQ0FBQTtBQUMzQixNQUFZLEVBQUUsV0FBTSxJQUFJLENBQUMsQ0FBQTtBQUd6QixJQUFJLGFBQWEsR0FBRyxhQUFhLENBQUE7QUFFakMsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFJOUMsSUFBSSxPQUFPLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztBQUUvQixHQUFHLENBQUMsSUFBSSxDQUFDLENBQU8sR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsZUFBZTtJQUU5QyxJQUFJLFlBQVksR0FBRyxhQUFhLEdBQUcsT0FBTyxDQUFDO0lBRTNDLElBQUksQ0FBQztRQUNELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3pFLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDOUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDaEMsSUFBSSxPQUFPLEdBQUcsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdDLEVBQUUsQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN0RCxDQUNBO0lBQUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNQLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakIsTUFBTSxDQUFDLENBQUM7SUFDWixDQUFDO1lBQ08sQ0FBQztRQUNMLGVBQWUsRUFBRSxDQUFDO0lBQ3RCLENBQUM7QUFFTCxDQUFDLENBQUEsQ0FBQyxDQUFDO0FBR0gsbUNBQW1DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgc2FzcyBmcm9tICdub2RlLXNhc3MnO1xyXG5pbXBvcnQgKiBhcyB0bXAgZnJvbSAndG1wJztcclxuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xyXG5pbXBvcnQgKiBhcyBwYXRoVXRpbHMgZnJvbSAncGF0aCc7XHJcblxyXG5sZXQgaW5wdXRGaWxlTmFtZSA9ICcuL3Rlc3Quc2NzcydcclxuXHJcbmxldCBEdHNDcmVhdG9yID0gcmVxdWlyZSgndHlwZWQtY3NzLW1vZHVsZXMnKTtcclxuXHJcblxyXG5cclxubGV0IGNyZWF0b3IgPSBuZXcgRHRzQ3JlYXRvcigpO1xyXG5cclxudG1wLmZpbGUoYXN5bmMgKGVyciwgdGVtcFBhdGgsIGZkLCBjbGVhbnVwQ2FsbGJhY2spID0+IHtcclxuXHJcbiAgICBsZXQgZGVzdEZpbGVOYW1lID0gaW5wdXRGaWxlTmFtZSArICcuZC50cyc7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgcGFyc2VkID0gc2Fzcy5yZW5kZXJTeW5jKHsgZmlsZTogaW5wdXRGaWxlTmFtZSwgb3V0RmlsZTogdGVtcFBhdGggfSk7XHJcbiAgICAgICAgbGV0IGNzcyA9IChuZXcgQnVmZmVyKHBhcnNlZC5jc3MpKS50b1N0cmluZygpO1xyXG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmModGVtcFBhdGgsIGNzcyk7ICAgICAgICBcclxuICAgICAgICBsZXQgY29udGVudCA9IGF3YWl0IGNyZWF0b3IuY3JlYXRlKHRlbXBQYXRoKTtcclxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGRlc3RGaWxlTmFtZSwgY29udGVudC5mb3JtYXR0ZWQpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgIHRocm93IGU7XHJcbiAgICB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICBjbGVhbnVwQ2FsbGJhY2soKTtcclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuXHJcbi8vaW1wb3J0ICogYXMgcSBmcm9tICcuL3Rlc3Quc2Nzcyc7Il19