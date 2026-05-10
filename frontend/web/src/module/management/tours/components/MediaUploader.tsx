import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
} from 'lucide-react'
import { handleApiError } from '../../../../lib/handleApiError'
import { ApiClientError } from '../../../../types/api'
import { uploadMedia } from '../api/uploadMedia'
import type { TourMediaForm } from '../validation/tourSchema'

type MediaUploaderProps = {
  value: TourMediaForm[]
  onChange: (next: TourMediaForm[]) => void
  /** Báo trạng thái uploading lên parent để khoá Submit. */
  onUploadingChange?: (uploading: boolean) => void
  disabled?: boolean
}

const FIELD_INPUT_CLASS =
  'w-full rounded-md border border-[var(--color-border,#cbd5e1)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[var(--color-primary,#0ea5e9)] focus:ring-2 focus:ring-[var(--color-primary,#0ea5e9)]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'

function deriveMediaType(file: File): 'image' | 'video' {
  return file.type.startsWith('video/') ? 'video' : 'image'
}

function deriveMediaTypeFromUrl(url: string): 'image' | 'video' {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase()
  if (ext && ['mp4', 'webm', 'mov', 'mkv', 'avi'].includes(ext)) return 'video'
  return 'image'
}

/**
 * Quản lý danh sách media của Tour:
 * - Upload nhiều file qua `uploadMedia()` ngay khi user chọn (UX tốt hơn so
 *   với upload lúc Submit). Mỗi file có 1 promise riêng nhưng group lại để
 *   show progress chung.
 * - Cho phép thêm URL thủ công khi BE chưa có endpoint upload (fallback).
 * - Sắp xếp `sortOrder` tự động theo thứ tự thêm.
 */
function MediaUploader(props: MediaUploaderProps) {
  const { t } = useTranslation('management')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [uploadingCount, setUploadingCount] = useState(0)
  const [manualUrl, setManualUrl] = useState('')

  function syncUploading(delta: number) {
    setUploadingCount((current) => {
      const next = Math.max(0, current + delta)
      props.onUploadingChange?.(next > 0)
      return next
    })
  }

  function pickFiles() {
    if (props.disabled) return
    inputRef.current?.click()
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const list = Array.from(files)
    const fallbackToast = String(t('tours.upload.failed'))

    syncUploading(list.length)

    const results = await Promise.allSettled(list.map((f) => uploadMedia(f)))

    const baseSortOrder = props.value.length
    const next: TourMediaForm[] = [...props.value]

    let added = 0
    let beGapDetected = false

    results.forEach((result, index) => {
      const file = list[index]
      if (result.status === 'fulfilled') {
        next.push({
          mediaType: deriveMediaType(file),
          mediaUrl: result.value.url,
          altText: result.value.fileName,
          sortOrder: baseSortOrder + added,
          isActive: true,
        })
        added += 1
      } else {
        const reason = result.reason
        if (reason instanceof ApiClientError && reason.httpStatus === 404) {
          beGapDetected = true
        }
        toast.error(handleApiError(reason, fallbackToast))
      }
    })

    syncUploading(-list.length)
    if (added > 0) props.onChange(next)
    if (beGapDetected) {
      toast.warning(String(t('tours.upload.beGapWarning')))
    }
  }

  function handleAddManualUrl() {
    const trimmed = manualUrl.trim()
    if (!trimmed) return
    const next: TourMediaForm[] = [
      ...props.value,
      {
        mediaType: deriveMediaTypeFromUrl(trimmed),
        mediaUrl: trimmed,
        altText: trimmed,
        sortOrder: props.value.length,
        isActive: true,
      },
    ]
    props.onChange(next)
    setManualUrl('')
  }

  function handleRemove(index: number) {
    const next = props.value.filter((_, i) => i !== index)
    // Re-index sortOrder để liền mạch
    next.forEach((item, i) => {
      item.sortOrder = i
    })
    props.onChange(next)
  }

  function handleAltTextChange(index: number, alt: string) {
    const next = [...props.value]
    next[index] = { ...next[index], altText: alt }
    props.onChange(next)
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files)
          event.target.value = ''
        }}
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={pickFiles}
          disabled={props.disabled || uploadingCount > 0}
          className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border,#e2e8f0)] bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
        >
          {uploadingCount > 0 ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <ImagePlus className="h-4 w-4" aria-hidden />
          )}
          {String(
            uploadingCount > 0
              ? t('tours.upload.uploading', { count: uploadingCount })
              : t('tours.upload.pickFiles'),
          )}
        </button>

        {/* Manual URL fallback */}
        <div className="flex flex-1 items-center gap-2">
          <input
            type="url"
            placeholder={String(t('tours.upload.manualUrlPlaceholder'))}
            value={manualUrl}
            onChange={(event) => setManualUrl(event.target.value)}
            disabled={props.disabled}
            className={FIELD_INPUT_CLASS}
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            disabled={props.disabled || manualUrl.trim().length === 0}
            className="inline-flex items-center gap-1 rounded-md border border-[var(--color-border,#e2e8f0)] px-3 py-2 text-xs font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            <Upload className="h-3.5 w-3.5" aria-hidden />
            {String(t('tours.upload.addManual'))}
          </button>
        </div>
      </div>

      {/* Preview grid */}
      {props.value.length === 0 ? (
        <div className="rounded-md border border-dashed border-[var(--color-border,#e2e8f0)] bg-slate-50 px-3 py-4 text-center text-xs text-[var(--color-muted,#64748b)]">
          {String(t('tours.upload.empty'))}
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {props.value.map((item, index) => (
            <li
              key={`${item.mediaUrl}-${index}`}
              className="overflow-hidden rounded-md border border-[var(--color-border,#e2e8f0)] bg-white"
            >
              <div className="relative aspect-video bg-slate-100">
                {item.mediaType === 'video' ? (
                  <video
                    src={item.mediaUrl}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={item.mediaUrl}
                    alt={item.altText ?? ''}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  disabled={props.disabled}
                  className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  aria-label={String(t('common.delete'))}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
              <div className="flex flex-col gap-1 px-2 py-1.5 text-xs">
                <input
                  type="text"
                  value={item.altText ?? ''}
                  onChange={(event) =>
                    handleAltTextChange(index, event.target.value)
                  }
                  disabled={props.disabled}
                  placeholder={String(t('tours.upload.altPlaceholder'))}
                  className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-[var(--color-primary,#0ea5e9)]"
                />
                <span className="truncate text-[10px] text-[var(--color-muted,#94a3b8)]">
                  #{index + 1} · {item.mediaType}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MediaUploader
