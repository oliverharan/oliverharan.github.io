import React from "react";

const manufacturers = ["Nikon", "Canon", "Sony", "Fujifilm", "Panasonic"];

function Manufacturers() {
  return (
    <div className="manufacturers-tabs">
      <ul>
        {manufacturers.map((manufacturer, index) => (
          <li key={index}>
            <button>{manufacturer}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Manufacturers;
