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
        err=>console.log(err)
    )
    onPlay(videoEl)
}
var time=0;
var arr=[];

async function onPlay(videoEl){
    // console.log('it is running');
    const canvas =document.getElementById('overlay');
    const displaySize = { width: videoEl.width, height: videoEl.height }
    faceapi.matchDimensions(canvas, displaySize)
    // console.log('it is running 2')
        
    const options = new faceapi.TinyFaceDetectorOptions()
    let fullFaceDescriptions = await faceapi.detectAllFaces(videoEl, options).withFaceLandmarks().withFaceExpressions().withFaceDescriptors()
    fullFaceDescriptions=faceapi.resizeResults(fullFaceDescriptions,displaySize)
    const labels = ['praveen','varun_sir','boobal','dhaya']
    const labeledFaceDescriptors = await Promise.all(
    labels.map(async label => {
    // fetch image data from urls and convert blob to HTMLImage element
    const imgUrl = `./${label}.jpg`
    const img = await faceapi.fetchImage(imgUrl)
    
    // detect the face with the highest score in the image and compute it's landmarks and face descriptor
    const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceExpressions().withFaceDescriptor()
    // console.log(fullFaceDescription.expressions.asSortedArray().toString().expression);
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
    let count=0;
    results.forEach((bestMatch, i) => {
    count++;
    const box = fullFaceDescriptions[i].detection.box
    const text = bestMatch.toString()
    var str=""
    for(var i of text){
      if(i!='(')
      str+=i;
      else
      break;
    }
    if(arr.includes(str)===false)
    arr.push(str)
    //console.log(`${count}. ${text}`);
    const drawBox = new faceapi.draw.DrawBox(box, { label: text })
  // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
  // faceapi.draw.drawDetections(canvas, fullFaceDescriptions)
    const result_1=faceapi.draw.drawFaceExpressions(canvas, fullFaceDescriptions)
    // console.log(result_1.detection)
    // var drawTextField = new draw.DrawTextField(resultsToDisplay.map(function (result_1) { return expr.expression}))
  //console.log(fullFaceDescriptions[i].expressions.asSortedArray().__proto__.toString())
    drawBox.draw(canvas);
})
var call=setTimeout( () => {onPlay(videoEl)
    },200)
// time++;
// console.log(time);
// if(time==5){
//   clearInterval(call);
//    console.log(count+' person detected'); 
   for(let i=0;i<arr.length;i++){
  console.log(arr[i]) 
   }
  }

