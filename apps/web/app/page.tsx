import CreateUser from './components/CreateUser';

export default function HomePage() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to DevConnect</h1>
      <CreateUser />
    </main>
  );
}
