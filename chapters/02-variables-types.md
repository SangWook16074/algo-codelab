# 2. 변수와 자료형

**변수**는 값을 담아두는 상자입니다. `=`로 값을 넣습니다. (수학의 '같다'가 아니라 '담는다'예요.)

```python
age = 20              # 정수 (int)
height = 175.5        # 실수 (float)
name = "영희"         # 문자열 (str)
is_student = True     # 참/거짓 (bool) — True 또는 False
```

## 자료형 확인: `type()`

```python
print(type(20))       # 출력: <class 'int'>
print(type(3.14))     # 출력: <class 'float'>
print(type("hi"))     # 출력: <class 'str'>
print(type(True))     # 출력: <class 'bool'>
```

## 형변환 (타입 바꾸기)

```python
print(int("100"))     # 출력: 100    (글자 → 정수)
print(str(100))       # 출력: 100    (정수 → 글자, 겉보기는 같아도 이제 문자열)
print(float("3.5"))   # 출력: 3.5    (글자 → 실수)
print(int(3.9))       # 출력: 3      (실수 → 정수, 소수점 아래는 그냥 버림)
```

> 💡 입력은 항상 문자열로 들어오니 형변환은 필수입니다.
> "글자 5"와 "숫자 5"는 완전히 다르다는 걸 몸으로 기억하세요.
