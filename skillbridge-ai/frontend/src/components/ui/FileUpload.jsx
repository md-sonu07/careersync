import { useCallback, useRef, useState } from 'react'
import { cn } from '../../utils/helpers'

const FileUpload = ({
  label,
  accept,
  multiple = false,
  maxSizeMB,
  onFiles,
  hint = 'Drag & drop or click to browse',
  className,
  wrapperClassName,
  preview = true,
  disabled,
}) => {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState([])

  const handleFiles = useCallback(
    (fileList) => {
      const arr = Array.from(fileList)
      if (maxSizeMB) {
        const valid = arr.filter((f) => f.size <= maxSizeMB * 1024 * 1024)
        setFiles((prev) => (multiple ? [...prev, ...valid] : valid.slice(0, 1)))
        onFiles?.(multiple ? valid : valid[0])
      } else {
        setFiles((prev) => (multiple ? [...prev, ...arr] : arr.slice(0, 1)))
        onFiles?.(multiple ? arr : arr[0])
      }
    },
    [multiple, maxSizeMB, onFiles]
  )

  const onDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && <span className="text-sm font-medium text-charcoal">{label}</span>}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        className={cn(
          'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white px-6 py-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 cursor-pointer',
          isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30 hover:bg-background/50',
          disabled && 'opacity-60 cursor-not-allowed',
          className
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border text-muted mb-3">
          <span className="material-symbols-outlined text-[22px]">cloud_upload</span>
        </div>
        <p className="text-sm font-medium text-charcoal">{hint}</p>
        <p className="mt-1 text-xs text-muted">
          {accept ? `${accept} • ` : ''}
          {maxSizeMB ? `Max ${maxSizeMB}MB` : 'Any file type'}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
          aria-hidden
          tabIndex={-1}
        />
      </div>

      {preview && files.length > 0 && (
        <ul className="mt-2 space-y-2">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center justify-between rounded-xl border border-border bg-white px-3 py-2 shadow-soft"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background border border-border text-muted">
                  <span className="material-symbols-outlined text-[18px]">description</span>
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-charcoal">{f.name}</p>
                  <p className="text-xs text-muted">{(f.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(i)
                }}
                aria-label={`Remove ${f.name}`}
                className="ml-2 rounded-lg p-1 text-muted hover:bg-background hover:text-danger transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FileUpload
