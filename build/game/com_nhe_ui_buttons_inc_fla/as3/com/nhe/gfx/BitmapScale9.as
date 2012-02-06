// BitmapScale9 Class v1.8
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
import flash.display.DisplayObjectContainer;
import flash.geom.ColorTransform;
import flash.geom.Matrix;
import flash.geom.Rectangle;
public class BitmapScale9 extends Bitmap
{
	/**
	 * The BitmapScale9 scales bitmaps like the scale9 scales vectors
	 */

	public function BitmapScale9(bitmap:Bitmap,grid:Rectangle,width:uint,height:uint) 
	{
		
		

		
		grid.x = Math.floor(grid.x);
		grid.y = Math.floor(grid.y);
		grid.height = Math.floor(grid.height);
		grid.width = Math.floor(grid.width);
		
		var slices:Array = createSlices(bitmap, grid)
		
		var bmd:BitmapData 
		
		if (width == bitmap.width && height == bitmap.height) bmd = bitmap.bitmapData //NO NEED TO DRAW
		else bmd = draw(bitmap,grid,slices,width,height);
		
		
		super(bmd);
		
	}
	
	public function draw(bitmap:Bitmap,grid:Rectangle,slices:Array,width:uint,height:uint):BitmapData
	{
		var result:BitmapData = new BitmapData(width, height, true, 0x00000000);
		var matrix:Matrix = new Matrix();
		
		//drawn bitmap cannot be smaller than sum of outer slices width or height
		if ((bitmap.width - grid.width) > width) {
			trace("****WARNING*** BitmapScale9 width is too large. Shrinking...");
			width = bitmap.width-grid.width;
		}
		if ((bitmap.height - grid.height) > height) {
			trace("****WARNING*** BitmapScale9 height is too large. Shrinking...");
			height = bitmap.height - grid.height;
		}
		
		
		//LEFT SLICES
		
		var slice:BitmapData = new BitmapData(grid.x, grid.y, true, 0x00000000);
		result.draw(slices[0]);
		
		if((height - bitmap.height + grid.height) > 0){
			slice = new BitmapData(grid.x, height - bitmap.height + grid.height, true, 0x00000000);
			matrix.identity();
			matrix.scale(1, slice.height/grid.height)
			slice.draw(slices[3], matrix);
			matrix.identity();
			matrix.translate(0,grid.y)
			result.draw(slice, matrix, null, null, null, true); //MC
		}
		slice= new BitmapData(grid.x, height-grid.y+grid.height, true, 0x00000000);
		matrix.identity();
		slice.draw(slices[6], matrix);
		matrix.identity();
		matrix.translate(0,grid.y+height - bitmap.height + grid.height)
		result.draw(slice, matrix);
		
		//MIDDLE SLICES
		
		if ((width - bitmap.width + grid.width) > 0)
		{
			
				slice = new BitmapData(width - bitmap.width + grid.width, grid.y, true, 0x00000000);
				
				matrix.identity();
				matrix.scale(slice.width/grid.width, 1)
				slice.draw(slices[1], matrix);
				matrix.identity();
				matrix.translate(grid.x,0)
				result.draw(slice, matrix, null, null, null, true);
				
				slice = new BitmapData(width - bitmap.width + grid.width, height - bitmap.height + grid.height, true, 0x00000000);
				matrix.identity();
				matrix.scale(slice.width/grid.width, slice.height/grid.height)
				slice.draw(slices[4], matrix);
				matrix.identity();
				matrix.translate(grid.x,grid.y)
				result.draw(slice, matrix, null, null, null, true); //MC
				
				slice= new BitmapData(width - bitmap.width + grid.width, height-grid.y+grid.height, true, 0x00000000);
				matrix.identity();
				matrix.scale(slice.width/grid.width, 1)
				slice.draw(slices[7], matrix);
				matrix.identity();
				matrix.translate(grid.x,grid.y+height - bitmap.height + grid.height)
				result.draw(slice, matrix, null, null, null, true);
		}
	
		//RIGHT SLICES
		slice = new BitmapData(bitmap.width - grid.x - grid.width + width - bitmap.width+grid.width, grid.y, true, 0x00000000);
		
		matrix.identity();
		slice.draw(slices[2], matrix);
		matrix.identity();
		matrix.translate(grid.x + grid.width+width - bitmap.width,0)
		result.draw(slice, matrix); //MC
		
		if((height - bitmap.height + grid.height)>0) {
			slice = new BitmapData(bitmap.width-grid.x-grid.width+width - bitmap.width+grid.width, height - bitmap.height + grid.height, true, 0x00000000);
			matrix.identity();
			matrix.scale(1, slice.height/grid.height)
			slice.draw(slices[5], matrix);
			matrix.identity();
			matrix.translate(grid.x+width - bitmap.width + grid.width,grid.y)
			result.draw(slice, matrix, null, null, null, true); //MC
		}
		slice= new BitmapData(bitmap.width-grid.x-grid.width+width - bitmap.width+grid.width, height-grid.y+grid.height, true, 0x00000000);
		matrix.identity();
		slice.draw(slices[8], matrix);
		matrix.identity();
		matrix.translate(grid.x+width - bitmap.width + grid.width,grid.y+height - bitmap.height + grid.height)
		result.draw(slice, matrix);
		
		return result;
		
	}
	
	public function createSlices(bitmap:Bitmap,grid:Rectangle):Array
	{
		
			var matrix:Matrix;
			var slices:Array = new Array();
			
			var rightClip:Number = (grid.x + grid.width);
			var bottomClip:Number = (grid.y + grid.height);
			
			slices[0] = new BitmapData(grid.x, grid.y, true, 0x00000000);
			matrix = new Matrix(); slices[0].draw(bitmap, matrix);
			
			slices[1] = new BitmapData(grid.width, grid.y, true, 0x00000000);
			matrix = new Matrix(); matrix.translate(-grid.x,0); slices[1].draw(bitmap,matrix);
			//identity	()	
			slices[2] = new BitmapData(bitmap.width - rightClip, grid.y, true, 0x00000000);
			matrix = new Matrix(); matrix.translate(-rightClip,0); slices[2].draw(bitmap,matrix);
			
			slices[3] = new BitmapData(grid.x, grid.height, true, 0x00000000);
			matrix = new Matrix(); matrix.translate(0,-grid.y); slices[3].draw(bitmap,matrix);
			slices[4] = new BitmapData(grid.width, grid.height, true, 0x00000000);
			matrix = new Matrix(); matrix.translate(-grid.x,-grid.y); slices[4].draw(bitmap,matrix);
			slices[5] = new BitmapData(bitmap.width - rightClip, grid.height, true, 0x00000000);
			matrix = new Matrix(); matrix.translate(-rightClip,-grid.y); slices[5].draw(bitmap,matrix);
			
			slices[6] = new BitmapData(grid.x, bitmap.height - bottomClip, true, 0x00000000);
			matrix = new Matrix(); matrix.translate(0,-bottomClip); slices[6].draw(bitmap,matrix);
			slices[7] = new BitmapData(grid.width, bitmap.height - bottomClip, true, 0x00000000);
			matrix = new Matrix(); matrix.translate(-grid.x,-bottomClip); slices[7].draw(bitmap,matrix);
			slices[8] = new BitmapData(bitmap.width - rightClip, bitmap.height - bottomClip, true, 0x00000000);
			matrix = new Matrix(); matrix.translate( -rightClip, -bottomClip); slices[8].draw(bitmap, matrix);
			
			for (var i = 0; i < slices.length; i++)
			{
				//trace(i+" w:"+slices[i].width)
				//trace(i+" h:"+slices[i].height)
			}
			return slices;
		
	}


}
}