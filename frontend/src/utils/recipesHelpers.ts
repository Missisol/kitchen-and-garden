interface ParsedIngredientSection {
  heading: string | null
  items: string[]
}

export function getArrayFromString(string: string, symbol: string): string[] {
  return string.split(symbol).map((item: string) => item.trim())
}

export function getReplacedArrayFromString(
  string: string,
  symbol: string,
  from: RegExp | string,
  to: string | ((match: string) => string)
): string[] {
  return string.split(symbol).map((item: string) => item.trim().replace(from as RegExp | string, to as string)).filter((ing: string) => ing.length)
}

export function parseIngredientsWithHeadings(ingredientsString: string): ParsedIngredientSection[] {
  if (!ingredientsString) return []
  
  const lines = ingredientsString.split('\n').map((line: string) => line.trim()).filter((line: string) => line.length)
  const result: ParsedIngredientSection[] = []
  let currentHeading: string | null = null
  let currentItems: string[] = []

  for (const line of lines) {
    if (line.startsWith('#')) {
      // Save previous section if exists
      if (currentHeading !== null) {
        result.push({ heading: currentHeading, items: currentItems })
      } else if (currentItems.length > 0) {
        // Items without heading
        result.push({ heading: null, items: currentItems })
      }
      // Start new section
      currentHeading = line.replace(/^#\s*/g, '').replace(/^[\D\S]/g, (l: string) => l.toUpperCase()) // Remove "# " prefix and capitalize first letter
      currentItems = []
    } else {
      // Process item (handle comma-separated items on same line)
      if (line.includes(',')) {
        const item = line.replace(/,$/g, '').replace(/^[\D\S]/g, (l: string) => l.toUpperCase())
        currentItems.push(item)
      } else {
        // Single item, capitalize first letter if needed
        const processedItem = line.replace(/^[\D\S]/g, (l: string) => l.toUpperCase())
        currentItems.push(processedItem)
      }
    }
  }
  
  // Save last section
  if (currentHeading !== null) {
    result.push({ heading: currentHeading, items: currentItems })
  } else if (currentItems.length > 0) {
    // No headings, just add items as before
    result.push({ heading: null, items: currentItems })
  }
  return result
}

export function parseIngredients(ingredientsString: string): ParsedIngredientSection[] {
  let items: string[] = []
  if (ingredientsString.includes('\n') && ingredientsString.includes(',')) {
    items = getReplacedArrayFromString(ingredientsString, '\n', /^[\D\S]/g, (l: string) => l.toUpperCase())
      .map((ing: string) => ing.replace(/,$/g, ''))
  } else if (ingredientsString.includes(',') || ingredientsString.includes('\n')) {
    const symbol = ingredientsString.includes(',') ? ',' : '\n'
    items = getReplacedArrayFromString(ingredientsString, symbol, /^[\D\S]/g, (l: string) => l.toUpperCase())
  }
  return [{
    heading: null,
    items
  }]
}

export function truncateText(text: string, maxLength: number = 160): string {
  if (!text || text.length <= maxLength) {
    return text
  }
  return `${text.substring(0, maxLength).trim()}...`
}