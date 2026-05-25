import { type CSSProperties, type ImgHTMLAttributes, useMemo } from 'react'

type OptimizedImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'width' | 'height' | 'loading' | 'fetchPriority' | 'decoding'
> & {
  /** Ảnh LCP / above-the-fold — eager + fetchpriority=high */
  priority?: boolean
  width?: number
  height?: number
  /** Giữ chỗ trước khi ảnh tải — giảm CLS */
  aspectRatio?: string
  /** Cloudinary: thêm f_auto,q_auto,w_* */
  cloudinaryWidth?: number
}

/** Tối ưu URL Cloudinary (WebP/AVIF tự động, nén). */
export function optimizeCloudinaryUrl(src: string, width = 800): string {
  if (!src.includes('res.cloudinary.com') || !src.includes('/upload/')) {
    return src
  }
  if (/\/upload\/[^/]*f_auto/.test(src)) {
    return src
  }
  return src.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`)
}

/**
 * Thẻ img chuẩn hiệu năng: kích thước/aspect-ratio, lazy, fetchpriority, decoding async.
 */
export function OptimizedImage({
  src,
  alt,
  priority = false,
  width = 800,
  height = 600,
  aspectRatio,
  cloudinaryWidth,
  className,
  style,
  ...rest
}: OptimizedImageProps) {
  const resolvedSrc = useMemo(() => {
    if (!src) return ''
    return cloudinaryWidth != null
      ? optimizeCloudinaryUrl(src, cloudinaryWidth)
      : optimizeCloudinaryUrl(src, width)
  }, [src, cloudinaryWidth, width])

  if (!resolvedSrc) {
    return null
  }

  const boxStyle: CSSProperties = {
    ...(aspectRatio ? { aspectRatio } : null),
    ...style,
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      width={width}
      height={height}
      decoding="async"
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={className}
      style={boxStyle}
      {...rest}
    />
  )
}
