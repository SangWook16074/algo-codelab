# 11. 리스트 컴프리헨션

리스트를 **한 줄로** 만드는 파이썬만의 문법입니다. 처음엔 낯설지만 익히면 정말 편해요.

## 기본형: `[식 for 변수 in 반복대상]`

```python
# 일반 방식
squares = []
for i in range(5):
    squares.append(i * i)
print(squares)            # 출력: [0, 1, 4, 9, 16]

# 컴프리헨션 (위와 완전히 같은 결과, 한 줄로)
squares = [i * i for i in range(5)]
print(squares)            # 출력: [0, 1, 4, 9, 16]
```

## 조건 붙이기: `[식 for 변수 in 반복대상 if 조건]`

```python
# 0~9 중 짝수만
evens = [i for i in range(10) if i % 2 == 0]
print(evens)              # 출력: [0, 2, 4, 6, 8]
```

## 입력받을 때 자주 쓰는 형태

```python
# 입력이 "3 1 4 1 5" 라고 가정 — 각 숫자를 제곱한 리스트
nums = [int(x) ** 2 for x in input().split()]
# 입력 "3 1 4 1 5" → nums = [9, 1, 16, 1, 25]
```

> ▶ **바로 실행해보기** — `input()` 자리에 문자열을 넣으면 복붙만으로 결과를 볼 수 있어요.

```python
nums = [int(x) ** 2 for x in "3 1 4 1 5".split()]
print(nums)               # 출력: [9, 1, 16, 1, 25]
```

> 💡 컴프리헨션은 "리스트를 가공해 새 리스트 만들기"를 짧게 해줍니다.
> 몰라도 반복문으로 다 되지만, 익혀두면 코드가 짧아지고 읽기 쉬워집니다. 코테 답안에서 정말 많이 보게 될 거예요.
