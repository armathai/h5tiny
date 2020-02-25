Tiny.ObjectCreator = function (game)
{
    this.game = game;
};

Tiny.ObjectCreator.prototype = {
	group: function(x, y) {
		var group = new Tiny.DisplayObjectContainer()
		this.game.stage.addChild(group)
		group.x = x || 0, group.y = y || 0
		return group;
	},
	sprite: function(x, y, imagePath, key) {
		var texture = null
		if (typeof imagePath == "string") {
			if (key)
				imagePath = imagePath + "_" + key
			texture = Tiny.TextureCache[imagePath]
		} else
			texture = imagePath

		if (!texture)
			throw new Error('Cache Error: image ' + imagePath + ' does`t found in cache');

		if (texture.max_no_frame) {
			texture = Tiny.TextureCache[texture.key + "_" + 0]
		}

		var sprite = new Tiny.Sprite( texture )
		this.game.stage.addChild(sprite)
		sprite.x = x || 0, sprite.y = y || 0
		//game.objects.push(sprite)
		
		return sprite;
	},
	text: function(x, y, text, tyle) {
		var text = new Tiny.Text(text, tyle)
		this.game.stage.addChild(text)
		text.x = x || 0, text.y = y || 0
		//game.objects.push(sprite)
		
		return text;
	},
	tileSprite: function(x, y, w, h, imagePath, key) {
		var texture = null
		if (typeof imagePath == "string") {
			if (key)
				imagePath = imagePath + "_" + key
			texture = Tiny.TextureCache[imagePath]
		} else
			texture = imagePath

		if (!texture)
			throw new Error('Cache Error: image ' + imagePath + ' does`t found in cache');

		var tile = new Tiny.TilingSprite( texture, w , h )
		this.game.stage.addChild(tile)
		tile.x = x || 0, tile.y = y || 0
		return tile;
	},
	graphics: function(x, y) {
		var graphics = new Tiny.Graphics()
		this.game.stage.addChild(graphics)
		graphics.x = x || 0, graphics.y = y || 0
		//game.objects.push(sprite)
		
		return graphics;
	}
};