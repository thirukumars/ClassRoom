$(document).ready(function(){
  run()
})

//load all the models ./models
async function run(){
  Promise.all([
  await faceapi.loadSsdMobilenetv1Model('./models'),
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  await faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  await faceapi.loadFaceLandmarkModel('./models'),
  await faceapi.loadFaceRecognitionModel('./models')
])

//once we loaded the models start the Video(WebCam)
const videoEl=document.getElementById('inputVideo')
  navigator.getUserMedia(
    {video:{}},
      stream=>videoEl.srcObject=stream,
      err=>console.log(err)
  )
  onPlay(videoEl)//calling the onPlay()
}

//global declarations
var NameArray=[];
var ExpressionArray=[];
var count=0;
var expression;
var max=0;
var map=new Map();

//The main onplay function for faceDetection and Expressions
async function onPlay(videoEl){
  const canvas =document.getElementById('overlay');
  const displaySize = { width: videoEl.width, height: videoEl.height }
  faceapi.matchDimensions(canvas, displaySize)        

  //This is the detection option(TinyFace,mtcnn,singleFaceDetection)
  const options = new faceapi.TinyFaceDetectorOptions()

  //This will detect all the images in the webCam
  let fullFaceDescriptions = await faceapi.detectAllFaces(videoEl, options).withFaceLandmarks().withFaceExpressions().withFaceDescriptors()
  
  //resizing the detected face to the displaySize
  fullFaceDescriptions=faceapi.resizeResults(fullFaceDescriptions,displaySize)
  
  //Names of labels(Project Directory)
  const labels = ['praveen','varun_sir']
  
  /*This labeledFaceDescriptor is used for the mapping images to the detected face in fullFaceDescription
    and also check the webcam images contain face or not.
  */
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
  //faceMatcher take the highest confidence and refernce and query image.
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance)
  count++;
  console.log("outside"+count);

  //the result holds the complete mapping of refernce and query images(by using the Array values)
  results = fullFaceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor))
  
  //This iterates give the detected faces in images
  results.forEach((bestMatch, i) => {
    console.log(bestMatch);
    const box = fullFaceDescriptions[i].detection.box;
    const text = bestMatch.toString();  //this for basMatch name detection
    console.log("inside"+count);
    var str=""
      for(var i of text){
        if(i!='('){
        str+=i;
        }
        else{
          break;
        }
      }
      if(NameArray.includes(str)===false)
        NameArray.push(str);
        // console.log(str);
    const drawBox = new faceapi.draw.DrawBox(box, { label: text })
      // faceapi.draw.drawFaceExpressions(canvas, fullFaceDescriptions)//FaceExpression=fullFaceDescription  *(face-api.js)*
    drawBox.draw(canvas);
  })
  
  //marks the expression for the each values in result Arrays.
  faceapi.draw.drawFaceExpressions(canvas, fullFaceDescriptions,NameArray) //(sending NameArray for mapping names and expression)
  
  //SetTimeout for repeated detection of faces
  var call=setTimeout( () => {
    onPlay(videoEl)
  },200)

  if(count>=10){
  clearInterval(call);
  }
}

function test(e,Name){
  console.log(e+" how is it");
  console.log(Name);
  NameArray=[];
  // if(NameArray.includes(f)===false)
  // NameArray.push(f);
  ExpressionArray.push(e)
    if(count==10){
     max=0;
      for(let i=0;i<ExpressionArray.length;i++){
        let counter=0;
          for(let j=0;j<ExpressionArray.length;j++){
            if(ExpressionArray[i]==ExpressionArray[j]){
                counter++;
            }
          }
          if(counter>max){
            max=counter;
            expression=ExpressionArray[i];
          }
      }
    }
}
