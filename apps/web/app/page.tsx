'use client';

import { trpc } from '@/utils/trpc';

export default function HomePage() {
  const { data, isLoading, error } = trpc.getUsers.useQuery();

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-600">Error: {error.message}</p>;

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Users</h1>
      <ul className="space-y-2">
        {data && data.length > 0 ? (
          data.map((user) => (
            <li key={user.id} className="border p-3 rounded">
              <p><strong>{user.name}</strong></p>
              <p className="text-gray-500">{user.email}</p>
            </li>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </ul>
    </main>
  );
}
