var side_dropbtn = 0;
$(document).ready(function(){
    $(window).scroll(function () {
            //if you hard code, then use console
            //.log to determine when you want the 
            //nav bar to stick.  
        if ($(window).scrollTop() > 50) {
            document.getElementById("nav").style.position = "fixed";
            document.getElementById("nav").style.top = "0";
            document.getElementById('nav-cart').style.display = 'inline';
            document.getElementById('nav-cart-resize').style.display = 'inline';
            // if(document.getElementById("side").style.width == "30%"){
            //     document.getElementById("nav").style.width = "70%";
            // }
            // else if(){
            //     document.getElementById("nav").style.width = "100%";
            // }
        }
        if ($(window).scrollTop() < 50) {
            document.getElementById("nav").style.position = "relative";
            document.getElementById("nav").style.height = "80px";
            document.getElementById('nav-cart').style.display = 'none';
            document.getElementById('nav-cart-resize').style.display = 'none';
            // if(document.getElementById("side").style.width == "30%"){
            //     document.getElementById("nav").style.width = "100%";
            // }
        }
        if ($(window).scrollTop() > 39) {
            document.getElementById("side").style.position = "fixed";
            document.getElementById("side").style.top = "0";
        }
        if ($(window).scrollTop() < 39) {
            document.getElementById("side").style.position = "absolute";
        }
    });
    var i = 0;
    $(window).resize(function(){
        // if(document.getElementById("nav").style.position == "fixed" || document.getElementById("side").style.width == "30%" || $('.icon-hamburger').css('display') === "none"){
        //     document.getElementById("main").style.width = "100%";
        //     document.getElementById("nav").style.width = "100%";
        //     document.getElementById("side").style.display = "none";
        // }
        // if($('.icon-hamburger').css('display') === "none"){
        //     document.getElementById('side').style.display = "none";
        //     document.getElementById('side').style.width = "0";
        //     document.getElementById('main').style.width = "100%";
        // }
        if(document.getElementById('side').style.display == "inline-block" || $('.icon-hamburger').css('display') === "none"){
            document.getElementById('side').style.display == "none";
            document.getElementsByTagName('body')[0].style.overflow = 'auto';
            i++;
        }
        if($('.icon-hamburger').css('display') === "none"){
            document.getElementById('side').style.display = "none";
            document.getElementById('nav').style.width = "100%";
            i++;
        }
        if($(window).width() <= '576'){
            $('.cart-logo').removeClass('fa-3x');
            $('.cart-logo').addClass('fa-2x');
        }
        else{
            $('.cart-logo').addClass('fa-3x');
        }

    });

    if($(window).width() <= '576'){
        $('.cart-logo').removeClass('fa-3x');
        $('.cart-logo').addClass('fa-2x');
    }
    else{
        $('.cart-logo').addClass('fa-3x');
    }
    

    $(".icon-hamburger").click(function(){
        if(i % 2 == 0){
            // $("#main").width("70%");
            // document.getElementById("main").style.display = "inline-block";
            // $("#side").width("30%");
            // $('#nav').width('70%');
            document.getElementsByTagName('body')[0].style.overflow = 'hidden';
            $('.icon-change').removeClass('fa-bars');
            $('.icon-change').addClass('fa-times');
            // document.getElementById("side").style.display = "inline-block";
            // $('#side').fadeIn(500);
            $('#side').slideToggle(1000);
            i++;
            if($(window).scrollTop() > 183){
                // document.getElementById("nav").style.width = "70%";
                // $('#nav').width('70%');
                // document.getElementById("side").style.display = "inline-block";
            }
            if(document.getElementById("nav").style.position == "fixed"){
                document.getElementById("side").style.display = "inline-block";
                // $('#nav').width('70%');
            }else if (document.getElementById("nav").style.position !== "fixed"){
                // document.getElementById("nav").style.width = "100%";
                
                document.getElementById("side").style.display = "inline-block";
            }
        }
        else{
            // $("#main").width("100%");
            document.getElementsByTagName('body')[0].style.overflow = 'auto';
            document.getElementById("main").style.display = "inline-block";
            document.getElementById('side-dropbtn').style.display = 'none';
            
            $('.icon-change').removeClass('fa-times');
            $('.icon-change').addClass('fa-bars');
            
            // $("#side").width("0");
            // document.getElementById("side").style.display = "none";
            // $('#side').fadeOut(500);
            $('#side').slideToggle(300);
            i++;
            document.getElementById('icon-hamburger').style.marginRight = "25px";
            if(document.getElementById("nav").style.width == "70%"){
                document.getElementById("nav").style.width = "100%";
            }
        }

    });
    $("#content").click(function(){
        if(document.getElementById("side").style.display == "inline-block"){
            // document.getElementById("side").style.width = "0";
            document.getElementById("side").style.display = "none";
            // document.getElementById("main").style.width = "100%"
            i++;
        }
    });

    // login
    $(function() {

        $('#login-form-link').click(function(e) {
            $("#login-form").delay(100).fadeIn(100);
            $("#register-form").fadeOut(100);
            $('#register-form-link').removeClass('active');
            $(this).addClass('active');
            e.preventDefault();
        });
        $('#register-form-link').click(function(e) {
            $("#register-form").delay(100).fadeIn(100);
            $("#login-form").fadeOut(100);
            $('#login-form-link').removeClass('active');
            $(this).addClass('active');
            e.preventDefault();
        });

    });
    //  end of login

    var drpbtn = 0;
    $('#drpbtn').click(function(){
        if(drpbtn % 2 == 0){
            // document.getElementById('navnav-drop').style.display = "block";
            document.getElementById('drpbtn').style.color = "grey";
            drpbtn++;
        }
        else{
            // document.getElementById('navnav-drop').style.display = "none";
            document.getElementById('drpbtn').style.color = "white";
            drpbtn++;
        }
    });
    
    $('#btndrop-side').click(function(){
        if(side_dropbtn % 2 == 0){
            // document.getElementById('side-dropbtn').style.display = 'block';
            $('#side-dropbtn').fadeIn(500);
            side_dropbtn++;
        }
        else{
            // document.getElementById('side-dropbtn').style.display = 'none';
            $('#side-dropbtn').fadeOut(500);
            side_dropbtn++;
        }
    })


    $('#drpbtn').mouseenter(function(){
       $('#navnav-drop').fadeIn(500);
       $('#navnav-drop').mouseenter(function(){
        document.getElementById('navnav-drop').style.display = "block";
       })
    })

    $('#nav').mouseleave(function(){
        $('#navnav-drop').fadeOut(100);
    })

    $('#nav-home').mouseenter(function(){
        $('#navnav-drop').fadeOut(300);
    })

    $('#nav-login').mouseenter(function(){
        $('#navnav-drop').fadeOut(300);
    })



    $('.container-fluid').click(function(){
        if(document.getElementById('side').style.width == '30%'){
            document.getElementById('side').style.width = '0';
            document.getElementById('side').style.display = 'none';
            document.getElementById('main').style.width = '100%';
            document.getElementById('nav').style.width = '100%';
            i++;
        }
    });

    var awal = 0,
    items = $('.slide div'),
    total = items.length;

    function geser() {
        var item = $('.slide div').eq(awal);
        items.hide();
        // item.css('display', 'block');
        item.show();
    }

    var autogeser = setInterval(function(){
        awal++;
        if( awal > total - 1) awal = 0;
        geser();
    }, 3000);

    $('.product-preview-click').click()

    var id_data = new Array();
    var cartAmount = $('#cart-amount').text();
    $('.cart-amount').html(localStorage.belanjaan);
    $.getJSON('/data/data.json', function(data) {
        $('#addToCart').click(function(){
            // id_data.push(localStorage.id_belanjaan);
            // localStorage.id_belanjaan = data[0].id_barang;
            // cartAmount = $('#cart-amount').text();
            // cartAmount*= 1;
            // $('.cart-amount').html(cartAmount + 1);
            // //- localStorage.belanjaan.id_barang = data.id_barang;
            // localStorage.belanjaan = cartAmount + 1;
            location.href = window.location.href;
        })
    })

    $(".Hello").click(function(){
        $.get("/", function(data, status){
            $('body').load(status);
        });
    });

    $('#removeLoginMessages').click(function(){
        $('.messages-info').removeClass();
        document.getElementsByClassName('messages')[0].style.display = 'none';
        $('.removeInLoginMessages').removeClass();
    })

    // $('#imgOption').mouseleave(function(){
    //     $('#imgText').hide();
    // })

    // $('#imgText').mouseenter(function(){
    //     $('#imgText').show();
    // })

    // $('#imgOption').mouseenter(function(){
    //     $('#imgText').show();
    // })

    // delete data in cart
    var delCart = $("#deleteDataInCart");
    deleteCart = function(id_barang){
        alert("hello" + id_barang)
        $.ajax({
            url: "/cart/" + id_barang,
            type: "POST",
            data: {id : id_barang},
            dataType: "html",
            success: function(html) { 
                location.reload();          
            }    
          });
          
        //   request.done(function(msg) {
        //     window.location.href = '/cart'
        //   });
          
        //   request.fail(function(jqXHR, textStatus) {
        //     alert( "Request failed: " + textStatus );
        //   });
    }

    // change profile photo
    $("#logo").css('display','none');
    
    $("#selectLogo").click(function(e){
       e.preventDefault();
       $("#logo").trigger('click');
    });

    $('#logo').on('change', function(){
        var date = new Date();
        var files = $(this).get(0).files;
    
        if (files.length > 0){
            var formData = new FormData();
            console.log("picture will updated")
            // loop through all the selected files
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                // add the files to formData object for the data payload
                formData.append('image', file, file.name);
            }
            console.log(file.name);
            $.ajax({
                url: '/upload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(data){
                    console.log('upload successful!');
                    console.log(data)
                    if(data === "File is not allowed"){
                        alert(data);
                    }
                    else{
                        location.reload();
                    }
                },
                error: function(xhr, status, error) {
                    
                }
            });
        }

    
    });

    
});