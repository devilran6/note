## 1542B Plus and Multiply

**题目**

- 1 在集合中
- 给定 a 和 b ,如果 x 在集合中,那么 x*a 和 x+b 也在集合里

多组测试 问给定 n, a, b, n是否在集合中

**思路:**

观察模数,加 b 不能改变 mod b 的值, 所以 n mod b 出现的模数智能通过 乘a来进行调整.

a(a + (ab + b)) = a^2 + (a^2 + a) * b发现只会只有a^k这一项 mod b != 0



代码 => 找到 (a^k mod b == n mod b && a^k <= n) 最小的k, 如果没有则不存在

注意特判

- a == 1时, a^k <= n 永远不会跳出循环

- b == 1时, 任意数都成立



**code**



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



## 1538F Interesting Function

**题目:**

给你两个整数 $l$和 $r$，其中 $l \lt r$。我们将在$l$的基础上加上$1$，直到结果等于$r$。因此，正好会进行 $r-l$ 次加法运算。对于每一个这样的加法，让我们来看看在它之后将被改变的位数。

例如

- 如果$l=909$，那么加 1 将导致$910$和$2$位数发生变化；
- 如果在$l=9$后面加 1，结果将是$10$，并且$2$位数字也将改变；
- 如果在$l=489999$后面加 1，结果将是$490000$，$5$位数也将改变。

更改后的位数总是构成以十进制书写的结果的后缀。

如果要从$l$得到$r$，每次加上$1$，则输出更改后的位数总数。



**思路:**



将 l ~ r 转化为计算 fun(r) - fun(l)

fun(x) 为计算 1 ~ x 的变换次数

对于 fun(x): 针对每一位进行考虑, 有多少个这个位置的变动就等于把这位变成个位之后有多少个数



**code**



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


## 1458A Row GCD

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


## 1397B Power Sequence

**题目:**

有一个长度为n的序列,可以重新排序，可以花费1使得其中一个元素加一或者减一。

使得排完序后的序列 满足 $a_i = c^i$ 其中c是一个正整数

**思路：**

如果n比较大，c也比较大，又因为最开始的$a_i \in [1, 1e9]$,所以估计一下，这个的花费小于所有数都变为1的花费, $\sum{(a_i-1)}$

同时,因为 $n \geq 3$ 所以c最多为 $\sqrt{1e9} \approx 1e5$,枚举c从1到1e5即可.

乍一看 超时了,可是 n 只要一大, c 必然不会大,所以肯定跑不满

**code**

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

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0), cout.tie(0);

    int n;
    cin >> n;

    vector<int> a(n);
    for (int i = 0; i < n; i++)
    {
        cin >> a[i];
    }

    sort(a.begin(), a.end());

    LL ans = 1E18;
    for (LL i = 1; i <= 100000; i++)
    {
        LL res = 0;
        bool ok = true;
        for (LL j = 0, w = 1; j < n; j++, w *= i)
        {
            res += 1ll * abs(a[j] - w);
            if (res >= ans)
            {
                ok = false;
                break;
            }
        }

        if (i != 1 && !ok)
        {
            break;
        }
        else
        {
            ans = res;
        }
    }

    cout << ans << endl;
    return 0;
}
```

## 1514C Product 1 Modulo N

**题目:**

从集合{1, 2, ... n - 1}这个序列中选出最长子序列,使得选出的数乘起来模n为1

**思路:**

我们假设选出了x,其他的数乘起来为q, 则有

$$
x * q \equiv 1 \quad (\mod{n}) \\
% x \equiv inv(q) \quad (\mod{n}) \\
$$

这个式子等价于

$$
k_1 * x + k_2 * n = 1
$$

这个式子成立的条件是 gcd(x, n) == 1 (exgcd)

所以我们知道可能在最后的最长子序列中的数,其与n的gcd都为1

我们将这数相乘之后 mod n之后得到一个 w,我们知道每个数都是和n互质的,所以w也和n是互质的.

如果 w != 1,就将集合中的w这个数去掉即可.

**code**

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

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0), cout.tie(0);

    int n;
    cin >> n;
    vector<int> v;

    LL w = 1;
    for (int i = 1; i <= n; i++)
    {
        if (gcd(i, n) == 1)
        {
            v.push_back(i);
            w = w * i % n;
        }
    }

    if (w != 1)
    {
        cout << v.size() - 1 << endl;
        for (int i = 0; i < v.size(); i++)
            if (v[i] != w)
            {
                cout << v[i] << ' ';
            }
        cout << endl;
    }
    else
    {
        cout << v.size() << endl;
        for (int i = 0; i < v.size(); i++)
        {
            cout << v[i] << ' ';
        }
        cout << endl;
    }

    return 0;
}
```


## 1342C Yet Another Counting Problem

**题目：**

给你两个整数 $a$ 和 $b$ 以及 $q$ 个查询。$i$\-th查询由两个数字$l_i$和$r_i$组成，其答案是有多少个整数$x$使得$l_i \le x \le r_i$和$((x \bmod a) \bmod b) \ne ((x \bmod b) \bmod a)$。计算每个查询的答案。

输入

第一行包含一个整数 $t$ ($1 \le t \le 100$) - 测试用例的数量。然后是测试用例。

每个测试用例的第一行包含三个整数 $a$、$b$ 和 $q$ ($1 \le a, b \le 200$; $1 \le q \le 500$)。

然后是$q$行，每行包含两个整数$l_i$和$r_i$。($1 \le l_i \le r_i \le 10^{18}$) 的整数。

**思路：**

发现a和b都很小，只有200。

因为是模a后再模b，所以是lca(a, b)的多余量一定会被模掉。

所以我们可以预处理出来 $1 \sim a * b$ 的情况的前缀和

之后分别计算 l - 1 和 r, 结果为 f(r) - f(l - 1)，就可以了

**code**

```cpp
#include <bits/stdc++.h>

#define LL long long
#define ULL unsigned long long
#define x first
#define y second
#define endl "\n"
#define int long long

using namespace std;

typedef pair<int, int> PII;
typedef pair<LL, LL> PLL;

const int INF = 0x3f3f3f3f;

void solve()
{
    int a, b, q;
    cin >> a >> b >> q;

    vector<LL> sum(a * b + 10, 0);
    for (int x = 1; x <= a * b; x++)
    {
        if (x % a % b != x % b % a)
            sum[x]++;
    }

    for (int i = 1; i < sum.size(); i++)
        sum[i] += sum[i - 1];

    while (q--)
    {
        LL l, r;
        cin >> l >> r;

        int sl = ((l - 1) / (a * b)) * sum[a * b] + sum[(l - 1) % (a * b)];
        int sr = (r / (a * b)) * sum[a * b] + sum[r % (a * b)];
        cout << sr - sl << ' ';
    }

    cout << endl;
}

signed main()
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