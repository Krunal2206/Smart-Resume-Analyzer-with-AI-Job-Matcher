export default function AdminResumesTab({ resumes }: { resumes: any[] }) {
  return (
    <div className="space-y-6">
      {resumes.map((r) => (
        <div
          key={r._id}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-1"
        >
          <h2 className="text-lg font-semibold text-white">{r.name}</h2>
          <p className="text-gray-400 text-sm">Email: {r.email}</p>
          <p className="text-gray-400 text-sm">
            Skills: {r.skills?.join(", ")}
          </p>
          <p className="text-gray-400 text-sm">
            Uploaded: {new Date(r.createdAt).toLocaleString()}
          </p>
          <div className="flex gap-4 mt-2 text-sm">
            <a
              href={`/api/download?id=${r._id}`}
              target="_blank"
              className="text-blue-400 hover:underline"
            >
              Download
            </a>
            <form action={`/api/delete/${r._id}`} method="POST">
              <button type="submit" className="text-red-500 hover:underline">
                Delete
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
