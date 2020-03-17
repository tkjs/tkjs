import { toast } from "react-toastify";

export default function(err) {
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    err.response.data.errors.forEach(error => toast.error(error));
  } else if (err.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log("ERROR REQUEST");
    console.log(err.request);
    toast.error("Error just happened, check console");
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("ERROR MESSAGE");
    console.log("Error", err.message);
    toast.error("Error just happened, check console");
  }
  console.log("ERROR CONFIG");
  console.log(err.config);
  toast.error("Error just happened, check console");
}
