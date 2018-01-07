$(document).ready(function(){
    $('.ui.sidebar').sidebar('attach events', '.meny');
    $('.ui.styled.accordion').accordion();
    
    if(sessionStorage.admin == admin.userid) {
        curUID = sessionStorage.admin;
    } else window.location = 'index.html';
    
    $('#signout').click(function(){
        delete sessionStorage.admin;
        window.location = 'index.html';
    });
    
    if(localStorage.messages) messages = JSON.parse(localStorage.messages);
    if(typeof(showMessages) !== 'undefined') showMessages();
    
    if(localStorage.orders) orders = JSON.parse(localStorage.orders);

    if(localStorage.customers) {
        customers = JSON.parse(localStorage.customers);
        if(typeof(showCustomers) !== 'undefined') showCustomers();
        if(typeof(showEmails) !== 'undefined') showEmails();
        
    } else $.getJSON('http://farochmehri.wieg17.se/webshop/jsons/kunder.json', function(data) {
        customers = data; localStorage.customers = JSON.stringify(customers);
        if(typeof(showCustomers) !== 'undefined') showCustomers();
        if(typeof(showEmails) !== 'undefined') showEmails();
    });
    
    if(localStorage.products) {
        products = JSON.parse(localStorage.products);
        if(typeof(showOrders) !== 'undefined') showOrders();
        
    } else $.getJSON('http://farochmehri.wieg17.se/webshop/jsons/produkter.json', function(data){
        products = data; localStorage.products = JSON.stringify(products);
        if(typeof(showOrders) !== 'undefined') showOrders();
    });
});