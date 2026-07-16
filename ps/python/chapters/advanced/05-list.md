# 5. 리스트

기본 리스트 조작에 익숙해졌다면, 코테에서 자주 쓰는 심화 기법들을 알아봅니다. 정렬 기준을 마음대로 바꾸고, 2차원 리스트를 안전하게 만들고, 앞뒤로 빠르게 넣고 빼는 방법까지 익히면 실전에서 훨씬 강해집니다.

### `sort(key=...)`

`sort()`는 기본적으로 값 자체를 기준으로 정렬하지만, `key`에 함수를 넘기면 "무엇을 기준으로 정렬할지"를 정할 수 있습니다. 코테 정렬 문제의 핵심이에요.

```python
words = ["banana", "kiwi", "apple", "fig"]
words.sort(key=len)        # 글자 수(길이) 기준
print(words)               # 출력: ['fig', 'kiwi', 'apple', 'banana']
```

튜플이 담긴 리스트는 `lambda`로 "몇 번째 값"을 기준 삼을지 고를 수 있습니다.

```python
pairs = [(1, 30), (2, 10), (3, 20)]
pairs.sort(key=lambda x: x[1])   # 튜플의 2번째(인덱스 1) 값 기준
print(pairs)                     # 출력: [(2, 10), (3, 20), (1, 30)]
```

`key`가 튜플을 돌려주면 **다중 정렬**이 됩니다. 앞의 기준이 같을 때만 뒤의 기준을 봐요. 값 앞에 `-`를 붙이면 그 기준만 내림차순이 됩니다.

```python
people = [(80, "A"), (90, "B"), (80, "C"), (90, "D")]
people.sort(key=lambda x: (-x[0], x[1]))   # 점수 내림차순, 같으면 이름 오름차순
print(people)   # 출력: [(90, 'B'), (90, 'D'), (80, 'A'), (80, 'C')]
```

### 2차원 리스트 올바른 초기화

3x3 짜리 0으로 채운 격자를 만들 때는 반드시 아래처럼 `for` 문으로 만들어야 합니다.

```python
good = [[0] * 3 for _ in range(3)]
good[0][0] = 1
print(good)   # 출력: [[1, 0, 0], [0, 0, 0], [0, 0, 0]]
```

반면 `[[0]*3]*3`은 겉보기엔 똑같아 보이지만 **함정**입니다. `*3`이 같은 리스트를 3번 가리키게 만들어서(얕은 복사), 한 줄만 바꿔도 세 줄이 동시에 바뀌어요.

```python
bad = [[0] * 3] * 3
bad[0][0] = 1
print(bad)    # 출력: [[1, 0, 0], [1, 0, 0], [1, 0, 0]]  ← 한 칸만 바꿨는데 전부 바뀜!
```

격자 초기화는 항상 `[[0]*열 for _ in range(행)]` 형태로 외워두세요.

### `collections.deque`

리스트로 `pop(0)`(맨 앞 삭제)을 하면 뒤의 원소를 전부 한 칸씩 당겨야 해서 느립니다(O(n)). 앞뒤에서 자주 넣고 빼야 한다면 `deque`를 씁니다. `appendleft`, `popleft`로 앞쪽 작업도 O(1)이에요.

```python
from collections import deque

dq = deque([2, 3])
dq.appendleft(1)      # 앞에 추가
dq.append(4)          # 뒤에 추가
print(dq)             # 출력: deque([1, 2, 3, 4])

print(dq.popleft())   # 출력: 1   (앞에서 꺼내기)
print(dq.pop())       # 출력: 4   (뒤에서 꺼내기)
print(dq)             # 출력: deque([2, 3])
```

BFS(너비 우선 탐색)의 큐는 `deque`가 사실상 필수입니다.

### `bisect`

이미 정렬된 리스트에서 "어떤 값이 들어갈 위치"를 이분탐색으로 빠르게 찾아줍니다. `bisect_left`는 위치만 알려주고, `insort`는 정렬을 유지하며 실제로 끼워 넣습니다.

```python
from bisect import bisect_left, insort

nums = [10, 20, 30, 40]
print(bisect_left(nums, 25))   # 출력: 2   (25가 들어갈 자리 번호)
print(bisect_left(nums, 30))   # 출력: 2   (이미 있는 값의 왼쪽 위치)

insort(nums, 25)               # 정렬 유지하며 삽입
print(nums)                    # 출력: [10, 20, 25, 30, 40]
```

### 유용한 조작 모음

자주 쓰는 자잘한 기능들도 알아두면 코드가 짧아집니다.

```python
arr = [1, 2, 2, 3, 2, 1]

print(arr.count(2))          # 출력: 3   (값 2가 몇 개인지)
print(arr.index(3))          # 출력: 3   (값 3이 처음 나오는 번호)
print(list(reversed(arr)))   # 출력: [1, 2, 3, 2, 2, 1]  (뒤집기)
print(arr[::-1])             # 출력: [1, 2, 3, 2, 2, 1]  (슬라이싱으로 뒤집기)
print(sum(arr), max(arr), min(arr))   # 출력: 11 3 1
```

> 💡 코테에서 `sort(key=...)`의 다중 정렬과 2차원 리스트 초기화 함정은 정말 자주 발목을 잡습니다.
> BFS엔 `deque`, 정렬된 데이터 탐색엔 `bisect`가 있다는 것만 기억해도 문제 접근이 빨라집니다.
