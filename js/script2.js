
var viewModelPrototype = {
    firstName: 'Anon',
    lastName: 'Unk',
    birthDate: '',
    birthPlace: '',
    favNumber: 3,
    petName: 'Rex',
    sportsTeam: '',
    sportsPlayer: '',
    holiday: '',
    fullName: '',
    formArray: [
        this.firstName, 
        this.lastName,
        this.birthDate,
        this.birthPlace,
        this.favNumber,
        this.petName,
        this.sportsTeam,
        this.sportsPlayer,
        this.holiday,
        this.fullName
        ]
    }

// Survey data
function AppViewModel() {
    var self = this;

    this.firstName = ko.observable("").extend({ required: { message: 'Give us your first name!' } });
    this.lastName = ko.observable("").extend({ required: { message: 'Give us your last name!' } });
    this.birthDate = ko.observable("").extend({ required: true });
    this.birthPlace = ko.observable("").extend({ required: true });
    this.favNumber = ko.observable("").extend({ required: true });
    this.petName = ko.observable("").extend({ required: true });
    this.sportsTeam = ko.observable("").extend({ required: true });
    this.holiday = ko.observable("").extend({ required: true });
    this.fullName = ko.computed(function() {
        return this.firstName() + " " + this.lastName();    
    }, this);
    this.formArray = ko.computed(function() {
        return [
        this.firstName(), 
        this.lastName(),
        this.birthDate(),
        this.birthPlace(),
        this.favNumber(),
        this.petName(),
        this.sportsTeam(),
        this.holiday(),
        this.fullName() 
        ]
        }, this);

// Password combinations
    this.passCombo_1 =  ko.computed(function() {
        return this.petName() + "1";}, this);
    
    this.passCombo_2 =  ko.computed(function() {
        return this.lastName() + this.birthDate().substring(0,4); }, this);
    
    this.passCombo_3 =  ko.computed(function() {
        return this.firstName().toLowerCase() + this.birthDate().substring(5,7) + this.birthDate().substring(8,10) ; }, this);
    
    this.passCombo_4 =  ko.computed(function() {
        return this.sportsTeam() + this.birthDate().substring(0,4);}, this);
    
    this.passCombo_5 =  ko.computed(function() {
        return this.sportsTeam().replace(/\s/g, '').toLowerCase() + this.favNumber();}, this);
    
    this.passCombo_6 =  ko.computed(function() {
        return "password" + this.favNumber(); }, this);
    
    this.passCombo_7 =  ko.computed(function() {
        return this.holiday().replace(/\s/g, '').toLowerCase() + this.birthDate().substring(0,4);}, this);
    
    this.passCombo_8 =  ko.computed(function() {
        return this.birthPlace().replace(/\s/g, '').toLowerCase() + this.birthDate().substring(5,7) + this.birthDate().substring(8,10) ; }, this);

// Prepare passwords to go through URL
    this.passArray = ko.computed(function() {
        return [
        this.passCombo_1(), 
        this.passCombo_2(),
        this.passCombo_3(),
        this.passCombo_4(),
        this.passCombo_5(),
        this.passCombo_6(),
        this.passCombo_7(),
        this.passCombo_8()
        ]
        }, this);

// form validation 
    this.Errors = ko.validation.group(this);
    this.isValid = ko.computed(function () {
            return self.Errors().length == 0;
        });

// print validation
    (function() {
        checkIt = function() { 
            console.log('form validation is', self.isValid());
            if (!self.isValid()) {
                self.Errors.showAllMessages();
                    return;
            } else {
                showResults();
            }
        }
    })();
 }


// Activates knockout.js

AppViewModel.prototype = viewModelPrototype;

var formData = (new AppViewModel());
ko.applyBindings(formData);


// Complete Form
$("#submit").click(function(){
    // console.log(formData.passArray()); // 'passwords' that will be passed through

    var a = formData.fullName();
    var a1 = formData.firstName();
    var a2 = formData.lastName();
    var b = formData.passCombo_1();
    var c = formData.passCombo_2();
    var d = formData.passCombo_3();
    var e = formData.passCombo_4();
    var f = formData.passCombo_5();
    var g = formData.passCombo_6();
    var h = formData.passCombo_7();
    var i = formData.passCombo_8();

    console.log('ready to pass into url:', a, a1, a2, b , c, d, e, f, g, h, i );

    // add variables to URL string
    var string_url = "hacked.html?fullName=" + a 
        + "&firstName=" + a1
        + "&lastName=" + a2 
        + "&passCombo_1=" + b 
        + "&passCombo_2=" + c 
        + "&passCombo_3=" + d 
        + "&passCombo_4=" + e 
        + "&passCombo_5=" + f 
        + "&passCombo_6=" + g 
        + "&passCombo_7=" + h 
        + "&passCombo_8=" + i
        ;
     
    jumpToHack = function() {    // this is technically a bad idea << a hack that will hoist variable value to global scope
        window.location = string_url;
    }
    checkIt();

});



/* ----------------------------------
    GET VARIABLES from URL
------------------------------------- */

       // Read a page's GET URL variables and return them as an associative array.
            function getQueryVariable(variable) {
        var query = window.location.search.substring(1)
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=")
            if(pair[0] == variable){
       // added so that parameter value can include
       // space '%20' characters
                if(pair[1].indexOf('%20') != -1){

                    var fullName = pair[1].split('%20'),
                            fullParameter = ''

                    for(var i = 0; i < fullName.length; i++) {
                        fullParameter += fullName[i] + ' '

                        if (i == (fullName.length -1)) {
                            var newParameter = fullParameter.substr(0, fullParameter.length-1)
                            return newParameter
                        }
                    }
                }
                else {
                    return pair[1];
                }
            }
        }
        console.log('hello');
        return 0
    }


/* ----------------------------------
    STEP BETWEEN SECTION ANIMATIONS
------------------------------------- */

var current_section, next_section; //major page sections

$("#survey").hide();
$("#results").hide();

$("#startQuiz").click(function(){

    if(animating) return false;
    animating = true;
    
    current_section = $(this).parent().parent();
    next_section = $(this).parent().parent().next();

    current_section.animate({opacity: 0}, {
        step: function (now) {
            opacity = 1 - now;
    }, 
    duration: 800,
    complete: function(){
        current_section.hide();
        animating = false;
    },
    easing: 'easeInOutBack'
    });

next_section.show();

 });



// Show/Hide Survey and Results 

function showResults(){ 
    $("#survey").fadeOut(300);
    $("#footer").fadeOut(300); // temporary "processing" experience
    setTimeout( "(function() {$('#results').fadeIn(300)})();" , 1500);  
    setTimeout("jumpToHack()", 6000);

}


/* ----------------------------------
    MULTISTEP FORM ANIMATIONS
------------------------------------- */

//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

$(".next").click(function(){
    if(animating) return false;
    animating = true;
    
    current_fs = $(this).parent().parent();
    next_fs = $(this).parent().parent().next();
    
    //activate next step on progressbar using the index of next_fs
    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
    
    //show the next fieldset
    next_fs.show(); 
    //hide the current fieldset with style
    current_fs.animate({opacity: 0}, {
        step: function(now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale current_fs down to 80%
            scale = 1 - (1 - now) * 0.2;
            //2. bring next_fs from the right(50%)
            left = (now * 50)+"%";
            //3. increase opacity of next_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({'transform': 'scale('+scale+')'});
            next_fs.css({'left': left, 'opacity': opacity});
        }, 
        duration: 800, 
        complete: function(){
            current_fs.hide();
            animating = false;
        }, 
        //this comes from the custom easing plugin
        easing: 'easeInOutBack'
    });
});

$(".previous").click(function(){
    if(animating) return false;
    animating = true;
    
    current_fs = $(this).parent().parent();
    previous_fs = $(this).parent().parent().prev();
    
    //de-activate current step on progressbar
    $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
    
    //show the previous fieldset
    previous_fs.show(); 
    //hide the current fieldset with style
    current_fs.animate({opacity: 0}, {
        step: function(now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale previous_fs from 80% to 100%
            scale = 0.8 + (1 - now) * 0.2;
            //2. take current_fs to the right(50%) - from 0%
            left = ((1-now) * 50)+"%";
            //3. increase opacity of previous_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({'left': left});
            previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
        }, 
        duration: 800, 
        complete: function(){
            current_fs.hide();
            animating = false;
        }, 
        //this comes from the custom easing plugin
        easing: 'easeInOutBack'
    });
});

$(".submit").click(function(){
    return false;
})
