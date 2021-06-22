# 实例请看书，有时间再添加

## 第一章
OSI和TCP/IP模型的对应关系  
图 1-3  
![](http://ai9338997.ke22.aihost69.top/oneindex/?/images/2021/06/22/4tnc3pz55s/D1B2836C-1EAF-437D-B68B-2444801DE1BA.png)


图 1-4  
![](http://ai9338997.ke22.aihost69.top/oneindex/?/images/2021/06/22/nsHclo2wc6/1-4.png)


套接口在传输层和应用层之间  
套接字编程就是应用层到传输层的接口  

socket即为套接字，在TCP/IP协议中，“IP地址+TCP或UDP端口号”唯一的标识网络通讯中的一个进程，“IP地址+TCP或UDP端口号”就为socket。  
在TCP协议中，建立连接的两个进程（客户端和服务器）各自有一个socket来标识，则这两个socket组成的socket pair就唯一标识一个连接。

标识通信双方：源ip、目的ip，源端口、目的端口、协议  
标识通信单方：ip、端口、协议  

TCP和UDP可以绑定相同端口  

TCP和UDP的对比  
TCP是复杂、可靠的面向连接协议  
UDP是简单、不可靠的无连接协议  

## 第二章
### 套接字类型  
SOCK_STREAM：流式套接字，TCP  
SOCK_DGRAM：数据报套接字，UDP  
SOCK_RAW：原始套接字，ICMP  

### 套接字的基本函数
### socket()

产生 TCP 套接字，作为 TCP 通信的传输端点
```
#include <sys/socket.h>
int socket(int family, int type, int protocol);
```

#### 参数  
- family 参数指明协议族  
**AF_INET**:IPv4 协议  
AF_INET6:IPv6 协议  
AF_ROUTE:路由套接口  

- type 参数指明产生套接字的类型  
**SOCK_STREAM**:字节流套接口，TCP 使用的是这种形式。  
**SOCK_DGRAM**:数据报套接口，UDP 使用的是这种形式。  
SOCK_RAW:原始套接口。  

- protocol 参数是协议标志，一般在调用 socket 函数时将其置为0，但如果是原始套接字，就需要为 protocol 指定一个常值  

#### 返回值  
函数调用成功，将返回一个小的非负的整数值，它与文件描述符类似，这里称之为**套接字描述符**(socket descriptor)，简称套接字，之后的 I/O 操作都由该套接字完成。  
函数调用失败，则返回-1。

创建一个TCP套接字  
```
#include <sys/socket.h>

int sockfd;

if(sockfd = socket(AF_INET, SOCK_STREAM, 0) == -1) {
    //handle exception
}

```

### connect()  
connect 函数用于激发 TCP 的三路握手过程，建立与远程服务器的连接。  

```
#include <sys/socket.h>
int connect(int sockfd, const struct sockaddr *addr, socklen_t addrlen);
```

#### 参数  
- sockfd 是由 socket 函数返回的套接字描述符  
- addr 是指向服务器的套接字地址结构的指针， 如果是 IPv4 地址，server 指向的就是一个 sockaddr_in 地址结构，在进行 connect 函数调用时， 必须将 sockaddr_in 结构转换成通用地址结构 sockaddr  
- addrlen 是该套接字地 址结构的大小  

#### 返回值
调用成功返回 0，出错则返回-1。  

如果描述符是 TCP 套接字，调用函数 connect 就是建立一个 TCP 的连接，只在连接建立成功或者出错时该函数才返回，返回的错误有如下几种情况:  
如果客户没有收到 SYN 分节的响应，返回 ETIMEDOUT，这可能需要重发若干次 SYN。  
如果对客户的 SYN 的响应是 RST，则表明该服务器主机在指定的端口上没有进程在 等待与之相连。客户端马上返回错误 ECONNREFUSED。  
如果客户发出的SYN在中间路由器上引发一个目的地不可达ICMP错误，客户端内 核保存此消息，并按第一种情况，连续重传 SYN，直到规定时间的超时时间，对方仍没有响应，则返回保存的消息(即 ICMP 错误)EHOSTUNREACH 或 ENETUNREACH 错误返回给进程。

connect导致客户端从 CLOSED 状态转到了 SYN_SENT 状态。
若建立连接成功，也就是 connect 调用成功，状态会再变到 ESTABLISHED 状态

若函数 connect 调用失败，则套接字不能再使用，必须关闭。如果想继续向服务器发起建立连接的请求，就需要重新调用 socket 函数，生成新的套接字。


```
#include <sys/sockst.h>

int sockfd;
struct sockaddr_in server;

bzero(&server, sizeof(server));

server.sin_family = AF_INET;
server.sin_port = htons(1234);
server.sin_addr.s_addr = inet_addr("127.0.0.1");

if(connect(sockfd, (struct sockaddr *)&server, sizeof(server)) == -1){
    //handle expection
}

```


### bind()  
绑定函数的作用就是为调用 socket 函数产生的套接字分配一个本地协议地址，建立地址 与套接字的对应关系。


```
#include <sys/socket.h>
int bind(int sockfd, const struct sockaddr *server, socklen_len addrlen);
```
#### 参数  
- sockfd 是套接字函数返回的套接字描述符  
- server 参数是指向特定于协议的地址结构的指针，指定用于通信的本地协议地址  
- addrlen 指定了该套接字地址结构的长度  

#### 返回值  
如果调用成功返回 0，出错则返回-1，并置错误号 errno。

在调用 bind 函数设置端口号时，一般不要将端口号设置为小于 1024 的值，因为 1~1024 是保留端口号。  

IPv4 通配地址由常数 INADDR_ANY 来指定，其值一般为 0，它通知内核选择 IP 地址。

```
#include <sys/socket.h>

int sockfd;
int port = 1234;
struct sockaddr_in server;

bzero(&server, sizeof(server));
server.sin_family = AF_INET;
server.sin_port = htons(port);
server.sin_addr.s_addr = htonl(INADDR_ANY);

if(bind(sockfd, (struct sockaddr *)&server, sizeof(server)) == -1){
    //handle expection
}

```

### listen()  
当调用函数 socket 创建一个套接字时，默认情况下它是一个主动套接字，也就是一个将调用 connect 发起连接的客户端套接字。所以对于 TCP 服务器，在绑定操作后，必须要调用 listen 函数，将这个未连接的套接字转换成被动套接字，使它处在监听模式下，指示内核应接 受发向该套接字的连接请求。在调用 listen 函数后，服务器的状态从 CLOSED 转换到了 LISTEN 状态。

```
#include <sys/socket.h>
int listen(int sockfd, int backlog);
```

#### 参数  
- sockfd 是要设置的描述符  
- backlog 参数规定了请求队列中的最大连接个数，它对 队列中等待服务请求的数目进行了限制。如果一个服务请求到来时，输入队列已满，该套接 字将拒绝连接请求。

#### 返回值  
调用成功返回 0  
出错返回-1，并置 errno 值。


### close()

close 函数用于关闭套接字，并立即返回到进程。  
关闭了以后的套接字描述符不能再接收 和发送数据，再不能作为函数 read 或 write 的参数。  
TCP 试着将已排队的待发数据发送完， 然后按照正常 TCP 连接终止的操作关闭连接。  
close 关闭描述符，其实只是将描述符的访问 计数减 1。如果这时描述符的访问计数仍大于 0，它不会引发 TCP 的终止连接操作，这个功 能在并发服务器中非常重要。  

```
#include <unistd.h>
int close(int sockfd);
```

#### 参数  
sockfd 是要关闭的描述符。

#### 返回值  
函数调用成功返回 0，出错返回-1。



### 字节排序函数  
图2-3  
![](http://ai9338997.ke22.aihost69.top/oneindex/?/images/2021/06/22/JQAeKX9iuc/2-3.png)  

主机字节序分：**大端字节序和小端字节序**  
TCP/IP规定了网络字节序  

**主机字节序和网络字节序的转换函数**  
```
#include <netinet/in.h>
uint16_t htons(uint16_t hosts);  //16位短整形，主机字节序转换为网络字节序
uint32_t htonl(uint32_t hostl);
uint16_t ntohs(uint16_t nets);
uint32_t ntohl(uint32_t netl);
```

### ip地址转换函数  
套接字地址结构中需要用网络字节序的二进制值存储IP地址  

IPV4地址转换函数  
```
#include <arpa/inet.h>

in_addr_t inet_addr(const char *str);
int inet_aton(const char * str, struct in_addr *numstr);
char *inet_ntoa(struct in_addr inaddr);
```

inet_addr()  
字符串形式的IP地址转换为32位二进制值的IP地址，不对IP地址的有效性进行验证，常用inet_aton()代替

inet_aton()  
字符串形式的IP地址转换为32位二进制值的IP地址  
参数  
str指向字符串形式的IP地址，numstr指向转换后的32位网络字节序的IP地址  
返回值   
成功返回1，否则返回0

inet_ntoa()  
32位二进制值的IP地址转换为字符串形式的IP地址  
参数  
inaddr是一个结构，不是指向结构的指针  
返回值  
返回值指向的串留在静态内存中，所以该函数是不可重入的  

IPV4和IPV6地址转换函数  
```
#include <arpa/inet.h>
int inet_pton(int family, const char *str, void * numstr);
const char *inet_ntop(int family, const void * numstr, char *str, size_t len);

```

inet_pton  
指针str所指的字符串形式的IP地址转换成网络字节序的二进制指的IP地址，并用指针numstr存储。  
成功返回1，如果family参数无效，返回值0，出错返回-1

inet_ntop  
网络字节序的二进制指的IP地址转换成指针str所指的字符串形式的IP地址，并用指针str存储。  
参数len是目标str大小，防止溢出  
成功时，指针str是函数值的返回值  


## 第三章

图3-1  
![](http://ai9338997.ke22.aihost69.top/oneindex/?/images/2021/06/22/7ZGjW766ov/3-1.png)
画图或者写流程

### close和shutdown函数对比

close将描述字的访问计数减1，仅在此计数为0时才关闭套接口。用shutdown可以激发 TCP的正常连接终止序列，而不管访问计数。

close终止了数据传送的两个方向:读和写。由于TCP连接是全双工的，有很多时候 要通知另一端已完成了数据发送，即使那一端仍有许多数据要发送也是如此。
shutdown 函数可以仅仅关闭连接的读、写或两个方向都关闭。

![](http://ai9338997.ke22.aihost69.top/oneindex/?/images/2021/06/22/42CiKY9Xhz/9-7.png)


编程题是TCP或者UDP  
所有套接字函数都是重点
是填空，填参数或者函数名

### TCP实例的流程


## 第四章
图4-1  
![](http://ai9338997.ke22.aihost69.top/oneindex/?/images/2021/06/22/9OMxkWdwh4/4-1.png)

### recvfrom
UDP 使用 recvfrom 函数接收数据，它类似于标准的 read，但是在 recvfrom 函数中要指明目的地址。recvfrom 函数如下:

```
#include <sys/types.h>
#include <sys/socket.h>
ssize_t recvfrom(int sockfd, void *buf, size_t len, int flags, struct sockaddr *from, size_t *
addrlen);
```

#### 参数  
sockfd、buf 和 len 等同于函数 read 函数的前三个参数，分别为:调用 socket
函数生成的描述符、指向读入缓冲区的指针和读入的字节数。  

flags 参数是传输控制标志，其值如下:  
0:常规操作，所做的操作与read相同。  
MSG_OOB:指明要读的是带外数据而不是一般数据。  
MSG_PEEK:可以查看可读的数据而不读出，在接收数据后不会将这些数据丢弃。  

最后两个参数类似于 accept 的最后两个参数:  
from 返回与之通信的对方的套接字地址结构，告诉用户接收到的数据报来自于谁。  
最后一个参数 addrlen 是一个指向整 数值的指针(值-结果参数)，存储在数据发送者的套接字地址结构中的字节数。  
如果 recvfrom 函数中的 from 参数是空指针，则相应的长度参数(addrlen)也必须是空指针，这表示并不关 心发数据方的协议地址。  

返回值  
返回值为接收到的数据长度（字节为单位），就是接受的数据报中用户数据的总量。  
失败返回-1 并置相应的errno值  


### sendto()

UDP 使用 sendto 函数发送数据，它类似标准的 write，但是与 recvfrom 函数相同，sendto 函数中要指明目的地址。允许发送长度为0的数据报。
```
#include <sys/types.h>
#include <sys/socket.h>
ssize_t sendto(int sockfd, const void *buf, size_t len, int flags, const struct sockaddr *to, int
addrlen);
```

#### 参数  
sockfd、buf 和 len 等同于函数 read 函数的前三个参数，分别为:调用 socket 函数生成的描述符、指向发送缓冲区的指针和发送的字节数。  

flags 参数是传输控制标志，其值如下:
0:常规操作，所做的操作与write相同。  
MSG_DONTROUTE:告诉内核目的主机在直接连接的本地网络上，不需要查路由表。  
MSG_OOB:指明发送的是带外数据。

参数to的类型是套接字地址结构，指明数据将发往的协议地址，它的大小由addrlen参数来指定。但是sendto函数的最后一个参数是一整数值，不是指-结果参数。

#### 返回值  
该函数调用成功的返回值为发送数据的长度(以字节为单位)。  
如果调用失败则返回-1 并置相应的 errno 值。

### UDP编程实例

## 第五章

图5-1  
![](http://ai9338997.ke22.aihost69.top/oneindex/?/images/2021/06/22/LjTQab3Iab/5-1.png)

图5-2  
![](http://ai9338997.ke22.aihost69.top/oneindex/?/images/2021/06/22/tHR6eM87q3/5-2.png)

fork
执行顺序由系统调度  
如果有sleep的情况就可以分析  

vfork  
子进程先执行  

子进程和父进程区别  
子进程返回0  
父进程返回子进程的ID  

Linux有三种资源拷贝的方式:  
共享:新老进程共享通用的资源。当共享资源时，两个进程共同用一个数据结构，不需要为新进程另建。  
直接拷贝:将父进程的文件、文件系统、虚拟内存等结构直接拷贝到子进程中。子 进程创建后，父子进程拥有相同的结构。  
Copy on Write:拷贝虚拟内存页是相当困难和耗时的工作，所以能不拷贝就最好不 要拷贝，如果必须拷贝，也要尽可能地少拷贝。为此，Linux 采用了 Copy on Write 技术，把真正的虚拟内存拷贝推迟到两个进程中的任一个试图写虚拟页的时候。如果某虚拟内存页上没有出现写的动作，父子进程就一直共享该页而不用拷贝。

### fork()  
fork 用于普通进程的创建，采用的是 Copy on Write 方式

```
#include <unistd.h>
pid_t fork (void);
```

#### 返回值  
调用失败会返回-1。fork 函数调用失败的原因主要有两个，系统中已经有太多的进程;该实际用户 ID 的进程总数超过了系统限制。  
调用成功，**该函数调用一次会返回两次**。在调用进程也就是**父进程中，它返回一
次，返回值是新派生的子进程的 ID 号**，而在**子进程中它还返回一次，返回值为 0**。因此可以 **通过返回值来区别当前进程是子进程还是父进程**。  

fork 调用后，父进程和子进程继续执行 fork 函数后的指令，是父进程先执行还是子进程先执行是不确定的，这取决于系统内核所使用的调度算法。而父进程中调用 fork 之前打开的 所有描述符在函数 fork 返回之后都是共享。如果父、子进程同时对同一个描述符进行操作， 而且没有任何形式的同步，那么它们的输出就会相互混合。

### vfork()  
是完全共享的创建，新老进程共享同样的资源，完全没有拷贝。  
当使用vfork()创建新进程时，**父进程将被暂时阻塞**，而**子进程则可以借用父进程的地址空间运行**。这个奇特状态将持续**直到子进程要么退出，要么调用 execve()，至此父进程才继续执行**。

```
#include <unistd.h>
pid_t vfork (void);
```

#### 返回值  
vfork 和 fork 函数一样，**调用一次返回两次**，**父进程中它返回值是新派生的子进程的 ID
号**，而在**子进程中它返回值为 0**。  
**如果函数调用失败将返回-1**。 


可以通过下面的程序来比较 fork 和 vfork 的不同。

```
#include <sys/types.h>
#include <unistd.h>

int main(void){
    pid_t pid;
    int status;
    if ((pid = vfork()) == 0){
        sleep(2);
        printf("child running.\n");
        printf("child sleeping.\n");
        sleep(5);
        printf("child dead.\n");
        exit(0);
    }
    else if (pid > 0){
        printf("parent running .\n");
        printf("parent exit\n");
        exit(0);
    }
    else{
        printf("fork error.\n");
        exit(0);
    }
}

```

vfork输出结果：  
```
child running.  
child sleeping.  
child dead.  
parent running.  
parent exit.  
```

如果将 vfork 函数换成 fork 函数，该程序运行的结果如下:   
```
parent running.  
parent exit.  
child running.  
child sleeping.  
child dead.  
```

### 进程的终止  
函数使用的条件  
wait  

waitpid  

exit  

### wait()
如果父进程在子进程之前终止，则所有子进程的父进程被改为 init 进程，就是由 init 进 程领养。在一个进程终止时，系统会逐个检查所有活动进程，判断这些进程是否是正要终止 的进程的子进程。如果是，则该进程的父进程 ID 就更改为 1(init 的 ID)。这就保证了每个 进程都有一个父进程。

如果子进程在父进程之前终止，系统内核会为每个终止子进程保存一些信息，这样父进程就可以通过调用 wait()或 waitpid()函数，获得子进程的终止信息。终止子进程保存的信息，包括进程 ID、该进程的终止状态，以及该进程使用的 CPU 时间总量。
当父进程调用 wait() 或 waitpid()函数时，系统内核可以释放终止进程所使用的所有存储空间，关闭其所有打开文件。  
一个已经终止，但是其父进程尚未对其进行善后处理的进程称为僵尸进程。  
当子进程正常或异常终止时，系统内核向其父进程发送 SIGCHLD 信号;默认情况下， 父进程忽略该信号，或者提供一个该信号发生时即被调用的函数。  

**父进程可以通过调用wait()或waitpid()函数，获得子进程的终止信息。** 

wait 函数如下:
```
#include <sys/wait.h>
pid_t wait(int *statloc);
```
#### 参数  
参数 statloc 返回子进程的终止状态(一个整数)。  

#### 返回值  
**当调用该函数时，如果有一个子进程
已经终止，则该函数立即返回，并释放子进程所有资源，**返回值是终止子进程的 ID** 号**。**如果当前没有终止的子进程，但有正在执行的子进程，则 wait 将阻塞直到有子进程终止时才返 回**。**如果当前既没有终止的子进程，也没有正在执行的子进程，则返回错误-1**。

```
1. pid_t pid;
2. if((pid = fork())>0)
3. {
4. ...... //parent process
5. int chdstatus;
6. wait(&chdstatus);
7. }
8. else if(pid == 0)
9. {
10. ..... //child process
11. exit(0);
12. }
13. else
14. {
15. printf(“fork() error\n”);
16. exit(0);
17. }
```

### waitpid()

函数 waitpid 对等待哪个进程终止及是否采用阻塞操作方式方面给了更多的控制。

```
#include <sys/wait.h>
pid_t waitpid(pid_t pid ,int *statloc, int option);
```

#### 参数  
当参数 pid 等于-1 而 option 等于 0 时，该函数等同于 wait()函数。

参数 pid 指定了父进程要求知道哪些子进程的状态，当 pid 取-1 时，要求知道任何一个子进程的终止状态。当 pid 取值大于 0 时，要求知道进程号为 pid 的子进程的终止状态。当 pid 取值小于-1 时，要求知道进程组号为 pid 的绝对值的子进程的终止状态。

参数 option 让用户指定附加选项。最常用的选项是 WNO_HANG，它通知内核在没有已终止子进程时不要阻塞。

#### 返回值  
当前有终止的子进程时，返回值为子进程的 ID 号，同时参数 statloc 返回子进程的终止 状态。否则返回值为-1。

waitpid 函数的用法如下:
```
pid_t pid;
int stat;
while((pid=waitpid(-1,&stat,WNOHANG))>0)
printf(“child %d terminated\n”,pid);
```
可以使用 while 循环调用 waitpid 函数，但是如果将 waitpid 函数换成 wait 函数，结果会 怎么样?

### exit()  
函数是用来终止进程，返回状态的。
```
#include <stdlib.h>
void exit(int status); 
```

本函数终止调用进程，**关闭所有子进程打开的描述符**，向父进程发送 SIGCHLD 信号，
并返回状态，随后父进程就可通过调用 wait 或 waitpid 函数获得终止子进程的状态了。


### 多进程并发的流程图p58  
![](http://ai9338997.ke22.aihost69.top/oneindex/?/images/2021/06/22/TxKjQq0jtG/58-1.png)
![](http://ai9338997.ke22.aihost69.top/oneindex/?/images/2021/06/22/P7rei1v6Lv/58-2.png)

**重点是fork之后，父进程关闭已连接描述符，子进程关闭监听描述符**

### 多进程并发的实例


p67的那段话读一读  
进程和线程的区别  
创建进程的fork，内存映像要从父进程拷贝到子进程，所有描述符要在子进程中复制，虽然fork采用写时拷贝（copy-on-write）技术，将真正的拷贝推迟到子进程有写操作时，但fork仍然是昂贵的，fork子进程后，需要用到进程间通信（IPC）在父子进程间传递信息，由于子进程从一开始就有父进程数据空间和所有描述符的拷贝，所以fork之前的信息容易传递，但是从子进程返回信息给父进程就需要作很多工作。

线程是进程内的独立执行实体和调度单元，又称为“轻量级”进程(lightwight process)， 创建线程比进程快 10~100 倍。一个进程内的所有线程共享相同的内存空间、全局变量等信 息(这种机制又带来了同步问题)，所以一个线程崩溃时，它会影响同一进程中的其他线程。

### 线程基础函数p68  
### pthread_create()  
用于创建新线程。
```
#include <pthread.h>
int pthread_create(pthread_t *tid, const pthread_attr_t *attr, void *(*func)(void *), void *arg); 
```
如果新线程创建成功，参数 tid 返回新生成的线程 ID。

#### 参数
执行函数的地址由参数 func 指定。该函数必须是一个静态函数，它只有一个通用指针作为参数，并返回一个通用指针。  
该执行函 数的调用参数是由 arg 指定，arg 是一个通用指针，用于往 func 函数中传递参数。  
如果需要 传递多个参数时，必须将它们打包成一个结构，然后让 arg 指向该结构。  
线程以调用该执行函数开始。

#### 返回值
函数调用成功返回 0，出错则返回非 0。 


pthread_create 函数的用法如下:
```
#include <pthread.h>

pthread_t tid;
int arg;

void *function(void *arg);

if (pthread_create(&tid, NULL, function, (void *)&arg)){
    //handle exception
    exit(1);
}
......
```

### pthread_join()  
与进程的 waitpid 函数功能类似，等待一个线程终止。  
该函数必须指定要等待的线程，不能等待任一个线程结束。要求等待的线程必须是当前进程的成员，并且不是分离的线程或守护线程。几个线程不能同时等待一个线程完成，如果其中一个成功调用 pthread_join 函数，则其他线程将返回 ESRCH 错误。如果等待的线程已经终止，则该函数立即返回。如果参数 status 指针非空，则 指向终止线程的退出状态值。

pthread_join 函数如下:

```
#inlcude <pthread.h>
int pthread_join(pthread_t tid, void **status);
```

#### 参数  
tid 指定所等待的线程 ID。  

#### 返回值  
该函数如果调用成功则返回 0，出错时返回正的错误码。  

线程分为两类:可联合的和分离的，默认情况下线程都是可联合的。可联合的线程终止时，其线程 ID 和终止状态将保留，直到线程调用 pthread_join 函数。而分离的线程退出后，系统将释放其所有资源，其他线程不能等待其终止。如果一个线程需要知道另一个线程什么时候终止，最好保留第二个线程的可联合性。  

### pthread_detach()  
将指定的线程变成分离的。  
```
#inlcude <pthread.h>
int pthread_detach(pthread_t tid)
```
#### 参数  
tid 指定要设置为分离的线程 ID。

#### 返回值  
如果函数调用成功返回 0，否则返回错误码。

### pthread_self()  
每一个线程都有一个 ID，pthread_self 函数返回自己的线程 ID。
```
#inlcude <pthread.h>
pthread_t pthread_self(void);
```
函数返回调用函数的线程 ID。

线程可以通过如下语句，将自己设为可分离的:
```
pthread_detach(pthread_self());
```

### pthread_exit()  
用于终止当前线程，并返回状态值，如果当前线程是可联合的，则其退出状态将保留。
```
#include <pthread.h>
void pthread_exit(void *status);
```
#### 参数  
status 指向函数的退出状态。这里的 status 不能指向一个局部变量，因为当前线程
终止后，其所有局部变量将被撤销。  

该函数没有返回值。  

还有两种方法可以使线程终止:
启动线程的函数pthread_create的第三个参数返回。该返回值就是线程的终止状态。  
如果进程的main函数返回或者任何线程调用了exit函数，进程将终止，线程将随之终止。  

5.3.3 给新线程传递参数
线程产生函数 pthread_create，只能传递一个参数给线程的执行函数。所以当需要传递多
个数据时，需要将所有数据封装在一个结构中，再将该结构传递给执行函数。



### 线程特定数据（TSD）
p81  
有四个函数
函数代码的执行结果

多线程环境里，应避免使用静态变量。Linux系统中提供线程特定数据（TSD）来取代静态变量。类似于全局变量，但是，是各个线程私有的，以线程为界限。TSD是定义线程私有数据的唯一方法。同一进程中的所有线程，它们的同一特定数据项都由一个进程内唯一的关键字KEY来标志。用这个关键字，线程可以存取线程私有数据。

在线程特定数据中通常使用四个函数。  

### pthread_key_create()  
函数在进程内部分配一个标志 TSD 的关键字。  
```
#include <pthread.h>
int pthread_key_create(pthread_key_t *key, void (* destructor)(void *value)); pthread_key_create 
```
#### 参数
参数 key 指向创建的关键字，该关键字对于一个进程中的所有线程是惟一的。所以在创建 key 时，每个进程只能调 用一次创建函数 pthread_key_create。在 key 创建之前，所有线程的关键字值是 NULL。一旦 关键字被建立，每个线程可以为该关键字绑定一个值。这个绑定的值对于线程是惟一的，每个线程独立维护。  

参数 destructor 是一个可选的析构函数，可以和每个关键字联系起来。如果一个关键字 的 destructor 函数不为空，且线程为该关键字绑定了一个非空值，那么在线程退出时，析构函数将会被调用。对于所有关键字的析构函数，执行顺序是不能指定的。

#### 返回值  
该函数正常执行后返回值为 0，否则返回错误码。  

### pthread_once_t()  
pthread_once 函数使用 once 参数所指的变量，保证每个进程只调用一次 init 函数。
```
#include <pthread.h>
int pthread_once(pthread_once_t *once, void (*init) (void))
```
#### 参数  
通常 once 参数取常量 PTHREAD_ONCE_INIT，它保证每个进程只调用一次 init 函数。  

#### 返回值  
该函数正常执行后返回值为 0，否则返回错误码。


### pthread_setspecific()  
pthread_setspecific 函数为 TSD 关键字绑定一个与本线程相关的值。  
```
#include <pthread.h>
int pthread_setspecific(pthread_key_t key, const void *value);
```
#### 参数  
参数 key 是 TSD 关 键字。参数 value 是与本线程相关的值。value 通常指向动态分配的内存区域。

#### 返回值  
该函数正常执行后返回值为 0，否则返回错误码。

### pthread_getspecific()  
```
#include <pthread.h>
void * pthread_getspecific(pthread_key_t key);
```
#### 参数  
pthread_getspecific 函数获取与调用线程相关的 TSD 关键字所绑定的值。参数 key 是 TSD关键字。

#### 返回值  
该函数正常执行后返回与调用线程相关的 TSD 关键字所绑定的值。否则返回 NULL。


### 多线程并发实例

## 第六章
### gethostbyname()
该函数执行如果成功，它返回一个指向结构 hostent 的指针，该结构中包含了该主机的所有 IPv4 地址或 IPv6 地址。如果失败 返回空指针。
 
```
#include <netdb.h>
struct hostent * gethostbyname (const char * hostname);
```

#### 参数  
hostname 是主机的域名地址。

#### 返回值  
如果失败返回空指针，如果成功此参数返回的非空指针指向如下的 hostent 结构  

```
struct hostent {
    char * h_name; /*主机的正式名称*/
    char * * h_aliases; /*主机的别名列表*/
    int h_addrtype; /*主机地址类型*/
    int h_length; /*主机地址长度*/
    char * * h_addr_list; /*主机IP地址的列表*/
    }
    
#define h_addr h_addr_list[0]    /*在列表中的第一个地址*/
```

h_name 用于存放主机的正式名称  
h_ aliases 用于存放该主机可能具有的多个别名，就像该主机提供多个网络服务时，将使用多个不同的域名地址别名。  
在 IPv4 下， h_addrtyped 的值为 AF_INET,而在 IPv6 下为 AF_INET6  
在 IPv4 下，h_length 的值是 4 字 节地址信息，而在 IPv6 下 h_length 的值是 16   字节地址信息  
h_addr_list 是以字符串形式存放的 IP 地址。


## 第九章
### I/O模型
p135-139  
五种I/O模型的名字和对比  
图9-6

I/O 模型分为五种不同的类型  
阻塞 I/O、非阻塞 I/O、 I/O 复用、信号驱动 I/O 、异步 I/O。

输入操作分为两个阶段：  
1、等待数据准备好
2、数据从内核拷贝到进程

UDP为例：  
阻塞 I/O 模型  
数据报没准备好时，进程阻塞于recvfrom函数调用，直到数据报准备好，拷贝数据，拷贝完成，返回

![](http://ai9338997.ke22.aihost69.top/oneindex/?/images/2021/06/22/wSLgvhakhz/9-1.png)

非阻塞 I/O  
数据报没准备好时，进程反复调用recvfrom，返回错误信息，直到数据报准备好，拷贝数据，拷贝完成，返回

![](http://ai9338997.ke22.aihost69.top/oneindex/?/images/2021/06/22/p6Xh13f9vl/9-2.png)

I/O 复用
I/O 复用调用 select 或 poll，并在该函数上阻塞，等待数据报套接口可读，当 select 返回
可读条件时，调用 recvfrom 将数据报拷贝到应用程序缓冲区中  
![](http://ai9338997.ke22.aihost69.top/oneindex/?/images/2021/06/22/sBgUGT6dl1/9-3.png)

信号驱动 I/O
通过系统调用安装一个信号处理程序，让内核在描述字准备好时用信号 SIGIO 通知，此系统调用立即返回，进程继续工作，执行recvfrom函数

![](http://ai9338997.ke22.aihost69.top/oneindex/?/images/2021/06/22/WhxyZh5Gb8/9-4.png)

异步 I/O  
这种模型没有被广泛应用，只作了解
![](http://ai9338997.ke22.aihost69.top/oneindex/?/images/2021/06/22/9rmv6kyCrF/9-5.png)

各种模型的比较  
如图 9-6 所示为上述五种不同 I/O 模型的比较。  
前四种模型的主要区别都在第一阶段，因为前四种模型的第二阶段基本相同：在数据从内核拷贝到调用者的缓冲区时，进程阻塞于 recvfrom 调用。然而，异步 I/O 模型处理的两个阶段都不同于前四个模型。既是我 们的前四个模型——阻塞 I/O 模型、非阻塞 I/O 模型、I/O 复用模型和信号驱动 I/O 模型都是同步 I/O 模型，因为真正的 I/O 操作(recvfrom)阻塞进程，只有异步 I/O 模型与此异步 I/O 的定义相匹配。

![](http://ai9338997.ke22.aihost69.top/oneindex/?/images/2021/06/22/8kuvdLQxQ0/9-6.png)

### select()

它允许进程指示内核等待多个事件中的任意一个发生，并仅在一个或多个事件发生或进过指定的时间时才唤醒进程。

```
#include<sys/select.h>
#include<sys/time.h>
int select(int maxfdp 1, fd_set *readset,fd_set *writeset, fd_set *execepset, const struct timeval * timeout);
```
#### 参数  

在上面的参数中可以看到一个 timeval 结构，这个结构可以提供秒数和毫秒数成员，形式如下:

```
struct timeval {
long tv_sec; /*second*/
long tv_usec; /*microsecond*/
}
```

这个 timeval 结构有三种可能:  
永远等待下去:仅在有一个描述字准备好 I/O 时才返回，因此我们可以将参数 timeout 设置为空指针。  
等待固定时间:在有一个描述字准备好 I/O 时返回，但不超过由 timeout 参数所指 timeval 结构中指定的妙数和微妙数。  
根本不用等待:检查描述字后立即返回，这称为轮询(polling)。  

在前两者情况的等待中，如果进程捕获了一个信号并从信号处理程序返回，那么等待一般被中断。

参数 readset，writeset 和 execeptset 指定让内核测试读、写、异常条件的描述字。如果我们对他们不感兴趣，可将其设为空指针。

select 函数使用描述字集为参数 readset(writeset 或 except)指定多个描述字，描述字集 是一个整数数组，每个数中的每一个对应于一个描述字，例如 32 位整数，则数组的第一个元 素对应于 0~31 描述字，第二个元素对应于 32~63 描述字等等。


下面介绍操作这些描述字的几个宏:  
```
void FD_ZERO(fd_set * fdset);  /*将所有位设 0*/
void FD_SET(int fd, fd_set*fdset);  /*将 fd 位设 1*/
void FD_CLR(int fd, fd_set * fdset);  /*将 fd 位设为 0*/
int FD_ISSET(int fd, fd_set * fdset);  /*检测 fd 位是否为 1*/
```

分配一个 fd_set 数据类型的描述字集，利用上面的四个宏来操作。例如将描述字 1，3 的设置如下:
```
fd_set fdset;
FD_ZERO (&fdset);  /*初始化 fdset*/
FD_SET(1, &fdset);  /*将 fd 为 1 的描述字设 1*/
FD_SET(3, &fdset);   /*将 fd 为 3 的描述字设 1*/
FD_CLR(3, &fdset);   /*将 fd 为 3 的描述字设 0*/
FD_ISSET(3, &fdset); /*检测 fd 为 3 的描述字是否为 1*/
```

参数 readset、writeset，exceptset 为值——结果参数，调用 select 时，指定我们所关心的 描述字，返回时结果指示那些描述字已准备好。  

参数 maxfdp1 指定被测试的描述字的个数，它是被测试的最大描述字加 1。如要测试 1， 2，4 描述字，则必须测试 0，1，2，3，4 共 5 个描述字。

#### 返回值  
调用成功返回所有描述字集中的已准备好的描述字个数。超时返回 0，出错返回 -1。

描述字准备好的条件:  
当 select 函数调用阻塞时，当套接口读、写准备好或异常时 select 返回。

### shutdown()
close将描述字的访问计数减1，仅在此计数为0时才关闭套接口。用shutdown可以激发 TCP的正常连接终止序列，而不管访问计数。

close终止了数据传送的两个方向:读和写。由于TCP连接是全双工的，有很多时候 要通知另一端已完成了数据发送，即使那一端仍有许多数据要发送也是如此。
shutdown 函数可以仅仅关闭连接的读、写或两个方向都关闭。下图就是为该情况下 的典型函数调用(如图 9-7 所示)。

![](http://ai9338997.ke22.aihost69.top/oneindex/?/images/2021/06/22/42CiKY9Xhz/9-7.png)


```
# include <sys/socket.h>
int shutdown (int sockfd , int howto) ; 
```

#### 参数  
sockfd 为要关闭的套接口描述字  
参数 howto 为以下常值:
SHUT_RD:关闭连接的读这一半，不再接收套接口中的数据，而且留在套接口接收 缓冲区中的数据都作废。进程不能再对套接口执行任何读函数。调用此函数后，TCP 套接口接收的任何数据都被确认，但数据本身扔掉。

SHUT_WR:关闭连接的写这一半，在 TCP 场合下，这种情况称为半关闭 (half-close)(TCPvl 的 18.5 节)。当前留在套接口发送缓冲区中的数据都被发送，后 跟正常的 TCP 连接终止序列，进程不能再执行对套接口的任何写函数。

SHUT_RDWR:连接的读这一半和写这一半都关闭，等同于调用函数 shutdown 两次， 第一次调用时用 SHUT_RD，第二次调用时用 SHUT_WR。


#### 返回值  
成功返回0，出错返回-1


### TCP实例代码

server
```
#include <stdio.h>
#include <strings.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#define PORT 1234
#define BACKLOG 1
main()
{
    int listenfd, connectfd;
    struct sockaddr_in server;
    struct sockaddr_in client;
    socklen_t addrlen;
    if ((listenfd = socket(AF_INET, SOCK_STREAM, 0)) == -1)
    {
        perror("socket() error.");
        exit(1);
    }
    
    int opt = SO_REUSEADDR;
    setsockopt(listenfd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    bzero(&server,sizeof(server));
    server.sin_family=AF_INET;
    server.sin_port=htons(PORT);
    server.sin_addr.s_addr = htonl (INADDR_ANY);
    if (bind(listenfd, (struct sockaddr *)&server, sizeof(server)) == -1)
    {
        perror("Bind() error");
        exit(1);
    }
    if(listen(listenfd,BACKLOG) == -1)
    {
        perror("listen() error.\n");
        exit(1);
    }
    len =sizeof(client);
    if ((connectfd = accept(listenfd,(struct sockaddr *)&client,&addrlen))==-1)
    {
        perror("accept() error\n");
        exit(1);
    }

    printf("You got a connection from cient's ip is %s，port is %d\n",inet_ntoa(client.sin_addr),htons(client.sin_port));
    
    send(connectfd,"Welcome\n",8,0);
    close(connectfd);
    close(listenfd);
}
```


client
```
#include <stdio.h>
#include <unistd.h>
#include <strings.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#define PORT 1234
#define MAXDATASIZE 100
int main(int argc, char *argv[])
{
    int sockfd, num;
    char buf[MAXDATASIZE]; /* buf will store received text */
struct hostent *he; /* structure that will get information about remote host */ struct sockaddr_in server;
if {
(argc !=2)
printf("Usage: %s <IP Address>\n",argv[0]);
exit(1); }
if {
((he=gethostbyname(argv[1]))==NULL)
printf("gethostbyname() error\n");
exit(1); }
if {
((sockfd=socket(AF_INET, SOCK_STREAM, 0))==-1)
printf("socket() error\n");
exit(1); }
bzero(&server,sizeof(server));
server.sin_family = AF_INET;
server.sin_port = htons(PORT);
server.sin_addr = *((struct in_addr *)he->h_addr); if(connect(sockfd, (struct sockaddr *)&server,sizeof(server))==-1) {
printf("connect() error\n");
exit(1); }
if ((num=recv(sockfd,buf,MAXDATASIZE,0)) == -1) {
printf("recv() error\n");
exit(1); }
buf[num-1]='\0';
- 36 -

第3章 基本TCP套接字编程
46. printf("server message: %s\n",buf);
47. close(sockfd);
48. }
```

