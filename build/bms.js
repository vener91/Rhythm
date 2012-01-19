var fs = require('fs');
//Base song template
var songTemplate = {
	title: '',
	author: '',
	artist: '',
	level: 0,
	bpm: 60,
	genre: '',
	trackConfig :{
		playingKeys: [0,1,2,3,4,5,6,7],
		autoplay: [8]
	},
	clipchart:{
		
	},
	notechart: [
	]
}

function copyFileSync(srcFile, destFile) {
  var BUF_LENGTH, buff, bytesRead, fdr, fdw, pos;
  BUF_LENGTH = 64 * 1024;
  buff = new Buffer(BUF_LENGTH);
  fdr = fs.openSync(srcFile, 'r');
  fdw = fs.openSync(destFile, 'w');
  bytesRead = 1;
  pos = 0;
  while (bytesRead > 0) {
    bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
    fs.writeSync(fdw, buff, 0, bytesRead);
    pos += bytesRead;
  }
  fs.closeSync(fdr);
  return fs.closeSync(fdw);
};

//Greatest common multiplier
function gcm(a, b) {
	return ( b == 0 ) ? (a):( gcm(b, a % b) );
}

//Lowest common multiplier
function lcm(a, b) {
	return ( a / gcm(a,b) ) * b;
}
function lcm_nums(ar) {
	if (ar.length > 1) {
		ar.push( lcm( ar.shift() , ar.shift() ) );
		return lcm_nums( ar );
	} else {
		return ar[0];
	}
}

//Iterates through each dir
fs.readdir('./build/BMS', function(err, songDirs){
	if (err) throw err;
	for(var i = 0; i < songDirs.length; i++){
		var songDir = songDirs[i];
		fileNames = fs.readdirSync('./build/BMS/' + songDir);
		for(var j = 0; j < fileNames.length; j++){
			var fileName = fileNames[j];
			if(fileName.substring(fileName.length - 3) == 'bms'){

				//Temp variables
				var songBar;
				var lastBarPosition = null;
				var songData;

				data = fs.readFileSync('./build/BMS/' + songDir + '/' + fileName, 'utf8');
				lines = data.split(/\n/);
				var song = songTemplate;

				

				//Awesome parser goes here
				for(var k = 0; k < lines.length; k++){
					lineChunk = lines[k].split(/ /, 2);
					//For general metadata
					switch(lineChunk[0]){
						case '#GENRE':
						song.genre = lineChunk[1].trim();
						break;
						case '#TITLE':
						song.title = lineChunk[1].trim();
						break;
						case '#BPM':
						song.bpm = lineChunk[1].trim();
						break;
						case '#PLAYLEVEL':
						song.level = lineChunk[1].trim();
						break;
						case '#ARTIST':
						song.artist = lineChunk[1].trim();
						break;
					}
					//Parse clipchart
					if(lineChunk[0].match(/#WAV../) != null){
						var oldName = lineChunk[1].trim();
						var newName = lineChunk[1].trim().replace(/\+/g, "plus").replace(/#/g, "hash").replace(/-/g, "ms");
						song.clipchart[lineChunk[0].substring(4)] = newName;
						//Copy notes
						copyFileSync('./build/BMS/' + songDir + '/' + oldName, './build/BMSconverted/' + newName)
						
					}
					//Parse notes
					if(lineChunk[0].match(/#[0-9]{5}/) != null){
						if(lastBarPosition != lineChunk[0].substring(1,4)){
							if(lastBarPosition != null){ //When it is not the first bar, create bar
								song.notechart.push(songBar);
							}
							songBar = {
								divisions: 0,
								data:[]
							};
							lastBarPosition = lineChunk[0].substring(1,4);
						}
						songChannel = lineChunk[0].substr(4,2);
						songBMSData = lineChunk[0].substring(7).trim();
						//Check length of data
						currDivisions = songBMSData.length/2;
						if(songBar.divisions != 0 && currDivisions != songBar.divisions){ //Will be always an integer
							newDivisions = lcm(currDivisions, songBar.divisions);
							//Relocate old data
							var oldData = songBar.data;
							songBar.data = [];
							for(var l = 0; l < songBar.divisions; l++){
								if(typeof(oldData[l]) != 'undefined'){
									songBar.data[l * newDivisions/songBar.divisions] = oldData[l];
								}
							}
						}

						if(songBar.divisions == 0){ //New Bars
							songBar.divisions = currDivisions;
							newDivisions = currDivisions;
						}

						//Add new notes to total
						for(var l = 0; l < currDivisions; l++){
							var clipName = songBMSData.substr(l * 2, 2);
							if(clipName != '00'){
								if(typeof(songBar.data[l * newDivisions/currDivisions]) == 'undefined'){
									songBar.data[l * newDivisions/currDivisions] = {};
								}
								switch(songChannel){ //Old channel to new channel map
									case '16': //Short W1
									songBar.data[l * newDivisions/currDivisions].w1 = clipName;
									break;
									case '11': //Short B1
									songBar.data[l * newDivisions/currDivisions].b1 = clipName;
									break;
									case '12': //Short W2
									songBar.data[l * newDivisions/currDivisions].w2 = clipName;
									break;
									case '13': //Short G
									songBar.data[l * newDivisions/currDivisions].g  = clipName;
									break;
									case '14': //Short W3
									songBar.data[l * newDivisions/currDivisions].w3 = clipName;
									break;
									case '15': //Short B2
									songBar.data[l * newDivisions/currDivisions].b2 = clipName;
									break;
									case '18': //Short W4
									songBar.data[l * newDivisions/currDivisions].w4 = clipName;
									break;
									case '50': //Long W1
									songBar.data[l * newDivisions/currDivisions].w1 = clipName;
									break;
									case '51': //Long B1
									songBar.data[l * newDivisions/currDivisions].b1 = clipName;
									break;
									case '52': //Long W2
									songBar.data[l * newDivisions/currDivisions].w2 = clipName;
									break;
									case '53': //Long G
									songBar.data[l * newDivisions/currDivisions].g  = clipName;
									break;
									case '54': //Long W3
									songBar.data[l * newDivisions/currDivisions].w3 = clipName;
									break;
									case '55': //Long B2
									songBar.data[l * newDivisions/currDivisions].b2 = clipName;
									break;
									case '56': //Long W4
									songBar.data[l * newDivisions/currDivisions].w4 = clipName;
									case '57':
									case '58':
									break;
									default:
									console.info('Channel Error - at line ' + (k + 1));				
								}
							}

						}

						//Update divisions
						songBar.divisions = newDivisions;
					}
				}
				var newSongFileName = fileName.substring(0, fileName.length - 4) + '.json';
				fs.writeFile('./build/BMSconverted/' + newSongFileName, JSON.stringify(song, null, '\t'), function(err){
					if (err) throw err;
				});

			}
		}

	}
});