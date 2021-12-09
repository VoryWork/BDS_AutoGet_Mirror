# VoryWork自动BDS镜像站

------

因为BDS服务器在国内常有访问速度慢的问题，特搭建本镜像站使用，在此开源代码供使用：

>* 使用Node.JS编写，多平台可用。
>* 自动爬取最新BDS版本，无需等待作者修改。
>* 有Windows与Linux两个版本可供下载


除了您现在看到的这个 Cmd Markdown 在线版本，您还可以前往以下网址下载：

### 镜像站地址[https://bds-cdn.vory.work/](https://bds-cdn.vory.work/)

>  带宽资源宝贵，请珍惜使用！为防止盗链，已设置Referrer筛选，直接点击进入可能无法访问，请`复制网站粘贴到新标签页访问`。

------

## 如何部署代码

```
安装Node.JS
进入项目目录，运行如下代码。

npm install
npm install pm2 -g
pm2 start index.js

访问localhost:4561检查程序是否正常运行
如果正常运行，使用Nginx等程序代理4561端口出来即可
```

### 开发进度

- [ ] 提供更新验证API
- [ ] 自动拉取LiteLoader与LiteXLoader打包为整合包。
- [x] 前端UI开发
- [x] 自动从Mojang拉取最新版BDS

### 疑难解答
    多人报告非家用宽带IP无法访问Mojang服务器，若返回含有Premission Denied的HTML页面，可尝试对Mojang官网进行代理：如用Zerotier代理到家宽、使用V2ray等。
    
### 开源声明

本项目基于GPL3协议开源授权，请勿用于商业用途，请勿用于生产环境！
若有好的创意或想加入开发，可联系app@vory.work或QQ:397813052