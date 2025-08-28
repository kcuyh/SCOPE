import styles from "./scope-landing.module.css";

/**
 * SCOPE 랜딩(모바일) 화면
 * - onStart: "지금 탐색 시작하기" 클릭 시 실행할 콜백 (예: 검색 화면으로 이동)
 */
export default function ScopeLandingMobile({ onStart = () => {} }) {
  return (
    <div className={styles.wrap}>

      {/* 브랜드 */}
      <div className={styles.brand}>SCOPE</div>

      {/* 히어로 일러스트 카드 (간단한 SVG로 대체) */}
      <div className={styles.hero}>
        <svg
          className={styles.heroSvg}
          viewBox="0 0 360 210"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <rect x="0" y="0" width="360" height="210" rx="16" fill="#E9EEFF" />
          <rect x="0" y="0" width="360" height="36" rx="16" fill="#DDE4FF" />
          <circle cx="24" cy="18" r="6" fill="#FF7676" />
          <circle cx="44" cy="18" r="6" fill="#FFC04D" />
          <circle cx="64" cy="18" r="6" fill="#67D18B" />
          <rect x="24" y="56" width="120" height="120" rx="10" fill="#CBD8FF" />
          <rect x="160" y="56" width="72" height="72" rx="10" fill="#FFD66C" />
          <rect x="244" y="56" width="92" height="44" rx="10" fill="#CBD8FF" />
          <rect x="160" y="136" width="60" height="40" rx="10" fill="#EDE7FF" />
          <rect x="228" y="112" width="108" height="64" rx="10" fill="#FFF2B8" />
        </svg>
      </div>

      {/* 헤드라인 */}
      <h1 className={styles.heading}>
        혼자 찾기 어려운 정보,<br />
        한 눈에 <span className={styles.accent}>모아</span>드립니다
      </h1>

      <p className={styles.sub}>
        정부 지원금부터 채용·행사까지,<br />
        AI가 큐레이션한 맞춤 정보를 빠르게 확인하세요
      </p>

      {/* CTA 버튼 */}
      <button className={styles.cta} onClick={onStart}>
        지금 탐색 시작하기
        <span className={styles.ctaArrow} aria-hidden>→</span>
      </button>

      {/* 구분 라인(살짝 장식) */}
      <div className={styles.dividerSoft} />

      {/* 특징 1 */}
      <section className={styles.feature}>
        <div className={styles.iconCircle}>
          {/* 심전도 아이콘 대체 SVG */}
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
            <path d="M3 12h4l2-4 3 8 2-4h7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h3 className={styles.featureTitle}>실시간 정보 생성</h3>
        <p className={styles.featureDesc}>시간 낭비 없이, 필요한 정보만 골라드립니다</p>
      </section>

      {/* 특징 2 */}
      <section className={styles.feature}>
        <div className={styles.iconCircleAlt}>
          {/* 시계 아이콘 대체 SVG */}
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h3 className={styles.featureTitle}>믿을 수 있는 정보</h3>
        <p className={styles.featureDesc}>검증된 정보만, 안심하고 확인하세요</p>
      </section>

      {/* 카테고리 */}
      <div className={styles.categoriesWrap}>
        <div className={styles.categoriesTitle}>CATEGORIES</div>
        <ul className={styles.categoryList}>
          <li>공공 서비스</li>
          <li>채용 행사</li>
          <li>공채 속보</li>
          <li>기업 정보</li>
        </ul>
      </div>

      <div className={styles.bottomHairline} />
    </div>
  );
}
