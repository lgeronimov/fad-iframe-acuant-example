window.onload = function () {
  initIframe();
};

// events available
const EVENT_MODULE = {
  INIT_MODULE: "INIT_MODULE",
  PROCESS_INIT: "PROCESS_INIT",
  PROCESS_ERROR: "PROCESS_ERROR",
  PROCESS_COMPLETED: "PROCESS_COMPLETED",
};

// acuant credentials
const CREDENTIALS = {
  passiveUsername: 'acuantEUUser@naat.com',
  passivePassword: 'Q^59zWJzZ^jZrw^q',
  passiveSubscriptionId: 'c681321c-2728-4e8a-a3df-a85ba8a11748',
  acasEndpoint: "https://eu.acas.acuant.net",
  assureidEndpoint: "https://eu.assureid.acuant.net"
}

// legends of module
const LEGENDS = {
  initializing: "iniciando",
  processing: "procesando",
  scan: {
    none: "ENFOCA TU ID SOBRE LA GUÍA",
    smallDocument: "ACERCATE MÁS",
    goodDocument: "",
    capturing: "CAPTURANDO ",
    tapToCapture: "TOCA LA PANTALLA PARA CAPTURAR",
  },
  manualCapture: {
    instruction: "Captura el frente de tu identificación",
    buttonNext: "Continuar",
  },
};

// errors
const ERROR_CODE = {
  REQUIRED_CREDENTIAL: -1,
  FAIL_INITIALIZATION: -2,
  UNSUPPORTED_CAMERA: -3,
  FAIL_INITIALIZATION_CAMERA_U: -4,
  FAIL_CREATION_INSTANCE_DOCUMEN: -5,
  FAIL_UPLOAD_IMAG: -6,
  FAIL_GET_OC: -7,
  FAIL_GET_FACE_IMAG: -8,
  FACE_IMAGE_URL_NOT_FOUND: -9,
  FACE_IMAGE_NOT_FOUN: -10,
  RESOURCES_COULD_NOT_BE_LOADED: -11,
  DOMAIN_NOT_ALLOWED: -12
}


class ResponseEvent {
  event;
  data;
  constructor(event, data) {
    this.event = event;
    this.data = data;
  }
}

class Result {
  id; // image of identification (image.data) and relevant information (sharpness, glare) 
  idData; // ocr idData.ocr;
  idPhoto; // image of the face cutout
}


// subscribe to message event to recive the events from the iframe
window.addEventListener("message", (message) => {
  // IMPORTANT: check the origin of the data
  if (message.origin.includes("firmaautografa.com")) {
    if (message.data.event === EVENT_MODULE.PROCESS_INIT) { // PROCESS_INIT
      // only informative
      console.log("Process init");
    } else if (message.data.event === EVENT_MODULE.PROCESS_ERROR) { // PRROCESS_ERROR
      console.log(message.data.data);
      if (message.data.data.code === ERROR_CODE.UNSUPPORTED_CAMERA) {
        // do something
        alert('Cámara no soportada, intenta en otro dispositivo')
      } else if (message.data.data.code === ERROR_CODE.FAIL_INITIALIZATIO) {
        // restart component
      } else {
        // restart component
        alert (JSON.stringify(message.data.data))
      }
    } else if (message.data.event === EVENT_MODULE.PROCESS_COMPLETED) { // PROCESS_COMPLETED
      console.log("Process completed");
      // use the results as you see fit 
      console.log(message.data.data);
      
      // save image back
      sessionStorage.setItem('idBack', message.data.data.id.image.data);

      // set idetentificatioData
      const identificationData = {
        documentNumber: message.data.data.idData.ocr.documentNumber,
        backNumber: message.data.data.idData.ocr.backNumber,
        personalNumber: message.data.data.idData.ocr.personalNumber,
        verificationNumber: message.data.data.idData.ocr.verificationNumber
      };

      // set idetentificatioData
      sessionStorage.setItem('identificationData', JSON.stringify(identificationData));      
      
      // show result example
      const containerResult = document.getElementById('container-result');
      const containerIframe = document.getElementById('container-iframe-acuant');
      const imageId = document.getElementById('image-id');
      const imageFace = document.getElementById('image-face');
      const imageSharpness = document.getElementById('image-sharpness');
      const ocr = document.getElementById('ocr');
      containerIframe.style.display = 'none';
      containerResult.style.display = 'flex';
      imageId.src = message.data.data.id.image.data;
      imageSharpness.innerHTML = message.data.data.id.sharpness;
      imageFace.src = message.data.data.idPhoto;
      ocr.innerHTML = JSON.stringify(message.data.data.idData.ocr);
    }
  } else return;
});

function initIframe() {
  // get iframe
  const iframe = document.getElementById("fad-iframe-acuant");
  // url - https://apiiduat.firmaautografa.com/
  const url = "https://apiiduat.firmaautografa.com/";
  // set src to iframe
  iframe.src = url;
  // subscribe to onload
  iframe.onload = () => {
    // send configuration
    iframe.contentWindow.postMessage(
      new ResponseEvent(EVENT_MODULE.INIT_MODULE, {
        credentials: CREDENTIALS,
        legends: LEGENDS,
        side: 1, 
        idData: true, 
        idPhoto: true, // true - get imaghen face of id, false - without this data
        imageQuality: 0.5, // quality of image id, range 0 - 1
        documentInstance: sessionStorage.getItem('documentInstance') // instance obtained in the front image
      }), iframe.src);
  };
}
