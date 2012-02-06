// BitmapStateSlicer Class v1.8
//
// released under MIT License (X11)
// http://www.opensource.org/licenses/mit-license.php
//
// Author: Niko Helle
// http://www.nikohelle.net

/*
Copyright (c) 2010 Niko Helle

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
package com.nhe.gfx {
	
	import flash.display.BitmapData;
	import flash.display.Bitmap
	import flash.geom.Point;
	import flash.geom.Rectangle;

	public class BitmapStateSlicer
	{
		public static var HITTEST_STATE:uint = 0; // HITTEST IS ALWAYS SAME AS UP_STATE
		public static var UP_STATE:uint = 1;
		public static var OVER_STATE:uint = 2; // IF NOT SET, OVER_STATE IS UP_STATE
		public static var DOWN_STATE:uint = 4; // IF NOT SET, DOWN_STATE IS OVER_STATE
		public static var DISABLED_STATE:uint = 8; // IF NOT SET, DISABLED_STATE IS UP_STATE
		
		public static var ALL_BUTTON_STATES:uint = 15; 
		
		public static var BASE_STATE:uint = 1; //KEEP SAME AS BTN UP_STATE
		//public static var OVER_STATE:uint = 2; 	// SAME AS BTN OVER_STATE
		public static var FOCUS_STATE:uint = 4; // KEEP SAME AS DOWN_STATE - IF NOT SET, FOCUS_STATE IS OVER_STATE
		//public static var DISABLED_STATE:uint = 8; 	// KEEP SAME AS BTN DISABLED_STATE
		
		public static var ALL_TEXTFIELD_STATES:uint = 7;
		
		public static var MAX_STATE:uint = 255;

		
		public static var ALIGNMENT_HORIZONTAL:uint = 1;
		public static var ALIGNMENT_VERTICAL:uint = 0;
		
		public var gfx:Array;
		private var _states:uint;
		private var _sourceAlignment:uint;
		
		/**
		 * The BitmapStateSlicer slices (and scales slices in necessary) images for the IconButton
		 */
		
		public function BitmapStateSlicer(bmd:BitmapData,width:uint,height:uint,sourceAlignment:uint=0,scale9Rect:Rectangle=null,newWidth:uint=0,newHeight:uint=0) 
			{
				
				gfx = [];
				
				var p:Point = new Point();
				
				
				//if (states == 0) states = ALL_BUTTON_STATES;
				_states = resolveStates(bmd,width,height,sourceAlignment);
				
				
				var rect:Rectangle = new Rectangle(0, 0, width, height);
				
				var up_state_bmd:BitmapData = new BitmapData(width, height);
				if (sourceAlignment == ALIGNMENT_VERTICAL) rect.x = 0;
				else rect.y = 0;
				up_state_bmd.copyPixels(bmd, rect, p);
				
				if (scale9Rect!=null) gfx[UP_STATE] = new BitmapScale9(new Bitmap(up_state_bmd), scale9Rect, newWidth, newHeight);
				else gfx[UP_STATE] = new Bitmap(up_state_bmd);
				
				
				if ((_states & OVER_STATE) == OVER_STATE) {
					var over_state_bmd:BitmapData;
					over_state_bmd = new BitmapData(width, height);
					rect.x = width
					rect.y = height
					if (sourceAlignment == ALIGNMENT_VERTICAL) rect.x = 0;
					else rect.y = 0;
					over_state_bmd.copyPixels(bmd, rect, p);
					if (scale9Rect!=null) gfx[OVER_STATE] = new BitmapScale9(new Bitmap(over_state_bmd), scale9Rect, newWidth, newHeight);
					else gfx[OVER_STATE] = new Bitmap(over_state_bmd);
				}
				else gfx[OVER_STATE] = gfx[UP_STATE];
				

				if ((_states & DOWN_STATE) == DOWN_STATE) {
					var down_state_bmd:BitmapData
					down_state_bmd = new BitmapData(width, height);
					rect.x = width*2
					rect.y = height*2
					if (sourceAlignment == ALIGNMENT_VERTICAL) rect.x = 0;
					else rect.y = 0;
					down_state_bmd.copyPixels(bmd, rect, p);
					if (scale9Rect!=null) gfx[DOWN_STATE] = new BitmapScale9(new Bitmap(down_state_bmd), scale9Rect, newWidth, newHeight);
					else gfx[DOWN_STATE] = new Bitmap(down_state_bmd);
				} 
				else gfx[DOWN_STATE] = gfx[OVER_STATE];
				
				//Check bitmap height!!!
				
				if ((_states & DISABLED_STATE) == DISABLED_STATE) {
					var disabled_state_bmd:BitmapData
					disabled_state_bmd = new BitmapData(width, height);
					rect.x = width*3
					rect.y = height*3
					if (sourceAlignment == ALIGNMENT_VERTICAL) rect.x = 0;
					else rect.y = 0;
					disabled_state_bmd.copyPixels(bmd, rect, p);
					if (scale9Rect) gfx[DISABLED_STATE] = new BitmapScale9(new Bitmap(disabled_state_bmd), scale9Rect, newWidth, newHeight);
					else gfx[DISABLED_STATE] = new Bitmap(disabled_state_bmd);
				} 
				else gfx[DISABLED_STATE] = gfx[UP_STATE];
				
				

			}
			
			public function getState(state:uint):Bitmap {
				if (gfx[state]) {
					return gfx[state];
				}
				else return new Bitmap();
			}
			
			public static function resolveStates(bmd:BitmapData,sliceWidth:uint,sliceHeight:uint,stateAlignment:uint):uint {
				var maxStates:Number
				var bmdSize:uint;
				var stateSize:uint;
				if (stateAlignment == ALIGNMENT_HORIZONTAL) {
					bmdSize = bmd.width
					stateSize = sliceWidth;
				}
				else {
					bmdSize = bmd.height;
					stateSize = sliceHeight;
				}
				
				if ((bmdSize % stateSize) != 0) trace("***WARNING*** BitmapStateSlicer: bitmap size("+bmdSize+") is not in correlation with stateSize("+stateSize+")");
				maxStates = Math.floor(bmdSize / stateSize);
				var states:uint = UP_STATE;
				if (maxStates > 1) states += OVER_STATE;
				if (maxStates > 2) states += DOWN_STATE;
				if (maxStates > 3) states += DISABLED_STATE;
				return states;
			}
			
			public function hasState(state:uint):Boolean {
				return ((_states & state) == state)
			}
			
			public function get upState():Bitmap {return getState(UP_STATE);}
			public function get overState():Bitmap {return getState(OVER_STATE);}
			public function get downState():Bitmap {return getState(DOWN_STATE);}
			public function get hitTestState():Bitmap {return getState(UP_STATE);}
			public function get baseState():Bitmap {return getState(BASE_STATE);}
			public function get focusState():Bitmap { return getState(FOCUS_STATE); }
			public function get disabledState():Bitmap { return getState(DISABLED_STATE); }
			
			public static function getStateCount(states:uint):uint 
			{
				var c:uint = 1; // upstate is always there
				if ((states & OVER_STATE) == OVER_STATE) c++;
				if ((states & DOWN_STATE) == DOWN_STATE || (states & FOCUS_STATE) == FOCUS_STATE) c++;
				//if ((states & OVER_STATE) == OVER_STATE) c++;				if ((states & DISABLED_STATE) == DISABLED_STATE) c++;
				//if ((states & HITTEST_STATE) == HITTEST_STATE) c++;
				//if ((states & FOCUS_STATE) == FOCUS_STATE) c++;
				return c;
			}
			
	}
}