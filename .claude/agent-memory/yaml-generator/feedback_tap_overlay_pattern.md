---
name: Tap overlay pattern for clickable cards
description: Use ManualLayout + HtmlViewer visual + Classic/Button transparent overlay for clickable cards in AutoLayout contexts
type: feedback
---

When building clickable cards (profile selection cards, status buttons, etc.) inside AutoLayout containers, use ManualLayout for the card itself so a transparent Classic/Button can overlay the entire area.

**Why:** In AutoLayout, an invisible button with Height=0 and Width=0 cannot be clicked. GroupContainer does not have OnSelect. The only way to make an entire card clickable is ManualLayout with a transparent button overlay.

**How to apply:**
1. Card container = ManualLayout (NOT AutoLayout)
2. Visual content = HtmlViewer with Height/Width = Parent.Height/Width
3. Tap target = Classic/Button@2.2.0 transparent, Height/Width = Parent.Height/Width, as LAST child (Z-order)
4. The card container itself can still be a child of AutoLayout (FillPortions works on it)
5. HoverFill = RGBA(0,0,0,0.02) for subtle feedback, PressedFill = RGBA(0,0,0,0.04)
