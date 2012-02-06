// Utils Class v4.9
//
// released under MIT License (X11)
// http://www.opensource.org/licenses/mit-license.php
//
// Author: Niko Helle
// http://www.nikohelle.net

/*
Copyright (c) 2008 Niko Helle

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


package com.nhe.utils
{
	
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.DisplayObject;
	import flash.display.DisplayObjectContainer;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.net.navigateToURL;
	import flash.net.URLRequest;
	import flash.net.URLRequestMethod;
	import flash.net.URLVariables;	
	import flash.text.Font;
	import flash.text.StyleSheet;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import flash.utils.describeType;
	import flash.utils.getQualifiedClassName;
	
	import flash.system.ApplicationDomain;
	import flash.utils.getDefinitionByName;
	import mx.formatters.DateFormatter

	/**
	 * The Utils class includes several helper methods
	 * All methods are static
	 */
	
    public class Utils
    {
		/**
		 * Opens an url to a window
		 * <code>Utils.getURL().addData("http://nikohelle.net","_blank")</code>
		 * 
		 * @param url
		 * @param window "_blank","_self" or "_top"
		 * 
		 * @return nothing
		 *
		 */
        public static function getURL(url:String,window:String="_self") :void
        {
				
				var request:URLRequest = new URLRequest(url);
				
				
				navigateToURL(request, window);
        }
	   
		/**
		 * Gets an asset from the library of the main swf or, if supplied, any other swf
		 * <code>Utils.getAsset("Ball")</code>
		 * 
		 * @param className Class name of the asset
		 * @param sourceSWF DisplayObject whose library to use. If null, current swf is used
		 * 
		 * @return new instance of the asset
		 *
		 */
		
		public static function getAsset(className:String,sourceSWF:DisplayObject=null):*
		{
			
			var c:Class = Utils.getClass(className,sourceSWF);
			return new c();
		};
		
		/**
		 * Gets a reference of the required class from the main swf or, if supplied, any other swf
		 * <p>The supplied external swf must be loaded in its own the Application domain
		 * <code>
		 * var request:URLRequest = new URLRequest(url);
		 * var loader = new Loader();
		 *		
		 * loader.contentLoaderInfo.addEventListener(Event.COMPLETE, loader_COMPLETE);
		 * var context:LoaderContext = new LoaderContext();
		 * context.applicationDomain = new ApplicationDomain();
		 * loader.load(request, context);
		 * addChild(loader);
		 * </code>
		 * 
		 * @param	className Class name of the asset
		 * @param	sourceSWF DisplayObject whose library to use. If null, current swf is used
		 * @return	reference of the class
		 */
		
		public static function getClass(className:String,sourceSWF:DisplayObject=null):Class
		{
			var c:Class;
			if (sourceSWF != null) {
				var appDomain:ApplicationDomain = sourceSWF.loaderInfo.applicationDomain;
				c = Class(appDomain.getDefinition(className));
			}
			else c = Class(getDefinitionByName(className));
			return c;
		};
		
		/**
		 * Strips tags from given string
		 * <code>Utils.stripTags("<p>Hello World</p>")</code>
		 * 
		 * @param str
		 * 
		 * @return new string without tags
		 *
		 */
		
		public static function stripTags(s:String):String {
			 return s.replace(/(<([^>]+)>)/ig,"");
		}
		
		/**
		 * Validates an url
		 * <code>Utils.isValidURL("http://nikohelle.com")</code>
		 * 
		 * @param str
		 * 
		 * @return True if given string is a valid url
		 *
		 */
		
		public function isValidURL(url:String){
		
			var tester:RegExp = /^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([,-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([,-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([,-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/; 
			return tester.test(url);
		}
		
		/**
		 * Computes and returns the angle of the point y/x in radians, when measured counterclockwise from a circle's x axis (where 0,0 represents the center of the circle).
		 * <code>Utils.angle(1,4)</code>
		 * 
		 * @param x the x coordinate of the point
		 * @param y the y coordinate of the point
		 * 
		 * @return the angle in radians
		 *
		 */
		
		public static function angle(x:Number, y:Number):Number
		{	
			
			return Math.atan2(y,x);
		}
		
		/**
		 * Rotates a point around the center (0,0)
		 * <code>Utils.rotatePoint(1,1,1)</code>
		 * 
		 * @param x the x coordinate of the point
		 * @param y the y coordinate of the point
		 * @param angle the angle in radians
		 * 
		 * @return True if given string is a valid url
		 *
		 */
		
		public static function rotatePoint(x:Number, y:Number,angle:Number):Point
		{	
			var nx:Number = Math.cos(angle) * x - Math.sin(angle) * y;
			var ny:Number  = Math.sin(angle) * x  + Math.cos(angle) * y;
			
			return new Point(nx, ny);
		}
		
		/**
		 * Calculates the angle between 2 vectors
		 * <code>Utils.getVectorAngle(1,1,10,10)</code>
		 * 
		 * @param ax the x coordinate of the first point
		 * @param ay the y coordinate of the first point
		 * @param bx the x coordinate of the second point
		 * @param by the y coordinate of the second point
		 * 
		 * @return the angle in radians
		 *
		 */
		
		public static function getVectorAngle(ax:Number, ay:Number,bx:Number,by:Number):Number
		{	
			
			var la:Number = Math.sqrt(ax*ax+ay*ay);
			var lb:Number = Math.sqrt(bx*bx+by*by);
			var ab:Number = ax * bx + ay * by;
			
			return Math.acos(ab / (la * lb));

			
		}
		
		/**
		 * Calculates the distance between 2 points
		 * <code>Utils.getDistance(1,1,10,10)</code>
		 * 
		 * @param x the x coordinate of the first point
		 * @param y the y coordinate of the first point
		 * @param x2 the x coordinate of the second point
		 * @param y2 the y coordinate of the second point
		 * 
		 * @return the distance
		 *
		 */
		
		public static function getDistance(x:Number, y:Number,x2:Number, y2:Number):Number
		{	
			
			return Math.sqrt((x2-x)*(x2-x)+(y2-y)*(y2-y));
		}
		
		/**
		 * Converts ARGB values to HEX
		 * <code>Utils.ARGBtoHEX(1,1,1,0)</code>
		 * 
		 * @param a the alpha component
		 * @param r the red component
		 * @param g the green component
		 * @param b the blue component
		 * 
		 * @return the color in hex
		 *
		 */

		public static function ARGBtoHEX(a,r,g,b):int {  
			
			return a << 24 | r << 16 | g << 8 | b;
		} 
		
		/**
		 * Converts HEX value to ARGB values that are stored in to an object
		 * <code>Utils.HEXtoARGB(12353)</code>
		 * 
		 * @param hex the hex value of the color
		 * 
		 * @return An object with properties alpha,red,green and blue
		 *
		 */
		
		public static function  HEXtoARGB(val:Number):Object
		{
			var col={}
			col.alpha = (val >> 24) & 0xFF
			col.red = (val >> 16) & 0xFF
			col.green = (val >> 8) & 0xFF
			col.blue = val & 0xFF
			return col
			

		}	
		
		/**
		 * Converts HEX value to  string presentation of ARGB
		 * <code>Utils.HEXtoARGBString(12353)</code>
		 * 
		 * @param hex the hex value of the color
		 * 
		 * @return string presentation of the color
		 *
		 */
		
		public static function  HEXtoARGBString(val:Number):String
		{

			return (((val>>24) != 0)?Number(val>>>24).toString(16):"00")+Number(val&0xFFFFFF).toString(16);
		}
		
		
		/**
		 * Clones a bitmap
		 * <code>Utils.cloneBitmap(bitmap)</code>
		 * 
		 * @param Bitmap to be cloned
		 * 
		 * @return new bitmap
		 *
		 */
		
		public static function cloneBitmap(original:Bitmap):Bitmap {
            return new Bitmap(original.bitmapData.clone());
        }
		
		/**
		 * Removes all children of a DisplayObjectContainer
		 * <code>Utils.cloneBitmap(container)</code>
		 * 
		 * @param container with children
		 * 
		 * @return nothing
		 *
		 */
		
		public static  function removeChildren (container:DisplayObjectContainer):void
		{
			while (container.numChildren)
			{
				container.removeChildAt(0);
			}
		}
		
		/**
		 * Traces all fonts in the swf
		 * <code>Utils.traceFonts()</code>
		 * 
		 * @return nothing
		 *
		 */
		
		public static  function traceFonts ():void
		{
			var fontList:Array = Font.enumerateFonts();
			var j:int = -1;
			while(++j<fontList.length)
			{
				trace( "font: " + fontList[j].fontName );
			}
			
		}
		
		
		/**
		 * Traces all properties of an object
		 * <code>Utils.traceObject(obj,"This object has value ")</code>
		 * 
		 * @param object the object
		 * @param prefix Prefix in the trace. "This object has value " traces "This object has value x"
		 * @return nothing
		 *
		 */
		
		public static function traceObject(object:*,prefix:String="") {
			if (!object) return;
			for (var o in object) {
				if (!object[o]) trace(prefix+o+"=" + object[o]);
				else trace(prefix+o+"=" + object[o].toString());
			}
		}
		
		/**
		 * Checks if a font exists
		 * <code>Utils.hasFont("Arial")</code>
		 * 
		 * @param font name of the font
		 * 
		 * @return true, if exits
		 *
		 */
		
		public static  function hasFont(fontName:String):Boolean
		{
			var fontList:Array = Font.enumerateFonts();
			var j:int = -1;
			while(++j<fontList.length)
			{
				if (fontList[j].fontName == fontName) return true;
			}
			
			return false;
		}
		
		/**
		 * Trims a number with too many decimals
		 * <code>Utils.cutDesimals(3.1431234,3)</code>
		 * 
		 * @param value the number
		 * @param decimals the number of decimals
		 * 
		 * @return new trimmed number
		 *
		 */

		public static function cutDesimals(value:Number,decimals:uint):Number
		{
			if (decimals == 0) return value;
			var m:uint = Math.pow(10, decimals);
			value = Math.round(value * m);
			value = value / m;
			return value;
		}
		
		/**
		 * Repeats a string n times
		 * <code>Utils.repeatString("hey",3)</code>
		 * 
		 * @param str repeated string
		 * @param count number of repetitions
		 * 
		 * @return new string
		 *
		 */
		
		public static function repeatString(string:String,count:uint):String
		{
			var j = 0;
			var ret:String = string;
			while (++j < count) {
				ret += string;
			}
			
			return ret;
		}
		
		/**
		 * Converts a string presentation of a rectangle back to a Rectanglea
		 * <code>Utils.repeatString("1,2,400,300")</code>
		 * 
		 * @param value the string presentation of a rectangle
		 * 
		 * @return new Rectangle
		 *
		 */
		
		public static function stringToRectangle(value:String):Rectangle
		{
			var v:Array = value.split(",");
			if (v.length < 4) return new Rectangle();
			else return new Rectangle(uint(v[0]),uint(v[1]),uint(v[2]),uint(v[3]));
		}
		
		/**
		 * Checks if a rectange is in another rectangle
		 * <code>Utils.repeatString(testedRectangle,biggerRectangle)</code>
		 * 
		 * @param the smaller rectangle to test
		 * @param the rectangle that could contain the smaller rectangle
		 * 
		 * @return true, if rectangle is in rectangle
		 *
		 */
		
		public static function rectangeFitsInRectangle(smaller:Rectangle,larger:Rectangle):Boolean
		{
			return larger.union(smaller).equals(larger);
		}
		
		/**
		 * returns a part of of string presentation of an array
		 * <code>Utils.repeatString("green,blue,red",2)</code>
		 * 
		 * @param string the string with a delimeter
		 * @param delimeter the delimeter
		 * @param part the part of the string to return
		 * 
		 * @return true, if rectangle is in rectangle
		 *
		 */
		
		public static function getPartOfArrayString(string:String,delimeter:String,part:uint):String
		{
			var v:Array= string.split(delimeter);
			if (part >= v.length) return null;
			return v[part];
		}
		
		
		public static function dropEndOfArrayString(string:String,delimeter:String):String
		{
			var v:Array= string.split(delimeter);
			if(v.length ==1 )return null;
			v.pop();
			return v.join(delimeter);
		}
		
		/**
		 * Combines two textformats
		 * <code>Utils.combineTextFormats(textFormat1,textFormat2)</code>
		 * 
		 * @param textFormat1 the primary textformat, whose properties are not overwritten if exits in textFormat2
		 * @param textFormat1 the secondary textFormat, whose properties are added to the primary if they do not exits
		 * 
		 * @return new Textformat
		 *
		 */
		
		public static function combineTextFormats(primary:TextFormat,secondary:TextFormat):TextFormat
		{
			var tf:TextFormat = new TextFormat();
			
			if (!primary && !secondary) return new TextFormat();
			if (!secondary) return primary;
			if (!primary) return secondary;
			
			
			var description:XML = describeType(primary);
			var val:String;
			for (var p in description..accessor) {
				val = description..accessor[p].@name.toXMLString();
				tf[val] = primary[val] ? primary[val] : secondary[val];
				
				//trace(val+"="+primary[val]+"/"+secondary[val]+"="+tf[val])
			
				//trace(description..accessor[p].@name.toXMLString()+"="+transformedStyle[description..accessor[p].@name.toXMLString()]);
			}
			
			return tf;
		}
		
		/**
		 * Converts a StyleSheet to a new textformat, or appends styles to an existing TextFormat
		 * <code>Utils.textFormatFromCSS(css,style,textformat)</code>
		 * 
		 * @param css the StyleSheet
		 * @param style the style to convert
		 * @param appendTo the textformat to optionally append the style
		 * 
		 * @return new Textformat or the given textformat
		 *
		 */
		
		public static function textFormatFromCSS(css:StyleSheet,styleName:String,appendTo:TextFormat=null):TextFormat
		{
			var hasTF:Boolean = (appendTo != null);
			if(!appendTo) appendTo = new TextFormat();
			
			var style = css.getStyle(styleName);
			if (style == null) return appendTo;
			
			if (!hasTF) return css.transform(style);
			
			//var transformedStyle:TextFormat = css.transform(style);
			
			return Utils.combineTextFormats(css.transform(style), appendTo);
			
		}
		
		/**
		 * Converts properties of an object to a new textformat, or appends styles to an existing TextFormat
		 * <code>Utils.textFormatFromCSS(css,style,textformat)</code>
		 * 
		 * @param style an object with same properties as a textformat
		 * @param appendTo the textformat to optionally append the style
		 * 
		 * @return new Textformat or the given textformat
		 *
		 */
		
		public static function textFormatFromObject(style:Object,appendTo:TextFormat=null):TextFormat
		{
			if(!appendTo) appendTo = new TextFormat();
			
			var description:XML = describeType(appendTo);
			var val:String;
			for (var p in description..accessor) {
				val = description..accessor[p].@name.toXMLString();
				if (style[val]) appendTo[val] = style[val];

			}
			
			return appendTo;
		}
		
		/**
		 * combines two objects and returns a new object or appends values to the primary object
		 * <code>Utils.combineObjects(primary,secondary,true)</code>
		 * 
		 * @param primary the object to append properties or the object whose values override values of the secondary object 
		 * @param secondary the object whose properties are added to the primart if properties don't exist 
		 * 
		 * @return new object or the primary object with new properties
		 *
		 */
		
		public static function combineObjects(primary:*,secondary:*,addToPrimary:Boolean=false):*
		{
			var o:*
			if (addToPrimary) o = primary;
			else o = { };
			
			if (!primary && !secondary) return null;
			if (!primary) return secondary;
			if (!secondary) return primary;
			
			for (var p in secondary) {
				if (addToPrimary && o[p]) continue; 
				o[p] = secondary[p];
			}
			
			if (addToPrimary) return primary;
			
			for (p in primary) {
				o[p] = primary[p];
			}
			
			return o;
		}
		
		
		/**
		 * returns the bounds of a display object with non-transparent pixels
		 * <code>Utils.getTruePixelSize(target)</code>
		 * 
		 * @param target a DisplayObject
		 * 
		 * @return a rectangle
		 *
		 */
		
		public static function getTruePixelSize(target:DisplayObject):Rectangle
		{
			var bmd:BitmapData = new BitmapData(target.width, target.height,true,0x00000000);
			bmd.draw(target);
			var rec:Rectangle = bmd.getColorBoundsRect(0xFF000000, 0, false);
			bmd.dispose();
			bmd = null;
			//trace("getTextFieldAutoPadding rec=" + rec);
			
			return rec;
			
			//return {top:rec.top,right:(textfield.width-rec.right),bottom:(textfield.height-rec.bottom),left:rec.left}
		}
		
		/**
		 * returns the bounds of a display object with non-transparent pixels
		 * <code>Utils.getClassName(target)</code>
		 * 
		 * @param object
		 * 
		 * @return the class name
		 *
		 */
		
		public static function getClassName(target:*):String
		{
			var c:String = getQualifiedClassName(target);
			if (c.indexOf("::") == -1) return c;
			return c.substr(c.indexOf("::")+2)
			
			//return {top:rec.top,right:(textfield.width-rec.right),bottom:(textfield.height-rec.bottom),left:rec.left}
		}
		
		/**
		 * runs through a class and converts its properties into an object
		 * <code>Utils.getObjectParameters(obj,true,false,false)</code>
		 * 
		 * @param obj the object to parse
		 * @param onlyWritable get only properties that are writable
		 * @param fullInfo if true, the returned array contains objecs with properties "type" (uint, String,..), "value" (value of the property), "name", "access" (readwrite,read,write). If "fullInfo" is false, the property contains only the value)
		 * @param indexWithNumber If false the an associative array: array[name of a property] = value of the property, otherwise index based. It does not make sense to have indexWithNumber=true and fullInfo = false as it returns only values.
		 * 
		 * @return an array of values or objects
		 *
		 */
		
		public static function getObjectParameters(object:*,onlyWritable:Boolean= false,fullInfo:Boolean=false,indexWithNumber:Boolean = false):Array
		{
				var description:XML = describeType(object);
				var arr:Array = [];
				var val:String;
				var type:String;
				var access:String;
				
				var o:Object
				var write:*;
				
				var props:XMLList = description..*.(name() == "accessor" || name() == "variable");

				
				for (var p in props) {
					/*trace("###p:"+props[p].@name)
					trace("###p:"+props[p].@access)
					trace("###p:"+props[p].@type)*/
					access = (props[p].@access) ? props[p].@access.toXMLString() : "readwrite";
					if (access == "") access = "readwrite";

					if (onlyWritable && access != "readwrite") continue;
					
					val = props[p].@name.toXMLString();
					type = props[p].@type.toXMLString();
					
					if (fullInfo) {
						o = { };
						o.type = type;
						o.value =  object[val];
						o.name = val;
						o.access = access;

					}
					
					if (indexWithNumber) {
						if (fullInfo) arr.push(o);
						else arr.push(val);
					}
					else {
						if (fullInfo) arr[val] = o;
						else arr[val] = object[val];
					}
				}
				return arr;

		}
		
		/**
		 * converts an class to an object, optionally adds parameters and returns a new object and optionally modifies the original object. The returned object contains ONLY properties with readwrite access! 
		 * <code>Utils.convertClassToObject(obj,true,newValues,false)</code>
		 * 
		 * @param obj the object to convert
		 * @param indexWithNumber If false the an associative array: array[name of a property] = value of the property, otherwise index based. 
		 * @param newValues An object containing new values to be added to the object. New properties are not added!
		 * @param modifyOriginal If true, the original object is modified. Returns an array in all cases
		 * 
		 * @return an array of values or objects
		 *
		 */
		
		public static function convertClassToObject(object:*,indexWithNumber:Boolean = false,newValues:Object=null,modifyOriginal:Boolean=true):Array
		{
			
			var description:XML = describeType(object);
			var arr:Array = [];
			var val:String;
			var type:String;
			var access:String;
			var o:Object
			var castingOk:Boolean
			
			//doc..*.(childIndex()==0 && /library|book/i.test(name())==false)
			
			var props:XMLList = description..*.(name() == "accessor" || name() == "variable");
			
			//trace("description:" + description);
			/*trace("props.len:" + props.length());
			trace("accessor.len:" + description..*.(name() == "accessor").length());
			trace("variable.len:" + description..*.(name() == "variable").length());*/
			
			for (var p in props) {
				
				val = props[p].@name.toXMLString();
				type = props[p].@type.toXMLString();
				access = (props[p].@access) ? props[p].@access.toXMLString() : "readwrite";
				if (access == "") access = "readwrite";
				//trace("val:" + val+" access:"+access);
				if (access != "readwrite") continue;
				o = { };
				o.type = type;
				o.value =  object[val];
				o.name = val;
				o.changed = false;
				
				//trace("val:" + val+" replace:"+newValues[val]);
				
				if (newValues && newValues[val]) {
					castingOk = true;
					//trace("val changing to:" + newValues[val]);
					switch (type) {
						case "uint":
							o.value = uint(newValues[val]);
							break;
						case "int":
							o.value = int(newValues[val]);
							break;
						case "Number":
							o.value = Number(newValues[val]);
							break;
						case "Boolean":
							o.value = Boolean(newValues[val]);
							break;
						case "String":
							o.value = String(newValues[val]);
							break;	
						default:
							if (typeof( newValues[val]) == type) o.value = newValues[val];
							else castingOk = false;
							break;
					}
					if (modifyOriginal && castingOk) {
						o.changed = true;
						object[val] = o.value;
					}
				}
				if (indexWithNumber) arr.push(o);
				else {
					arr[val] = o;
				}
			}
			return arr;
		}
		
		/**
		 * returns attributes of a XML element
		 * <code>Utils.getXMLAttributes(node)</code>
		 * 
		 * @param node the xml node
		 * @param indexWithNumber If false the an associative array: array[name of a property] = value of the property, otherwise index based. 
		 * 
		 * @return an array name
		 *
		 */
		
		public static function getXMLAttributes(node:XML,indexWithNumber:Boolean = false):Array
		{
			
			if (!node) return [];
			var attNamesList:XMLList = node.@* ;
			var arr:Array = [];
			var val:String;
			for (var i:int = 0; i < attNamesList.length(); i++)
			{ 
				val = attNamesList[i].name();
				if (indexWithNumber) arr.push(val);
				else arr[val] = attNamesList[i].toString()
				//trace("attr "+val+"=="+attNamesList[i].toString())
			} 

			return arr;
		}
		
		/**
		 * returns part of a XML, specified by a path
		 * <code>Utils.getXMLAttributes(xml,"root/people/admins")</code>
		 * 
		 * @param xml the xml
		 * @param path path to the element
		 * @param delimeter the delimeter of the steps on the path
		 * @return a XML
		 *
		 */
		
		public static function getXMLNodeByPath(xml:XML,path:String,delimeter:String="/"):XML
		{
			
			var p:Array = path.split(delimeter);
			
			if (p.length == 0) return null;
			
			var j:int = -1;
			while (++j < p.length) {
				if (xml[p[j]].length() == 0) return null;
				xml = xml[p[j]][0];
				
			}
			return xml;
		}
		
		/**
		 * formats a date to a string
		 * <code>Utils.formatDate(format,date)</code>
		 * 
		 * @param format output format as defined in DateFormatter Class
		 * @param date date to format
		 * @return a String
		 *
		 */
		
		public static function formatDate(str_dateFormat:String,date:Date=null):String
        {
			if (date == null) date = new Date();
            var f:DateFormatter = new DateFormatter();
            f.formatString = str_dateFormat;
            return f.format(date);
        }
		
		/**
		 * converts a url request to a string. Properties are added to the url like in a GET method: "url?p=1&p=2..."
		 * <code>Utils.URLRequestToString(request)</code>
		 * 
		 * @param request the URLRequest
		 *	
		 * @return a String
		 *
		 */
		
		public static function URLRequestToString(request:URLRequest):String
        {
			var ret:String = "";
			ret = request.url;
			if (request.data) ret += "?" + objectToURLString(request.data);
			return ret;
        }
		
		/**
		 * converts an object to a string presentation like in a GET mehod: "p=1&p=2..."
		 * <code>Utils.objectToURLString(object)</code>
		 * 
		 * @param object the object
		 *	
		 * @return a String
		 *
		 */
		
		public static function objectToURLString(object:*):String
        {
			var ret:String = "";
			if (object) {
				
				for (var v in object) {
					ret += v+"="+escape(object[v])+"&";
				}
				ret = ret.substr(0, ret.length - 1);
			}
			
			return ret;
        }
		
		/**
		 * checks if the SWF is running locally
		 * <code>Utils.isLocalSWF(someStageObject)</code>
		 * 
		 * @param someStageObject a DisplayObject that has been added to stage
		 *	
		 * @return true if local
		 *
		 */
		
		public static function isLocalSWF(someStageObject:DisplayObject):Boolean {
			// someStageObject = new Shape(); ???
			if (someStageObject.stage == null) return true;
			return (someStageObject.stage.loaderInfo.url.indexOf("file:") != -1)
		}

		/*
		 public function clone() : MyClass
		{
			var qualifiedClassName : String = getQualifiedClassName( this ).replace( "::", "." );
			var bytes : ByteArray = new ByteArray();
		
			registerClassAlias( qualifiedClassName, getDefinitionByName( qualifiedClassName ) as Class );
			bytes.writeObject( this );
			bytes.position = 0;
		
			return bytes.readObject() as MyClass;
		}
		*/
		
				
				
		/*public static function getFirstNonTransparentPixel( bmd:BitmapData ):Point
		{
		var hit_rect:Rectangle=new Rectangle(0,0,bmd.width,1);
		var p:Point = new Point();
		for( hit_rect.y = 0; hit_rect.y < bmd.height; hit_rect.y++ )
		{
		if( bmd.hitTest( p, 0x01, hit_rect) )
		{
		var hit_bmd:BitmapData=new BitmapData( bmd.width, 1, true, 0 );
		hit_bmd.copyPixels( bmd, hit_rect, p );
		return hit_rect.topLeft.add( hit_bmd.getColorBoundsRect(0xFF000000, 0, false).topLeft );
		}
		}
		return null;
		}*/


    }
}
