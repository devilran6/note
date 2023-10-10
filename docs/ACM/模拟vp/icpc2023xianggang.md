!!! abstract 
    这把演了，过完第二道签到后，难度第四的题没给秒了，想法出来了，之后因为边界条件一直wa2，后来修改完后才发现时间复杂度上不太对劲，T了，之后人就傻了。


## K. Maximum GCD

**题目：**

格莱美有一个长度为 $n$ 的数组。她最近学习了最大公约数（GCD）的概念。回想一下，数组的 GCD 是数组中每个元素都能被 $d$ 整除的最大整数 $d$。格莱美认为数组的 GCD 应该越大越好，这样数组才会漂亮。

你想帮助格莱美让她的数组变得漂亮，因此决定对数组中的每个元素进行一些（可能为零）模运算。换句话说，每次运算时，你都可以在数组中选择一个数字 $a_i$ ($1 \leq i \leq n$)，再选择一个整数 $x$，然后用 $(a_i\bmod x)$ 代替 $a_i$。由于格莱美不希望$0$出现在数组中，因此不能通过模运算将$a_i$改为$0$。

现在，你的任务是计算数组经过几次（可能是零）模运算后的最大 GCD。

**思路：**

思考一下，整道题目可以转化为：

给一个长度为n的序列，对于每个数 x 可以不变，也可以变成 $[1, \frac{x}{2})$，变化之后需要序列中的每个数大小相等，求这个想等的数的最大值。

做法上，除了最小值，每个数必然需要变成 $[1, \frac{x}{2})$，所以维护一下除了最小数的其他数，的 $min \frac{x_i}{2}$，之后再将这个维护的值与最小值做一下比较即可。

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

signed main()
{
    ios::sync_with_stdio(false);
    cin.tie(0), cout.tie(0);

    int n;
    cin >> n;

    vector<int> a(n + 1);
    int m = 1e18;
    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
        m = min(m, a[i]);
    }

    int x = -1;
    int minv = 1e18;
    for (int i = 1; i <= n; i++)
        if (a[i] != m)
        {
            int t = a[i] / 2;
            minv = min(minv, a[i] / 2);
        }

    int ans = 0;
    if (minv >= m)
    {
        ans = m;
    }
    else
    {
        ans = min(m / 2, minv);
    }

    if (ans == 0)
        ans = 1;

    cout << ans << endl;

    return 0;
}
```

## L Permutation Compression

**题目：**

给两个数组分别长度为n和m，有k个道具 $(1 \le n, m, k \le 2e5， m \le n)$。

其中第一个数组是一个n的全排列，m是n的全排列去除一些数后得到的。所以保证了每个数组其中的数互不相同，且小于等于n。

对于每个道具，将会提供一个长度l，表示可以选取一个长度为l的区间，删除这个区间中的最大值。

**思路：**

注意题目，每次区间必须严格小于l，如果只剩下3个数，有一个长度为4的道具，那么这个道具是不能使用的。

长度越长的道具越烂，长度越短的越好，如果长度为1，代表想删哪个删哪个。

再删除的过程当中，如果要删除位置为i的数，我们可以想这个 i 的两个方向进行扩张，如果碰到大于`a[i]`，则停止扩张，这样我们可以得到一个区间，这个区间我们任意选长度都可以,使用道具，只需要满足 $区间长度 \ge 道具$，就可以使用这个道具。

我们发现，如果存在大于我当前要删的数，这个比当前大的数会限制我删除当前的数的道具使用。所以不妨我们从最大的数开始删，逐渐变小，这样不就不产生影响啦。

但是我们不要忘记，b数组中的数是不能被删除的，并且我们需要记录下来有哪些b数组中的数会影响我删除当前的数。

我们可以通过一个set来存储b中的比当前的数大的数，因为是从大到小考虑的，所以我在从大到小的过程中，把遇到的b中的数的**下标**存到set里，我就有了所有有限制的下标的集合，之后把当前数的下标放进去做一个二分即可。

我们找到限制之后，要求出这两个下标间剩余数的个数，之后从最烂的道具开始遍历就好，如果每一个道具都无法用来删除当前的数，那么代表 NO

关于维护区间的和以及支持修改，采取树状数组即可，把两个操作都平均成 $O(log(n))$


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

struct BIT
{
    int n;
    vector<int> a;

    BIT(int n = 0)
    {
        init(n);
    }

    void init(int n)
    {
        this->n = n;
        a.assign(n + 1, 0);
    }

    int lowbit(int x)
    {
        return x & -x;
    }

    void add(int x, int c)
    {
        for (int i = x; i <= n; i += lowbit(i))
            a[i] += c;
    }

    int sum(int x)
    {
        int res = 0;
        for (int i = x; i; i -= lowbit(i))
            res += a[i];
        return res;
    }

    int rangeSum(int l, int r)
    {
        return sum(r) - sum(l);
    }
};

void solve()
{
    int n, m, k;
    cin >> n >> m >> k;

    vector<int> a(n + 10), b(m + 10), pos(n + 10);
    vector<bool> st(n + 10, 0);
    multiset<int> mp;

    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
        pos[a[i]] = i;
    }
    for (int i = 1; i <= m; i++)
    {
        cin >> b[i];
        st[b[i]] = true;
    }
    for (int i = 1; i <= k; i++)
    {
        int t;
        cin >> t;
        mp.insert(t);
    }

    for (int i = 1, j = 1; i <= m; ++i)
    {
        while (j <= n && a[j] != b[i])
            j++;
        if (j > n)
        {
            cout << "NO" << endl;
            return;
        }
    }

    BIT bit(n + 10);
    for (int i = 1; i <= n; i++)
        bit.add(i, 1);

    set<int> s;
    s.insert(0), s.insert(n + 1);
    for (int i = n; i >= 1; i--)
    {
        if (st[i])
        {
            s.insert(pos[i]);
            continue;
        }

        auto it = s.lower_bound(pos[i]);
        int l = *(prev(it)), r = *it;
        int len = bit.rangeSum(l, r - 1);
        bit.add(pos[i], -1);

        auto it2 = mp.upper_bound(len);
        if (it2 == mp.begin())
        {
            cout << "NO" << endl;
            return;
        }
        mp.erase(--it2);
    }

    cout << "YES" << endl;
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