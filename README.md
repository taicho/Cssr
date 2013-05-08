Cssr (/ˈsiːzə/)
====

Cssr:  Run-time Dynamic CSS Engine

In addition to allowing the use of variables and inheritance, Cssr automatically creates a relationship between your variables and the StyleSheets within your document, allowing you to change the variables at run-time.


Usage
=======
Initialize Cssr by calling Cssr.apply() after the dom has loaded or on page load.

Note - variables MUST be declared inside of the /*Cssr */ comment in your style sheets.


Css Examples
==============

1. Variables - Simply add /*Cssr {variables here} */ to the top of your stylesheets.

    <style type="text/css">
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



2. Inheritance - Uses the following syntax {selector} @{inheritedClassName}(|{additionalClassName})


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