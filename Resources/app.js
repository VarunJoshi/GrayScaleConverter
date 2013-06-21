var window = Ti.UI.createWindow({
    backgroundColor : 'white'
});

var imageView = Titanium.UI.createImageView({
    image : 'images/flower.jpg',
    top : 4,
    left : 4,
    width : Ti.UI.SIZE || 'auto',
    height : Ti.UI.SIZE || 'auto'
});

window.add(imageView);
window.open();

var button = Ti.UI.createButton({
    left : 50,
    bottom : 50,
    width : 100,
    height : 50,
    title : 'Click Me!'
});
window.add(button);


var ImageFactory = require('ti.imagefactory');

var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'images', 'flower.jpg');
var blob = f.read();

/*
 * Compress the image using ImageFactory
 */

var newBlob = ImageFactory.compress(blob, 0.25);


var filename =  Titanium.Filesystem.applicationDataDirectory + "/newflower.jpg";
f = Titanium.Filesystem.getFile(filename);
f.write(newBlob);  //write the compressed image to a file, we will use the path to this file as the input to canvas tag 
Ti.API.info(f.getNativePath());

button.addEventListener('click', function() {
    var win = Titanium.UI.createWindow({
        backgroundColor : '#fff'
    });
    
    

    var webView = Ti.UI.createWebView({
        url: "app://test.html",
        setZoomScale : 2,
        top : 20
    });

    win.add(webView);
    
    /*
     * This is the javascript function to convert to grayscale
     * Help from: http://www.ajaxblender.com/howto-convert-image-to-grayscale-using-javascript.html
     */
    var htmlHack = '(function(){';
    htmlHack += 'var canvas=document.getElementById("myCanvas");';
    htmlHack += 'var canvasContext=canvas.getContext("2d");';
    htmlHack += 'canvas.width = 232;';
    htmlHack += 'canvas.height = 213;';
    htmlHack += 'var img=document.getElementById("flower");';
    htmlHack += 'canvasContext.drawImage(img, 0, 0);';
    htmlHack += 'var imgPixels = canvasContext.getImageData(0, 0, 232, 213);';
    htmlHack += 'for(var y = 0; y < imgPixels.height; y++) { for(var x = 0; x < imgPixels.width; x++) {var i = (y * 4) * imgPixels.width + x * 4;var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;imgPixels.data[i] = avg;imgPixels.data[i + 1] = avg;imgPixels.data[i + 2] = avg;}}';
    htmlHack += 'canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);';
    htmlHack += 'return canvas.toDataURL();';
    htmlHack += '})();';

    webView.addEventListener('load', function(e) {
        webView.evalJS(htmlHack);
    });
    win.open();

});
