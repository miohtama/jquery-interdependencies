.. contents:: :local:

Introduction
---------------

**jQuery Interdependencies** is a Javascript library for
creating rules for form field interdependencies.
It is a helper library for building conditions telling
when fields are shown and hidden based on the values of the other fields on the same form.

Use simple Javascript based rules to express dependencies between different fields.

Example:

.. image :: https://github.com/downloads/miohtama/jquery-interdependencies/bacon.gif

Another, very complex, real-life example which led to building this library.
This one has a master ruleset and and one ruleset applied per dynamically added
subform:

.. image :: https://github.com/downloads/miohtama/jquery-interdependencies/mtd3.gif

See below for demo links.

Features
---------

* It is not limited to an input type, but works with all HTML controls: text, checkbox, radio button, select dropdown, etc.

* It correctly handles nested decision trees, where your form 1st level choice reveals 2nd level choices which in turn reveal 3rd level choices and so on

* Handle list values and multi-value comparisons (any of compared values, none of compared values)

* Independent of any backend code or HTML structure - you can use jQuery Interdependencies with any form library

* `API documentation <http://miohtama.github.com/jquery-interdependencies/docs/>`_ based on `JSDuck <https://github.com/senchalabs/jsduck/>`_

* Eager and robust error checking detecting your mistakes early as possible

* jQuery, compatible down to version jQuery 1.4

* Crafted with the state of the art Javascript best practices, from Finland with love

Demos
------

* `Minimal demo <http://miohtama.github.com/jquery-interdependencies/minimal.html>`_ (see code below)

* `Real-life example <http://miohtama.github.com/jquery-interdependencies/index.html>`_

* `API documentation <http://miohtama.github.com/jquery-interdependencies/docs/>`_

Installation
-------------

Put ``deps.js`` in your application.

The module is also available as ``jquery-interdependencies`` through `bower <http://twitter.github.com/bower/>`_.

How it works
-----------------

The architecture is based on jQuery plug-in and prototypial class patterns.

* You create a *Ruleset* which manages a form or a section of a form.
  The same ruleset can be applied for many forms or control selection; for example
  in a complex tabular like input the same ruleset can be applied for each row of the tabular form

* *Ruleset* has *Rule*s. *Rule* has a controller which is a HTML control (``<input>``, ``<select>``, etc.).
  When *Rule*'s controller matches *Rule* value in given condition, all widgets in this rule become visible.
  Widgets are added under the control of the rule using *Rule.include()* method.

* *Rule*s themselves can contain more nested rules. Nested rules are effective only when the parent rule
  is effective (the controls are visible).

Minimal example
-------------------

Below is an minimal example how to create a form ruleset with two rules.

::

    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
        </head>
        <body>

            <div class="container">

                <label>Diet</label>
                <select id="diet">
                    <option value="normal">Normal</option>
                    <option value="special">Special considerations</option>
                </select>

                <div id="special-diet" style="margin-left: 2em">
                    <label for="text">
                        What kind of considerations
                    </label>
                    <input type="text" id="text" />
                </div>

                <div>
                    <label>
                        <span>Stay in hotel?</span>
                        <input type="checkbox" id="accomodation">
                    </label>
                </div>

                <div id="adults" style="margin-left: 2em">
                    <label>Number of adults</label>
                    <input type="number" />
                </div>

                <div id="children" style="margin-left: 2em">
                    <label>Number of children (younger than 12-years-old)</label>
                    <input type="number" />
                </div>

            </div>

            <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
            <script src="deps.js"></script>
            <script>
                $(document).ready(function() {
                    // Start creating a new ruleset
                    var ruleset = $.deps.createRuleset();

                    // Show diet text input option only when special diet option is selected
                    var dietRule = ruleset.createRule("#diet", "==", "special");
                    dietRule.include("#special-diet");

                    // Make these fields visible when user checks hotel accomodation
                    var hotelRule = ruleset.createRule("#accomodation", "==", true);
                    hotelRule.include("#adults");
                    hotelRule.include("#children");

                    // Make the ruleset effective on the whole page
                    ruleset.install();
                });
            </script>
        </body>
    </html>


Compiling docs
---------------

Install jsduck::

     \curl -L https://get.rvm.io | bash -s stable --ruby --gems=jsduck
     source /Users/mikko/.rvm/scripts/rvm

Build docs::

    source /Users/mikko/.rvm/scripts/rvm
    make build-docs

Deploy docs::

    make publish-docs

Elsewhere
-----------

* `JSter <http://jster.net/library/jquery-interdependencies>`_

* `JSPkg <http://jspkg.com/packages/jquery-interdependencies/>`_

* `Bower <http://twitter.github.com/bower/>`_

* `Open Source Hacker <http://opensourcehacker.com/2012/11/19/create-complex-form-field-showing-and-hiding-rules-with-jquery-interdependencies-library/>`_

* `DailyJS <http://dailyjs.com/2012/11/20/jquery-roundup/>`_

Author
------

`Mikko Ohtamaa <http://opensourcehacker.com>`_ (`Twitter <http://twitter.com/moo9000>`_)

