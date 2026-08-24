import React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/helpers'

export default function Logo({ className, textClassName, imageClassName, showText = true, asLink = true }) {
  const content = (
    <div className={cn("flex items-center gap-2.5 shrink-0 group", className)}>
      <img 
        src="/logo.png" 
        alt="Career Sync Logo" 
        className={cn("h-9 w-auto group-hover:scale-105 transition-transform", imageClassName)} 
      />
      {showText && (
        <span className={cn("text-xl md:text-2xl font-bold text-primary tracking-tight", textClassName)}>
          Career Sync
        </span>
      )}
    </div>
  )

  if (asLink) {
    return (
      <Link to="/">
        {content}
      </Link>
    )
  }

  return content
}
