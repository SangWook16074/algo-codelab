# 7. 딕셔너리와 셋 (dict / set)

## 딕셔너리 (dict)

리스트는 번호(0,1,2...)로 찾지만, 딕셔너리는 **key(열쇠)**로 값을 찾습니다.

```python
scores = {"철수": 90, "영희": 85, "민수": 70}

print(scores["영희"])         # 출력: 85
scores["철수"] = 100          # 값 변경
scores["지수"] = 95           # 새 항목 추가
print(scores)                 # 출력: {'철수': 100, '영희': 85, '민수': 70, '지수': 95}
```

## `get`

```python
scores = {"철수": 90}

# print(scores["영희"])  ← 없는 key라 에러 발생!
print(scores.get("영희"))         # 출력: None  (에러 대신 None)
print(scores.get("영희", 0))      # 출력: 0     (없으면 0으로 (기본값 지정))
```

## 개수 세기 패턴 (아주 자주 나옴)

```python
text = "banana"
count = {}
for ch in text:
    count[ch] = count.get(ch, 0) + 1   # 있으면 +1, 없으면 0에서 시작
print(count)              # 출력: {'b': 1, 'a': 3, 'n': 2}
```

## 셋 (set)

순서가 없고, **같은 값은 하나만** 담깁니다. "중복 제거"와 "빠른 포함 검사"에 씁니다.

```python
nums = [1, 2, 2, 3, 3, 3, 4]
unique = set(nums)
print(unique)             # 출력: {1, 2, 3, 4}   (중복이 사라짐)
print(len(unique))        # 출력: 4              (종류가 몇 개?)

print(3 in unique)        # 출력: True   (들어있는지 검사 — 아주 빠름)
```

> 💡 딕셔너리는 "무엇이 몇 번 나왔나", "이름으로 정보 찾기"에 필수입니다.
> 셋은 "중복 제거"와 "이미 방문했나?" 같은 검사에 씁니다. `in` 검색이 리스트보다 훨씬 빨라요.
