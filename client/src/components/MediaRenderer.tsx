import { assetUrl } from "../lib/api";

type MediaRendererProps = {
  src: string;
  type?: "image" | "gif" | "video" | string;
  alt: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  loading?: "eager" | "lazy";
  preload?: "none" | "metadata" | "auto";
};

/** Renders a local uploaded image/GIF/video using the same URL handling everywhere. */
export default function MediaRenderer({
  src,
  type = "image",
  alt,
  className,
  controls = false,
  autoPlay = false,
  loop = false,
  muted = false,
  playsInline = true,
  loading = "lazy",
  preload = "metadata",
}: MediaRendererProps) {
  if (!src) return null;
  const url = assetUrl(src);
  if (type === "video") {
    return (
      <video
        className={className}
        src={url}
        aria-label={alt}
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload={preload}
      />
    );
  }
  return <img className={className} src={url} alt={alt} loading={loading} />;
}
