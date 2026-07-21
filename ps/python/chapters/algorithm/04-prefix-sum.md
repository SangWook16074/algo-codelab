# 4. 누적합 (prefix sum)

"구간 합"을 매번 다시 더하면 느립니다. **미리 한 번 더해두고 뺄셈으로 꺼내 쓰는** 전처리 기법이에요. 소수 챕터에서 "무식하게 다 해보기 → 관찰로 줄이기"를 배웠다면, 누적합은 여기에 한 가지 발상을 더합니다. **매번 반복하지 말고, 미리 계산해서 재사용하자.** 반복적인 구간 합 질문을 O(1)로 답하게 만드는, 최적화의 대표적인 첫 도구입니다.

이 한 챕터에서 배우는 것:
- 매번 더하는 **O(n) 반복**이 왜 문제인지 감 잡기
- **누적합 배열**을 만들고 `prefix[r] - prefix[l-1]`로 구간 합을 **O(1)**에 꺼내기
- 표(격자)에서의 **2차원 누적합**
- `itertools.accumulate`로 누적합을 한 줄에 만들기

## 매번 더하면 왜 느릴까?

배열 `arr`가 있고, "l번부터 r번까지 다 더하면 얼마?"라는 질문이 여러 번 들어온다고 해봅시다. 가장 소박한 방법은 물어볼 때마다 그 구간을 처음부터 더하는 거예요.

```python
arr = [3, 1, 4, 1, 5, 9, 2, 6]

def range_sum(l, r):        # l번부터 r번까지 (양끝 포함)
    total = 0
    for i in range(l, r + 1):
        total += arr[i]
    return total

print(range_sum(2, 5))   # 19  (4 + 1 + 5 + 9)
print(range_sum(0, 7))   # 31  (전체 합)
```

질문 한 번에 최대 n번 더합니다. 그런데 이런 질문이 **q개** 들어오면 전체는 **O(n × q)**. n과 q가 각각 10만이면 100억 번이라 시간 초과예요.

> 💡 컴퓨터는 **1초에 약 1억 번** 연산합니다. "구간 합을 여러 번 물어본다"는 문제에서 매번 다시 더하는 순간, 질문 수 × 구간 길이만큼 일이 곱으로 불어납니다. 이럴 때 **전처리**를 떠올리세요.

## 핵심 발상: 미리 한 번 다 더해두기

트릭은 이겁니다. **"처음부터 여기까지의 합"을 미리 다 구해두면, 어떤 구간 합이든 뺄셈 한 번으로 나온다.**

`prefix[i]`를 **"0번부터 i-1번까지의 합"** 이라고 정의합시다. (즉 `prefix[i]` = 앞에서부터 i개의 합)

```
arr    =   [3,   1,   4,   1,   5]
prefix = [0,  3,   4,   8,   9,  14]
          ↑   ↑    ↑    ↑    ↑    ↑
      prefix[0]=0 (아무것도 안 더함)
          prefix[1]=3        prefix[5]=14 (전체 합)
```

이렇게 **맨 앞에 0을 하나 끼워** 길이를 `n+1`로 만드는 게 핵심 관용구예요. 그러면 l번부터 r번까지의 합은:

$$\text{구간합}(l, r) = prefix[r+1] - prefix[l]$$

"r까지의 합"에서 "l 앞까지의 합"을 빼면, 딱 l부터 r까지만 남죠.

<svg viewBox="0 0 460 150" width="460" style="max-width:100%;height:auto;display:block;margin:1.5em auto;" fill="none">
  <g stroke="currentColor" stroke-width="1.5">
    <rect x="20" y="40" width="60" height="40"/>
    <rect x="80" y="40" width="60" height="40"/>
    <rect x="140" y="40" width="60" height="40" fill="currentColor" fill-opacity="0.15"/>
    <rect x="200" y="40" width="60" height="40" fill="currentColor" fill-opacity="0.15"/>
    <rect x="260" y="40" width="60" height="40" fill="currentColor" fill-opacity="0.15"/>
    <rect x="320" y="40" width="60" height="40"/>
  </g>
  <g fill="currentColor" font-size="15" text-anchor="middle" font-family="monospace">
    <text x="50" y="66">3</text>
    <text x="110" y="66">1</text>
    <text x="170" y="66">4</text>
    <text x="230" y="66">1</text>
    <text x="290" y="66">5</text>
    <text x="350" y="66">9</text>
  </g>
  <g fill="currentColor" font-size="12" text-anchor="middle" font-family="monospace" fill-opacity="0.6">
    <text x="50" y="32">0</text>
    <text x="110" y="32">1</text>
    <text x="170" y="32">2</text>
    <text x="230" y="32">3</text>
    <text x="290" y="32">4</text>
    <text x="350" y="32">5</text>
  </g>
  <g stroke="currentColor" stroke-width="1.5">
    <path d="M140 100 L140 115 L320 115 L320 100"/>
  </g>
  <path d="M137 100 l3 -8 l3 8 z" fill="currentColor"/>
  <path d="M317 100 l3 -8 l3 8 z" fill="currentColor"/>
  <text x="230" y="135" fill="currentColor" font-size="14" text-anchor="middle" font-family="monospace">prefix[5] - prefix[2] = 10</text>
</svg>

## 누적합 배열 만들고 O(1)로 꺼내기

`prefix`는 앞에서부터 한 번만 훑으면 만들어집니다. `prefix[i] = prefix[i-1] + arr[i-1]`, 즉 **바로 앞 누적합에 새 원소 하나만 더하면** 되죠.

```python
arr = [3, 1, 4, 1, 5, 9, 2, 6]
n = len(arr)

# 1) 누적합 배열 만들기 (한 번, O(n))
prefix = [0] * (n + 1)
for i in range(n):
    prefix[i + 1] = prefix[i] + arr[i]

print(prefix)   # [0, 3, 4, 8, 9, 14, 23, 25, 31]

# 2) 구간 합은 뺄셈 한 번 (매번, O(1))
def range_sum(l, r):        # l번부터 r번까지 (양끝 포함)
    return prefix[r + 1] - prefix[l]

print(range_sum(2, 5))   # 19  (4 + 1 + 5 + 9)
print(range_sum(0, 7))   # 31  (전체 합)
print(range_sum(4, 4))   # 5   (한 칸짜리 구간)
```

전처리는 **O(n) 한 번**이면 끝. 이후 질문은 **아무리 많이 들어와도 각각 O(1)**입니다. 질문이 q개여도 전체 O(n + q). 아까 O(n × q)가 곱셈이었는데 덧셈으로 바뀌었어요.

> 💡 왜 맨 앞에 `0`을 끼울까요? `range_sum(0, r)`처럼 **0번부터 시작하는 구간**도 `prefix[r+1] - prefix[0]`으로 예외 없이 처리하려는 겁니다. `prefix[0] = 0`이라는 "빈 접시"가 있으면 `l = 0`일 때도 `if`문 없이 같은 공식이 통해요.

## itertools.accumulate로 한 줄에 만들기

파이썬 표준 라이브러리에 누적합을 만들어주는 도구가 이미 있습니다. `itertools.accumulate`예요.

```python
from itertools import accumulate

arr = [3, 1, 4, 1, 5, 9, 2, 6]

print(list(accumulate(arr)))
# [3, 4, 8, 9, 14, 23, 25, 31]
```

기본값은 **덧셈 누적**이라 별다른 설정 없이 바로 누적합이 됩니다. 다만 위 결과는 맨 앞 `0`이 없죠. 우리가 쓰던 `prefix[r+1] - prefix[l]` 공식을 그대로 쓰려면 `initial=0` 옵션으로 앞에 0을 끼워주면 됩니다.

```python
from itertools import accumulate

arr = [3, 1, 4, 1, 5, 9, 2, 6]

prefix = list(accumulate(arr, initial=0))
print(prefix)   # [0, 3, 4, 8, 9, 14, 23, 25, 31]

# 앞서 만든 것과 완전히 동일! 이제 뺄셈으로 꺼내면 됨
print(prefix[6] - prefix[2])   # 19  (2번~5번 구간 합)
```

`accumulate`는 덧셈 말고 다른 연산도 넣을 수 있어요. 예를 들어 **누적 최댓값**은 `max`를 넘기면 됩니다.

```python
from itertools import accumulate

arr = [3, 1, 4, 1, 5, 9, 2, 6]
print(list(accumulate(arr, max)))
# [3, 3, 4, 4, 5, 9, 9, 9]   (여기까지 중 가장 큰 값)
```

> 💡 손으로 `for`문을 짜도 되고 `accumulate`를 써도 됩니다. 결과가 같으니 **읽기 편한 쪽**을 고르세요. 다만 `initial=0`을 빼먹으면 인덱스가 한 칸씩 밀려 공식이 어긋나니, 뺄셈 공식을 쓸 땐 꼭 넣어주세요.

## 2차원 누적합

이 발상은 표(격자)에서도 통합니다. "왼쪽 위 모서리부터 (i, j) 칸까지의 직사각형 합"을 미리 구해두면, **임의의 직사각형 합**을 뺄셈 몇 번으로 꺼낼 수 있어요.

`P[i][j]`를 **(0,0)부터 (i-1, j-1)까지 직사각형의 합**으로 정의합니다. 1차원과 똑같이 **행·열 앞에 0줄을 하나씩** 끼워 크기를 `(n+1) × (m+1)`로 만들어요.

$$P[i][j] = grid[i-1][j-1] + P[i-1][j] + P[i][j-1] - P[i-1][j-1]$$

위쪽 합과 왼쪽 합을 더하면 **겹치는 부분(왼쪽 위)** 이 두 번 더해지니 한 번 빼줍니다. 이 "겹친 만큼 빼기"가 2차원 누적합의 전부예요.

```python
grid = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]
n, m = len(grid), len(grid[0])

# 0줄을 끼운 (n+1) x (m+1) 누적합 표
P = [[0] * (m + 1) for _ in range(n + 1)]
for i in range(1, n + 1):
    for j in range(1, m + 1):
        P[i][j] = (grid[i - 1][j - 1]
                   + P[i - 1][j] + P[i][j - 1] - P[i - 1][j - 1])

print(P[n][m])   # 45  (전체 합: 1+2+...+9)
```

이제 `(r1, c1)`부터 `(r2, c2)`까지 직사각형 합은 **네 귀퉁이 값의 덧셈·뺄셈**으로 나옵니다. 큰 사각형에서 위·왼쪽 띠를 빼고, 두 번 빠진 겹침을 도로 더해주는 거예요.

```python
def rect_sum(r1, c1, r2, c2):   # (r1,c1)~(r2,c2) 직사각형 (양끝 포함)
    return (P[r2 + 1][c2 + 1] - P[r1][c2 + 1]
            - P[r2 + 1][c1] + P[r1][c1])

print(rect_sum(1, 1, 2, 2))   # 28  (5+6+8+9)
print(rect_sum(0, 0, 2, 2))   # 45  (전체)
print(rect_sum(0, 0, 0, 2))   # 6   (맨 윗줄 1+2+3)
```

전처리는 **O(n×m) 한 번**, 이후 어떤 직사각형 합이든 **O(1)**. 격자 문제에서 "부분 영역 합을 자꾸 물어본다" 싶으면 2차원 누적합을 떠올리세요.

> 💡 `- P[r1][c2+1] - P[r2+1][c1]`로 위·왼쪽 띠를 빼면 **왼쪽 위 모서리 영역이 두 번** 빠집니다. 그래서 `+ P[r1][c1]`로 한 번 되돌려줘요. 부호가 헷갈리면 작은 예제로 직접 대입해 검산하는 습관을 들이세요.

## 정리

| 방법 | 전처리 | 질문 1회 | 언제 쓰나 |
| --- | --- | --- | --- |
| 매번 다시 더하기 | 없음 | O(n) | 질문이 아주 드물 때 |
| 1차원 누적합 | O(n) | O(1) | 배열 구간 합을 여러 번 물을 때 |
| 2차원 누적합 | O(n×m) | O(1) | 격자 직사각형 합을 여러 번 물을 때 |

> 💡 누적합의 정신은 **"반복되는 계산을 미리 해두고 재사용한다"** 입니다. 매번 O(n)씩 하던 일을 전처리 한 번으로 몰아넣고, 질문은 O(1)로 답하는 것. 이 "전처리 → 상수 시간 조회" 패턴은 앞으로 만날 여러 자료구조·알고리즘의 바탕이 됩니다.

## 직접 풀어보기

1. `arr = [5, 2, 8, 1, 9, 3]`의 누적합 배열을 만들고, `range_sum(1, 4)`를 구해보세요. (정답: 20 = 2+8+1+9)
2. 정수 배열에서 **합이 가장 큰 길이 k짜리 연속 구간**을 찾아보세요. 누적합을 쓰면 각 구간 합을 O(1)에 비교할 수 있습니다. (힌트: `prefix[i+k] - prefix[i]`를 i마다 훑기)
3. `n×m` 격자에서 임의의 직사각형 합 질문이 여러 번 들어올 때, 2차원 누적합으로 답하는 함수를 완성해보세요. (힌트: 위 `rect_sum`을 그대로 활용)
