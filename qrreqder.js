// Check if the Barcode Detection API is available
if (!('BarcodeDetector' in window)) {
    console.log('Barcode Detection is not supported by this browser.');
  } else {
    // Create a new BarcodeDetector object
    let detector = new BarcodeDetector();
  
    // Access the camera and get video stream
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(function(stream) {
        // Display the video stream in a video element
        let video = document.querySelector('video');
        video.srcObject = stream;
        video.setAttribute('playsinline', true); // required to tell iOS safari we don't want fullscreen
        video.play();
  
        // Start detecting barcodes
        detectBarcodes(detector, video);
      })
      .catch(function(err) {
        console.log('An error occurred: ' + err);
      });
  }
  
  function detectBarcodes(detector, video) {
    // Use requestAnimationFrame for smooth scanning
    requestAnimationFrame(() => {
      detectBarcodes(detector, video);
    });
  
    // Prepare a canvas to draw video frame
    let canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    // Detect barcodes in the video frame
    detector.detect(canvas)
      .then(barcodes => {
        barcodes.forEach(barcode => console.log(barcode.rawValue));
      })
      .catch(err => {
        console.log('Barcode detection failed:', err);
      });
  }
  