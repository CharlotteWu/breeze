$(function() {

     //bg-roll
     $('.bg-roll div').css({opacity:0.0});
     $('.bg-roll div:first').css({opacity:1.0});
      

     setInterval(function(){
           var current = ($('.bg-roll div.present')? $('.bg-roll div.present'):$('bg-roll div:first'));
           var next = ((current.next().length) ? (current.next().hasClass('caption')) ? $('.bg-roll div:first') : current.next(): $('.bg-roll div:first'));

           next.css({opacity:0.0}).addClass('present').animate({opacity:1.0},2000);
           current.animate({opacity:0.0},2000).removeClass('present');

     },6000);

     
 
})