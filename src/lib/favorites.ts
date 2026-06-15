// مخزن المفضلة (محلي عبر localStorage) — يعمل دون الحاجة لتعديل قاعدة البيانات.
// يبثّ حدثًا عند أي تغيير ليتزامن مع كل المكوّنات المفتوحة.

const KEY = "pe_favorites";
const EVENT = "favorites-updated";

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.map(String) : [];
  } catch {
    return [];
  }
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(String(id));
}

export function toggleFavorite(id: string): boolean {
  const sid = String(id);
  const current = getFavorites();
  const exists = current.includes(sid);
  const next = exists ? current.filter((x) => x !== sid) : [...current, sid];
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore quota errors */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
  return !exists; // القيمة الجديدة: هل أصبح مفضّلًا؟
}

// اشترك في تغييرات المفضلة؛ يُرجع دالة لإلغاء الاشتراك.
export function onFavoritesChange(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb); // مزامنة بين التبويبات
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
