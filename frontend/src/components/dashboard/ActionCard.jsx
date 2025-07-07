function ActionCard({ icon: Icon, title, description, buttonText, onClick }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-gray-100 rounded-full">
          <Icon className="h-8 w-8 text-gray-600" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <button
        onClick={onClick}
        className="px-4 py-2 bg-[#1e3a5f] text-white font-medium rounded-lg hover:bg-[#2a4a7f] transition duration-200"
      >
        {buttonText}
      </button>
    </div>
  );
}

export default ActionCard;