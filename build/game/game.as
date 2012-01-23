package{
	import flash.text.TextField
	import flash.display.Sprite

	public class game extends Sprite{
		public function game ():void{
			var txtHello:TextField = new TextField();
			txtHello.text = "Hello World"
			addChild(txtHello);
		}
	}
}