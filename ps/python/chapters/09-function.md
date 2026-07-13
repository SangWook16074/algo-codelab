# 9. 함수 (def)

반복되는 작업에 **이름을 붙여** 재사용하는 것입니다. `def`로 만듭니다.

```python
def add(a, b):        # a, b는 받을 값 (매개변수)
    return a + b      # return = 결과를 돌려줌

result = add(3, 5)
print(result)         # 출력: 8
```

## 매개변수와 반환값

```python
def is_even(n):           # 짝수인지 판별하는 함수
    if n % 2 == 0:
        return True
    else:
        return False

print(is_even(4))         # 출력: True
print(is_even(7))         # 출력: False
```

## 기본값 인자 — 안 넘기면 기본값 사용

```python
def greet(name, greeting="안녕"):
    return greeting + ", " + name

print(greet("철수"))              # 출력: 안녕, 철수      (greeting 생략)
print(greet("영희", "반가워"))    # 출력: 반가워, 영희    (직접 지정)
```

> 💡 문제를 작은 조각으로 나눠 풀 때 함수를 씁니다.
> 프로그래머스는 대부분 `def solution(...):` 안에 답을 채우는 형태라, 함수 정의/반환은 꼭 익혀야 합니다.
