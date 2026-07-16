# 1. 스택 (stack)

여기서부터는 **자료구조**입니다. 자료구조는 "데이터를 어떤 규칙으로 담고 꺼내느냐"의 이야기예요. 규칙만 정하면 나머지는 그 규칙이 알아서 문제를 풀어줍니다.

스택의 규칙은 딱 하나: **나중에 넣은 걸 먼저 꺼낸다 (LIFO, Last In First Out).**

이 한 챕터에서 배우는 것:
- 스택이 뭔지, 왜 리스트로 충분한지
- `append` / `pop` 으로 스택 쓰는 법
- 스택이 딱 맞는 대표 문제 — **괄호 검사**, **되돌리기**

## 스택이 뭔가요?

접시를 쌓는다고 생각해 보세요. 위에 하나씩 **쌓고(push)**, 꺼낼 때는 **맨 위부터(pop)** 꺼냅니다. 가장 아래 접시는 가장 마지막에 나오죠.

이렇게 **한쪽 끝에서만 넣고 빼는** 구조가 스택입니다.

- **push** : 맨 위에 하나 넣기
- **pop** : 맨 위 하나 꺼내기 (그리고 지우기)
- **top / peek** : 맨 위를 꺼내지 않고 보기만

<svg viewBox="0 0 300 235" width="300" style="max-width:100%;height:auto;display:block;margin:1.5em auto;" fill="none" stroke="currentColor" stroke-width="2" font-family="sans-serif">
  <!-- push 화살표 (맨 위 칸 벽으로 내려꽂힘) -->
  <text x="70" y="16" font-size="13" text-anchor="middle" stroke="none" fill="currentColor">push</text>
  <path d="M70 24 v26" stroke-linecap="round"/>
  <path d="M63 44 l7 8 l7 -8 z" stroke="none" fill="currentColor"/>
  <!-- pop 화살표 (맨 위 칸 벽에서 위로 뽑힘) -->
  <path d="M130 50 v-26" stroke-linecap="round"/>
  <path d="M123 30 l7 -8 l7 8 z" stroke="none" fill="currentColor"/>
  <text x="130" y="16" font-size="13" text-anchor="middle" stroke="none" fill="currentColor">pop</text>
  <!-- top 라벨 -->
  <text x="215" y="72" font-size="12" text-anchor="start" stroke="none" fill="currentColor">← top</text>
  <!-- 쌓인 칸들 -->
  <rect x="50" y="55"  width="100" height="34" rx="4"/>
  <rect x="50" y="95"  width="100" height="34" rx="4"/>
  <rect x="50" y="135" width="100" height="34" rx="4"/>
  <rect x="50" y="175" width="100" height="34" rx="4"/>
  <text x="100" y="77"  font-size="14" text-anchor="middle" stroke="none" fill="currentColor">3</text>
  <text x="100" y="117" font-size="14" text-anchor="middle" stroke="none" fill="currentColor">2</text>
  <text x="100" y="157" font-size="14" text-anchor="middle" stroke="none" fill="currentColor">1</text>
  <text x="100" y="197" font-size="14" text-anchor="middle" stroke="none" fill="currentColor">0</text>
</svg>

## 파이썬에선 그냥 리스트

파이썬은 스택을 위한 별도 타입이 필요 없습니다. **리스트가 곧 스택**이에요. 리스트의 끝(오른쪽)이 스택의 "맨 위"입니다.

```python
stack = []

stack.append(1)    # push  → [1]
stack.append(2)    # push  → [1, 2]
stack.append(3)    # push  → [1, 2, 3]

print(stack[-1])   # top(맨 위 보기)  → 3

print(stack.pop()) # pop  → 3,  stack = [1, 2]
print(stack.pop()) # pop  → 2,  stack = [1]
print(stack)       # [1]
```

> 💡 `append`와 `pop`은 리스트 **끝**에서 일어나서 **O(1)** (즉시)입니다. 반대로 `pop(0)`처럼 리스트 **앞**을 건드리면 뒤의 원소가 전부 밀려서 O(n)이 돼요. 스택은 항상 끝만 쓰기 때문에 리스트로 충분합니다.

빈 스택에서 `pop`을 하면 에러가 나므로, 꺼내기 전에 비었는지 확인하는 습관을 들이세요.

```python
if stack:              # 비어있지 않으면 (빈 리스트는 False)
    x = stack.pop()
```

## 스택은 언제 쓰나

스택이 빛나는 순간은 **가장 최근 것부터 처리해야 할 때**입니다. 대표적인 게 괄호 검사예요.

### 대표 문제

`"(())"`는 올바르고 `"(()"`나 `")("`는 틀립니다. 사람은 눈으로 짝을 맞추지만, 컴퓨터는 스택으로 맞춥니다.

**여는 괄호가 나오면 쌓고, 닫는 괄호가 나오면 맨 위와 짝을 맞춰 꺼낸다.**

```python
def is_valid(s):
    stack = []
    for ch in s:
        if ch == '(':
            stack.append(ch)      # 여는 괄호 → 쌓기
        else:                     # 닫는 괄호 ')'
            if not stack:         # 짝지을 게 없으면 → 틀림
                return False
            stack.pop()           # 맨 위 '(' 와 짝 맞춰 제거
    return not stack              # 다 처리하고 남은 게 없어야 올바름

print(is_valid("(())"))   # True
print(is_valid("(()"))    # False  (끝에 '(' 가 남음)
print(is_valid(")("))     # False  (첫 ')' 에서 스택이 비어있음)
```

핵심은 두 가지 실패 조건입니다:
- 닫는 괄호인데 **스택이 비어있다** → 짝지을 여는 괄호가 없음
- 문자열을 다 봤는데 **스택이 안 비었다** → 짝 못 지은 여는 괄호가 남음

> 💡 괄호가 여러 종류(`()`, `{}`, `[]`)면, 스택에 여는 괄호를 그대로 넣어두고 닫을 때 **맨 위가 같은 짝인지** 확인하면 됩니다. "가장 최근에 연 괄호부터 닫혀야 한다"는 규칙이 곧 LIFO거든요.

### 또 하나

편집기의 Ctrl+Z를 떠올려 보세요. 방금 한 동작을 스택에 쌓아두면, 되돌릴 때 **가장 최근 것부터** 꺼내집니다. "최근 것부터 되돌린다"가 정확히 스택입니다.

```python
history = []
history.append("타이핑: 안녕")
history.append("타이핑: 하세요")

# Ctrl+Z → 가장 최근 동작을 되돌림
undo = history.pop()
print("되돌림:", undo)   # 되돌림: 타이핑: 하세요
```

## 정리

| 연산 | 코드 | 시간복잡도 |
| --- | --- | --- |
| push (넣기) | `stack.append(x)` | O(1) |
| pop (꺼내기) | `stack.pop()` | O(1) |
| top (맨 위 보기) | `stack[-1]` | O(1) |
| 비었는지 확인 | `if not stack:` | O(1) |

> 💡 스택은 "가장 최근 것부터 처리"라는 규칙 하나예요. **괄호·짝 맞추기, 되돌리기, 나중에 다룰 DFS(깊이 우선 탐색)** 가 전부 이 규칙 위에서 돌아갑니다. 파이썬에선 리스트의 `append`/`pop`이면 끝.

## 직접 풀어보기

1. `"{[()]}"`처럼 **여러 종류의 괄호**가 올바르게 짝지어졌는지 검사하는 함수를 만들어 보세요. (힌트: 여는 괄호를 스택에 넣고, 닫을 때 맨 위와 짝이 맞는지 확인)
2. 문자열에서 **연속으로 중복된 문자를 제거**해 보세요. 예: `"aaabbbc"` → 스택에 넣을 때 맨 위와 같으면 넣지 않기.
3. 숫자와 연산자가 섞인 **후위 표기식**(예: `"3 4 +"` → 7)을 스택으로 계산해 보세요. 숫자는 쌓고, 연산자를 만나면 위에서 둘을 꺼내 계산 후 다시 넣기.
