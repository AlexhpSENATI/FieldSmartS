
export function loadUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

export function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

export function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem("currentUser");
}
