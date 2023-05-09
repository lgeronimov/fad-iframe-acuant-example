window.onload = function () {
 initIframe();
};

// events available
const EVENT_MODULE = {
 INIT_MODULE: 'INIT_MODULE',
 PROCESS_INIT: 'PROCESS_INIT',
 PROCESS_ERROR: 'PROCESS_ERROR',
 PROCESS_COMPLETED: 'PROCESS_COMPLETED',
 MODULE_READY: 'MODULE_READY',
};

// acuant credentials
const CREDENTIALS = {
 passiveUsername: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
 passivePassword: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
 passiveSubscriptionId: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
 acasEndpoint: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
 livenessEndpoint: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
 assureidEndpoint: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
};

// optional, the app has default legends and colors
const CONFIGURATION = {
 views: {
  instructions: true,
  preview: true,
 },
 customization: {
  fadCustomization: {
   colors: {
    primary: '#A70635',
    secondary: '#A70635',
    tertiary: '#363636',
   },
   buttons: {
    primary: {
     backgroundColor: '#A70635',
     backgroundColorDisabled: '#dcdcdc',
     labelColor: '#ffffff',
     labelColorDisabled: '#8e8e8e',
     border: '1px solid #A70635',
    },
   },
   fonts: {
    title: {
     fontSize: '25px',
     fontFamily: 'system-ui',
    },
    subtitle: {
     fontSize: '17px',
     fontFamily: 'system-ui',
    },
    content: {
     fontSize: '15px',
     fontFamily: 'system-ui',
    },
    informative: {
     fontSize: '12px',
     fontFamily: 'system-ui',
    },
    button: {
     fontSize: '17px',
     fontFamily: 'system-ui',
    },
   },
  },

  moduleCustomization: {
   legends: {
    scan: {
     none: 'ENFOCA TU ID SOBRE LA GUÍA',
     smallDocument: 'ACERCATE MÁS',
     bigDocument: 'DEMASIADO CERCA',
     goodDocument: '',
     capturing: 'CAPTURANDO ',
     tapToCapture: 'TOCA LA PANTALLA PARA CAPTURAR',
    },
    manualCapture: {
     tooltip: 'Captura nuevamente',
     mobile: {
      instruction: 'Captura el frente de tu identificación',
      buttonNext: 'Continuar',
     },
     desktop: {
      instruction: 'Sube el frente de tu identificación',
      title: 'Frente',
     },
    },
    common: {
     loader: {
      initializing: 'iniciando',
      processing: 'procesando',
     },
    },
   },
   legendsInstructions: {
    title: 'Identificación',
    subtitle: 'Captura tu identifcación',
    buttonNext: 'Continuar',
   },
   legendsPreview: {
    title: 'Identificación',
    subtitle: 'Imagen de tu identificación',
    confirmation: '¿Los datos de tu identificación son legibles?',
    buttonNext: 'Sí, continuar',
    buttonRetry: 'Volver a capturar',
   },
   style: {
    common: {
     loader: {
      animationColor: '#FFFFFF',
      backgroundColor: '#000000',
      labelColor: '#FFFFFF',
     },
    },
   },
  },
 },
 pathDependencies: {
  // imageDirectory: 'ASSETS_URL',
  images: {
   instructionFrontManualCaptureMobile: 'Custom image URL',
   // instructionBackManualCaptureMobile: 'Custom image URL',
   // instructionFrontManualCaptureDesktop: 'Custom image URL',
   // instructionBackManualCaptureDesktop: 'Custom image URL'
  },
 },
};

// errors
const ERROR_CODE = {
 REQUIRED_CREDENTIALS: -1,
 FAIL_INITIALIZATION: -2,
 UNSUPPORTED_CAMERA: -3,
 FAIL_INITIALIZATION_CAMERA_UI: -4,
 FAIL_CREATION_INSTANCE_DOCUMENT: -5,
 FAIL_UPLOAD_IMAGE: -6,
 FAIL_GET_OCR: -7,
 FAIL_GET_FACE_IMAGE: -8,
 FACE_IMAGE_URL_NOT_FOUND: -9,
 FACE_IMAGE_NOT_FOUND: -10,
 RESOURCES_COULD_NOT_BE_LOADED: -11,
 UNEXPECTED_ACUANT_ERROR: -12,
 UNSUPPORTED_IMAGE: -13,
 IMAGE_BLURRY: -14,
};

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
window.addEventListener('message', (message) => {
 // IMPORTANT: check the origin of the data
 if (message.origin.includes('firmaautografa.com')) {
  if (message.data.event === EVENT_MODULE.MODULE_READY) {
   // MODULE_READY
   initModule();
  }
  if (message.data.event === EVENT_MODULE.PROCESS_INIT) {
   // PROCESS_INIT
   // only informative
   console.log('Process init');
  } else if (message.data.event === EVENT_MODULE.PROCESS_ERROR) {
   // PRROCESS_ERROR
   console.log(message.data.data);
   if (message.data.data.code === ERROR_CODE.UNSUPPORTED_CAMERA) {
    // do something
    alert('Cámara no soportada, intenta en otro dispositivo');
   } else if (message.data.data.code === ERROR_CODE.FAIL_INITIALIZATION) {
    // restart component
   } else if (message.data.data.code === ERROR_CODE.FAIL_GET_OCR) {
    // ** RESTART THE WHOLE PROCESS OF CAPTURING ID **
    // If this error occurred when taking the back side of the id and a
    // document instance was being used; then it is necessary to take the front
    // side again and use the new document instance.
   } else if (message.data.data.code === ERROR_CODE.FAIL_GET_FACE_IMAGE) {
    // ** RESTART THE WHOLE PROCESS OF CAPTURING ID **
    // If this error occurred when taking the back side of the id and a
    // document instance was being used; then it is necessary to take the front
    // side again and use the new document instance.
   } else if (message.data.data.code === ERROR_CODE.FACE_IMAGE_URL_NOT_FOUND) {
    // ** RESTART THE WHOLE PROCESS OF CAPTURING ID **
    // If this error occurred when taking the back side of the id and a
    // document instance was being used; then it is necessary to take the front
    // side again and use the new document instance.
   } else if (message.data.data.code === ERROR_CODE.FACE_IMAGE_NOT_FOUND) {
    // ** RESTART THE WHOLE PROCESS OF CAPTURING ID **
    // If this error occurred when taking the back side of the id and a
    // document instance was being used; then it is necessary to take the front
    // side again and use the new document instance.
   } else {
    // restart component
    alert(JSON.stringify(message.data.data));
   }
  } else if (message.data.event === EVENT_MODULE.PROCESS_COMPLETED) {
   // PROCESS_COMPLETED
   console.log('Process completed');
   // use the results as you see fit
   console.log(message.data.data);
   // show result example

   // save image front
   sessionStorage.setItem('idFront', message.data.data.id.image.data);

   const containerResult = document.getElementById('container-result');
   const containerIframe = document.getElementById('container-iframe-acuant');
   const imageId = document.getElementById('image-id');
   const imageFace = document.getElementById('image-face');
   const ocr = document.getElementById('ocr');
   containerIframe.style.display = 'none';
   containerResult.style.display = 'flex';
   const result = new Result(message.data.data);
   imageId.src = result.id.image.data;
   imageFace.src = result.idPhoto;
   ocr.innerHTML = JSON.stringify(result.idData.ocr);
  }
 } else return;
});

function initIframe() {
 // get iframe
 const iframe = document.getElementById('fad-iframe-acuant');
 // url - https://devapiframe.firmaautografa.com/fad-iframe-acuant
 const tkn = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
 const url = `https://devapiframe.firmaautografa.com/fad-iframe-acuant?tkn=${tkn}`;
 // set src to iframe
 iframe.src = url;
}

function initModule() {
 const iframe = document.getElementById('fad-iframe-acuant');
 iframe.contentWindow.postMessage(
  new ResponseEvent(EVENT_MODULE.INIT_MODULE, {
   credentials: CREDENTIALS,
   configuration: CONFIGURATION,
   side: 0, // 0 - front id, 1 - back id
   idData: true, // true - ocr, false - without this data
   idPhoto: true, // true - get imaghen face of id, false - without this data
   imageQuality: 0.5, // quality of image id, range 0 - 1
  }),
  iframe.src
 );
}
