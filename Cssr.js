// The MIT License (MIT)

// Copyright (c) 2013 Azad Ratzki

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
var Cssr;
(function (Cssr) {
    var regex = new RegExp("var ([A-Za-z0-9]+) = (.+);", "g");
    var cssRegex = new RegExp("([^{]+)\s*\{\s*([^}]+)\s*}", "g");
    var variables = {
    };
    var sheets = [];
    var rules = [];
    Cssr.Variables = {
    };
    function addVariableHelper(name) {
        Object.defineProperty(Cssr.Variables, name, {
            get: function () {
                var returnVal = null;
                rules.forEach(function (r) {
                    if(r[name]) {
                        var val = r[name];
                        returnVal = val[0].getValue();
                        return false;
                    }
                });
                return returnVal;
            },
            set: function (value) {
                rules.forEach(function (r) {
                    if(r[name]) {
                        var val = r[name];
                        val.forEach(function (obj) {
                            obj.changeProperty(value);
                        });
                        return;
                    }
                });
            },
            enumerable: true,
            configurable: true
        });
    }
    var VariableContainer = (function () {
        function VariableContainer(Rule, Sheet, Property) {
            this.Rule = Rule;
            this.Sheet = Sheet;
            this.Property = Property;
        }
        VariableContainer.prototype.changeProperty = function (value) {
            this.Rule.style.setProperty(this.Property, value);
        };
        VariableContainer.prototype.getValue = function () {
            return this.Rule.style.getPropertyValue(this.Property);
        };
        return VariableContainer;
    })();    
    function addVariable(name, value) {
        variables[name] = value;
    }
    Cssr.addVariable = addVariable;
    function removeVariable(name) {
        delete variables[name];
    }
    Cssr.removeVariable = removeVariable;
    function changeVariable(name, value) {
        rules.forEach(function (r) {
            if(r[name]) {
                var val = r[name];
                val.forEach(function (obj) {
                    obj.changeProperty(value);
                });
            }
        });
    }
    Cssr.changeVariable = changeVariable;
    function parse(elements) {
        var i = elements.length;
        while(i--) {
            var element = elements.item(i);
            var text = element.textContent;
            var originalText = text;
            var variableText = text.match(/\/\*Cssr.*[\s\S]*\*\//)[0];
            text = text.replace(variableText, "");
            var m = variableText.match(regex);
            m.forEach(function (s) {
                regex.lastIndex = 0;
                var matches2 = regex.exec(s);
                var variableName = matches2[1];
                if(!variables[variableName]) {
                    var value = matches2[2];
                    variables[variableName] = value;
                }
            });
            resolveVariables();
            text = parseInheritance(text);
            var newText = text;
            Object.keys(variables).forEach(function (key) {
                var cleanVar = cleanVariable(variables[key]);
                text = text.replace(new RegExp("@" + key, "g"), cleanVar);
            });
            element.parentNode.removeChild(element);
            var styleElement = document.createElement("style");
            styleElement.setAttribute("data-cssr", "true");
            styleElement.innerHTML = variableText + text;
            styleElement.onload = function () {
                rules.push(identifyRules(styleElement.sheet, newText, variables));
            };
            var head = document.getElementsByTagName("head")[0];
            head.appendChild(styleElement);
        }
    }
    function parseInheritance(originalText) {
        var val = cssRegex.exec(originalText);
        var currentValues = {
        };
        while(val !== null) {
            var fullText = val[0];
            var selector = val[1].trim();
            var values = val[2].trim();
            currentValues[selector.replace(".", "")] = values;
            val = cssRegex.exec(originalText);
        }
        cssRegex.lastIndex = 0;
        val = cssRegex.exec(originalText);
        while(val != null) {
            var fullText = val[0];
            var selector = val[1].trim();
            var values = val[2].trim();
            var inheritanceChain = selector.match(/ @.*$/);
            if(inheritanceChain !== null) {
                var names = inheritanceChain[0];
                selector = selector.replace(names, "");
                var inheritanceChain2 = names.replace("@", "").trim();
                var inheritance = inheritanceChain2.split("|");
                inheritance.forEach(function (className) {
                    if(currentValues[className]) {
                        values = currentValues[className] + "\n" + values.replace(/\t/g, "");
                        values = values.replace(/\s+/g, "").replace(/;/g, ";\n\t\t");
                    }
                });
                var newVal = "\n\t" + selector + "\n\t{\n\t\t" + values + "\n\t}\n";
                currentValues[selector.replace(".", "")] = values;
                cssRegex.lastIndex = originalText.indexOf(fullText) + newVal.length;
                originalText = originalText.replace(fullText, newVal);
            }
            val = cssRegex.exec(originalText);
        }
        return originalText;
    }
    function identifyRules(sheet, originalText, variables) {
        cssRegex.lastIndex = 0;
        var rules = {
        };
        var keys = Object.keys(variables);
        var val = cssRegex.exec(originalText);
        var names = [];
        while(val !== null) {
            var fullText = val[0];
            var selector = val[1].trim();
            keys.forEach(function (key) {
                var keyReg = new RegExp("(.*):[\s\S]*@" + key, "g");
                if(fullText.indexOf("@" + key) > 0) {
                    var i = sheet.cssRules.length;
                    while(i--) {
                        var rule = sheet.cssRules.item(i);
                        if(rule.selectorText == selector) {
                            var properties = null;
                            if(rules[key]) {
                                properties = rules[key];
                            } else {
                                properties = [];
                            }
                            var propertyArr = keyReg.exec(fullText);
                            while(propertyArr != null) {
                                properties.push(new VariableContainer(rule, sheet, propertyArr[1].trim()));
                                addVariableHelper(key);
                                propertyArr = keyReg.exec(fullText);
                            }
                            rules[key] = properties;
                        }
                        keyReg.lastIndex = 0;
                    }
                }
            });
            val = cssRegex.exec(originalText);
        }
        return rules;
    }
    function cleanVariable(variable) {
        return variable.replace(/'/g, "").replace(/\"/g, "");
    }
    function resolveVariables(variableName) {
        var val = null;
        if(!variableName) {
            Object.keys(variables).forEach(function (name) {
                resolveVariables(name);
            });
            return null;
        } else {
            val = (variables[variableName]);
            if(!val) {
                throw "Can't find variable " + variableName;
            }
            var valVariableNames = getVariableNames(val);
            valVariableNames.forEach(function (n) {
                val = val.replace("@" + n, resolveVariables(n));
            });
            try  {
                val = "\"" + eval(val) + "\"";
            } catch (err) {
            }
            if(val === null) {
                throw "Can't find variable";
            }
            variables[variableName] = val;
            return val;
        }
    }
    function getVariableNames(variableValue) {
        var reg = new RegExp("@([a-zA-Z_$][0-9a-zA-Z_$]*)", "g");
        var val = reg.exec(variableValue);
        var names = [];
        while(val !== null) {
            names.push(val[1]);
            val = reg.exec(variableValue);
        }
        return names;
    }
    function apply() {
        parse(document.querySelectorAll("style"));
    }
    Cssr.apply = apply;
    if(document.readyState === "complete") {
        Cssr.apply();
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            Cssr.apply();
        });
    }
})(Cssr || (Cssr = {}));
//@ sourceMappingURL=Cssr.js.map
