(function($) {

    "use strict";

    /**
     * Define one field inter-dependency rule.
     *
     * When condition is true then this input and all
     * its children rules' inputs are visible.
     *
     * Possible conditions:
     *     "=="  Widget value must be equal to given value
     *     "!=" Widget value must not be qual to given value
     *     "()" Call value as a function(context, controller, ourWidgetValue) and if it's true then the condition is true
     *     null This input does not have any sub-conditions
     *
     * @param {String} controller     jQuery expression to match the input
     *
     * @param {String} condition What input value must be that the rule takes effective.
     *
     * @param value What value the condition must be to make controlled widgets visible
     *
     */
    function Rule(controller, condition, value) {
        this.controller = controller;

        this.condition = condition;

        this.value = value;

        // Child rules
        this.rules = [];

        // Controls shown/hidden by this rule
        this.controls = [];
    }

    $.extend(Rule.prototype, {

        /**
         * Evaluate the condition of this rule in given jQuery context.
         *
         * The widget value is extracted using getControlValue()
         *
         * @param {jQuery} context The jQuery selection in which this rule is evaluated.
         *
         */
        evalCondition : function(context) {

            // We do not have condition set, we are always true
            if(!this.condition) {
                return true;
            }

            var control = context.find(this.controller);

            var val = this.getControlValue(context, control);

            if(this.condition == "==") {
                return val == this.value;
            } else if(this.condition == "!=") {
                return val != this.value;
            } else if(this.condition == "()") {
                return this.value(context, this.control, val);
            } else {
                throw new Error("Unknown condition:" + this.condition);
            }
        },

        /**
         * Read value from a diffent HTML controls.
         *
         * Handle
         *
         * - text
         *
         * - checkbox
         *
         * - select
         *
         *
         */
        getControlValue : function(context, control) {
            return control.val();
        },

        /**
         * Create a sub-rule
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
         * @param  {Object} enforced Recursive rule enforcer: undefined to evaluate condition,
         *                           true show always,
         *                           false hide always
         *
         */
        applyRule : function(context, cfg, enforced) {

            var result;

            if(enforced === undefined) {
                result = this.evalCondition(context);
            } else {
                result = enforced;
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
            for(i=0; i<this.rules.length; i++) {
                this.rules[i].applyRule(context, cfg);
            }
        }


    });

    var deps = {

        createRuleset : function() {
            return new Ruleset();
        },

        apply : function(cfg) {
        },

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