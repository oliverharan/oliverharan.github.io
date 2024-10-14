import React from "react";
import LensForm from "../components/LensForm";
import LensList from "../components/LensList";

function LensPage() {
  return (
    <div>
      <h2>Lens Collection</h2>
      <LensForm />
      <LensList />
    </div>
  );
}

export default LensPage;
