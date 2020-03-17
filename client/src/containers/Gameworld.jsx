import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import ai from "../api/axios-instance";
import errorMessage from "../utilities/error-message";

export default function Gameworld() {
  const history = useHistory();

  useEffect(() => {
    const main = async () => {
      let data;

      try {
        ({ data } = await ai.get("/gameworlds"));
        if (data.status !== "Logged In") {
          history.push("/lobby");
        }
      } catch (err) {
        errorMessage(err);
      }
    };

    main();
  });

  return (
    <div>
      <h1>Hello from gameworld</h1>
    </div>
  );
}
