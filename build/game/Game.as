package{
	import com.nhe.ui.*;

	import flash.text.TextField
	import flash.display.Sprite
	import flash.display.SimpleButton;
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.LoaderInfo;
	import flash.display.Loader;
	import flash.events.Event;
	import flash.net.URLRequest;

	public class Game extends Sprite{

		public var button:SimpleButton;
		private var numButtonWidth:Number = 100;
		private var numButtonHeight:Number = 50;
/*
		private function drawButtonState(bitmap, height, width):Sprite {
			var sprite:Sprite = new Sprite();
			sprite.graphics.lineStyle(4,0x33621E,1);
			sprite.graphics.beginFill(rgb);
			sprite.graphics.drawRoundRect(((this.stage.
			stageWidth/2)-(numButtonWidth/2)),((this.
			stage.stageHeight/2)-(numButtonHeight/2)),
			numButtonWidth,numButtonHeight,10,10);
			return sprite;
		}
*/
		public function Game(){
			//Add console
			stage.addChild(new Console(stage));

			var skinImgLoader:Loader = new Loader();
			var skinImgData:BitmapData;
    		skinImgLoader.contentLoaderInfo.addEventListener(Event.COMPLETE, onComplete);
			skinImgLoader.load(new URLRequest("/res/skin/rhythm/rhythm-skin.png"));

			function onComplete (event:Event):void {
			    skinImgData = Bitmap(LoaderInfo(event.target).content).bitmapData;
			}
/*
			button = new SimpleButton;
			button.upState = drawButtonState(0xDAD8F3);
			button.overState = drawButtonState(0x4F42C6);
			button.downState = drawButtonState(0xDDF2FF);
			button.hitTestState = drawButtonState(0xDDF2FF);
			button.useHandCursor = true;
			this.addChild(button);
			*/
			//addChild(imageLoader);
			//Console.trace("Click");
		}
	}
}