import { useEffect, useRef, useState } from 'react'
import mergeImages from 'merge-images'
import template from './template.png'
import bitbox from './bitbox.png'
import Logo from './Logo.png'
import Resizer from 'react-image-file-resizer'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import PhotoCamera from '@material-ui/icons/PhotoCamera'
import TextField from '@material-ui/core/TextField'
import GetAppIcon from '@material-ui/icons/GetApp'

const App = () => {
  const resizeFile = (file) => new Promise(resolve => {
    Resizer.imageFileResizer(file, 300, 300, 'JPEG', 100, 0,
      uri => {
        resolve(uri)
      },
      'base64'
    )
  })

  const [uploadedImage, setUploadedImage] = useState(null)
  const [mergedImages, setMergedImages] = useState(null)
  const [name, setName] = useState('')

  const canvasRef = useRef()

  useEffect(() => {
    if (uploadedImage && template) {
      resizeFile(uploadedImage).then(resizedImage => {
        mergeImages([{ src: resizedImage, x: 43, y: 43 }, template]).then(
          b64 => {
            setMergedImages(b64)
          }
        )
      })
    }

    if (canvasRef.current && mergedImages) {
      document.getElementById('catch_image').style.display = 'none'
      document.getElementById('catch_canva').style.display = 'block'
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const imageObj = new Image()
      imageObj.onload = function () {
        ctx.drawImage(imageObj, 0, 0)
        ctx.font = '37pt sans-serif'
        ctx.fillStyle = '#3885FC'
        ctx.fillText(name, 46, 470)
        // console.log('drawn', ctx)
      }
      imageObj.src = mergedImages
      // console.log(imageObj.src)
    }
  }, [name, uploadedImage, mergedImages])

  const imageHandler = (e) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setUploadedImage(e.target.files[0])
      }
    }
    reader.readAsDataURL(e.target.files[0])
  }

  var downloadCanvasAsImage = function () {
    const canvasImage = canvasRef.current.toDataURL('image/png')
    if(uploadedImage === null)
      window.alert("Upload a Picture First :)")
    else if(name === '')
      window.alert("Enter your amazing name!")
    else {
      // this can be used to download any image from webpage to local disk
      const xhr = new XMLHttpRequest()
      xhr.responseType = 'blob'
      xhr.onload = function () {
        const a = document.createElement('a')
        a.href = window.URL.createObjectURL(xhr.response)
        a.download = `${name}-bitbox.png`
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      }
      xhr.open('GET', canvasImage) // This is to download the canvas Image
      xhr.send()
    }
  }

  return (
    <Container>
      <Grid style={{ alignItems: 'center', padding: '10px' }} container spacing={3}>
        <Grid item sm={3} xs={12} />
        <img alt='bitbox' src={Logo} style={{ width: '100px', height: '100px' }} />
        <h1 style={{ textAlign: 'center' }}>BitBox | Photobooth</h1>
      </Grid>
      <Grid style={{ alignItems: 'center' }} container spacing={3}>
        <Grid item xs={3} />
        <Grid item md={3} xs={12}>
          <TextField type='text' placeholder="Enter Participant's Name" id='participant-name' value={name} onChange={(e) => setName(e.target.value)} label="Name" variant="outlined" />
        </Grid>
        <Grid item md={3}> 
          <input style={{ display: 'none' }} id="contained-button-file" type='file' name='uploaded-image' accept='image/*' onChange={imageHandler} />
          <label htmlFor="contained-button-file">
            <Button variant="contained" color="primary" component="span">
              Upload You
            </Button>
          </label>
          <input style={{ display: 'none' }} id="icon-button-file" type='file' name='uploaded-image' accept='image/*' onChange={imageHandler} />
          <label htmlFor="icon-button-file">
            <IconButton color="primary" aria-label="upload picture" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
        </Grid>
        <Grid item md={3} />
        <Grid item md={3} />
        <Grid id='catch_canva' style={{ display: 'none' }} item md={4}>
          <canvas ref={canvasRef} style={{ width: '500px' }} width={940} height={788} />
        </Grid>
        <Grid id='catch_image' style={{ display: 'block' }} item md={4}>
          <img alt='participants pic' src={bitbox} style={{ width: '500px' }} />
        </Grid>
        <Grid item md={4} />
        <Grid item md={7} />
        <Grid item md={2}>
          <Button variant='contained' color='primary' onClick={downloadCanvasAsImage}><GetAppIcon />Download</Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default App
