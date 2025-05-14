const Feature = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="flex items-start gap-4">
    <div className="text-blue-500 mt-1">{icon}</div>
    <div>
      <h3 className="text-xl font-bold mb-1">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </div>
  </div>
);

export default Feature;