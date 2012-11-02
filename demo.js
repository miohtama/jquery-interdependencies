(function($) {

    "use strict";

    function buildRuleset() {

        // Start creating a new ruleset
        var ruleset = $.deps.createRuleset();

        var masterSwitch = ruleset.createRule("#mechanicalThrombectomyDevice",
            "not-any",
            ["--NOVALUE--", "noDevice", "notApplicable"]);

        // Make this controls to be slave for the master rule
        masterSwitch.include(".datagridwidget-block-dac");
        masterSwitch.include(".datagridwidget-block-numberOfAttempts");

        // Some sample pop-ups based on number input value

        var twoAttempts = masterSwitch.createRule("#numberOfAttempts", "==", 2);
        twoAttempts.include("#two-attempts-test");

        var threeAttempts = masterSwitch.createRule("#numberOfAttempts", "==", 3);
        threeAttempts.include("#three-attempts-test");

        // Some more selection dropdowns under master rule

        masterSwitch.include(".datagridwidget-block-balloonGuide");
        masterSwitch.include(".datagridwidget-block-aspirationInGuideDuringThrombectomy");
        masterSwitch.include(".datagridwidget-block-incubationOfDevice");
        masterSwitch.include(".datagridwidget-block-delayedReocclusion");
        masterSwitch.include(".datagridwidget-block-angioplasty");

        // Check that <select> value equals our choice "yes"
        var angioplasty = masterSwitch.createRule("#angioplasty", "==", "yes");
        angioplasty.include(".datagridwidget-block-angioplastyExtraCranial");
        angioplasty.include(".datagridwidget-block-angioplastyIntraCranial");

        // Another <select> with nested options
        masterSwitch.include(".datagridwidget-block-adjunctiveStenting");
        var adjunctiveStenting = masterSwitch.createRule("#adjunctiveStenting", "==", "yes");
        adjunctiveStenting.include(".datagridwidget-block-adjunctiveStentingExtraCranial");
        adjunctiveStenting.include(".datagridwidget-block-adjunctiveStentingIntraCranial");

        // Then add some third level options which check against checboxes
        var adjunctiveStentingExtraCranial = adjunctiveStenting.createRule("#adjunctiveStentingExtraCranial", "==", true);
        adjunctiveStentingExtraCranial.include(".datagridwidget-block-adjunctiveStentingExtraCranialType");

        var adjunctiveStentingIntraCranial = adjunctiveStenting.createRule("#adjunctiveStentingIntraCranial", "==", true);
        adjunctiveStentingIntraCranial.include(".datagridwidget-block-adjunctiveStentingIntraCranialType");


        return ruleset;
    }

    $(document).ready(function() {

        var ruleset = buildRuleset();

        var cfg = {
            log : true
        };

        // Make ruleset effective on a selection
        // and start following changes in its inputs
        $.deps.enable($("#demo-content"), ruleset, cfg);

    });

})(jQuery);