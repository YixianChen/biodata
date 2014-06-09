var Data = (function() {
	window.filteredData = [];

	// private helpers
	function aggregateData(data, start, end) {
		var count = data.length;
		if (count==0) return data;

//		if (window.smooth===undefined) { window.smooth=0.2; }

		var output = [];
		var timewindow = Data.getResolution(start,end);
		var t = end - (end%timewindow); //data[0].t - (data[0].t%window);
		var i=0;
		while(t>start) {
			var gsr = 0;
			var n = 0;
			var top=0;
			var bottom = 65000;
			var gsrs = [];
			var ngsr = 0;
			while(i+n<data.length && data[i+n].t>t) {
				if (data[i+n].gsr>0) {
					gsr += data[i+n].gsr;
					if (top<data[i+n].gsr) top = data[i+n].gsr;
					if (bottom>data[i+n].gsr) bottom = data[i+n].gsr;
					gsrs.push(data[i+n].gsr);
					ngsr++;
				}
				n++;
			}
			tn = t; //n==1?data[i].t:t;
			gsr = gsr/ngsr;
			var median = n%2==0?gsrs[ngsr/2]:parseInt(gsrs[(ngsr-1)/2]*0.5 + gsrs[(ngsr+1)/2]*0.5);
			gsr = top; //gsr>median?bottom:top;
			i+=n;
			if (n>0) {
//				output.push({t: tn, gsr: gsr});
				output.push({t: parseInt(t-timewindow*window.smooth), gsr: gsr});
				output.push({t: parseInt(t-timewindow*(1-window.smooth)), gsr: gsr});
			}
			t -= timewindow;
		}
//		console.log(output.length);
		return output;
	}
	
	var processData = function(data) {
		var time_window = 1000*60;
		var max_val = 0;
		var min_val = 1;
		var minsmooth = window.minsmooth || 0.99999;
		var maxsmooth = window.maxsmooth || 0.99;
		// data is going from most recent time and back in time. data[0].t>data[1].t
		var bndr = function(i) {
			var xv = max_val,
				nv = min_val;
			var val = parseFloat(data[i].gsr);
			xv = val*(1-maxsmooth)+xv*maxsmooth;
			if (val>xv) xv = val;
			nv = val*(1-minsmooth)+nv*minsmooth;
			if (val<nv) nv = val;
			min_val = nv; max_val = xv;
			
			return [nv,xv];
		}

		// apply low pass filter on signal
		var lf = window.lf;
		var median = function(data,i) {
			var vals = [];
			for (var j=Math.max(0,i-5);j<Math.min(data.length-1,i+5);j++) {
				vals.push(data[i].gsr);
			}
			return vals[parseInt(vals.length/2)];
		}
		for (var i=0;i<data.length;i++) {
			data[i].gsr = median(data, i); //data[i].gsr*lf+data[i-1].gsr*(1.0-lf);
		}
		
		var dynamicReduction = window.dynamicReduction || 0.995;

		var newdata = [];
		var minValues = [];
		var inDataWithoutBaseline = [];
		var maxValues = [];
		var gain = [];
		for (var i=0;i<data.length;i++) {
			var val = data[i].gsr;
			var max_min = bndr(i);
			minValues.push({
				t: data[i].t,
				gsr: max_min[0],
				min: max_min[0], max: max_min[1],
				orig: val,
			});
			maxValues.push({
				t: data[i].t,
				gsr: max_min[1],
				min: max_min[0], max: max_min[1],
				orig: val,
			});
			inDataWithoutBaseline.push({
				t: data[i].t,
				gsr: val-max_min[0],
				min: max_min[0], max: max_min[1],
				orig: val,
			});
			gain.push({
			    t: data[i].t,
			    gsr: 1 / ((1 - dynamicReduction) + max_min[1] * dynamicReduction),
			    min: max_min[0], max: max_min[1],
			    orig: val,
			});
			newdata.push({
			    t: data[i].t,
			    gsr: inDataWithoutBaseline[inDataWithoutBaseline.length-1].gsr * gain[gain.length-1].gsr,
			    min: max_min[0], max: max_min[1],
			    orig: val,
			});
 		}
		
		Data.processedArrays = [
		{name: "min", data: minValues, enabled: false},
		{name: "max", data: maxValues, enabled: true},
		{name: "in drop da base", data: inDataWithoutBaseline, enabled: false}, 
		{name: "gain", data: gain, enabled: false}
		];

		return newdata;
	}

	return {

	dataMerge : function dataMerge(more, sorted) {
		more = more.map(function(d) { d.gsr = d.gsr/51000; return d; });

		if (sorted) {
			if (more.length<=1) {
				var output = window.data;
			} else if (window.data.length==0) {
				var output = more;
			} else if (more[0].t<window.data[0].t) {
				var output = more.concat(window.data);
			} else {
				var output = window.data.concat(more);
			}
		} else {
			console.log("Sorting data…");
			// sort more	(just a bubble sort)
	/*		for (var i=0;i<more.length-1;i++) {
				for (var j=i+1;j<more.length;j++) {
					if (more[i].t>more[j].t) {
						var tmp = more[j];
						more[j] = more[i];
						more[i] = tmp;
					}
				}
			}*/
			more.sort(function(a,b) { return a.t-b.t; });
			console.log("Sorting done.");
	
			var data = window.data;
	
			// merge
			var i=0,j=0;
			var output = [];
			while(i<data.length&&j<more.length) {
				if (data[i].t<more[j].t) {
					output.push(data[i++]);
				} else {
					output.push(more[j++]);
				}
			}
			if (i<data.length) {
				output = output.concat(data.slice(i));
			} else if (j<more.length) {
				output = output.concat(more.slice(j));
			}
		}
	
		window.data = output;

		if (!window.filteredData || window.filteredData.length!=window.data.length)
			window.filteredData = processData(output);
	},
	
	reprocessData : function() {
		window.filteredData = processData(window.data);
	},

	getResolution : function(start,end) {
		var ts = rendering.end-rendering.start; //data[0].t-data[data.length-1].t;
//		var window = parseInt(ts/100);
		if (ts<60*1000*2) {	// minute
			return 1000;
		} else if (ts<1000*60*10) {	// 10 minutes
			return 5*1000;
		} else if (ts<1000*60*65) { // hour
			return 10*1000;
		} else if (ts<1000*60*60*6) { // 6 hours
			return 60*1000*2;
		} else if (ts<1000*60*60*24) { // day
			return 240*1000;
		} else {
			return 240*1000*5;
		}
		return window;
	},

	getData : function(start,end) {
		var output = [];
		
		function bs(a, t, l, r) {
			if (r-l<=1) return l;
			var m  = parseInt((l+r)/2);
			if (a[m].t<t) return bs(a,t,m,r);
			return bs(a,t,l,m);
		}
		
		var l = bs(window.data,start, 0, window.data.length-1);
		var r = bs(window.data,end, 0, window.data.length-1);

		return aggregateData((window.data.slice(l,r+1).reverse()), start, end);
	},

	getDataFiltered : function(start,end) {
		var output = [];
		
		function bs(a, t, l, r) {
			if (r-l<=1) return l;
			var m  = parseInt((l+r)/2);
			if (a[m].t<t) return bs(a,t,m,r);
			return bs(a,t,l,m);
		}
		
		var l = bs(window.data,start, 0, window.data.length-1);
		var r = bs(window.data,end, 0, window.data.length-1);

		return aggregateData((window.filteredData.slice(l,r+1).reverse()), start, end);
//		return window.filteredData.slice(l,r+1).reverse();
	},

	getDataMisc : function(data, start,end) {
		var output = [];
		
		function bs(a, t, l, r) {
			if (r-l<=1) return l;
			var m  = parseInt((l+r)/2);
			if (a[m].t<t) return bs(a,t,m,r);
			return bs(a,t,l,m);
		}
		
		var l = bs(data,start, 0, window.data.length-1);
		var r = bs(data,end, 0, window.data.length-1);

		return aggregateData((data.slice(l,r+1).reverse()), start, end);
//		return window.filteredData.slice(l,r+1).reverse();
	},

	};	// end of return object
})();
