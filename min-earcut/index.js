function Node(i, x, y) {
  this.i = i

  this.x = x
  this.y = y

  this.steiner = false; // 是否为斯坦博点
}


function earcut(data, holeIndices = false, dim = 2) {


  let outerLen = data.length,
    outerNode = linkedList(data, 0, outerLen, dim, true),
    triangles = []

  console.log(outerNode)
  var minX, minY, maxX, maxY, x, y;

  earcutLinked(outerNode, triangles, dim, minX, minY);

  return triangles;



}

function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {

  var stop = ear, // 截止结点是开始的位置
    prev, next;

  while (ear.prev !== ear.next) {
    prev = ear.prev;
    next = ear.next;

    if (isEar(ear)) {
      triangles.push(prev.i / dim);
      triangles.push(ear.i / dim);
      triangles.push(next.i / dim);

      removeNode(ear);

      // skipping the next vertex leads to less sliver triangles
      ear = next.next;
      stop = next.next;

      continue;
    }

    ear = next;
    if (ear === stop) {
      // try filtering points and slicing again
      if (!pass) {
        earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

        // if this didn't work, try curing all small self-intersections locally
      } else if (pass === 1) {
        ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
        earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

        // as a last resort, try splitting the remaining polygon into two
      } else if (pass === 2) {
        splitEarcut(ear, triangles, dim, minX, minY, invSize);
      }

      break;
    }

  }



}

// check whether a polygon node forms a valid ear with adjacent nodes
// 判断当前结点与相邻是否能组成Delaunay三角形
function isEar(ear) {
  var a = ear.prev,
    b = ear,
    c = ear.next;

  if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

  // now make sure we don't have other points inside the potential ear
  var p = ear.next.next;

  while (p !== ear.prev) {
    if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
      area(p.prev, p, p.next) >= 0) return false;
    p = p.next;
  }

  return true;
}

// create a circular doubly linked list from polygon points in the specified winding order
// 创建双向循环链表， 没有对data做排序，所以如果传入的数据不是规则的闭合多边形，需要更复杂的处理方式，
function linkedList(data, start, end, dim, clockwise) {
  var i, last;

  // 根据signAreas的值 来确定输入的点是顺时针/逆时针方向，
  if (clockwise === (signedArea(data, start, end, dim) > 0)) {
    for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
  } else {
    for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
  }

  // 头尾重复结点删除
  if (last && equals(last, last.next)) {
    removeNode(last);
    last = last.next;
  }

  return last;
}


function signedArea(data, start, end, dim) {
  var sum = 0;
  // 每相邻两个点的 x的差值*y的和 的累加
  for (var i = start, j = end - dim; i < end; i += dim) {
    sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
    j = i;
  }
  return sum;
}

function insertNode(i, x, y, last) {
  var p = new Node(i, x, y);

  if (!last) {
    p.prev = p;
    p.next = p;

  } else {
    p.next = last.next;
    p.prev = last;
    last.next.prev = p;
    last.next = p;
  }
  return p;
}

function removeNode(p) {
  p.next.prev = p.prev;
  p.prev.next = p.next;
}