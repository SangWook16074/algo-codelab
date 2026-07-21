# 7. 이진 탐색

정렬된 데이터에서 **탐색 범위를 절반씩 줄여** O(log n)에 원하는 값을 찾습니다. 국어사전에서 '이진'이라는 단어를 찾을 때, 첫 장부터 한 장씩 넘기지 않죠. 한가운데를 펼쳐 보고 "'ㅇ'은 뒤쪽이네" 하며 앞의 절반을 통째로 버립니다. 남은 절반에서 또 가운데를 펼치고... 이렇게 **반씩 버리기**를 반복하는 게 이진 탐색이에요. "선형으로 훑기"에서 "반씩 버리기"로의 발상 전환이자, 다음 챕터 파라메트릭 서치의 토대입니다.

이 한 챕터에서 배우는 것:
- `left/right/mid`로 범위를 반씩 줄이는 **기본형**
- 경계 조건을 잘못 잡으면 생기는 **무한 루프** 피하기
- 파이썬 표준 라이브러리 **`bisect` 모듈**
- 값의 시작/끝 위치를 찾는 **lower bound / upper bound**

## 먼저, 왜 굳이 이진 탐색인가

리스트에서 값을 찾는 가장 쉬운 방법은 처음부터 끝까지 훑는 거예요. `x in arr` 이나 반복문으로요. 이건 최악의 경우 n번 다 봐야 하니 **O(n)** 입니다. ([복잡도 챕터](../complexity/01-complexity.md)에서 본 "한 번 쭉 훑음"이죠.)

그런데 **데이터가 정렬돼 있다면** 훨씬 잘할 수 있습니다. 가운데를 보고 찾는 값과 비교하면, 한 번에 **남은 후보의 절반을 버릴 수 있으니까요.**

## 반씩 버리면 얼마나 빠를까 (O(log n) 감각)

100만 개 중에서 찾는다고 해봅시다. 매번 절반을 버리면 후보 개수가 이렇게 줄어요.

```
1,000,000 → 500,000 → 250,000 → ... → 2 → 1
```

100만을 몇 번 반으로 나눠야 1이 될까요? **약 20번**입니다 (2²⁰ ≈ 100만). "n을 몇 번 반으로 접어야 1이 되나"가 바로 **log₂n**이고, 이게 **O(log n)** 입니다.

| n | O(n) 훑기 | O(log n) 이진 탐색 |
| --- | --- | --- |
| 1,000 | 1,000번 | 약 10번 |
| 1,000,000 | 1,000,000번 | 약 20번 |
| 1,000,000,000 | 10억 번 😱 | 약 30번 |

> 💡 [복잡도 챕터](../complexity/01-complexity.md)에서 O(log n)을 "약 20 (n=100만)"으로 봤던 그 숫자가 바로 이겁니다. 입력이 1000배 커져도 일은 겨우 10번 늘어요. **입력이 아무리 커져도 끄떡없는** 게 로그의 위력입니다. 단, **정렬돼 있어야** 쓸 수 있다는 조건을 꼭 기억하세요.

## 기본형: left / right / mid

핵심 도구는 변수 3개입니다. **`left`(왼쪽 끝), `right`(오른쪽 끝), `mid`(가운데).** "찾는 값이 있을 수 있는 구간"을 `[left, right]`로 들고 다니면서, 가운데(`mid`)를 확인하고 한쪽을 버립니다.

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1   # 후보 구간 [left, right]
    while left <= right:            # 구간이 남아있는 동안
        mid = (left + right) // 2   # 가운데 인덱스
        if arr[mid] == target:
            return mid              # 찾았다! 인덱스 반환
        elif arr[mid] < target:
            left = mid + 1          # target은 오른쪽 → 왼쪽 절반 버림
        else:
            right = mid - 1         # target은 왼쪽 → 오른쪽 절반 버림
    return -1                       # 못 찾음

arr = [1, 3, 5, 7, 9, 11, 13]
print(binary_search(arr, 7))    # 3   (인덱스 3에 있음)
print(binary_search(arr, 1))    # 0
print(binary_search(arr, 8))    # -1  (없음)
```

동작을 그림으로 보면, `arr`에서 `7`을 찾는 과정은 이렇습니다.

<svg viewBox="0 0 460 150" width="460" style="max-width:100%;height:auto;display:block;margin:1.5em auto;" fill="none" stroke="currentColor" stroke-width="2">
  <g font-family="monospace" font-size="15" fill="currentColor" stroke="none" text-anchor="middle">
    <!-- row 1 -->
    <text x="230" y="18" text-anchor="start" font-size="13">arr = [1, 3, 5, 7, 9, 11, 13],  target = 7</text>
  </g>
  <!-- boxes step 1 -->
  <g stroke="currentColor">
    <rect x="20" y="35" width="55" height="30"/>
    <rect x="75" y="35" width="55" height="30"/>
    <rect x="130" y="35" width="55" height="30"/>
    <rect x="185" y="35" width="55" height="30"/>
    <rect x="240" y="35" width="55" height="30"/>
    <rect x="295" y="35" width="55" height="30"/>
    <rect x="350" y="35" width="55" height="30"/>
  </g>
  <g font-family="monospace" font-size="15" fill="currentColor" stroke="none" text-anchor="middle">
    <text x="47" y="55">1</text>
    <text x="102" y="55">3</text>
    <text x="157" y="55">5</text>
    <text x="212" y="55">7</text>
    <text x="267" y="55">9</text>
    <text x="322" y="55">11</text>
    <text x="377" y="55">13</text>
    <text x="47" y="85" font-size="12">L</text>
    <text x="212" y="85" font-size="12">mid</text>
    <text x="377" y="85" font-size="12">R</text>
    <text x="120" y="112" text-anchor="start" font-size="13">arr[mid]=7 == target  →  찾았다! 인덱스 3 반환</text>
  </g>
</svg>

> 💡 `mid = (left + right) // 2`. `//`는 몫만 취하는 정수 나눗셈이라 인덱스로 딱 맞아요. `arr[mid]`가 target보다 **작으면** 정답은 오른쪽에 있으니 `left`를 올리고, **크면** 왼쪽에 있으니 `right`를 내립니다. 매 반복마다 구간이 반으로 줄어드니 O(log n)이에요.

## 함정: 경계 조건과 무한 루프

이진 탐색은 로직은 짧은데 **경계 조건에서 실수가 잦기로 악명 높습니다.** 두 가지만 딱 지키면 됩니다.

**1. `while left <= right` (등호 포함).** `<`만 쓰면 `left == right`인 마지막 한 칸을 검사하지 못하고 빠져나옵니다. 원소가 하나 남았을 때 그게 정답일 수 있으니 `<=`여야 해요.

**2. `left = mid + 1`, `right = mid - 1` (반드시 `mid ± 1`).** 이게 무한 루프를 막는 핵심입니다. 만약 `left = mid`처럼 `+1`을 빼먹으면 어떻게 될까요?

```python
# 무한 루프 나는 잘못된 코드 (실행하지 마세요)
# left, right = 0, 1 일 때
# mid = (0 + 1) // 2 = 0
# arr[0] < target 이라  left = mid = 0  ← left가 안 움직임!
# 다음 반복도 mid = 0, 또 left = 0 ... 영원히 반복 😱
```

`mid`는 항상 `left`와 `right`의 중간(내림)이라 `left`에 붙을 수 있어요. 그래서 방금 확인한 `mid`는 **버리고**(`+1` / `-1`) 넘어가야 구간이 확실히 줄어듭니다.

> 💡 외우기: **구간이 남아있나 → `left <= right`. 방금 본 mid는 다시 안 봄 → `mid + 1` / `mid - 1`.** 이 두 줄만 지키면 무한 루프는 안 납니다. 헷갈리면 위 기본형 6줄을 통째로 외워두는 것도 좋은 전략이에요.

## bisect 모듈: 직접 안 짜도 됩니다

사실 파이썬에는 이진 탐색이 **표준 라이브러리로 내장**돼 있어요. `bisect` 모듈입니다. 매번 `left/right/mid`를 짜다 실수하느니, 이걸 쓰는 게 실전에선 훨씬 안전합니다.

`bisect`는 "값을 찾는" 게 아니라 **"정렬을 유지하려면 어디에 끼워 넣어야 하나"** 하는 **삽입 위치**를 알려줍니다. 이게 핵심 개념이에요.

```python
import bisect

arr = [1, 3, 5, 7, 9]

# bisect_left / bisect_right : 삽입할 인덱스를 알려줌
print(bisect.bisect_left(arr, 5))   # 2   (5는 인덱스 2에 있음, 그 앞자리)
print(bisect.bisect_right(arr, 5))  # 3   (5의 뒷자리)
print(bisect.bisect_left(arr, 6))   # 3   (6이 들어갈 자리: 5와 7 사이)

# insort : 정렬을 유지하며 실제로 삽입
bisect.insort(arr, 6)
print(arr)                          # [1, 3, 5, 6, 7, 9]
```

값이 **있는지 없는지**만 알고 싶다면 이렇게 감싸 쓰면 됩니다.

```python
import bisect

def contains(arr, target):
    i = bisect.bisect_left(arr, target)
    return i < len(arr) and arr[i] == target

arr = [1, 3, 5, 7, 9]
print(contains(arr, 7))   # True
print(contains(arr, 8))   # False
```

> 💡 `bisect_left(arr, x)`는 "x를 넣어도 정렬이 깨지지 않는 **가장 왼쪽** 자리", `bisect_right(arr, x)`는 "**가장 오른쪽** 자리"입니다. x가 배열에 없으면 둘은 같은 값을, 있으면 그 값의 앞/뒤를 가리켜요. 이 차이가 다음 절의 핵심입니다.

## lower bound / upper bound: 값이 여러 개일 때

이진 탐색이 진짜 빛나는 순간은 **같은 값이 여러 개** 있을 때입니다. 예를 들어 정렬된 배열에서 **"5가 몇 개 있지?"** 를 O(log n)에 답할 수 있어요.

- **lower bound**: 그 값이 **처음 나오는** 위치 = `bisect_left`
- **upper bound**: 그 값이 **끝나고 난 다음** 위치 = `bisect_right`

이 둘을 빼면 개수가 나옵니다.

```python
import bisect

arr = [1, 2, 2, 2, 2, 3, 5]   # 2가 4개

lo = bisect.bisect_left(arr, 2)    # 1  (2가 시작되는 위치)
hi = bisect.bisect_right(arr, 2)   # 5  (2가 끝난 다음 위치)

print(lo, hi)          # 1 5
print(hi - lo)         # 4   ← 2의 개수!
```

<svg viewBox="0 0 470 130" width="470" style="max-width:100%;height:auto;display:block;margin:1.5em auto;" fill="none" stroke="currentColor" stroke-width="2">
  <g stroke="currentColor">
    <rect x="20" y="40" width="55" height="30"/>
    <rect x="75" y="40" width="55" height="30"/>
    <rect x="130" y="40" width="55" height="30"/>
    <rect x="185" y="40" width="55" height="30"/>
    <rect x="240" y="40" width="55" height="30"/>
    <rect x="295" y="40" width="55" height="30"/>
    <rect x="350" y="40" width="55" height="30"/>
  </g>
  <g font-family="monospace" font-size="15" fill="currentColor" stroke="none" text-anchor="middle">
    <text x="47" y="60">1</text>
    <text x="102" y="60">2</text>
    <text x="157" y="60">2</text>
    <text x="212" y="60">2</text>
    <text x="267" y="60">2</text>
    <text x="322" y="60">3</text>
    <text x="377" y="60">5</text>
  </g>
  <!-- lower arrow at index1 (left edge x=75) -->
  <path d="M 75 95 L 70 105 L 80 105 Z" fill="currentColor" stroke="none"/>
  <line x1="75" y1="70" x2="75" y2="95"/>
  <!-- upper arrow at index5 (left edge x=295) -->
  <path d="M 295 95 L 290 105 L 300 105 Z" fill="currentColor" stroke="none"/>
  <line x1="295" y1="70" x2="295" y2="95"/>
  <g font-family="monospace" font-size="12" fill="currentColor" stroke="none" text-anchor="middle">
    <text x="75" y="122">bisect_left=1</text>
    <text x="295" y="122">bisect_right=5</text>
  </g>
</svg>

`hi - lo`로 개수를 세는 이 패턴은 코딩테스트에서 **"정렬된 배열에서 특정 값(또는 범위)의 개수"** 를 물어볼 때 그대로 씁니다. 그냥 세면 O(n)인데, 이진 탐색 두 번이면 **O(log n)** 이에요.

`bisect` 없이 직접 짜면 lower bound는 이렇게 생겼습니다. 기본형에서 `==`을 만나도 멈추지 않고 **계속 왼쪽으로 파고드는** 게 차이예요.

```python
def lower_bound(arr, target):
    left, right = 0, len(arr)       # right가 len(arr)임에 주의!
    while left < right:             # 여기선 < (등호 없음)
        mid = (left + right) // 2
        if arr[mid] < target:
            left = mid + 1          # target보다 작으면 확실히 버림
        else:
            right = mid             # 크거나 같으면 mid도 후보로 남김
    return left

arr = [1, 2, 2, 2, 2, 3, 5]
print(lower_bound(arr, 2))    # 1
print(lower_bound(arr, 4))    # 6   (없는 값이면 들어갈 자리: 3과 5 사이)
```

> 💡 헷갈리면 **직접 짜지 말고 `bisect`를 쓰세요.** 표준 라이브러리는 이미 검증됐고 무한 루프 걱정도 없어요. 위 `lower_bound`는 "안이 어떻게 돌아가는지" 이해용입니다. 실전 코드는 `bisect.bisect_left` 한 줄이면 끝이에요.

## 정리

| 도구 | 하는 일 | 시간복잡도 |
| --- | --- | --- |
| `x in arr` (정렬 안 됨) | 처음부터 훑기 | O(n) |
| 이진 탐색 기본형 | 정렬된 배열에서 값 찾기 | O(log n) |
| `bisect_left` | 값의 시작 위치 (lower bound) | O(log n) |
| `bisect_right` | 값의 끝 다음 위치 (upper bound) | O(log n) |
| `bisect_right - bisect_left` | 특정 값의 **개수** | O(log n) |

> 💡 이진 탐색의 대전제는 **"정렬돼 있어야 한다"** 입니다. 정렬 자체가 O(n log n)이라, 한 번 찾고 말 거면 그냥 훑는 O(n)이 더 나을 수도 있어요. 하지만 **정렬된 데이터에 여러 번 질문**하거나, 다음 챕터의 **파라메트릭 서치**처럼 "답의 범위" 자체를 반씩 좁힐 땐 이진 탐색이 압도적입니다.

## 직접 풀어보기

1. `binary_search`로 `[2, 4, 6, 8, 10]`에서 `10`의 인덱스를 찾아보세요. (정답: 4)
2. `bisect`를 이용해 정렬된 배열 `[1, 1, 2, 2, 2, 3]`에서 **2의 개수**를 세보세요. (힌트: `bisect_right - bisect_left`, 정답: 3)
3. 정렬된 배열과 두 값 `a`, `b`가 주어질 때 **`a` 이상 `b` 이하인 원소의 개수**를 O(log n)에 구해보세요. (힌트: `bisect_right(arr, b) - bisect_left(arr, a)`)
