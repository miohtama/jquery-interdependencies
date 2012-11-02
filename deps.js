/*global console, window*/

(function($) {

    "use strict";

    /**
     * Microsoft helper
     *
     * @ignore
     */
    function log(msg) {
        if(console && console.log) {
            console.log(msg);
        }
    }

    /**
     * Sample configuration object which can be passed to {@link jQuery.deps#enable}
     *
     * @class Configuration
     */
    var configExample = {

        /**
         * @cfg show Callback function show(elem) for showing elements
         * @type {Function}
         */
        show : null,

        /**
         * @cfg hide Callback function hide(elem) for hiding elements
         * @type {Function}
         */
        hide : null,

        /**
         * @cfg log Write console.log() output of rule applying
         * @type {Boolean}
         */
        log : false
    };

    /**
     * Define one field inter-dependency rule.
     *
     * When condition is true then this input and all
     * its children rules' inputs are visible.
     *
     * Possible condition strings:
     *
     *  * **==**  Widget value must be equal to given value
     *
     *  * **any** Widget value must be any of the values in the given value array
     *
     *  * **non-any** Widget value must not be any of the values in the given value array
     *
     *  * **!=** Widget value must not be qual to given value
     *
     *  * **()** Call value as a function(context, controller, ourWidgetValue) and if it's true then the condition is true
     *
     *  * **null** This input does not have any sub-conditions
     *
     *
     *
     */
    function Rule(controller, condition, value) {
        this.init(controller, condition, value);
    }

    $.extend(Rule.prototype, {

        /**
         * @method constructor
         *
         * @param {String} controller     jQuery expression to match the `<input>`   source
         *
         * @param {String} condition What input value must be that {@link Rule the rule takes effective}.
         *
         * @param value Matching value of **controller** when widgets become visible
         *
         */
        init : function(controller, condition, value) {
            this.controller = controller;

            this.condition = condition;

            this.value = value;

            // Child rules
            this.rules = [];

            // Controls shown/hidden by this rule
            this.controls = [];
        },

        /**
         * Evaluation engine
         *
         * @param  {String} condition Any of given conditions in Rule class description
         * @param  {Object} val1      The base value we compare against
         * @param  {Object} val2      Something we got out of input
         * @return {Boolean}          true or false
         */
        evalCondition : function(control, context, condition, val1, val2) {

           if(this.condition == "==") {
                return val1 == val2;
            } else if(condition == "!=") {
                return val1 != val2;
            } else if(condition == "()") {
                return val1(context, control, val2);
            } else if(condition == "any") {
                return val1.indexOf(val2) >= 0;
            } else if(condition == "not-any") {
                return val1.indexOf(val2) < 0;
            } else {
                throw new Error("Unknown condition:" + condition);
            }

        },

        /**
         * Evaluate the condition of this rule in given jQuery context.
         *
         * The widget value is extracted using getControlValue()
         *
         * @param {jQuery} context The jQuery selection in which this rule is evaluated.
         *
         */
        checkCondition : function(context, cfg) {

            // We do not have condition set, we are always true
            if(!this.condition) {
                return true;
            }

            var control = context.find(this.controller);
            if(control.size() === 0 && cfg.log) {
                log("Evaling condition: Could not find controller input " + this.controller);
            }

            var val = this.getControlValue(context, control);
            if(cfg.log && val === undefined) {
                log("Evaling condition: Could not exctract value from input " + this.controller);
            }

            if(val === undefined) {
                return false;
            }

            val = this.normalizeValue(control, this.value, val);

            return this.evalCondition(context, this.control, this.condition, this.value, val);
        },

        /**
         * Make sure that what we read from input field is comparable against Javascript primitives
         *
         */
        normalizeValue : function(control, baseValue, val) {

            if(typeof baseValue == "number") {
                // Make sure we compare numbers against numbers
                return parseFloat(val);
            }

            return val;
        },

        /**
         * Read value from a diffent HTML controls.
         *
         * Handle, text, checkbox, select.
         *
         */
        getControlValue : function(context, control) {

            // Handle checkboxes
            if(control.attr("type") == "checkbox") {
                return control.is(":checked");
            }

            return control.val();
        },

        /**
         * Create a sub-rule.
         *
         * Example:
         *
         *      var masterSwitch = ruleset.createRule("#mechanicalThrombectomyDevice")
         *      var twoAttempts = masterSwitch.createRule("#numberOfAttempts", "==", 2);
         *
         * @return Rule instance
         */
        createRule : function(controller, condition, value) {
            var rule = new Rule(controller, condition, value);
            this.rules.push(rule);
            return rule;
        },

        /**
         * Include a control in this rule.
         *
         * @param  {String} input     jQuery expression to match the input within ruleset context
         */
        include : function(input) {
            this.controls.push(input);
        },

        /**
         * Apply this rule to all controls in the given context
         *
         * @param  {jQuery} context  jQuery selection within we operate
         * @param  {Object} cfg      Configuration object or empty object
         * @param  {Object} enforced Recursive rule enforcer: undefined to evaluate condition, true show always, false hide always
         *
         */
        applyRule : function(context, cfg, enforced) {

            var result;

            if(enforced === undefined) {
                result = this.checkCondition(context, cfg);
            } else {
                result = enforced;
            }

            if(cfg.log) {
                log("Applying rule on " + this.controller + "==" + this.value + " enforced:" + enforced + " result:" + result);
            }

            // Get show/hide callback functions

            var show = cfg.show || function(control) {
                control.show();
            };

            var hide = cfg.show || function(control) {
                control.hide();
            };


            // Resolve controls from ids to jQuery selections
            // we are controlling in this context
            var controls = $.map(this.controls, function(elem, idx) {
                return context.find(elem);
            });

            if(result) {

                $(controls).each(function() {
                    show(this);
                });

                // Evaluate all child rules
                $(this.rules).each(function() {
                    this.applyRule(context, cfg);
                });

            } else {

                $(controls).each(function() {
                    hide(this);
                });

                // Supress all child rules
                $(this.rules).each(function() {
                    this.applyRule(context, cfg, false);
                });
            }
        }
    });

    /**
     * A class which manages interdependenice rules.
     */
    function Ruleset() {

        // Hold a tree of rules
        this.rules = [];
    }

    $.extend(Ruleset.prototype, {

        /**
         * Add a new rule into this ruletset.
         *
         * See  {@link Rule} about the contstruction parameters.
         * @return {Rule}
         */
        createRule : function(controller, condition, value) {
            var rule = new Rule(controller, condition, value);
            this.rules.push(rule);
            return rule;
        },

        /**
         * Apply these rules on an element.
         *
         * @param context jQuery selection we are dealing with
         *
         * @param cfg Configuration object.
         */
        applyRules: function(context, cfg) {
            var i;

            if(cfg.log) {
                log("Starting evaluation ruleset of " + this.rules.length + " master rules");
            }

            for(i=0; i<this.rules.length; i++) {
                this.rules[i].applyRule(context, cfg);
            }
        },

        /**
         * Make this ruleset effective on the whole page.
         *
         * Set event handler on **window.document** to catch all input events
         * and apply those events to defined rules.
         */
        install : function(cfg) {
            $.deps.enable($(document), this, cfg);
        }


    });

    /**
     * jQuery interdependencie plug-in
     *
     * @class jQuery.deps
     *
     */
    var deps = {

        /**
         * Create a new Ruleset instance.
         *
         * Example:
         *
         *      $(document).ready(function() {
         *           // Start creating a new ruleset
         *           var ruleset = $.deps.createRuleset();
         *
         *
         * @return {Ruleset}
         */
        createRuleset : function() {
            return new Ruleset();
        },


        /**
         * Enable ruleset on a specific jQuery selection
         * @param  {Object} selection jQuery selection
         * @param  {Ruleset} ruleset
         * @param  {Configuration} cfg
         */
        enable : function(selection, ruleset, cfg) {

            cfg = cfg || {};

            var self = this;
            var val = selection.live("change", function() {
                ruleset.applyRules(selection, cfg);
            });

            ruleset.applyRules(selection, cfg);

            return val;
        }
    };

    $.deps = deps;

})(jQuery);