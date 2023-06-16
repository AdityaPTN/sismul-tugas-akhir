// Function to compress an image file and return the compressed image file
function compressImage(file, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Convert file to base64 string
    reader.onloadend = function () {
      const img = new Image();
      img.src = reader.result;

      // Wait for image to load
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions to image dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0);

        // Get compressed image data as Blob
        canvas.toBlob(
          function (compressedBlob) {
            resolve(compressedBlob);
          },
          'image/jpeg',
          quality
        );
      };

      // Reject if there is an error loading the image
      img.onerror = function () {
        reject(new Error('Error loading image.'));
      };
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);
  });
}

document.getElementById('submitbtn').addEventListener('click', () => {
  let inputElem = document.getElementById('imgfile').files[0];
  let formData = new FormData();

  compressImage(inputElem, 0.8)
    .then(compressedBlob => {
      // Create a new File object from the Blob data
      const fileName = inputElem.name.split('.')[0];
      const imageFile = new File([compressedBlob], `${fileName}.jpeg`, {
        type: 'image/jpeg',
      });

      // Use the imageFile as needed (e.g., upload, process, etc.)
      console.log('Image File:', imageFile);

      // Append the imageFile to the formData
      formData.append('imgfile', imageFile);

      // Make the fetch request
      return fetch('/upload', {
        method: 'POST',
        body: formData,
      });
    })
    .then((res) => res.text())
    .then((x) => console.log(x))
    .catch((error) => {
      // Handle any errors
      console.error('Error:', error);
    });
});
