# 3. 유니온 파인드 (서로소 집합)

앞에서 **DFS/BFS로 연결 요소를 세는 법**을 배웠습니다. "이 노드들이 몇 개의 덩어리로 나뉘어 있나?"를 그래프를 통째로 훑어서 알아냈죠. 그런데 문제가 이렇게 바뀌면 어떨까요. **"친구 관계가 하나씩 계속 추가되는데, 그때마다 A와 B가 같은 무리인지 즉시 답하라."** 간선이 들어올 때마다 매번 전체를 DFS로 다시 훑으면 너무 느립니다. 이럴 때 쓰는 게 **유니온 파인드**예요.

핵심 질문은 딱 하나입니다. **"이 둘이 같은 그룹인가?"** 친구의 친구는 내 친구고, 그 친구의 친구도 결국 같은 무리죠. 유니온 파인드는 이런 **연결 관계를 그룹으로 관리**하면서, 합치기(union)와 같은 그룹인지 확인하기(find)를 거의 순식간에 처리합니다.

이 한 챕터에서 배우는 것:
- "같은 그룹인가?"를 빠르게 답하는 자료구조의 발상 (**대표(루트)** 개념)
- `parent` 배열, `find`, `union` 완성 코드
- **경로 압축**이 왜 거의 O(1)에 가까운지 감 잡기
- 대표 활용: **사이클 판정** 과 **연결 요소 개수** (다음 챕터 크루스칼 MST의 재료입니다)

## 핵심 아이디어: 그룹마다 대표를 정하자

각 무리(집합)마다 **대표 한 명**을 정합니다. 그러면 "A와 B가 같은 그룹인가?"는 **"A의 대표와 B의 대표가 같은 사람인가?"** 로 바뀌어요.

그룹을 나무(트리) 모양으로 표현합니다. 각 노드는 **자기 부모가 누구인지**만 기억하고, 부모를 계속 따라 올라가다 **자기 자신이 부모인 노드(= 루트)** 가 그 그룹의 대표입니다.

<svg viewBox="0 0 340 150" width="340" style="max-width:100%;height:auto;display:block;margin:1.5em auto;" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="60" cy="30" r="18"/><text x="60" y="36" text-anchor="middle" stroke="none" fill="currentColor" font-size="15">0</text>
  <circle cx="60" cy="100" r="18"/><text x="60" y="106" text-anchor="middle" stroke="none" fill="currentColor" font-size="15">1</text>
  <circle cx="60" cy="130" r="0"/>
  <line x1="60" y1="82" x2="60" y2="48"/>
  <path d="M60 48 l-5 10 l10 0 z" fill="currentColor" stroke="none"/>
  <circle cx="140" cy="100" r="18"/><text x="140" y="106" text-anchor="middle" stroke="none" fill="currentColor" font-size="15">2</text>
  <line x1="128" y1="86" x2="74" y2="44"/>
  <path d="M74 44 l2 11 l9 -6 z" fill="currentColor" stroke="none"/>
  <text x="60" y="12" text-anchor="middle" stroke="none" fill="currentColor" font-size="12">루트(대표)</text>
  <circle cx="270" cy="30" r="18"/><text x="270" y="36" text-anchor="middle" stroke="none" fill="currentColor" font-size="15">3</text>
  <circle cx="270" cy="100" r="18"/><text x="270" y="106" text-anchor="middle" stroke="none" fill="currentColor" font-size="15">4</text>
  <line x1="270" y1="82" x2="270" y2="48"/>
  <path d="M270 48 l-5 10 l10 0 z" fill="currentColor" stroke="none"/>
</svg>

위 그림은 `{0, 1, 2}` 와 `{3, 4}` 두 그룹입니다. 1과 2의 부모는 0, 4의 부모는 3이고, 0과 3은 자기 자신이 부모라서 각 그룹의 대표예요.

이 부모 관계를 배열 하나로 저장합니다. 01장 소수 챕터에서 리스트를 **"인덱스가 곧 숫자"인 칠판**으로 썼던 것처럼, 여기서도 `parent[i]` = "i의 부모"로 씁니다.

## parent 배열과 find, union

처음엔 아무도 연결돼 있지 않으니 **모두가 자기 자신이 대표**입니다. `parent[i] = i`로 시작해요.

- **find(x)**: x의 대표(루트)를 찾는다. 부모를 자기 자신이 될 때까지 타고 올라간다.
- **union(a, b)**: a가 속한 그룹과 b가 속한 그룹을 합친다. 한쪽 루트를 다른 쪽 루트 밑에 붙인다.

```python
parent = [0, 1, 2, 3, 4, 5]   # 처음엔 parent[i] = i (각자 자기 그룹의 대표)

def find(x):
    while parent[x] != x:      # 자기 자신이 부모일 때까지
        x = parent[x]          # 부모를 타고 올라간다
    return x                   # 멈춘 곳이 대표(루트)

def union(a, b):
    ra, rb = find(a), find(b)  # 두 그룹의 대표를 각각 찾고
    if ra == rb:               # 이미 같은 그룹이면
        return                 # 아무것도 안 함
    parent[rb] = ra            # b의 대표를 a의 대표 밑에 붙임

union(0, 1)
union(1, 2)   # 0, 1, 2가 한 그룹으로
union(3, 4)   # 3, 4가 한 그룹으로

print(find(0), find(2))    # 0 0   (같은 대표)
print(find(0) == find(2))  # True  (0과 2는 같은 그룹)
print(find(0) == find(3))  # False (0과 3은 다른 그룹)
```

`union(0, 1)`, `union(1, 2)`를 하면 1과 2가 모두 0 밑으로 붙어서 대표가 0이 됩니다. 그래서 `find(0)`도 `find(2)`도 0을 돌려주고, "같은 그룹"이라고 답할 수 있어요.

> 💡 `union`에서 `if ra == rb: return` 이 한 줄이 나중에 **사이클 판정**의 핵심이 됩니다. "합치려는 두 노드의 대표가 이미 같다 = 이미 연결돼 있다"는 뜻이거든요. 잘 기억해 두세요.

## 문제점: 나무가 한 줄로 길어지면 느리다

위 `find`는 부모를 하나씩 타고 올라갑니다. 그런데 `union(0,1), union(1,2), union(2,3), ...`을 순서대로 하면 트리가 **일렬로 길게** 늘어질 수 있어요.

```
0 ← 1 ← 2 ← 3 ← 4 ← ...
```

이러면 `find(맨 끝)`은 처음부터 끝까지 다 올라가야 해서 **O(n)** 이 됩니다. 모처럼 만든 자료구조인데 이러면 DFS로 세는 것과 다를 게 없죠.

## 경로 압축: 한 번 찾은 길은 지름길로 만든다

해결책이 놀랍도록 간단합니다. **find로 루트를 찾고 나면, 지나온 노드들의 부모를 아예 루트로 바꿔버립니다.** 다음에 찾을 땐 한 번에 도착하도록요.

```python
parent = list(range(6))   # [0, 1, 2, 3, 4, 5]

def find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])   # 루트를 찾아 오면서, 내 부모를 루트로 갱신
    return parent[x]

def union(a, b):
    ra, rb = find(a), find(b)
    if ra != rb:
        parent[rb] = ra

union(0, 1)
union(1, 2)
union(2, 3)   # 0 ← 1 ← 2 ← 3 처럼 길어질 뻔한 상황

print(find(3))   # 0
print(parent)    # [0, 0, 0, 0, 4, 5]  ← 0,1,2,3이 전부 0을 직접 가리킨다!
```

`find(3)`을 부르는 순간, 3을 찾으러 올라가는 길에 있던 3, 2, 1이 **전부 루트(0)를 직접 가리키도록** 납작해집니다. `parent`가 `[0, 0, 0, 0, ...]`이 된 걸 보세요. 다음부터 `find`는 사실상 한 방에 끝납니다.

이 **경로 압축(path compression)** 을 쓰면 `find`와 `union`은 평균적으로 **거의 O(1)** 에 가까워집니다. 정확히는 아커만 함수의 역함수라는 아주 천천히 자라는 값이 붙지만, 실전에서는 **"상수 시간이라고 봐도 무방"** 하다고 기억하면 됩니다.

> 💡 재귀 `find`가 한 줄로 두 가지 일(루트 찾기 + 부모 갱신)을 동시에 합니다. `parent[x] = find(parent[x])`에서 오른쪽이 루트를 돌려주고, 그걸 곧바로 내 부모로 저장하죠. 이 패턴은 통째로 외워두면 어느 문제든 그대로 씁니다.

## 활용 1: 그래프에 사이클이 있는가?

간선을 하나씩 `union`으로 이어가다가, **이미 같은 그룹인 두 노드를 또 연결하려는 순간이 곧 사이클**입니다. 앞에서 표시해 둔 `if ra == rb`가 여기서 빛을 봅니다.

```python
def has_cycle(n, edges):
    parent = list(range(n))

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    for a, b in edges:
        ra, rb = find(a), find(b)
        if ra == rb:        # 이미 연결돼 있는데 또 이으려 함 = 사이클!
            return True
        parent[rb] = ra     # 아니면 합친다

    return False

print(has_cycle(3, [(0, 1), (1, 2), (2, 0)]))  # True  (0-1-2-0 삼각형)
print(has_cycle(3, [(0, 1), (1, 2)]))          # False (일자로만 연결)
```

DFS로 사이클을 찾으려면 방문 상태를 신경 써야 하는데, 유니온 파인드는 **간선을 훑으며 대표만 비교**하면 끝입니다. 훨씬 간결하죠.

## 활용 2: 연결 요소 개수 세기

DFS/BFS로 세던 그 문제입니다. 유니온 파인드로는 **모든 간선을 union한 뒤, 서로 다른 대표가 몇 종류인지** 세면 됩니다.

```python
def count_components(n, edges):
    parent = list(range(n))

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[rb] = ra

    for a, b in edges:
        union(a, b)

    # 각 노드의 대표를 모아 중복을 제거하면, 그 개수가 곧 그룹 수
    return len({find(i) for i in range(n)})

print(count_components(6, [(0, 1), (1, 2), (3, 4)]))
# 3   ← {0,1,2}, {3,4}, {5} 로 세 덩어리
```

대표들을 **집합(set)** 에 넣어 중복을 없앤 게 포인트예요. 01장에서 "포함 여부를 자주 물으면 set"이었다면, 여기선 "서로 다른 종류의 개수를 세려면 set"입니다.

## 정리

| 연산 | 하는 일 | 시간복잡도 |
| --- | --- | --- |
| `parent = list(range(n))` | 초기화 (각자 자기 대표) | O(n) |
| `find(x)` (경로 압축) | x의 대표를 찾음 | 거의 O(1) |
| `union(a, b)` | 두 그룹을 합침 | 거의 O(1) |
| 사이클 판정 / 연결 요소 | 간선 M개 전체 처리 | 거의 O(M) |

> 💡 DFS/BFS는 그래프가 **고정**돼 있을 때 한 번 훑어 세기 좋고, 유니온 파인드는 간선이 **하나씩 추가되며** "지금 같은 그룹?"을 계속 물어볼 때 압도적으로 빠릅니다. 문제에서 "연결을 하나씩 추가/합치며 질의한다" 냄새가 나면 유니온 파인드를 떠올리세요.

> 💡 다음 챕터에서 배울 **크루스칼 MST**는 "간선을 짧은 순으로 정렬해 하나씩 잇되, 사이클이 생기는 간선은 버린다"가 전부입니다. 그 '사이클이 생기는지' 판정이 바로 오늘 배운 `find`/`union`이에요. 유니온 파인드는 크루스칼의 심장입니다.

## 직접 풀어보기

1. `find`, `union`을 만들어 `n = 5`, 간선 `[(0,1), (2,3), (1,4)]`을 union한 뒤 **0과 4가 같은 그룹인지** 확인해 보세요. (정답: `True`)
2. `count_components`를 응용해, 각 그룹의 크기 중 **가장 큰 그룹의 크기**를 구해 보세요. `size = [1]*n` 배열을 만들고 `union`할 때 `size[ra] += size[rb]`로 합쳐주면 됩니다. (`n=6`, 간선 `[(0,1),(1,2),(3,4)]` → 정답: `3`)
3. `has_cycle`를 이용해, 노드가 `n`개이고 간선이 `n-1`개인 그래프가 **트리인지**(사이클이 없고 하나로 연결됨) 판정해 보세요. (힌트: 사이클이 없으면서 연결 요소가 1개이면 트리입니다.)
