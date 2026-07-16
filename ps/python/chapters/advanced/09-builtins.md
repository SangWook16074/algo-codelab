# 9. 내장 함수

기본 내장 함수에 익숙해졌다면, 표준 라이브러리 모듈들도 알아두면 좋아요. 코테에서 자주 등장하는 강력한 도구들입니다.

### `heapq`

항상 **최솟값**을 O(log n)에 꺼낼 수 있는 자료구조예요. 다익스트라나 우선순위가 필요한 문제에 필수입니다.

```python
from heapq import heappush, heappop, heapify

nums = [3, 1, 2]
heapify(nums)            # 리스트를 힙 구조로 변환 (제자리)
print(heappop(nums))     # 출력: 1    (항상 최솟값을 꺼냄)

h = []
heappush(h, 5)           # 힙에 값 추가
heappush(h, 1)
heappush(h, 3)
print(heappop(h))        # 출력: 1
```

최대 힙이 필요하면 **부호를 반전**해서 넣고 꺼낼 때 다시 반전하는 트릭을 씁니다.

```python
from heapq import heappush, heappop

max_h = []
for x in [3, 1, 4, 1, 5]:
    heappush(max_h, -x)  # 음수로 넣기
print(-heappop(max_h))   # 출력: 5    (꺼낼 때 다시 부호 반전 → 최댓값)
```

### `bisect`

정렬 상태를 유지하면서 값이 들어갈 **삽입 위치**를 O(log n)에 찾아줍니다.

```python
from bisect import bisect_left, bisect_right

a = [1, 2, 4, 4, 5]
print(bisect_left(a, 4))   # 출력: 2    (4가 들어갈 가장 왼쪽 위치)
print(bisect_right(a, 4))  # 출력: 4    (4가 들어갈 가장 오른쪽 위치)
print(bisect_left(a, 3))   # 출력: 2    (없는 값이면 삽입될 자리)
```

### `functools.reduce`

리스트를 왼쪽부터 하나로 접어가며 누적 계산해요.

```python
from functools import reduce

print(reduce(lambda a, b: a * b, [1, 2, 3, 4]))  # 출력: 24   (1*2*3*4)
print(reduce(lambda a, b: a + b, [1, 2, 3, 4]))  # 출력: 10   (합도 가능)
```

### `math`

```python
import math

print(math.gcd(12, 18))   # 출력: 6      (최대공약수)
print(math.ceil(3.2))     # 출력: 4      (올림)
print(math.floor(3.8))    # 출력: 3      (내림)
print(math.inf)           # 출력: inf    (무한대, 최솟값 비교 초기값으로 편해요)
```

### `sorted` 다중 key

`key`에 튜플을 주면 앞쪽 기준부터 차례로 비교합니다. 값 앞에 `-`를 붙이면 그 항목만 내림차순이 돼요.

```python
data = [('a', 3), ('b', 1), ('c', 3), ('d', 2)]
# 두 번째 값 내림차순, 같으면 첫 번째 값 오름차순
print(sorted(data, key=lambda x: (-x[1], x[0])))
# 출력: [('a', 3), ('c', 3), ('d', 2), ('b', 1)]
```

> 💡 `heapq`(최솟값 빠르게), `bisect`(정렬된 곳에서 위치 찾기)는 O(log n)이라 큰 입력에서 시간 초과를 막아줍니다.
> `math.inf`는 최소·최대를 갱신하는 초기값으로, 다중 key 정렬은 복잡한 우선순위를 한 줄로 깔끔하게 처리해줘요.
