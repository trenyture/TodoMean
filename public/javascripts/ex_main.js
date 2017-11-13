function changeStatus(button){
	$.ajax({
		url: '/api/tasks/'+$(button).data('which'),
		type: 'PUT',
		data: {
			status: $(button).siblings('select').val()
		},
		success: function(response){
			if (response === true){
				$('li#list-item-'+$(button).data('which')).find('a.statuts').html($(button).siblings('select').val());
				$('[data-toggle="popover"]').popover('hide');
			}else{
				alert('Il y a eu un problème lors du changement de statut de la Todo');
			}
		}
	});
	return false;
}

(function($){
	var app = {
		init: function(){
			if($('body').hasClass('index')){ app.index.init(); }
			if($('body').hasClass('ajout')){ app.ajout.init(); }
		}
	};

	app.index = {
		init:function(){
			$.ajax({
				url: '/api/tasks',
				type: 'GET',
				dataType: 'JSON',
				success: function (response){
					var liList = '';
					if (response.length < 1) {
						liList = '<li class="list-group-item  list-group-item-warning row">Il n\'y a pas de Todo pour le moment</li>';
					} else {
						for (var i = 0; i < response.length; i++) {
							liList += '<li class="list-group-item row" id="list-item-' + response[i]._id + '">'+
                            			'<span class="col-xs-12 col-sm-2">' + response[i]._id + '</span>'+
                            			'<span class="col-xs-12 col-sm-6">' + response[i].name + '</span>'+
                            			'<span class="col-xs-12 col-sm-2">'+
                                			'<a href="#" data-toggle="popover" class="statuts" data-whichlink="' + response[i]._id + '">' + response[i].status + '</a>'+
                            			'</span>'+
                            			'<span class="col-xs-12 col-sm-2">'+
                                			'<a class="btn btn-danger remove-todolist" href="#" data-which="' + response[i]._id + '"><i class="fa fa-times"></i></a>'+
                            			'</span>'+
                        			'</li>';
						}
					}
					$('ul.list-group').append(liList);
					app.index.construct();
				}
			});
		},
		construct: function(){
			$('[data-toggle="popover"]').popover({ 
			    html : true,
			    toggle: 'popover',
			    placement: 'bottom',
			    title: 'Change Status',
			    content: function() {
			    	return '<select class="form-control col-12" name="status" required><option value="" selected="true" disabled="true">Sélectionner un Status</option><option value="Brouillon">Brouillon</option><option value="En Attente">En Attente</option><option value="En Révision">En Révision</option><option value="Accepté">Accepté</option><option value="Refusé">Refusé</option></select><button type="button" data-which="' + $(this).data('whichlink') + '" onclick="changeStatus(this)" class="btn btn-primary">Changer</button>';
			    }

			});
			$('[data-toggle="popover"').on('click', function (e) {
			    $('[data-toggle="popover"').not(this).popover('hide');
			});

			$('form.change_status_form').submit(function(e){
				console.log($(this).find('select').val());
				e.preventDefault();
				return false;
			});

			$('a.remove-todolist').click(function(){
				console.log('test');
				var liParent = $(this).closest('li.list-group-item');
				$.ajax({
					url: '/api/tasks/'+$(this).data('which'),
					type: 'DELETE',
					success: function(response){
						if (response === true){
							console.log(liParent);
							$(liParent).fadeOut(400, function(){
								$(liParent).remove();
								if($('.list-group li').length<2){
									$('.list-group').append('<li class="list-group-item  list-group-item-warning row">Il n\'y a pas de Todo pour le moment</li>');
								}
							});
						}else{
							alert('Il y a eu un problème lors de la suppression de la Todo');
						}
					}
				});
				return false;
			});
		}
	};

	app.ajout = {
		init: function(){
			$('form#add_todo').submit(function(e){
				var send = true,
					message = '';
				if ($(this).find('#todo').val() == '') {
					send = false;
					message += '<li class="list-group-item list-group-item-danger">Veuillez renseigner une todo</li>';
				}
				if ($(this).find('#status').val() == '') {
					send = false;
					message += '<li class="list-group-item list-group-item-danger">Veuillez renseigner un statut</li>';
				}
				$('ul#errorForm').html(message);
				if (send === true) {
					$.ajax({
						type: $(this).attr('method'),
						url: $(this).attr('action'),
						data: {
							todo: $(this).find('#todo').val(),
							status: $(this).find('#status').val()
						},
						success: function (response) {
							if (response === true){
								$('ul#errorForm').html('<li class="list-group-item list-group-item-success">Votre Todo a Bien était enregistrée, vous allez être redirigé.</li>');
								window.setTimeout(function(){
							        window.location.href = "/";
							    }, 1000);
							} else {
								$('ul#errorForm').html('<li class="list-group-item list-group-item-danger">Il y a eu un problème lors de la sauvegarde de votre Todo</li>');
							}
						}
					});
				}
				e.preventDefault();
				return false;
			});
		}
	};

	$(document).ready(app.init);
})(jQuery);