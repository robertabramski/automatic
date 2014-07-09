$(document).ready(function() {
    $.ajax({
        url: 'https://api.automatic.com/v1/trips',
        type: 'GET',
        headers: {
            'Authorization': 'ba56eee32df6be1437768699247b406fc7d9992f',
        },
        success: function(data) {
            var trips = [], totals = {miles: 0, mpg: 0, trips: data.length};
            var meters = 0, mpg = 0;
            
            // Create data objects formatted for display.
            _.each(data, function(item) {
                var map = 'http://maps.googleapis.com/maps/api/staticmap?size=697x349&maptype=roadmap&size=mid';
                var markers = '', path = '';
                
                // Build Google static map API url parameters.
                markers += '&markers=color:0x00B2F6|label:A|' + item.start_location.lat + ',' + item.start_location.lon;
                markers += '&markers=color:0x00B2F6|label:B|' + item.end_location.lat + ',' + item.end_location.lon;
                path += '&path=color:0x00B2F6|weight:5|enc:' + item.path;
                
                trips.push({
                    hard: {
                        accels: item.hard_accels,
                        brakes: item.hard_brakes
                    },
                    over70: item.duration_over_70_s,
                    mpg: parseFloat(item.average_mpg).toFixed(1),
                    miles: parseFloat(item.distance_m / 1609.344).toFixed(1),
                    map: map + markers + path,
                    start: {
                        name: (item.start_location.display_name || item.start_location.name),
                        time: moment(item.start_time).format('h:mm A, ') + moment(item.start_time).from(moment())
                    },
                    end: {
                        name: (item.end_location.display_name || item.end_location.name),
                        time: moment(item.end_time).format('h:mm A, ') + moment(item.end_time).from(moment())
                    }
                });
                
                // Add up totals.
                meters += item.distance_m;
                mpg += item.average_mpg;
            });
            
            // Add trip markup to layout. 
            _.each(trips, function(trip) {
                $('.trips').append(_.template($('#trip').html(), trip));
            });
            
            // Format totals for display.
            totals.miles = parseFloat(meters / 1609.344).toFixed(1);
            totals.mpg = parseFloat(mpg / totals.trips).toFixed(1);
            
            // Add navigation to layout with totals.
            $('nav').html(_.template($('#nav').html(), totals));
        }
    });
});