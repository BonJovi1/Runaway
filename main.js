var cubeRotation = 0.0;
var change = 0;
var score = 0;
var coins = [];
var wall1 =[];
var wall2 =[];
var g =[]; //ground
var current = 0;
var track1 = [];
var track2 = [];
var barriers = [];
var ducks = [];
var slowdown = 0;
var warnings = 0;
var jumptime = 0;
var gray = 0;
var flash_ctr = 0;
var is_flash = 0;
var jetpack_ctr = 0;
var jump_ctr = 0;
var game_over = 0;

main();

//
// Start here
//

var c;
var cop;
var w2;
var boots;
var boot2;
var boot3;
var jetpack1;
var jetpack2;
var jetpack3;
var train1;
var train2;

var wall_texture;
var track_texture;
var ground_texture;
var coin_texture;
var boot_texture;
var barrier_texture;
var duck_texture;
var jetpack_texture;

function main() {


  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  //Blending - implementing transparency
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

  wall_texture = loadTexture(gl, './images/wall.jpg');
  boot_texture = loadTexture(gl, './images/boot.png');
  track_texture = loadTexture(gl, './images/track.jpg');
  ground_texture = loadTexture(gl, './images/ground.jpg');
  coin_texture = loadTexture(gl, './images/coin.png');
  barrier_texture = loadTexture(gl, './images/barrier.png');
  duck_texture = loadTexture(gl, './images/duck.png');
  jetpack_texture = loadTexture(gl, './images/jetpack.png');

  $(document).keydown(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '39'){ //right key
      // console.log(c.pos[1]);
      c.track = 1;
      cop.track = 1;
    }
    else if(keycode == '37'){ //;eft key
      c.track = -1;
      cop.track = -1;
    }
    else if(keycode == '70'){ //f key for flashing
      if(is_flash == 0){
      	is_flash = 1;
      } else {
      	is_flash = 0;
      }
    }
    else if(keycode == '38' && c.pos[1] == 0){ //up key
      // console.log(c.pos[1]);
      c.jump = 1;
    }
    else if(keycode == '40'  && c.pos[1] == 0){ //down arrow
      c.duck = 1;
    } else if(keycode == '71'){
    	if(gray==1){
    		gray = 0;
    	} else {
    		gray = 1;
    	}
    }

  });

  c = new cube(gl, [-3, 0, -3.0]);
  cop = new police(gl, [-3, 0, 2.0]);
  
  boots = new boot(gl, [-3, 0, -305.0]);
  boot2 = new boot(gl, [3, 0, -1100.0]);
  boot3 = new boot(gl, [-3, 0, -603.0]);
  
  jetpack1 = new jetpack(gl, [3, 0, -307.0]);
  jetpack2 = new jetpack(gl, [-3, 0, -1150.0]);
  jetpack3 = new jetpack(gl, [3, 0, -607.0]);
  

  train1 = new train(gl, [-3, 0, -1700.0]);
  train2 = new train(gl, [3, 0, -2000.0]);

  for(var i = -3000; i<100;i+=10)
  {
    var lol = new ground(gl, [0,0,i]);
    g.push(lol);

  }

  for(var i = -3000; i<100;i+=28)
  {
    var lol = new track(gl, [0, 0, i]);
    track1.push(lol);

  }

  for(var i = -3000; i<100;i+=28)
  {
    var lol = new track(gl, [6, 0, i]);
    track2.push(lol);

  }

  for(var i = -3000; i<100;i+=14)
  {
    var w = new wall(gl, [16, 0, i]);
    wall2.push(w);

  }

  for(var i = -3000; i<100;i+=14)
  {
    var w = new wall(gl, [0, 0, i]);
    wall1.push(w);

  }

  for(var i = -2000; i <= -30; i+=3)
  {
    
    if(Math.random()>0.5){
    	var lol = new coin(gl, [3, 0, i])
    	coins.push(lol);
    }
    else{
    	var lol = new coin(gl, [-3, 0, i]);
    	coins.push(lol);

    }
    
  }

  for(var i = -300; i <= -20; i+=30)
  {
    
    if(Math.random()>0.5){
    	var lol = new barrier(gl, [3, 0, i])
    	barriers.push(lol);
    }
    else{
    	var lol = new barrier(gl, [-3, 0, i]);
    	barriers.push(lol);

    }
    
  }

  for(var i = -600; i <= -330; i+=43)
  {
    
    if(Math.random()>0.5){
    	var lol = new duck(gl, [3, 0, i])
    	ducks.push(lol);
    }
    else{
    	var lol = new duck(gl, [-3, 0, i]);
    	ducks.push(lol);

    }
    
  }

  for(var i = -1000; i <= -630; i+=50)
  {
    
    if(Math.random()>0.5){
    	var lol = new barrier(gl, [3, 0, i])
    	barriers.push(lol);
    }
    else{
    	var lol = new barrier(gl, [-3, 0, i]);
    	barriers.push(lol);

    }
    
  }

  for(var i = -1000; i <= -630; i+=67)
  {
    
    if(Math.random()>0.5){
    	var lol = new duck(gl, [3, 0, i])
    	ducks.push(lol);
    }
    else{
    	var lol = new duck(gl, [-3, 0, i]);
    	ducks.push(lol);

    }
    
  }

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  const vsSource_texture = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;


  // Fragment shader program

  const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  const fsSource_texture = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `;

  const fsSource_gray = `
    varying highp vec2 vTextureCoord;
    // varying lowp vec4 vColor;

    uniform sampler2D uSampler;
    highp vec4 temp;

    void main(void) {
      temp = texture2D(uSampler, vTextureCoord);
      gl_FragColor = vec4( (temp.r + temp.g + temp.b)/3.0, (temp.r + temp.g + temp.b)/3.0, (temp.r + temp.g + temp.b)/3.0, temp.a );
    }
  `;
  const fsSource_flash = `
    varying highp vec2 vTextureCoord;
    // varying lowp vec4 vColor;

    uniform sampler2D uSampler;
    highp vec4 temp;

    void main(void) {
      temp = texture2D(uSampler, vTextureCoord);
      gl_FragColor = vec4( 1.5 * temp.r, 1.5 * temp.g, 1.5 * temp.b, temp.a); 
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  const shaderProgram_texture = initShaderProgram(gl, vsSource_texture, fsSource_texture);
  const shaderProgram_gray = initShaderProgram(gl, vsSource_texture, fsSource_gray);
  const shaderProgram_flash = initShaderProgram(gl, vsSource_texture, fsSource_flash);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  const programInfo_texture = {
    program: shaderProgram_texture,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram_texture, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram_texture, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram_texture, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram_texture, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram_texture, 'uSampler'),
    },
  };

  const programInfo_gray = {
    program: shaderProgram_gray,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram_gray, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram_gray, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram_gray, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram_gray, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram_gray, 'uSampler'),
    },
  };

  const programInfo_flash = {
    program: shaderProgram_flash,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram_flash, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram_flash, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram_flash, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram_flash, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram_flash, 'uSampler'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  //const buffers

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    if(c.fly == 0){
    	current+=0.25;
    } else{
    	current += 0.35;
    }
    
    // flash_ctr += deltaTime;

    // if(flash_ctr >= 2){
    // 	flash_ctr = 0;
    // }


    if(gray == 0){

    	// if(flash_ctr <= 1 && is_flash == 1){
    		
    	drawScene(gl, programInfo, programInfo_texture, programInfo_flash, deltaTime);

    	// } else {
    	// drawScene(gl, programInfo, programInfo_texture, deltaTime);
    	// }

    	
    } 
    else {
    	drawScene(gl, programInfo, programInfo_gray, programInfo_flash, deltaTime);
    }

    

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function detect_collision(obj1, obj2) {
	if( (Math.abs  (obj1.pos[0] - obj2.pos[0])) < (obj1.widths + obj2.widths) ){
		if( (Math.abs  (obj1.pos[1] - obj2.pos[1])) < (obj1.heights + obj2.heights) ){
			if( (Math.abs  (obj1.pos[2] - obj2.pos[2])) < (obj1.depths + obj2.depths) ){
				return true;
			}
		}

	}
}






//
// Draw the scene.
//
function drawScene(gl, programInfo, programInfo_texture, programInfo_flash, deltaTime) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
    var cameraMatrix = mat4.create();
    if(c.fly == 0){
    	mat4.translate(cameraMatrix, cameraMatrix, [0, 5, 10-current]);

    }
    else {
    	mat4.translate(cameraMatrix, cameraMatrix, [0, 8, 10-current]);
    }
    
    var cameraPosition = [
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14],
    ];

    var up = [0, 1, 0];
    if(c.fly == 0){
    	mat4.lookAt(cameraMatrix, cameraPosition, [0,0,-4-current], up);

    }
    else{
    	mat4.lookAt(cameraMatrix, cameraPosition, [0,0,-4-current], up);
    }
    

    var viewMatrix = cameraMatrix;//mat4.create();

    //mat4.invert(viewMatrix, cameraMatrix);

    var viewProjectionMatrix = mat4.create();

    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);
  







  if(c.fly == 0){
  	c.update_position(gl);

  }
  else{//jetpack state
  	jetpack_ctr += deltaTime;
  	c.make_it_fly(gl);

  }

  if(c.highjump == 1){
  	jump_ctr += deltaTime;
  }

  train1.update_position(gl);
  train2.update_position(gl);

  if(jetpack_ctr >= 7){
  	c.fly = 0;
  }

  if(jump_ctr >= 7){
  	c.highjump = 0;
  }
  

  if(slowdown == 1){
  	cop.pos[2] = c.pos[2] + 5;
  	slowdown = 0;
  	warnings += 1;

  }

  // if(warnings == 3){
  // 	kgjrnetngnerog
  // }

  if(game_over == 1){
  	fgbdgr
  }

  flash_ctr += deltaTime;

	if(flash_ctr >= 2){
		flash_ctr = 0;
	}

  
  cop.update_position(gl);
  
  c.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  cop.drawPolice(gl, viewProjectionMatrix, programInfo, deltaTime);
  

  for(var i=0; i<track1.length; i++)
  {
    track1[i].drawTrack(gl, viewProjectionMatrix, programInfo_texture , deltaTime, track_texture);

  }

  for(var i=0; i<track2.length; i++)
  {
    track2[i].drawTrack(gl, viewProjectionMatrix, programInfo_texture , deltaTime, track_texture);

  }
  
  for(var i=0; i<wall2.length; i++)
  {
  	if(flash_ctr <= 1 && is_flash == 1){
   
    	wall2[i].drawWall(gl, viewProjectionMatrix, programInfo_flash , deltaTime, wall_texture);
    }
    else {
    	wall2[i].drawWall(gl, viewProjectionMatrix, programInfo_texture , deltaTime, wall_texture);

    }

  }

  for(var i=0; i<wall1.length; i++)
  {
  	if(flash_ctr <= 1 && is_flash == 1){
   
    	wall1[i].drawWall(gl, viewProjectionMatrix, programInfo_flash , deltaTime, wall_texture);
    }
    else {
    	wall1[i].drawWall(gl, viewProjectionMatrix, programInfo_texture , deltaTime, wall_texture);

    }

  }

  

  for(var i=0; i<g.length; i++)
  {
    g[i].drawGround(gl, viewProjectionMatrix, programInfo_texture , deltaTime, ground_texture);

  }
  
  

  for(var i=0; i<coins.length; i++)
  {
  	if(coins[i].kill == 0){
  		coins[i].drawCoin(gl, viewProjectionMatrix, programInfo_texture , deltaTime, coin_texture);

  	}
    
    if(detect_collision(coins[i], c)){
    	if(coins[i].kill == 0){
    		score += 2;
    	}
    	coins[i].kill = 1;
    	document.getElementById('score').innerHTML = "Score: " + score;
    }

  }

  for(var i=0; i<ducks.length; i++)
  {
  	
  	ducks[i].drawDuck(gl, viewProjectionMatrix, programInfo_texture , deltaTime, duck_texture);
  	if(detect_collision(ducks[i], c)){
    	if(ducks[i].kill == 0){
    		console.log("collidied");
    		slowdown = 1;
    	}
    	ducks[i].kill = 1;
    }
  }
  
  for(var i=0; i<barriers.length; i++)
  {
  	
  	barriers[i].drawBarrier(gl, viewProjectionMatrix, programInfo_texture , deltaTime, barrier_texture);
  	if(detect_collision(barriers[i], c)){
    	if(barriers[i].kill == 0){
    		slowdowntime = deltaTime;
    		console.log("collidied");
    		slowdown = 1;
    	}
    	barriers[i].kill = 1;
    }
  }

  

  if(boots.kill == 0){
  	boots.drawBoot(gl, viewProjectionMatrix, programInfo_texture , deltaTime, boot_texture);

  }
    
	if(detect_collision(boots, c)){
		if(boots.kill == 0){
			// jumptime = deltaTime;
			c.highjump = 1;
		}
		boots.kill = 1;
	}

	if(boot2.kill == 0){
  	boot2.drawBoot(gl, viewProjectionMatrix, programInfo_texture , deltaTime, boot_texture);

  }
    
	if(detect_collision(boot2, c)){
		if(boot2.kill == 0){
			// jumptime = deltaTime;
			c.highjump = 1;
		}
		boot2.kill = 1;
	}

	if(boot3.kill == 0){
  	boot3.drawBoot(gl, viewProjectionMatrix, programInfo_texture , deltaTime, boot_texture);

  }
    
	if(detect_collision(boot3, c)){
		if(boot3.kill == 0){
			// jumptime = deltaTime;
			c.highjump = 1;
		}
		boot3.kill = 1;
	}

	if(jetpack1.kill == 0){
		jetpack1.drawJetpack(gl, viewProjectionMatrix, programInfo_texture , deltaTime, jetpack_texture);
	}
  	
  	if(detect_collision(jetpack1, c)){
		if(jetpack1.kill == 0){
			c.fly = 1;
		}
		jetpack1.kill = 1;
	}
	

	if(jetpack2.kill == 0){
		jetpack2.drawJetpack(gl, viewProjectionMatrix, programInfo_texture , deltaTime, jetpack_texture);
	}
  	
  	if(detect_collision(jetpack2, c)){
		if(jetpack2.kill == 0){
			c.fly = 1;
		}
		jetpack2.kill = 1;
	}

	if(jetpack3.kill == 0){
		jetpack3.drawJetpack(gl, viewProjectionMatrix, programInfo_texture , deltaTime, jetpack_texture);
	}
  	
  	if(detect_collision(jetpack3, c)){
		if(jetpack3.kill == 0){
			c.fly = 1;
		}
		jetpack3.kill = 1;
	}	

	train1.drawTrain(gl, viewProjectionMatrix, programInfo , deltaTime);
	train2.drawTrain(gl, viewProjectionMatrix, programInfo , deltaTime);

	if(detect_collision(train1, c)){
		game_over = 1;
	}
	if(detect_collision(train2, c)){
		game_over = 1;
	}


}



//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  // image.crossOrigin = "undefined";
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn off mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}
//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
