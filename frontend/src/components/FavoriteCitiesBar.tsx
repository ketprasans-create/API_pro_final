/**
 * components/FavoriteCitiesBar.tsx
 * -----------------------------------------------------------------------
 * ฟีเจอร์ 4: Favorite Cities (Zustand + localStorage) — Quick Access Bar
 * อ่าน/เขียนสโตร์ useFavoriteCities โดยตรง ไม่ต้องส่ง prop ลงมาจาก parent
 * -----------------------------------------------------------------------
 */
import { useFavoriteCities } from "../hooks/useFavoriteCities";
import { StarIcon } from "./icons";

interface Props {
  currentProvince: string | null;
  onSelect: (province: string) => void;
}

export default function FavoriteCitiesBar({ currentProvince, onSelect }: Props) {
  const favorites = useFavoriteCities((s) => s.favorites);
  const toggleFavorite = useFavoriteCities((s) => s.toggleFavorite);
  const isFavorite = useFavoriteCities((s) => s.isFavorite);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {favorites.length === 0 ? (
        <p className="text-xs text-muted">
          ยังไม่มีจังหวัดโปรด — กดรูปดาวข้างชื่อจังหวัดเพื่อปักหมุดไว้ที่นี่
        </p>
      ) : (
        favorites.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => onSelect(name)}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              name === currentProvince
                ? "border-sky bg-sky text-white"
                : "border-line bg-surface text-ink/70"
            }`}
          >
            {name}
          </button>
        ))
      )}

      {currentProvince && (
        <button
          type="button"
          onClick={() => toggleFavorite(currentProvince)}
          title={isFavorite(currentProvince) ? "เอาออกจากจังหวัดโปรด" : "ปักหมุดเป็นจังหวัดโปรด"}
          className="ml-auto text-orange"
        >
          <StarIcon filled={isFavorite(currentProvince)} width={18} height={18} />
        </button>
      )}
    </div>
  );
}
