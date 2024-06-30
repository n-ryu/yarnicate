# Yarnicate

**_Yarnicate_** is a project that provides multiple functionalities for niddleworkers. It enables _generating, editing, and sharing of the niddlework charts_ and also sugggest _simulations and rendering system_ for your niddleworks.

## Packages

- `yarnicate/core`
- `yarnicate/service`

## Milestones

### Phase 1

- 코바늘 편물의 프로그래밍적 표현을 위한 인터페이스 구현
  - 개별 코(stitch) 의 구조(머리(top), 다리(legs), 팔(arm), 기둥(post)) 표현
  - 코의 형상(종류)에 대한 타입 정의
  - 코의 관계 및 연결 구조(`structure`) 표현
  - 코의 위치 및 치수(`dimension`) 저장
  - 코의 물성(실의 물성)(`material`) 저장
- 코바늘 도안의 저장, 불러오기 기능 구현
  - 코바늘 편물의 stringifying
  - 문자열 도안의 parsing
- 코바늘 도안의 시각적 표현 기능 구현
  - 기본 코바늘 기호를 이용한 svg 포맷의 표현

### Phase 2

- 코바늘 프로젝트 시뮬레이터 구현
  - `structure` 와 `material` 으로부터 `dimension` 을 도출하는 로직 구현
  - 이상적 형상(`geometry`) 으로부터 `structure` 와 `dimension` 을 도출하는 로직 구현
  - 주요 4요소 (`structure`, `material`, `dimension`, `geometry`) 간의 상호작용 관계 도출
- 코바늘 프로젝트 에디터 구현
  - 주요 4요소를 조절하기 위한 UX 도출
  - 실제 상호작용 가능한 라이브 렌더러 및 에디터 구현

### Phase 3

- 추가적인 렌더링 모델 구현
- 3D 도안 및 렌더링 구현
- 대바늘 및 기타 뜨개질 프로젝트로의 확장
