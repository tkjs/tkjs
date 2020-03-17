import React from "react";
import { useHistory } from "react-router-dom";

import ai from "../api/axios-instance";
import errorMessage from "../utilities/error-message";

export default function AvatarCard(props) {
  const history = useHistory();

  const onClickHandler = e => {
    props.setLoading(true);

    ai.post("/gameworlds/authenticate", {
      gameworldId: props.consumersId,
      worldName: props.worldName
    })
      .then(({ data }) => {
        props.setLoading(false);
        history.push("/gameworld");
      })
      .catch(err => {
        props.setLoading(false);
        errorMessage(err);
      });
  };

  return (
    <div
      onClick={onClickHandler}
      className={`
          border border-blue-200 rounded-lg 
          cursor-pointer 
          hover:bg-gray-800 mb-2
        `}
    >
      <h1
        className={`
            text-gray-300 
            border-b border-blue-200 
            pt-1 mx-3 text-2xl font-hairline tracking-widest 
            inline-block
          `}
      >
        {props.worldName}
      </h1>
      <h2 className="text-gray-300 py-2 mx-3 text-xl">{props.avatarName}</h2>
    </div>
  );
}
