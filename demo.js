(function($) {

    "use strict";

    function buildRuleset() {

        // Start creating a new ruleset
        var ruleset = $.deps.createRuleset();

        var masterSwitch = ruleset.createRule("#mechanicalThrombectomyDevice", "!=", "--NOVALUE--");

        // Make this controls to be slave for the master rule
        masterSwitch.include("#dac");
        masterSwitch.include("#numberOfAttemps");

        // Some sample pop-ups based on number input value

        var twoAttempts = masterSwitch.createRule("#numberOfAttemps", "==", 2);
        twoAttempts.include("#two-attemps-test");

        var threeAttempts = masterSwitch.createRule("#numberOfAttemps", "==", 3);
        threeAttempts.include("#three-attempts-test");

        return ruleset;
    }

    $(document).ready(function() {

        var ruleset = buildRuleset();

        // Make ruleset effective on a selection
        // and start following changes in its inputs
        $.deps.enable($("#demo-content"), ruleset);

    });

})(jQuery);