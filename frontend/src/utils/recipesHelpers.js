export function getArrayFromString(string, symbol) {
  return string.split(symbol).map(item => item.trim())
}

export function getReplacedArrayFromString(string, symbol, from, to) {
  return string.split(symbol).map(item => item.trim().replace(from, to)).filter(ing => ing.length)
}

export function parseIngredientsWithHeadings(ingredientsString) {
  if (!ingredientsString) return []
  
  const lines = ingredientsString.split('\n').map(line => line.trim()).filter(line => line.length)
  const result = []
  let currentHeading = null
  let currentItems = []

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
      currentHeading = line.replace(/^#\s*/g, '').replace(/^[\D\S]/g, l => l.toUpperCase()) // Remove "# " prefix and capitalize first letter
      currentItems = []
    } else {
      // Process item (handle comma-separated items on same line)
      if (line.includes(',')) {
        const item = line.replace(/,$/g, '').replace(/^[\D\S]/g, l => l.toUpperCase())
        currentItems.push(item)
      } else {
        // Single item, capitalize first letter if needed
        const processedItem = line.replace(/^[\D\S]/g, l => l.toUpperCase())
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

export function parseIngredients(ingredientsString) {
let items = []
    if (ingredientsString.includes('\n') && ingredientsString.includes(',')) {
      items = getReplacedArrayFromString(ingredientsString, '\n', /^[\D\S]/g, l => l.toUpperCase())
        .map(ing => ing.replace(/,$/g, ''))
    } else if (ingredientsString.includes(',') || ingredientsString.includes('\n')) {
      const symbol = ingredientsString.includes(',') ? ',' : '\n'
      items = getReplacedArrayFromString(ingredientsString, symbol, /^[\D\S]/g, l => l.toUpperCase())
    }
    return [{
      heading: null,
      items
    }]
  }