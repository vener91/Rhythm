// Scale9IconButton Class v1.8
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


	import flash.display.BitmapData;

	import flash.display.Sprite;


	import flash.geom.Rectangle;

	import com.nhe.gfx.BitmapStateSlicer;
	
	/**
	 * The Scale9IconButton extends the IconButton and makes buttons scalable. One image contains all states of an button (UP, OVER, DOWN, DISABLED), but only one portion of the image is shown. This component does not use masks, it copies pixels.
	 * <p>Events: all basic events</p>
	 * <p>Usage:
	 * <code>
	 * //get the bitmapdata for the button
	 * var img:BitmapData = new SettingsIcon();
	 * 
	 * //width and height of the area shown, not the size of the bitmap
	 * _button = new Scale9IconButton(img,27,24,300,24,new Rectangle(10,10,10,10));
	 * addChild(_button);
	 * _button.addEventListener(MouseEvent.CLICK,iconButton_CLICK);
	 * 
	 * </code>
	 * </p>
	 * 
	 */
	
	public class Scale9IconButton extends IconButton
	{
		
		
		private var _states:Array

		
		/**
		 * the contructor
		 * <code>_button = new Scale9IconButton(img,27,24,300,24,new Rectangle(10,10,10,10));</code>
		 * 
		 * @param bitmapData the graphics
		 * @param imageWidth width of the slice
		 * @param imageHeight height of the slice
		 * @param newWidth width of the visible part of the graphics. 
		 * @param newHeight height of the visible part of the graphics
		 * @param grid a rectangle defining the part of the image that is scaled. Rest of the image stays unscaled.
		 * @param sourceAlignment how are the different states aligned. Possible values are BitmapStateSlicer.ALIGNMENT_VERTICAL (default) or BitmapStateSlicer.ALIGNMENT_HORIZONTAL
		 * 
		 * @return nothing
		 *
		 */
		
		public function Scale9IconButton(bmd:BitmapData,imageWidth:uint,imageHeight:uint,newWidth:uint,newHeight:uint,grid:Rectangle,sourceAlignment:uint=0) 
		{
			super(null, 0, 0);
			
			if (bmd == null) return;
			
			setStates(new BitmapStateSlicer(bmd, imageWidth, imageHeight, sourceAlignment, grid,newWidth,newHeight));

		}
		

		
		
	}
	
}