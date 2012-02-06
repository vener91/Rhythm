// IconButton Class v1.8
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
package com.nhe.ui
{

	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.SimpleButton;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.utils.getDefinitionByName;
	import com.nhe.gfx.BitmapStateSlicer;
	
	/**
	 * The IconButton works like CSS sprites. One image contains all states of an button (UP, OVER, DOWN, DISABLED), but only one portion of the image is shown. This component does not use masks, it copies pixels.
	 * <p>Events: all basic events</p>
	 * <p>Usage:
	 * <code>
	 * //get the bitmapdata for the button
	 * var img:BitmapData = new SettingsIcon();
	 * 
	 * //width and height of the area shown, not the size of the bitmap
	 * _iconButton = new IconButton(img,27,24);
	 * addChild(_iconButton);
	 * _iconButton.addEventListener(MouseEvent.CLICK,iconButton_CLICK);
	 * 
	 * </code>
	 * </p>
	 * 
	 */
	public class IconButton extends SimpleButton
	{
		
		
		private var _disabled:Boolean = false;
		public var gfx:BitmapStateSlicer;
		
		/**
		 * the constructor
		 * <code>_iconButton = new IconButton(img,27,24);</code>
		 * 
		 * @param bitmapData the graphics
		 * @param width width of the visible part of the graphics
		 * @param height height of the visible part of the graphics
		 * @param sourceAlignment how are the different states aligned. Possible values are BitmapStateSlicer.ALIGNMENT_VERTICAL (default) or BitmapStateSlicer.ALIGNMENT_HORIZONTAL
		 * 
		 * @return nothing
		 *
		 */
		
		public function IconButton(bitmapData:BitmapData,width:uint,height:uint,sourceAlignment:uint=0) 
		{
			super();
			
			if (bitmapData == null) return;
			
			setStates(new BitmapStateSlicer(bitmapData, width, height, sourceAlignment));
			
			
		}
		
		public function setStates(gfx:BitmapStateSlicer):void 
		{
			super.upState = gfx.upState
			super.overState= gfx.overState
			super.downState= gfx.downState
			super.hitTestState = gfx.hitTestState
			
			this.gfx = gfx;
			
		}
		
		/**
		 * returns the value of disabled
		 * 
		 * @return true, if button is currently disabled
		 *
		 */
		
		public function get disabled():Boolean { return _disabled; }
		
		/**
		 * disables the button
		 * <code>_iconButton.disabled = true</code>
		 * 
		 * @return nothing
		 *
		 */
		
		public function set disabled(value:Boolean):void 
		{
			_disabled = value;
			if (_disabled) {
				super.enabled = false;
				super.upState = gfx.disabledState;
			}
			else {
				super.enabled = true;
				super.upState = gfx.upState;
			}
		}
		

		
	}
	
}