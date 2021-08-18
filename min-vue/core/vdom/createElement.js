export function isPrimitive (value){
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}
export function isDef (v) {
  return v !== undefined && v !== null
}

function createEmptyVNode() {
  
}

export function createElement(
  context,
  tag, 
  data,
  children,
  normallizationType,
) {
  if(isDef(data) && data.is) {
    tag = data.is
  }
  if(!tag) {
    return createEmptyVNode()
  }
    
}