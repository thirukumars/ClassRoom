$(document).ready(function(){
run()
})
async function run(){
  Promise.all([
  await faceapi.loadSsdMobilenetv1Model('./models'),
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  await faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    await faceapi.loadFaceLandmarkModel('./models'),
  await faceapi.loadFaceRecognitionModel('./models')
 ])
    const videoEl=document.getElementById('inputVideo')
    navigator.getUserMedia(
        {video:{}},
        stream=>videoEl.srcObject=stream,
        err=>console.err(err)
    )
    onPlay(videoEl)
}
async function onPlay(videoEl){
   
  console.log('it is running');
    const canvas =document.getElementById('overlay');
      const displaySize = { width: videoEl.width, height: videoEl.height }
      faceapi.matchDimensions(canvas, displaySize)
      console.log('it is running 2')
        
    const options = new faceapi.TinyFaceDetectorOptions()
  let fullFaceDescriptions = await faceapi.detectAllFaces(videoEl, options).withFaceLandmarks().withFaceExpressions().withFaceDescriptors()
fullFaceDescriptions=faceapi.resizeResults(fullFaceDescriptions,displaySize)
const labels = ['praveen','face1','face2','praveen2','boobal','dhaya']
const labeledFaceDescriptors = await Promise.all(
  labels.map(async label => {
    // fetch image data from urls and convert blob to HTMLImage element
    const imgUrl = `./${label}.jpg`
    const img = await faceapi.fetchImage(imgUrl)
    
    // detect the face with the highest score in the image and compute it's landmarks and face descriptor
    const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceExpressions().withFaceDescriptor()
    
    if (!fullFaceDescription) { 
      throw new Error(`no faces detected for ${label}`)
    }
    
    const faceDescriptors = [fullFaceDescription.descriptor]
    return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
  })
)  
const maxDescriptorDistance = 0.6
const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance)

const results = fullFaceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor))
 results.forEach((bestMatch, i) => {
  const box = fullFaceDescriptions[i].detection.box
  const text = bestMatch.toString()
  const drawBox = new faceapi.draw.DrawBox(box, { label: text })
  // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
  // faceapi.draw.drawDetections(canvas, fullFaceDescriptions)
      faceapi.draw.drawFaceExpressions(canvas, fullFaceDescriptions)
  drawBox.draw(canvas);
})
setTimeout( () => {onPlay(videoEl)
    },200)
  }

