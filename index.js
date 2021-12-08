window.onload = function () {
  initIframe();
};

const EVENT_MODULE = {
  PROCESS_INIT: "INIT_MODULE",
  PROCESS_ERROR: "PROCESS_ERROR",
  PROCESS_COMPLETED: "PROCESS_COMPLETED",
}

const CREDENTIALS = {
  passiveUsername: 'Acuant_Admin_PROD@na-at.com.mx',
  passivePassword: 'R3Z^gm^6C^YNM^vQ',
  passiveSubscriptionId: '3d0a5941-4528-475c-a8ce-15e8f3bca0df',
  acasEndpoint: "https://us.acas.acuant.net",
  livenessEndpoint:"https://us.passlive.acuant.net",
  assureidEndpoint: "https://services.assureid.net"
}

const LEGENDS = {
  initializing: 'iniciando1',
  processing: 'procesando1',
  scan: {
    none: 'ENFOCA TU ID SOBRE LA GUÍA1',
    smallDocument: 'ACERCATE MÁS1',
    goodDocument: null,
    capturing: 'CAPTURANDO',
    tapToCapture: 'TOCA LA PANTALLA PARA CAPTURAR',
  },
};


class ResponseEvent {
  event;
  data;
  constructor(event, data) {
    this.event = event;
    this.data = data;
  }
}

// subscribe to message event to recive the events from the iframe
window.addEventListener("message", (message) => {
  // IMPORTANT: check the origin of the data
  // if (message.origin.includes("firmaautografa.com")) {
    if (message.data.event === EVENT_MODULE.PROCESS_INIT) {
      // only informative
      console.log("Process init");
    } else if (message.data.event === EVENT_MODULE.PROCESS_ERROR) {
      // restart component and send error
      alert(JSON.stringify(message.data.data));
    } else if (message.data.event === EVENT_MODULE.PROCESS_COMPLETED) {
      // show result
      const containerResult = document.getElementById('container-result');
      const containerIframe = document.getElementById('container-iframe-acuant');
      const imageId = document.getElementById('image-id');
      const imageFace = document.getElementById('image-face');
      const ocr = document.getElementById('ocr');
      
      containerIframe.style.display = 'none';
      containerResult.style.display = 'flex';
      imageId.src = message.data.data.id.image.data;
      imageFace.src = message.data.data.idPhoto;
      ocr.innerHTML = JSON.stringify(message.data.data.idData.ocr);
      
      console.log("Process completed");
    }
  // } else return;
});


function initIframe() {
  // get iframe 
  const iframe = document.getElementById('fad-iframe-acuant');
  // url of fad, uat - uatwebfad4.firmaautografa.com, prod - mobile.firmaautografa.com
  const url = 'https://192.168.0.16:4300';
  // set src to iframe
  iframe.src = url;
  // send credentials to iframe
  iframe.onload = () => {
    iframe.contentWindow.postMessage(new ResponseEvent(EVENT_MODULE.PROCESS_INIT, {
      credentials: CREDENTIALS,
      legends: LEGENDS,
      side: 0, // 0 - front id, 1 - back id
      idPhoto: true, // true - get imaghen face of id, false - nothing
      idData: true, // true - ocr, false - nothing
      imageQuality: 1 // quality of image id, range 0 - 1
    }
  ), iframe.src);
  };
}


