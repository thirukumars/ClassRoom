let mobilenet;
let video;
let label='';
function modelReady(){
console.log("model ready!");
  mobilenet.predict(gotResults);
}
// function videoReady(){
// console.log('video ready');
// }
// function whileTraining(loss){
//    if(loss==null){
//       console.log('training completed');
//       classifier.classify(gotResults);
//    }else{
//    console.log(loss);
//    }
// }

function gotResults(error,results){
if(error){
   console.log('error');
}else{
    label=results[0].label;
    console.log(results);
  
//    label=result;
   // let prob=results[0].confidence;

   // createP(label);
   // createP(prob);
   mobilenet.predict(gotResults);
//    classifier.classify(gotResults);

}
}
function setup(){
      createCanvas(320,270);
     //puffin=createImg('image/puffin.jpg',imageReady);
      video=createCapture(VIDEO)
      video.hide();
      background(0);
      //for featur extracter
    //   mobilenet=ml5.featureExtractor('MobileNet',modelReady);
    //   classifier=mobilenet.classification(video,videoReady);
       mobilenet=ml5.imageClassifier('MobileNet',video,modelReady);

    //   ukeButton=createButton('ukele');
    //   ukeButton.mouseOver(function(){
    //   classifier.addImage('ukele');   
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