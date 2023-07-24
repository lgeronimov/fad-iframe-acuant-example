window.onload = function () {
 initProcess();
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
     labelColor: '#ffffff',
     borderColor: '#A70635',
     borderStyle: 'solid',
     borderWidth: '1px',
    },
    common: {
     backgroundColorDisabled: '#dcdcdc',
     labelColorDisabled: '#8e8e8e',
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
  imagesInstructions: {
   //  instruction: 'Custom image URL',
  },
  images: {
   //  instructionFrontManualCaptureMobile: 'Custom image URL',
   // instructionBackManualCaptureMobile: 'Custom image URL',
   // instructionFrontManualCaptureDesktop: 'Custom image URL',
   // instructionBackManualCaptureDesktop: 'Custom image URL'
  },
 },
};

async function initProcess() {
 const tkn = 'TOKEN';
 const options = {
  environment: FadSdk.getFadEnvironments().UAT,
 };

 try {
  const FAD_SDK = new FadSdk(tkn, options);
  const side = 0; // 0 - front id, 1 - back id
  const idData = true; // true - ocr, false - without this data
  const idPhoto = true; // true - get imaghen face of id, false - without this data
  const imageQuality = 0.5; // quality of image id, range 0 - 1
  const documentInstance = null;

  // Returns the image of identification (id.image.data) and relevant information (sharpness, glare), documentInstance, idData and idPhoto
  const acuantResponse = await FAD_SDK.startAcuant(CREDENTIALS, side, idData, idPhoto, imageQuality, documentInstance, CONFIGURATION);
  FAD_SDK.end();

  // PROCESS_COMPLETED
  console.log('Process completed');
  console.log(acuantResponse);
  // use the results as you see fit
  // show result example

  // save image front
  sessionStorage.setItem('idFront', acuantResponse.id.image.data);

  const containerResult = document.getElementById('container-result');
  const imageId = document.getElementById('image-id');
  const imageFace = document.getElementById('image-face');
  const ocr = document.getElementById('ocr');

  containerResult.style.display = 'flex';
  imageId.src = acuantResponse.id.image.data;
  imageFace.src = acuantResponse.idPhoto;
  ocr.innerHTML = JSON.stringify(acuantResponse.idData.ocr);
 } catch (ex) {
  // PRROCESS_ERROR
  console.log(ex);
  if (ex.code === FadSdk.Errors.Acuant.UNSUPPORTED_CAMERA) {
   // do something
   alert('Cámara no soportada, intenta en otro dispositivo');
  } else if (ex.code === FadSdk.Errors.Acuant.FAIL_INITIALIZATION) {
   // restart component
  } else if (ex.code === FadSdk.Errors.Acuant.FAIL_GET_OCR) {
   // ** RESTART THE WHOLE PROCESS OF CAPTURING ID **
   // If this error occurred when taking the back side of the id and a
   // document instance was being used; then it is necessary to take the front
   // side again and use the new document instance.
  } else if (ex.code === FadSdk.Errors.Acuant.FAIL_GET_FACE_IMAGE) {
   // ** RESTART THE WHOLE PROCESS OF CAPTURING ID **
   // If this error occurred when taking the back side of the id and a
   // document instance was being used; then it is necessary to take the front
   // side again and use the new document instance.
  } else if (ex.code === FadSdk.Errors.Acuant.FACE_IMAGE_URL_NOT_FOUND) {
   // ** RESTART THE WHOLE PROCESS OF CAPTURING ID **
   // If this error occurred when taking the back side of the id and a
   // document instance was being used; then it is necessary to take the front
   // side again and use the new document instance.
  } else if (ex.code === FadSdk.Errors.Acuant.FACE_IMAGE_NOT_FOUND) {
   // ** RESTART THE WHOLE PROCESS OF CAPTURING ID **
   // If this error occurred when taking the back side of the id and a
   // document instance was being used; then it is necessary to take the front
   // side again and use the new document instance.
  } else {
   // restart component
   alert(JSON.stringify(ex));
  }
 }
}
