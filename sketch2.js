let mobilenet;
let video;
let label='loading models';
let classifier;
let ukeButton;
let whistleButton;
let train;
function modelReady(){
console.log("model ready!");
classifier.load('model.json',customModelReady)
 
}
function customModelReady(){
    console.log('custom model is ready')
    label='model ready';
    classifier.classify(gotResults);

}
function videoReady(){
console.log('video ready');
}
// function whileTraining(loss){
//    if(loss==null){
//       console.log('training completed');
    //   classifier.classify(gotResults);
//    }else{
//    console.log(loss);
//    }
// }

function gotResults(error,result){
if(error){
   console.error('error');
}else{
   label=result[0].label;
   classifier.classify(gotResults);

}
}
function setup(){
      createCanvas(320,270);
      video=createCapture(VIDEO)
      video.hide();
      background(0);
       mobilenet=ml5.featureExtractor('MobileNet',modelReady);
      classifier=mobilenet.classification(video,videoReady);
      //  mobilenet=ml5.imageClassifier('MobileNet',video,modelReady);

    //   ukeButton=createButton('ukulele');
    //   ukeButton.mouseOver(function(){
    //   classifier.addImage('ukulele');   
    //   });

    //   whistleButton=createButton('whistle');
    //   whistleButton.mouseOver(function(){
    //   classifier.addImage('whistle');   
    //   });

    //   train=createButton('train');
    //   train.mouseOver(function(){
    //   classifier.train(whileTraining);   
    //   });
   }
   function draw(){
      background(0);
      image(video,0,0,320,240);
      fill(255);
      textSize(16);
      text(label,10,height -10);
   }