/**
 * server/sorter.js
 * -----------------------------------------------------------------------
 * Data Processing — Selection Sort (ฝั่งเซิร์ฟเวอร์)
 * เรียงหาวันที่ pop (โอกาสฝน) น้อยที่สุด ผลลัพธ์ตัวแรก = วันแนะนำ (bestIndex)
 * -----------------------------------------------------------------------
 */
export function selectionSortByPop(days) {
  const arr = days.map((d, i) => ({ pop: d.pop, index: i }));
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j].pop < arr[minIdx].pop) minIdx = j; // เปรียบเทียบ pop ของสองวัน
    }
    if (minIdx !== i) {
      const tmp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = tmp;
    }
  }
  return arr;
}
