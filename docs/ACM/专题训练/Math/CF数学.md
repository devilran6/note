---
title: CF数学
description: codeforces 数学 1500-1800
categories:
  - ACM-Math
highlight_shrink: false
mathjax: true
copyright_author: devilran
sticky: 2
toc: true
toc_number: true
abbrlink: aa579273
date: 2023-09-28 00:00:00
copyright_author_href:
copyright_url:
copyright_info:
---

# RWADME



## 1542B

### 题目

- 1 在集合中
- 给定 a 和 b ,如果 x 在集合中,那么 x*a 和 x+b 也在集合里

多组测试 问给定 n, a, b, n是否在集合中

### 思路

观察模数,加 b 不能改变 mod b 的值, 所以 n mod b 出现的模数智能通过 乘a来进行调整.

a(a + (ab + b)) = a^2 + (a^2 + a) * b发现只会只有a^k这一项 mod b != 0



代码 => 找到 (a^k mod b == n mod b && a^k <= n) 最小的k, 如果没有则不存在

注意特判

- a == 1时, a^k <= n 永远不会跳出循环

- b == 1时, 任意数都成立



### code



```cpp
#include <bits/stdc++.h>

#define LL long long
#define ULL unsigned long long
#define x first
#define y second
#define endl "\n"

using namespace std;

typedef pair<int, int> PII;
typedef pair<LL, LL> PLL;

const int INF = 0x3f3f3f3f;

void solve()
{
    LL n, a, b;
    cin >> n >> a >> b;

    LL x = 1;
    bool ok = false;
    if (b == 1)
    {
        ok = true;
    }
    else if (a == 1)
    {
        if (n % b == 1)
            ok = true;
    }
    else
    {
        while (x <= n)
        {
            if (x % b == n % b)
            {
                ok = true;
                break;
            }
            x = x * a;
        }
    }

    if (ok)
        cout << "Yes" << endl;
    else
        cout << "No" << endl;
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0), cout.tie(0);

    int t;
    cin >> t;

    while (t--)
    {
        solve();
    }

    return 0;
}
```



## 1538F

### 题目

给你两个整数 $l$和 $r$，其中 $l \lt r$。我们将在$l$的基础上加上$1$，直到结果等于$r$。因此，正好会进行 $r-l$ 次加法运算。对于每一个这样的加法，让我们来看看在它之后将被改变的位数。

例如

- 如果$l=909$，那么加 1 将导致$910$和$2$位数发生变化；
- 如果在$l=9$后面加 1，结果将是$10$，并且$2$位数字也将改变；
- 如果在$l=489999$后面加 1，结果将是$490000$，$5$位数也将改变。

更改后的位数总是构成以十进制书写的结果的后缀。

如果要从$l$得到$r$，每次加上$1$，则输出更改后的位数总数。



### 思路



将 l ~ r 转化为计算 fun(r) - fun(l)

fun(x) 为计算 1 ~ x 的变换次数

对于 fun(x): 针对每一位进行考虑, 有多少个这个位置的变动就等于把这位变成个位之后有多少个数



### code



```cpp
#include <bits/stdc++.h>

#define LL long long
#define ULL unsigned long long
#define x first
#define y second
#define endl "\n"

using namespace std;

typedef pair<int, int> PII;
typedef pair<LL, LL> PLL;

const int INF = 0x3f3f3f3f;

int fun(int x)
{
    LL res = 0;
    while (x)
    {
        res += x;
        x /= 10;
    }
    return res;
}

void solve()
{
    int l, r;
    cin >> l >> r;

    cout << fun(r) - fun(l) << endl;
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0), cout.tie(0);

    int t;
    cin >> t;

    while (t--)
    {
        solve();
    }
    return 0;
}
```



## 1487D



## 235A



## 1349A


## 1458A

You are given two positive integer sequences $a_1, \ldots, a_n$ and $b_1, \ldots, b_m$. For each $j = 1, \ldots, m$ find the greatest common divisor of $a_1 + b_j, \ldots, a_n + b_j$.

**思路：**

根据 gcd(a, b) = gcd(a, b - a) 来进行化简

gcd(a1 + bj, a2 + bj, ..., an + bj)

= gcd(a1 + bj, a2 - a1, a3 - a1, ... an - a1)

= gcd(a1 + bj, w)

预处理出w即可


```cpp
#include <bits/stdc++.h>

#define LL long long
#define ULL unsigned long long
#define x first
#define y second
#define endl "\n"

using namespace std;

typedef pair<int, int> PII;
typedef pair<LL, LL> PLL;

const int INF = 0x3f3f3f3f;

LL gcd(LL a, LL b)
{
    return !b ? a : gcd(b, a % b);
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0), cout.tie(0);

    int n, m;
    cin >> n >> m;

    vector<LL> a(n + 1), b(m + 1);
    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
    }

    for (int i = 1; i <= m; i++)
    {
        cin >> b[i];
    }

    if (n == 1)
    {
        for (int i = 1; i <= m; i++)
        {
            cout << a[1] + b[i] << ' ';
        }
        cout << endl;
        return 0;
    }

    LL w = a[2] - a[1];
    for (int i = 3; i <= n; i++)
    {
        w = gcd(w, a[i] - a[1]);
    }

    for (int i = 1; i <= m; i++)
    {
        cout << abs(gcd(a[1] + b[i], w)) << ' ';
    }
    cout << endl;

    return 0;
}
```


