# 2. 큐 (queue)

스택이 "나중에 넣은 걸 먼저 꺼내는" 구조였다면, 큐는 정반대입니다.

큐의 규칙: **먼저 넣은 걸 먼저 꺼낸다 (FIFO, First In First Out).**

이 한 챕터에서 배우는 것:
- 큐가 뭔지, 왜 스택과 반대인지
- 리스트로 큐를 흉내 내면 **왜 느린지**, 그래서 `deque`를 쓰는 이유
- 큐가 딱 맞는 대표 상황 — **대기열**, 그리고 나중에 배울 **BFS**

## 큐가 뭔가요?

**줄 서기**를 떠올리면 됩니다. 매표소 줄에 먼저 선 사람이 먼저 표를 사고 나갑니다. 새로 온 사람은 **맨 뒤**에 서고, 나가는 사람은 **맨 앞**에서 나가죠.

이렇게 **뒤로 넣고 앞으로 빼는** 구조가 큐입니다.

- **enqueue** : 맨 뒤에 하나 넣기
- **dequeue** : 맨 앞에서 하나 꺼내기

<svg viewBox="0 0 440 150" width="440" style="max-width:100%;height:auto;display:block;margin:1.5em auto;" fill="none" stroke="currentColor" stroke-width="2" font-family="sans-serif">
  <!-- 큐 칸들 -->
  <rect x="95"  y="55" width="60" height="40" rx="4"/>
  <rect x="165" y="55" width="60" height="40" rx="4"/>
  <rect x="235" y="55" width="60" height="40" rx="4"/>
  <rect x="305" y="55" width="60" height="40" rx="4"/>
  <text x="125" y="80" font-size="15" text-anchor="middle" stroke="none" fill="currentColor">1</text>
  <text x="195" y="80" font-size="15" text-anchor="middle" stroke="none" fill="currentColor">2</text>
  <text x="265" y="80" font-size="15" text-anchor="middle" stroke="none" fill="currentColor">3</text>
  <text x="335" y="80" font-size="15" text-anchor="middle" stroke="none" fill="currentColor">4</text>
  <!-- dequeue: 왼쪽 칸 벽에서 왼쪽으로 나감 -->
  <text x="45" y="47" font-size="12" text-anchor="middle" stroke="none" fill="currentColor">front</text>
  <path d="M95 75 h-45" stroke-linecap="round"/>
  <path d="M58 68 l-8 7 l8 7 z" stroke="none" fill="currentColor"/>
  <text x="45" y="93" font-size="12" text-anchor="middle" stroke="none" fill="currentColor">dequeue</text>
  <!-- enqueue: 오른쪽에서 오른쪽 칸 벽으로 들어옴 -->
  <text x="410" y="47" font-size="12" text-anchor="middle" stroke="none" fill="currentColor">rear</text>
  <path d="M410 75 h-45" stroke-linecap="round"/>
  <path d="M373 68 l-8 7 l8 7 z" stroke="none" fill="currentColor"/>
  <text x="405" y="93" font-size="12" text-anchor="middle" stroke="none" fill="currentColor">enqueue</text>
</svg>

## 리스트로 하면 되지 않나요?

리스트로도 흉내는 낼 수 있습니다. 뒤로 넣고(`append`), 앞에서 빼면(`pop(0)`) 되니까요.

```python
queue = []
queue.append(1)     # [1]
queue.append(2)     # [1, 2]
queue.append(3)     # [1, 2, 3]

print(queue.pop(0)) # 1  (맨 앞)  → [2, 3]
print(queue.pop(0)) # 2           → [3]
```

동작은 맞습니다. **그런데 느려요.** `pop(0)`으로 맨 앞을 빼면, 뒤에 있던 원소들이 한 칸씩 **전부 앞으로 밀립니다.** 원소가 n개면 미는 데 n번. 즉 **O(n)** 이에요.

> 💡 스택의 `pop()`(끝에서 빼기)은 밀 게 없어서 O(1)이었지만, 큐의 `pop(0)`(앞에서 빼기)은 매번 전체를 미느라 O(n)입니다. 큐를 리스트로 만들면 이 O(n)이 반복돼서 **시간 초과**의 단골 원인이 됩니다.

## 정답은 `deque`

파이썬 표준 라이브러리의 `collections.deque`를 쓰면 **양쪽 끝 모두 O(1)** 로 넣고 뺄 수 있습니다. 큐를 쓸 땐 리스트 말고 이걸 씁니다.

```python
from collections import deque

queue = deque()

queue.append(1)       # 뒤로 넣기  → deque([1])
queue.append(2)       #            → deque([1, 2])
queue.append(3)       #            → deque([1, 2, 3])

print(queue.popleft())  # 앞에서 빼기 → 1,  deque([2, 3])
print(queue.popleft())  #             → 2,  deque([3])
print(queue)            # deque([3])
```

큐에서 쓰는 짝은 딱 두 개만 기억하면 됩니다:
- `append(x)` → 맨 **뒤**로 넣기
- `popleft()` → 맨 **앞**에서 빼기 (O(1)!)

빈 큐에서 `popleft`를 하면 에러가 나니, 스택 때처럼 비었는지 먼저 확인하세요.

```python
if queue:              # 비어있지 않으면
    x = queue.popleft()
```

## 큐는 언제 쓰나

큐는 **들어온 순서를 그대로 지켜야 할 때** 씁니다.

### 대표 상황

프린터에 인쇄를 걸면 요청한 순서대로 출력됩니다. 먼저 요청한 문서가 먼저 나오죠. 이게 큐예요.

```python
from collections import deque

jobs = deque(["문서A", "문서B", "문서C"])

while jobs:                        # 큐가 빌 때까지
    current = jobs.popleft()       # 가장 먼저 요청된 것부터
    print("출력 중:", current)

# 출력 중: 문서A
# 출력 중: 문서B
# 출력 중: 문서C
```

### 진짜 중요한 건

큐가 알고리즘에서 결정적으로 쓰이는 곳은 **BFS(너비 우선 탐색)** 입니다. 미로에서 최단 거리를 찾을 때, "가까운 곳부터 순서대로" 퍼져나가야 하는데 그 "순서대로"를 큐가 보장합니다. 지금은 "큐 = 먼저 발견한 곳부터 방문"이라는 감만 잡아두면 됩니다. 나중에 알고리즘 파트에서 다시 만나요.

```python
# BFS의 뼈대 — 지금은 큐가 이렇게 쓰인다는 것만 보고 넘어가세요
from collections import deque

def bfs(start):
    queue = deque([start])
    visited = {start}
    while queue:
        node = queue.popleft()      # 먼저 발견한 것부터 꺼내서
        for nxt in neighbors(node): # 이웃들을
            if nxt not in visited:
                visited.add(nxt)
                queue.append(nxt)   # 큐 뒤에 넣어둔다
```

## 정리

| 연산 | 리스트 | `deque` |
| --- | --- | --- |
| 뒤로 넣기 | `append(x)` — O(1) | `append(x)` — O(1) |
| 앞에서 빼기 | `pop(0)` — **O(n) 느림** | `popleft()` — **O(1)** |

> 💡 **"먼저 온 순서대로 처리"가 필요하면 큐, 그리고 큐는 `deque`로.** 리스트의 `pop(0)`은 편해 보여도 O(n)이라 큐 용도로는 피하세요. 이 습관 하나가 BFS 문제에서 시간 초과를 막아줍니다.

## 직접 풀어보기

1. `deque`로 큐를 만들어 `1~5`를 넣었다가 하나씩 꺼내면서 출력해, **넣은 순서 그대로** 나오는지 확인해 보세요.
2. **핫 포테이토** — `1~7`이 원형으로 서 있고, 3번째 사람마다 탈락시킵니다. 큐에서 두 명은 뒤로 다시 넣고(`append`) 세 번째를 탈락(`popleft` 후 버리기)시키는 걸 반복해, 마지막 남는 사람을 찾아보세요.
3. 앞에서 본 `pop(0)` 리스트 큐와 `deque` 큐로 각각 **10만 개**를 넣고 빼며 시간을 재보세요. 얼마나 차이 나는지 눈으로 확인하면 감이 확 옵니다.
