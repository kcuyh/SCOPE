// "use client";
// import "./UnifiedGovSearch.responsive.css";

// import React, { useMemo, useState, useCallback } from "react";

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

// /* ===================== 스타일/아이콘 ===================== */
// const T = {
//   bg: "#f5fbff",
//   card: "#ffffff",
//   text: "#0f172a",
//   sub: "#64748b",
//   primary: "#0ea5e9",
//   primaryDeep: "#0284c7",
//   radiusLg: 18,
//   shadowSm: "0 2px 14px rgba(2,132,199,.08)",
//   shadowMd: "0 10px 30px rgba(2,132,199,.12)",
// };

// const IconSearch = (p) => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
//     <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
//     <path d="M20 20L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//   </svg>
// );
// const IconMoney = (p) => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
//     <rect x="3" y="5" width="18" height="14" rx="4" stroke="currentColor" strokeWidth="2" />
//     <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
//   </svg>
// );
// const IconCalendar = (p) => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
//     <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
//     <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//   </svg>
// );
// const IconBrief = (p) => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
//     <rect x="3" y="7" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="2" />
//     <path d="M9 7V6a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v1" stroke="currentColor" strokeWidth="2" />
//   </svg>
// );
// const Dot = ({ color = "#22c55e" }) => (
//   <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 999, background: color, marginRight: 8 }} />
// );

// /* ===================== 공용 UI ===================== */
// function CategoryCard({ icon, title, desc, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         gap: 6,
//         textAlign: "left",
//         padding: "18px 20px",
//         borderRadius: T.radiusLg,
//         background: T.card,
//         border: `2px solid #e6f3fb`,
//         boxShadow: T.shadowSm,
//         minWidth: 220,
//         cursor: "pointer",
//       }}
//     >
//       <div style={{ display: "flex", alignItems: "center", gap: 10, color: T.primary }}>
//         {icon}
//         <span style={{ fontWeight: 700 }}>{title}</span>
//       </div>
//       <div style={{ color: T.sub, fontSize: 14 }}>{desc}</div>
//     </button>
//   );
// }

// /* 한글 IME 포커스 안정화를 위해 메모/콜백 고정 */
// const BigSearchBar = React.memo(function BigSearchBar({
//   placeholder,
//   value,
//   onChange,
//   onSubmit,
//   disabled,
//   rightAddon,
// }) {
//   const handleKeyDown = useCallback(
//     (e) => {
//       if (e.key === "Enter" && !disabled) onSubmit();
//     },
//     [disabled, onSubmit]
//   );
//   const handleChange = useCallback((e) => onChange(e.target.value), [onChange]);

//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: 12,
//         background: "#fff",
//         padding: "14px 16px",
//         borderRadius: 20,
//         boxShadow: T.shadowMd,
//         border: "1px solid #e6f3fb",
//       }}
//     >
//       <IconSearch style={{ color: T.primary }} />
//       <input
//         style={{ flex: 1, outline: "none", border: "none", fontSize: 16, color: T.text }}
//         type="text"
//         placeholder={placeholder}
//         value={value}
//         onChange={handleChange}
//         onKeyDown={handleKeyDown}
//       />
//       {rightAddon}
//       <button
//         onClick={onSubmit}
//         disabled={disabled}
//         style={{
//           padding: "10px 16px",
//           borderRadius: 12,
//           border: "1px solid #7dd3fc",
//           background: disabled ? "#e2e8f0" : T.primaryDeep,
//           color: "#fff",
//           fontWeight: 700,
//           cursor: disabled ? "not-allowed" : "pointer",
//         }}
//       >
//         검색
//       </button>
//     </div>
//   );
// });

// const JsonViewer = ({data}) => (
//   data ? (
//     <pre style={{marginTop:20, background:"#f1f5f9", padding:16, borderRadius:8, fontSize:13}}>
//       {JSON.stringify(data, null, 2)}
//     </pre>
//   ) : null
// );

// const SearchBarRow = React.memo(function SearchBarRow({
//   placeholder,
//   query,
//   setQuery,
//   onSubmit,
//   disabled,
//   enableArea,
//   areaCd,
//   setAreaCd,
// }) {
//   const rightAddon = useMemo(() => {
//     if (!enableArea) return null;
//     return (
//       <select
//         aria-label="지역 선택"
//         style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid #cae9f7", background: "#fff", color: T.sub }}
//         value={areaCd}
//         onChange={(e) => setAreaCd(e.target.value)}
//       >
//         {AREAS.map((a) => (
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
//       {enableArea && areaCd === "" && (
//         <div style={{ marginTop: 8, color: "#b45309" }}>※ 지역을 선택해야 요청이 전송됩니다.</div>
//       )}
//     </div>
//   );
// });

// const Badge = ({ children }) => (
//   <span
//     style={{
//       display: "inline-flex",
//       alignItems: "center",
//       gap: 6,
//       background: "#ecfeff",
//       color: T.primaryDeep,
//       border: `1px solid #c8f3ff`,
//       padding: "6px 10px",
//       borderRadius: 999,
//       fontWeight: 700,
//       fontSize: 12,
//     }}
//   >
//     {children}
//   </span>
// );

// function ResultCard({ title, subtitle, right, lines = [], tags = [], cta, onCta }) {
//   return (
//     <div style={{ background: T.card, borderRadius: T.radiusLg, border: "1px solid #e6f3fb", boxShadow: T.shadowSm, padding: 22 }}>
//       <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
//         <div>
//           {subtitle && (
//             <div style={{ marginBottom: 8 }}>
//               <Badge>{subtitle}</Badge>
//             </div>
//           )}
//           <h3 style={{ margin: 0, fontSize: 22 }}>{title}</h3>
//         </div>
//         {right ? <div style={{ color: T.primaryDeep, fontWeight: 800 }}>{right}</div> : null}
//       </div>
//       <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
//         {lines.map((ln, i) => (
//           <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: T.sub }}>
//             <Dot color={i % 2 ? "#60a5fa" : "#22c55e"} />
//             {ln}
//           </div>
//         ))}
//       </div>
//       {tags.length > 0 && (
//         <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
//           {tags.map((t, i) => (
//             <span
//               key={i}
//               style={{
//                 fontSize: 12,
//                 padding: "6px 10px",
//                 borderRadius: 999,
//                 border: "1px solid #e5f0fa",
//                 color: "#64748b",
//                 background: "#f8fbff",
//               }}
//             >
//               {t}
//             </span>
//           ))}
//         </div>
//       )}
//       {cta && (
//         <div style={{ marginTop: 16 }}>
//           <button
//             onClick={onCta}
//             style={{
//               padding: "10px 14px",
//               borderRadius: 12,
//               border: "1px solid #93c5fd",
//               background: T.primary,
//               color: "#fff",
//               fontWeight: 700,
//               cursor: "pointer",
//             }}
//           >
//             {cta}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ---------- 작은 유틸 ---------- */
// const Row = ({ icon, label }) => (
//   <div style={{display:"flex", alignItems:"center", gap:10, color:"#475569", marginTop:10}}>
//     <span style={{width:20, textAlign:"center"}}>{icon}</span>
//     <span>{label}</span>
//   </div>
// );

// const Chip = ({ children }) => (
//   <span style={{
//     display:"inline-flex", alignItems:"center",
//     padding:"6px 10px", borderRadius:999, fontSize:12,
//     border:"1px solid #e5f0fa", background:"#f8fbff", color:"#475569"
//   }}>
//     {children}
//   </span>
// );

// /* ---------------------------------------------------
//    [공공지원금] 카드 (예시 필드명: serviceField, serviceName, ...)
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
//             {it.serviceName || it.title || "지원사업"}
//           </h3>
//         </div>
//         {it.maxAmount && (
//           <div style={{color:"#0284c7", fontWeight:800}}>최대 {it.maxAmount}</div>
//         )}
//       </div>

//       {it.serviceSummary && (
//         <div style={{marginTop:16, color:"#334155"}}>{it.serviceSummary}</div>
//       )}

//       <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:14}}>
//         <div>
//           {it.supportTarget && <Row icon="👥" label={`대상: ${it.supportTarget}`} />}
//           {it.applicationDeadline && <Row icon="📅" label={`신청기간: ${it.applicationDeadline}`} />}
//         </div>
//         <div>
//           {it.selectionCriteria && <Row icon="🔍" label={`선정요건: ${it.selectionCriteria}`} />}
//           {it.institutionName && <Row icon="🏢" label={`기관: ${it.institutionName}`} />}
//         </div>
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

// /* ---------------------------------------------------
//    [채용행사] 카드 (예시 필드명: eventNm, eventPlc, eventTermDetail, ...)
// --------------------------------------------------- */
// function EventCard({ it }) {
//   return (
//     <div style={{
//       background:"#fff", border:"1px solid #e6f3fb", borderRadius:18,
//       boxShadow:"0 2px 14px rgba(2,132,199,.08)", padding:22
//     }}>
//       <div style={{marginBottom:8}}><Chip>✨ AI 추천</Chip></div>
//       <h3 style={{margin:"6px 0 14px", fontSize:22}}>{it.eventNm || it.title || "채용행사"}</h3>

//       <Row icon="📍" label={it.eventPlc ? `장소: ${it.eventPlc}` : "장소 정보 없음"} />
//       {it.eventTermDetail && <Row icon="🗓️" label={`일시: ${it.eventTermDetail}`} />}
//       {it.eventPlc && <Row icon="🏢" label={`주최: ${it.eventPlc}`} />}

//       {it.joinCoWantedInfo && (
//         <div style={{marginTop:14, color:"#334155"}}>{it.joinCoWantedInfo}</div>
//       )}

//       <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:16}}>
//         <div style={{
//           border:"1px solid #e5e7eb", borderRadius:14, padding:12, background:"#f8fafc"
//         }}>
//           <div style={{fontWeight:700, marginBottom:8}}>담당자 E-mail</div>
//           {it.charger && <Row icon="👤" label={it.charger} />}
//           {it.email   && <Row icon="✉️" label={it.email} />}
//         </div>

//         <div style={{
//           border:"1px solid #e5e7eb", borderRadius:14, padding:12, background:"#f8fafc"
//         }}>
//           <div style={{fontWeight:700, marginBottom:8}}>위치</div>
//           {it.visitPath && <Row icon="🧭" label={it.visitPath} />}
//           {it.eventPlc  && <Row icon="📌" label={it.eventPlc} />}
//         </div>
//       </div>

//       <div style={{marginTop:16, display:"flex", gap:10}}>
//         <button
//           onClick={()=>window.open(it.url || it.link || "#","_blank")}
//           style={{padding:"10px 14px", borderRadius:12, border:"1px solid #93c5fd",
//                   background:"#0ea5e9", color:"#fff", fontWeight:700, cursor:"pointer"}}
//         >
//           신청 바로가기
//         </button>
//         <button
//           onClick={()=>alert("딱 맞는 팁! (예시)")}
//           style={{padding:"10px 14px", borderRadius:12, border:"1px solid #fde68a",
//                   background:"#fff7ed", color:"#b45309", fontWeight:700, cursor:"pointer"}}
//         >
//           딱 맞는 팁!
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ---------------------------------------------------
//    [공채기업] 카드 (예시 필드명: coNm, coIntrocont, coClcdNm, ...)
// --------------------------------------------------- */
// function CompanyCard({ it }) {
//   return (
//     <div style={{
//       background:"#fff", border:"1px solid #e6f3fb", borderRadius:18,
//       boxShadow:"0 2px 14px rgba(2,132,199,.08)", padding:22
//     }}>
//       <div style={{marginBottom:8}}><Chip>✨ AI 추천</Chip></div>
//       <h3 style={{margin:"6px 0 14px", fontSize:22}}>{it.coNm || it.companyName || "기업"}</h3>

//       {it.coIntroCont && <Row icon="📍" label={`기업설명: ${it.coIntroCont}`} />}
//       {it.coClcdNm    && <Row icon="🗓️" label={`일시: ${it.coClcdNm}`} />}
//       {it.mainBusiCont&& <Row icon="🏢" label={`주최: ${it.mainBusiCont}`} />}

//       {it.coIntroSummaryCont && (
//         <div style={{marginTop:14, color:"#334155"}}>{it.coIntroSummaryCont}</div>
//       )}

//       <div style={{marginTop:16, display:"flex", gap:10}}>
//         <button
//           onClick={()=>window.open(it.homepg || it.url || "#","_blank")}
//           style={{padding:"10px 14px", borderRadius:12, border:"1px solid #93c5fd",
//                   background:"#fff", color:"#1e40af", fontWeight:700, cursor:"pointer"}}
//         >
//           [홈페이지]
//         </button>
//         <button
//           onClick={()=>alert("딱 맞는 팁! (예시)")}
//           style={{padding:"10px 14px", borderRadius:12, border:"1px solid #fde68a",
//                   background:"#fff7ed", color:"#b45309", fontWeight:700, cursor:"pointer"}}
//         >
//           딱 맞는 팁!
//         </button>
//       </div>
//     </div>
//   );
// }


// /* ============================== MAIN ============================== */
// /* view: 'landing' | 'home' | 'service' | 'event' | 'company'        */
// export default function UnifiedGovSearch() {
//   const [view, setView] = useState("landing");
//   const [navStack, setStack] = useState([]);
//   const [query, setQuery] = useState("");
//   const [areaCd, setAreaCd] = useState(AREAS[0].value);
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState("");
//   const [error, setError] = useState("");
//   const [data, setData] = useState(null);
//   const [url, setUrl] = useState("");

//   const mode =
//     view === "service" ? "service" : view === "event" ? "event" : view === "company" ? "company" : null;

//   /* --- 조건 --- */
//   const canSearch = useMemo(() => {
//     if (mode === "event") return query.trim().length > 0 && areaCd !== "";
//     if (mode === "service" || mode === "company") return query.trim().length > 0;
//     return false;
//   }, [mode, query, areaCd]);

//   /* --- URL 빌드 (event만 areaCd 쿼리) --- */
//   const buildUrl = useCallback(() => {
//     if (!mode) return "";
//     const base = ENDPOINTS[mode];
//     const u = new URL(base);
//     if (mode === "event") u.searchParams.set("areaCd", String(areaCd));
//     return u.toString();
//   }, [mode, areaCd]);

//   const resetData = () => {
//     setStatus("");
//     setError("");
//     setData(null);
//     setUrl("");
//   };

//   const go = useCallback(
//     (next) => {
//       setStack((s) => [...s, view]);
//       setView(next);
//       resetData();
//       if (next === "event") setAreaCd("");
//       setQuery("");
//     },
//     [view]
//   );

//   const goBack = useCallback(() => {
//     setStack((s) => {
//       if (s.length === 0) {
//         setView("landing");
//         return s;
//       }
//       const prev = s[s.length - 1];
//       setView(prev);
//       return s.slice(0, -1);
//     });
//     resetData();
//   }, []);

//   /* --- 통일된 POST + body {text:""} --- */
//   const handleSearch = useCallback(async () => {
//     if (!canSearch || loading) return;

//     const reqUrl = buildUrl();
//     setUrl(reqUrl);
//     setLoading(true);
//     setError("");
//     setStatus("");
//     setData(null);

//     try {
//       const body = { text: query.trim() }; // ★ 모든 모드 공통: text
//       const json = await fetchJsonPOST(reqUrl, body);
//       setStatus("200 OK");
//       setData(json);
//     } catch (e) {
//       setError(e.message || String(e));
//     } finally {
//       setLoading(false);
//     }
//   }, [canSearch, loading, buildUrl, query]);

//   /* --- 스타일 --- */
//   const S = {
//     page: { fontFamily: "ui-sans-serif, system-ui", color: T.text, background: T.bg, minHeight: "100vh" },
//     wrap: { maxWidth: 1100, margin: "0 auto", padding: "28px 18px 60px" },
//     header: { display: "flex", alignItems: "center", gap: 12, marginBottom: 24 },
//     logoBox: {
//       width: 44, height: 44, borderRadius: 12, background: "#e0f2fe",
//       display: "grid", placeItems: "center", color: T.primaryDeep, boxShadow: T.shadowSm,
//     },
//     heroTitle: { fontSize: 30, fontWeight: 900, margin: "8px 0 6px" },
//     heroSub: { color: T.sub },
//     catRow: { display: "flex", gap: 16, flexWrap: "wrap", marginTop: 18 },
//     resultPanel: {
//       marginTop: 20, background: "#f0faff", border: "1px solid #def3ff",
//       padding: 16, borderRadius: 14, color: T.sub, fontSize: 13,
//     },
//     backBtn: {
//       marginTop: 8, marginBottom: 8, display: "inline-flex", alignItems: "center", gap: 8,
//       padding: "8px 12px", borderRadius: 10, border: "1px solid #93c5fd",
//       background: "#e0f2fe", color: "#075985", cursor: "pointer",
//     },
//   };

//   const Header = () => (
//     <header style={S.header}>
//       <div style={S.logoBox}>★</div>
//       <div>
//         <div style={{ fontWeight: 900, letterSpacing: 0.3 }}>SCOPE</div>
//         <div style={{ fontSize: 12, color: T.sub }}>청년정보 어시스턴트</div>
//       </div>
//     </header>
//   );

//   const StatusPanel = () =>
//     (url || status || error) && (
//       <div style={S.resultPanel}>
//         {url && (
//           <div style={{ marginBottom: 6 }}>
//             <b>요청 URL</b> · <code style={{ wordBreak: "break-all" }}>{url}</code>
//           </div>
//         )}
//         {status && <div><b>HTTP 상태:</b> {status}</div>}
//         {error && (
//           <div style={{ color: "crimson" }}>
//             <b>에러:</b> {error}
//           </div>
//         )}
//       </div>
//     );

//   /* Array 정상화 */
//   const toItems = (data) => {
//     if (!data) return null;
//     if (Array.isArray(data)) return data;
//     if (Array.isArray(data?.items)) return data.items;
//     return null;
//   };

//   /* 뷰별 렌더러 */
//   const renderServiceList = (data) => {
//     const items = toItems(data);
//     if (!items) return null;
//     return (
//       <div style={{display:"grid", gap:16, marginTop:18}}>
//         {items.map((it, i)=> <ServiceCard key={i} it={it} />)}
//       </div>
//     );
//   };

//   const renderEventList = (data) => {
//     const items = toItems(data);
//     if (!items) return null;
//     return (
//       <div style={{display:"grid", gap:16, marginTop:18}}>
//         {items.map((it, i)=> <EventCard key={i} it={it} />)}
//       </div>
//     );
//   };

//   const renderCompanyList = (data) => {
//     const items = toItems(data);
//     if (!items) return null;
//     return (
//       <div style={{display:"grid", gap:16, marginTop:18}}>
//         {items.map((it, i)=> <CompanyCard key={i} it={it} />)}
//       </div>
//     );
//   };


//   return (
//     <div style={S.page}>
//       <div style={S.wrap}>
//         <Header />
//         {view !== "landing" && (
//           <button onClick={goBack} style={S.backBtn}>← 돌아가기</button>
//         )}

//         {view === "landing" && (
//           <section>
//             <h1 style={S.heroTitle}>AI가 도와주는 맞춤형 정보 검색</h1>
//             <div style={S.heroSub}>
//               지원금부터 채용정보까지, <b style={{ color: T.primaryDeep }}>한 번에 찾아보세요</b>
//             </div>
//             <div style={S.catRow}>
//               <CategoryCard icon={<IconMoney />} title="공공지원금" desc="정부 지원금 및 혜택" onClick={() => go("service")} />
//               <CategoryCard icon={<IconCalendar />} title="채용행사" desc="박람회 · 이벤트" onClick={() => go("event")} />
//               <CategoryCard icon={<IconBrief />} title="공채기업" desc="채용공고 및 취업정보" onClick={() => go("company")} />
//             </div>
//             <div style={{ marginTop: 18 }}>
//               <button
//                 onClick={() => go("home")}
//                 style={{
//                   padding: "12px 18px",
//                   borderRadius: 12,
//                   border: "1px solid #93c5fd",
//                   background: T.primary,
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
//             <h1 style={S.heroTitle}>무엇을 찾고 있나요?</h1>
//             <div style={S.heroSub}>카테고리를 선택하거나, 아래에서 바로 검색하세요.</div>
//             <div style={S.catRow}>
//               <CategoryCard icon={<IconMoney />} title="공공지원금" desc="정부 지원금 및 혜택" onClick={() => go("service")} />
//               <CategoryCard icon={<IconCalendar />} title="채용행사" desc="박람회 · 이벤트" onClick={() => go("event")} />
//               <CategoryCard icon={<IconBrief />} title="공채기업" desc="채용공고 및 취업정보" onClick={() => go("company")} />
//             </div>
//           </section>
//         )}

//         {view === "service" && (
//           <section>
//             <h2 style={{ margin: "18px 0 8px" }}>공공지원금 검색</h2>
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
//              {renderServiceList(data)}
//           </section>
//         )}

//         {view === "event" && (
//           <section>
//             <h2 style={{ margin: "18px 0 8px" }}>채용행사 검색</h2>
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
//             <h2 style={{ margin: "18px 0 8px" }}>공채기업 검색</h2>
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
      <div className="cat__title">{icon} {title}</div>
      <div className="sub">{desc}</div>
    </button>
  );
}

/* 검색바 (IME 안정 / 엔터 제출) */
const BigSearchBar = React.memo(function BigSearchBar({
  placeholder, value, onChange, onSubmit, disabled, rightAddon
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
      <button className="search-btn" onClick={onSubmit} disabled={disabled}>검색</button>
    </div>
  );
});

/* 검색바 + 지역 선택 (채용행사만) */
const SearchBarRow = React.memo(function SearchBarRow({
  placeholder, query, setQuery, onSubmit, disabled, enableArea, areaCd, setAreaCd
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

        <div style={{display:"flex", gap:8, marginTop:14, flexWrap:"wrap"}}>
          <button className="cta" onClick={()=>window.open(it.url || it.link || "#","_blank")}>
            신청 바로가기
          </button>
          <button
            className="cta"
            style={{background:"#fff7ed", color:"#b45309", borderColor:"#fde68a"}}
            onClick={()=>alert("딱 맞는 팁! (예시)")}
          >
            딱 맞는 팁!
          </button>
        </div>
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
        <button
          className="cta"
          style={{background:"#fff7ed", color:"#b45309", borderColor:"#fde68a"}}
          onClick={()=>alert("딱 맞는 팁! (예시)")}
        >
          딱 맞는 팁!
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

  const resetData = () => { setStatus(""); setError(""); setData(null); setUrl(""); };

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
    (url || status || error) && (
      <div className="status-panel">
        {url && <div style={{marginBottom:6}}><b>요청 URL</b> · <code className="code">{url}</code></div>}
        {status && <div><b>HTTP 상태:</b> {status}</div>}
        {error && <div style={{color:"crimson"}}><b>에러:</b> {error}</div>}
      </div>
    );

  /* 배열 정상화 */
  const toItems = (payload) => {
    if (!payload) return null;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.items)) return payload.items;
    return null;
  };

  /* 리스트 뷰 */
  const renderServiceList = (payload) => {
    const items = toItems(payload);
    if (!items) return null;
    return <div className="card-list">{items.map((it,i)=><ServiceCard key={i} it={it} />)}</div>;
  };
  const renderEventList = (payload) => {
    const items = toItems(payload);
    if (!items) return null;
    return <div className="card-list">{items.map((it,i)=><EventCard key={i} it={it} />)}</div>;
  };
  const renderCompanyList = (payload) => {
    const items = toItems(payload);
    if (!items) return null;
    return <div className="card-list">{items.map((it,i)=><CompanyCard key={i} it={it} />)}</div>;
  };

  /* ---------- 렌더 ---------- */
  return (
    <div className="page">
      <div className="wrap">
        {/* 헤더 (간단) */}
        <header style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
          <div style={{
            width:44, height:44, borderRadius:12, background:"#e0f2fe",
            display:"grid", placeItems:"center", color:"#0284c7",
            boxShadow:"0 2px 14px rgba(2,132,199,.08)"
          }}>★</div>
          <div>
            <div style={{fontWeight:900, letterSpacing:0.3}}>SCOPE</div>
            <div className="sub" style={{fontSize:12}}>청년정보 어시스턴트</div>
          </div>
        </header>

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
            ← 돌아가기
          </button>
        )}

        {view === "landing" && (
          <section>
            <h1 className="h1">AI가 도와주는 맞춤형 정보 검색</h1>
            <div className="sub">지원금부터 채용정보까지, <b style={{color:"var(--primary-deep)"}}>한 번에 찾아보세요</b></div>

            <div className="cat-row" style={{marginTop:18}}>
              <CategoryCard icon="💸" title="공공지원금" desc="정부 지원금 및 혜택" onClick={()=>go("service")} />
              <CategoryCard icon="📅" title="채용행사"   desc="박람회 · 이벤트" onClick={()=>go("event")} />
              <CategoryCard icon="💼" title="공채기업"   desc="채용공고 및 취업정보" onClick={()=>go("company")} />
            </div>

            <div style={{ marginTop: 18 }}>
              <button
                onClick={() => go("home")}
                style={{
                  padding: "12px 18px",
                  borderRadius: 12,
                  border: "1px solid #93c5fd",
                  background: "var(--primary)",
                  color: "#fff",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                탐색하러가기
              </button>
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
            />
            <StatusPanel />
            {renderServiceList(data)}
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
            />
            <StatusPanel />
            {renderEventList(data)}
          </section>
        )}

        {view === "company" && (
          <section>
            <h2 className="h2">공채기업 검색</h2>
            <SearchBarRow
              placeholder="예: 프론트엔드 개발자 채용"
              query={query}
              setQuery={setQuery}
              onSubmit={handleSearch}
              disabled={!canSearch || loading}
              enableArea={false}
              areaCd={areaCd}
              setAreaCd={setAreaCd}
            />
            <StatusPanel />
            {renderCompanyList(data)}
          </section>
        )}
      </div>
    </div>
  );
}
