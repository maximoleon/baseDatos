$(function () {
    var TallerAvanzada = {};

    (function (app) {
        var facturas;

        app.init = function () {
            app.listarFacturas();
            app.bindings();
        };

        app.bindings = function () {

            $("#imprimir").on('click', function (event) {  //Evento para el Click del boton agregarFactura
                app.imprimir();
            });
            
            $("#imprimirFactura").on('click', function (event) {  //Evento para el Click del boton agregarFactura
                app.imprimirFactura();
            });

            $("#cuerpoTablaFactura").on('click', '.ver', function () {
                var i = $(this).attr("data-factura");
                $("#lblNroFactura").html(facturas[i]["nro_factura"]);
                $("#lblFecha").html(facturas[i]["fecha_factura"]);
                $("#lblcliente").html(facturas[i]["clienteCuil"] + " / " + facturas[i]["clienteNombre"]);
                $("#lblTipoFactura").html(facturas[i]["tipoFDesc"]);
                var total = 0;
                var html = "";
                $.each(facturas[i]["detalles"], function (clave, detalle) {
                    var subtotal = (parseInt(detalle.cantidad_detalleFactura) * parseFloat(detalle.precio_producto));                        

                    html += '<tr>' +
                        '<td>' + detalle.cantidad_detalleFactura + '</td>' +
                        '<td>' + detalle.cod_producto + '</td>' +
                        '<td>' + detalle.nombre_producto + '</td>' +
                        '<td>' + detalle.precio_producto + '</td>' +
                        '<td>' + subtotal + '</td>' +
                        '</tr>';
                    total += subtotal;
                });
                $("#cuerpoTablaDetalle").html(html);
                $("#total").html(total);
                $("#modalFactura").modal({show: true});
            });

            $("#formFactura").bootstrapValidator({
                excluded: [],
            });
        };

        app.acciones = function (datos) {
            if (datos == 1) {
                window.location = "../../";
            }
        };

        app.imprimir = function () {
            var aux = $("#tablaFactura").html();
            aux = aux.replace("<th>acciones</th>", "");
            var inicio = aux.indexOf("<td><a class", 0);
            while (inicio > 0) {
                var fin = aux.indexOf("</td>", inicio) + 5;
                var strBorrar = aux.substring(inicio, fin);
                aux = aux.replace(strBorrar, "");
                inicio = aux.indexOf("<td><a class", 0);
            }
            $("#html").val('<table border="1">' + aux + '</table>');
            $("#imprimirForm").submit();
        };
        
        app.imprimirFactura = function () {
            var aux = $("#cuerpoModal").html();
            $("#html").val(aux);
            $("#imprimirForm").submit();
        };

        app.listarFacturas = function () {
            //alert("Entre en buscarPersonas");
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&formulario=Factura";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                success: function (datos) {
                    app.acciones(datos);
                    console.log(datos);
                    facturas = datos;
                    app.rellenarTabla(datos);
                },
                error: function (datos) {
                    alert(datos.responseText);
                    console.log(datos);
                }
            });
        };

        app.calcularTotal = function (data) {
            //console.log(data);
            var total = 0;
            $.each(data, function (clave, detalle) {
                total += (parseInt(detalle.cantidad_detalleFactura) * parseFloat(detalle.precio_producto));
            });
            return total;
        };

        app.rellenarTabla = function (data) {
            //alert("Entre en rellenar tabla");
            var html = "";
            $.each(data, function (clave, factura) {
                html += '<tr>' +
                        '<td align="center">' + factura.nro_factura + '</td>' +
                        '<td align="center">' + factura.fecha_factura + '</td>' +
                        '<td align="center">' + factura.tipoFDesc + '</td>' +
                        '<td align="center">' + factura.clienteNombre + '</td>' +
                        '<td align="center">' + app.calcularTotal(factura.detalles) + '</td>' +
                        '<td>' +
                        '<a class="pull-left ver" data-factura="' + clave + '"><span class="glyphicon glyphicon-eye-open"></span>Ver</a>' +
                        '</td>' +
                        '</tr>';
            });
            $("#cuerpoTablaFactura").html(html);
        };

        app.init();

    })(TallerAvanzada);


});
