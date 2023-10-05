## 前置知识

### 进程 Process

#### **定义：**

进程是一个执行中程序的实例
A process is an instance of a running program.

#### **两个关键抽象：**

- 逻辑控制流（Logical control flow）
  - 它提供一个假象，好像我们的程序独占地使用处理器
  - 内核机制 -> 上下文转换
- 私有地址空间（Private address space）
  - 它提供一个假象，好像我们的程序独占地使用内存系统
  - 内核机制 -> 虚拟内存

> **上下文转换**
> 内容
> 内核为每一个进程维持一个上下文。
> 上下文是内核重新启动一个被抢占的进程所需的状态。
> 对象包括：各种寄存器，计数器，栈空间，各种内核数据结构
>
> 步骤
> 1. 保存当前进程的上下文
> 2. 恢复某个先前被抢占的进程被保存的上线问
> 3. 将控制传递给这个新恢复的进程
>
> 发生的时机
> 系统调用：内核代表用户执行系统调用
> 中断：时钟中断
>
> **虚拟内存**
> 虚拟内存是计算机系统内存管理的一种技术。它使得应用程序认为它拥有连续可用的内存（一个连续完整的地址空间），而实际上物理内存通常被分隔成多个内存碎片，还有部分暂时存储在外部磁盘存储器上，在需要时进行数据交换（维基百科）


#### **用户模式和内核模式**

这是一个链接 [参考文章：Linux内核](https://zhuanlan.zhihu.com/p/342056802)

#### **并发流**

#### **上下文切换**

<div class="page"/>

### 系统调用错误处理

我们需要进行大量的系统调用。
linux系统级函数遇到错误时，通常会返回-1，并通过设置全局整数变量`errno`来表示什么出错了。

例如当调用linux fork函数时，即`pid = Fork()`，可以用如下代码进行检查是否出错
```c
void unix_error(char *msg){
  fprintf(stderr, "%s: %s\n", msg, strerror(errno));
  exit(0);
}

pid_t Fork(){
  pid_t pid;

  if((pid = fork()) < 0)
    unix_error("Fork error") 
}
```

> 其中
> fprintf -> 函数根据指定的format(格式)发送信息(参数)到由stream(流)指定的文件.因此fprintf()可以使得信息输出到指定的文件
> 
> stdout – 标准输出设备 (printf(“..”)) 同 stdout。
> stderr – 标准错误输出设备
> 两者默认向屏幕输出。
>
> strerror 函数返回一个文本串，描述了和某个 errno 值相关联的错误。使用 strerror 来查看错误

这是一个链接 [参考文章：fprintf()函数的运用](https://blog.csdn.net/coolwriter/article/details/77868103)

<div class="page"/>

### 进程控制

#### **ID与获取**

**进程id**

每个进程都有一个唯一的非零正整数表示的进程 ID，叫做 PID(process id)
有两个获取进程 ID 的函数：

```c
#include<sys/types.h>
#include<unistd.h>

pid_t getpid();
pid_t getppid();
```

**进程组id**
```c
  #include <unistd.h>

  int setpgid(pid_t pid, pid_t pgid);
  pid_t getpgrp(pid_t pid);
```

进程组是一个或多个进程的集合;他们与同一作业相关联.每个进程组都有唯一的进程组ID（PGID），进程组ID（PGID）可以在用户层修改.比如，将某个进程添加到另一个进程组，就是使用setpgid()函数修改其进程组ID.

进程组ID（PGID）也可以通过函数getpgrp()获得.通过fork()函数产生的子进程会继承它的父进程的进程组ID（PGID）.

这是一个链接 [参考文章：进程的基本属性](https://blog.csdn.net/tuyerv/article/details/104000418?spm=1001.2101.3001.6650.1&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-104000418-blog-100362774.235%5Ev38%5Epc_relevant_anti_t3_base&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-104000418-blog-100362774.235%5Ev38%5Epc_relevant_anti_t3_base&utm_relevant_index=2)


#### **进程的状态**

进程总是处于以下三种状态之一：
1. **运行**：进程要么在 CPU 上执行，要么在等待被执行且最终被内核调度。
2. **停止**：进程的执行被挂起且不会被调度。当收到 SIGSTOP, SIGTSTP, SIGTTIN, SIGTTOU 信号时，进程就会停止，直到收到一个 SIGCONT 信号时再次开始运行。
3. **终止**：进程永远地停止了。进程有三种原因终止：
   - 收到一个信号，该信号的默认行为是终止进程
   - 从主进程返回
   - 调用 exit 函数
信号是一种软件中断的形式。

这是一个链接 [参考文章：Linux信号列表](https://blog.csdn.net/eager7/article/details/8290937)


#### **进程的终止**

**exit函数**
通过调用`exit`函数，可以使得进程终止
```c
#include <stdlib.h>

void exit(int status); // status 指定进程终止时的退出状态。
```

exit 函数以 status 退出状态来终止进程
另一种设置退出状态的方法是从主程序中返回一个整数值。
其中正常返回状态为0，错误时非0

exit函数的特点：exit被调用一次，但永远不会返回
exit is called once but never returns.


#### **进程的创建**

**fork函数**

```c
#include <sys/types.h>
#include <unistd.h>

pid_t fork(void); //子进程返回 0，父进程返回子进程的 PID，如果出错，返回 -1
```

父进程通过调用`fork`函数创建一个新的运行的子进程。所有的进程的创建都是通过`fork`函数

`fork`函数只被调用一次，但是会返回两次：
- 一次返回是在父进程中,父进程中返回子进程的 PID。
- 一次是在新创建的子进程,子进程中返回 0。


因为`fork`创建的子进程的 PID 总是非零的，所以可以根据返回值是否为 0 来分辨是当前是在父进程还是在子进程。

子进程与父进程几乎完全相同：
- 子进程得到与父进程用户级虚拟地址空间相同但独立的一份副本，包括代码段、数据段、堆、共享库、用户栈。
- 子进程获得与父进程所有文件描述符相同的副本。这意味着子进程可以读写父进程打开的任何文件。
- 子进程和父进程之间的最大区别在于 PID 不同。
- 对于后面会提到阻塞信号，父进程对哪些信号进行了阻塞将也会复制到子进程中进行阻塞

> 注意和重难点
>
> 1. 为什么调用一次fork会有两次返回值？
>     - 一次返回到父进程，一次返回到新创建的子进程 
> 2. 不论子进程还是父进程，它的返回点都是调用 fork 函数的地方，因此在 fork 函数调用之前的部分只会在父进程中执行，而不会在子进程中执行。
> 3. **并发执行**：父进程和子进程是并发执行的独立进程，内核能够以任意方式会交替执行它们的逻辑控制流中的指令。**作为程序员，我们决不能对不同进程中的指令的交替执行做任何假设**
> 4. 子进程会继承一份父进程被要求阻塞的信号，但是是复制一份，不是用一份
> 5. 对于流程图上的，我们只能确定一条线上的执行顺序，而决定不了两条线上的执行顺序
> ![image-20230709201545751](./assets/image-20230709201545751.png)





#### **进程的回收**

当一个进程终止时，内核并不会立即把它删除。相反，进程被保持在一种已终止的状态中，直到被它的父进程回收。
当父进程回收已终止的子进程时，内核将子进程的退出状态传递给父进程，然后清除子进程。

**僵死进程**
一个终止了但还未被回收的进程。
即使僵死子进程没有运行，到那时它们仍然消耗系统的内存资源

**init进程**
系统启动时内核会创建一个 init 进程（关于init的创建可以去看shell部分），它的 PID 为 1，不会终止，是所有进程的祖先，只有当整个系统关闭的时候才会终止。

如果一个父进程终止了，init 进程会成为它的孤儿进程的养父。init 进程会负责回收没有父进程的僵死子进程。
长时间没有运行的程序，总是应该回收僵死子进程。即使僵死子进程没有运行，也在消耗系统的内存资源。

**回收(Reaping)**
1. 由父进程对终止的子进程执行 `wait`或`waitpid`函数
2. 通过`wait`或`waitpid`函数子进程给父进程退出状态信息
3. 内核删除僵尸子进程

如果父进程在没有回收子进程的情况下终止了，那么孤儿进程兼备init进程回收
并且当在长时间运行的进程中时需要显示回收，例如shell和服务器
在这种情况下，服务器可能创建数百万个子进程，每个子进程终止的时候都可能产生很多的僵尸进程，将占用大量内存空间，即内存泄漏


> **进程终止和被清理详情** 
> 在 Unix 和 Linux 系统中，进程终止的清理工作分为两个阶段：进程终止阶段和进程清理阶段。
>
> 进程终止阶段：
> 1. 子进程在执行完成后，会发送一个 SIGCHLD 信号给其父进程。这是一个标准的 Unix 信号，用于告知父进程，子进程已经结束。
> 2. 子进程的大部分资源，如内存和文件描述符，都会被操作系统立即回收。但是，操作系统会保留一些关于子进程的信息，如其进程 ID、终止状态、运行时间等。此时，子进程成为了僵尸进程。
>
> 进程清理阶段：
> 1. 父进程通过调用 `wait()` 或 `waitpid()` 函数，来获取子进程的终止状态。**这两个函数也会告知操作系统，父进程已经收到了子进程结束的消息。**
> 2. 当 `wait()` 或 `waitpid()` 函数返回时，操作系统会删除所有关于已经结束的子进程的剩余信息，这就完成了子进程的清理工作。
>
> 所以，“自动”这个词是指操作系统内核在父进程调用 `wait()` 或 `waitpid()` 函数并从中返回后，会自动完成对子进程的清理工作。这个过程是由操作系统自动完成的，而不需要程序员编写额外的代码来完成。
>
> 需要注意的是，如果父进程没有调用 `wait()` 或 `waitpid()`，子进程就会保持僵尸状态。如果父进程在此之前结束了，子进程将被 init 进程接管，**而 init 进程会定期调用 `wait()` 函数来清理任何已经结束的子进程。**

**waitpid函数**
wait for process to change state

waitpid函数可以帮助父进程知道自己创建的子进程何时结束，进而做出一些响应


```c
#include <sys/types.h> 
#include <sys/wait.h>

pid_t waitpid(pid_t pid,int *status,int options);
```

如果在调用waitpid()函数时，当指定等待的子进程已经停止运行或结束了，则waitpid()会立即返回；但是如果子进程还没有停止运行或结束，则调用waitpid()函数的父进程则会被阻塞，暂停运行。

**waitpid函数的第一个参数`pid_t pid`**
 
|   参数    |                                                          解释                                                          |
| :-------: | :--------------------------------------------------------------------------------------------------------------------: |
| pid < -1  |                                         等待进程组号为 pid绝对值 的所有子进程                                          |
| pid == -1 |                         等待任何一个子进程退出，没有任何限制，此时waitpid和wait的作用一模一样                          |
| pid == 0  |               等待同一个进程组中的任何子进程，如果子进程已经加入了别的进程组，waitpid不会对它做任何理睬                |
|  pid > 0  | 只等待进程ID等于pid的子进程，不管其它已经有多少子进程运行结束退出了，只要指定的子进程还没有结束，waitpid就会一直等下去 |

**waitpid函数的第二个参数`int *status`**

the state change can including

- the child is terminated exit(0)
- the child is stopped by signal
- the child is resume by a signal

这个参数将保存子进程的状态信息，有了这个信息父进程就可以了解子进程为什么会推出，是正常推出还是出了什么错误。
如果status不是空指针，则状态信息将被写入器指向的位置。
当然，如果不关心子进程为什么推出的话，也可以传入空指针。
Linux提供了一些非常有用的宏来帮助解析这个状态信息，这些宏都定义在sys/wait.h头文件中。主要有以下几个：

|        参数         |                                  解释                                   |
| :-----------------: | :---------------------------------------------------------------------: |
|  WIFEXITED(status)  |              如果子进程正常结束，它就返回真；否则返回假。               |
| WEXITSTATUS(status) | 如果WIFEXITED(status)为真，则可以用该宏取得子进程exit()返回的结束代码。 |
| WIFSIGNALED(status) |     如果子进程因为一个未捕获的信号而终止，它就返回真；否则返回假。      |
|  WTERMSIG(status)   |  如果WIFSIGNALED(status)为真，则可以用该宏获得导致子进程终止的信号代码  |
| WIFSTOPPED(status)  |              如果当前子进程被暂停了，则返回真；否则返回假               |
|  WSTOPSIG(status)   | 如果WIFSTOPPED(status)为真，则可以使用该宏获得导致子进程暂停的信号代码  |


**waitpid函数的第三个参数`int options`**

参数options提供了一些另外的选项来控制waitpid()函数的行为。如果不想使用这些选项，则可以把这个参数设为0。

|    参数    |                                                         解释                                                          |
| :--------: | :-------------------------------------------------------------------------------------------------------------------: |
|  WNOHANG   | 如果pid指定的子进程没有结束，则waitpid()函数立即返回0，而不是阻塞在这个函数上等待；如果结束了，则返回该子进程的进程号 |
| WUNTRACED  |                        如果WIFEXITED(status)为真，则可以用该宏取得子进程exit()返回的结束代码。                        |
| WCONTINUED |                                   如果子进程从暂停状态被恢复成运行状态，则立即返回                                    |


这些参数可以用“|”运算符连接起来使用。
如果waitpid()函数执行成功，则返回子进程的进程号；如果有错误发生，则返回-1，并且将失败的原因存放在errno变量中。

失败的原因主要有
- 没有子进程（errno设置为ECHILD
- 调用被某个信号中断（errno设置为EINTR）
- 选项参数无效（errno设置为EINVAL）

如果像这样调用waitpid函数：waitpid(-1, status, 0)，这此时waitpid()函数就完全退化成了wait()函数。


the value options is an OR of zero or more of following constant


> 父进程不会等待着子进程结束后再继续，而是收到子进程结束的信号后再回收子进程
> 
> `waitpid()`函数的 `WNOHANG` 选项正是用于这种情况的。使用 `WNOHANG` 选项，如果指定的子进程还没有结束，那么 `waitpid()` 函数会立即返回0，而不会阻塞。
>
> 如果你想在子进程结束时得到通知，可以使用 `SIGCHLD` 信号。当一个子进程结束时，它会向父进程发送 `SIGCHLD` 信号。你可以在父进程中捕获这个信号，并在信号处理函数中调用 `waitpid()`，这样你就可以得知哪个子进程已经结束，并且收割这个子进程。
>
> 以下是一个基本的示例，演示了如何使用 `SIGCHLD` 信号和 `waitpid()` 函数：
>
> ```c
> #include <stdio.h>
> #include <stdlib.h>
> #include <sys/wait.h>
> #include <signal.h>
> #include <unistd.h>
> 
> void sigchld_handler(int s)
> {
>     while(waitpid(-1, NULL, WNOHANG) > 0);
> }
> 
> int main(void)
> {
>     struct sigaction sa;
>     
>     sa.sa_handler = &sigchld_handler;
>     sigemptyset(&sa.sa_mask);
>     sa.sa_flags = SA_RESTART | SA_NOCLDSTOP;
>     if(sigaction(SIGCHLD, &sa, 0) == -1) {
>         perror(0);
>         exit(1);
>     }
>     
>     // 在此处创建子进程
>     
>     while(1) {
>         // 父进程的其余部分
>     }
>     
>     return 0;
> }
> ```
>
> 在这个例子中，`sigchld_handler` 函数是 `SIGCHLD` 信号的处理函数。当 `SIGCHLD` 信号到达时，这个函数就会被调用，然后它会调用 `waitpid()` 来收割已经结束的子进程。这样，父进程就可以在子进程结束时得到通知，而不需要阻塞等待子进程的结束。


这是一个链接 [参考文章：Linux中waitpid()函数的用法](https://blog.csdn.net/Roland_Sun/article/details/32084825)

#### **子进程加载并运行程序**

在子进程载入其他的程序，就需要使用 `execve` 函数，或者用`execvp`，除非有错误，否则这两个函数都不会有返回值

**ececve函数**

execve 函数在当前进程的上下文中加载并运行一个新程序（是程序不是进程）。

```c
#include <unistd.h>

int execve(char *filename, char *argv[], char *envp[]);
```
execve 函数功能：加载并运行可执行目标文件 filename，并带一个参数列表 argv 和一个环境变量列表 envp。

execve 调用一次并从不返回（区别于 fork 调用一次返回两次）。

参数列表和变量列表：
- 参数列表：argv 指向一个以 null 结尾的指针数组，其中**每个指针**指向一个**字符串**。
- 环境变量列表：envp 指向一个以 null 结尾的指针数组，其中**每个指针**指向一个**环境变量字符串**，每个串都是形如 “name=value” 的名字-值对。

![](assets/2023-07-14-00-43-00.png)

execve函数的执行过程
execve 函数调用加载器加载了 filename 后，设置用户栈，**并将控制传递给新程序的主函数（即 main 函数）**。

**main函数**
main 函数有以下形式的原型，两种是等价的。

```c
int main(int argc, char **argv, char **envp);

int main(int argc, char *argv[], char *envp[]);
```

main 函数有三个参数：
1. `argc`：给出 `argv[ ]` 数组中非空指针的数量。
2. `argv`：指向 `argv[ ]` 数组中的第一个条目。
3. `envp`：指向 `envp[ ]` 数组中的第一个条目。

argc 和 argv 的值都是从命令行中获取的，如果命令行中只有该可执行文件的名字，没有其他参数，则 argc=1，argv 的第一个元素的值即为该可执行文件的文件名（包含路径）
注意 argv[] 数组和 envp 数组最后一个元素都是 NULL，可以使用 NULL 作为循环终止条件来遍历数组。

![](assets/2023-07-14-00-48-24.png)

**操作环境变量数组的函数**

```c
#include <stdlib.h>

char *getenv(const char *name);  
//在环境变量列表中搜索字符串 "name=value"，如果搜到了返回指向 value 的指针，否则返回 NULL
int setenv(const char *name, const char *newvalue, int overwrite);  
//若成功返回 0，否则返回 -1。
//如果环境变量列表中包含一个形如 ”name=value" 的字符串，setnv 会用 newvalue 替代原来的 value
//如果不存在，直接添加一个 "name=newvalue" 到数组中。
void unsetenv(const char *name); 
//如果环境变量列表中包含一个形如 ”name=value" 的字符串,unsetnv 会删除它。
```

**利用fork和execve运行程序**

像 Unix shell 和 Web 服务器这样程序大量使用了 fork 和 execve 函数

```c
if ((pid = Fork()) == 0)    //创建一个子进程
        { /* Child runs user job */
            if (execve(argv[0], argv, environ) < 0) //在子进程中执行所请求的程序
            {
                // 只有当execve出现错误的时候才会运行到这里
                printf("%s: Command not found.\n", argv[0]);
                exit(0);
            }
        }
```

<div class="page"/>

### 信号

A signal is a small message that notifies a process that an event of some type has occurred in the system

![image-20230710123322548](./assets/image-20230710123322548.png)

信号是一种更高层次的软件形式的异常，它允许进程和内核中断其他进程。

一个信号就是一条消息，它通知进程系统中发生了某件事情。

每一个信号类型所包含的信息只是一个整数id

每种信号类型都对应于某种系统事件。信号可以简单分为两类：

1. 一类信号对应低层的硬件异常，此类异常由内核异常处理程序处理，对用户进程不可见。但是当发生异常，会通过信号通知用户进程发生了异常。
   - 例子：一个进程试图除以 0，内核会发送给他一个 SIGFPE 信号。
2. 一类信号对应于内核或其他用户进程中叫高层的软件事件。
   - 例子：用户按下 Ctrl+C，内核会发送一个 SIGINT 信号给这个前台进程组中的每个进程。一个进程可以通过向另一个进程发送 SIGKILL 信号强制终止它。

![](assets/2023-07-14-01-02-03.png)

#### 信号术语

传送一个信号到目的进程包含两个步骤：
1. 发送信号。内核通过**更新目的进程上下文中的某个状态**，发送一个信号给目的进程。
2. 接收信号。当目的进程被内核强迫以某种方式对信号的发送做出反应时，就接受了信号。进程可以忽略、终止或通过执行一个叫做信号处理程序的用户层函数捕获这个信号。

发送信号有两种原因：
1. 内核检测到一个系统事件，比如除零错误或子进程终止。
2. 一个进程调用了 kill 函数，显式地要求内核发送一个信号给目的进程。一个进程可以发送信号给自己。

**待处理信号**
待处理信号是指发出但没有被接收的信号。

一种类型最多只会有一个待处理信号。如果一个进程已经有一个类型为 k 的待处理信号，接下来发给他的类型为 k 的信号都会直接丢弃。

进程可以有选择地阻塞接收某种信号。当一种信号被阻塞，它仍可以发送，但是产生的待处理信号不会被接收。

一个待处理信号最多只能被接收一次。内核为每个进程在 pending 位向量中维护着待处理信号的集合，在 blocked 位向量中维护着被阻塞的信号集合。

只要传送了一个类型为 k 的信号，内核就会设置 pending 中的第 k 位，只要接收了一个类型为 k 的信号，内核就会清除 pending 中的第 k 位。

#### 发送信号--Kill

**用/bin/kill程序发送信号**

kill 程序向另外的进程发送任意的信号。

> 注意：不要把kill函数理解为 杀死一个进程，虽然确实可以用于杀死一个进程，即信号 9
>
> ```c
> linux> /bin/kill -9 15213      # 发送信号9（SIGKILL）给进程 15213
> linux> /bin/kill -9 -15213     # 发送信号9（SIGKILL）给进程组 15213 中的每个进程
> ```
> 这里面使用的时kill程序的完成路径，linux常用的程序都在这个目录下
> 比如 ls -> /bin/ls 

**用kill函数发送信号**

进程可以通过调用 kill 函数发送信号给其他进程（包括自己）
```c
#include<sys/types.h>
#include<signal.h>

int kill(pid_t pid, int sig);  //若成功则返回 0，若错误则返回 -1
```

|   参数    |               解释                |
| :-------: | :-------------------------------: |
| pid < -1  | 进程组号为 pid绝对值 的所有子进程 |
| pid == -1 |             所有进程              |
| pid == 0  |    同一个进程组中的任何子进程     |
|  pid > 0  |       进程ID等于pid的子进程       |

| 参数  |               解释               |
| :---: | :------------------------------: |
|  sig  | 要发送的信号的序号（见前面的图） |

下面是一个简单的示例，父进程通过发送 `SIGINT` 信号来终止正在无限循环的子进程。
```c
void forkandkill()
{
    pid_t pid[N];
    int i;
    int child_status;
    
    for (i = 0; i < N; i++)
        if ((pid[i] = fork()) == 0)
            while(1) ;  // 死循环
    
    for (i = 0; i < N; i++)
    {
        printf("Killing process %d\n", pid[i]);
        kill(pid[i], SIGINT);
    }
    
    for (i = 0; i < N; i++)
    {
        pid_t wpid = wait(&child_status);
        if (WIFEXITED(child_status))
            printf("Child %d terminated with exit status %d\n",
                    wpid, WEXITSTATUS(child_status));
        else
            printf("Child %d terminated abnormally\n", wpid);
    }
}
```

**从键盘发送信号**

在键盘上输入 Ctrl+C 会导致内核发送一个 SIGINT 信号到前台进程组中的每个进程，默认情况下会终止前台作业。

输入 Ctrl+Z 会发送一个 SIGTSTP 信号到前台进程组中的每个进程，默认情况下会停止（挂起）前台作业。

#### 接收信号--sigint_handler

当内核把进程 p 从内核模式切换到用户模式时（比如从系统调用返回），他会检查进程 p 的未被阻塞的待处理信号的集合。

如果集合为空，内核就将控制传递到 p 的逻辑控制流中的下一条指令；
如果集合非空，内核就选择集合中的某个信号（通常是最小的 k），并强制 p 接收信号 k。

进程 p 收到信号会触发 p 采取某种行为，等进程完成了这个行为，控制就传递回 p 的逻辑控制流中的下一条指令。

所有的上下文切换都是通过调用某个异常处理器(exception handler)完成的，内核会计算对易于某个进程 p 的 pnb 值：`pnb = pending & ~blocked`

- 如果 `pnb == 0`，那么就把控制交给进程 p 的逻辑流中的下一条指令

- 如果
  ```
  pnb != 0
  ```

  - 选择 `pnb` 中最小的非零位 k，并强制进程 p 接收信号 k
  - 接收到信号之后，进程 p 会执行对应的动作
  - 对 `pnb` 中所有的非零位进行这个操作
  - 最后把控制交给进程 p 的逻辑流中的下一条指令


**signal 函数**

进程可以通过 signal 函数修改和信号相关联的默认行为，其中 SIGSTOP 和 SIGKILL 的默认行为不能修改

```c
#include<signal.h>

typedef void (*sighandler_t)(int); 

sighandler_t signal(int signum, sighandler_t handler); 
//若成功返回指向前次处理程序的指针，若出错则返回 SIG_ERR（不设置 errno）。
```

signal 函数接受两个参数：信号值和函数指针，可以通过下列三种方法之一来改变和信号 signum 相关联的行为：
1. 如果 handler 是 SIG_IGN，那么忽略类型为 signum 的信号。SIG_IGN 是 signal.h 中定义的一个宏。
2. 如果 handler 是 SIG_DFL，那么类型为 signum 的信号行为恢复为默认行为。SIG_DEF 是 signal.h 中定义的一个宏。
3. 如果 hanlder 是用户定义的函数的地址，这个函数就被称为信号处理程序。只要进程接收到一个类型为 signum 的信号，就会调用这个程序。通过把处理程序的地址传递到 signal 函数来改变默认行为，这叫做设置信号处理程序。调用信号处理程序被称作捕获信号。执行信号处理程序被称作处理信号。

> 以下是一个关于信号处理程序的例子,
> 把键盘上通过 ctrl+c 传入的信号后产生的结果从停止前台程序改为输出"Caught SIGINT!"
> ```#include "csapp"
>void sigint_handler(int sig)  //定义了一个信号处理程序
>{
>    printf("Caught SIGINT!\n");
>    exit(0);
>}
>int main()
>{
>    /* Install the SIGINT handler */
>    if(signal(SIGINT, sigint_handler)) == SIGERR)
>        unix_error("signal error");
>    pause(); // wait for the receipt of signal
>    return 0;    
>}
>```


**signal的问题**
不同版本的Unix可能有不同的信号处理语义。
1. 一些早期unix系统,在捕获信号后会将动作恢复为默认,所以不得不每次都重新挂载一次。每当处理程序调用,都得通过处理程序自身里调用signal重新挂载它 
2. 某些系统中,当出现慢速系统调用时,比如 read ,内核不会等待数据的到来,它会向磁盘控制器发送请求,然后调度到其他进程去,read只有在数据到达时才会被调用,数据到达时会触发中断. 在有些系统中,如果进程慢系统调用结束前收到了一个信号,内核会中止该系统调用,并系统调用返回一从个错误.在用户的视角来看使用了read调用,它以EINTR返回,即errno == EINTR。
3. 有些系统不会阻止正在处理的类型的信号。

**解决方案--sigaction**

```c
handler_t *Signal(int signum, handler_t *handler)
{
    struct sigaction action, old_action;

    action.sa_handler = handler;
    sigemptyset(&action.sa_mask); /* Block sigs of type being handled */
    action.sa_flags = SA_RESTART; /* Restart syscalls if possible */

    if (sigaction(signum, &action, &old_action) < 0)
        unix_error("Signal error");
    return (old_action.sa_handler);
}
```

#### 阻塞信号

Linux 提供两种阻塞信号的机制：
1. 隐式阻塞机制
    - 内核默认阻塞任何当前处理程序正在处理信号类型的待处理的信号。
    - 当一个信号的处理函数正在执行时，该信号会被系统自动阻塞，直到信号处理函数执行完毕，防止同一个信号的重复处理导致的可能问题。
    - 假设程序捕获了信号s，当前正在运行程序S。如果发送给改进程另一个信号s，那么知道处理程序S返回，s会变成待处理而没被接收
2. 显式阻塞机制。应用程序可以使用 sigprocmask 函数和它的辅助函数，明确地阻塞和解除阻塞选定的信号。

**sigprocmask函数**

```c
#include <signal.h>

int sigpromask(int how, sigset_t *set, sigset_t *oldset);
```

sigprocmask 函数改变当前阻塞的信号集合（blocked 位向量），具体行为依赖 how 的值：
1. SIG_BLOCK：把 set 中的信号**添加**到 blocked 中（blocked = blocked | set）。
2. SIG_UNBLOCK：从 blocked 中**删除** set 中的信号（blocked = blocked & ~set)。
3. SIG_SETMASK：block == set。

如果 oldset 非空，blocked 位向量之前的值保存在 oldset 中。

**其他辅助函数**

```c
#include <signal.h>

int sigemptyset(sigset_t *set);
int sigfillset(sigset_t *set);
int sigaddset(sigset_t *set, int signum);
int sigdelset(segset_t *set, int signum);
```

辅助函数用来对 set 信号集合进行操作：
sigemptyset 初始化 set 为空集合；
sigfillset 把每个信号都添加到 set 中；
sigaddset 把信号 signum 添加到 set 中；
sigdelset 把信号 signum 从 set 中删除。如果 signum 是 set 的成员返回 1，不是返回 0。

**一个临时阻塞 SIGINT 信号的例子**
```c
#include <signal.h>
sigset_t mask, prev_mask;

Sigemptyset(&mask);   // 初始化为空
Sigaddset(&mask, SIGINT);  //将 SIGINT 信号添加到 set 集合中

Sigprocmask(SIG_BLOCK, &mask, &prev_mask);  //阻塞 SIGINT 信号，并把之前的阻塞集合保存到 prev_mask 中。
...                                         //这部分的代码不会被 SIGINT 信号所中断
Sigprocmask(SIG_SETMASK, &prev_mask, NULL); //恢复之前的阻塞信号，取消对 SIGINT 的阻塞

```

<div class="page"/>

### Shell

我们只有一种创建进程的方法--fork

![](assets/2023-07-14-02-54-49.png)

当系统启动的时候，创建了init进程pid == 1 ，系统上的其他进程都是init进程的子进程

init进程启动的时候会创建守护进程`daemons`
守护进程一般是一个长期运行的程序，通常用来提供服务
比如说web server 或其他哪些你希望一直在系统上运行的服务

这是一个链接 [参考文章：Linux 守护进程的启动方法](https://www.ruanyifeng.com/blog/2016/02/linux-daemon.html)


最后会创建登录进程 `login shell`它为用户提供了命令行接口
所以当你登录linux的时候，最后会得到一个`login shell`，他希望你输入命令
比如说输入ls命令，我们其实是在要求shell运行名为ls(位于/bin/ls)的可执行程序，接下来shell会创建一个子进程，在这个子进程里面执行程序


这是一个链接 [参考文章：可执行程序](https://zhuanlan.zhihu.com/p/533635132)


所以shell这个程序和其他的程序没啥区别，他们以用户的身份执行程序
在linux中，默认的shell叫做bash,如今有一个更友好的交互式shell名为 fish

<div class="page"/>

## **参考资料**

**CMU官方资料**
这是一个链接 [参考资料：CMU课程链接](https://www.bilibili.com/video/BV1iW411d7hd/?spm_id_from=333.337.search-card.all.click&vd_source=664d223fe65c6706d11206b7416f5b92)

这是一个链接 [参考资料：shlab要求](http://csapp.cs.cmu.edu/3e/shlab.pdf)

这是一个链接 [参考资料：CMU课程ppt和pdf](http://www.cs.cmu.edu/afs/cs/academic/class/15213-f15/www/schedule.html)

这是一个链接 [参考资料：CMU实验资料下载](http://csapp.cs.cmu.edu/3e/labs.html)

这是一个链接 [参考资料：CMU代码资料下载 如`csapp.h`和`csapp.c`](http://csapp.cs.cmu.edu/3e/code.html)

**其他资料**

这是一个链接 [参考资料：不周山作品集](https://wdxtub.com/work/)

这是一个链接 [参考资料：《深入理解计算机系统（CSAPP）》全书学习笔记（详细）](https://zhuanlan.zhihu.com/p/455061631)

这是一个链接 [参考资料：CSAPP之详解ShellLab（简书）](https://www.jianshu.com/p/43533495d30a)

这是一个链接 [参考资料：shell Lab 实现 CMU 详细讲解 shell(bilibili)](https://www.bilibili.com/video/BV1EF411h791/?spm_id_from=333.999.0.0&vd_source=664d223fe65c6706d11206b7416f5b92)

这是一个链接 [参考资料:深入理解计算机系统 - CSAPP重点导读(bilibili)](https://www.bilibili.com/video/BV1RK4y1R7Kf?p=8&vd_source=664d223fe65c6706d11206b7416f5b92)

这是一个链接 [参考资料：【CSAPP-深入理解计算机系统】8-1. 异常控制流(bilibili)](https://www.bilibili.com/video/BV1xF41147fB/?spm_id_from=333.999.0.0&vd_source=664d223fe65c6706d11206b7416f5b92)


