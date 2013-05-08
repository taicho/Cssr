Cssr (/ˈsiːzə/)
====

Cssr:  Run-time Dynamic CSS Engine

In addition to allowing the use of variables and inheritance, Cssr automatically creates a relationship between your variables and the StyleSheets within your document, allowing you to change the variables at run-time.


Usage
=======
Initialize Cssr by calling Cssr.apply() after the dom has loaded or on page load.

Note - variables MUST be declared inside of the /*Cssr */ comment in your style sheets.


Css Examples
============

1. Variables - Simply add /*Cssr {variables here} */ to the top of your stylesheets.

<pre><code>
        /*Cssr      
        var baseCalc = (100+30)-30;  
        var anotherCalc = (@baseCalc * 3) + "px";            
        var red = "rgba(255,0,0,1.0)";
        var green = "rgba(0,255,0,1.0)";
        var blue = "rgba(0,0,255,1.0)"
        */

        .my-div
        {
            background-color:@blue;
            width:@anotherCalc;
        }

        body
        {
            background:@green;
        }

    </style>     
</code></pre>


2. Inheritance - Uses the following syntax {selector} @{inheritedClassName}(|{additionalClassName})

<pre><code>
    <style type="text/css">
        /*Cssr      
        var baseCalc = (100+30)-30;  
        var anotherCalc = (@baseCalc * 3) + "px";            
        var redVariable = "rgba(255,0,0,1.0)";
        var greenVariable = "rgba(0,255,0,1.0)";
        var blueVariable = "rgba(0,0,255,1.0)"
        */

        .my-foreground
        {
    		color:@redVariable;
		}

		.my-background
		{
			background-color:@blueVariable;
		}

		/* Using inheritance */

        .my-div  @my-foreground
        {
        
        	background-color:@blue;
        	width:@anotherCalc;
        }

        .multiple-inheritance @my-foreground|my-background
        {
        	visibility:visible;
    	}

    </style>
</pre></code>

License
=======
The MIT License (MIT)

Copyright (c) 2013 Azad Ratzki

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

