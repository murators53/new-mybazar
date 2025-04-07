const RainbowDivider = () => {
    return (
      <div className="w-full h-2 flex overflow-hidden ">
        {[
          "bg-red-500",
          "bg-orange-500",
          "bg-yellow-400",
          "bg-green-500",
          "bg-blue-500",
          "bg-indigo-500",
          "bg-purple-700",
        ].map((color, i) => (
          <div key={i} className={`${color} flex-1`} />
        ))}
      </div>
    );
  };
  
  export default RainbowDivider;
  