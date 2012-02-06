// MultiIconButton Class v1.8
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
	//import flash.utils.getDefinitionByName;
	import com.nhe.gfx.BitmapStateSlicer;
	
	/**
	 * The MultiIconButton works like the IconButton and CSS sprites. One image contains all states of an button (UP, OVER, DOWN, DISABLED), but only one portion of the image is shown. This component does not use masks, it copies pixels.
	 * <p>MultiIconButton has many phases, so it can show different icons with different states</p>
	 * <p>Events: all basic events</p>
	 * <p>Usage:
	 * <code>
	 * //get the bitmapdata for the button
	 * var img:BitmapData = new SettingsIcon();
	 * 
	 * //width and height of the area shown, not the size of the bitmap
	 * _multiIconButton = new MultiIconButton(img,27,24);
	 * addChild(_multiIconButton);
	 * _multiIconButton.addEventListener(MouseEvent.CLICK,iconButton_CLICK);
	 * 
	 * //chage the phase
	 * _multiIconButton.phase = 1;
	 * 
	 * </code>
	 * </p>
	 * 
	 * @also com.nhe.ui.IconButton
	 */
	
	public class MultiIconButton extends IconButton
	{
		
		private var _sourceAlignment:uint = 0;
		private var _phaseAlignment:uint = 0;
		private var _phase:uint = 0;


		private var _phaseCount:uint;
		private var _states:uint;
		private var _bitmapData:BitmapData;
		
		/**
		 * the constructor
		 * <code>_iconButton = new IconButton(img,27,24);</code>
		 * 
		 * @param bitmapData the graphics
		 * @param width width of the visible part of the graphics
		 * @param height height of the visible part of the graphics
		 * @param sourceAlignment how are the different states aligned. Possible values are BitmapStateSlicer.ALIGNMENT_VERTICAL (default) or BitmapStateSlicer.ALIGNMENT_HORIZONTAL
		 * @param phaseAlignment how are the different phases aligned. Possible values are BitmapStateSlicer.ALIGNMENT_VERTICAL or BitmapStateSlicer.ALIGNMENT_HORIZONTAL (default) . If not set, it is the opposite of sourceAlignment
		 * 
		 * @return nothing
		 *
		 */
		
		public function MultiIconButton(bitmapData:BitmapData, width:uint, height:uint, sourceAlignment:uint = 0,phaseAlignment:int = -1) 
		{
			
			super(bitmapData.clone(), width, height, sourceAlignment);

			if (phaseAlignment == -1 && sourceAlignment == BitmapStateSlicer.ALIGNMENT_HORIZONTAL) phaseAlignment = BitmapStateSlicer.ALIGNMENT_VERTICAL;
			else if (phaseAlignment == -1 && sourceAlignment == BitmapStateSlicer.ALIGNMENT_VERTICAL) phaseAlignment = BitmapStateSlicer.ALIGNMENT_HORIZONTAL;
			_phaseAlignment = phaseAlignment;
			

			_sourceAlignment = sourceAlignment;	
			
			_bitmapData = bitmapData;
			
			if(_phaseAlignment == BitmapStateSlicer.ALIGNMENT_HORIZONTAL) _phaseCount = Math.ceil(_bitmapData.width/width)-1;
			if(_phaseAlignment == BitmapStateSlicer.ALIGNMENT_VERTICAL) _phaseCount = Math.ceil(_bitmapData.height/height)-1;
			
			_states = BitmapStateSlicer.resolveStates(_bitmapData,width,height,sourceAlignment);


		}
		
		/**
		 * returns the current phase.
		 * 
		 * @return current phase
		 *
		 */
		
		public function get phase():uint { return _phase; }
		
		
		/**
		 * changes the current phase. Values start from 0
		 * <code>_multiIconButton.phase = 1</code>
		 * 
		 * @return nothing
		 *
		 */
		
		public function set phase(value:uint):void 
		{
			_phase = value;
			if (_phase > phaseCount) _phase = phaseCount;
			
			//var ref:Class = getDefinitionByName(_linkageID) as Class;
			
			var refWidth:uint = super.upState.width;
			var refHeight:uint = super.upState.height;
			var stateCount:uint = BitmapStateSlicer.getStateCount(_states);
			if (_sourceAlignment == BitmapStateSlicer.ALIGNMENT_HORIZONTAL) refWidth *= stateCount;
			else refHeight *= stateCount;
			
			var full_bmd:BitmapData = _bitmapData.clone();
		
			var rect:Rectangle = new Rectangle(0, 0, refWidth, refHeight);
			
			
			if (_phaseAlignment == BitmapStateSlicer.ALIGNMENT_VERTICAL) rect.y = refHeight*_phase
			else rect.x = refWidth*_phase


			var p:Point = new Point();
			var bmd:BitmapData = new BitmapData(refWidth, refHeight);
			bmd.copyPixels(full_bmd, rect, p);
			//super.upState = new Bitmap(full_bmd);
			//super.setGFX(super.createStateGFX(bmd,super.upState.width,super.upState.height,_sourceAlignment,_states));
			super.setStates(new BitmapStateSlicer(bmd, super.upState.width, super.upState.height, _sourceAlignment));
			
			
			
		}
		
		public function get phaseCount():uint { return _phaseCount; }

		
	}
	
}