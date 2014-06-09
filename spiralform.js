var SpiralForm = (function() {
	var scale = 2.2;

	var p = function(t) {
		return coord(t);
	}
	
	var normal = function(t) {
		var p1 = p(t);
		var p2 = p(t-0.001);
		var t = [ p1[0]-p2[0], p1[1]-p2[1]];
		var len = Math.sqrt(t[0]*t[0]+t[1]*t[1]);
		return [t[1]/len, -t[0]/len];
	}
	
	var coord = function(t) {
		var ti = t*parseInt(spiralcoords.length/3-1);
		var i = parseInt(ti);
		var s = ti-i;
		
		if (t<0) {
			i = 0;
			s = 0;
		}

		if (t>=1.0 || i*3==spiralcoords.length) {
			i=parseInt(spiralcoords.length/3)-2;
			s = 1;
		}

		return [
			(spiralcoords[i*3+0]*(1-s) + spiralcoords[(i+1)*3+0]*s + 0.18958333333333)*scale,
			(spiralcoords[i*3+1]*(1-s) + spiralcoords[(i+1)*3+1]*s + 0.42916666666667 + 0.01)*scale,
			(spiralcoords[i*3+2]*(1-s) + spiralcoords[(i+1)*3+2]*s)*scale,
		]
	}

var spiralcoords = [
-0.20208333333333334,-0.5104166666666666,0,
-0.18159829156282375,-0.5142101929204647,0.00499999999999997,
-0.16100414045789554,-0.5110623812924981,0.00499999999999997,
-0.1430044064925801,-0.5005725121343223,0.007499999999999972,
-0.1267754538900644,-0.48750924779484434,0.00937499999999997,
-0.11280039476109191,-0.4720585034723367,0.01104166666666663,
-0.10208407453473557,-0.45419266292161076,0.013124999999999956,
-0.09503938764221254,-0.43458653723691487,0.01583333333333328,
-0.09067670692932613,-0.41421511620707047,0.019374999999999934,
-0.09055498400534408,-0.3933821384720573,0.02312499999999992,
-0.09490805796362421,-0.3730086624580944,0.02229166666666659,
-0.10071841144915966,-0.35300197432260066,0.02374999999999992,
-0.11008904678402148,-0.33439501403353633,0.02708333333333324,
-0.12261295637322031,-0.317746306384612,0.03020833333333323,
-0.13670180342578994,-0.3023992491257406,0.033124999999999884,
-0.15205167989080676,-0.2883134736665583,0.035208333333333244,
-0.17001593945977866,-0.27776296865891154,0.0366666666666666,
-0.18883696452059873,-0.2688300635638285,0.03687499999999993,
-0.20808254838926032,-0.2608528911743104,0.03687499999999993,
-0.2282589077382332,-0.2556622937906855,0.03687499999999993,
-0.24906431129431178,-0.2545838872595058,0.03687499999999993,
-0.26984618834456936,-0.2531205472287013,0.03833333333333329,
-0.29055181604586444,-0.2554237535314755,0.03833333333333329,
-0.311243685531787,-0.2578474521421376,0.03833333333333329,
-0.3307062215706376,-0.2652796435224921,0.03833333333333329,
-0.3494849044875536,-0.2743012201964283,0.039374999999999966,
-0.3659234062311289,-0.28709979192159546,0.04083333333333332,
-0.3811259318778149,-0.3013444748503107,0.04145833333333333,
-0.3941338141887306,-0.31761785113070024,0.04145833333333333,
-0.4040336027699034,-0.33594875301320065,0.04145833333333333,
-0.4132558706542993,-0.3546296939115124,0.041875,
-0.41960076541505636,-0.3744733349144306,0.042916666666666686,
-0.4222124279507632,-0.3951423212605813,0.042916666666666686,
-0.42531679252174315,-0.4157430663536167,0.04312500000000002,
-0.422637727315211,-0.4364034242255638,0.04312500000000002,
-0.41988591986004464,-0.4570542192104419,0.04312500000000002,
-0.4145546669745297,-0.4771938696654142,0.04250000000000001,
-0.4053933914936698,-0.4959047972036624,0.041875,
-0.3968770716132288,-0.5149179524776242,0.041875,
-0.38663171731644425,-0.5330579770947832,0.04229166666666667,
-0.3734047783676696,-0.5491538108359464,0.04229166666666667,
-0.3577874732911984,-0.5629424858965244,0.04229166666666667,
-0.3428913882318876,-0.577507321209138,0.04312500000000002,
-0.3263309106050494,-0.5901476676659709,0.0441666666666667,
-0.30829975458053116,-0.6005834326210309,0.045416666666666716,
-0.2913742845278057,-0.6127307056183777,0.04708333333333341,
-0.27246260217317264,-0.6214700447407164,0.049583333333333444,
-0.2536702387261705,-0.6304630894894961,0.05000000000000012,
-0.23323140818847996,-0.6344981835440809,0.0510416666666668,
-0.2132434904912222,-0.6403727834373019,0.05208333333333348,
-0.19249878740500143,-0.6422924374796543,0.05208333333333348,
-0.17167538545048966,-0.6429356394841704,0.053333333333333496,
-0.15093030545814354,-0.6410200628375864,0.05375000000000017,
-0.13017526538212945,-0.639215599144179,0.055416666666666864,
-0.1100793890981946,-0.6337216448161412,0.057291666666666886,
-0.09074115642144977,-0.6259717716095748,0.057916666666666894,
-0.07129870482876109,-0.618487197216616,0.057916666666666894,
-0.05319437242453162,-0.6081789031785637,0.057916666666666894,
-0.03546115723600861,-0.5972445144505499,0.057916666666666894,
-0.01849865267227635,-0.5851490104634007,0.057916666666666894,
-0.0026751898430742217,-0.5715974127025965,0.057916666666666894,
0.009751773587153127,-0.5548762178385455,0.057916666666666894,
0.023907249156980726,-0.5395905942277863,0.057916666666666894,
0.036729311558115305,-0.5231704086758754,0.057916666666666894,
0.04689711067806049,-0.5049867996052255,0.057916666666666894,
0.056874156749617676,-0.4866978321804691,0.057916666666666894,
0.06586725420611768,-0.46790549395672293,0.057916666666666894,
0.07300948655826325,-0.44833469185753083,0.059375000000000254,
0.07879443763474778,-0.4283206438207029,0.06083333333333361,
0.08320596179399331,-0.40795974422441367,0.06229166666666696,
0.08500624678899271,-0.3872043412720603,0.0631250000000003,
0.08626400535219526,-0.3664090095561567,0.06395833333333364,
0.08404750611628309,-0.345693920637328,0.06562500000000034,
0.08210098434941102,-0.3249517213617239,0.06645833333333369,
0.0771566629856153,-0.3047136022784373,0.06750000000000037,
0.07264554471429178,-0.2843745366725667,0.06895833333333372,
0.06509233984370795,-0.26495864436856054,0.06895833333333372,
0.05664464394137644,-0.24591489968114394,0.07020833333333373,
0.04843157037243344,-0.22676879824171484,0.07020833333333373,
0.03862880825942483,-0.20838582697117367,0.07020833333333373,
0.02646133215184528,-0.19147487481142644,0.07020833333333373,
0.014145160000668197,-0.17467190836736227,0.07145833333333376,
0.0017417229442833933,-0.1579332546889424,0.07145833333333376,
-0.012588809494116227,-0.14281162720345814,0.07145833333333376,
-0.026446647391753626,-0.12725566029102922,0.07145833333333376,
-0.04196034471476793,-0.11335051832312122,0.07145833333333376,
-0.058418835095937635,-0.10057766147155031,0.07145833333333376,
-0.07517638671692192,-0.08819976821591809,0.07145833333333376,
-0.09412594045005633,-0.07954285242027646,0.07250000000000044,
-0.11343214725996144,-0.07171353850455234,0.07250000000000044,
-0.13283080813294046,-0.06411618803791382,0.07291666666666712,
-0.1528724425771495,-0.058427544387405085,0.07375000000000045,
-0.17291407702135853,-0.052738900736896355,0.07541666666666715,
-0.19244608090386053,-0.04549123889933083,0.07541666666666715,
-0.21298643022450278,-0.042009597395130764,0.07541666666666715,
-0.23377512373726908,-0.04064651272789739,0.07750000000000051,
-0.2545536084830897,-0.03913576806202054,0.07770833333333385,
-0.27518868480812153,-0.03626846918714032,0.07770833333333385,
-0.2960123176769545,-0.035632786938027884,0.07854166666666719,
-0.31683841213280306,-0.03618193855083997,0.07958333333333387,
-0.337452802324223,-0.03919436196292345,0.07958333333333387,
-0.3581281450932846,-0.04175521712469792,0.07958333333333387,
-0.37848755230743336,-0.04617362358701508,0.07958333333333387,
-0.3992943077582048,-0.047225624247457056,0.07958333333333387,
-0.4188440290597044,-0.054425358604464215,0.08041666666666722,
-0.43753203776077965,-0.06363329586349865,0.08125000000000056,
-0.4562200464618548,-0.07284123312253321,0.08208333333333391,
];

return {
	p : p,
	normal : normal,
};

})();