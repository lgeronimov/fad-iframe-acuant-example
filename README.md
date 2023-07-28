# FAD-IFRAME-ACUANT-EXAMPLE

## Vanilla JS

### Installation

Download the `fad-sdk.umd.min.js` file and include the script in your HTML file before your `index.js` file.

```html
<!DOCTYPE html>
<html lang="en">
 <head> </head>
 <body>
  ...
  <script src="fad-sdk.umd.min.js"></script>
  <script src="index.js"></script>
 </body>
</html>
```

### FAD Credentials (Token)

Ask to the product team the client's user for the NA-AT Technologies services

The Product team must give you the next data:

User:

> example.company.project@na-at-com.mx

Password:

> xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Once the account has been created, use the next link to generate the user's token for the usage of the iframe:

> https://devapiframe.firmaautografa.com/token-generator

### Usage

Create a new instance of the FadSdk class adding the user's token created above and the options (if is necesary)

```js
window.onload = async () => {
 const token = 'TOKEN';
 const options = {
  environment: FadSdk.getFadEnvironments().UAT,
 };

 const FAD_SDK = new FadSdk(tkn, options);
 try {
  const acuantResponse = await FAD_SDK.startAcuantBeta(
   credentials, // Acuant credentials
   idData, // Indicates if the id data is required (Boolean)
   idPhoto, // Indicates if the id photo is required (Boolean)
   CONFIGURATION // Customizable configuration like colors or legends.
  );

  // use the result as yuo fit
 } catch (ex) {
  // Catches the error code
  console.error(ex);
 }
};
```

> **IMPORTANT NOTE**
> Check the values of glare and sharpness of each ID image. if sharpness < 60 or glare < 90 consider as error.

<!-- ## NPM
### Installation
```bash
npm i  @fad-producto/fad-sdk
```
### Usage -->
