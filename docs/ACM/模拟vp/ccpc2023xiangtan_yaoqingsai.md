
[整场题目链接](https://codeforces.com/gym/104396)


## E. LCM Plus GCD
[题目链接](https://codeforces.com/gym/104396/problem/E)

**题意：**

输入x和k，求集合大小为k的方案数，集合中为$a_1, a_2, \cdots, a_k$各不相同的正整数，所有数的lcm+gcd=x

数据范围 1<= x,k <=1E9

**思路：**

首先，容易知道 lcm是gcd的倍数

设gcd = g, lcm = A * g

=> A * g + g = x

=> (A + 1) * g = x

即g是x的因数，故枚举g

考虑对每一个质因子, $p^{g_p}$是gcd中的系数, $p^{l_p}$是lcm中的系数

对于$a_1, a_2, \cdots, a_k$中的每一个数的质因子p的次方$k_i$

都需要满足 $g_p <= k_i <= l_p$

同时需要满足存在至少有一个$k_i$取到了$g_p$和$l_p$

- 考虑容斥

我们很好求得满足每个质数都 $g_p <= k_i <= l_p$ 的种类数

相当于一共能够造出 $S = \prod_{i = 1}^{不同的质因子个数}{l_p - g_p + 1}$ 个不同大小的数

之后 $C[S][K]$ 即可 (通过逆元阶乘来求组合数O(n))

一共有2m个约束条件(通过容斥来去除违反约束条件的情况)

取 $g_p <= k_i$ 还是 $g_p + 1 <= k_i$ (即没取到下界gcd的 == 违反限制条件)

取 $k_i <= l_p$ 还是 $k_i <= l_p + 1$ (即没取到上界lca的 == 违反限制条件)



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

const int INF = 0x3f3f3f3f, mod = 1e9 + 7, M = 1e6 + 10;

int fa[M], infa[M];

int qmi(int a, int k, int p = mod)
{
    int res = 1;
    while (k)
    {
        if (k & 1)
            res = res * a % p;
        a = a * a % p;
        k >>= 1;
    }
    return res;
}

void init(int n)
{
    fa[0] = infa[0] = 1;
    for (int i = 1; i <= n; i++)
    {
        fa[i] = fa[i - 1] * i % mod;
        infa[i] = infa[i - 1] * qmi(i, mod - 2) % mod;
    }
}

int C(int a, int b)
{
    if (a < b)
        return 0;

    int res = fa[a] * infa[a - b] % mod * infa[b] % mod;
    return res;
}

signed main()
{
    ios::sync_with_stdio(false);
    cin.tie(0), cout.tie(0);

    init(M - 1);

    int x, K;
    cin >> x >> K;

    vector<int> v;
    for (int i = 1; i <= x / i; i++)
        if (x % i == 0)
        {
            v.push_back(i);
            if (i != x / i)
                v.push_back(x / i);
        }

    int ans = 0;
    for (int i = 0; i < v.size(); i++)
    {
        int g = v[i];
        int lcm = x - g;
        if (lcm < g)
            continue;

        vector<PII> vl;
        for (int j = 2; j <= lcm / j; j++)
            if (lcm % j == 0)
            {
                int s = 0;
                while (lcm % j == 0)
                {
                    s++;
                    lcm /= j;
                }
                vl.push_back({j, s});
            }
        if (lcm > 1)
        {
            vl.push_back({lcm, 1});
        }
        vector<PII> vg(vl.size());
        for (int j = 0; j < vl.size(); j++)
        {
            int s = 0;
            int p = vl[j].x;
            if (g % p == 0)
            {
                while (g % p == 0)
                {
                    s++;
                    g /= p;
                }
            }
            vg[j].x = p;
            vg[j].y = s;
        }

        vector<int> vv;
        for (int j = 0; j < vl.size(); j++)
        {
            int len = vl[j].y - vg[j].y + 1;
            if (len >= 2)
            {
                vv.push_back(len);
            }
        }

        int m = vv.size();
        for (int j = 0; j < (1 << m); j++)
        {
            for (int k = 0; k < (1 << m); k++)
            {
                int res = 1, st = 1;
                for (int h = 0; h < m; h++)
                {
                    int w = vv[h];
                    if ((j >> h) & 1)
                    {
                        st *= -1;
                        w--;
                    }
                    if ((k >> h) & 1)
                    {
                        st *= -1;
                        w--;
                    }
                    res = res * w % mod;
                }

                if (st == 1)
                {
                    ans = (ans + C(res, K)) % mod;
                }
                else
                {
                    ans = ((ans - C(res, K)) % mod + mod) % mod;
                }
            }
        }
    }

    cout << (ans % mod + mod) % mod << endl;

    return 0;
}
```
