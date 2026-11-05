/**
 * services/provinces.ts
 * -----------------------------------------------------------------------
 * ข้อมูลพิกัดจังหวัดทั้ง 77 จังหวัด + ภาค ย้ายมาจาก object PROVINCES ใน
 * server.js เวอร์ชัน Express เดิม แปลงเป็นอาร์เรย์ + Map เพื่อให้ React
 * ฝั่ง client เรียกใช้ตรงๆ ได้เลย (แอปนี้ไม่มี backend แล้ว เรียก
 * Open-Meteo จากเบราว์เซอร์โดยตรง)
 *
 * provinceMap เป็น Hash Table (Map ของ JS) key = ชื่อจังหวัด
 * ค้นพิกัดได้ O(1) เหมือนที่ server.js เดิมเคยทำด้วย object lookup
 * -----------------------------------------------------------------------
 */
import type { Province, Region } from "../types/weather";

export const REGION_LABEL: Record<Region, string> = {
  north: "ภาคเหนือ",
  northeast: "ภาคอีสาน",
  central: "ภาคกลาง",
  west: "ภาคตะวันตก",
  east: "ภาคตะวันออก",
  south: "ภาคใต้",
};

export const PROVINCES: Province[] = [
  // ภาคกลาง
  { name: "กรุงเทพมหานคร", lat: 13.7563, lon: 100.5018, region: "central" },
  { name: "นนทบุรี", lat: 13.8622, lon: 100.5144, region: "central" },
  { name: "ปทุมธานี", lat: 14.0208, lon: 100.525, region: "central" },
  { name: "สมุทรปราการ", lat: 13.5991, lon: 100.5998, region: "central" },
  { name: "พระนครศรีอยุธยา", lat: 14.3532, lon: 100.5686, region: "central" },
  { name: "อ่างทอง", lat: 14.5896, lon: 100.4548, region: "central" },
  { name: "ลพบุรี", lat: 14.7995, lon: 100.6534, region: "central" },
  { name: "สิงห์บุรี", lat: 14.8907, lon: 100.3968, region: "central" },
  { name: "ชัยนาท", lat: 15.1851, lon: 100.1251, region: "central" },
  { name: "สระบุรี", lat: 14.5289, lon: 100.9106, region: "central" },
  { name: "นครนายก", lat: 14.2069, lon: 101.213, region: "central" },
  { name: "สมุทรสาคร", lat: 13.5475, lon: 100.274, region: "central" },
  { name: "สมุทรสงคราม", lat: 13.4098, lon: 100.0022, region: "central" },
  { name: "นครปฐม", lat: 13.8199, lon: 100.0621, region: "central" },
  { name: "สุพรรณบุรี", lat: 14.4744, lon: 100.1177, region: "central" },
  // ภาคตะวันตก
  { name: "กาญจนบุรี", lat: 14.0227, lon: 99.5328, region: "west" },
  { name: "ราชบุรี", lat: 13.5282, lon: 99.8134, region: "west" },
  { name: "เพชรบุรี", lat: 13.1119, lon: 99.944, region: "west" },
  { name: "ประจวบคีรีขันธ์", lat: 11.8126, lon: 99.7957, region: "west" },
  // ภาคเหนือ
  { name: "เชียงใหม่", lat: 18.7883, lon: 98.9853, region: "north" },
  { name: "เชียงราย", lat: 19.9105, lon: 99.8406, region: "north" },
  { name: "ลำปาง", lat: 18.2888, lon: 99.4907, region: "north" },
  { name: "ลำพูน", lat: 18.5745, lon: 99.0087, region: "north" },
  { name: "แม่ฮ่องสอน", lat: 19.302, lon: 97.9654, region: "north" },
  { name: "น่าน", lat: 18.7756, lon: 100.773, region: "north" },
  { name: "พะเยา", lat: 19.1664, lon: 99.9019, region: "north" },
  { name: "แพร่", lat: 18.1445, lon: 100.1405, region: "north" },
  { name: "อุตรดิตถ์", lat: 17.62, lon: 100.0993, region: "north" },
  { name: "ตาก", lat: 16.8839, lon: 99.1257, region: "north" },
  { name: "สุโขทัย", lat: 17.0068, lon: 99.8265, region: "north" },
  { name: "พิษณุโลก", lat: 16.8211, lon: 100.2659, region: "north" },
  { name: "กำแพงเพชร", lat: 16.4827, lon: 99.5226, region: "north" },
  { name: "พิจิตร", lat: 16.4429, lon: 100.3487, region: "north" },
  { name: "เพชรบูรณ์", lat: 16.4194, lon: 101.1591, region: "north" },
  { name: "นครสวรรค์", lat: 15.703, lon: 100.137, region: "north" },
  { name: "อุทัยธานี", lat: 15.3835, lon: 100.0248, region: "north" },
  // ภาคอีสาน
  { name: "นครราชสีมา", lat: 14.9799, lon: 102.0977, region: "northeast" },
  { name: "บุรีรัมย์", lat: 14.993, lon: 103.1029, region: "northeast" },
  { name: "สุรินทร์", lat: 14.8818, lon: 103.4936, region: "northeast" },
  { name: "ศรีสะเกษ", lat: 15.1186, lon: 104.322, region: "northeast" },
  { name: "อุบลราชธานี", lat: 15.2287, lon: 104.8564, region: "northeast" },
  { name: "ยโสธร", lat: 15.7927, lon: 104.1451, region: "northeast" },
  { name: "ชัยภูมิ", lat: 15.8068, lon: 102.0316, region: "northeast" },
  { name: "อำนาจเจริญ", lat: 15.8656, lon: 104.6259, region: "northeast" },
  { name: "หนองบัวลำภู", lat: 17.2216, lon: 102.426, region: "northeast" },
  { name: "ขอนแก่น", lat: 16.4419, lon: 102.836, region: "northeast" },
  { name: "อุดรธานี", lat: 17.4139, lon: 102.7873, region: "northeast" },
  { name: "เลย", lat: 17.486, lon: 101.7223, region: "northeast" },
  { name: "หนองคาย", lat: 17.8783, lon: 102.742, region: "northeast" },
  { name: "มหาสารคาม", lat: 16.185, lon: 103.3005, region: "northeast" },
  { name: "ร้อยเอ็ด", lat: 16.0538, lon: 103.652, region: "northeast" },
  { name: "กาฬสินธุ์", lat: 16.4315, lon: 103.506, region: "northeast" },
  { name: "สกลนคร", lat: 17.1545, lon: 104.1478, region: "northeast" },
  { name: "นครพนม", lat: 17.4033, lon: 104.7693, region: "northeast" },
  { name: "มุกดาหาร", lat: 16.545, lon: 104.7239, region: "northeast" },
  { name: "บึงกาฬ", lat: 18.3609, lon: 103.6465, region: "northeast" },
  // ภาคตะวันออก
  { name: "ชลบุรี", lat: 12.9236, lon: 100.8825, region: "east" },
  { name: "ระยอง", lat: 12.6814, lon: 101.2816, region: "east" },
  { name: "จันทบุรี", lat: 12.6113, lon: 102.1038, region: "east" },
  { name: "ตราด", lat: 12.2428, lon: 102.5178, region: "east" },
  { name: "ฉะเชิงเทรา", lat: 13.6904, lon: 101.0779, region: "east" },
  { name: "ปราจีนบุรี", lat: 14.0509, lon: 101.373, region: "east" },
  { name: "สระแก้ว", lat: 13.8244, lon: 102.0645, region: "east" },
  // ภาคใต้
  { name: "ชุมพร", lat: 10.493, lon: 99.18, region: "south" },
  { name: "ระนอง", lat: 9.9528, lon: 98.6084, region: "south" },
  { name: "สุราษฎร์ธานี", lat: 9.1382, lon: 99.3215, region: "south" },
  { name: "พังงา", lat: 8.4509, lon: 98.5298, region: "south" },
  { name: "ภูเก็ต", lat: 7.8804, lon: 98.3923, region: "south" },
  { name: "กระบี่", lat: 8.0863, lon: 98.9063, region: "south" },
  { name: "นครศรีธรรมราช", lat: 8.4304, lon: 99.9631, region: "south" },
  { name: "ตรัง", lat: 7.5645, lon: 99.624, region: "south" },
  { name: "พัทลุง", lat: 7.6167, lon: 100.0742, region: "south" },
  { name: "สตูล", lat: 6.6238, lon: 100.0674, region: "south" },
  { name: "สงขลา", lat: 7.1898, lon: 100.5951, region: "south" },
  { name: "ปัตตานี", lat: 6.8692, lon: 101.25, region: "south" },
  { name: "ยะลา", lat: 6.5411, lon: 101.28, region: "south" },
  { name: "นราธิวาส", lat: 6.4254, lon: 101.8253, region: "south" },
];

// Hash Table (Map ของ JS) สำหรับค้นพิกัดจากชื่อจังหวัดในเวลาคงที่ O(1)
export const provinceMap: Map<string, Province> = new Map(
  PROVINCES.map((p) => [p.name, p])
);

export function getProvince(name: string): Province | undefined {
  return provinceMap.get(name);
}
