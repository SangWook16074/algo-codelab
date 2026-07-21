# 9. DFS / BFS

그래프·격자를 탐색하는 두 기본기입니다. **DFS는 깊이 우선(스택/재귀)**, **BFS는 너비 우선(큐)**. 1주차 자료구조에서 배운 스택·큐가 여기서 실제로 쓰입니다. 미로에서 갈림길을 만났을 때, **"일단 한 방향으로 끝까지 파고들었다가 막히면 되돌아오기"** 가 DFS, **"모든 갈림길을 한 걸음씩 공평하게 넓혀가기"** 가 BFS예요.

이 한 챕터에서 배우는 것:
- 그래프를 코드로 표현하는 법 (**인접 리스트**)
- **DFS**를 재귀와 스택 두 가지로 구현하기
- **BFS**를 큐(`deque`)로 구현하기, 그리고 **방문 체크(visited)** 의 중요성
- **격자(2차원 배열)** 에서 상하좌우를 `dx/dy`로 훑는 법
- 최단거리 문제는 왜 **BFS**여야 하는지

## 그래프를 어떻게 저장하지? (인접 리스트)

그래프는 **노드(정점)** 와 그것을 잇는 **간선** 으로 이뤄집니다. "1은 2, 3과 연결, 2는 4와 연결..." 이런 연결 정보를 코드로 담아야 하는데, 가장 흔한 방법이 **인접 리스트**입니다. 각 노드마다 "나랑 직접 연결된 노드 목록"을 들고 있는 거죠.

```python
# 노드 0~5, 아래 그림 같은 무방향 그래프
graph = [
    [1, 2],     # 0번과 연결된 노드
    [0, 3, 4],  # 1번과 연결된 노드
    [0, 4],     # 2번
    [1, 5],     # 3번
    [1, 2, 5],  # 4번
    [3, 4],     # 5번
]

print(graph[1])   # [0, 3, 4]  ← 1번 노드의 이웃들
```

이렇게 리스트의 리스트로 두면 `graph[노드]`로 이웃 목록을 즉시 꺼낼 수 있습니다. (자료구조 챕터의 [2차원 배열](../data-structure/11-2d-array.md) 감각이 그대로 쓰여요.)

<svg viewBox="0 0 340 200" width="340" style="max-width:100%;height:auto;display:block;margin:1.5em auto;" fill="none" stroke="currentColor" stroke-width="2">
  <line x1="60" y1="40" x2="60" y2="100"/>
  <line x1="60" y1="40" x2="150" y2="40"/>
  <line x1="60" y1="100" x2="150" y2="160"/>
  <line x1="150" y1="40" x2="150" y2="160"/>
  <line x1="150" y1="40" x2="240" y2="100"/>
  <line x1="150" y1="160" x2="280" y2="160"/>
  <line x1="240" y1="100" x2="280" y2="160"/>
  <circle cx="60" cy="40" r="18" fill="none"/>
  <circle cx="150" cy="40" r="18" fill="none"/>
  <circle cx="60" cy="100" r="18" fill="none"/>
  <circle cx="150" cy="160" r="18" fill="none"/>
  <circle cx="240" cy="100" r="18" fill="none"/>
  <circle cx="280" cy="160" r="18" fill="none"/>
  <g stroke="none" fill="currentColor" font-size="15" text-anchor="middle" font-family="sans-serif">
    <text x="60" y="45">0</text>
    <text x="150" y="45">1</text>
    <text x="60" y="105">2</text>
    <text x="150" y="165">3</text>
    <text x="240" y="105">4</text>
    <text x="280" y="165">5</text>
  </g>
</svg>

> 💡 노드가 아주 많고 간선이 적으면(희소 그래프) 인접 리스트가 메모리를 아낍니다. `graph[i]`에 이웃만 담으니까요. 코딩테스트에서 그래프는 거의 인접 리스트로 표현한다고 봐도 됩니다.

## DFS: 깊이 우선 탐색 (재귀)

DFS는 **"한 방향으로 갈 수 있는 데까지 파고들고, 막히면 되돌아온다"** 입니다. 이 "되돌아오기"가 곧 **스택** 동작인데, 재귀 함수는 내부적으로 호출 스택을 쓰므로 재귀로 짜면 가장 간결합니다.

핵심은 **방문 체크(visited)**. 안 그러면 A→B→A→B... 무한 루프에 빠져요.

```python
graph = [[1, 2], [0, 3, 4], [0, 4], [1, 5], [1, 2, 5], [3, 4]]

def dfs(node, visited):
    visited[node] = True
    print(node, end=' ')          # 방문 순서 출력
    for nxt in graph[node]:       # 이웃을 하나씩
        if not visited[nxt]:      # 아직 안 갔으면
            dfs(nxt, visited)     # 그쪽으로 파고든다

visited = [False] * 6
dfs(0, visited)                   # 0 1 3 5 4 2
print()
```

`0`에서 시작해 `1`로 내려가고, `1`의 첫 이웃 `3`으로, `3`의 이웃 `5`로... 막다른 곳까지 갔다가 돌아 나오며 나머지를 훑습니다. 그래서 출력이 `0 1 3 5 4 2`예요.

> 💡 `visited`를 **set**으로 써도 됩니다(`visited = set()`, `visited.add(node)`, `if nxt not in visited`). 리스트 인덱스가 곧 노드 번호일 때는 불리언 배열이, 노드가 문자열이거나 번호가 띄엄띄엄일 때는 set이 편해요. [소수 챕터](01-prime.md)에서 `set`으로 포함 여부를 O(1)에 확인하던 그 감각입니다.

## DFS를 스택으로 (재귀 없이)

재귀는 노드가 수만 개면 **재귀 깊이 초과(RecursionError)** 가 날 수 있습니다. 그럴 땐 [스택](../data-structure/01-stack.md)을 직접 써서 똑같이 구현합니다. 재귀가 하던 "되돌아오기"를 스택의 `pop`이 대신하는 거죠.

```python
graph = [[1, 2], [0, 3, 4], [0, 4], [1, 5], [1, 2, 5], [3, 4]]

def dfs_stack(start):
    visited = [False] * 6
    stack = [start]
    while stack:
        node = stack.pop()        # 가장 최근에 넣은 것부터 (LIFO)
        if visited[node]:
            continue
        visited[node] = True
        print(node, end=' ')
        for nxt in graph[node]:
            if not visited[nxt]:
                stack.append(nxt)

dfs_stack(0)                       # 0 2 4 5 3 1
print()
```

방문 순서가 재귀 버전과 조금 다른데(`0 2 4 5 3 1`), 스택은 나중에 넣은 이웃을 먼저 꺼내기 때문입니다. **어느 쪽이든 "모든 노드를 깊이 우선으로 방문"** 한다는 본질은 같아요. 순서 자체가 중요한 문제가 아니라면 신경 쓸 필요 없습니다.

## BFS: 너비 우선 탐색 (큐)

BFS는 **"현재 위치에서 한 걸음 거리의 노드를 전부 방문하고, 그다음 두 걸음 거리를..."** 처럼 물결이 퍼지듯 넓혀갑니다. 먼저 발견한 노드를 먼저 처리해야 하니 **[큐](../data-structure/02-queue.md)** 가 필요하고, 파이썬에선 [`deque`](../data-structure/03-deque.md)를 씁니다.

> 💡 큐를 그냥 리스트로 만들어 `list.pop(0)`으로 앞을 빼면 O(n)이라 느립니다. `collections.deque`의 `popleft()`는 O(1)이에요. **BFS = deque**, 공식처럼 외우세요.

```python
from collections import deque

graph = [[1, 2], [0, 3, 4], [0, 4], [1, 5], [1, 2, 5], [3, 4]]

def bfs(start):
    visited = [False] * 6
    q = deque([start])
    visited[start] = True         # 큐에 넣는 순간 방문 처리!
    while q:
        node = q.popleft()        # 먼저 들어온 것부터 (FIFO)
        print(node, end=' ')
        for nxt in graph[node]:
            if not visited[nxt]:
                visited[nxt] = True
                q.append(nxt)

bfs(0)                             # 0 1 2 3 4 5
print()
```

`0`과 가까운 순서대로 `0 → (1,2) → (3,4) → 5`. 거리별로 차곡차곡 나오죠.

> 💡 **방문 처리는 큐에 "넣을 때"** 하세요. 꺼낼 때 처리하면, 같은 노드가 큐에 여러 번 들어가 중복 방문·비효율이 생깁니다. 위 코드처럼 `append` 직전에 `visited[nxt] = True`를 반드시 함께 두세요.

## 격자에서의 탐색 (dx / dy)

코딩테스트 단골은 그래프가 아니라 **2차원 격자**입니다. "지도에서 이어진 땅 덩어리 세기", "미로 최단 경로" 같은 거요. 격자에서는 각 칸이 노드이고, **상하좌우 인접 칸**이 간선입니다. 이 상하좌우를 매번 쓰기 번거로우니 **방향 배열 `dx`, `dy`** 로 처리합니다.

```python
dx = [-1, 1, 0, 0]   # 상, 하, 좌, 우 의 행(row) 변화
dy = [0, 0, -1, 1]   #                    열(col) 변화

grid = [
    [1, 1, 0, 0],
    [0, 1, 0, 1],
    [0, 0, 0, 1],
    [1, 0, 1, 1],
]
n, m = len(grid), len(grid[0])
x, y = 1, 1                       # (행 1, 열 1) 칸 기준
for d in range(4):
    nx, ny = x + dx[d], y + dy[d]
    if 0 <= nx < n and 0 <= ny < m:   # 격자 밖으로 나가지 않도록!
        print((nx, ny), grid[nx][ny])
# (0, 1) 1
# (2, 1) 0
# (1, 0) 0
# (1, 2) 0
```

`0 <= nx < n and 0 <= ny < m` 이 **경계 검사**가 격자 문제의 생명입니다. 빠뜨리면 `IndexError`가 나거나 음수 인덱스로 반대편을 잘못 참조해요.

### 섬(덩어리) 개수 세기: DFS 활용

`1`로 이어진 땅 덩어리가 몇 개인지 세봅시다. **아직 안 밟은 `1`을 만나면 거기서 DFS로 연결된 땅을 전부 `0`으로 지우고, 지운 횟수를 셉니다.**

```python
def count_islands(grid):
    n, m = len(grid), len(grid[0])
    dx = [-1, 1, 0, 0]
    dy = [0, 0, -1, 1]

    def dfs(x, y):
        grid[x][y] = 0                 # 방문 표시 = 물로 만들기
        for d in range(4):
            nx, ny = x + dx[d], y + dy[d]
            if 0 <= nx < n and 0 <= ny < m and grid[nx][ny] == 1:
                dfs(nx, ny)

    count = 0
    for i in range(n):
        for j in range(m):
            if grid[i][j] == 1:        # 새로운 땅을 발견하면
                dfs(i, j)              # 그 덩어리 전체를 지우고
                count += 1             # 섬 하나로 카운트
    return count

grid = [
    [1, 1, 0, 0],
    [0, 1, 0, 1],
    [0, 0, 0, 1],
    [1, 0, 1, 1],
]
print(count_islands(grid))   # 3
```

왼쪽 위 `1` 덩어리, 오른쪽 `1` 덩어리, 왼쪽 아래 외딴 `1` — 총 **3개**입니다.

## 최단거리는 왜 BFS인가?

미로에서 시작점부터 도착점까지 **최소 몇 칸** 만에 가는지 구한다고 합시다. 답은 **BFS**입니다. 왜냐하면 BFS는 **가까운 칸부터 물결처럼 퍼지므로, 어떤 칸에 처음 도달했을 때가 곧 최단거리** 이기 때문이에요. (모든 이동 비용이 1로 같을 때 성립합니다.)

DFS로 하면 한 방향으로 깊이 파고들다 우연히 도착점에 먼저 닿아도 그게 최단이라는 보장이 없어요. 그래서 거리를 재는 문제는 BFS입니다.

```python
from collections import deque

def maze_shortest(grid):
    n, m = len(grid), len(grid[0])
    dx = [-1, 1, 0, 0]
    dy = [0, 0, -1, 1]
    dist = [[-1] * m for _ in range(n)]   # -1 = 아직 미방문

    q = deque([(0, 0)])
    dist[0][0] = 1                        # 시작 칸도 1칸으로 셈
    while q:
        x, y = q.popleft()
        for d in range(4):
            nx, ny = x + dx[d], y + dy[d]
            if 0 <= nx < n and 0 <= ny < m and grid[nx][ny] == 1 and dist[nx][ny] == -1:
                dist[nx][ny] = dist[x][y] + 1   # 한 칸 더!
                q.append((nx, ny))
    return dist[n - 1][m - 1]

grid = [
    [1, 0, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
]
print(maze_shortest(grid))   # 13
```

`dist` 배열이 **방문 체크와 거리 기록을 동시에** 합니다(`-1`이면 미방문). 도착 칸의 값이 곧 최단 칸 수예요.

> 💡 이 문제의 시간복잡도는 **O(V + E)** (노드 수 + 간선 수). 격자라면 칸이 `n×m`개, 각 칸에서 상하좌우 4번 보므로 대략 **O(n·m)** 입니다. DFS든 BFS든 "모든 노드·간선을 한 번씩 훑는" 비용은 같아요. [복잡도 챕터](../complexity/)의 "1초 ≈ 1억 번" 기준으로, 칸이 100만 개여도 여유입니다.

## 정리

| 구분 | DFS | BFS |
| --- | --- | --- |
| 순서 | 깊이 우선 (끝까지 파고듦) | 너비 우선 (가까운 것부터) |
| 자료구조 | 스택 (또는 재귀) | 큐 (`deque`) |
| 방문 처리 시점 | 방문하는 순간 | **큐에 넣을 때** |
| 최단거리 | 보장 안 됨 | **보장됨** (비용 1일 때) |
| 시간복잡도 | O(V + E) | O(V + E) |

> 💡 판단 기준은 간단해요. **"최단거리/최소 횟수"면 BFS**, 그냥 **"연결된 것 전부 방문/덩어리 세기/경로 존재 여부"면 DFS든 BFS든** 편한 걸로. 격자 문제는 `dx/dy`와 경계 검사, 방문 체크 이 세 가지가 뼈대입니다.

## 직접 풀어보기

1. 위 `graph`에서 `dfs`와 `bfs`를 노드 `3`에서 시작하도록 바꿔 방문 순서를 출력해보세요. (힌트: `visited` 초기화를 잊지 마세요.)
2. `count_islands`를 **DFS 대신 BFS(`deque`)로** 다시 짜보세요. 결과(3)는 같아야 합니다. (힌트: 재귀 `dfs` 자리에 큐 반복문을 넣으면 됩니다.)
3. `maze_shortest`에서 도착 칸에 **닿을 수 없는 미로**(벽으로 막힘)를 만들면 무엇이 반환될까요? 확인하고, 그럴 때 `-1`(도달 불가)을 그대로 돌려주는지 점검해보세요. (정답: 미방문이라 `dist`가 `-1`로 남아 그대로 반환됩니다.)
