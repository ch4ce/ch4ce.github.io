[TOC]

## 网络环境配置

### 代理上网

#### 技术方案

Xray + WS + CDN + TLS  

#### 服务端配置

##### 方案一
Heroku + Github + Cloudflare  

[Heroku的自动搭建节点脚本](https://github.com/mixool/xrayku)  

##### 方案二
任意国外服务器 + Cloudflare + 域名  

##### 方案三
任意国外服务器 + 国内Nat主机中转 + [域名]  

##### 方案四
优化国内线路的国外服务器 + [域名]  

#### 客户端配置

##### Xray Windows客户端：

- **Qv2ray**：Qv2ray是一个基于Qt框架开发的v2ray客户端，可通过插件支持SS、SSR、VMESS、VLESS、trojan等多种协议。  
- **V2rayN**：3.28版本起支持xray，只需要下载Xray-core，将解压的文件放到V2rayN-Core文件夹下即可。需要注意的是V2rayN 4.0版本移除了PAC，改用路由规则，会给习惯了PAC的用户带来困扰。习惯Qv2ray的网友应该乐于接受这个改变；  
- **winXray**：winXray是Windows系统上简洁稳定的Xray/V2Ray、Shadowsocks、Trojan 通用客户端，可自动检测并连接访问速度最快的 代理服务器。该项目原作者删库后出现了一些同名库，安全性未知，因此本站托管的依然是旧版；  

**综合下来我用的是Qv2ray，最新版有BUG，推荐用2.6.3版本。**
- 需要下载以下文件  
[qv2ray-2.6.3-win64.exe](https://github.com/Qv2ray/Qv2ray/releases/download/v2.6.3/qv2ray-2.6.3-win64.exe)  
[Xray-windows-64.zip](https://github.com/XTLS/Xray-core/releases/download/v1.3.1/Xray-windows-64.zip)  
[CloudflareST_windows_amd64.zip](https://github.com/XIU2/CloudflareSpeedTest/releases/download/v1.4.9/CloudflareST_windows_amd64.zip)  

- 步骤  
1、解压Xray压缩包，将所有文件放在自己记得的固定文件夹内  
2、打开Qv2ray-首选项-内核设置-核心可执行文件路径选择**xray.exe**-资源目录选择xray.exe所在的那个**文件夹**-OK  
3、Qv2ray首页-新建-高级-打开Json编辑器-左框的内容全部删除，粘贴节点Json数据-OK-导入  
4、解压CloudflareST压缩包，在网络空闲的时候打开CloudflareST.exe，等待运行完，将输出的第一个ip复制  
5、右键刚刚导入的节点-编辑-主机里的那个ip改成刚刚复制的ip-OK  
6、双击列表里的节点，连接成功  

- 推荐设置  
默认设置的话，每次打开软件之后要在节点列表里双击节点才算连接。  
推荐设置：首选项-常规设置-自动连接-记忆上次连接-OK  


##### Xray安卓客户端：
- V2rayNG：V2rayNG可以说是最跟随Xray步伐的V2ray客户端了，Xray发布新版本后会在第一时间更新，推荐使用。  

##### Xray Mac客户端：
- Qv2ray：Qv2ray是一个基于Qt框架开发的跨平台v2ray客户端，因此支持MacOS系统。实际上，自V2rayU作者删库不更新后，Qv2ray算得上Mac系统上支持VLESS协议的独苗，但可能会出现设置系统代理无效的bug。  

##### Xray苹果客户端：
- Shadowrocket/小火箭：小火箭目前是ios系统上更新最频繁的V2ray客户端，价格也不贵，支持多种协议，推荐使用。  

### 内网环境

#### ZeroTier


## 
