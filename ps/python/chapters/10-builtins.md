# 10. 자주 쓰는 내장 함수

파이썬이 기본 제공하는, 코테에서 손이 자주 가는 함수들입니다.

## 합/최대/최소/정렬/절댓값

```python
arr = [3, 1, 4, 1, 5]

print(sum(arr))           # 출력: 14   (전체 합)
print(max(arr))           # 출력: 5    (최댓값)
print(min(arr))           # 출력: 1    (최솟값)
print(sorted(arr))        # 출력: [1, 1, 3, 4, 5]  (정렬된 새 리스트 반환, 원본은 그대로)
print(abs(-7))            # 출력: 7    (절댓값)
```

## `sorted`로 내림차순 / 기준 정렬

```python
arr = [3, 1, 4, 1, 5]
print(sorted(arr, reverse=True))     # 출력: [5, 4, 3, 1, 1]

words = ["banana", "kiwi", "apple"]
print(sorted(words, key=len))        # 출력: ['kiwi', 'apple', 'banana']  (길이순)
```

## `enumerate` — 번호와 값을 함께

```python
fruits = ["사과", "바나나", "포도"]
for i, fruit in enumerate(fruits):
    print(i, fruit)
# 출력:
# 0 사과
# 1 바나나
# 2 포도
```

## `zip` — 두 리스트를 짝지어서

```python
names = ["철수", "영희"]
ages = [20, 22]
for name, age in zip(names, ages):
    print(name, age)
# 출력:
# 철수 20
# 영희 22
```

> 💡 `sum/max/min/sorted`는 직접 반복문 짜지 않고 한 줄로 끝내줍니다.
> `enumerate`(번호 필요할 때), `zip`(여러 리스트 동시에)은 코드를 훨씬 깔끔하게 만들어줍니다.
