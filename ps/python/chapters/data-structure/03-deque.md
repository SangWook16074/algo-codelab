# 3. 덱 (deque)

앞 챕터에서 큐를 만들 때 `deque`를 이미 써봤죠. 그런데 `deque`는 사실 큐 전용 도구가 아니라, **양쪽 끝을 자유롭게 다루는** 더 일반적인 자료구조입니다.

덱(deque)은 **Double-Ended Queue**, 즉 "양쪽 끝 큐"의 줄임말이에요. **앞뒤 어느 쪽으로도 넣고 뺄 수 있습니다.**

이 한 챕터에서 배우는 것:
- 덱이 스택·큐를 어떻게 한 번에 아우르는지
- 앞뒤 4가지 연산 (`append` / `appendleft` / `pop` / `popleft`)
- 덱이 딴 자료구조보다 편한 순간 — **회전**, **양방향 처리**

## 덱이 뭔가요?

스택은 한쪽 끝만, 큐는 한쪽으로 넣고 반대쪽으로 뺐습니다. 덱은 그 제한을 풀어서 **양쪽 끝 모두** 넣고 뺄 수 있게 한 겁니다.

즉, 덱 하나면:
- **스택처럼** 쓸 수도 있고 (한쪽 끝만 사용)
- **큐처럼** 쓸 수도 있습니다 (한쪽 넣고 반대쪽 빼기)

그래서 파이썬에서 큐가 필요하면 그냥 `deque`를 쓰는 거예요. 덱이 큐를 포함하니까요.

## 네 가지 연산

`deque`는 앞(left)과 뒤(right) 각각에 넣고 빼는 4개 연산을 **전부 O(1)** 로 제공합니다.

<svg viewBox="0 0 590 130" width="590" style="max-width:100%;height:auto;display:block;margin:1.5em auto;" fill="none" stroke="currentColor" stroke-width="2" font-family="sans-serif">
  <!-- 덱 칸들 (가운데) -->
  <rect x="240" y="45" width="60" height="40" rx="4"/>
  <rect x="310" y="45" width="60" height="40" rx="4"/>
  <rect x="380" y="45" width="60" height="40" rx="4"/>
  <text x="270" y="70" font-size="15" text-anchor="middle" stroke="none" fill="currentColor">1</text>
  <text x="340" y="70" font-size="15" text-anchor="middle" stroke="none" fill="currentColor">2</text>
  <text x="410" y="70" font-size="15" text-anchor="middle" stroke="none" fill="currentColor">3</text>
  <!-- 왼쪽 위: appendleft (칸 왼쪽 벽으로 들어감) -->
  <path d="M145 57 h90" stroke-linecap="round"/>
  <path d="M235 57 l-10 -6 v12 z" stroke="none" fill="currentColor"/>
  <text x="135" y="53" font-size="12" text-anchor="end" stroke="none" fill="currentColor">appendleft</text>
  <!-- 왼쪽 아래: popleft (칸 왼쪽 벽에서 나감) -->
  <path d="M235 73 h-90" stroke-linecap="round"/>
  <path d="M145 73 l10 -6 v12 z" stroke="none" fill="currentColor"/>
  <text x="135" y="79" font-size="12" text-anchor="end" stroke="none" fill="currentColor">popleft</text>
  <!-- 오른쪽 위: append (칸 오른쪽 벽으로 들어감) -->
  <path d="M535 57 h-90" stroke-linecap="round"/>
  <path d="M445 57 l10 -6 v12 z" stroke="none" fill="currentColor"/>
  <text x="545" y="53" font-size="12" text-anchor="start" stroke="none" fill="currentColor">append</text>
  <!-- 오른쪽 아래: pop (칸 오른쪽 벽에서 나감) -->
  <path d="M445 73 h90" stroke-linecap="round"/>
  <path d="M535 73 l-10 -6 v12 z" stroke="none" fill="currentColor"/>
  <text x="545" y="79" font-size="12" text-anchor="start" stroke="none" fill="currentColor">pop</text>
</svg>

```python
from collections import deque

dq = deque([1, 2, 3])

dq.append(4)       # 뒤로 넣기    → deque([1, 2, 3, 4])
dq.appendleft(0)   # 앞으로 넣기  → deque([0, 1, 2, 3, 4])

print(dq.pop())      # 뒤에서 빼기  → 4,  deque([0, 1, 2, 3])
print(dq.popleft())  # 앞에서 빼기  → 0,  deque([1, 2, 3])

print(dq)          # deque([1, 2, 3])
```

한 표로 정리하면:

| 위치 \ 동작 | 넣기 | 빼기 |
| --- | --- | --- |
| **앞(left)** | `appendleft(x)` | `popleft()` |
| **뒤(right)** | `append(x)` | `pop()` |

네 개 모두 **O(1)**. 리스트로 앞쪽(`insert(0, x)`, `pop(0)`)을 건드리면 O(n)이지만, 덱은 앞뒤 어디든 O(1)입니다.

## 덱이 편한 순간

### 1) 양쪽에서 뭔가를 확인/제거해야 할 때

**회문**은 앞뒤로 읽어도 같은 문자열입니다 (`"level"`, `"기러기"`). 양쪽 끝을 비교하며 안으로 좁혀가면 되는데, 덱의 `pop`/`popleft`가 딱 맞습니다.

```python
from collections import deque

def is_palindrome(s):
    dq = deque(s)
    while len(dq) > 1:
        if dq.popleft() != dq.pop():   # 맨 앞과 맨 뒤를 동시에 꺼내 비교
            return False               # 다르면 회문 아님
    return True                        # 끝까지 같았으면 회문

print(is_palindrome("level"))   # True
print(is_palindrome("hello"))   # False
```

### 2) 회전(rotate)

덱은 **회전**이 기본 기능으로 있습니다. `rotate(k)`는 뒤쪽 원소 k개를 앞으로 옮겨요. 원형으로 도는 상황(핫 포테이토, 순번 돌리기)에 유용합니다.

```python
from collections import deque

dq = deque([1, 2, 3, 4, 5])

dq.rotate(1)    # 오른쪽으로 한 칸  → deque([5, 1, 2, 3, 4])
dq.rotate(-2)   # 왼쪽으로 두 칸    → deque([2, 3, 4, 5, 1])
print(dq)
```

### 3) 최대 크기 제한

`maxlen`을 주면 정해진 개수만 유지하고, 넘치면 **반대쪽이 자동으로 밀려납니다.** "최근 3개 기록"처럼 최신 데이터만 남길 때 편해요.

```python
from collections import deque

recent = deque(maxlen=3)      # 최대 3개만 유지
for x in [1, 2, 3, 4, 5]:
    recent.append(x)
    print(recent)

# deque([1], maxlen=3)
# deque([1, 2], maxlen=3)
# deque([1, 2, 3], maxlen=3)
# deque([2, 3, 4], maxlen=3)   ← 1이 앞에서 밀려남
# deque([3, 4, 5], maxlen=3)   ← 2가 밀려남
```

## 정리

| 하고 싶은 것 | 덱으로 |
| --- | --- |
| 스택 (한쪽 끝만) | `append` / `pop` |
| 큐 (뒤로 넣고 앞에서 빼기) | `append` / `popleft` |
| 양쪽에서 처리 (회문 등) | `popleft` + `pop` |
| 순번 돌리기 | `rotate(k)` |
| 최근 N개만 유지 | `deque(maxlen=N)` |

> 💡 덱은 **스택과 큐를 한 타입으로 합친 것**이라고 보면 됩니다. 그래서 "스택/큐 중 뭘 쓸지 애매하거나 양쪽을 다 쓰고 싶다" 싶으면 그냥 `deque`. 앞뒤 O(1)이 공짜로 따라옵니다.

## 직접 풀어보기

1. `deque`를 **스택처럼만** 써서(오른쪽 `append`/`pop`) 앞 챕터의 괄호 검사를 다시 구현해 보세요. 리스트 스택과 코드가 거의 같음을 확인하면 됩니다.
2. `rotate`를 이용해 리스트 `[1,2,3,4,5]`를 **오른쪽으로 3칸** 회전시킨 결과를 만들어 보세요. (정답: `[3, 4, 5, 1, 2]`)
3. `maxlen=5`인 덱으로, 숫자 스트림을 받으며 **항상 최근 5개의 평균**을 출력하는 코드를 작성해 보세요.
