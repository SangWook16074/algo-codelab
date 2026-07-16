# 11. 2차원 배열 (2D 리스트)

리스트 안에 리스트를 넣으면 **표(격자)** 가 됩니다. 지도, 미로, 행렬, 좌석 배치 — 가로세로가 있는 건 전부 2차원 배열로 표현해요. 많이들 어려워하는데, 사실 **"리스트를 담은 리스트"** 딱 이 한 줄이 전부입니다. 천천히 그림으로 잡아봅시다.

이 한 챕터에서 배우는 것:
- 2차원 배열이 어떻게 생겼고, `[행][열]`로 어떻게 접근하는지
- **올바른 초기화** (그리고 초보자가 꼭 한 번 당하는 함정)
- 행/열 순회, 크기 구하기
- 헷갈리기 쉬운 지점 정리

## 어떻게 생겼나

2차원 배열은 **리스트를 원소로 가지는 리스트**입니다. 안쪽 리스트 하나가 표의 **한 줄(행)** 이에요.

```python
grid = [
    [1, 2, 3],    # 0번 행
    [4, 5, 6],    # 1번 행
    [7, 8, 9],    # 2번 행
]
```

그림으로 보면 이렇게 **행(row)** 과 **열(column)** 로 이루어진 표입니다.

<svg viewBox="0 0 320 210" width="320" style="max-width:100%;height:auto;display:block;margin:1.5em auto;" fill="none" stroke="currentColor" stroke-width="2" font-family="sans-serif">
  <!-- 열 번호 (위) -->
  <text x="95"  y="30" font-size="12" text-anchor="middle" stroke="none" fill="currentColor">0열</text>
  <text x="165" y="30" font-size="12" text-anchor="middle" stroke="none" fill="currentColor">1열</text>
  <text x="235" y="30" font-size="12" text-anchor="middle" stroke="none" fill="currentColor">2열</text>
  <!-- 행 번호 (왼쪽) -->
  <text x="40" y="70"  font-size="12" text-anchor="middle" stroke="none" fill="currentColor">0행</text>
  <text x="40" y="120" font-size="12" text-anchor="middle" stroke="none" fill="currentColor">1행</text>
  <text x="40" y="170" font-size="12" text-anchor="middle" stroke="none" fill="currentColor">2행</text>
  <!-- 칸들 -->
  <rect x="65"  y="45"  width="60" height="40" rx="4"/>
  <rect x="135" y="45"  width="60" height="40" rx="4"/>
  <rect x="205" y="45"  width="60" height="40" rx="4"/>
  <rect x="65"  y="95"  width="60" height="40" rx="4"/>
  <rect x="135" y="95"  width="60" height="40" rx="4"/>
  <rect x="205" y="95"  width="60" height="40" rx="4"/>
  <rect x="65"  y="145" width="60" height="40" rx="4"/>
  <rect x="135" y="145" width="60" height="40" rx="4"/>
  <rect x="205" y="145" width="60" height="40" rx="4"/>
  <!-- 값 -->
  <text x="95"  y="70"  font-size="15" text-anchor="middle" stroke="none" fill="currentColor">1</text>
  <text x="165" y="70"  font-size="15" text-anchor="middle" stroke="none" fill="currentColor">2</text>
  <text x="235" y="70"  font-size="15" text-anchor="middle" stroke="none" fill="currentColor">3</text>
  <text x="95"  y="120" font-size="15" text-anchor="middle" stroke="none" fill="currentColor">4</text>
  <text x="165" y="120" font-size="15" text-anchor="middle" stroke="none" fill="currentColor">5</text>
  <text x="235" y="120" font-size="15" text-anchor="middle" stroke="none" fill="currentColor">6</text>
  <text x="95"  y="170" font-size="15" text-anchor="middle" stroke="none" fill="currentColor">7</text>
  <text x="165" y="170" font-size="15" text-anchor="middle" stroke="none" fill="currentColor">8</text>
  <text x="235" y="170" font-size="15" text-anchor="middle" stroke="none" fill="currentColor">9</text>
</svg>

## 접근은 `[행][열]` 순서

값 하나를 꺼낼 땐 대괄호를 **두 번** 씁니다. **먼저 행, 그다음 열**이에요.

```python
grid = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]

print(grid[0])       # [1, 2, 3]   → 0번 행 전체 (안쪽 리스트 하나)
print(grid[1][2])    # 6           → 1번 행의 2번 열
print(grid[2][0])    # 7           → 2번 행의 0번 열
```

`grid[1]`은 `[4, 5, 6]`이라는 리스트고, 거기서 `[2]`를 또 하면 그 리스트의 2번 원소인 `6`. **"리스트 안의 리스트"를 두 단계로 꺼내는 것**뿐입니다.

> 💡 순서를 **`grid[행][열]`** = **`grid[y][x]`** 로 외워두세요. 좌표 `(x, y)`와 순서가 **반대**라 처음엔 헷갈립니다. 격자 문제에서 "세로 위치(행, y)가 먼저, 가로 위치(열, x)가 나중"이라고 기억하면 실수가 확 줄어요.

## 크기 구하기

```python
grid = [
    [1, 2, 3],
    [4, 5, 6],
]

행 = len(grid)        # 2   (행의 개수 = 바깥 리스트 길이)
열 = len(grid[0])     # 3   (열의 개수 = 안쪽 리스트 하나의 길이)
print(행, 열)         # 2 3
```

`len(grid)`는 **행 개수**, `len(grid[0])`은 **열 개수**입니다. 이 두 값을 흔히 `H`(height, 세로)와 `W`(width, 가로)로 부릅니다.

## 초기화

크기가 정해진 빈 격자를 미리 만들어야 할 때가 많습니다. **0으로 채운 3×3 격자**를 만들어 봅시다. 반드시 아래처럼 **컴프리헨션**으로 만드세요.

```python
H, W = 3, 3
grid = [[0] * W for _ in range(H)]    # ✅ 올바른 초기화

grid[0][0] = 1
print(grid)   # [[1, 0, 0], [0, 0, 0], [0, 0, 0]]   ← 한 칸만 바뀜. 정상!
```

`[0] * W`로 한 줄(`[0, 0, 0]`)을 만들고, `for _ in range(H)`로 그 줄을 **매번 새로** H개 만드는 겁니다.

### `[[0]*W]*H` 는 쓰지 마세요

겉보기엔 똑같아 보이는 이 코드는 **틀립니다.**

```python
grid = [[0] * 3] * 3     # ❌ 함정!
grid[0][0] = 1
print(grid)   # [[1, 0, 0], [1, 0, 0], [1, 0, 0]]   ← 한 칸만 바꿨는데 세 줄이 전부!
```

바깥의 `* 3`이 **같은 리스트 하나를 3번 가리키게** 만들기 때문입니다(얕은 복사). 세 행이 사실은 **똑같은 한 줄**이라, 한 칸을 바꾸면 세 줄이 동시에 바뀌어요.

<svg viewBox="0 0 420 170" width="420" style="max-width:100%;height:auto;display:block;margin:1.5em auto;" fill="none" stroke="currentColor" stroke-width="2" font-family="sans-serif">
  <!-- 왼쪽: 올바른 초기화 (각 행이 서로 다른 리스트) -->
  <text x="105" y="20" font-size="12" text-anchor="middle" stroke="none" fill="currentColor" font-weight="bold">✅ for _ in range(H)</text>
  <text x="20" y="50" font-size="11" text-anchor="start" stroke="none" fill="currentColor">0행</text>
  <text x="20" y="90" font-size="11" text-anchor="start" stroke="none" fill="currentColor">1행</text>
  <text x="20" y="130" font-size="11" text-anchor="start" stroke="none" fill="currentColor">2행</text>
  <rect x="55" y="35"  width="110" height="24" rx="4"/>
  <rect x="55" y="75"  width="110" height="24" rx="4"/>
  <rect x="55" y="115" width="110" height="24" rx="4"/>
  <text x="110" y="52"  font-size="11" text-anchor="middle" stroke="none" fill="currentColor">[0,0,0]</text>
  <text x="110" y="92"  font-size="11" text-anchor="middle" stroke="none" fill="currentColor">[0,0,0]</text>
  <text x="110" y="132" font-size="11" text-anchor="middle" stroke="none" fill="currentColor">[0,0,0]</text>
  <!-- 오른쪽: 함정 (세 행이 같은 리스트를 가리킴) -->
  <text x="320" y="20" font-size="12" text-anchor="middle" stroke="none" fill="currentColor" font-weight="bold">❌ [[0]*W]*H</text>
  <text x="250" y="50" font-size="11" text-anchor="start" stroke="none" fill="currentColor">0행</text>
  <text x="250" y="90" font-size="11" text-anchor="start" stroke="none" fill="currentColor">1행</text>
  <text x="250" y="130" font-size="11" text-anchor="start" stroke="none" fill="currentColor">2행</text>
  <!-- 세 행이 모두 같은 리스트 하나로 수렴 -->
  <path d="M285 47 h20 v40 h20" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M285 127 h20 v-40 h20" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M285 87 h40" stroke-linecap="round"/>
  <path d="M325 87 l-10 -5 v10 z" stroke="none" fill="currentColor"/>
  <rect x="325" y="75" width="70" height="24" rx="4"/>
  <text x="360" y="92" font-size="11" text-anchor="middle" stroke="none" fill="currentColor">[0,0,0]</text>
</svg>

> 💡 **격자 초기화는 무조건 `[[0]*W for _ in range(H)]` 형태로 외우세요.** 이 한 줄만 손에 익으면 2차원 배열 문제의 절반은 겁날 게 없습니다. `*`로 곱해서 만드는 방식은 1차원 리스트(`[0]*n`)에서만 안전합니다.

## 전체 순회

모든 칸을 훑을 땐 반복문을 **두 번 겹칩니다.** 바깥은 행, 안쪽은 열이에요.

```python
grid = [
    [1, 2, 3],
    [4, 5, 6],
]

# 방법 1: 값을 직접 꺼내기 (읽기만 할 때 깔끔)
for row in grid:            # row = 한 행 (리스트)
    for value in row:       # value = 그 행의 각 값
        print(value, end=" ")
    print()                 # 한 행 끝나면 줄바꿈
# 1 2 3
# 4 5 6
```

값의 **위치(좌표)** 도 알아야 하면, 인덱스로 도는 방식을 씁니다. 격자 문제(BFS/DFS)에선 이 형태를 훨씬 자주 써요.

```python
H, W = len(grid), len(grid[0])

for i in range(H):          # i = 행 번호 (0, 1)
    for j in range(W):      # j = 열 번호 (0, 1, 2)
        print(f"({i},{j})={grid[i][j]}", end=" ")
    print()
# (0,0)=1 (0,1)=2 (0,2)=3
# (1,0)=4 (1,1)=5 (1,2)=6
```

> 💡 관례상 행 인덱스는 `i`, 열 인덱스는 `j`를 씁니다. `grid[i][j]`. 격자에서 상하좌우로 움직일 땐 이 `i`, `j`에 `+1`, `-1`을 더해가며 이웃 칸을 봅니다 — 나중에 DFS/BFS에서 핵심 기술이 돼요.

## 입력으로 격자 받기

코딩테스트에선 보통 여러 줄로 격자를 입력받습니다. 각 줄을 리스트로 만들어 쌓으면 됩니다.

```python
# 입력 예:
# 3 3
# 1 2 3
# 4 5 6
# 7 8 9

H, W = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(H)]
# grid = [[1,2,3],[4,5,6],[7,8,9]]
```

`input().split()`으로 한 줄을 쪼개고, `map(int, ...)`로 숫자로 바꾸고, `list(...)`로 리스트를 만든 뒤, 그걸 H번 반복해 쌓는 컴프리헨션입니다.

## 정리

| 하고 싶은 것 | 코드 |
| --- | --- |
| 값 접근 | `grid[i][j]` (행 먼저, 열 나중) |
| 행 개수 | `len(grid)` |
| 열 개수 | `len(grid[0])` |
| 0으로 초기화 | `[[0] * W for _ in range(H)]` |
| 전체 순회 | `for i in range(H): for j in range(W):` |

> 💡 2차원 배열이 어렵게 느껴지는 건 대부분 **① `[행][열]` 순서**와 **② `[[0]*W]*H` 함정** 이 두 가지 때문입니다. 이 둘만 확실히 잡으면 나머지는 1차원 리스트를 두 번 쓰는 것과 다르지 않아요. 지도·미로 문제(DFS/BFS)의 무대가 바로 여기입니다.

## 직접 풀어보기

1. 3×4(3행 4열) 크기의, 모든 칸이 `0`인 격자를 만들고 `grid[2][3] = 7`로 바꾼 뒤 전체를 출력해 보세요.
2. 위 `grid`(1~9)에서 **모든 칸의 합**을 이중 반복문으로 구해보세요. (정답: 45)
3. `grid`의 **대각선 값**(`grid[0][0]`, `grid[1][1]`, `grid[2][2]`)만 출력해 보세요. i와 j가 같은 칸이라는 점을 활용하면 반복문 하나로 됩니다.
