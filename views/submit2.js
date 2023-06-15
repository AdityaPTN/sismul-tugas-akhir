// Client side unique ID - This could and probably should move to server with UUID
function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

// Function to compress image file using LZW algorithm
function compressImageLZW(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const imageData = reader.result;
      let dictionary = {};
      let compressedData = [];
      let currentChar = '';
      let nextCode = 256;

      // Process the image data
      for (let i = 0; i < imageData.length; i++) {
        let nextChar = imageData[i];

        // Check if the combination of currentChar and nextChar exists in the dictionary
        let newEntry = currentChar + nextChar;
        if (dictionary.hasOwnProperty(newEntry)) {
          currentChar = newEntry;
        } else {
          // Add the code for the currentChar to the compressed data
          compressedData.push(dictionary[currentChar]);

          // Add the new combination (currentChar + nextChar) to the dictionary
          dictionary[newEntry] = nextCode;
          nextCode++;

          // Set currentChar to nextChar
          currentChar = nextChar;
        }
      }

      // Add the code for the last currentChar to the compressed data
      compressedData.push(dictionary[currentChar]);

      resolve(compressedData);
    };

    reader.onerror = () => {
      reject(new Error('Error reading image file.'));
    };

    // Read the image file as a data URL
    reader.readAsDataURL(file);
  });
}


  
document.getElementById('submitbtn').addEventListener("click", () => {
    let postid = uuidv4();
    let inputElem = document.getElementById('imgfile').files[0];
    let formData = new FormData();

    fetch(compressImageLZW(inputElem))
    .then(response => response.blob())
    .then(blob => {
      // Create a new File object from the Blob data
      const imageFile = new File([blob], `${postid}_post.jpeg`, { type: blob.type });
      
      // Use the imageFile as needed (e.g., upload, process, etc.)
      console.log('Image File:', imageFile);
      return imageFile;
    })
    .catch(error => {
      // Handle any errors
      console.error('Error retrieving object URL:', error);
    });

    // let blob = file_compress.slice(0, file_compress.size, "image/jpeg")
    // newFile = new File([blob], `${postid}_post.jpeg`, {type: "image/jpeg"});
    
    formData.append('imgfile', imageFile);
    fetch('/upload', {
        method: "POST",
        body: formData,
    })
    .then(res => res.text())
    .then((x) => console.log(x));
});