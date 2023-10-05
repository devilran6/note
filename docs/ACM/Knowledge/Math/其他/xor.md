## 技巧

- 拆位
- 公式

## 牛客第七场 C Beautiful Sequence

[题目链接](https://ac.nowcoder.com/acm/contest/57361/C)

![](assets/image-20230807195320433.png)

![](assets/2023-10-06-01-38-28.png)

```cpp
#include <bits/stdc++.h>

#define LL long long
#define ULL unsigned long long
#define x first
#define y second

using namespace std;

typedef pair<int, int> PII;
typedef pair<LL, LL> PLL;

const int INF = 0x3f3f3f3f;

void solve()
{
    int n, k;
    cin >> n >> k;

    vector<int> b(n + 1), w(n + 1);
    for (int i = 1; i < n; i++)
    {
        cin >> b[i];
        w[i + 1] = w[i] ^ b[i];
    }

    vector<int> a1(30, -1);
    for (int i = 1; i < n; i++)
    {
        int u = -1;

        for (int j = 29; j >= 0; j--)
            if ((b[i] >> j) & 1)
            {
                u = j;
                break;
            }

        // 当 Bi == 0 的时候直接跳过即可
        if (u == -1)
            continue;
        // ==>  a[i]的第u位为0
        // ==>  a[1]的第u位为t

        int t1 = ((w[i] >> u) & 1) ^ 0;

        if (a1[u] != -1 && a1[u] != t1)
        {
            cout << "-1" << endl;
            return;
        }
        else
            a1[u] = t1;
    }

    // for (int i = 29; i >= 0; i--)
    //     cerr << a1[i] << endl;

    int cnt = 0;
    for (int i = 0; i < a1.size(); i++)
        if (a1[i] == -1)
            cnt++;

    if (pow(2, cnt) < k)
    {
        cout << "-1" << endl;
        return;
    }
    k--;
    while (k)
    {
        int c = k & 1;
        k >>= 1;
        for (int i = 0; i <= 29; i++)
            if (a1[i] == -1)
            {
                a1[i] = c;
                break;
            }
    }

    int ans = 0;
    for (int i = 29; i >= 0; i--)
        if (a1[i] == -1)
            a1[i] = 0;
    for (int i = 29; i >= 0; i--)
        ans = ans * 2 + a1[i];

    cout << ans << " ";
    for (int i = 2; i <= n; i++)
    {
        cout << (ans ^ w[i]) << " \n"[i == n];
    }
    return;
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


## CF1879D Sum of XOR Functions

[题目链接](https://codeforces.com/contest/1879/problem/D)

**题目:**

给你一个长度为 $n$ 的数组 $a$ ，由非负整数组成。

您必须计算 $\sum_{l=1}^{n} \sum_{r=l}^{n} f(l, r) \cdot (r - l + 1)$ 的值，其中 $f(l, r)$ 是 $a_l \oplus a_{l+1} \oplus \dots \oplus a_{r-1} \oplus a_r$（字符 $\oplus$ 表示位向 XOR）。

由于答案可能非常大，因此请打印它的模数 $998244353$。

**思路：**

经典题 

`拆位`

之后存下来

!x（即与 x 相反）的前缀异或和的个数

!x 的前缀异或和的下标之和

因为只有是 !x 这样 这一段 的异或是 x ^ !x = 1 才有贡献

同时注意 因为是前缀异或和 所以 s[a] ^ s[b] 的时候 

计算的是 a+1~b 这一段 长度是 b-a

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
const LL mod = 998244353;

LL s1[30][2], s2[30][2];
// s1[j][!x] 存储了到目前为止，第 j 位为 !x（即与 x 相反）的前缀异或和的个数
// s2[j][!x] 存储了到目前为止，第 j 位为 !x 的前缀异或和的下标之和


int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0), cout.tie(0);

    int n;
    cin >> n;

    vector<int> s(n + 1);
    for (int i = 0; i < n; i++)
    {
        int a;
        cin >> a;
        s[i + 1] = s[i] ^ a;
    }

    LL ans = 0;
    for (int i = 0; i <= n; i++)
        for (int j = 0; j < 30; j++)
        {
            int x = (s[i] >> j) & 1;
            ans = (ans + (i * s1[j][!x] - s2[j][!x]) % mod * (1 << j) % mod) % mod;
            s1[j][x] = (s1[j][x] + 1) % mod;
            s2[j][x] = (s2[j][x] + i) % mod;
        }

    cout << ans << endl;

    return 0;
}
```