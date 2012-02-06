/**
 * Console
 * 
 * Creates a pseudo Console panel at the bottom of your swf
 * use Console.trace() to send messages to this Console
 */
package {

	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.display.Stage;
	import flash.display.GradientType;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.geom.Matrix;
	import flash.text.TextField;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	import flash.text.TextFieldAutoSize;
	
	public class Console extends Sprite {
		
		private var Console_txt:TextField;			// text field containiner Console text
		private var titleBar:Sprite;				// sprite for titleBar
		private var mainStage:Stage;				// reference to the main stage (for events)
		private static var instance:Console;		// singleton Console instance reference
		private static var _enabled:Boolean = true;	// enabled - when false Console messages do not appear
		private static var maxChars:int = 10000;	// maximum characters allowed in Console, when reached oldest Console text is deleted
		public static var autoExpand:Boolean = true;	// when true, Console panel automatically opens when trace is used
		
		// public enabled
		public static function get enabled():Boolean {
			return _enabled;
		}
		public static function set enabled(b:Boolean):void {
			_enabled = b;
		}
		
		/**
		 * Constructor 
		 */
		public function Console(targetStage:Stage = null, ConsoleHeight:uint = 155){
			// if instance already exists, remove it from the display
			// list and create a new one
			if (instance && instance.parent){
				instance.parent.removeChild(instance);
			}
			instance = this;
			
			// start hidden
			visible = false;
			
			// assign the passed stage to mainStage
			mainStage = (targetStage) ? targetStage : stage;
			
			// create and add Console and titleBar
			addChild(newConsoleField(ConsoleHeight));
			addChild(newTitleBar());
			
			// listen for click and resize events for 
			// panel toggling and resizing
			titleBar.addEventListener(MouseEvent.CLICK, toggleCollapse);
			mainStage.addEventListener(Event.RESIZE, fitToStage);
			
			// start off fit to stage and collapsed
			fitToStage();
			toggleCollapse();
		}
		
		/**
		 * trace
		 * sends arguments to the Console text field for display
		 */
		public static function trace(...args):void {
			// if not enabled, exit
			if (!instance || !_enabled) return;
			
			// add text, keeping within maxChars
			instance.Console_txt.appendText(args.toString() + "\n");
			if (instance.Console_txt.text.length > maxChars) {
				instance.Console_txt.text = instance.Console_txt.text.slice(-maxChars);
			}
			
			// scroll to bottom of text field
			instance.Console_txt.scrollV = instance.Console_txt.maxScrollV;
			
			// Make visible and expand if not already
			if (!instance.visible) instance.visible = true;
			if (autoExpand && !instance.Console_txt.visible) toggleCollapse();
		}
		
		/**
		 * clear
		 * clears Console text field text
		 */
		public static function clear():void {
			if (!instance) return;
			instance.Console_txt.text = "";
		}
		
		/**
		 * toggleCollapse
		 * either collapses or expands the Console panel
		 * depending on its current state
		 */
		public static function toggleCollapse(evt:Event = null):void {
			if (!instance) return;
			instance.Console_txt.visible = !instance.Console_txt.visible;
			
			// fit to stage will handle visual expand or collapse
			instance.fitToStage();
		}
		
		/**
		 * newConsoleField
		 * creates the text field used for traced Console messages
		 */
		private function newConsoleField(ConsoleHeight:uint):TextField {
			Console_txt = new TextField();
			Console_txt.type = TextFieldType.INPUT;
			Console_txt.border = true;
			Console_txt.borderColor = 0;
			Console_txt.background = true;
			Console_txt.backgroundColor = 0xFFFFFF;
			Console_txt.height = ConsoleHeight;
			Console_txt.multiline = true;
			Console_txt.wordWrap = true;
			var format:TextFormat = Console_txt.getTextFormat();
			format.font = "_typewriter";
			Console_txt.setTextFormat(format);
			Console_txt.defaultTextFormat = format;
			return Console_txt;
		}
		
		/**
		 * newTitleBar
		 * creates the titleBar sprite
		 */
		private function newTitleBar():Sprite {
			// create a new shape for the gradient background
			var barGraphics:Shape = new Shape();
			barGraphics.name = "bar";
			var colors:Array = new Array(0xE0E0F0, 0xB0C0D0, 0xE0E0F0);
			var alphas:Array = new Array(1, 1, 1);
			var ratios:Array = new Array(0, 50, 255);
			var gradientMatrix:Matrix = new Matrix();
			gradientMatrix.createGradientBox(18, 18, Math.PI/2, 0, 0);
			barGraphics.graphics.lineStyle(0);
			barGraphics.graphics.beginGradientFill(GradientType.LINEAR, colors, alphas, ratios, gradientMatrix);
			barGraphics.graphics.drawRect(0, 0, 18, 18);
			
			// label for the panel title "Console"
			var barLabel:TextField = new TextField();
			barLabel.autoSize = TextFieldAutoSize.LEFT;
			barLabel.selectable = false;
			barLabel.text = "Console";
			var format:TextFormat = barLabel.getTextFormat();
			format.font = "_sans";
			barLabel.setTextFormat(format);
			
			// Sprite to contain both the gradient and the title
			titleBar = new Sprite();
			titleBar.addChild(barGraphics);
			titleBar.addChild(barLabel);
			return titleBar;
		}
		
		/**
		 * fitToStage - event handler
		 * when the stage resizes, stretch to fit horizontally
		 * and position at the bottom of the screen
		 */
		private function fitToStage(evt:Event = null):void {
			Console_txt.width = mainStage.stageWidth;
			Console_txt.y = mainStage.stageHeight - Console_txt.height;
			
			// position titleBar at the top of the Console text field
			// if its visible or, if not, at the bottom of the screen
			titleBar.y = (Console_txt.visible) ? Console_txt.y - titleBar.height : mainStage.stageHeight - titleBar.height;
			titleBar.getChildByName("bar").width = mainStage.stageWidth;
		}
	}
}