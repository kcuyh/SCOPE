
// "use client";
// import "./UnifiedGovSearch.responsive.css";
// import React, { useMemo, useState, useCallback, useMemo as useMemo2 } from "react";

// /* ===================== 백엔드 엔드포인트 ===================== */
// /* 프록시 없이 직접 호출합니다. (원하면 "/api/…" 로 교체) */
// const ENDPOINTS = {
//   event:   "https://port-0-scpoe-5mk12alp3wgrdi.sel5.cloudtype.app/api/recruitment-event",
//   service: "https://port-0-scpoe-5mk12alp3wgrdi.sel5.cloudtype.app/api/public-service",
//   company: "https://port-0-scpoe-5mk12alp3wgrdi.sel5.cloudtype.app/api/recruit-company",
// };

// /* ===================== 지역 선택 (채용행사 전용) ===================== */
// const AREAS = [
//   { label: "지역 선택", value: "" },
//   { label: "서울/강원", value: "51" },
//   { label: "부산/경남", value: "52" },
//   { label: "대구/경북", value: "53" },
//   { label: "경기/인천", value: "54" },
//   { label: "광주/전라/제주", value: "55" },
//   { label: "대전/충청", value: "56" },
// ];

// /* ===================== 공용 POST(JSON) ===================== */
// async function fetchJsonPOST(url, bodyObj) {
//   const res = await fetch(url, {
//     method: "POST",
//     headers: { Accept: "application/json", "Content-Type": "application/json" },
//     body: JSON.stringify(bodyObj || {}),
//   });
//   const ct = res.headers.get("content-type") || "";
//   const parse = async () =>
//     ct.includes("application/json") ? res.json() : { raw: await res.text() };

//   if (!res.ok) {
//     const payload = await parse();
//     const msg =
//       typeof payload === "object"
//         ? JSON.stringify(payload).slice(0, 600)
//         : String(payload).slice(0, 600);
//     throw new Error(`HTTP ${res.status} - ${msg}`);
//   }
//   return parse();
// }

// /* ===================== 작은 컴포넌트/유틸 ===================== */
// const Chip = ({ children }) => (
//   <span className="tag" style={{ borderRadius: 999 }}>{children}</span>
// );

// const Row = ({ icon, label }) => (
//   <div style={{display:"flex", alignItems:"center", gap:10, color:"#475569", marginTop:10}}>
//     <span style={{width:20, textAlign:"center"}}>{icon}</span>
//     <span>{label}</span>
//   </div>
// );

// /* 카테고리 카드 */
// function CategoryCard({ icon, title, desc, onClick }) {
//   return (
//     <button className="cat" onClick={onClick}>
//       <div className="cat__title">{icon} {title}</div>
//       <div className="sub">{desc}</div>
//     </button>
//   );
// }

// /* 검색바 (IME 안정 / 엔터 제출) */
// const BigSearchBar = React.memo(function BigSearchBar({
//   placeholder, value, onChange, onSubmit, disabled, rightAddon
// }) {
//   const handleKeyDown = useCallback(
//     (e) => { if (e.key === "Enter" && !disabled) onSubmit(); },
//     [disabled, onSubmit]
//   );
//   const handleChange = useCallback((e) => onChange(e.target.value), [onChange]);

//   return (
//     <div className="search-row">
//       <span style={{color:"var(--primary)"}}>🔎</span>
//       <input
//         className="search-input"
//         type="text"
//         placeholder={placeholder}
//         value={value}
//         onChange={handleChange}
//         onKeyDown={handleKeyDown}
//       />
//       {rightAddon}
//       <button className="search-btn" onClick={onSubmit} disabled={disabled}>검색</button>
//     </div>
//   );
// });

// /* 검색바 + 지역 선택 (채용행사만) */
// const SearchBarRow = React.memo(function SearchBarRow({
//   placeholder, query, setQuery, onSubmit, disabled, enableArea, areaCd, setAreaCd
// }) {
//   const rightAddon = useMemo(() => {
//     if (!enableArea) return null;
//     return (
//       <select
//         className="search-select"
//         aria-label="지역 선택"
//         value={areaCd}
//         onChange={(e)=>setAreaCd(e.target.value)}
//       >
//         {AREAS.map((a)=>(
//           <option key={a.value || "placeholder"} value={a.value} disabled={!a.value}>
//             {a.label}
//           </option>
//         ))}
//       </select>
//     );
//   }, [enableArea, areaCd, setAreaCd]);

//   return (
//     <div style={{ marginTop: 26 }}>
//       <BigSearchBar
//         placeholder={placeholder}
//         value={query}
//         onChange={setQuery}
//         onSubmit={onSubmit}
//         disabled={disabled}
//         rightAddon={rightAddon}
//       />
//       {enableArea && areaCd==="" && (
//         <div style={{marginTop:8, color:"#b45309"}}>※ 지역을 선택해야 요청이 전송됩니다.</div>
//       )}
//     </div>
//   );
// });




// function ExpandableText({ text, limit = 110 }) {
//   const [expanded, setExpanded] = useState(false);
//   if (!text) return null;

//   const isTruncated = text.length > limit;
//   const displayText = expanded || !isTruncated ? text : text.slice(0, limit) + "…";

//   return (
//     <span>
//       {displayText}
//       {isTruncated && (
//         <button
//           onClick={() => setExpanded(!expanded)}
//           style={{
//             marginLeft: 6,
//             color: "#0ea5e9",
//             cursor: "pointer",
//             background: "none",
//             border: "none",
//             fontSize: "0.9em"
//           }}
//         >
//           {expanded ? "접기" : "더보기"}
//         </button>
//       )}
//     </span>
//   );
// }


// /* ----------- 도메인별 카드 렌더링 ----------- */
// /* 공공지원금 */
// /* ---------------------------------------------------
//    [공공지원금] 카드
// --------------------------------------------------- */
// function ServiceCard({ it }) {
//   return (
//     <div style={{
//       background:"#fff", border:"1px solid #e6f3fb", borderRadius:18,
//       boxShadow:"0 2px 14px rgba(2,132,199,.08)", padding:22
//     }}>
//       <div style={{display:"flex", justifyContent:"space-between", gap:12, flexWrap:"wrap"}}>
//         <div>
//           <div style={{marginBottom:8, display:"flex", gap:8, flexWrap:"wrap"}}>
//             <Chip>💸 지원금</Chip>
//             {it.serviceField && <Chip>{it.serviceField}</Chip>}
//           </div>
//           <h3 style={{margin:0, fontSize:22}}>
//             <ExpandableText text={it.serviceName || it.title || "지원사업"} />
//           </h3>
//         </div>
//         {it.maxAmount && (
//           <div style={{color:"#0284c7", fontWeight:800}}>최대 {it.maxAmount}</div>
//         )}
//       </div>

//       {it.serviceSummary && (
//         <div style={{marginTop:16, color:"#334155"}}>
//           <ExpandableText text={it.serviceSummary} />
//         </div>
//       )}

//       {/* 상세 항목: 데스크톱 2열 · 모바일 1열 (svc-detail-grid 클래스는 CSS에 반응형 정의) */}
//       <div className="svc-detail-grid">
//         {it.supportTarget && (
//           <Row
//             icon="👥"
//             label={<><b>대상:</b> <ExpandableText text={it.supportTarget} /></>}
//           />
//         )}
//         {it.selectionCriteria && (
//           <Row
//             icon="📝"
//             label={<><b>선정요건:</b> <ExpandableText text={it.selectionCriteria} /></>}
//           />
//         )}
//         {it.applicationDeadline && (
//           <Row
//             icon="📅"
//             label={<><b>신청기간:</b> <ExpandableText text={it.applicationDeadline} /></>}
//           />
//         )}
//         {it.institutionName && (
//           <Row
//             icon="🏢"
//             label={<><b>기관:</b> <ExpandableText text={it.institutionName} /></>}
//           />
//         )}
//       </div>

//       {it.tags && Array.isArray(it.tags) && it.tags.length > 0 && (
//         <div style={{display:"flex", gap:8, flexWrap:"wrap", marginTop:14}}>
//           {it.tags.slice(0,6).map((t, i)=><Chip key={i}>{t}</Chip>)}
//         </div>
//       )}

//       <div style={{marginTop:16, display:"flex", gap:10}}>
//         <button
//           onClick={()=>window.open(it.detailsUrl || it.url || "#","_blank")}
//           style={{padding:"10px 14px", borderRadius:12, border:"1px solid #93c5fd",
//                   background:"#0ea5e9", color:"#fff", fontWeight:700, cursor:"pointer"}}
//         >
//           자세히 보기
//         </button>
//       </div>
//     </div>
//   );
// }


// /* 채용행사 */
// function EventCard({ it }) {
//   return (
//     <div className="card event-grid">
//       <div className="event-main">
//         <div style={{marginBottom:8}}><span className="badge">📅 채용행사</span></div>
//         <h3 style={{margin:"0 0 10px 0", fontSize:22}}>
//           <ExpandableText text={it.eventNm || it.title || "채용행사"} />
//         </h3>

//         <div className="sub">
//           📍 장소 <ExpandableText text={it.eventPlc || it.location || "-"} />
//         </div>
//         <div className="sub">
//           🗓 일시 <ExpandableText text={it.eventTermDetail || it.date || "-"} />
//         </div>
//         <div className="sub">
//           🏢 주최 <ExpandableText text={it.eventPlc || it.org || "-"} />
//         </div>

//         {it.joinCoWantedInfo && (
//           <div style={{marginTop:10}}>
//             <ExpandableText text={it.joinCoWantedInfo} />
//           </div>
//         )}

//         <div style={{display:"flex", gap:8, marginTop:14, flexWrap:"wrap"}}>
//           <button className="cta" onClick={()=>window.open(it.url || it.link || "#","_blank")}>
//             신청 바로가기
//           </button>
//           <button
//             className="cta"
//             style={{background:"#fff7ed", color:"#b45309", borderColor:"#fde68a"}}
//             onClick={()=>alert("딱 맞는 팁! (예시)")}
//           >
//             딱 맞는 팁!
//           </button>
//         </div>
//       </div>

//       <div className="event-side">
//         <div className="card" style={{padding:16}}>
//           <div className="h2" style={{margin:0, fontSize:16}}>📧 담당자</div>
//           {it.charger && <div className="sub">• <ExpandableText text={it.charger} /></div>}
//           {it.email   && <div className="sub">• <ExpandableText text={it.email} /></div>}
//         </div>
//         <div className="card" style={{padding:16}}>
//           <div className="h2" style={{margin:0, fontSize:16}}>📍 위치</div>
//           {it.visitPath && <div className="sub"><ExpandableText text={it.visitPath} /></div>}
//           {it.eventPlc  && <div className="sub" style={{marginTop:6}}><ExpandableText text={it.eventPlc} /></div>}
//         </div>
//       </div>
//     </div>
//   );
// }



// /* 공채기업 */
// function CompanyCard({ it }) {
//   return (
//     <div className="card">
//       <div style={{marginBottom:8}}><span className="badge">💼 공채</span></div>
//       <h3 style={{margin:"0 0 10px 0", fontSize:22}}>
//         <ExpandableText text={it.coNm || it.companyName || it.title || "기업"} />
//       </h3>

//       {it.coIntroCont && (
//         <div className="sub">📍 기업설명: <ExpandableText text={it.coIntroCont} /></div>
//       )}
//       {it.coClcdNm    && (
//         <div className="sub">🗓 <ExpandableText text={it.coClcdNm} /></div>
//       )}
//       {it.mainBusiCont&& (
//         <div className="sub">🏢 <ExpandableText text={it.mainBusiCont} /></div>
//       )}
//       {it.coIntroSummaryCont && (
//         <div style={{marginTop:10}}>
//           <ExpandableText text={it.coIntroSummaryCont} />
//         </div>
//       )}

//       <div style={{display:"flex", gap:8, marginTop:14, flexWrap:"wrap"}}>
//         <button
//           className="cta"
//           style={{background:"#fff", color:"#1e40af", borderColor:"#93c5fd"}}
//           onClick={()=>window.open(it.homepg || it.url || "#","_blank")}
//         >
//           홈페이지
//         </button>
//         <button
//           className="cta"
//           style={{background:"#fff7ed", color:"#b45309", borderColor:"#fde68a"}}
//           onClick={()=>alert("딱 맞는 팁! (예시)")}
//         >
//           딱 맞는 팁!
//         </button>
//       </div>
//     </div>
//   );
// }



// /* ============================== MAIN ============================== */
// export default function UnifiedGovSearch() {
//   const [view, setView]     = useState("landing");
//   const [navStack, setStack]= useState([]);
//   const [query, setQuery]   = useState("");
//   const [areaCd, setAreaCd] = useState(AREAS[0].value);
//   const [loading, setLoading]=useState(false);
//   const [status, setStatus] = useState("");
//   const [error, setError]   = useState("");
//   const [data, setData]     = useState(null);
//   const [url, setUrl]       = useState("");

//   const mode =
//     view === "service" ? "service" :
//     view === "event"   ? "event"   :
//     view === "company" ? "company" : null;

//   /* 조건 */
//   const canSearch = useMemo(() => {
//     if (mode === "event") return query.trim().length > 0 && areaCd !== "";
//     if (mode === "service" || mode === "company") return query.trim().length > 0;
//     return false;
//   }, [mode, query, areaCd]);

//   /* URL 빌드 (event만 areaCd 쿼리) */
//   const buildUrl = useCallback(() => {
//     if (!mode) return "";
//     const base = ENDPOINTS[mode];
//     const u = new URL(base);
//     if (mode === "event") u.searchParams.set("areaCd", String(areaCd));
//     return u.toString();
//   }, [mode, areaCd]);

//   const resetData = () => { setStatus(""); setError(""); setData(null); setUrl(""); };

//   const go = useCallback((next)=>{
//     setStack(s=>[...s, view]);
//     setView(next);
//     resetData();
//     if (next==="event") setAreaCd("");
//     setQuery("");
//   }, [view]);

//   const goBack = useCallback(()=>{
//     setStack(s=>{
//       if (s.length===0) { setView("landing"); return s; }
//       const prev = s[s.length-1];
//       setView(prev);
//       return s.slice(0, -1);
//     });
//     resetData();
//   }, []);

//   /* POST + body:{text} (모든 모드 통일) */
//   const handleSearch = useCallback(async ()=>{
//     if (!canSearch || loading) return;

//     const reqUrl = buildUrl();
//     setUrl(reqUrl);
//     setLoading(true);
//     setError("");
//     setStatus("");
//     setData(null);

//     try {
//       const json = await fetchJsonPOST(reqUrl, { text: query.trim() });
//       setStatus("200 OK");
//       setData(json);
//     } catch (e) {
//       setError(e.message || String(e));
//     } finally {
//       setLoading(false);
//     }
//   }, [canSearch, loading, buildUrl, query]);

//   /* 상태 패널 */
//   const StatusPanel = () =>
//     (url || status || error) && (
//       <div className="status-panel">
//         {url && <div style={{marginBottom:6}}><b>요청 URL</b> · <code className="code">{url}</code></div>}
//         {status && <div><b>HTTP 상태:</b> {status}</div>}
//         {error && <div style={{color:"crimson"}}><b>에러:</b> {error}</div>}
//       </div>
//     );

//   /* 배열 정상화 */
//   const toItems = (payload) => {
//     if (!payload) return null;
//     if (Array.isArray(payload)) return payload;
//     if (Array.isArray(payload?.items)) return payload.items;
//     return null;
//   };

//   /* 리스트 뷰 */
//   const renderServiceList = (payload) => {
//     const items = toItems(payload);
//     if (!items) return null;
//     return <div className="card-list">{items.map((it,i)=><ServiceCard key={i} it={it} />)}</div>;
//   };
//   const renderEventList = (payload) => {
//     const items = toItems(payload);
//     if (!items) return null;
//     return <div className="card-list">{items.map((it,i)=><EventCard key={i} it={it} />)}</div>;
//   };
//   const renderCompanyList = (payload) => {
//     const items = toItems(payload);
//     if (!items) return null;
//     return <div className="card-list">{items.map((it,i)=><CompanyCard key={i} it={it} />)}</div>;
//   };

//   /* ---------- 렌더 ---------- */
//   return (
//     <div className="page">
//       <div className="wrap">
//         {/* 헤더 (간단) */}
//         <header style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
//           <div style={{
//             width:44, height:44, borderRadius:12, background:"#e0f2fe",
//             display:"grid", placeItems:"center", color:"#0284c7",
//             boxShadow:"0 2px 14px rgba(2,132,199,.08)"
//           }}>★</div>
//           <div>
//             <div style={{fontWeight:900, letterSpacing:0.3}}>SCOPE</div>
//             <div className="sub" style={{fontSize:12}}>청년정보 어시스턴트</div>
//           </div>
//         </header>

//         {view !== "landing" && (
//           <button
//             onClick={goBack}
//             style={{
//               margin:"8px 0",
//               display:"inline-flex", alignItems:"center", gap:8,
//               padding:"8px 12px", borderRadius:10,
//               border:"1px solid #93c5fd", background:"#e0f2fe", color:"#075985"
//             }}
//           >
//             ← 돌아가기
//           </button>
//         )}

//         {view === "landing" && (
//           <section>
//             <h1 className="h1">AI가 도와주는 맞춤형 정보 검색</h1>
//             <div className="sub">지원금부터 채용정보까지, <b style={{color:"var(--primary-deep)"}}>한 번에 찾아보세요</b></div>

//             <div className="cat-row" style={{marginTop:18}}>
//               <CategoryCard icon="💸" title="공공지원금" desc="정부 지원금 및 혜택" onClick={()=>go("service")} />
//               <CategoryCard icon="📅" title="채용행사"   desc="박람회 · 이벤트" onClick={()=>go("event")} />
//               <CategoryCard icon="💼" title="공채기업"   desc="채용공고 및 취업정보" onClick={()=>go("company")} />
//             </div>

//             <div style={{ marginTop: 18 }}>
//               <button
//                 onClick={() => go("home")}
//                 style={{
//                   padding: "12px 18px",
//                   borderRadius: 12,
//                   border: "1px solid #93c5fd",
//                   background: "var(--primary)",
//                   color: "#fff",
//                   fontWeight: 800,
//                   cursor: "pointer",
//                 }}
//               >
//                 탐색하러가기
//               </button>
//             </div>
//           </section>
//         )}

//         {view === "home" && (
//           <section>
//             <h1 className="h1">무엇을 찾고 있나요?</h1>
//             <div className="sub">카테고리를 선택하거나, 아래에서 바로 검색하세요.</div>
//             <div className="cat-row">
//               <CategoryCard icon="💸" title="공공지원금" desc="정부 지원금 및 혜택" onClick={()=>go("service")} />
//               <CategoryCard icon="📅" title="채용행사"   desc="박람회 · 이벤트" onClick={()=>go("event")} />
//               <CategoryCard icon="💼" title="공채기업"   desc="채용공고 및 취업정보" onClick={()=>go("company")} />
//             </div>
//           </section>
//         )}

//         {view === "service" && (
//           <section>
//             <h2 className="h2">공공지원금 검색</h2>
//             <SearchBarRow
//               placeholder="예: 청년 창업지원금"
//               query={query}
//               setQuery={setQuery}
//               onSubmit={handleSearch}
//               disabled={!canSearch || loading}
//               enableArea={false}
//               areaCd={areaCd}
//               setAreaCd={setAreaCd}
//             />
//             <StatusPanel />
//             {renderServiceList(data)}
//           </section>
//         )}

//         {view === "event" && (
//           <section>
//             <h2 className="h2">채용행사 검색</h2>
//             <SearchBarRow
//               placeholder="예: IT 채용박람회"
//               query={query}
//               setQuery={setQuery}
//               onSubmit={handleSearch}
//               disabled={!canSearch || loading}
//               enableArea={true}
//               areaCd={areaCd}
//               setAreaCd={setAreaCd}
//             />
//             <StatusPanel />
//             {renderEventList(data)}
//           </section>
//         )}

//         {view === "company" && (
//           <section>
//             <h2 className="h2">공채기업 검색</h2>
//             <SearchBarRow
//               placeholder="예: 프론트엔드 개발자 채용"
//               query={query}
//               setQuery={setQuery}
//               onSubmit={handleSearch}
//               disabled={!canSearch || loading}
//               enableArea={false}
//               areaCd={areaCd}
//               setAreaCd={setAreaCd}
//             />
//             <StatusPanel />
//             {renderCompanyList(data)}
//           </section>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";
import "./UnifiedGovSearch.responsive.css";
import React, { useMemo, useState, useCallback, useMemo as useMemo2 } from "react";

/* ===================== 백엔드 엔드포인트 ===================== */
/* 프록시 없이 직접 호출합니다. (원하면 "/api/…" 로 교체) */
const ENDPOINTS = {
  event:   "https://port-0-scpoe-5mk12alp3wgrdi.sel5.cloudtype.app/api/recruitment-event",
  service: "https://port-0-scpoe-5mk12alp3wgrdi.sel5.cloudtype.app/api/public-service",
  company: "https://port-0-scpoe-5mk12alp3wgrdi.sel5.cloudtype.app/api/recruit-company",
};

/* ===================== 지역 선택 (채용행사 전용) ===================== */
const AREAS = [
  { label: "지역 선택", value: "" },
  { label: "서울/강원", value: "51" },
  { label: "부산/경남", value: "52" },
  { label: "대구/경북", value: "53" },
  { label: "경기/인천", value: "54" },
  { label: "광주/전라/제주", value: "55" },
  { label: "대전/충청", value: "56" },
];

function useDelayed(active, delay = 250) {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    let t;
    if (active) t = setTimeout(() => setShow(true), delay);
    else setShow(false);
    return () => clearTimeout(t);
  }, [active, delay]);
  return show;
}

function SkeletonCard() {
  return (
    <div className="skel-card">
      <div className="skeleton skel-title"><div className="shimmer" /></div>
      <div className="skeleton skel-line" style={{ width: "85%" }}><div className="shimmer" /></div>
      <div className="skeleton skel-line" style={{ width: "70%" }}><div className="shimmer" /></div>
      <div style={{ display: "flex", marginTop: 10 }}>
        <div className="skeleton skel-chip"><div className="shimmer" /></div>
        <div className="skeleton skel-chip"><div className="shimmer" /></div>
      </div>
    </div>
  );
}
function SkeletonList({ count = 3 }) {
  return <div className="card-list">{Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}</div>;
}

function TopBarLoading({ show }) {
  const [cls, setCls] = React.useState("topbar");
  React.useEffect(() => {
    if (show) setCls("topbar show");
    else {
      setCls("topbar done");
      const t = setTimeout(() => setCls("topbar"), 200);
      return () => clearTimeout(t);
    }
  }, [show]);
  return <div className={cls} aria-hidden="true" />;
}

function OverlayLoader({ show, label = "SCOPE가 정보를 찾고 있습니다." }) {
  if (!show) return null;
  return (
    <div className="loader-overlay" role="status" aria-live="polite" aria-label={label}>
      <div className="loader-box">
        <span className="spinner" aria-hidden="true" />
        <span>{label}</span>
      </div>
    </div>
  );
}

function InlineLoading({ show, text = "검색 결과를 찾는 중입니다." }) {
  if (!show) return null;
  return (
    <div className="inline-loading" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span style={{ marginLeft: 8 }}>{text}</span>

      <style jsx>{`
        .inline-loading {
          margin-top: 10px;
          color: #0ea5e9;
          display: inline-flex;
          align-items: center;
        }
      `}</style>
    </div>
  );
}

/* ===================== 공용 POST(JSON) ===================== */
async function fetchJsonPOST(url, bodyObj) {
  const res = await fetch(url, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(bodyObj || {}),
  });
  const ct = res.headers.get("content-type") || "";
  const parse = async () =>
    ct.includes("application/json") ? res.json() : { raw: await res.text() };

  if (!res.ok) {
    const payload = await parse();
    const msg =
      typeof payload === "object"
        ? JSON.stringify(payload).slice(0, 600)
        : String(payload).slice(0, 600);
    throw new Error(`HTTP ${res.status} - ${msg}`);
  }
  return parse();
}

/* ===================== 작은 컴포넌트/유틸 ===================== */
const Chip = ({ children }) => (
  <span className="tag" style={{ borderRadius: 999 }}>{children}</span>
);

const Row = ({ icon, label }) => (
  <div style={{display:"flex", alignItems:"center", gap:10, color:"#475569", marginTop:10}}>
    <span style={{width:20, textAlign:"center"}}>{icon}</span>
    <span>{label}</span>
  </div>
);

/* 카테고리 카드 */
function CategoryCard({ icon, title, desc, onClick }) {
  return (
    <button className="cat" onClick={onClick}>
      <div className="cat__title">
        <span className="cat__emoji" aria-hidden="true">{icon} {title}</span>
      </div>
      <div className="sub">{desc}</div>

       <style jsx>{`
        .cat {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 16px 18px;
          border-radius: 14px;
          background: #fff;
          border: 1px solid #e5e7eb;
          box-shadow: 0 6px 14px rgba(0,0,0,0.06);
          cursor: pointer;

          /* 핵심: hover 시/해제 시 부드럽게 */
          transform: translateY(0);
          transition: transform 250ms ease, box-shadow 250ms ease;
          will-change: transform;
        }

        /* 마우스가 카드 영역에 있을 때 위로 살짝 떠오르기 */
        .cat:hover,
        .cat:focus-visible {
          transform: translateY(-10px);
          box-shadow: 0 14px 28px rgba(0,0,0,0.12);
        }

        .cat__title { font-weight: 600; font-size: 16px; }
        .sub { font-size: 14px; color: #6b7280; }

        /* 접근성: 모션 최소화 설정이면 애니메이션 제거 */
        @media (prefers-reduced-motion: reduce) {
          .cat { transition: none; }
        }
      `}</style>

    </button>
  );
}

/* 검색바 (IME 안정 / 엔터 제출) */
const BigSearchBar = React.memo(function BigSearchBar({
  placeholder, value, onChange, onSubmit, disabled, rightAddon,  loading = false
}) {
  const handleKeyDown = useCallback(
    (e) => { if (e.key === "Enter" && !disabled) onSubmit(); },
    [disabled, onSubmit]
  );
  const handleChange = useCallback((e) => onChange(e.target.value), [onChange]);

  return (
    <div className="search-row">
      <span style={{color:"var(--primary)"}}>🔎</span>
      <input
        className="search-input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {rightAddon}
       <button className="search-btn" onClick={onSubmit} disabled={disabled} aria-busy={loading}>
        <span style={{ display:"inline-flex", alignItems:"center", gap:8 }}>
          {loading && <span className="spinner" aria-hidden="true" />}
          검색
        </span>
      </button>
    </div>
  );
});

/* 검색바 + 지역 선택 (채용행사만) */
const SearchBarRow = React.memo(function SearchBarRow({
  placeholder, query, setQuery, onSubmit, disabled, enableArea, areaCd, setAreaCd, loading = false
}) {
  const rightAddon = useMemo(() => {
    if (!enableArea) return null;
    return (
      <select
        className="search-select"
        aria-label="지역 선택"
        value={areaCd}
        onChange={(e)=>setAreaCd(e.target.value)}
      >
        {AREAS.map((a)=>(
          <option key={a.value || "placeholder"} value={a.value} disabled={!a.value}>
            {a.label}
          </option>
        ))}
      </select>
    );
  }, [enableArea, areaCd, setAreaCd]);

  return (
    <div style={{ marginTop: 26 }}>
      <BigSearchBar
        placeholder={placeholder}
        value={query}
        onChange={setQuery}
        onSubmit={onSubmit}
        disabled={disabled}
        rightAddon={rightAddon}
        loading={loading} 
      />
      {enableArea && areaCd==="" && (
        <div style={{marginTop:8, color:"#b45309"}}>※ 지역을 선택해야 요청이 전송됩니다.</div>
      )}
    </div>
  );
});




function ExpandableText({ text, limit = 110 }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;

  const isTruncated = text.length > limit;
  const displayText = expanded || !isTruncated ? text : text.slice(0, limit) + "…";

  return (
    <span>
      {displayText}
      {isTruncated && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            marginLeft: 6,
            color: "#0ea5e9",
            cursor: "pointer",
            background: "none",
            border: "none",
            fontSize: "0.9em"
          }}
        >
          {expanded ? "접기" : "더보기"}
        </button>
      )}
    </span>
  );
}


/* ----------- 도메인별 카드 렌더링 ----------- */
/* 공공지원금 */
/* ---------------------------------------------------
   [공공지원금] 카드
--------------------------------------------------- */
function ServiceCard({ it }) {
  return (
    <div style={{
      background:"#fff", border:"1px solid #e6f3fb", borderRadius:18,
      boxShadow:"0 2px 14px rgba(2,132,199,.08)", padding:22
    }}>
      <div style={{display:"flex", justifyContent:"space-between", gap:12, flexWrap:"wrap"}}>
        <div>
          <div style={{marginBottom:8, display:"flex", gap:8, flexWrap:"wrap"}}>
            <Chip>💸 지원금</Chip>
            {it.serviceField && <Chip>{it.serviceField}</Chip>}
          </div>
          <h3 style={{margin:0, fontSize:22}}>
            <ExpandableText text={it.serviceName || it.title || "지원사업"} />
          </h3>
        </div>
        {it.maxAmount && (
          <div style={{color:"#0284c7", fontWeight:800}}>최대 {it.maxAmount}</div>
        )}
      </div>

      {it.serviceSummary && (
        <div style={{marginTop:16, color:"#334155"}}>
          <ExpandableText text={it.serviceSummary} />
        </div>
      )}

      {/* 상세 항목: 데스크톱 2열 · 모바일 1열 (svc-detail-grid 클래스는 CSS에 반응형 정의) */}
      <div className="svc-detail-grid">
        {it.supportTarget && (
          <Row
            icon="👥"
            label={<><b>대상:</b> <ExpandableText text={it.supportTarget} /></>}
          />
        )}
        {it.selectionCriteria && (
          <Row
            icon="📝"
            label={<><b>선정요건:</b> <ExpandableText text={it.selectionCriteria} /></>}
          />
        )}
        {it.applicationDeadline && (
          <Row
            icon="📅"
            label={<><b>신청기간:</b> <ExpandableText text={it.applicationDeadline} /></>}
          />
        )}
        {it.institutionName && (
          <Row
            icon="🏢"
            label={<><b>기관:</b> <ExpandableText text={it.institutionName} /></>}
          />
        )}
      </div>

      {it.tags && Array.isArray(it.tags) && it.tags.length > 0 && (
        <div style={{display:"flex", gap:8, flexWrap:"wrap", marginTop:14}}>
          {it.tags.slice(0,6).map((t, i)=><Chip key={i}>{t}</Chip>)}
        </div>
      )}

      <div style={{marginTop:16, display:"flex", gap:10}}>
        <button
          onClick={()=>window.open(it.detailsUrl || it.url || "#","_blank")}
          style={{padding:"10px 14px", borderRadius:12, border:"1px solid #93c5fd",
                  background:"#0ea5e9", color:"#fff", fontWeight:700, cursor:"pointer"}}
        >
          자세히 보기
        </button>
      </div>
    </div>
  );
}


/* 채용행사 */
function EventCard({ it }) {
  return (
    <div className="card event-grid">
      <div className="event-main">
        <div style={{marginBottom:8}}><span className="badge">📅 채용행사</span></div>
        <h3 style={{margin:"0 0 10px 0", fontSize:22}}>
          <ExpandableText text={it.eventNm || it.title || "채용행사"} />
        </h3>

        <div className="sub">
          📍 장소 <ExpandableText text={it.eventPlc || it.location || "-"} />
        </div>
        <div className="sub">
          🗓 일시 <ExpandableText text={it.eventTermDetail || it.date || "-"} />
        </div>
        <div className="sub">
          🏢 주최 <ExpandableText text={it.eventPlc || it.org || "-"} />
        </div>

        {it.joinCoWantedInfo && (
          <div style={{marginTop:10}}>
            <ExpandableText text={it.joinCoWantedInfo} />
          </div>
        )}

      </div>

      <div className="event-side">
        <div className="card" style={{padding:16}}>
          <div className="h2" style={{margin:0, fontSize:16}}>📧 담당자</div>
          {it.charger && <div className="sub">• <ExpandableText text={it.charger} /></div>}
          {it.email   && <div className="sub">• <ExpandableText text={it.email} /></div>}
        </div>
        <div className="card" style={{padding:16}}>
          <div className="h2" style={{margin:0, fontSize:16}}>📍 위치</div>
          {it.visitPath && <div className="sub"><ExpandableText text={it.visitPath} /></div>}
          {it.eventPlc  && <div className="sub" style={{marginTop:6}}><ExpandableText text={it.eventPlc} /></div>}
        </div>
      </div>
    </div>
  );
}



/* 공채기업 */
function CompanyCard({ it }) {
  return (
    <div className="card">
      <div style={{marginBottom:8}}><span className="badge">💼 공채</span></div>
      <h3 style={{margin:"0 0 10px 0", fontSize:22}}>
        <ExpandableText text={it.coNm || it.companyName || it.title || "기업"} />
      </h3>

      {it.coIntroCont && (
        <div className="sub">📍 기업설명: <ExpandableText text={it.coIntroCont} /></div>
      )}
      {it.coClcdNm    && (
        <div className="sub">🗓 <ExpandableText text={it.coClcdNm} /></div>
      )}
      {it.mainBusiCont&& (
        <div className="sub">🏢 <ExpandableText text={it.mainBusiCont} /></div>
      )}
      {it.coIntroSummaryCont && (
        <div style={{marginTop:10}}>
          <ExpandableText text={it.coIntroSummaryCont} />
        </div>
      )}

      <div style={{display:"flex", gap:8, marginTop:14, flexWrap:"wrap"}}>
        <button
          className="cta"
          style={{background:"#fff", color:"#1e40af", borderColor:"#93c5fd"}}
          onClick={()=>window.open(it.homepg || it.url || "#","_blank")}
        >
          홈페이지
        </button>
      </div>
    </div>
  );
}



/* ============================== MAIN ============================== */
export default function UnifiedGovSearch() {
  const [view, setView]     = useState("landing");
  const [navStack, setStack]= useState([]);
  const [query, setQuery]   = useState("");
  const [areaCd, setAreaCd] = useState(AREAS[0].value);
  const [loading, setLoading]=useState(false);
  const [status, setStatus] = useState("");
  const [error, setError]   = useState("");
  const [data, setData]     = useState(null);
  const [url, setUrl]       = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const showLoading = useDelayed(loading, 250);

  const mode =
    view === "service" ? "service" :
    view === "event"   ? "event"   :
    view === "company" ? "company" : null;

  /* 조건 */
  const canSearch = useMemo(() => {
    if (mode === "event") return query.trim().length > 0 && areaCd !== "";
    if (mode === "service" || mode === "company") return query.trim().length > 0;
    return false;
  }, [mode, query, areaCd]);

  /* URL 빌드 (event만 areaCd 쿼리) */
  const buildUrl = useCallback(() => {
    if (!mode) return "";
    const base = ENDPOINTS[mode];
    const u = new URL(base);
    if (mode === "event") u.searchParams.set("areaCd", String(areaCd));
    return u.toString();
  }, [mode, areaCd]);


  const resetData = () => {
    setStatus("");
    setError("");
    setData(null);
    setUrl("");
    setHasSearched(false); // <- 다시 진입할 때 '검색 전' 상태로
  };

  const go = useCallback((next)=>{
    setStack(s=>[...s, view]);
    setView(next);
    resetData();
    if (next==="event") setAreaCd("");
    setQuery("");
  }, [view]);

  const goBack = useCallback(()=>{
    setStack(s=>{
      if (s.length===0) { setView("landing"); return s; }
      const prev = s[s.length-1];
      setView(prev);
      return s.slice(0, -1);
    });
    resetData();
  }, []);

  /* POST + body:{text} (모든 모드 통일) */
  const handleSearch = useCallback(async ()=>{
    if (!canSearch || loading) return;
    setHasSearched(true);

    const reqUrl = buildUrl();
    setUrl(reqUrl);
    setLoading(true);
    setError("");
    setStatus("");
    setData(null);

    try {
      const json = await fetchJsonPOST(reqUrl, { text: query.trim() });
      setStatus("200 OK");
      setData(json);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }, [canSearch, loading, buildUrl, query]);

  /* 상태 패널 */
  const StatusPanel = () =>
    (error) && (
      <div className="status-panel">
        
        {error && <div style={{color:"crimson"}}><b>에러:</b> {error}</div>}
      </div>
    );

  /* 배열 정상화 */
  const toItems = (payload) => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.items)) return payload.items;
    return [];
  };


  /* 리스트 뷰 */
  const renderServiceList = (payload) => {
    const items = toItems(payload);
      if (!hasSearched) return null;        // 최초 진입 때는 아무것도 표시 안 함
      if (loading) return null;             // 로딩 중엔 별도 UI(스피너/스켈레톤)가 처리
      if (items.length === 0) {
    return <div className="empty">검색 결과가 없습니다. 다른 키워드로 다시 시도해 보세요.</div>;
  }
    return <div className="card-list">{items.map((it,i)=><ServiceCard key={i} it={it} />)}</div>;
  };
  const renderEventList = (payload) => {
    const items = toItems(payload);
      if (!hasSearched) return null;        // 최초 진입 때는 아무것도 표시 안 함
  if (loading) return null;             // 로딩 중엔 별도 UI(스피너/스켈레톤)가 처리
  if (items.length === 0) {
    return <div className="empty">검색 결과가 없습니다. 다른 키워드로 다시 시도해 보세요.</div>;
  }
    return <div className="card-list">{items.map((it,i)=><EventCard key={i} it={it} />)}</div>;
  };
  const renderCompanyList = (payload) => {
    const items = toItems(payload);
      if (!hasSearched) return null;        // 최초 진입 때는 아무것도 표시 안 함
  if (loading) return null;             // 로딩 중엔 별도 UI(스피너/스켈레톤)가 처리
  if (items.length === 0) {
    return <div className="empty">검색 결과가 없습니다. 다른 키워드로 다시 시도해 보세요.</div>;
  }
    return <div className="card-list">{items.map((it,i)=><CompanyCard key={i} it={it} />)}</div>;
  };

  /* ---------- 렌더 ---------- */
  return (
    <div className="page">
        <TopBarLoading show={loading} />
      <div className="wrap">
        {/* 헤더 (간단) */}
<div style={{ display: "flex", justifyContent: "center" }}>
  <header
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",   // 주축(가로) 중앙
      gap: 20,
      textAlign: "center",
      margin: "60px 0 40px",      // 위아래 여백 늘림
      padding: "12px 18px",
    }}
  >
    <div
      style={{
        width: 80,                 // 로고 더 큼 (기존 80 → 96)
        height: 80,
        borderRadius: 16,
        background: "#e0f2fe",
        display: "grid",
        placeItems: "center",
        color: "#0284c7",
        boxShadow: "0 10px 30px rgba(2,132,199,.12)", // 더 깊은 그림자
        fontSize: 60,             // 별 아이콘도 조금 크게
      }}
    >
      <svg width="60" height="60" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round">
  <circle cx="11" cy="11" r="7"></circle>
  <path d="M20 20L16 16"></path>
    </svg>
    </div>

    <div>
      <div
        style={{
          fontWeight: 900,
          letterSpacing: 0.5,
          fontSize: "clamp(24px, 4vw, 40px)",  // 반응형으로 크게
        }}
      >
        SCOPE
      </div>
      <div className="sub" style={{ fontSize: "clamp(12px, 1.6vw, 16px)" }}>
        청년정보 어시스턴트
      </div>
    </div>
  </header>
</div>

        {view !== "landing" && (
          <button
            onClick={goBack}
            style={{
              margin:"8px 0",
              display:"inline-flex", alignItems:"center", gap:8,
              padding:"8px 12px", borderRadius:10,
              border:"1px solid #93c5fd", background:"#e0f2fe", color:"#075985"
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>⮌</span>
          </button>
        )}

        {view === "landing" && (
          <section style={{ textAlign: "center" }}>
            <h1 className="h1">AI가 도와주는 맞춤형 정보 검색</h1>
            <div className="sub">지원금부터 채용정보까지, <b style={{color:"var(--primary-deep)"}}>한 번에 찾아보세요</b></div>

            <div className="cat-row" style={{marginTop:18}}>
              <CategoryCard icon="💸" title="공공지원금" desc="정부 지원금 및 혜택" onClick={()=>go("service")} />
              <CategoryCard icon="📅" title="채용행사"   desc="박람회 · 이벤트" onClick={()=>go("event")} />
              <CategoryCard icon="💼" title="공채기업"   desc="채용공고 및 취업정보" onClick={()=>go("company")} />
            </div>
          </section>
        )}

        {view === "home" && (
          <section>
            <h1 className="h1">무엇을 찾고 있나요?</h1>
            <div className="sub">카테고리를 선택하거나, 아래에서 바로 검색하세요.</div>
            <div className="cat-row">
              <CategoryCard icon="💸" title="공공지원금" desc="정부 지원금 및 혜택" onClick={()=>go("service")} />
              <CategoryCard icon="📅" title="채용행사"   desc="박람회 · 이벤트" onClick={()=>go("event")} />
              <CategoryCard icon="💼" title="공채기업"   desc="채용공고 및 취업정보" onClick={()=>go("company")} />
            </div>
          </section>
        )}

        {view === "service" && (
          <section>
            <h2 className="h2">공공지원금 검색</h2>
            <SearchBarRow
              placeholder="예: 청년 창업지원금"
              query={query}
              setQuery={setQuery}
              onSubmit={handleSearch}
              disabled={!canSearch || loading}
              enableArea={false}
              areaCd={areaCd}
              setAreaCd={setAreaCd}
              loading={loading}
            />
            <StatusPanel />
            <InlineLoading show={hasSearched && showLoading} text="SCOPE가 검색 결과를 찾는 중입니다." />
            {(showLoading && !data) ? <SkeletonList count={3} /> : renderServiceList(data)}
    {/* 선택: 초기 진입 등 텅 빈 느낌일 때만 */}
    {/* <OverlayLoader show={showLoading && !data} /> */}
          </section>
        )}

        {view === "event" && (
          <section>
            <h2 className="h2">채용행사 검색</h2>
            <SearchBarRow
              placeholder="예: IT 채용박람회"
              query={query}
              setQuery={setQuery}
              onSubmit={handleSearch}
              disabled={!canSearch || loading}
              enableArea={true}
              areaCd={areaCd}
              setAreaCd={setAreaCd}
              loading={loading}
            />
            <StatusPanel />
            <InlineLoading show={hasSearched && showLoading} text="SCOPE가 검색 결과를 찾는 중입니다." />
            {(showLoading && !data) ? <SkeletonList count={3} /> : renderEventList(data)}
    {/* 선택: 초기 진입 등 텅 빈 느낌일 때만 */}
    {/* <OverlayLoader show={showLoading && !data} /> */}
          </section>
        )}

        {view === "company" && (
          <section>
            <h2 className="h2">공채기업 검색</h2>
            <SearchBarRow
              placeholder="예: 게임"
              query={query}
              setQuery={setQuery}
              onSubmit={handleSearch}
              disabled={!canSearch || loading}
              enableArea={false}
              areaCd={areaCd}
              setAreaCd={setAreaCd}
              loading={loading}
            />
            <StatusPanel />
            <InlineLoading show={hasSearched && showLoading} text="SCOPE가 검색 결과를 찾는 중입니다." />
            {(showLoading && !data) ? <SkeletonList count={3} /> : renderCompanyList(data)}
    {/* 선택: 초기 진입 등 텅 빈 느낌일 때만 */}
    {/* <OverlayLoader show={showLoading && !data} /> */}
          </section>
        )}
      </div>
    </div>
  );
}
