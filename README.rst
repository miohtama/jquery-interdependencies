Introduction
---------------

**jQuery Interdependencies* is a jQuery plug-in to
manage HTML form field interdependencies.
It is a helper library for building complex conditional forms.

* Show and hide fields based on other field values

* Handle nested decision trees

* Handle list values and multi-value comparisons

* Based on jQuery, compatible down to version jQuery 1.4

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

::

    ADD HTML CODE HERE


::

    ADD JAVASCRIPT CODE HERE

Running the demo
----------------------

See the demo in the action ... OMG HERE IS NO URL YET ....

Running the demo (OSX poem)::

    git clone
    python -m SimpleHTTPServer
    open "http://localhost:8000"

Compiling docs
---------------

Install jsduck::

     \curl -L https://get.rvm.io | bash -s stable --ruby --gems=jsduck
     source /Users/mikko/.rvm/scripts/rvm

Build docs::

    source /Users/mikko/.rvm/scripts/rvm
    make

Author
------

`Mikko Ohtamaa <http://opensourcehacker.com>`_