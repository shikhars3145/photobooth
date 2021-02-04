import { useEffect, useRef, useState } from 'react';
import mergeImages from 'merge-images';
import template from './template.png'
import Resizer from 'react-image-file-resizer';


const App = () => {

  const resizeFile = (file) => new Promise(resolve => {
    Resizer.imageFileResizer(file, 300, 300, 'JPEG', 100, 0,
    uri => {
      resolve(uri);
    },
    'base64'
    );
});

  const [uploadedImage, setUploadedImage] = useState(null);
  const [mergedImages, setMergedImages] = useState(null);
  const [name, setName] = useState('')

  const imageRef = useRef();
  const canvasRef = useRef();


  useEffect(() => {
    if(uploadedImage && template)
    resizeFile(uploadedImage).then( resizedImage => {    mergeImages([{src:resizedImage, x:43, y:43},template]).then(
      b64 => {
        imageRef.current.src = b64;
        setMergedImages(b64);
      }
    )})
    
  }, [uploadedImage])

  useEffect(() => {
    if(canvasRef.current && mergedImages)
    {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const imageObj = new Image();
      imageObj.onload = function(){
        ctx.drawImage(imageObj,0,0);
        ctx.font = "37pt sans-serif";
        ctx.fillStyle = '#3885FC';
        ctx.fillText(name, 46, 470);
        console.log("drawn",ctx)
      }
      imageObj.src = mergedImages;
      console.log(imageObj.src)

    }
  }, [mergedImages])

  const imageHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if(reader.readyState === 2 ){
        // setUploadedImage(reader.result);
        setUploadedImage(e.target.files[0]);
      }
    }
    reader.readAsDataURL(e.target.files[0])
  }

  var downloadCanvasAsImage = function(){

    let canvasImage = canvasRef.current.toDataURL('image/png');

    // this can be used to download any image from webpage to local disk
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
        let a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = `${name}-participation.png`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove()
      };
      xhr.open('GET', canvasImage); // This is to download the canvas Image
      xhr.send();
}


  return (
    <div>
      <input type='text' id='participant-name' value={name} onChange={(e)=>setName(e.target.value)} />
      <img ref={imageRef} src={uploadedImage} style={{width:'500px'}} />
      <input type='file'  name='uploaded-image' id='uploaded-image' accept="image/*" onChange={imageHandler}/>
      <canvas ref={canvasRef} width={940} height={788} />
      <button onClick={downloadCanvasAsImage}>DOWNLOAD</button>
    </div>
  )
}

export default App;
