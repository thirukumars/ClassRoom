let mobilenet;
let video;
let label='test';
let classifier;
let ukeButton;
// let whistleButton;
let train;
let save;
function modelReady(){
console.log("model ready!");
 
}
function videoReady(){
console.log('video ready');
}
function whileTraining(loss){
   if(loss==null){
      console.log('training completed');
      classifier.classify(gotResults);
   }else{
   console.log(loss);
   }
}

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

      ukeButton=createButton('create');
      ukeButton.mouseOver(function(){
      classifier.addImage('Reynolds brite');   
      });

      // whistleButton=createButton('whistle');
      // whistleButton.mouseOver(function(){
      // classifier.addImage('whistle');   
      // });

      train=createButton('train');
      train.mouseOver(function(){
      classifier.train(whileTraining);   
      });

      save=createButton('save');
      save.mouseOver(function(){
         classifier.save();   
      });
     
   }
   function draw(){
      background(0);
      image(video,0,0,320,240);
      fill(255);
      textSize(16);
      text(label,10,height -10);
   }