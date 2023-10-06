!!! abstract
    和DP有关的题目练习合集

## CF366C Dima and Salad

[题目链接](https://codeforces.com/problemset/problem/366/C)

**题目：**

有两个长度为n($1 \leq n \leq 100$)的整数序列 $a = [a_1, a_2, .. a_n], b = [b_1, b_2, .. b_n]$, 其中 $1 \leq a_i, b_i \leq 100$, 还有一个整数k ($1 \leq k \leq 10$).

从中选出来m个下标，使得满足

$$
\frac{\sum_{j=1}^m{a_j}}{\sum_{j=1}^m{b_j}} = k
$$

求最大的$\sum_{j=1}^m{a_j}$, 否则输出-1

**思路：**

$$
\begin{align}
& \frac{\sum_{j=1}^m{a_j}}{\sum_{j=1}^m{b_j}} = k \\
\Rightarrow&  \sum_{j=1}^m{a_j} = k * \sum_{j=1}^m{b_j} \\
\Rightarrow&  \sum_{j=1}^m{a_j} = \sum_{j=1}^m{k * b_j} \\
\Rightarrow&  \sum_{j=1}^m{(a_j - k * b_j)} = 0 \\
\end{align}
$$

问题转化为: 从n个物体中选一些物品, 每个物品的体积是 $a_i - k * b_i$, 每个物品的价值是 $a_i$. 求总体积为0的最大价值为多少

即01背包

其中通过增加偏移量来解决体积为负的问题, 大小为 $B = k * max(b_i) * n$


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

    int n, k;
    cin >> n >> k;
    vector<int> a(n + 1), b(n + 1);

    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
    }

    for (int i = 1; i <= n; i++)
    {
        cin >> b[i];
    }

    int B = 10 * 100 * 100;
    vector<int> v(n + 1), w(n + 1), f(2 * B + 10, -INF);
    for (int i = 1; i <= n; i++)
    {
        v[i] = a[i] - k * b[i];
        w[i] = a[i];
    }

    f[0 + B] = 0;
    for (int i = 1; i <= n; i++)
    {
        auto tmp = f;
        for (int j = -B; j <= B; j++)
            if (0 <= j + v[i] + B && j + v[i] + B <= 2 * B)
            {
                tmp[j + B] = max(tmp[j + B], f[j + v[i] + B] + w[i]);
            }
        f = tmp;
    }

    cout << (f[0 + B] <= 0 ? -1 : f[0 + B]) << endl;
    return 0;
}
```