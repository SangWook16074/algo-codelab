# 4. 해시테이블 (hash table)

자료구조 파트의 마지막이자, 코딩테스트에서 **가장 자주 쓰이는** 자료구조입니다. 파이썬에서는 `dict`(딕셔너리)와 `set`(집합)이 바로 해시테이블이에요. 기초 문법에서 이미 만나봤지만, 여기선 **"왜 이게 마법처럼 빠른가"** 를 이해하고 무기로 씁니다.

이 한 챕터에서 배우는 것:
- 해시테이블이 어떻게 **O(1)** 로 찾는지 (원리 감 잡기)
- `dict` / `set` 을 "빠른 조회 도구"로 쓰는 법
- 대표 패턴 — **개수 세기**, **중복 찾기**, **두 수의 합**

## 왜 빠른가

리스트에서 `x in my_list`를 하면, 파이썬은 **처음부터 하나씩** 비교합니다. 원소가 100만 개면 최악의 경우 100만 번 봐요. **O(n)** 입니다.

해시테이블은 다릅니다. 값을 **해시 함수**에 통과시켜 나온 숫자로 "몇 번 칸에 넣을지"를 바로 계산합니다. 찾을 때도 같은 계산으로 **곧장 그 칸으로** 갑니다. 훑지 않아요. 그래서 **O(1)** — 원소가 몇 개든 거의 즉시입니다.

<svg viewBox="0 0 460 175" width="460" style="max-width:100%;height:auto;display:block;margin:1.5em auto;" fill="none" stroke="currentColor" stroke-width="2" font-family="sans-serif">
  <!-- key -->
  <text x="40" y="48" font-size="12" text-anchor="middle" stroke="none" fill="currentColor">key</text>
  <text x="40" y="70" font-size="14" text-anchor="middle" stroke="none" fill="currentColor" font-weight="bold">"apple"</text>
  <!-- 화살표 → 해시함수 -->
  <path d="M82 64 h33" stroke-linecap="round"/>
  <path d="M107 58 l8 6 l-8 6" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- 해시함수 박스 -->
  <rect x="120" y="44" width="90" height="40" rx="6"/>
  <text x="165" y="69" font-size="13" text-anchor="middle" stroke="none" fill="currentColor">해시함수</text>
  <!-- 화살표 → 결과 숫자 -->
  <path d="M210 64 h28" stroke-linecap="round"/>
  <path d="M230 58 l8 6 l-8 6" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="262" y="69" font-size="13" text-anchor="middle" stroke="none" fill="currentColor">= 2</text>
  <!-- 곧장 2번 칸으로 (꺾인 화살표, 인덱스 숫자 왼쪽을 지나지 않게 오른쪽 벽으로 접근) -->
  <path d="M285 76 v46 h75" stroke-linecap="round" stroke-dasharray="4 3"/>
  <path d="M352 116 l8 6 l-8 6" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- 버킷(칸들) -->
  <rect x="365" y="44"  width="75" height="30" rx="4"/>
  <rect x="365" y="76"  width="75" height="30" rx="4"/>
  <rect x="365" y="108" width="75" height="30" rx="4"/>
  <rect x="365" y="140" width="75" height="30" rx="4"/>
  <text x="357" y="64"  font-size="11" text-anchor="end" stroke="none" fill="currentColor">0</text>
  <text x="357" y="96"  font-size="11" text-anchor="end" stroke="none" fill="currentColor">1</text>
  <text x="357" y="128" font-size="11" text-anchor="end" stroke="none" fill="currentColor">2</text>
  <text x="357" y="160" font-size="11" text-anchor="end" stroke="none" fill="currentColor">3</text>
  <text x="402" y="128" font-size="13" text-anchor="middle" stroke="none" fill="currentColor" font-weight="bold">apple</text>
</svg>

```python
# 리스트: 포함 확인이 O(n) — 다 훑는다
nums_list = [3, 1, 4, 1, 5, 9]
print(9 in nums_list)      # O(n)

# 집합: 포함 확인이 O(1) — 곧장 찾는다
nums_set = {3, 1, 4, 1, 5, 9}
print(9 in nums_set)       # O(1)
```

> 💡 "이 값이 있나?"를 자주 물어봐야 하면 **리스트 대신 set**. "값에 딸린 정보를 저장하고 꺼내야 하면" **dict**. 이 선택만 잘해도 O(n)이 O(1)로 바뀌어 시간 초과를 피합니다.

작은 대가도 있습니다: 해시테이블은 **순서를 보장하려고 만든 게 아니고**(파이썬 dict는 입력 순서는 유지하지만 정렬은 아님), 칸을 넉넉히 잡느라 메모리를 리스트보다 좀 더 씁니다. 대신 얻는 속도가 압도적이라 코딩테스트의 주력 도구예요.

## dict

`dict`는 **키 → 값** 짝으로 저장합니다. 키로 곧장 값을 찾죠.

```python
age = {"철수": 20, "영희": 22}

print(age["영희"])          # 22  (O(1) 조회)
age["민수"] = 25            # 추가
print("철수" in age)        # True  (키가 있나? O(1))
print(age.get("길동", 0))   # 0  (없으면 기본값 0 — 에러 대신)
```

> 💡 `age["없는키"]`는 에러(KeyError)지만, `age.get("없는키", 기본값)`은 에러 없이 기본값을 줍니다. 개수 세기처럼 "없으면 0부터 시작"할 때 아주 유용해요.

## 대표 패턴 1

"각 글자가 몇 번 나왔나", "가장 많이 나온 원소는?" — 전형적인 dict 문제입니다.

```python
text = "banana"
count = {}
for ch in text:
    count[ch] = count.get(ch, 0) + 1   # 없으면 0, 있으면 +1

print(count)   # {'b': 1, 'a': 3, 'n': 2}
```

이 패턴이 워낙 흔해서 파이썬이 아예 도구를 줍니다 — `collections.Counter`.

```python
from collections import Counter

count = Counter("banana")
print(count)                 # Counter({'a': 3, 'n': 2, 'b': 1})
print(count.most_common(1))  # [('a', 3)]  ← 가장 많은 것
```

## 대표 패턴 2

`set`은 값만 저장하는 해시테이블입니다. **이미 봤나?** 를 O(1)로 확인할 때 씁니다.

```python
def has_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:          # 전에 본 적 있으면 → 중복!
            return True
        seen.add(x)            # 처음 보는 값 기록
    return False

print(has_duplicate([1, 2, 3, 2]))  # True
print(has_duplicate([1, 2, 3, 4]))  # False
```

앞 챕터들과 알고리즘 파트에서 계속 나올 `visited`(방문 체크)가 바로 이 set 패턴입니다. "이 노드 가봤나?"를 O(1)로 확인하죠.

## 대표 패턴 3

**리스트에서 더해서 target이 되는 두 수를 찾아라.** 순진하게 모든 쌍을 보면 O(n²)이지만, dict를 쓰면 **한 번만 훑고(O(n))** 끝납니다.

핵심 발상: 지금 수가 `x`라면, 짝은 `target - x`입니다. **필요한 짝을 이미 봤는지** dict로 확인하면 돼요.

```python
def two_sum(nums, target):
    seen = {}                      # 값 → 인덱스
    for i, x in enumerate(nums):
        need = target - x          # x의 짝
        if need in seen:           # 짝을 전에 봤으면 → 정답!
            return [seen[need], i]
        seen[x] = i                # 지금 값을 기록해 둠
    return None

print(two_sum([2, 7, 11, 15], 9))   # [0, 1]  (2 + 7 = 9)
print(two_sum([3, 2, 4], 6))        # [1, 2]  (2 + 4 = 6)
```

> 💡 "모든 쌍을 다 보기(O(n²))" 대신 **"필요한 짝을 해시테이블에 물어보기(O(n))"**. 이 전환이 해시테이블의 진짜 힘입니다. 완전탐색을 해시로 줄이는 이 패턴은 앞으로 수도 없이 만나요.

## 정리

| 하고 싶은 것 | 도구 | 시간복잡도 |
| --- | --- | --- |
| "이 값 있나?" 자주 확인 | `set` | O(1) |
| 키에 값 매달아 저장·조회 | `dict` | O(1) |
| 개수 세기 | `dict` / `Counter` | O(n) |
| 중복·방문 체크 | `set` (`seen`) | O(1) |
| 짝 찾기 (두 수의 합) | `dict` | O(n) |

> 💡 자료구조 파트를 관통하는 한 줄: **"자주 물어볼 것은 해시테이블에 넣어라."** 포함 여부(set), 딸린 정보(dict), 개수(Counter) — 전부 O(1)/O(n)으로 처리됩니다. 이제 스택·큐·덱·해시까지 갖췄으니, 다음 알고리즘 파트에서 이 도구들을 실제로 휘두르게 됩니다.

## 직접 풀어보기

1. 문자열에서 **가장 먼저 한 번만 등장하는 문자**를 찾아보세요. (힌트: `Counter`로 개수를 센 뒤, 순서대로 보며 개수가 1인 첫 문자)
2. 두 리스트의 **공통 원소**를 구해보세요. set으로 바꾼 뒤 `set1 & set2`를 쓰면 한 줄입니다.
3. `two_sum`을 응용해, 리스트에서 **합이 target인 쌍이 존재하는지**만 True/False로 답하는 함수를 만들어 보세요.
