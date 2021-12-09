'use strict';
const http2 = require("http2");
const fetch = require("node-fetch");
const schedule = require('node-schedule');
const path = require("path");
const fs = require("fs");
const express = require('express')
var app = express()
async function update() {
    var link = await new Promise(function (resolve, reject) {
        const cheerio = require("cheerio");
        const client = http2.connect('https://www.minecraft.net');
        client.setTimeout(20000);
        client.on('error', (err) => {
            client.close();
            reject(err);
        });
        client.on('timeout', () => {
            client.close();
            reject("[ERROR]请求超时！");
        });
        const req_opt = {
            ':path': '/zh-hans/download/server/bedrock',
            'user-agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:94.0) Gecko/20100101 Firefox/94.0',
        };
        const req = client.request(req_opt);
        // req.on('response', (headers, flags) => {
        // for (const name in headers) {
        //     console.log(`${name}: ${headers[name]}`);
        // }
        // });
        req.setEncoding('utf8');
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('error', (err) => {
            client.close();
            reject(err);
        });
        req.on('end', () => {
            var $ = cheerio.load(data);

            var result = {
                windows_link: $('a[data-platform=serverBedrockWindows]').attr('href'),
                linux_link: $('a[data-platform=serverBedrockLinux]').attr('href')
            }
            client.close();
            resolve(result)
        });
        req.end();
    }).catch(err => {
        console.log("[ASNC]获取最新版本失败：");
        console.log(err);
    })
    if (link == undefined || link == false || link.windows_link == undefined || link.linux_link == undefined) {
        console.log("[ASNC]获取最新版本失败：获取不到最新地址，请检查网络与UA！");
        return;
    }
    var windows_file = link.windows_link.split("/").reverse()[0];
    var linux_file = link.linux_link.split("/").reverse()[0];
    console.log("[ASNC]已获取到最新Windows版本BDS文件：" + windows_file);
    console.log("[ASNC]已获取到最新Linux版本BDS文件：" + linux_file);
    console.log("[ASNC]正在比对文件库中是否有此版本文件...")
    if (! fs.existsSync("./download/windows/" + windows_file)) {
        console.log("[ASNC]发现更新：" + windows_file + "，自动开始下载...");
        downloadFile(link.windows_link, "./download/windows/" + windows_file);
    } else {
        console.log("[ASNC]Windows版本已是最新文件！");
    }
    if (! fs.existsSync("./download/linux/" + linux_file)) {
        console.log("[ASNC]发现更新：" + linux_file + "，自动开始下载...");
        downloadFile(link.linux_link, "./download/linux/" + linux_file);
    } else {
        console.log("[ASNC]Linux版本已是最新文件！");
    }
};
async function downloadFile(url, path) {
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/octet-stream'
        }
    }).then(res => res.buffer()).then(data => {
        fs.writeFile(path, data, "binary", function (err) {
            console.log("[ASNC]下载完成!")
            console.log(err || path);
        });
    });
}
console.log("[INFO]已设置每小时的5分30秒自动检查更新");
schedule.scheduleJob('30 5 * * * *', () => {
    console.log("[INFO]5分30秒到了，自动检查更新...");
    update()
});
console.log("[INFO]从BDS网站拉取更新...");
update();
app.set('views', path.join(__dirname, 'ejs'));
app.set('view engine', 'ejs')
// 静态路由
app.use(express.static('static', {
    maxAge: 12 * 24 * 60 * 60 * 1000
}));
app.use('/download', express.static('download', {
    maxAge: 180 * 24 * 60 * 60 * 1000
}));
// 主页
app.get('/', function (req, res) {
    res.render('index', {
        windows: fs.readdirSync("./download/windows"),
        linux: fs.readdirSync("./download/linux")
    });
})

app.listen(4561, () => {
    console.log(`[INFO]HTTP服务器已开启，端口4561`)
})
