export default function FigmaEmbed({ figmaUrl, height = 720 }) {
  const src = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(figmaUrl)}`;
  return (
    <iframe
      title="Figma"
      src={src}
      style={{ width: "100%", height, border: 0, borderRadius: 12 }}
      allowFullScreen
    />
  );
}
