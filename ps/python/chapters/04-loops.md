# 4. 반복문 (for / while)

같은 작업을 여러 번 반복할 때 씁니다. 알고리즘의 심장이에요.

## `for` + `range()` — 정해진 횟수만큼 반복

`range(n)`은 `0, 1, 2, ..., n-1`을 차례로 만들어줍니다. (끝 숫자 n은 포함 안 함!)

```python
for i in range(5):
    print(i, end=" ")     # 출력: 0 1 2 3 4
# (end=" " 는 줄바꿈 대신 띄어쓰기로 이어 출력하라는 뜻)
```

```python
# range(시작, 끝) : 시작부터 끝-1까지
for i in range(1, 6):
    print(i, end=" ")     # 출력: 1 2 3 4 5

# range(시작, 끝, 간격)
for i in range(0, 10, 2):
    print(i, end=" ")     # 출력: 0 2 4 6 8
```

## 리스트를 직접 순회하기

```python
fruits = ["사과", "바나나", "포도"]
for fruit in fruits:
    print(fruit)
# 출력:
# 사과
# 바나나
# 포도
```

## `while` — 조건이 참인 동안 반복

```python
n = 5
while n > 0:
    print(n, end=" ")     # 출력: 5 4 3 2 1
    n = n - 1             # n을 1씩 줄임 (이게 없으면 무한 반복!)
```

## `break` (탈출) 와 `continue` (건너뛰기)

```python
for i in range(10):
    if i == 5:
        break             # i가 5가 되면 반복 완전 종료
    print(i, end=" ")     # 출력: 0 1 2 3 4

for i in range(5):
    if i == 2:
        continue          # i가 2일 때만 건너뛰고 다음으로
    print(i, end=" ")     # 출력: 0 1 3 4
```

> 💡 "N번 반복", "리스트 전부 확인", "조건 만족할 때까지" — 문제의 90%가 반복문 안에서 벌어집니다.
> `range`의 끝 숫자가 포함 안 된다는 점을 꼭 기억하세요. (초보자 단골 실수)
