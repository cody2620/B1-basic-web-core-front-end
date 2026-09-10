# 나를 소개하는 웹페이지 처음부터 만들기

### 개발환경
- HTML, CSS, JavaScript

### 배포 url

#
### 용어
- Hero

|  |  |
| :--- | :--- |
| 설명 | 메인 페이지 최상단의 가장 큰 비주얼 영역 like banner |
| 구성 | 메인 이미지, 동영상, 핵심 문구, CTA(Call To Action) 버튼 등  |



# 
<details>
 
<summary>기능 요구사항</summary> 
1. 프로젝트 기본 구성
- 프로젝트 폴더 구조가 최소한 다음 역할을 분리한다.

|  |  |
| :--- | :--- |
| index.html | 메인 페이지 |
| css/ | 스타일시트  |
| js/ | JavaScript 파일 |
| images/ | 이미지 파일 |

- 외부 스타일시트와 JavaScript 파일을 HTML에 올바르게 연결한다.
- VS Code + Live Server로 실시간 개발 환경을 구성한다.

2. HTML 구조 (시맨틱 마크업)
- 전체 레이아웃을 div로만 감싸지 않고, 시맨틱 태그를 사용한다.
- ``` <header> ``` ``` <nav> ``` ``` <main> ``` ``` <section> ``` ```<article>``` ``` <footer> ```

- 페이지에 다음 섹션이 포함되어야 한다.

|  |  |
| :--- | :--- |
| Hero | (인사말, CTA 버튼) |
| About | (자기소개, 프로필 이미지) |
| Skills | (기술 스택 목록) |
| Projects | (GitHub API 연동 카드) |
| Contact | (문의 폼) |
| Footer | (저작권, 소셜 링크) |

- 네비게이션에 각 섹션으로 이동하는 앵커 링크가 존재한다.
- 모든 이미지에 의미있는 alt 속성이 있다.
- 폼 요소에 ```<label>```이 올바르게 연결되어 있다. (for-id 매칭)

3. CSS 스타일링 (레이아웃 & 반응형)
- 외부 스타일시트(```css/style.css```)를 사용한다.
- CSS 변수(```:root```)로 색상, 폰트, 간격을 정의한다.
- 다크 모드용 CSS 변수를 별도로 정의한다. (```[data-theme="dark"]```)
- 레이아웃 구현:
네비게이션: Flexbox 사용 (로고 왼쪽, 메뉴 오른쪽)
Projects 카드: Grid 사용 (```auto-fit```, ```minmax```로 반응형)

- 반응형 디자인:
모바일 퍼스트로 작성한다.
브레이크포인트: 768px(태블릿), 1024px(데스크톱)
모바일에서 네비게이션이 숨겨지고 햄버거 버튼이 나타난다.

- 시각 효과:
버튼, 카드에 hover 효과 + transition 적용
카드에 box-shadow 적용

4. JavaScript 기초 (DOM & 이벤트)
- JavaScript 파일을 ```defer``` 속성으로 연결한다.
- ```var``` 대신 ```const```, ```let```만 사용한다.
- HTML에 ```onclick``` 속성을 쓰지 않고, ```addEventListener```로 이벤트를 연결한다.
- DOM 조작:
  * ```querySelector```, ```querySelectorAll```로 요소를 선택한다.
  * ```textContent```, ```innerHTML```로 내용을 변경한다.
  * ```classList.add```, ```remove```, ```toggle```로 클래스를 조작한다.

- 이벤트 처리:
  * ```click```, ```submit```, ```scroll```, ```input``` 이벤트를 다룬다.
  * ```event.preventDefault()```로 기본 동작을 방지한다.

5. 인터랙션 구현

다음 인터랙션이 모두 동작해야 한다.

- 햄버거 메뉴 토글

모바일에서 햄버거 버튼 클릭 시 메뉴가 나타난다.
다시 클릭하면 메뉴가 사라진다.
```classList.toggle('active')``` 활용

- 부드러운 스크롤
  
네비게이션 메뉴 클릭 시 해당 섹션으로 부드럽게 이동한다.

- 스크롤 탑 버튼

스크롤 300px 이상에서 버튼이 나타난다. (기준값은 자유 변경 가능하나 README에 명시)
클릭 시 페이지 맨 위로 이동한다.

- 네비게이션 스타일 변경

스크롤 60px 이상에서 네비게이션 배경색이 변경된다. (기준값은 자유 변경 가능하나 README에 명시)

- 다크 모드

토글 버튼 클릭 시 테마가 전환된다.
설정이 로컬스토리지에 저장되어 새로고침 후에도 유지된다.

- 스크롤 애니메이션
  
Intersection Observer 임계값(threshold)은 0.2 이상을 권장한다. (자유 변경 가능하나 README에 명시)

6. 폼 UX
- Contact 섹션에 문의 폼이 존재한다. (이름, 이메일, 메시지)
- 필수값 검증이 존재한다. (빈 필드 제출 불가)
- 이메일 형식 검증이 존재한다.
- 에러 메시지가 입력 필드 근처에 표시된다.
- 제출 시 ```event.preventDefault()```로 기본 동작을 방지하고, 성공 메시지를 표시한다.

7. ES6+ 문법 & 배열 메서드
- 화살표 함수를 적절히 활용한다.
- 템플릿 리터럴로 HTML을 동적으로 생성한다.
- 구조분해 할당으로 객체/배열에서 값을 추출한다.
- 배열 메서드를 활용한다.
  * ```map```: GitHub 데이터를 HTML 카드로 변환
  * ```filter```: 특정 조건의 프로젝트만 표시 (선택)
  * ```forEach```: 배열 순회

8. 비동기 처리 & API 연동
- ```fetch```와 ```async/await```로 GitHub API를 호출한다.

엔드포인트: https://api.github.com/users/{본인아이디}/repos

- 다음 상태가 UI로 표현되어야 한다.

로딩 상태: 데이터 요청 중 스피너 또는 "로딩 중..." 텍스트
성공 상태: 카드 리스트 렌더링
에러 상태: "프로젝트를 불러올 수 없습니다" 메시지 + 재시도 버튼
빈 상태: "표시할 프로젝트가 없습니다" 메시지

- ```try/catch```로 에러를 처리한다.

9. 상태 관리 패턴

"사용자 이벤트 → 상태 변경 → 화면 업데이트" 흐름이 명확해야 한다.

다음 3가지 이상의 "상태 → 렌더링" 흐름이 존재해야 한다.

- 예시 1: 다크 모드 토글 → 테마 상태 변경 → 전체 화면 스타일 변경
- 예시 2: API 호출 → 로딩/성공/에러 상태 변경 → Projects 섹션 렌더링 변경
- 예시 3: 폼 입력 → 유효성 상태 변경 → 에러 메시지 표시/숨김
- 예시 4: 필터 버튼 클릭 → 필터 상태 변경 → 프로젝트 목록 변경 (선택)

10. 배포
* GitHub Pages로 배포한다.
* 배포된 URL에서 모든 기능이 정상 동작해야 한다.
* 반응형 레이아웃
* 인터랙션 (햄버거 메뉴, 다크 모드, 스크롤 등)
* GitHub API 연동
* 폼 유효성 검사
* README에 프로젝트 설명, 사용 기술, 배포 URL, 스크린샷이 포함되어야 한다.

</details>

#
<details>

<summary> 최종 결과물 </summary>
<img width="801" height="615" alt="최종결과물" src="https://github.com/user-attachments/assets/25556fb4-ad94-460f-b388-b593e53b9e9b" />

<img width="970" height="288" alt="과제 목표" src="https://github.com/user-attachments/assets/53520686-6eea-4ad6-b06d-baec30d93b40" />
 
</details>
