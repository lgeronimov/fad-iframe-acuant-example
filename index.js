
window.onload = function () {
  initIframe();
};

// events available
const EVENT_MODULE = {
  INIT_MODULE: "INIT_MODULE",
  PROCESS_INIT: "PROCESS_INIT",
  PROCESS_ERROR: "PROCESS_ERROR",
  PROCESS_COMPLETED: "PROCESS_COMPLETED",
  MODULE_READY: "MODULE_READY",
};

// acuant credentials
const CREDENTIALS = {
  passiveUsername: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  passivePassword: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  passiveSubscriptionId: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  acasEndpoint: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  livenessEndpoint: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
  assureidEndpoint: 'XXXXXXXXXXXXXXXXXXXXXXXXX'
};

// optional, the app has default legends and colors
const CONFIGURATION = {
  views: {
    instructions: true,
    preview: true
  },
  customization: {
    fadCustomization: {
      colors: {
        primary: "#A70635",
        secondary: "#A70635",
        tertiary: "#363636",
      },
      buttons: {
        primary: {
          backgroundColor: "#A70635",
          backgroundColorDisabled: "#dcdcdc",
          labelColor: "#ffffff",
          labelColorDisabled: "#8e8e8e",
          border: "1px solid #A70635",
        },
      },
      fonts: {
        title: {
          fontSize: '25px',
          fontFamily: 'system-ui'
        },
        subtitle: {
          fontSize: '17px',
          fontFamily: 'system-ui'
        },
        content: {
          fontSize: '15px',
          fontFamily: 'system-ui'
        },
        informative: {
          fontSize: '12px',
          fontFamily: 'system-ui'
        },
        button: {
          fontSize: '17px',
          fontFamily: 'system-ui'
        }
      }
    },

    moduleCustomization: {
      legends: {
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

      },
      legendsInstructions: {
        title: 'Identificación',
        subtitle: 'Captura tu identifcación',
        buttonNext: 'Continuar'
      },
      legendsPreview: {
        title: 'Identificación',
        subtitle: 'Imagen frontal de tu identificación',
        confirmation: '¿Los datos de tu identificación son legibles?',
        buttonNext: 'Sí, continuar',
        buttonRetry: 'Volver a capturar'
      }
    }
  },
  pathDependencies: {
    // imageDirectory: 'ASSETS_URL'
  }
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
  DOMAIN_NOT_ALLOWED: -12,
};

let side = 0; //front
let idData = false;
let idPhoto = false;

let moduleParams = {
  credentials: CREDENTIALS,
  configuration: CONFIGURATION,
  side, // 0 - front id, 1 - back id
  idData, // true - ocr, false - without this data
  idPhoto, // true - get imaghen face of id, false - without this data
  imageQuality: 1, // quality of image id, range 0 - 1
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
  constructor(data) {
    this.id = data.id;
    this.idData = data.idData;
    this.idPhoto = data.idPhoto;
  }
}

// subscribe to message event to recive the events from the iframe
window.addEventListener("message", (message) => {
  // IMPORTANT: check the origin of the data
  if (message.origin.includes("firmaautografa.com")) {
    if (message.data.event === EVENT_MODULE.MODULE_READY) {
      // MODULE_READY
      initModule();
    }
    if (message.data.event === EVENT_MODULE.PROCESS_INIT) {
      // PROCESS_INIT
      // only informative
      console.log("Process init");
    } else if (message.data.event === EVENT_MODULE.PROCESS_ERROR) {
      // PRROCESS_ERROR
      console.log(message.data.data);
      if (message.data.data.code === ERROR_CODE.UNSUPPORTED_CAMERA) {
        // do something
        alert("Cámara no soportada, intenta en otro dispositivo");
      } else if (message.data.data.code === ERROR_CODE.FAIL_INITIALIZATIO) {
        // restart component
      } else {
        // restart component
        alert(JSON.stringify(message.data.data));
      }
    } else if (message.data.event === EVENT_MODULE.PROCESS_COMPLETED) {
      // PROCESS_COMPLETED
      console.log("Process completed");
      // use the results as you see fit
      console.log(message.data.data);
      // show result example
      // save documentInstance, is very important set this parameter in configuration to back image
      // save image front

      const result = new Result(message.data.data);
      if(side===0){
        sessionStorage.setItem('documentInstance', message.data.data.documentInstance);
        sessionStorage.setItem("idFront", message.data.data.id.image.data);
        initBackIdProcess();
        // showResult(result);
      }
      else {
        showResult(message.data.data);
      }
      
    }
  } else return;
});

function initIframe() {
  // get iframe
  const iframe = document.getElementById("fad-iframe-acuant");
  // url - https://devapiframe.firmaautografa.com/fad-iframe-acuant
  const tkn = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
  const url = `https://devapiframe.firmaautografa.com/fad-iframe-acuant?tkn=${tkn}`;
  // set src to iframe
  iframe.src = url;
}

function initModule() {
  const iframe = document.getElementById("fad-iframe-acuant");
  console.log(moduleParams)
  iframe.contentWindow.postMessage(
    new ResponseEvent(EVENT_MODULE.INIT_MODULE, moduleParams), iframe.src);
}

function showResult(response){
  const containerResult = document.getElementById("container-result");
  const containerIframe = document.getElementById("container-iframe-acuant");
  const imageIdFront = document.getElementById("image-id-front");
  const imageIdBack = document.getElementById("image-id-back");
  const imageIdPhoto = document.getElementById("image-id-photo");
  const codeResult = document.getElementById("code-result");
  
  containerIframe.style.display = "none";
  containerResult.style.display = "flex";
  imageIdFront.src = sessionStorage.getItem("idFront");
  imageIdBack.src = response.id.image.data;
  imageIdPhoto.src = response.idPhoto;
  codeResult.innerText = JSON.stringify(response.idData, null, 2) ;
}
function initBackIdProcess(){
  // front process
  side = 1; //back
  idData = true;
  idPhoto = true;
  const iframe = document.getElementById("fad-iframe-acuant");
  moduleParams.documentInstance = sessionStorage.getItem('documentInstance');
  moduleParams.idData = true;
  moduleParams.idPhoto = true;
  moduleParams.side = 1;
  iframe.src = '';
  setTimeout( () => initIframe(), 0);
}