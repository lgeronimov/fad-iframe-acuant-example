window.onload = function () {
  initIframe();
};

  // subscribe to message event to recive the events from the iframe
  window.addEventListener("message", (message) => {
    // IMPORTANT: check the origin of the data!
    if (message.origin.includes("firmaautografa.com")) {
      if (message.data.event === "PROCESS_INIT") {
        // only informative
        console.log("Process init");
      } else if (message.data.event === "PROCESS_ERROR") {
        // restart component and send error
        console.log("Unespected error:" + JSON.stringify(message.data.data));
      } else if (message.data.event === "PROCESS_COMPLETED") {
        // end of the process
        console.log("Process completed");
      } else if (message.data.event === "ENTRY_PATH") {
        // show current path
        console.log("Current path: " + message.data.data);
      }
    } else return;
  });



window.onload = function () {
  initIframe();
};

function initIframe() {
  // get iframe 
  const iframe = document.getElementById("fad-iframe");
  // ticket is the id of the process
  const ticket = '0bf87f4de9d99772167e3f015745a5d777795614e27e5eafeed6d464bd7c935ed467792cea0f6eacc8ec4e9418cc4257'
  // url of fad, uat - uatwebfad4.firmaautografa.com, prod - mobile.firmaautografa.com
  const url = 'https://uatwebfad4.firmaautografa.com/main?ticket='
  // set src to iframe
  iframe.src = url + ticket;
  // show loader - optional
  iframe.onload = () => {
    // hide loader - optional
  };
}


