// global stuff

var rendering = {
	realtime : false,
//	start : 1348476308587, //new Date().getTime()-60*1000,
//	end : 1348477838196 //new Date().getTime(),
	start : new Date().getTime()-3600*1000,
	end : new Date().getTime(),
};

window.smooth = 0.3;
var username = prompt("User");

function anim(obj, prop, start, target, time) {
	var count = 0;
	var tick=function() {
		count++;
		val = start+(target-start)*count/10;
		obj[prop] = val;
		if (count<10)
			setTimeout(tick,10);
	}
	setTimeout(tick,10);
}

var gsrColors = [{"gsr":0,"color":[0.08627450980392157,0.1568627450980392,0.3137254901960784]},{"gsr":5,"color":[0.08627450980392157,0.1568627450980392,0.3137254901960784]},{"gsr":6,"color":[0,0.23921568627450981,0.4470588235294118]},{"gsr":22,"color":[0.2235294117647059,0.3568627450980392,0.5529411764705883]},{"gsr":35,"color":[0.18823529411764706,0.38823529411764707,0.4980392156862745]},{"gsr":40,"color":[0.17647058823529413,0.48627450980392156,0.49019607843137253]},{"gsr":45,"color":[0.1843137254901961,0.5019607843137255,0.3215686274509804]},{"gsr":55,"color":[0.2901960784313726,0.5490196078431373,0.23921568627450981]},{"gsr":65,"color":[0.40784313725490196,0.5764705882352941,0.2196078431372549]},{"gsr":85,"color":[0.47058823529411764,0.7058823529411765,0.23529411764705882]},{"gsr":120,"color":[0.6588235294117647,0.7607843137254902,0.17647058823529413]},{"gsr":180,"color":[0.8352941176470589,0.7568627450980392,0.043137254901960784]},{"gsr":500,"color":[0.7607843137254902,0.5686274509803921,0.23137254901960785]},{"gsr":1000,"color":[0.7176470588235294,0.403921568627451,0.21176470588235294]},{"gsr":3000,"color":[0.6823529411764706,0.3137254901960784,0.21568627450980393]},{"gsr":20000,"color":[0.6078431372549019,0.2,0.17254901960784313]},{"gsr":40000,"color":[0.4392156862745098,0.16862745098039217,0.19607843137254902]},{"gsr":1000000,"color":[0.4392156862745098,0.16862745098039217,0.19607843137254902]}];

var gsrColors_old = [
	{ gsr: 0, color: [0,0,0] },
	{ gsr: 16000, color: [0,1,0] },
/*	{ gsr: 300, color: [1,1,0] },
	{ gsr: 500, color: [0,0.5,0.8] },
	{ gsr: 1000, color: [0.5,0.8,1.0] },
	{ gsr: 3000, color: [1,1,0.5] },
	{ gsr: 15000, color: [1,0,1] },
	{ gsr: 32000, color: [0,0,0] },*/
	{ gsr: 33000, color: [1,1,0] },
	{ gsr: 100000, color: [1,0,0] },
];

var savedColors = localStorage.getItem("gsrColors");
if (savedColors) {
	gsrColors = JSON.parse(savedColors);
}

function gsrColor(gsr) {
	if (gsrColors.length==0) return [0,0,0];
	if (gsrColors.length==1) return gsrColors[0].color;

	var i;
	for (i=1;i<gsrColors.length;i++) {
		if (gsrColors[i].gsr>gsr) break;
	}
	if (i==gsrColors.length) return [0,0,0];
	var c1 = gsrColors[i-1].color;
	var c2 = gsrColors[i].color;
	var s1 = (gsr-gsrColors[i-1].gsr)/(gsrColors[i].gsr-gsrColors[i-1].gsr);
	var s2 = 1-s1;
	return [
		c1[0]*s2+c2[0]*s1,
		c1[1]*s2+c2[1]*s1,
		c1[2]*s2+c2[2]*s1,
	];
	
/*	var t = gsr / 32000;
	
	return [
		t,t,t
	];*/
}

function gsrToConsole() {
	var gsrValues = [];
	var gsrCols = [];
	gsrColors.forEach(function(i) { gsrValues.push(parseInt(i.gsr)); });
	gsrColors.forEach(function(i) { gsrCols.push(i.color[0]); gsrCols.push(i.color[1]); gsrCols.push(i.color[2]);});
	console.log(gsrValues);
	console.log(gsrCols.join("f,"));
}

function updateMappings() {
	$("#mappings").empty();
	var tmp = [];
	for(var i=0;i<gsrColors.length;i++) {
		if (gsrColors[i]!==undefined) {
			tmp.push(gsrColors[i]);
		}
	}
	gsrColors = tmp;
	gsrColors.sort(function(a,b) { return a.gsr-b.gsr; });

	localStorage.setItem("gsrColors", JSON.stringify(gsrColors));
	
	var colorValueChanged = function() {
//		console.log( $(this).attr('v'), $(this).val(), $(this).parent().attr('index'));
		gsrColors[$(this).parent().attr('index')].color[$(this).attr('v')] = $(this).val()/255;
		updateMappings();
	}
	var gsrValueChanged = function() {
		gsrColors[$(this).parent().attr('index')].gsr = $(this).val();
		updateMappings();
	}

	for (var i=0;i<gsrColors.length;i++) {
		var r = gsrColors[i].color[0];
		var g = gsrColors[i].color[1];
		var b = gsrColors[i].color[2];
		var gsr = gsrColors[i].gsr;

		var e = $("<div class='gsr'></div>");
		e.attr('index',i);
		var col = $("<div class='gsrsample'></div>");
		col.css('background', 'rgb(' + parseInt(r*255) + ',' + parseInt(g*255) + ',' + parseInt(b*255) + ')');
		e.append(col);
		var inp = $("<input value='"+gsr+"' />");
		inp.change(gsrValueChanged);
		e.append(inp);
		inp = $("<input v='0' name='r' value='"+parseInt(r*255)+"' />");
		inp.change(colorValueChanged);
		e.append(inp);
		inp = $("<input v='1' name='g'  value='"+parseInt(g*255)+"' />");
		inp.change(colorValueChanged);
		e.append(inp);
		inp = $("<input v='2' name='b' value='"+parseInt(b*255)+"' />");
		inp.change(colorValueChanged);
		e.append(inp);
/*		inp = $("<input name='col' />");
		e.append(inp);
		var picker = new jscolor.color(inp.get());
		picker.fromRGB(r,g,b);
		inp.change(function() {
			console.log( $(this).get().color.r, $(this).get().color.g, $(this).get().color.b );
		});*/

		var rem = $("<button>del</button>");
		rem.click(function() { delete gsrColors[$(this).parent().attr('index')]; updateMappings(); });
		e.append(rem);
		
		e.append("<br style='clear:both' />");
		$("#mappings").append(e);
	}
	var button = $("<button>add</button>");
	button.click(function() {
		gsrColors.push({gsr:0, color: [0,0,0]});
		updateMappings();
	});
	$("#mappings").append(button);
}

(function() {
	var gl;

	var requestAnimFrame = (function() {
	  return window.requestAnimationFrame ||
	     window.webkitRequestAnimationFrame ||
	     window.mozRequestAnimationFrame ||
	     window.oRequestAnimationFrame ||
	     window.msRequestAnimationFrame ||
	     function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
	       window.setTimeout(callback, 1000/60);
	     };
	})();

	function getShader(gl, id) {
      var shaderScript = document.getElementById(id);
      if (!shaderScript) {
          return null;
      }

      var str = "";
      var k = shaderScript.firstChild;
      while (k) {
          if (k.nodeType == 3)
              str += k.textContent;
          k = k.nextSibling;
      }

      var shader;
      if (shaderScript.type == "x-shader/x-fragment") {
          shader = gl.createShader(gl.FRAGMENT_SHADER);
      } else if (shaderScript.type == "x-shader/x-vertex") {
          shader = gl.createShader(gl.VERTEX_SHADER);
      } else {
          return null;
      }

      gl.shaderSource(shader, str);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          alert(gl.getShaderInfoLog(shader));
          return null;
      }

      return shader;
  	}
	
	var initGL = function() {
		var canvas = document.getElementById("canvas");

		try {
			gl = canvas.getContext("experimental-webgl");
			console.log("Created context from 'experimental-webgl'");
		} catch (e) {
			try {
				gl = canvas.getContext("webgl");
				console.log("Created context from 'webgl'");
			} catch (e2) {
				alert("Unable to initialize web gl context");
				return false;
			}
		}

		console.log(gl);
		if (gl!==undefined && gl!==null) {
			gl.viewportWidth = canvas.width;
			gl.viewportHeight = canvas.height;
		} else {
			return false;
		}
		
		console.log(gl);
		
		return true;
	}
	
	/*
		buffers and shaders
		
		buffers are created gl.createBuffer, binded with gl.bindBuffer, filled with gl.bufferData

		shaders are written and initialized and linked in a program
		
		shaders (and programs) have attributes
		attributes are found through getAttribLocation (and uniforms through getUniformLocation)
		attributes need to be turned into vertex attributes through gl.enableVertexAttribArray
		attributes are connected with buffers through gl.bindBuffer followed with gl.vertexAttribPointer
			(you find the data buffer you want to connect with a attribute, and then run vertexAttribPointer which specified what's in the buffer)
	*/

	function Program(vertexshaderid,fragmentshaderid) {
		var program = gl.createProgram();
		gl.attachShader( program, getShader(gl, vertexshaderid) );
		gl.attachShader( program, getShader(gl, fragmentshaderid) );
		gl.linkProgram( program );
		
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			alert("Could not initialise shaders");
			return false;
		}

		gl.useProgram( program );

		var glAttributes = {};
		this.setupAttributes = function(attribs) {
			for (var i=0,ni=attribs.length;i<ni;i++) {
				glAttributes[attribs[i]] = gl.getAttribLocation(program, attribs[i]);
				gl.enableVertexAttribArray(glAttributes[attribs[i]]);
			}
		}
		
		var glUniforms = {};
		this.setupUniforms = function(uniforms) {
			for (var i=0,ni=uniforms.length;i<ni;i++) {
				glUniforms[uniforms[i]] = gl.getUniformLocation(program, uniforms[i]);
			}
		}
		
		this.use = function() {
			gl.useProgram( program );
		}
		
		this.setAttribPointers = function(buffers) {
			for (var attrib in buffers) {
				var buffer = buffers[attrib];
				gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
				gl.vertexAttribPointer(glAttributes[attrib], buffer.itemSize /* floats per item */, gl.FLOAT, false, 0, 0);
			}
		}

		this.setBuffers = function(buffers) {
			this.setAttribPointers(buffers.buffers);
		}

		this.uniformMatrix4fv = function(uniforms) {
			for (var uniform in uniforms) {
				gl.uniformMatrix4fv( glUniforms[uniform], false, uniforms[uniform]);
			}
		}

		this.uniform1i = function(uniforms) {
			for (var uniform in uniforms) {
				gl.uniform1i( glUniforms[uniform], uniforms[uniform]);
			}
		}

		this.uniform3f = function(uniforms) {
			for (var uniform in uniforms) {
				gl.uniform3f( glUniforms[uniform], uniforms[uniform][0],uniforms[uniform][1],uniforms[uniform][2]);
			}
		}
	}
	
	function VertexBuffers() {
		var buffers = {};
		var length = 0;
		var add = function(name, itemSize) {
			if (name in buffers) return false;
			
			buffers[name] = { buffer: gl.createBuffer(), itemSize : itemSize };
			return true;
		}

		// if only one argument, first argument is assumed to be dictionary of name:data pairs.
		var data = function(name, data) {
			if (data===undefined) {
				var datas = name;
				for (var n in datas) {
					gl.bindBuffer(gl.ARRAY_BUFFER, buffers[n].buffer);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(datas[n]), gl.STATIC_DRAW);
					length = parseInt(datas[n].length/buffers[n].itemSize);
				}

				return true;
			}

			gl.bindBuffer(GL.ARRAY_BUFFER, buffers[name].buffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
			length = parseInt(data.length/buffers[name].itemSize);
		}

		this.add = add;
		this.data = data;
		this.buffers = buffers;
		this.getLength = function() { return length; };
	};
	
	function Textures(gl) {
		var textures = {};
		var numTexLoaded = 0;
		var numTex = 0;
		function handleLoadedTexture(texture) {
		    gl.bindTexture(gl.TEXTURE_2D, texture);
		    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
		    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		    gl.bindTexture(gl.TEXTURE_2D, null);
		    numTexLoaded++;
		    console.log("Texture loaded");
		}
		var add = function(name, url) {
			var tex = gl.createTexture();
			textures[name] = tex;
			tex.image = new Image();
			tex.image.onload = function() { handleLoadedTexture(tex); };
			tex.image.src = url;
			numTex++;
		}
/*		var bind = function(names) {
			var glids = [gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2, gl.TEXTURE3, ];
			for(var i=0;i<names.length;i++) {
				gl.activeTexture(glids[i]);
				gl.bindTexture(gl.TEXTURE_2D, textures[names[i]]);
			}
		}*/
		var bind = function(num, texturename) {
			var glids = [gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2, gl.TEXTURE3, ];
			gl.activeTexture(glids[num]);
			gl.bindTexture(gl.TEXTURE_2D, textures[texturename]);
		}
		this.add = add;
		this.bind = bind;
		this.isLoaded = function() { return numTexLoaded==numTex; };
	}

	window.params = {
		d : 550,
		r0 : 0.2,
		r1 : 0.8,
		size : 0.2,
	};
	
	window.data = []; //{t: new Date().getTime(), gsr: 0.5}];
	
	var spiral = (function() {
		var buffers;
		var program;
		var mvMatrix = mat4.create();
		var pMatrix = mat4.create();
	
		return {
			init : function() {
				// init buffers
				buffers = new VertexBuffers();
				buffers.add("aVertexPosition",3);
				buffers.add("aVertexColor",3);
				buffers.add("aVertexOpacity",1);
		
				program = new Program("shader-vs", "shader-fs");
				program.setupAttributes(["aVertexPosition", "aVertexColor", "aVertexOpacity"]);
				program.setupUniforms(["uPMatrix", "uMVMatrix"]);
			},
			draw : function() {
				// fill buffers with data
				var vertices = [];
				var colors = [];
				var opacity = [];
				
				function p(t) {
					var coord = SpiralForm.p(t);
					var normal = SpiralForm.normal(t);
					var size = coord[2]; //window.params.size;
					return [
						coord[0] - normal[0]*size,
						coord[1] - normal[1]*size,
						coord[0] + normal[0]*size,
						coord[1] + normal[1]*size
					];
				}
				var c = gsrColor; //function(gsr) { return [0,1,0]; };
				var start = rendering.start;
				var end = rendering.end;
				var data = Data.getDataFiltered(start,end);
				if (data.length>2) {
					var t = (end-data[0].t)/(end-start);
					var nextt = (end-data[1].t)/(end-start);
					var oldt = t;
				}
		
		//		var gap = 2/100; //200/(rendering.end-rendering.start);
				// resolution / (end-start)
				var gap = Data.getResolution(start,end) / (rendering.end-rendering.start);
		
				for (var i=0;i<data.length;i++) {
					if (i>0) oldt = (end-data[i-1].t)/(end-start);
					t = (end-data[i].t)/(end-start);
					if (i<data.length-1) nextt = (end-data[i+1].t)/(end-start);
					var p0 = p(t);
					var c0 = c(data[i].gsr*65535);
					var op = t<0.05?t/0.05:1.0;
					
					function pushCoord(p0,c0,op) {
						vertices.push(p0[0])		// x1
						vertices.push(p0[1])		// y1
						vertices.push(0)		// z1
						colors.push(c0[0]);
						colors.push(c0[1]);
						colors.push(c0[2]);
						opacity.push(op);
						vertices.push(p0[2])		// x2
						vertices.push(p0[3])		// y2
						vertices.push(0)		// z2
						colors.push(c0[0]);
						colors.push(c0[1]);
						colors.push(c0[2]);
						opacity.push(op);
					}
		
					if (oldt!=undefined && t-oldt>=2*gap) {
						pushCoord(p(t-gap*0.5),c0,0);
		//				console.log("gap");
					}
					pushCoord(p0,c0,op);
					if (nextt!=undefined && nextt-t>=2*gap) {
						pushCoord(p(t+gap*0.5),c0,1);
						pushCoord(p(t+gap*0.5),c0,0);
		//				console.log("gap");
					}
		
					if (t==3)
						console.log(t-oldt,nextt-t);
		
					oldt = t;
					t = nextt;
				}
				if (data.length>0)
					pushCoord(p(t+gap),c0,1);

				buffers.data({"aVertexPosition" : vertices, "aVertexColor" : colors, "aVertexOpacity" : opacity});
		
				// create perspective
		//		mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
				mat4.ortho(-1.12*0.95*(457/518), 1.12*0.95*(457/518), 1.60+0.2*(605/619) + 0.2, -1.60+0.2*(605/619) + 0.2, 0.1, 10, pMatrix);
		
				// create model matrix
				mat4.identity(mvMatrix);
				mat4.translate(mvMatrix, [0.0, 0.0, -5.0]);

				program.use();

				program.setBuffers(buffers);
				program.uniformMatrix4fv({"uPMatrix" : pMatrix, "uMVMatrix" : mvMatrix});
		
				gl.enable(gl.BLEND);
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

				gl.drawArrays(gl.TRIANGLE_STRIP, 0, buffers.getLength());
				
				gl.disable(gl.BLEND);
			}
		};
	})();
	
	var timeline = (function() {
		var buffers;
		var program;
		
		var scale = 1.0;
		var base = 0;

		return {
			init : function() {
				buffers = new VertexBuffers();
				buffers.add("aVertexPosition",3);
	
				program = new Program("black-vs", "black-fs");
				program.setupAttributes(["aVertexPosition"]);
				program.setupUniforms(["uColor"]);
			},
			draw : function() {
				var color = [0,0,0];
				function drawData(data, y_offset, data_scale) {
					var vertices = [];
					var end = parseInt(rendering.end);
					var ts = parseInt(rendering.end-rendering.start);
	
					for (var i=0;i<data.length;i++) {
						var x = 1-(end-parseInt(data[i].t))/ts;
						var y = scale*(data[i].gsr*data_scale-base);
						
						vertices.push(-1+2*x);
						vertices.push(y_offset+y*0.5);
						vertices.push(0);
					}
					
					buffers.data({"aVertexPosition":vertices});
	
					program.use();
					program.setBuffers(buffers);
					program.uniform3f({"uColor": color});
					gl.drawArrays(gl.LINE_STRIP, 0, buffers.getLength());
				}

				var data = Data.getData(rendering.start, rendering.end);
				drawData(data, 0.0, 1/1);
				drawData(Data.getDataFiltered(rendering.start,rendering.end), 0.5,1.0);

				color = [0,1,0];
				if (Data.processedArrays) {
					for (var i=0,ni=Data.processedArrays.length;i<ni;i++) {
						if (Data.processedArrays[i].enabled)
							drawData(Data.getDataMisc(Data.processedArrays[i].data,rendering.start,rendering.end), 0,1.0);
					}
				}
			},
			decScale : function() {
				scale *= 0.75;
				console.log("scale", scale);
			},
			incScale : function() {
				scale *= 1.5;
			},
			decBase : function() {
				base -= 1000;
			},
			incBase : function() {
				base += 1000;
			}
		};
	})();

	var type="GSR";

	var isRequestingData = false;
	var lastRequestTS = 0;
	var requestData = function(start, end) {
		if (isRequestingData) return;
		if (lastRequestTS>new Date().getTime()-1000) return;
		lastRequestTS = new Date().getTime();

		var bstart = data.length>0?data[0].t:(1000*3600*24*365*70);
		var bend = data.length>0?data[data.length-1].t:0;
		
		if (bstart==1e14) bstart = end;

		var dstart = new Date(); dstart.setTime(bstart);
		var dend = new Date(); dend.setTime(bend);

		if (start<bstart) {
//			console.log("Reqeust data", dstart, dend);
			isRequestingData = true;
			function getBefore(type,buffername,cb) {
				$.get("api.php", {cmd: "data", since: start, before: bstart, type: type, user: username}, function(data) {
/*					data.forEach(function(td, i, a) {
						td.t = parseInt(td.time);
					});*/
					if (data.length>0) console.log("returned data: ", data.length);
					//window[buffername] = data.concat(window[buffername]);
					Data.dataMerge(data, true);
					
					if (cb) cb();
				});
			}
//			console.log("Requesting data", start, bstart);
			getBefore("GSR", "data", function() {
					isRequestingData = false;
			});
		} else if (end>bend) {
			console.log("Reqeust data", dstart, dend);
			isRequestingData = true;
			function getAfter(type,buffername,cb) {
				$.get("api.php", {cmd: "data", since: bend, before: end, type: type, user: username}, function(data) {
/*					data.forEach(function(td, i, a) {
						td.t = parseInt(td.time);
					});*/
					if (data.length>0) console.log("returned data: ", data.length);
					//window[buffername] = window[buffername].concat(data);
					Data.dataMerge(data, true);

					if (cb) cb();
				});
			}
//			console.log("Requesting data", bend, end);
			getAfter("GSR", "data", function() {
					isRequestingData = false;
			});
		}
	}
	window.requestData = requestData;

	var draw = function(t) {
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT);
		
		// update
		if (rendering===undefined || rendering.realtime) {
			var scroll = new Date().getTime() - rendering.end;
			rendering.end += scroll;
			rendering.start += scroll;
		}
		
		requestData(rendering.start,rendering.end);

		spiral.draw();
		timeline.draw();
		
		// update time
		updateTime();
		
		if (snapshot) {
			var canvas = document.getElementById("canvas");
			var dataUrl = canvas.toDataURL();
			if ($("#image").length==0) {
				$("#container").append("<img id='image' />");
			}
			$("#image").attr("src",dataUrl);
			snapshot = false;
		}
	}

	var updateTime = function() {
		function formatTime(time) {
			var d = new Date();
			d.setTime(time);
			function z(s) { return parseInt(s)<10?"0"+s:s; }
			return d.getDate() + "/" + (d.getMonth()) + " " + z(d.getHours()) + ":" + z(d.getMinutes());
		}
		$("#time").html( "showing your biodata<br/>" + formatTime(rendering.start) + " to " + formatTime(rendering.end));
	}

	
	var time = 0;
	var snapshot = false;
	
	rendering.realtime = false;

	// run this when loaded
	$(function() {
		if (!initGL()) return;

		gl.clearColor(1,1,1,1.0);
		
		spiral.init();
		timeline.init();

		var tick = function() { fps(); time++; draw(time/100); requestAnimFrame(tick); };
		tick();

		window.mousey=0.5;
/*		$("#canvas").mousemove(function(e) {
			if (rendering.realtime) {
				window.mousey = (e.pageY-$("#canvas").offset().top)/$("#canvas").height();
				data.push({t: new Date().getTime(), gsr: window.mousey*30000});
			}
//			draw(0);
		});*/
/*		var t0 = new Date().getTime()-15*1000;
		for (var i=0;i<100;i++) { data.push({t: t0+500*i, gsr: Math.random()*30000 }); }
		draw(0);*/
		
		$(window).keydown(function(e) {
			console.log(e.which);
			if (e.which==37) {	// left key
				var dt = parseInt((rendering.end-rendering.start)/10);
//				rendering.start-=dt;
//				rendering.end-=dt;
				anim(rendering, "start", rendering.start, rendering.start-dt, 1000);
				anim(rendering, "end", rendering.end, rendering.end-dt, 1000);
			} else if (e.which==39) {	// right
				var dt = parseInt((rendering.end-rendering.start)/10);
//				rendering.start+=dt;
//				rendering.end+=dt;
				anim(rendering, "start", rendering.start, rendering.start+dt, 1000);
				anim(rendering, "end", rendering.end, rendering.end+dt, 1000);
			} else if (e.which==90) {	// z
				if (e.shiftKey) {	// Z = zoom out
					var dt = rendering.end-rendering.start;
					dt = parseInt(dt/2);
//					rendering.start-=dt;
//					rendering.end+=dt;
					anim(rendering, "start", rendering.start, rendering.start-dt, 1000);
					anim(rendering, "end", rendering.end, rendering.end+dt, 1000);
				} else {	// z = zoom in
					var dt = rendering.end-rendering.start;
					dt = parseInt(dt/4);
//					rendering.start+=dt;
//					rendering.end-=dt;
					anim(rendering, "start", rendering.start, rendering.start+dt, 1000);
					anim(rendering, "end", rendering.end, rendering.end-dt, 1000);
				}
			} else if (e.which==83) { // z
				if (e.shiftKey) {
					timeline.decScale();
				} else {
					timeline.incScale();
				}
			} else if (e.which==65) { // a
				if (e.shiftKey) {
					timeline.decBase();
				} else {
					timeline.incBase();
				}
			} else if (e.which==82) {
				rendering.realtime = true;
				rendering.start = rendering.end-60*1000;
				console.log("Realtime");
			} else if (e.which==32) {
				snapshot = true;
			}
		});

		updateMappings();

	});
	
	var fpsLastTime = [], fpsCounter=0;
	var fps = function() {
		fpsLastTime.push(new Date().getTime());

		var val = 0;
		for (var i=0;i<fpsLastTime.length-1;i++) {
			val += fpsLastTime[i+1]-fpsLastTime[i];
		}
		if (fpsLastTime.length>1) {
			val /= fpsLastTime.length-1;
		}

//		console.log("Fps", val);
		if ($("#fps").length==0) {
			$("body").append("<div id='fps'></div>");
		}
		$("#fps").text(""+val);

		if (fpsLastTime.length>10) fpsLastTime.shift();
	}

})();