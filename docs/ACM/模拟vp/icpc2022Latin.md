# 2022-2023 ACM-ICPC Latin American Regional Programming Contest

[比赛链接](https://codeforces.com/gym/104252)

!!! abstract
    第二道签到题I，上来读假，写假dfs，T飞，幸好在结束前发现bfs妙了


## E. Empty Squares

有意思的题

**题目**：

**思路**：

**code**：

## I. Italian Calzone & Pasta Corner

**题目**：

有一个 n * m ($1 \leq n, m \leq 100$) 的网格，里面的填数是1到 n * m，各不相同。

任意选一个起始位置，可以进行上下左右的移动，可以在走过的位置里任意走。每走到一个之前没走到过的位置，需要这个位置的数比之前走过的所有数都大(对于新走到的地方，呈现递增数列)，问最多走多少格子。

**思路**：

题目上来读错了，如果下一个格子比之前走过的最大值小，是不能走的。

用bfs维护，每次下一步可以走到的地方，之后脑补一下，相当于一个联通的区域每次都在扩张，贪心的想一下，每次都走相邻的最小的一个块是最优的，用小根堆维护一下即可。

如果在讨论一个点a起始的过程中，将点b加入进来了。那么点b肯定是不会当成起点的，因为从b出发的点，从a出发都能到，不优。能进行一点优化。

**code**：

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
const int N = 110;
 
int n, m;
int a[N][N];
 
int dx[] = {1, 0, -1, 0};
int dy[] = {0, 1, 0, -1};
 
int mp[N][N];
bool vis[N][N];
bool st[N][N];
 
int bfs(int x, int y)
{
    memset(st, 0, sizeof st);
 
    priority_queue<pair<int, PII>> q;
    q.push({a[x][y], {x, y}});
    st[x][y] = true;
 
    int cnt = 0;
    while (q.size())
    {
        auto t = q.top();
        int x = t.y.x, y = t.y.y;
        vis[x][y] = true;
        q.pop();
        cnt++;
 
        for (int k = 0; k < 4; k++)
        {
            int xx = x + dx[k], yy = y + dy[k];
            if (xx <= 0 || xx > n || yy <= 0 || yy > m)
                continue;
            if (st[xx][yy])
                continue;
 
            if (a[xx][yy] > a[x][y])
            {
                q.push({a[xx][yy], {xx, yy}});
                st[xx][yy] = true;
            }
        }
    }
 
    return cnt;
}
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0), cout.tie(0);
 
    cin >> n >> m;
    vector<pair<int, PII>> vv(n * m + 1);
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
        {
            cin >> a[i][j];
            vv[(i - 1) * m + j] = {a[i][j], {i, j}};
        }
    sort(vv.begin() + 1, vv.end());
 
    int ans = 0;
    for (int p = 1; p <= n * m; p++)
    {
        int i = vv[p].y.x, j = vv[p].y.y;
        if (vis[i][j])
            continue;
        ans = max(ans, bfs(i, j));
    }
 
    cout << ans << endl;
 
    return 0;
}
```


## L. Lazy Printing

**题目**：

**思路**：

KMP暴力

**code**：

## M. Maze in Bolt

**题目**：

**思路**：

螺母不止旋转，还可以翻转！

**code**：
