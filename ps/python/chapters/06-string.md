# 6. 문자열 (string)

문자열도 리스트처럼 **글자들이 순서대로** 있는 형태라, 인덱싱/슬라이싱이 똑같이 됩니다.

## 인덱싱과 슬라이싱

```python
s = "algorithm"

print(s[0])           # 출력: a
print(s[-1])          # 출력: m
print(s[0:4])         # 출력: algo
print(len(s))         # 출력: 9
```

## 자주 쓰는 메서드

```python
s = "hello world"

print(s.upper())          # 출력: HELLO WORLD  (대문자)
print(s.lower())          # 출력: hello world  (소문자)
print(s.replace("o", "0"))# 출력: hell0 w0rld  (바꾸기)
print(s.split())          # 출력: ['hello', 'world']  (공백으로 자르기)
print(s.count("l"))       # 출력: 3   (l의 개수)
```

## `join` — 리스트를 문자열로 합치기 (split의 반대)

```python
words = ["a", "b", "c"]
print("".join(words))     # 출력: abc
print("-".join(words))    # 출력: a-b-c   (사이에 - 를 끼워서 합침)
```

## 문자 ↔ 숫자(아스키 코드) — `ord` / `chr`

문자를 숫자로 다뤄야 하는 문제(암호화, 알파벳 순서 계산 등)에서 씁니다.

```python
print(ord("A"))       # 출력: 65    (문자 → 숫자)
print(ord("a"))       # 출력: 97
print(chr(65))        # 출력: A     (숫자 → 문자)
print(chr(ord("A") + 1))  # 출력: B  (A 다음 글자)
```

> 💡 문자열 뒤집기 `s[::-1]`, 대소문자 변환, 특정 문자 세기, 알파벳 순서 계산은 문자열 문제 단골입니다.
> `join`과 `split`은 짝으로 기억하세요. (자르기 ↔ 합치기)
