# 3. 조건문 — 더 나아가기

조건문에 조금 익숙해졌다면, 더 짧고 강력하게 조건을 다루는 방법들을 배워봅니다. 코테에서 코드를 간결하게 만들어 주는 도구들이에요.

### 삼항 연산자 — 한 줄로 조건 쓰기

`if`-`else` 를 한 줄로 압축해서 값을 정할 수 있습니다. `참일_값 if 조건 else 거짓일_값` 순서예요.

```python
n = 7
result = "짝수" if n % 2 == 0 else "홀수"
print(result)   # 출력: 홀수
```

### `any()` / `all()` — 리스트 전체를 한 번에 검사

`any()` 는 하나라도 참이면 `True`, `all()` 은 모두 참이어야 `True` 입니다.

```python
print(any([False, True, False]))   # 출력: True
print(all([True, True]))           # 출력: True
```

리스트의 원소들이 어떤 조건을 만족하는지 검사할 때 아주 유용합니다.

```python
nums = [1, 2, 3]
print(all(x > 0 for x in nums))    # 출력: True  ← 모든 원소가 0보다 큼
```

### `in` 으로 여러 값 비교하기

`x == 1 or x == 2 or x == 3` 처럼 길게 쓰지 않고, `in` 으로 짧게 확인할 수 있습니다.

```python
x = 2
if x in (1, 2, 3):
    print("1~3 중 하나")   # 출력: 1~3 중 하나
```

### 딕셔너리로 분기 대체하기

`if`-`elif` 가 여러 개 늘어질 때, 딕셔너리의 `.get()` 으로 깔끔하게 바꿀 수 있습니다.

```python
scores = {"a": 1, "b": 2}
print(scores.get("a", 0))   # 출력: 1  ← 키가 있으면 그 값
print(scores.get("z", 0))   # 출력: 0  ← 키가 없으면 기본값
```

### 파이썬의 "falsy" 값 — 빈 값은 거짓

빈 리스트, `0`, 빈 문자열 `""`, `None` 은 조건에서 모두 거짓으로 취급됩니다. 그래서 `if not arr:` 로 "비어 있는지"를 간단히 검사할 수 있어요.

```python
arr = []
print(not arr)      # 출력: True   ← 빈 리스트는 거짓
print(not [1, 2])   # 출력: False  ← 원소가 있으면 참
print(not 0)        # 출력: True   ← 0도 거짓
print(not "")       # 출력: True   ← 빈 문자열도 거짓
```

> 💡 이런 표현들은 "몰라도 문제는 풀 수 있지만, 알면 코드가 훨씬 짧아지는" 도구들입니다. 특히 `not arr` 로 빈 값 검사, `all()` 로 조건 일괄 검사는 코테에서 자주 쓰게 될 거예요.
