# 6. 슬라이딩 윈도우

투 포인터의 특수형입니다. **고정 또는 가변 크기의 "창(window)"을 미끄러뜨리며** 구간을 갱신해, 매번 다시 계산하지 않고 들어온 값·나간 값만 반영합니다. 지하철 창밖 풍경처럼, 창은 그대로인데 그 안에 보이는 구간만 한 칸씩 옆으로 흐르는 거예요.

이 한 챕터에서 배우는 것:
- **고정 크기 윈도우**로 연속 부분합의 최댓값을 O(n)에 구하기
- **가변 크기 윈도우**로 조건을 만족하는 최소/최대 구간 찾기
- 매번 다시 더하지 않고 **들어온 값·나간 값만 갱신**하는 발상
- 앞서 배운 **누적합(04)·투 포인터(05)** 와 어떻게 이어지는지

## 왜 윈도우인가?

배열에서 **연속된 3칸의 합이 가장 큰 곳**을 찾는다고 해봅시다.

```
[2, 1, 5, 1, 3, 2]
 └──┬──┘              → 2+1+5 = 8
    └──┬──┘           → 1+5+1 = 7
       └──┬──┘        → 5+1+3 = 9   ← 최대
          └──┬──┘     → 1+3+2 = 6
```

가장 단순한 풀이는 "모든 시작점마다 3칸을 다시 더하기"입니다.

```python
def max_sum_brute(arr, k):
    best = arr[0]
    for start in range(len(arr) - k + 1):
        s = sum(arr[start:start + k])   # 매번 k칸을 새로 더함
        best = max(best, s)
    return best

nums = [2, 1, 5, 1, 3, 2]
print(max_sum_brute(nums, 3))   # 9
```

시작점이 약 n개, 매번 k칸을 더하니 **O(n·k)** 입니다. k가 크면 느려요. 소수 챕터에서 했던 것처럼, 일단 무식하게 풀었으니 이제 **관찰로 줄일** 차례입니다.

## 고정 크기 윈도우: 들어온 값, 나간 값

관찰: **옆 윈도우로 한 칸 이동하면, 대부분의 값은 그대로**입니다.

`[2,1,5]` → `[1,5,1]`로 갈 때, `1`과 `5`는 두 윈도우에 공통으로 들어있어요. 바뀐 건 **맨 앞 `2`가 빠지고, 맨 뒤 `1`이 새로 들어온 것뿐**입니다.

그러니 합을 처음부터 다시 더할 필요가 없습니다.

```
새 합 = 이전 합 + (새로 들어온 값) − (빠져나간 값)
```

<svg viewBox="0 0 360 150" width="360" style="max-width:100%;height:auto;display:block;margin:1.5em auto;" xmlns="http://www.w3.org/2000/svg">
  <g font-family="sans-serif" font-size="15" text-anchor="middle" fill="currentColor">
    <text x="30" y="30">2</text>
    <text x="80" y="30">1</text>
    <text x="130" y="30">5</text>
    <text x="180" y="30">1</text>
    <text x="230" y="30">3</text>
    <text x="280" y="30">2</text>
  </g>
  <rect x="10" y="45" width="140" height="30" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
  <rect x="60" y="90" width="140" height="30" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
  <g font-family="sans-serif" font-size="12" text-anchor="middle" fill="currentColor">
    <text x="30" y="140">나감</text>
    <text x="180" y="140">들어옴</text>
  </g>
  <path d="M30 78 L30 128 L34 120 L26 120 Z" fill="currentColor"/>
  <path d="M180 43 L180 128 L184 120 L176 120 Z" fill="currentColor"/>
</svg>

```python
def max_sum_window(arr, k):
    window = sum(arr[:k])       # 첫 윈도우 합만 한 번 계산
    best = window
    for i in range(k, len(arr)):
        window += arr[i]        # 새로 들어온 값
        window -= arr[i - k]    # 빠져나간 값 (k칸 뒤)
        best = max(best, window)
    return best

print(max_sum_window([2, 1, 5, 1, 3, 2], 3))   # 9
```

이제 한 칸 이동할 때 **덧셈 한 번, 뺄셈 한 번**뿐입니다. 전체가 **O(n)**. k가 아무리 커도 상관없어요. 무식한 O(n·k)에서 창을 미끄러뜨리는 발상 하나로 O(n)이 됐습니다.

> 💡 `arr[i - k]`가 "빠져나가는 값"인 이유: 지금 `arr[i]`를 넣으면 윈도우 크기가 k+1이 되니까, 정확히 k칸 뒤에 있는 `arr[i-k]`를 빼야 다시 k칸이 됩니다.

## 누적합과 무엇이 다를까?

누적합 챕터(04)에서 배운 도구로도 이 문제를 풀 수 있습니다. `prefix[i] = arr[0..i-1]의 합`을 미리 만들어두면, 구간 합을 뺄셈으로 꺼낼 수 있죠.

```python
def max_sum_prefix(arr, k):
    prefix = [0]
    for x in arr:
        prefix.append(prefix[-1] + x)   # 누적합 배열
    best = arr[0]
    for i in range(k, len(prefix)):
        best = max(best, prefix[i] - prefix[i - k])   # 구간 합을 O(1)로
    return best

print(max_sum_prefix([2, 1, 5, 1, 3, 2], 3))   # 9
```

둘 다 O(n)이고 결과도 같습니다. 차이는 이렇습니다.

- **누적합**: 배열을 하나 더 만들어(O(n) 공간) 두고, **아무 구간이나** 즉시 꺼낸다. 구간이 이리저리 바뀔 때 유리.
- **슬라이딩 윈도우**: 별도 배열 없이 **값 하나(`window`)만 유지**하며 흐른다. 구간이 "옆으로만 이동"할 때 딱 맞고 메모리도 아낀다.

> 💡 "구간이 한 방향으로만 미끄러진다" 싶으면 슬라이딩 윈도우, "여기저기 임의 구간 합을 자주 물어본다" 싶으면 누적합. 같은 뺄셈 발상의 두 얼굴이에요.

## 가변 크기 윈도우: 조건을 만족하는 최소 구간

고정 크기는 창 너비가 정해져 있었죠. 이번엔 **너비가 변합니다.**

문제: 양수 배열에서 **합이 target 이상이 되는 가장 짧은 연속 구간의 길이**를 구하라.

여기서 투 포인터 챕터(05)에서 본 **같은 방향 두 포인터**가 등장합니다. `right`로 창을 **넓히고**, 조건을 만족하면 `left`로 창을 **좁힙니다.**

```python
def min_len_subarray(arr, target):
    left = 0
    total = 0
    best = float('inf')
    for right in range(len(arr)):
        total += arr[right]             # 오른쪽 확장: 값이 들어옴
        while total >= target:          # 조건 만족? 그럼 최대한 줄여본다
            best = min(best, right - left + 1)
            total -= arr[left]          # 왼쪽 축소: 값이 나감
            left += 1
    return best if best != float('inf') else 0

print(min_len_subarray([2, 3, 1, 2, 4, 3], 7))   # 2   ([4, 3])
print(min_len_subarray([1, 1, 1, 1], 7))         # 0   (불가능)
```

`right`는 처음부터 끝까지 한 번, `left`도 전체를 통틀어 한 번만 앞으로 갑니다. 두 포인터가 각자 최대 n칸 이동하니 **O(n)** 이에요. 겉보기엔 이중 반복(`for` 안의 `while`) 같지만, `left`가 되돌아가지 않기 때문에 곱해지지 않습니다.

> 💡 이게 투 포인터가 O(n)인 핵심 이유입니다. `left`와 `right`는 **절대 뒤로 가지 않아요.** 각 원소는 창에 딱 한 번 들어오고(`right`), 딱 한 번 나갑니다(`left`). 그래서 총 이동이 2n 이하.

## 언제 넓히고 언제 좁히나?

가변 윈도우의 핵심은 **좁히는 조건**을 어떻게 잡느냐입니다. 목표에 따라 방향이 정반대예요.

- **최소 구간** (조건 이상을 만족하는 가장 짧은 것): 조건을 **만족하는 동안 계속 좁힌다.** 위 예시.
- **최대 구간** (조건을 어기지 않는 가장 긴 것): 조건을 **어기는 동안 좁힌다.**

두 번째 유형을 봅시다. **중복 없는 가장 긴 부분 문자열**의 길이를 구하는 문제예요. "같은 글자가 창 안에 두 번 들어오면 규칙 위반"이니, 위반이 풀릴 때까지 `left`를 밀어냅니다.

```python
def longest_unique(s):
    last = {}          # 글자 → 마지막으로 본 위치
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in last and last[ch] >= left:
            left = last[ch] + 1     # 중복 글자 '다음'으로 왼쪽 점프
        last[ch] = right
        best = max(best, right - left + 1)
    return best

print(longest_unique("abcabcbb"))   # 3   ("abc")
print(longest_unique("bbbbb"))      # 1   ("b")
print(longest_unique("pwwkew"))     # 3   ("wke")
```

`left = last[ch] + 1`처럼 왼쪽을 한 번에 점프시키는 것도 슬라이딩 윈도우에서 자주 쓰는 최적화입니다. 한 칸씩 좁히나 한 번에 뛰나 각 원소는 여전히 창을 한 번씩만 드나들어 **O(n)** 이에요. (`딕셔너리` 조회는 소수 챕터의 `set`처럼 평균 O(1))

## 정리

| 유형 | 창 크기 | 핵심 동작 | 시간복잡도 |
| --- | --- | --- | --- |
| 무식한 부분합 | 고정 | 매 시작점마다 다시 합산 | O(n·k) |
| 고정 윈도우 | 고정 | 들어온 값 더하고 나간 값 빼기 | O(n) |
| 가변 윈도우 | 변함 | `right`로 넓히고 조건 따라 `left`로 좁히기 | O(n) |

> 💡 슬라이딩 윈도우 = **투 포인터(같은 방향) + 누적 상태 갱신.** 투 포인터가 "두 인덱스를 어떻게 움직이나"라면, 슬라이딩 윈도우는 거기에 "창 안의 요약값(합·개수·최댓값)을 들어온/나간 것만으로 갱신한다"를 얹은 것입니다.

> 💡 문제에서 **"연속된", "부분 배열/문자열", "구간"** 이라는 말이 보이고, 그 구간이 한 방향으로 흐를 수 있으면 슬라이딩 윈도우를 의심하세요. 소수 챕터의 "무식하게 → 관찰 → 줄이기" 흐름 그대로입니다.

## 직접 풀어보기

1. 크기 `k=4`인 연속 구간의 **최대 평균**을 구하세요. `[1, 12, -5, -6, 50, 3]`에서 고정 윈도우로 최대 합(51)을 구한 뒤 k로 나누면 됩니다. (정답: 12.75)
2. 양수 배열에서 **합이 정확히 `target`인 연속 구간의 개수**를 세보세요. `total > target`이면 `left`를 밀고, `total == target`일 때 세면 됩니다. (`[1, 2, 1, 2, 1]`, target 3 → 정답: 4개)
3. 정수 배열에서 **서로 다른 값이 최대 2종류까지만** 담기는 가장 긴 연속 구간의 길이를 구하세요. 힌트: 딕셔너리로 창 안 각 값의 개수를 세다가, 종류가 3개가 되면 `left`를 밀어 다시 2종류로 만듭니다. (`[1, 2, 1, 2, 3, 3, 1]` → 정답: 4)
