(function($){
    $.fn.modalSteps = function(options){
        var $modal = this;

        var settings = $.extend({
            btnCancelHtml: 'Cancel',
            btnPreviousHtml: 'Previous',
            btnNextHtml: 'Next',
            btnLastStepHtml: 'Complete',
            disableNextButton: false,
            completeCallback: function(){}
        }, options);

        $modal
            .on('show.bs.modal', function(){
                var $modalFooter = $modal.find('.modal-footer'),
                    $btnCancel = $modalFooter.find('.js-btn-step[data-orientation=cancel]'),
                    $btnPrevious = $modalFooter.find('.js-btn-step[data-orientation=previous]'),
                    $btnNext = $modalFooter.find('.js-btn-step[data-orientation=next]'),
                    actualStep,
                    $actualStep,
                    titleStep,
                    $titleStepSpan,
                    nextStep;

                // Setting buttons
                $btnCancel.html(settings.btnCancelHtml);
                $btnPrevious.html(settings.btnPreviousHtml);
                $btnNext.html(settings.btnNextHtml);

                $actualStep = $('<input>').attr({
                    'type': 'hidden',
                    'id': 'actual-step',
                    'value': '1',
                });

                $modal.find('#actual-step').remove();
                $modal.append($actualStep);

                if (settings.disableNextButton){
                    $btnNext.attr('disabled', 'disabled');
                }
                $btnPrevious.attr('disabled', 'disabled');

                actualStep = 1;
                nextStep = actualStep + 1;

                $modal.find('[data-step=' + actualStep + ']').removeClass('hide');
                $btnNext.attr('data-step', nextStep);

                titleStep = $modal.find('[data-step=' + actualStep + ']').data('title');
                $titleStepSpan = $('<span>')
                                    .addClass('label label-success')
                                    .html(actualStep);

                $modal
                    .find('.js-title-step')
                    .append($titleStepSpan)
                    .append(' ' + titleStep);
            })
            .on('hidden.bs.modal', function(){
                var $actualStep = $modal.find('#actual-step'),
                    $btnNext = $modal.find('.js-btn-step[data-orientation=next]');

                $modal
                    .find('[data-step]')
                    .not($modal.find('.js-btn-step'))
                    .addClass('hide');

                $actualStep
                    .not($modal.find('.js-btn-step'))
                    .remove();

                $btnNext
                    .attr('data-step', 1)
                    .html(settings.btnNextHtml);

                $modal.find('.js-title-step').html('');
            });

        $modal.find('.js-btn-step').on('click', function(){
            var $btn = $(this),
                $actualStep = $modal.find('#actual-step'),
                $btnPrevious = $modal.find('.js-btn-step[data-orientation=previous]'),
                $btnNext = $modal.find('.js-btn-step[data-orientation=next]'),
                $title = $modal.find('.js-title-step'),
                orientation = $btn.data('orientation'),
                actualStep = parseInt($actualStep.val()),
                steps,
                nextStep,
                $nextStep,
                newTitle;

            steps = $modal.find('div[data-step]').length;

            // Callback on Complete
            if ($btn.attr('data-step') === 'complete'){
                settings.completeCallback();
                $modal.modal('hide');

                return;
            }

            // Check the orientation to make logical operations with actualStep/nextStep
            if (orientation === 'next'){
                nextStep = actualStep + 1;

                $btnPrevious.attr('data-step', actualStep);
                $actualStep.val(nextStep);

            } else if (orientation === 'previous'){
                nextStep = actualStep - 1;

                $btnNext.attr('data-step', actualStep);
                $btnPrevious.attr('data-step', nextStep - 1);

                $actualStep.val(actualStep - 1);

            } else {
                $modal.modal('hide');
                return;
            }

            if (parseInt($actualStep.val()) === steps){
                $btnNext
                    .attr('data-step', 'complete')
                    .html(settings.btnLastStepHtml);
            } else {
                $btnNext
                    .attr('data-step', nextStep)
                    .html(settings.btnNextHtml);
            }

            if (settings.disableNextButton){
                $btnNext.attr('disabled', 'disabled');
            }

            // Hide and Show steps
            $modal
                .find('[data-step=' + actualStep + ']')
                .not($modal.find('.js-btn-step'))
                .addClass('hide');

            $modal
                .find('[data-step=' + nextStep + ']')
                .not($modal.find('.js-btn-step'))
                .removeClass('hide');

            // Just a check for the class of previous button
            if (parseInt($btnPrevious.attr('data-step')) > 0 ){
                $btnPrevious.removeAttr('disabled');
            } else {
                $btnPrevious.attr('disabled', 'disabled');
            }

            if (orientation === 'previous'){
                $btnNext.removeAttr('disabled');
            }

            // Get the next step
            $nextStep = $modal.find('[data-step=' + nextStep + ']');

            // Verify if we need to unlock continue btn of the next step
            if ($nextStep.attr('data-unlock-continue')){
                $btnNext.removeAttr('disabled');
            }

            // Set the title of step
            newTitle = $nextStep.attr('data-title');
            var $titleStepSpan = $('<span>')
                                .addClass('label label-success')
                                .html(nextStep);

            $title
                .html($titleStepSpan)
                .append(' ' + newTitle);
        });
    };
}(jQuery));
