import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session)
    return (
      <div className="p-4">
        <h2>You must be signed in</h2>
        <a href="/api/auth/signin" className="text-blue-600 underline">Sign in</a>
      </div>
    );

  return (
    <div className="p-4">
      <h1>Welcome, {session.user?.name ?? session.user?.email}</h1>
      <p>Your user ID: {session.user?.id}</p>
    </div>
  );
}
