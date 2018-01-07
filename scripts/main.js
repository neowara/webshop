var curUID = null;
var customers = [];
var products  = [];
$(document).ready(function(){
    if(sessionStorage.curUID) {
        curUID = sessionStorage.curUID;
        $('#signIO').html('<i class="sign out icon"></i><span>Logga ut</span>');
    } else $('#signIO').html('<i class="sign in icon"></i><span>Logga in</span>');
    
    $('#signIO').click(function(){
        if(curUID) {
            delete sessionStorage.curUID;
            window.location.reload();
        } else showSign();
    });
    
    var temp = 0;
    if(localStorage.cart) {
        var crt = JSON.parse(localStorage.cart);
        for(var key in crt) { temp += crt[key]; }
    }
    
    if(temp) {
        $('#kundvagn').prop('href', 'kundvagn.html');
        $('#kundvagn span').text('Kundvagn ('+temp+')');
    } else $('#kundvagn span').text('Kundvagn');
    
    $('.ui.sidebar').sidebar('attach events', '.meny');
    $('.ui.dropdown.link.item').dropdown({
        allowTab: false,
        selectOnKeydown: true,
        toggleSubMenusOn: 'click',
        action: 'nothing'
    });
    
    $.getJSON('http://farochmehri.wieg17.se/webshop/jsons/huvudkategorier.json', function(data) {
        var html = '';
        for(var value of data) {
            html += '<div id="tcat'+value.id+'" class="mcolumn"><a class="item header" href="produkter.html?catid=';
            html += value.id+'"><i class="'+value.icon+' icon"></i><span>'+value.name+'</span></a></div>';
        }
        $('.ui.dropdown.link.item .menu').html(html);
        
        $('.sidebar>.ul').append('<li><a class="ulink" href="index.html"><i class="home icon"></i><span>Hem</span></a></li>');
        for(var value of data) {
            html  = '<li><a class="ulink" href="produkter.html?catid='+value.id+'"><i class="'+value.icon+' icon"></i><span>';
            html += value.name+'</span></a><ul id="lcat'+value.id+'" class="ul"></li>';
            $('.sidebar>.ul').append(html);
        }
        $('.sidebar>.ul').append('<li><a class="ulink" href="konto.html"><i class="add user icon"></i><span>Skapa konto</span></a></a></li>');
        $('.sidebar>.ul').append('<li><a class="ulink" href="kontakt.html"><i class="linkify icon"></i><span>Kontakta oss</span></a></a></li>');
        $('.sidebar>.ul').append('<li><a class="ulink" href="omoss.html"><i class="info circle icon"></i><span>Om oss</span></a></a></li>');
        
        $.getJSON('http://farochmehri.wieg17.se/webshop/jsons/underkategorier.json', function(data){
            for(var value of data) {
                $('#tcat'+value.huvudkategori).append('<a class="item lm30" href="produkter.html?subid='+value.id+'">'+value.name+'</a>');
                $('#lcat'+value.huvudkategori).append('<li><a class="ulink" href="produkter.html?subid='+value.id+'">'+value.name+'</a></li>');                
            }
        });
    });
    
    if(localStorage.customers) {
        customers = JSON.parse(localStorage.customers);
        if(curUID) checkCustomer();
        if(typeof(initContact) !== 'undefined') initContact();
        if(typeof(initKonto) !== 'undefined') initKonto();
        
    } else $.getJSON('http://farochmehri.wieg17.se/webshop/jsons/kunder.json', function(data) {
        customers = data;
        if(curUID) checkCustomer();
        localStorage.customers = JSON.stringify(customers);
        if(typeof(initContact) !== 'undefined') initContact();
        if(typeof(initKonto) !== 'undefined') initKonto();
    });
    
    if(localStorage.products) {
        products = JSON.parse(localStorage.products);
        if(typeof(updateStart) !== 'undefined') updateStart();
        if(typeof(initJSONS) !== 'undefined') initJSONS();
        if(typeof(showCart) !== 'undefined') showCart();
        
    } else $.getJSON('http://farochmehri.wieg17.se/webshop/jsons/produkter.json', function(data){
        products = data;
        localStorage.products = JSON.stringify(products);
        if(typeof(updateStart) !== 'undefined') updateStart();
        if(typeof(initJSONS) !== 'undefined') initJSONS();
        if(typeof(initCart) !== 'undefined') showCart();
    });
});

var checkCustomer = function() {
    var temp = false;
    for(var value of customers) {
        if(curUID == value.email) { temp = true; break; }
    }
    if(!temp) {
        delete sessionStorage.curUID;
        window.location.reload();
    }
};

var addCart = function(prodID) {
    var cart = {}, temp;
    
    if(localStorage.cart) {
        temp = false;
        var cart = JSON.parse(localStorage.cart);
        for(var key in cart) { if(key == prodID) { cart[key]++; temp = true; break; } }
        if(!temp) cart[prodID] = 1;
    } else cart[prodID] = 1;
    localStorage.cart = JSON.stringify(cart);
    
    temp = 0;
    for(var key in cart) { temp += cart[key]; }
    if(temp) {
        $('#kundvagn').prop('href', 'kundvagn.html');
        $('#kundvagn span').text('Kundvagn ('+temp+')');
    } else {
        $('#kundvagn').removeProp('href');
        $('#kundvagn span').text('Kundvagn');
    }
    
    $('#kundvagn span').text(temp ? 'Kundvagn ('+temp+')' : 'Kundvagn');
};

var showSign = function() {
    $('.ui.modal').modal('hide'); $('.modals').remove(); var html = '';
    html += '<div class="ui mini modal"><i class="close icon"></i><div class="header">Logga in</div>';
    html += '<form id="loginForm" class="ui form error"><div class="content">';
    html += '<label>E-postadress</label><div class="ui left icon input field"><input name="email" type="text" placeholder="E-postadress"><i class="mail icon"></i></div>';
    html += '<label>Lösenord</label><div class="ui left icon input field"><input name="password" type="password" placeholder="Lösenord"><i class="lock icon"></i></div>';
    html += '</div></form><div class="actions">';
    html += '<div class="ui labeled icon approve button green"><i class="sign in icon"></i>Logga in</div></div>';
    html += '</div>'; $('body').append(html);
    $('.ui.mini.modal').modal({closable: false, onApprove: function(){ $('#loginForm').form('submit'); return false; }}).modal('show');
    $('#loginForm').form({
        fields:{
            password:{identifier:'password',rules:[{type:'regExp',value:/^[a-zA-Z0-9]{4,}$/i}]},
            email:{identifier:'email',rules:[{type:'regExp',value:/^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/i}]}
        },
        onSuccess: function(event, fields){
            event.preventDefault();
            for(var value of customers) {
                if((fields.email == value.email) && (fields.password == value.password)) {
                    sessionStorage.curUID = value.email;
                    window.location.reload();
                }
            }
            $("input[name=email], input[name=password]").parent("div").addClass("error");
        }
    });
};

var modalHTML = function(type, title, content) {
    $('.ui.modal').modal('hide'); $('.modals').remove();
    var html = '<div class="ui basic modal center"><div class="ui icon header">';
    if(type == 'error')        html += '<i class="red warning sign icon"></i>';
    else if(type == 'success') html += '<i class="green check square icon"></i>';
    else if(type == 'action')  html += '<i class="blue info circle icon"></i>';
    html += title + '</div><div class="content"><p>'+content+'</p></div>';
    html += '<div class="actions center"><div class="ui red basic cancel inverted button">';
    html += '<i class="remove icon"></i>';
    html += (type == 'action') ? 'Nej</div>' : 'Stäng</div>';
    if(type == 'action') html += '<div class="ui green ok inverted button"><i class="checkmark icon"></i>Ok</div>';
    html += '</div></div>'; $('body').append(html);    
};