/**
 * MTD form dynamics.
 *
 * Handle rules on MTD widget using jQuery Interdependencies.
 *
 * We have two rules
 *
 * - One for showing and hiding main MTD table widget
 *
 * - Each row of MTD widget is considered as ruleset of its own context
 *   and those rows can be added dynamically
 *
 */

/*global console*/

(function($) {

    "use strict";

    var _oldShow = $.fn.show;

    // Our little helper telling which asshole function triggered unwanted show() on our element
    // http://stackoverflow.com/questions/1225102/jquery-event-to-trigger-action-when-a-div-is-made-visible
    // $.fn.show = function(speed, oldCallback) {
    //     return $(this).each(function() {
    //         var
    //             obj         = $(this),
    //             newCallback = function() {
    //                 if ($.isFunction(oldCallback)) {
    //                     oldCallback.apply(obj);
    //                 }

    //                 obj.trigger('afterShow');
    //             };

    //         // you can trigger a before show if you want
    //         obj.trigger('beforeShow');

    //         // now use the old function to show the element passing the new callback
    //         _oldShow.apply(obj, [speed, newCallback]);
    //     });
    // };


    function log(msg) {
        if(console && console.log) {
            console.log(msg);
        }
    }

    /**
     * Generate datagridfield block jQuery class selection based on field name.
     *
     * Note that the same field will appear multiple times on the page.
     */
    function getDGFId(fname) {
        return ".datagridwidget-widget-" + fname;
    }

    /**
     * Update row counter numbers on MTD rows
     */
    function updateNumbers(field) {
        var dgf = field.find(".datagridwidget-table-view");

        function update() {
            var counter = 0; // <thead> has the first row
            dgf.find("tr").each(function() {

                var $this = $(this);
                if($this.find(".number").size() === 0) {
                    $this.append("<td class='number'>x</td>");
                }

                var number = $this.find(".number");
                number.text(counter + ".");

                counter++;
            });
        }

        // Update rows every time DGF is mixed
        dgf.bind("afteraddrow afteraddrowauto aftermoverow", function() {
            update();
        });

        // Initial update
        update();
    }

    // Create MTD dependencies rules
    // See Johan's XLS
    function buildRules() {

        // Start creating a new ruleset
        var ruleset = $.deps.createRuleset();

        var masterSwitch = ruleset.createRule(getDGFId("mechanicalThrombectomyDevice") + " select",
            "not-any",
            ["--NOVALUE--", "noDevice", "notApplicable"]);


        // Make this controls to be slave for the master rule
        masterSwitch.include(getDGFId("dac"));
        masterSwitch.include(getDGFId("numberOfAttempts"));

        // Some more selection dropdowns under master rule

        masterSwitch.include(getDGFId("balloonGuide"));
        masterSwitch.include(getDGFId("aspirationInGuideDuringThrombectomy"));
        masterSwitch.include(getDGFId("incubationOfDevice"));
        masterSwitch.include(getDGFId("delayedReocclusion"));
        masterSwitch.include(getDGFId("angioplasty"));

        // Check that <select> value equals our choice "yes"
        var angioplasty = masterSwitch.createRule(getDGFId("angioplasty") + " select", "==", "yes");
        angioplasty.include(getDGFId("angioplastyExtraCranial"));
        angioplasty.include(getDGFId("angioplastyIntraCranial"));

        // Another <select> with nested options
        masterSwitch.include(getDGFId("adjunctiveStenting"));
        var adjunctiveStenting = masterSwitch.createRule(getDGFId("adjunctiveStenting") + " select", "==", "yes");
        adjunctiveStenting.include(getDGFId("adjunctiveStentingExtraCranial"));
        adjunctiveStenting.include(getDGFId("adjunctiveStentingIntraCranial"));

        // Then add some third level options which check against checboxes
        var adjunctiveStentingExtraCranial = adjunctiveStenting.createRule(getDGFId("adjunctiveStentingExtraCranial") + " input", "==", true);
        adjunctiveStentingExtraCranial.include(getDGFId("adjunctiveStentingExtraCranialType"));

        var adjunctiveStentingIntraCranial = adjunctiveStenting.createRule(getDGFId("adjunctiveStentingIntraCranial") + " input", "==", true);
        adjunctiveStentingIntraCranial.include(getDGFId("adjunctiveStentingIntraCranialType"));

        masterSwitch.include(getDGFId("ticiScoreAfterThisDevice"));
        masterSwitch.include(getDGFId("wasSuccessful"));

        return ruleset;
    }

    /**
     * Create the rule to tell when DGF is shown or not for endovascularProcedures
     * @return {[type]} [description]
     */
    function installEndovascularProceduresApplicableRules() {
        var ruleset = $.deps.createRuleset();
        var masterSwitch = ruleset.createRule("select[name='thrombectomyVariables.widgets.thrombectomyVariables_endovascularProceduresApplicable:list']", "==", "yesSpecify");
        masterSwitch.include("#fieldname_mechanicalThrombectomyDevice");

        // fieldset-1 == Thrombectomry subgroup
        var context = $("#fieldset-1");
        var cfg = {log: true};

        // Install event handlers + do initial run
        $.deps.enable(context, ruleset, cfg);

    }

    /**
     * Set event handler to update MTD fields status for one device block every time something changes in the widget.
     */
    function followMTDRules(master, ruleset) {

        // Dynamically apply rules on any change happening inside the field
        master.bind("change.mtd", function(e) {

            log("Change event fired in MTD field");

            // Find the parent subform inside we are and where to apply the rules
            // based on the nearest matching parent from the event
            var subform = $(e.target).closest(".datagridwidget-block-edit-cell");
            if(subform.size() === 0) {
                throw new Error("Missed MTD device subblock for the event");
            }

            ruleset.applyRules(subform);


        });
    }

    /**
     * Apply the MTD rules for the first the page is opened
     */
    function initMTDRules(master, ruleset) {

        //  We need to handle each row separately in init
        master.find(".datagridwidget-block-edit-cell").each(function() {
            ruleset.applyRules($(this));
        });

    }

    function init() {

        // Master field containing all MTD rows
        var field = $("#formfield-thrombectomyVariables-widgets-thrombectomyVariables_mechanicalThrombectomyDevice");

        // Check if we have MTD field on the page
        // so we don't buid the complex ruleset unnecessarily
        if($("#fieldname_mechanicalThrombectomyDevice").size() > 0) {
            log("Initializing MTD field logic");
            var ruleset = buildRules();
            initMTDRules(field, ruleset);
            followMTDRules(field, ruleset);

            updateNumbers(field);

            // For this we have only one global field instance
            installEndovascularProceduresApplicableRules();
        }

    }

    $(document).bind("afterdatagridfieldinit", init);

})(jQuery);