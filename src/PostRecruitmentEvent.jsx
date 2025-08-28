import React, { useCallback, useMemo, useState } from "react";

// 프록시 경유(반드시 상대경로!)
const API_BASE = "/api/recruitment-event";

const AREAS = [
  { label: "지역 선택", value: "" },
  { label: "서울/강원", value: "51" },
  { label: "부산/경남", value: "52" },
  { label: "대구/경북", value: "53" },
  { label: "경기/인천", value: "54" },
  { label: "광주/전라/제주", value: "55" },
  { label: "대전/충청", value: "56" },
];

export default function PostRecruitmentEvent() {
  const [query, setQuery] = useState("");
  const [areaCd, setAreaCd] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [reqUrl, setReqUrl] = useState("");

  const canSubmit = useMemo(() => query.trim().length > 0 && areaCd !== "", [query, areaCd]);

  const buildUrl = useCallback(() => {
    const u = new URL(API_BASE, window.location.origin); // 상대경로를 현재 오리진에 결합
    u.searchParams.set("areaCd", areaCd);
    return u.toString();
  }, [areaCd]);

  const downloadJson = useCallback((obj) => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    a.download = `recruitment-event-${areaCd || "NA"}-${ts}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  }, [areaCd]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || loading) return;

    const url = buildUrl();
    setReqUrl(url);
    setLoading(true);
    setError("");
    setStatus("");
    setData(null);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // 서버 스펙에 맞게 변경 가능 (예: { query: "반도체" })
        body: JSON.stringify({ query: query.trim() }),
      });

      setStatus(`HTTP ${res.status}`);

      const ct = res.headers.get("content-type") || "";
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} - ${text.slice(0, 400)}`);
      }

      const json = ct.includes("application/json") ? await res.json() : { raw: await res.text() };
      setData(json);
      downloadJson(json);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }, [canSubmit, loading, buildUrl, query, downloadJson]);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && canSubmit && !loading) handleSubmit();
  };

  const S = {
    wrap: { fontFamily: "ui-sans-serif, system-ui", maxWidth: 880, margin: "32px auto", padding: "0 16px" },
    row: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" },
    input: { padding: "12px 14px", border: "1px solid #cbd5e1", borderRadius: 12, minWidth: 320 },
    select: { padding: "12px 14px", border: "1px solid #cbd5e1", borderRadius: 12 },
    btn: (dis) => ({
      padding: "12px 18px",
      borderRadius: 12,
      border: "1px solid #cbd5e1",
      background: dis ? "#e2e8f0" : "#3b82f6",
      color: dis ? "#64748b" : "#fff",
      fontWeight: 800,
      cursor: dis ? "not-allowed" : "pointer",
    }),
    panel: { marginTop: 16, padding: 14, border: "1px solid #e5e7eb", borderRadius: 12, background: "#f8fafc" },
    code: { whiteSpace: "pre-wrap", wordBreak: "break-all" },
    pre: { background: "#0b1021", color: "#d6deeb", padding: 12, borderRadius: 12, maxHeight: 480, overflow: "auto" },
    warn: { color: "#b45309", marginTop: 6 },
  };

  return (
    <div style={S.wrap}>
      <h2>채용행사 POST 요청 (JSON 저장 & 출력)</h2>

      <div style={S.panel}>
        <div style={S.row}>
          <input
            style={S.input}
            type="text"
            placeholder="검색어 (예: 반도체)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <select
            style={S.select}
            value={areaCd}
            aria-label="지역 선택"
            onChange={(e) => setAreaCd(e.target.value)}
          >
            {AREAS.map((a) => (
              <option key={a.value || "placeholder"} value={a.value} disabled={!a.value}>
                {a.label}
              </option>
            ))}
          </select>
          <button style={S.btn(!canSubmit || loading)} disabled={!canSubmit || loading} onClick={handleSubmit}>
            {loading ? "요청 중…" : "POST 보내기"}
          </button>
        </div>
        {!areaCd && <div style={S.warn}>※ 지역을 선택해야 요청이 전송됩니다.</div>}
      </div>

      {(reqUrl || status || error) && (
        <div style={S.panel}>
          {reqUrl && (
            <>
              <div style={{ fontSize: 12, color: "#6b7280" }}>요청 URL</div>
              <code style={S.code}>{reqUrl}</code>
            </>
          )}
          {status && <div style={{ marginTop: 6 }}><strong>상태:</strong> {status}</div>}
          {error && <div style={{ marginTop: 6, color: "crimson" }}><strong>에러:</strong> {error}</div>}
        </div>
      )}

      {data && (
        <div style={{ ...S.panel, marginTop: 16 }}>
          <div style={{ marginBottom: 6, fontWeight: 700 }}>응답 JSON</div>
          <pre style={S.pre}>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
