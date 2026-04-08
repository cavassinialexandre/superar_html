import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { AttachmentIcon, PlusIcon, XIcon } from '@/assets/icons'

interface AttachmentZoneProps {
  files: File[]
  onAdd: (files: File[]) => void
  onRemove: (index: number) => void
  compact?: boolean
  className?: string
}

function isImageFile(file: File) {
  return file.type.startsWith('image/')
}

function FileThumbnail({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!isImageFile(file)) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0"
    >
      {preview ? (
        <img src={preview} alt={file.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-1">
          <AttachmentIcon size={16} className="text-gray-400" />
          <span className="text-[8px] text-gray-400 mt-1 truncate w-full text-center">{file.name.split('.').pop()?.toUpperCase()}</span>
        </div>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove() }}
        className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
      >
        <XIcon size={10} />
      </button>
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[8px] text-white truncate block">{file.name}</span>
      </div>
    </motion.div>
  )
}

export function AttachmentZone({ files, onAdd, onRemove, compact = false, className }: AttachmentZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) onAdd(droppedFiles)
  }, [onAdd])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) onAdd(selectedFiles)
    e.target.value = ''
  }, [onAdd])

  if (compact && files.length === 0) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium cursor-pointer transition-colors"
        >
          <AttachmentIcon size={14} />
          Anexar arquivo
        </button>
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium cursor-pointer transition-colors md:hidden"
        >
          <PlusIcon size={14} />
          Foto
        </button>
        <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={handleFileSelect} className="hidden" />
        <input ref={cameraInputRef} type="file" capture="environment" accept="image/*" onChange={handleFileSelect} className="hidden" />
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all',
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50',
          compact ? 'py-3' : 'py-6'
        )}
      >
        <AttachmentIcon size={compact ? 20 : 24} className={cn('mx-auto mb-2', isDragging ? 'text-primary-500' : 'text-gray-400')} />
        <p className={cn('font-medium', isDragging ? 'text-primary-600' : 'text-gray-500', compact ? 'text-xs' : 'text-sm')}>
          {isDragging ? 'Solte os arquivos aqui' : 'Arraste arquivos ou clique para selecionar'}
        </p>
        <p className="text-[10px] text-gray-400 mt-1">Imagens, PDF, DOC (max 10MB)</p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <button
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer"
          >
            <PlusIcon size={12} /> Arquivo
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click() }}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer md:hidden"
          >
            <PlusIcon size={12} /> Camera
          </button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={handleFileSelect} className="hidden" />
      <input ref={cameraInputRef} type="file" capture="environment" accept="image/*" onChange={handleFileSelect} className="hidden" />

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {files.map((file, index) => (
              <FileThumbnail key={`${file.name}-${index}`} file={file} onRemove={() => onRemove(index)} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
