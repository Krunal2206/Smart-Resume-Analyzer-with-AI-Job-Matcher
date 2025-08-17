interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminUsersTab({ users }: { users: User[] }) {
  return (
    <div className="space-y-6">
      {users.map((user) => (
        <div
          key={user._id}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-1"
        >
          <h2 className="text-xl font-semibold text-white">{user.name}</h2>
          <p className="text-gray-400 text-sm">Email: {user.email}</p>
          <p className="text-gray-400 text-sm">Role: {user.role}</p>
        </div>
      ))}
    </div>
  );
}
