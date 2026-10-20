export function formatRupees(value) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function formatSetupDate(value) {
  if (!value) return "NO EXPIRY";
  return new Date(`${value}T00:00:00`)
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

// "Monkey D. Luffy" -> "MD"
export function initialsOf(name) {
  if (!name) return "··";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
