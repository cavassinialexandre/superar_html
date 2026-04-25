import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { SearchIcon, XIcon } from '@/assets/icons'
import { SUGGESTED_OPERATORS, parseQuery } from './v6-token-parser'
import type { HistoryFiltersApi } from '../../shared/types'

interface V6CommandBarProps {
  api: HistoryFiltersApi
}

export function V6CommandBar({ api }: V6CommandBarProps) {
  const [value, setValue] = useState(api.filters.search)
  const [focused, setFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Atalho global `/` para focar
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const inInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')
      if (e.key === '/' && !inInput) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  // Sincronizar com api
  useEffect(() => {
    setValue(api.filters.search)
  }, [api.filters.search])

  const submit = () => {
    const { patch, search } = parseQuery(value)
    api.setMany({ ...patch, search })
    setShowSuggestions(false)
    inputRef.current?.blur()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setValue('')
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }

  const tokenChips = api.activeChips.filter((c) => c.key !== 'search')

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'flex items-center gap-2 px-3 py-2.5 bg-gray-950 border rounded-xl transition-all',
          focused ? 'border-white/20 ring-2 ring-white/10 bg-gray-900' : 'border-white/10',
        )}
      >
        <SearchIcon size={16} className="text-gray-400 flex-shrink-0" />

        {/* Active token chips inline */}
        {tokenChips.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {tokenChips.slice(0, 4).map((c) => (
              <button
                key={`${String(c.key)}-${c.label}`}
                onClick={c.onRemove}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 text-xs font-mono hover:bg-sky-500/30 cursor-pointer transition"
              >
                {c.label}
                <XIcon size={9} />
              </button>
            ))}
            {tokenChips.length > 4 && (
              <span className="text-[10px] text-gray-500">+{tokenChips.length - 4}</span>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => {
            setFocused(true)
            setShowSuggestions(true)
          }}
          onBlur={() => {
            setFocused(false)
            setTimeout(() => setShowSuggestions(false), 150)
          }}
          onKeyDown={onKeyDown}
          placeholder={tokenChips.length > 0 ? '' : "Type to search · type:audit · group:alpha · score:>80 · last week"}
          className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none font-mono min-w-[120px]"
          spellCheck={false}
        />

        {value && (
          <button
            onClick={() => setValue('')}
            className="p-1 text-gray-500 hover:text-white cursor-pointer"
          >
            <XIcon size={12} />
          </button>
        )}

        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono flex-shrink-0">
          <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5">/</kbd>
          <span className="hidden sm:inline">focus</span>
          <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 ml-2">⏎</kbd>
          <span className="hidden sm:inline">apply</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSuggestions && focused && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-2 bg-gray-900 border border-white/10 rounded-xl shadow-2xl z-30 overflow-hidden max-h-80 overflow-y-auto"
          >
            <div className="px-3 py-2 border-b border-white/10">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Operadores</p>
            </div>
            <div className="py-1">
              {SUGGESTED_OPERATORS.map((op) => (
                <button
                  key={op.token}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    const current = value.trim()
                    const next = current ? `${current} ${op.token}` : op.token
                    setValue(next)
                    setTimeout(() => {
                      const { patch, search } = parseQuery(next)
                      api.setMany({ ...patch, search })
                    }, 0)
                  }}
                  className="w-full text-left flex items-center justify-between gap-3 px-3 py-2 hover:bg-white/5 cursor-pointer transition"
                >
                  <span className="text-xs font-mono text-sky-300">{op.token}</span>
                  <span className="text-[11px] text-gray-500">{op.description}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
