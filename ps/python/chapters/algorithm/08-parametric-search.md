# 8. 파라메트릭 서치

이진 탐색의 응용입니다. "값을 찾는" 게 아니라 **"조건을 만족하는 최대/최소 답을 이진 탐색한다"** 는 발상 전환이에요. "~이 가능한 가장 큰 값은?" 류 문제의 핵심 무기입니다.

앞 챕터에서 배운 이진 탐색은 *정렬된 배열*에서 특정 값을 O(log n)에 찾았죠. 파라메트릭 서치는 그 무대를 배열이 아니라 **답이 될 수 있는 값들의 범위(1, 2, 3, ..., 최댓값)** 로 옮깁니다. 배열 인덱스를 반씩 줄이던 그 기술을, 이번엔 "정답 후보"를 반씩 줄이는 데 그대로 씁니다.

이 한 챕터에서 배우는 것:
- 최적화 문제를 **결정 문제("가능? 불가능?")** 로 바꾸는 발상
- 그 결정을 판별하는 **판별 함수(결정 함수)** 짜기
- 답의 범위 위에서 이진 탐색을 돌려 **최대/최소 답**을 찾는 틀
- 대표 유형(랜선 자르기, 나무 자르기)을 처음부터 끝까지 구현

## 왜 그냥 이진 탐색으로 안 되나요?

이런 문제를 봅시다.

> 길이가 제각각인 랜선 여러 개가 있다. 이걸 잘라 **똑같은 길이의 랜선 K개**를 만들고 싶다. 만들 수 있는 **최대 길이**는?

찾으려는 답(랜선 길이)이 배열 어딘가에 놓여 있는 게 아닙니다. 1cm, 2cm, 3cm ... 처럼 **연속된 후보들** 중 하나예요. "정렬된 배열에서 값 찾기"가 아니라 **"수많은 후보 길이 중 최적을 고르기"** 인 거죠.

그냥 1부터 최대 길이까지 다 시도하면 답은 나오지만, 최대 길이가 10억이면 10억 번. **O(답의 범위)** 라 시간 초과입니다. 여기서 이진 탐색을 끌어옵니다.

## 핵심 발상: 최적화 문제를 결정 문제로 바꾸기

"만들 수 있는 **최대** 길이는?" (최적화 문제)는 답이 하나로 안 떨어져서 이진 탐색하기 어렵습니다. 그래서 질문을 아래처럼 **예/아니오로 답하는 결정 문제**로 바꿉니다.

> "길이 `x`로 자르면 랜선 K개를 만들 수 있나? (예/아니오)"

이렇게 바꾸면 마법 같은 성질이 하나 생깁니다. **단조성(monotonic)** 이에요.

- `x`가 **작으면** 조각을 많이 만들 수 있으니 → 대체로 **가능(예)**
- `x`가 **커지면** 조각 수가 줄어드니 → 어느 순간부터 **불가능(아니오)**

즉 "가능 / 가능 / 가능 / ... / **가능** / 불가능 / 불가능 / ..." 처럼 **예가 쭉 이어지다 아니오로 딱 한 번 바뀝니다.** 우리가 찾는 답은 바로 그 **경계, "예"의 마지막 지점**이에요.

<svg viewBox="0 0 420 90" width="420" style="max-width:100%;height:auto;display:block;margin:1.5em auto;" fill="none" stroke="currentColor" stroke-width="2">
  <rect x="10"  y="30" width="50" height="40"/>
  <rect x="60"  y="30" width="50" height="40"/>
  <rect x="110" y="30" width="50" height="40"/>
  <rect x="160" y="30" width="50" height="40"/>
  <rect x="210" y="30" width="50" height="40"/>
  <rect x="260" y="30" width="50" height="40"/>
  <rect x="310" y="30" width="50" height="40"/>
  <rect x="360" y="30" width="50" height="40"/>
  <text x="35"  y="56" text-anchor="middle" stroke="none" fill="currentColor" font-size="16">예</text>
  <text x="85"  y="56" text-anchor="middle" stroke="none" fill="currentColor" font-size="16">예</text>
  <text x="135" y="56" text-anchor="middle" stroke="none" fill="currentColor" font-size="16">예</text>
  <text x="185" y="56" text-anchor="middle" stroke="none" fill="currentColor" font-size="16">예</text>
  <text x="235" y="56" text-anchor="middle" stroke="none" fill="currentColor" font-size="16">예</text>
  <text x="285" y="56" text-anchor="middle" stroke="none" fill="currentColor" font-size="16">아니오</text>
  <text x="335" y="56" text-anchor="middle" stroke="none" fill="currentColor" font-size="16">아니오</text>
  <text x="385" y="56" text-anchor="middle" stroke="none" fill="currentColor" font-size="16">아니오</text>
  <path d="M235 18 L228 6 L242 6 Z" fill="currentColor" stroke="none"/>
  <text x="235" y="90" text-anchor="middle" stroke="none" fill="currentColor" font-size="13">여기가 답</text>
</svg>

> 💡 "정렬돼 있어야 이진 탐색이 된다"고 배웠죠. 파라메트릭 서치에서 그 "정렬"에 해당하는 게 바로 이 **단조성**입니다. 예→아니오 순서가 뒤섞이지 않고 한 번만 바뀌기 때문에 반씩 버려도 안전한 거예요.

## 1단계: 판별 함수부터 만들기

파라메트릭 서치의 절반은 **판별 함수(결정 함수)** 입니다. "이 답 후보가 조건을 만족하나?"를 계산하는 함수죠. 랜선 문제라면 "길이 `length`로 자르면 랜선 몇 개가 나오나?"입니다.

```python
def count_lan(lines, length):
    if length == 0:
        return 0           # 0으로 자를 순 없음 (나눗셈 오류 방지)
    total = 0
    for line in lines:
        total += line // length   # 이 랜선에서 나오는 조각 수
    return total

lines = [802, 743, 457, 539]
print(count_lan(lines, 200))   # 11   (4 + 3 + 2 + 2)
print(count_lan(lines, 201))   # 10   (길이를 1 늘렸더니 1개 줄었다)
```

`802 // 200 = 4`, `743 // 200 = 3`, `457 // 200 = 2`, `539 // 200 = 2` → 합 11. 파이썬의 `//`(몫)이 "이 길이로 몇 조각 나오나"를 그대로 계산해 줍니다.

여기서 앞서 말한 단조성이 눈에 보입니다. `length`가 200 → 201로 **커지자** 조각 수가 11 → 10으로 **줄었죠.** 길이가 커질수록 조각 수는 절대 늘지 않습니다. 이게 이진 탐색을 쓸 수 있는 근거입니다.

## 2단계: 답의 범위를 이진 탐색

이제 답(랜선 길이)이 될 수 있는 범위를 정하고, 그 위에서 이진 탐색합니다.

- 가장 짧은 후보 `left = 1`
- 가장 긴 후보 `right = max(lines)` (제일 긴 랜선보다 길게 자를 순 없으니까)

`mid` 길이로 잘라 봐서 K개 **이상** 나오면 "이 길이는 가능"이니 답 후보로 저장하고 **더 길게**(`left = mid + 1`) 욕심냅니다. 모자라면 길이를 **줄입니다**(`right = mid - 1`).

```python
def count_lan(lines, length):
    if length == 0:
        return 0
    return sum(line // length for line in lines)

def max_lan_length(lines, k):
    left, right = 1, max(lines)
    answer = 0
    while left <= right:
        mid = (left + right) // 2
        if count_lan(lines, mid) >= k:   # mid 길이로 k개 이상 만들 수 있으면
            answer = mid                 # 이 길이는 가능! 후보로 저장해 두고
            left = mid + 1               # 더 길게 잘라 보자 (욕심)
        else:
            right = mid - 1              # 너무 길어서 모자란다, 줄이자
    return answer

lines = [802, 743, 457, 539]
print(max_lan_length(lines, 11))   # 200
```

`right`가 아니라 **`answer`에 정답을 따로 모아두는** 게 포인트입니다. "가능한(예) 값 중 가장 큰 것"을 만날 때마다 `answer`를 갱신하니, 반복이 끝나면 `answer`에 경계값(예의 마지막)이 남습니다.

> 💡 최댓값을 찾을 땐 `>=`가 참일 때 `answer = mid; left = mid + 1`. 반대로 **최솟값**을 찾는 문제(예: "K명이 다 태우려면 필요한 최소 버스 크기")라면 조건이 참일 때 `answer = mid; right = mid - 1`로 **더 작게** 욕심내면 됩니다. 방향만 뒤집으면 그대로 재활용돼요.

## 시간복잡도

- 판별 함수 `count_lan` 한 번: 랜선 개수 N에 비례 → **O(N)**
- 이진 탐색 반복 횟수: 답의 범위(최대 길이 M)를 반씩 줄이니 → **O(log M)**
- 전체: **O(N log M)**

랜선이 만개(N=10,000)이고 최대 길이가 10억(M=10⁹)이라 해도, `log₂(10⁹) ≈ 30`. 대략 10,000 × 30 = **30만 번**이면 끝납니다. 앞의 "1부터 다 시도"가 10억 번이었던 걸 떠올리면 어마어마한 차이예요.

> 💡 소수 챕터의 "무식하게 다 해보기(O(M)) → 관찰로 범위 줄이기"를 기억하죠? 파라메트릭 서치도 똑같은 이야기입니다. 답 후보를 하나씩 다 넣어보던 O(M)을, 단조성이라는 관찰 덕에 O(log M)으로 접는 겁니다.

## 3단계: 판박이 유형, 나무 자르기

한 번 틀을 익히면 옷만 갈아입은 문제들이 쏟아집니다. 대표적인 게 **나무 자르기**예요.

> 높이 `H`의 절단기로 나무들을 자르면, `H`보다 큰 부분만 잘려 나온다. 잘린 나무의 **합**이 최소 `M` 이상이 되게 하는 **절단기의 최대 높이**는?

바뀐 건 판별 함수뿐입니다. "잘린 나무의 총합"을 계산하면 돼요. 높이가 낮을수록 많이 잘려 총합이 크고, 높을수록 적게 잘리니 여기서도 단조성이 성립합니다.

```python
def total_wood(trees, height):
    total = 0
    for tree in trees:
        if tree > height:
            total += tree - height   # 잘려 나온 윗부분 길이
    return total

def max_cut_height(trees, m):
    left, right = 0, max(trees)      # 높이는 0까지 내려갈 수 있음
    answer = 0
    while left <= right:
        mid = (left + right) // 2
        if total_wood(trees, mid) >= m:  # mid 높이로 잘라 m 이상 얻으면
            answer = mid                 # 가능! 더 높게 (덜 자르게) 시도
            left = mid + 1
        else:
            right = mid - 1              # 나무가 부족하다, 높이를 낮추자
    return answer

trees = [20, 15, 10, 17]
print(total_wood(trees, 15))    # 7    (5 + 0 + 0 + 2)
print(max_cut_height(trees, 7)) # 15
```

`max_lan_length`와 뼈대가 **완전히 똑같죠?** `left/right` 초기값과 판별 함수 두 곳만 문제에 맞게 갈아 끼웠습니다. 이 골격이 파라메트릭 서치 문제의 90%를 커버합니다.

> 💡 나무 높이는 아예 안 자를 수도 있어서 `left = 0`부터 시작합니다. 랜선은 길이가 0이면 조각이 무한대라 의미가 없어 `left = 1`이었고요. **범위의 시작점을 문제 상황에 맞게 잡는 것**, 이 사소해 보이는 결정이 은근히 함정입니다.

## 정리

| 단계 | 하는 일 | 핵심 |
| --- | --- | --- |
| 1. 결정 문제로 변환 | "최대 X는?" → "X면 가능?" | 답에 **단조성**이 생김 |
| 2. 판별 함수 작성 | 후보가 조건을 만족하나 계산 | 보통 O(N)짜리 반복 |
| 3. 답 범위 이진 탐색 | `left/right/mid`로 반씩 버리기 | `answer`에 경계값 저장 |

| 접근 | 시간복잡도 | 비고 |
| --- | --- | --- |
| 답 후보 전부 시도 | O(N·M) | M이 크면 시간 초과 |
| 파라메트릭 서치 | O(N log M) | 단조성이 성립할 때 |

> 💡 문제에서 **"~할 수 있는 최대/최소 값"**, **"~을 만족하는 가장 큰/작은 ~"** 같은 말이 보이고, "답을 키우면 점점 불리(또는 유리)해진다"는 단조성이 느껴지면 파라메트릭 서치를 의심하세요. 이진 탐색을 *배열*이 아니라 *답의 범위* 위에서 돌린다는 것, 이 한 줄이 전부입니다.

## 직접 풀어보기

1. 위 랜선 예제 `lines = [802, 743, 457, 539]`에서 **K=13개**를 만들 최대 길이를 구해 보세요. (정답: 179)
2. `max_cut_height`를 이용해 `trees = [4, 42, 40, 26, 46]`, `M=20`일 때 절단기 최대 높이를 구해 보세요. (정답: 36)
3. "N명을 태우려 한다. 한 번에 최대 X명 태우는 버스로 T번 안에 다 태우려면 필요한 최소 X는?" 이 문제를 파라메트릭 서치로 설계해 보세요. (힌트: 판별 함수는 `sum(필요한 운행 횟수)`, 이번엔 **최솟값**이니 조건이 참일 때 `right = mid - 1`로 더 작게 욕심냅니다.)
