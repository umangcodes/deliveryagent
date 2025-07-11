export default function InfoRow({ label, value, icon }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-xl">{icon}</span>
      <div>
        <span className="font-semibold">{label}:</span>{' '}
        <span className="text-gray-700">{value}</span>
      </div>
    </div>
  );
}
