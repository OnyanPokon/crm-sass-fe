/* eslint-disable react/prop-types */

const StatusBadge = ({ color, icon, text }) => {
  return (
    <div className={`inline-flex items-center gap-x-1 rounded-full bg-${color}-500 px-1.5 py-0.5 text-xs text-white`}>
      {icon}
      <span className="text-xs">{text}</span>
    </div>
  );
};

export default StatusBadge;
