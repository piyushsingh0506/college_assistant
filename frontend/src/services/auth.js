const AUTH_STORAGE_KEYS = [
  "college_token",
  "college_role",
  "college_name",
  "college_user",
];

export function clearAuthSession() {
  AUTH_STORAGE_KEYS.forEach((key) =>
    localStorage.removeItem(key)
  );
}
