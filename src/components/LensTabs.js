import React from "react";
import LensList from "./LensList";

const LensTabs = ({ lenses }) => {
  const manufacturers = [...new Set(lenses.map((lens) => lens.make))];

  return (
    <div>
      {manufacturers.map((make) => (
        <div key={make}>
          <h3>{make}</h3>
          <LensList lenses={lenses.filter((lens) => lens.make === make)} />
        </div>
      ))}
    </div>
  );
};

export default LensTabs;
