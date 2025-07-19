```typescript
export async function fetchUsers() {
  const response = await fetch('http://YOUR_COMPUTER_IP:3000/api/users');
  return response.json();
}
```;
