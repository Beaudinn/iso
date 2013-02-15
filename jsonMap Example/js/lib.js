// JavaScript Document
Position = function(element, x,y)
{
	this.element = element;
	this.set(x,y);
}
Position.prototype = {

	constructor : Position,
	element : document.createElement('div'),
	
	x : 0,
	y : 0,
	
	set : function(x,y)
	{
		this.x = x;
		this.y = y;
	}
}

hoverMap = [];
currentHover = null;
window.onmousemove = function(e)
{
	if( hoverMap[e.clientY] != undefined )
	{
		if( hoverMap[e.clientY][e.clientX] != currentHover && currentHover != null )
		{
			currentHover.cancel();
			currentHover = null;
		}
	}
	if( hoverMap[e.clientY] != undefined )
	{
		if( hoverMap[e.clientY][e.clientX] instanceof HoverArea )
		{
			currentHover = hoverMap[e.clientY][e.clientX];
			hoverMap[e.clientY][e.clientX].run();
		}
	}
}

HoverArea = function(element)
{
	this.element = element;
}
HoverArea.prototype = {

	constructor: HoverArea,
	element : document.createElement('div'),
	
	
	run : function()
	{
		this.element.style.backgroundColor = '#000000';
		
		currentHover = this;	
	},
	
	cancel : function()
	{
		this.element.style.background = '#FF0000';
	}

}

Map = function(width, height)
{
	this.element = document.createElement('div');
	this.element.setAttribute('id','container');
	this.element.style.width = width + "px";
	this.element.style.height = height + "px";
	
	document.body.appendChild(this.element);
}
Map.prototype = {

	constructor : Map,
	
	element : null,
	
	tiles : [],
	buildings : [],
	map : [],
	
	hoverMap : [],
	
	ready : 0,
	
	containerMaxRows : 0,
	containerMaxCols : 0,
	
	generate : function()
	{
		var tile = new Tile(1,1);
		
		this.tilesMaxRows = Math.floor(this.getWidth() / tile.getWidth());
		this.tilesMaxCols = Math.floor(this.getHeight() / tile.getHeight());
		
		for( var x = 1; x <= this.tilesMaxRows; x++ )
		{
			for( var y = 1; y <= this.tilesMaxRows; y++ )
			{
				var tile = new Tile(x,y);				
				this.tiles.push(tile);
				this.element.appendChild(tile.element);
			}
		}

		for( var i in this.map.buildings )
		{
			var building = this.map.buildings[i],
				image = new Image();

			image.src = 'map/buildings/' + building.image;
			
			var buildingObject = new Building(image, building.x, building.y);
			
			this.buildings.push(buildingObject)
			this.element.appendChild(buildingObject.element);
		}
	},
	
	getWidth : function()
	{
		return parseInt(this.element.style.width);	
	},
	
	getHeight : function()
	{
		return parseInt(this.element.style.height);	
	},
	
	getMap : function(map)
	{
		var _this = this,
			xhr = new XMLHttpRequest();
		xhr.open('GET', map, false);

		xhr.onreadystatechange = function()
		{
			if( this.readyState == this.DONE )
			{
				_this.map = JSON.parse(this.responseText);
				_this.onReady();
			}
		}
				
		xhr.send(null);
	},
	
	onReady : function()
	{
		this.ready++;
		this.generate();
	}
}


MapItem = function(x,y)
{
	this.element = document.createElement('div');
	this.position = new Position(this.element, x,y);
	return this;
}
MapItem.prototype = {
	
	constructor: MapItem,
	
	element : document.createElement('div'),
	
	getWidth : function()
	{
		return parseInt(this.element.style.width);	
	},
	
	getHeight : function()
	{
		return parseInt(this.element.style.height);	
	}

}

Tile = function(x,y)
{
	MapItem.call(this)
	
	this.position.set(x,y);
	
	this.element.style.width = 24 + "px";
	this.element.style.height = 12 + "px";
	this.element.style.zIndex = x;

	this.element.style.top = this.getHeight() * this.position.x + 'px';
	this.element.style.left =  this.getWidth() * 2 * this.position.y + 'px';
					
	if( Math.floor(x/2) != (x/2) )
	{
		this.element.style.left = parseInt(this.element.style.left) - this.getWidth() + 'px'
	}

	this.element.setAttribute('class', 'tile');
}

Tile.prototype = new MapItem();
Tile.prototype.constructor = Tile;

Building = function(image, x,y)
{
	MapItem.call(this)
	
	this.image = ( image instanceof Image ? image : new Image() );
	
	this.canvas = document.createElement('canvas');
	this.canvas.height = this.image.height;
	this.canvas.width = this.image.width;
	var context = this.canvas.getContext('2d');
	context.drawImage(this.image,0,0);
	
	var pixels = this.image.width*this.image.height,
		i = 0;
		
	this.hoverArea = new HoverArea(this.element);
	
	while(pixels != i)
	{
		var y = Math.floor(i/this.image.width),
			x = i - this.image.width*y;
		
		var pixel = context.getImageData(x,y,1,1);
		if(pixel.data[3] != 0 )
		{
			hoverMap[y] = hoverMap[y] == undefined ? [] : hoverMap[y];
			hoverMap[y][x] = this.hoverArea;
		}
		i++;
	}
	
	
	this.position.set( Math.floor(y - (this.image.height/2)) , Math.floor(x -( this.image.width/2)) );
	
	this.element.style.width = this.image.width + "px";
	this.element.style.height = this.image.height + "px";
	this.element.style.zIndex = x;
	this.element.style.left = this.position.x + 'px';
	this.element.style.top = this.position.y + 'px';
	this.element.style.postition = 'absolute';
	this.element.appendChild(this.image);
	this.element.setAttribute('class', 'building');
}

Building.prototype = new MapItem();
Building.prototype.constructor = Building;