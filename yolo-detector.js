let model;
let objects=[];
let video;
let mobilenet;
let mobilenet1;
let label='';
function setup(){
  // console.log('setup1');

      createCanvas(440,480);
      video=createCapture(VIDEO)
      video.hide();
      video.size(440,480);
      //this is the yolo object detection method...
      model=ml5.YOLO(video,modelReady);

      //this is for image classifier method...
      mobilenet=ml5.imageClassifier('MobileNet',video,modelReady);
      // mobilenet1=ml5.featureExtractor('MobileNet',CustomModelReady);
      // classifier=mobilenet1.classification(video);
   }
   function CustomModelReady(){
 
    classifier.classify(gotResults1);
  }
   function modelReady(){
     console.log('model Ready');
     //this method is for yolo detection
      detect();
      //this method is for the predict method..   
      mobilenet.predict(gotResults);
         //this is for the custom predict
      // classifier.load('model.json',CustomModelReady)
     
   }
   function draw(){
     //this is for image classifier
      background(0);
      image(video,0,0,480,440);
      fill(255);
      textSize(16);
      text(label,10,height -20);
    //this is for the yolo object detection
      for(let i=0;i<objects.length;i++){
        fill(255,0,0);
        noStroke();
        textSize(16);
        text(objects[i].label,objects[i].x*480,objects[i].y*440-5)
        text(objects[i].label,10,height -3)
        noFill();
        strokeWeight(4);
        stroke(0,0,205);
        rect(objects[i].x*480,objects[i].y*440,objects[i].w*480,objects[i].h*440)
      }
  }
  function detect(){
    console.log('detect');
    model.detect(function(err,result){
      if(err){
      console.log('error');
      }else{
        objects=result;
        console.log(objects)
       detect();
      }
    })
   }
  //  ......................................
  function gotResults(error,results){
    if(error){
       console.log('error');
    }else{
      if(results[0].confidence*100>4||results[0].confidence*100<4){
        let value=results[0].label;
        let ans=value.split(",");
        label=ans[0];
        mobilenet.predict(gotResults);
        console.log(results);
      }
      //label=result;
      // let prob=results[0].confidence;
      // createP(label);
      // createP(prob);
       
      // classifier.classify(gotResults);
    
    }
  }
  // function gotResults1(error,results){
  //   if(error){
  //      console.log('error');
  //   }else{
  //       label=results[0].label;
  //       // mobilenet.predict(gotResults);
  //       classifier.classify(gotResults1);
  //       console.log(results);
      
  //     //label=result;
  //     // let prob=results[0].confidence;
  //     // createP(label);
  //     // createP(prob);
       
  //     // classifier.classify(gotResults);
    
  //   }
  // }

  