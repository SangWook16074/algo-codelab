# 1. 트리와 이진 트리

앞에서 배운 그래프는 "점(노드)과 선(간선)"이 자유롭게 얽힌 구조였습니다. 그런데 그중에서도 **가지가 갈라지기만 하고 다시 합쳐지지 않는**, 딱 나무 모양인 특수한 그래프가 있어요. 바로 **트리**입니다. 폴더 안에 폴더, 그 안에 또 파일이 있는 파일 시스템, 회사 조직도, 토너먼트 대진표가 전부 트리예요. 그리고 반가운 소식: 트리를 훑는 방법은 이미 배운 **DFS/BFS 그 자체**입니다. 여기서는 그걸 트리에 맞게 다듬어 봅니다.

이 한 챕터에서 배우는 것:
- 트리가 뭔지 (사이클 없는 연결 그래프)와 기본 용어
- 이진 트리를 파이썬으로 **표현**하는 법 (노드 클래스, 리스트)
- 순회 3종 (전위/중위/후위)이 사실은 **DFS**라는 것
- 레벨 순회가 사실은 **BFS**라는 것과, 이진 탐색 트리(BST) 맛보기

## 트리가 뭔가요?

한 문장으로: **사이클이 없는 연결 그래프**입니다.

- **연결**: 모든 노드가 어떻게든 이어져 있다 (섬처럼 떨어진 노드가 없다).
- **사이클 없음**: 어떤 노드에서 출발해 같은 길로 되돌아오는 순환이 없다.

노드가 `N`개인 트리는 항상 간선이 정확히 `N-1`개예요. 하나라도 더 있으면 사이클이 생기고, 하나라도 모자라면 끊어집니다.

<svg viewBox="0 0 320 220" width="320" style="max-width:100%;height:auto;display:block;margin:1.5em auto;" fill="none" stroke="currentColor" stroke-width="2">
  <!-- 간선: 원 테두리 사이만 잇도록 짧게 (중심 관통 X) -->
  <line x1="148" y1="52" x2="102" y2="98"/>
  <line x1="172" y1="52" x2="218" y2="98"/>
  <line x1="78"  y1="122" x2="62"  y2="168"/>
  <line x1="102" y1="122" x2="118" y2="168"/>
  <line x1="242" y1="122" x2="258" y2="168"/>
  <!-- 노드 (속 빈 원) -->
  <circle cx="160" cy="40"  r="16" fill="none"/>
  <circle cx="90"  cy="110" r="16" fill="none"/>
  <circle cx="230" cy="110" r="16" fill="none"/>
  <circle cx="50"  cy="180" r="16" fill="none"/>
  <circle cx="130" cy="180" r="16" fill="none"/>
  <circle cx="270" cy="180" r="16" fill="none"/>
  <!-- 노드 번호 -->
  <g fill="currentColor" stroke="none" font-size="13" text-anchor="middle" font-family="sans-serif">
    <text x="160" y="45">1</text>
    <text x="90"  y="115">2</text>
    <text x="230" y="115">3</text>
    <text x="50"  y="185">4</text>
    <text x="130" y="185">5</text>
    <text x="270" y="185">6</text>
  </g>
</svg>

용어는 가족 관계로 외우면 쉬워요.

| 용어 | 뜻 | 위 그림에서 |
| --- | --- | --- |
| **루트(root)** | 맨 꼭대기, 부모가 없는 노드 | `1` |
| **부모(parent)** | 바로 위로 이어진 노드 | `2`의 부모는 `1` |
| **자식(child)** | 바로 아래로 이어진 노드 | `1`의 자식은 `2`, `3` |
| **리프(leaf)** | 자식이 없는 끝 노드 | `4`, `5`, `6` |
| **높이(height)** | 루트에서 가장 깊은 리프까지의 간선 수 | `2` |

> 💡 트리는 "루트를 정한 그래프"입니다. 같은 연결 관계라도 어느 노드를 루트로 잡느냐에 따라 부모-자식 방향이 정해져요. 문제에서 보통 루트를 알려주거나 `1`번을 루트로 씁니다.

## 이진 트리 표현하기

**이진 트리(binary tree)** 는 자식이 **최대 2개**(왼쪽/오른쪽)인 트리입니다. 가장 흔하고, 가장 먼저 배우는 트리예요. 표현법 두 가지를 봅시다.

### 방법 1: 노드 클래스

각 노드를 객체로 만들고 `left`, `right`로 자식을 가리키게 합니다. 링크드 리스트를 배웠다면 그 확장판이에요.

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None    # 왼쪽 자식 (없으면 None)
        self.right = None   # 오른쪽 자식

#        1
#       / \
#      2   3
#     / \
#    4   5
root = Node(1)
root.left = Node(2)
root.right = Node(3)
root.left.left = Node(4)
root.left.right = Node(5)

print(root.value)             # 1
print(root.left.value)        # 2
print(root.left.right.value)  # 5
```

### 방법 2: 리스트(배열)로 표현

이진 트리가 꽉 차 있으면 인덱스만으로 부모-자식을 계산할 수 있어요. 루트를 인덱스 `1`에 두면:

- 노드 `i`의 **왼쪽 자식** = `2*i`, **오른쪽 자식** = `2*i + 1`
- 노드 `i`의 **부모** = `i // 2`

```python
# 인덱스:  0(비움) 1  2  3  4  5
tree = [None, 1, 2, 3, 4, 5]

i = 2                    # 값이 2인 노드
print(tree[2 * i])       # 4   (왼쪽 자식)
print(tree[2 * i + 1])   # 5   (오른쪽 자식)
print(tree[i // 2])      # 1   (부모)
```

> 💡 인덱스 `0`을 비우고 `1`부터 쓰는 건 소수 챕터의 에라토스테네스 체에서 "인덱스를 곧 숫자로 쓰는" 감각과 같아요. `2*i / 2*i+1` 공식이 깔끔하게 떨어지기 때문입니다. 힙(heap)에서도 똑같은 표현을 씁니다.

## 순회: 트리의 모든 노드를 방문하기

트리의 노드를 빠짐없이 한 번씩 방문하는 걸 **순회(traversal)** 라고 합니다. 그래프에서 DFS/BFS로 모든 정점을 방문했던 것과 똑같아요. 다만 트리는 사이클이 없어서 **`visited` 배열조차 필요 없습니다** (되돌아올 길이 없으니까).

깊이 우선(DFS)으로 내려가는 방식이 3종류 있는데, 차이는 딱 하나 **"현재 노드를 언제 처리하느냐"** 입니다.

- **전위(preorder)**: 현재 → 왼쪽 → 오른쪽 (**나를 먼저**)
- **중위(inorder)**: 왼쪽 → 현재 → 오른쪽 (**나를 가운데**)
- **후위(postorder)**: 왼쪽 → 오른쪽 → 현재 (**나를 마지막**)

앞서 만든 트리로 세 순회를 전부 구현해 봅시다. 전부 **재귀 DFS**입니다.

```python
def preorder(node):
    if node is None:            # 빈 자리면 멈춤 (재귀 종료 조건)
        return
    print(node.value, end=' ')  # 나를 먼저 처리
    preorder(node.left)         # 왼쪽 서브트리로
    preorder(node.right)        # 오른쪽 서브트리로

def inorder(node):
    if node is None:
        return
    inorder(node.left)          # 왼쪽 먼저
    print(node.value, end=' ')  # 그다음 나
    inorder(node.right)         # 마지막 오른쪽

def postorder(node):
    if node is None:
        return
    postorder(node.left)
    postorder(node.right)
    print(node.value, end=' ')  # 자식을 다 본 뒤 마지막에 나

preorder(root);  print()   # 1 2 4 5 3
inorder(root);   print()   # 4 2 5 1 3
postorder(root); print()   # 4 5 2 3 1
```

세 함수는 **줄 순서만 다르고 나머지는 완전히 똑같죠?** `print`가 재귀 호출의 앞/가운데/뒤 어디에 있느냐가 전부입니다. 이게 순회 3종의 핵심이에요.

> 💡 **후위 순회는 "자식을 다 끝내야 부모를 처리"** 하는 구조라, 폴더 용량 합계·트리 삭제·수식 계산처럼 **아래에서 위로 값을 모으는** 문제에 딱 맞습니다. 재귀로 자식의 결과를 `return` 받아 합치는 패턴을 자주 쓰게 돼요.

## 레벨 순회: 이건 BFS입니다

위 3종은 깊이로 파고드는 DFS였습니다. 반대로 **같은 깊이(레벨)를 먼저 다 훑고** 다음 레벨로 내려가는 순회도 있어요. 바로 **레벨 순회(level-order)**, 그래프에서 배운 **BFS 그 자체**입니다. 도구는 역시 `deque`(큐)예요.

```python
from collections import deque

def level_order(root):
    if root is None:
        return
    q = deque([root])          # 큐에 루트를 넣고 시작
    while q:
        node = q.popleft()     # 앞에서 하나 꺼내 방문
        print(node.value, end=' ')
        if node.left:          # 자식을 큐 뒤에 넣기
            q.append(node.left)
        if node.right:
            q.append(node.right)

level_order(root)   # 1 2 3 4 5
print()
```

`popleft()`로 먼저 들어온 노드를 먼저 꺼내니(FIFO), 루트 → 그 자식들 → 손자들 순서로 층층이 방문됩니다. 큐를 스택(`pop()`)으로 바꾸면 DFS가 되는 것도 그래프에서 본 그대로예요.

> 💡 DFS/BFS 챕터에서 배운 "재귀/스택이면 깊이 우선, 큐면 너비 우선" 원칙이 트리에서 이름만 바꿔 그대로 재등장합니다. **전위·중위·후위 = DFS, 레벨 순회 = BFS.** 새 개념이 아니라 아는 도구의 응용입니다.

## 이진 탐색 트리(BST) 맛보기

**이진 탐색 트리(Binary Search Tree)** 는 규칙 하나를 지키는 이진 트리입니다.

> 모든 노드에서 **왼쪽 서브트리 값 < 나 < 오른쪽 서브트리 값**

이 규칙 덕분에 값을 찾을 때 **매번 반쪽을 버리며** 내려갈 수 있어요. 복잡도 챕터에서 본 이진 탐색의 O(log n)과 똑같은 원리입니다.

```python
def bst_search(node, target):
    if node is None:
        return False
    if node.value == target:
        return True
    if target < node.value:
        return bst_search(node.left, target)   # 작으면 왼쪽만
    else:
        return bst_search(node.right, target)  # 크면 오른쪽만

#        8
#       / \
#      3   10
#     / \
#    1   6
bst = Node(8)
bst.left = Node(3)
bst.right = Node(10)
bst.left.left = Node(1)
bst.left.right = Node(6)

print(bst_search(bst, 6))   # True
print(bst_search(bst, 7))   # False
```

여기에 반전이 하나 있어요. **BST를 중위 순회하면 값이 정렬된 순서로 나옵니다.**

```python
def inorder(node):
    if node is None:
        return
    inorder(node.left)
    print(node.value, end=' ')
    inorder(node.right)

inorder(bst)   # 1 3 6 8 10
print()
```

"왼쪽(작은 값) → 나 → 오른쪽(큰 값)" 규칙이 곧 오름차순이기 때문이죠. BST의 성질이 순회로 자연스럽게 드러나는 순간입니다.

> 💡 균형 잡힌 BST의 탐색은 O(log n)이지만, 한쪽으로만 쭉 뻗은(정렬된 값을 순서대로 넣은) BST는 사실상 리스트가 되어 O(n)까지 느려집니다. 실무에선 이걸 막은 균형 트리(AVL, 레드-블랙 트리)를 쓰지만, 코딩테스트에선 파이썬 `set`/`dict`(해시)로 대체하는 경우가 더 많아요.

## 정리

| 순회 | 방문 순서 | 정체 | 대표 용도 |
| --- | --- | --- | --- |
| 전위(preorder) | 현재 → 왼 → 오 | DFS | 트리 복제, 구조 출력 |
| 중위(inorder) | 왼 → 현재 → 오 | DFS | BST를 정렬 순서로 읽기 |
| 후위(postorder) | 왼 → 오 → 현재 | DFS | 자식→부모로 값 모으기 |
| 레벨(level-order) | 층층이 위→아래 | BFS | 최단 깊이, 층별 처리 |

> 💡 트리 문제의 90%는 "어떤 순회를 고르느냐"로 풀립니다. **위에서 아래로 정보를 뿌리면 전위, 아래에서 위로 모으면 후위, 정렬이 필요하면 중위, 층 단위면 레벨(BFS).** 순회 종류만 정하면 나머지는 재귀나 `deque` 골격에 얹으면 됩니다.

## 직접 풀어보기

1. 트리의 **노드 개수**를 세는 함수를 재귀로 짜보세요. (힌트: `1 + count(left) + count(right)`, 빈 노드는 `0`)
2. 트리의 **깊이(노드 층수)** 를 구하는 함수를 재귀로 짜보세요. (힌트: `0 if node is None else 1 + max(깊이(left), 깊이(right))`, 위 예제 `root`는 `3`층. 간선 수로 세는 높이는 여기서 1을 뺀 `2`입니다.)
3. `bst`에 값 `7`을 규칙에 맞게 삽입하는 `insert(node, value)`를 짜보세요. (힌트: 루트부터 크기를 비교하며 내려가다 `None` 자리를 만나면 새 노드를 붙입니다. 삽입 후 중위 순회하면 여전히 정렬 순서여야 해요.)
```

