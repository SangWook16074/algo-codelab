# 7. 딕셔너리와 셋 — 더 나아가기

여기서는 `collections` 모듈과 집합 연산을 조금 더 깊게 다뤄봅니다. 개수 세기나 그래프 문제에서 코드를 훨씬 짧고 깔끔하게 만들어 줍니다.

### `collections.Counter` — 개수 세기를 한 줄로

위에서 `count.get(ch, 0) + 1` 로 개수를 세는 패턴을 봤죠. `Counter`를 쓰면 이걸 한 줄로 끝낼 수 있어요.

```python
from collections import Counter

count = Counter("banana")
print(count)                  # 출력: Counter({'a': 3, 'n': 2, 'b': 1})
print(count["a"])             # 출력: 3   (없는 key는 0을 돌려줘요)

# 빈도 상위 2개를 (값, 개수) 쌍으로
print(count.most_common(2))   # 출력: [('a', 3), ('n', 2)]
```

리스트도 그대로 넣을 수 있어요.

```python
from collections import Counter

print(Counter([1, 1, 1, 2, 2, 3]))   # 출력: Counter({1: 3, 2: 2, 3: 1})
```

### `collections.defaultdict` — 기본값이 있는 딕셔너리

`defaultdict`는 없는 key를 처음 건드릴 때 기본값을 자동으로 만들어 줍니다. 그래서 `get` 없이 바로 `+=` 나 `append`를 쓸 수 있어요.

```python
from collections import defaultdict

count = defaultdict(int)      # 없는 key의 기본값은 0
for ch in "banana":
    count[ch] += 1            # get 없이 바로 +1
print(dict(count))            # 출력: {'b': 1, 'a': 3, 'n': 2}
```

`defaultdict(list)`는 기본값이 빈 리스트라서, 그래프 인접리스트를 만들 때 필수입니다.

```python
from collections import defaultdict

graph = defaultdict(list)     # 없는 key의 기본값은 []
graph[1].append(2)            # 바로 append 가능
graph[1].append(3)
graph[2].append(1)
print(dict(graph))            # 출력: {1: [2, 3], 2: [1]}
```

### 집합 연산 — 교집합 · 합집합 · 차집합

두 set 사이에는 연산 기호를 바로 쓸 수 있어요. 공통 원소를 찾거나 중복을 제거할 때 아주 강력합니다.

```python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a & b)   # 출력: {3, 4}              (교집합 — 양쪽 다 있는 것)
print(a | b)   # 출력: {1, 2, 3, 4, 5, 6}  (합집합 — 둘을 합친 것)
print(a - b)   # 출력: {1, 2}              (차집합 — a에만 있는 것)
print(a ^ b)   # 출력: {1, 2, 5, 6}        (대칭차 — 한쪽에만 있는 것)
```

### 딕셔너리 순회 — key와 value를 함께 꺼내기

`.items()`를 쓰면 key와 value를 한 번에 꺼내며 반복할 수 있어요.

```python
scores = {"철수": 90, "영희": 85, "민수": 70}

for k, v in scores.items():
    print(k, v)
# 출력: 철수 90
# 출력: 영희 85
# 출력: 민수 70

print(list(scores.keys()))     # 출력: ['철수', '영희', '민수']
print(list(scores.values()))   # 출력: [90, 85, 70]
```

### 딕셔너리 정렬 — 값 기준으로 줄 세우기

딕셔너리 자체는 정렬할 수 없지만, `.items()`를 `sorted`에 넣으면 원하는 기준으로 줄을 세울 수 있어요. `key=lambda x: x[1]` 은 "value 기준으로 정렬"이라는 뜻입니다.

```python
scores = {"철수": 90, "영희": 85, "민수": 70}

# 값(점수)이 작은 순서대로
print(sorted(scores.items(), key=lambda x: x[1]))
# 출력: [('민수', 70), ('영희', 85), ('철수', 90)]
```

> 💡 개수 세기는 `Counter`, 그래프 인접리스트는 `defaultdict(list)`가 정석입니다.
> 공통 원소나 중복 처리는 집합 연산으로, "가장 많이 나온 것"은 `most_common`으로 한 방에 해결하세요.
