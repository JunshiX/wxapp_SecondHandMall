# 在阿里云ECS上部署nodejs环境

## <font color=red>**安装依赖**</font>

```
yum install git vim openssl wget curl
```
* 安装nvm : 在同一台机器上安装和切换不同版本node的工具。
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```
安装完记得重启ssh。
```
nvm ls      //显示当前的node版本
nvm install 10.11.0     //安装最新的node10.11.0版本
nvm alias default 10.11.0          //将10.11.0设置为默认版本
```
* 运行node例程（使用vi server.js）
```
vi server.js        //生成一个js文件，复制下面的文本
```
vim命令：**esc**退出编辑，**：wq\!** 命令保存
```javascript
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```
运行node server，打开3000端口监听，再另开一个ssh中断，访问本地端口
```
curl http://127.0.0.1:3000      //显示hello world
```
* 安装npm和pm2模块
```
yum install npm
npm install pm2 -g
```
pm2是一个带有负载均衡功能的Node应用的进程管理器。当你要把你的独立代码利用全部的服务器上的所有CPU，并保证进程永远都活着，0秒的重载，PM2是完美的。

| 命令 |作用|
|:---:|---|
|pm2 start server.js | 启动server程序，此时不需要另外开启终端，3000端口就会一直处于监听|
|pm2 list|显示当前运行的node程序|
|pm2 show server|查看server程序的详细信息|
|pm2 stop server|停止server程序|
|pm2 restart server|重启server程序|
|pm2 logs|查看日志|

* 安装nignx
```
yum install nginx
nginx -v
cd /etc/nginx/conf.d
```
---
## <font color=red>**Centos7远程连接MongoDB27017端口**</font>

安装完mongodb之后，在本地使用compass可视化访问服务器的MongoDB的时候报错提示**timeout**，telnet 27017端口也失败。原因是Centos设置了防火墙，同时阿里云也设置了安全组。  
* 首先，修改mongo.conf配置文件
```
sudo vi /etc/mongo.conf
```
&emsp;&emsp;将**bindIp:127.0.0.1**修改为**0.0.0.0**，表示接受任何IP的连接。  
&emsp;&emsp;然后，重新启动MongoDB服务。
```
service mongod restart
```
* 接着，开放防火墙27017端口  

&emsp;&emsp;Centos7取消了iptables的配置，默认安装了firewalld，配置指令为firewall-cmd：
```
firewall-cmd --zone=public --permanent --add-port=27017/tcp       //--permanent参数将端口永久打开
firewall-cmd --permanent --zone=public --list-ports   //查看已经开启的端口
firewall-cmd --reload     //重启firewall
```
* 最后，还需要设置阿里云的安全组  
>参考文档：<a herf="https://jingyan.baidu.com/article/03b2f78c31bdea5ea237ae88.html">开启阿里云服务器端口</a>

&emsp;&emsp;进入阿里云ECS服务器控制台，找到安全组配置，点击配置规则，再点击添加安全组规则，在弹出的窗口中输入端口27017/27017,授权对象为0.0.0.0/0即可。
