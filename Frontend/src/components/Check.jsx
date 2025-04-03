import React from "react";
import useApiStore from "../StoreApi.js/ApiCall";
const Check = () => {
  const { checkApi } = useApiStore();
  return (
    <div className="mt-100">
      <button onClick={checkApi}>Click me !</button>
    </div>
  );
};

export default Check;
