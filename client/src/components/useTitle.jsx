import React, { useEffect } from "react";

const useTitle = (title) => {
  useEffect(() => {
    document.title = `${title} | MERN Authentication`;
  }, []);
};

export default useTitle;
