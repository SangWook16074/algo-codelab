# 8. 함수

함수를 짧고 강력하게 쓰는 방법들이에요. 코테에서 정렬 기준을 바꾸거나 값을 여러 개 돌려줄 때 자주 씁니다.

### lambda

`def` 없이 한 줄로 만드는 함수예요. `lambda 매개변수: 반환값` 꼴입니다.

```python
square = lambda x: x * x     # def square(x): return x*x 와 같아요
print(square(5))             # 출력: 25
```

혼자 쓰기보다는 `sort`나 `map`의 **정렬/변환 기준(key)** 으로 주로 씁니다.

```python
words = ["banana", "kiwi", "apple"]
print(sorted(words, key=lambda w: len(w)))   # 출력: ['kiwi', 'apple', 'banana']
```

길이 기준으로 정렬돼요. `key=len` 처럼 기존 함수를 넣을 수도 있지만, `lambda`는 나만의 기준을 즉석에서 만들 때 편합니다.

### map, filter

`map(함수, 리스트)` 는 모든 원소에 함수를 적용하고, `filter(함수, 리스트)` 는 조건이 참인 것만 남깁니다.

```python
print(list(map(str, [1, 2, 3])))              # 출력: ['1', '2', '3']
print(list(filter(lambda x: x > 2, [1, 2, 3, 4])))   # 출력: [3, 4]
```

주의할 점은, `map`과 `filter`의 결과는 리스트가 아니라 **이터레이터**라서 그대로 출력하면 이상한 값이 나와요. 반드시 `list()`로 감싸야 리스트가 됩니다.

### 여러 값 반환

`return a, b` 처럼 쉼표로 여러 값을 돌려주면 **튜플**로 묶여서 반환돼요.

```python
def min_max(nums):
    return min(nums), max(nums)

result = min_max([3, 1, 4, 1, 5])
print(result)                    # 출력: (1, 5)

lo, hi = min_max([3, 1, 4, 1, 5])   # 언패킹으로 따로 받기
print(lo, hi)                    # 출력: 1 5
```

받을 때 `x, y = func()` 처럼 변수 개수를 맞춰주면 각각 나눠 받을 수 있습니다.

### 기본값 인자의 함정

기본값으로 리스트 같은 **가변 객체**를 쓰면 위험해요. 그 리스트가 함수 호출마다 새로 만들어지지 않고 **계속 공유**되기 때문입니다.

```python
def bad_append(x, lst=[]):     # 위험! lst가 한 번만 만들어져 공유됨
    lst.append(x)
    return lst

print(bad_append(1))   # 출력: [1]
print(bad_append(2))   # 출력: [1, 2]      ← 새 리스트가 아니라 쌓임!
print(bad_append(3))   # 출력: [1, 2, 3]   ← 이전 값이 남아있어요
```

빈 리스트를 기대했는데 값이 누적돼 버려요. 정석은 기본값을 `None`으로 두고, 함수 안에서 초기화하는 것입니다.

```python
def good_append(x, lst=None):
    if lst is None:
        lst = []               # 호출할 때마다 새 리스트를 만듦
    lst.append(x)
    return lst

print(good_append(1))   # 출력: [1]
print(good_append(2))   # 출력: [2]   ← 매번 깨끗한 새 리스트
```

### *args, **kwargs

인자를 몇 개 받을지 모를 때 `*args`(위치 인자를 튜플로), `**kwargs`(키워드 인자를 딕셔너리로) 모아 받아요.

```python
def total(*args):          # args는 튜플로 모임
    return sum(args)

print(total(1, 2, 3, 4))   # 출력: 10

def show(**kwargs):        # kwargs는 딕셔너리로 모임
    return kwargs

print(show(a=1, b=2))      # 출력: {'a': 1, 'b': 2}
```

> 💡 `lambda`와 `sorted(key=...)` 조합은 코테에서 정렬 기준을 바꿀 때 정말 자주 나옵니다. 가변 기본값 함정은 실전에서 원인 찾기 어려운 버그이니, 리스트 기본값이 필요하면 꼭 `None` 패턴을 쓰세요.
