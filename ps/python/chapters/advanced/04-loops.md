# 4. 반복문

`for`를 여러 겹 중첩하다 보면 코드가 금방 지저분해집니다. 파이썬에는 `itertools`라는 표준 모듈이 있어서, 반복을 훨씬 짧고 강력하게 표현할 수 있어요. 코딩테스트에서 "모든 경우의 수", "n개 중 k개 뽑기" 같은 문제가 나오면 거의 여기서 답이 나옵니다.

> ⚠️ `itertools` 함수들의 결과는 **이터레이터**라서 `print()`로 바로 찍으면 값이 안 보이고 `<itertools... object>` 같은 게 나옵니다. 눈으로 확인하려면 `list(...)`로 감싸주세요. (반복문에서는 `for x in product(...)`처럼 그냥 돌려도 됩니다.)

### `itertools.product`

두 리스트에서 하나씩 뽑는 모든 경우(데카르트 곱)를 만들어줍니다. 중첩 `for`를 한 줄로 바꿔줘요.

```python
from itertools import product

print(list(product([1, 2], [3, 4])))
# 출력: [(1, 3), (1, 4), (2, 3), (2, 4)]
```

같은 범위를 여러 번 반복할 땐 `repeat`을 쓰면 편합니다.

```python
from itertools import product

print(list(product(range(3), repeat=2)))
# 출력:
# [(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2), (2, 0), (2, 1), (2, 2)]
```

### `itertools.permutations`

n개에서 k개를 뽑되 **순서를 구분**합니다. `(1, 2)`와 `(2, 1)`을 서로 다른 경우로 셉니다.

```python
from itertools import permutations

print(list(permutations([1, 2, 3], 2)))
# 출력: [(1, 2), (1, 3), (2, 1), (2, 3), (3, 1), (3, 2)]
```

### `itertools.combinations`

n개에서 k개를 뽑되 **순서는 무시**합니다. `(1, 2)`와 `(2, 1)`은 같은 것으로 보고 하나만 남깁니다. 코테에서 "n개 중 k개 뽑기"의 단골이에요.

```python
from itertools import combinations

print(list(combinations([1, 2, 3], 2)))
# 출력: [(1, 2), (1, 3), (2, 3)]
```

### `itertools.accumulate`

앞에서부터 차례로 더한 값을 만들어줍니다. 구간합을 미리 계산해두는 전처리에 유용해요.

```python
from itertools import accumulate

print(list(accumulate([1, 2, 3, 4])))
# 출력: [1, 3, 6, 10]
# (1, 1+2, 1+2+3, 1+2+3+4 순서)
```

### `enumerate`, `zip` 다시 보기

`while`로 인덱스를 직접 세지 않아도, `enumerate`는 **인덱스와 값**을, `zip`은 **여러 리스트를 나란히** 묶어 순회합니다.

```python
scores = ["A", "B", "C"]
for i, s in enumerate(scores):
    print(i, s)
# 출력:
# 0 A
# 1 B
# 2 C

names = ["철수", "영희"]
ages = [20, 21]
for n, a in zip(names, ages):
    print(n, a)
# 출력:
# 철수 20
# 영희 21
```

### `for-else`

`for`에 `else`를 붙이면, 반복이 `break` 없이 끝까지 돌았을 때만 `else`가 실행됩니다. "끝까지 찾았는데 못 찾았을 때"의 실패 처리를 깔끔하게 쓸 수 있어요.

```python
nums = [1, 3, 5, 7]
for x in nums:
    if x % 2 == 0:
        print("짝수 발견")
        break
else:
    print("짝수 없음")     # break가 한 번도 안 걸려서 여기 실행
# 출력: 짝수 없음
```

> 💡 중첩 `for`가 두세 겹 쌓이려 하면 `product`를, 경우의 수를 뽑아야 하면 `permutations`/`combinations`를 떠올리세요. 이터레이터라는 것만 잊지 않으면 (`list`로 감싸기) 코드가 눈에 띄게 짧아집니다.
